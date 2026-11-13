-- Site traffic for /admin → Traffic: our own anonymous page-view counter (no cookies banner needed, nothing personal).
-- One row per page view: an anonymous browser id, the path, the referring host and the country (from Vercel's header).
-- Never stored: IPs, user agents, emails, account ids. Written by /api/track, read by /api/admin/traffic.
-- Only the site's server (service-role key) can read or write these; RLS on, no policies. Safe to re-run.

create table if not exists public.page_views (
  id        bigint generated always as identity primary key,
  at        timestamptz not null default now(),
  visitor   text        not null check (char_length(visitor) between 1 and 64),  -- anonymous browser id
  path      text        not null check (char_length(path) between 1 and 200),    -- pathname only, e.g. "/practice"
  referrer  text        check (char_length(referrer) <= 100),                    -- host only, e.g. "google.com"; null = direct
  country   text        check (country ~ '^[A-Z]{2}$')                           -- ISO 3166-1 alpha-2; null = unknown
);
create index if not exists page_views_at on public.page_views (at);

-- Raw rows are kept 90 days. Older whole (UTC) days are rolled up here, then deleted.
-- dim says which breakdown a row belongs to (the other columns are null on that row):
--   'all'      → the day's totals
--   'path'     → per path
--   'referrer' → per referring host (referrer null = direct)
--   'country'  → per country (country null = unknown)
-- visitors = unique visitors within that day and breakdown. Over several days these are SUMMED, so a visitor who came
-- on 3 days counts 3 times: an approximation that only applies to ranges older than 90 days (raw rows count exactly).
create table if not exists public.page_views_daily (
  day        date    not null,                  -- UTC day
  dim        text    not null check (dim in ('all', 'path', 'referrer', 'country')),
  path       text,
  referrer   text,
  country    text,
  visitors   integer not null default 0,
  pageviews  integer not null default 0,
  constraint page_views_daily_key unique nulls not distinct (day, dim, path, referrer, country)
);

alter table public.page_views enable row level security;
alter table public.page_views_daily enable row level security;

-- Moves every raw row older than 90 whole UTC days into page_views_daily (in one statement) and returns how many moved.
create or replace function public.traffic_rollup() returns integer
language plpgsql security definer set search_path = '' as $$
declare
  cutoff timestamptz := (date_trunc('day', now() at time zone 'UTC') - interval '90 days') at time zone 'UTC';
  moved integer;
begin
  with gone as (
    delete from public.page_views v where v.at < cutoff
    returning (v.at at time zone 'UTC')::date as d, v.visitor, v.path, v.referrer, v.country
  ),
  agg as (
    select g.d,
      case grouping(g.path, g.referrer, g.country) when 7 then 'all' when 3 then 'path' when 5 then 'referrer' else 'country' end as dim,
      g.path, g.referrer, g.country,
      count(distinct g.visitor)::int as visitors, count(*)::int as pageviews
    from gone g
    group by grouping sets ((g.d), (g.d, g.path), (g.d, g.referrer), (g.d, g.country))
  ),
  ins as (
    insert into public.page_views_daily (day, dim, path, referrer, country, visitors, pageviews)
    select a.d, a.dim, a.path, a.referrer, a.country, a.visitors, a.pageviews from agg a
    on conflict on constraint page_views_daily_key do update
      set visitors = public.page_views_daily.visitors + excluded.visitors,
          pageviews = public.page_views_daily.pageviews + excluded.pageviews
    returning 1
  )
  select count(*) into moved from gone;
  return moved;
end $$;

-- Run the rollup every night with pg_cron (enabled here if this project has it; nothing breaks if it doesn't —
-- then call `select public.traffic_rollup();` now and then, rows just stay raw until you do).
do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule('traffic-rollup', '17 0 * * *', 'select public.traffic_rollup()');
exception when others then
  raise notice 'pg_cron unavailable (%): run select public.traffic_rollup() daily some other way.', sqlerrm;
end $$;

-- Unique visitors and page views in [p_from, p_to): raw rows exactly, plus rolled-up days (summed per-day uniques).
create or replace function public.traffic_totals(p_from timestamptz, p_to timestamptz)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'visitors',
      (select count(distinct v.visitor) from public.page_views v where v.at >= p_from and v.at < p_to)
      + (select coalesce(sum(d.visitors), 0) from public.page_views_daily d
         where d.dim = 'all' and d.day::timestamp at time zone 'UTC' >= p_from and d.day::timestamp at time zone 'UTC' < p_to),
    'pageviews',
      (select count(*) from public.page_views v where v.at >= p_from and v.at < p_to)
      + (select coalesce(sum(d.pageviews), 0) from public.page_views_daily d
         where d.dim = 'all' and d.day::timestamp at time zone 'UTC' >= p_from and d.day::timestamp at time zone 'UTC' < p_to)
  );
$$;

-- Stats for a period, bucketed by day | week | month in the admin's time zone (rolled-up days are bucketed by their UTC day).
-- Returns { series: [{t, visitors, pageviews}], totals, previous, pages, referrers, countries } — TrafficStats in
-- src/lib/traffic-types.ts minus source/bucket. Top lists: 10 rows each, most visitors first.
create or replace function public.admin_traffic_stats(p_from timestamptz, p_to timestamptz, p_bucket text, p_tz text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  span interval := p_to - p_from;
  result jsonb;
begin
  if p_bucket not in ('day', 'week', 'month') then raise exception 'bad bucket'; end if;
  with raw as (
    select v.at, v.visitor, v.path, v.referrer, v.country
    from public.page_views v where v.at >= p_from and v.at < p_to
  ),
  old as (
    select d.day::timestamp at time zone 'UTC' as at, d.dim, d.path, d.referrer, d.country, d.visitors, d.pageviews
    from public.page_views_daily d
    where d.day::timestamp at time zone 'UTC' >= p_from and d.day::timestamp at time zone 'UTC' < p_to
  ),
  buckets as (
    select g as t
    from generate_series(
      date_trunc(p_bucket, p_from at time zone p_tz),
      date_trunc(p_bucket, (p_to - interval '1 second') at time zone p_tz),
      ('1 ' || p_bucket)::interval
    ) g
  ),
  per_bucket as (
    select x.t, sum(x.visitors)::bigint as visitors, sum(x.pageviews)::bigint as pageviews
    from (
      select date_trunc(p_bucket, r.at at time zone p_tz) as t, count(distinct r.visitor) as visitors, count(*) as pageviews
      from raw r group by 1
      union all
      select date_trunc(p_bucket, o.at at time zone p_tz), o.visitors, o.pageviews from old o where o.dim = 'all'
    ) x group by x.t
  ),
  tops as (
    select x.kind, x.name, sum(x.visitors)::bigint as visitors, sum(x.pageviews)::bigint as pageviews
    from (
      select 'page' as kind, r.path as name, count(distinct r.visitor) as visitors, count(*) as pageviews from raw r group by 2
      union all
      select 'page', o.path, o.visitors, o.pageviews from old o where o.dim = 'path'
      union all
      select 'referrer', coalesce(r.referrer, 'Direct'), count(distinct r.visitor), count(*) from raw r group by 2
      union all
      select 'referrer', coalesce(o.referrer, 'Direct'), o.visitors, o.pageviews from old o where o.dim = 'referrer'
      union all
      select 'country', coalesce(r.country, 'Unknown'), count(distinct r.visitor), count(*) from raw r group by 2
      union all
      select 'country', coalesce(o.country, 'Unknown'), o.visitors, o.pageviews from old o where o.dim = 'country'
    ) x group by x.kind, x.name
  ),
  ranked as (
    select t.*, row_number() over (partition by t.kind order by t.visitors desc, t.pageviews desc, t.name) as n from tops t
  )
  select jsonb_build_object(
    'series', coalesce((
      select jsonb_agg(jsonb_build_object(
        't', to_char(b.t, 'YYYY-MM-DD'),
        'visitors', coalesce(p.visitors, 0),
        'pageviews', coalesce(p.pageviews, 0)
      ) order by b.t)
      from buckets b left join per_bucket p on p.t = b.t
    ), '[]'::jsonb),
    'totals', public.traffic_totals(p_from, p_to),
    'previous', public.traffic_totals(p_from - span, p_from),
    'pages', coalesce((select jsonb_agg(jsonb_build_object('name', r.name, 'visitors', r.visitors, 'pageviews', r.pageviews) order by r.n)
                       from ranked r where r.kind = 'page' and r.n <= 10), '[]'::jsonb),
    'referrers', coalesce((select jsonb_agg(jsonb_build_object('name', r.name, 'visitors', r.visitors, 'pageviews', r.pageviews) order by r.n)
                           from ranked r where r.kind = 'referrer' and r.n <= 10), '[]'::jsonb),
    'countries', coalesce((select jsonb_agg(jsonb_build_object('name', r.name, 'visitors', r.visitors, 'pageviews', r.pageviews) order by r.n)
                           from ranked r where r.kind = 'country' and r.n <= 10), '[]'::jsonb)
  ) into result;
  return result;
end $$;

revoke all on function public.traffic_rollup() from public, anon, authenticated;
revoke all on function public.traffic_totals(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_traffic_stats(timestamptz, timestamptz, text, text) from public, anon, authenticated;
grant execute on function public.admin_traffic_stats(timestamptz, timestamptz, text, text) to service_role;
