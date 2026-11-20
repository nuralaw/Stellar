-- Stellar: every table at once. Paste the whole file into Supabase → SQL Editor → Run. Safe to re-run.
-- Same content as competition.sql + reports.sql + support.sql + user_data.sql + account_stats.sql + traffic.sql + subscriptions.sql + payments.sql + discounts.sql + sealed.sql.

-- ═══ competition.sql ═══
-- Weekly competition entries. Run once in the Supabase SQL editor.
-- The site's server talks to this table with the service-role key (SUPABASE_SERVICE_ROLE_KEY, server-only env var).
-- RLS is on with no policies, so the public anon key can't read or write it.

create table if not exists public.competition_entries (
  week          text    not null,            -- Monday of the week (UTC), "YYYY-MM-DD"
  round         text    not null check (round in ('rw', 'math')),
  user_id       text    not null,
  name          text    not null,
  avatar        text    not null default '',
  ids           text[]  not null,            -- question ids, in order
  started_at    bigint  not null,            -- Unix ms
  responses     jsonb   not null default '{}'::jsonb,
  saved_at      bigint,
  submitted_at  bigint,
  correct       jsonb,                       -- {"easy": n, "medium": n, "hard": n}
  base          integer,
  bonus         integer,
  score         integer,
  seconds       integer,
  annulled      boolean not null default false, -- left full screen mid-round: score 0, off the boards
  primary key (week, round, user_id)
);

create index if not exists competition_entries_board on public.competition_entries (week, score desc) where submitted_at is not null;

alter table public.competition_entries enable row level security;

-- Added 2026-11-11 (full-screen rule). Safe to re-run on an existing table.
alter table public.competition_entries add column if not exists annulled boolean not null default false;

-- ═══ reports.sql ═══
-- Problem reports on questions ("answer key is wrong", typos…). Run once in the Supabase SQL editor.
-- Written by the site's server with the service-role key; RLS on with no policies, so browsers can't read or write it.
-- Read them in the Supabase table editor, e.g. newest first, or grouped by qid.

create table if not exists public.question_reports (
  id          bigint generated always as identity primary key,
  qid         text        not null,           -- question id, e.g. "rw-0001"
  reason      text        not null check (reason in ('answer', 'explanation', 'typo', 'display', 'other')),
  note        text        not null default '',
  telegram    text        not null default '',  -- optional usernames, so we can reply
  instagram   text        not null default '',
  user_id     text,                           -- anonymous browser id, if sent
  created_at  timestamptz not null default now(),
  resolved    boolean     not null default false
);

create index if not exists question_reports_qid on public.question_reports (qid);

alter table public.question_reports enable row level security;

-- Added 2026-11-12, for a table created before then:
alter table public.question_reports add column if not exists telegram text not null default '';
alter table public.question_reports add column if not exists instagram text not null default '';

-- ═══ support.sql ═══
-- Support requests from the Home page's Support button. Run once in the Supabase SQL editor.
-- Written by the site's server with the service-role key; RLS on with no policies, so browsers can't read or write it.
-- Read them in the Supabase table editor (newest first); screenshots are in Storage → support-screenshots.

create table if not exists public.support_requests (
  id          text        primary key,        -- e.g. "2026-11-12-1a2b3c4d"
  telegram    text        not null default '',
  instagram   text        not null default '',
  other       text        not null default '',  -- WhatsApp, email…
  message     text        not null,
  screenshot  text,                           -- file name in the support-screenshots bucket
  user_id     text,                           -- anonymous browser id, if sent
  created_at  timestamptz not null default now(),
  -- your notes: was it a real bug (→ 50% off a subscription), did you reply
  bug_confirmed boolean   not null default false,
  resolved      boolean   not null default false
);

alter table public.support_requests enable row level security;

-- Private bucket for the screenshots (only the service-role key can read or write).
insert into storage.buckets (id, name, public) values ('support-screenshots', 'support-screenshots', false)
on conflict (id) do nothing;

-- ═══ user_data.sql ═══
-- Student progress synced from the browser (src/lib/sync.ts). One row per user per data key.
-- Keys: profile, bookmarks, tests, lessons, vocab, and attempts:YYYY-MM-DD (answers of one UTC day, so a push stays small).
-- The browser reads/writes its own rows with the publishable key; RLS keeps everyone else out. Safe to re-run.
create table if not exists public.user_data (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  key         text        not null,
  value       jsonb       not null,
  updated_at  timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.user_data drop constraint if exists user_data_key_check;
alter table public.user_data add constraint user_data_key_check
  check (key ~ '^(profile|bookmarks|tests|lessons|vocab|attempts:\d{4}-\d{2}-\d{2})$');
alter table public.user_data drop constraint if exists user_data_size_check;
alter table public.user_data add constraint user_data_size_check check (pg_column_size(value) < 1000000);

create index if not exists user_data_updated on public.user_data (user_id, updated_at);

-- updated_at is the server's clock on every insert/update (the sync pulls rows changed since its last pull).
create or replace function public.user_data_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists user_data_touch on public.user_data;
create trigger user_data_touch before insert or update on public.user_data for each row execute function public.user_data_touch();

alter table public.user_data enable row level security;

drop policy if exists "own rows: select" on public.user_data;
drop policy if exists "own rows: insert" on public.user_data;
drop policy if exists "own rows: update" on public.user_data;
drop policy if exists "own rows: delete" on public.user_data;
create policy "own rows: select" on public.user_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "own rows: insert" on public.user_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own rows: update" on public.user_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows: delete" on public.user_data for delete to authenticated using ((select auth.uid()) = user_id);

-- ═══ account_stats.sql ═══
-- Account statistics for /admin → Accounts: sign-ins and active days, recorded from Supabase Auth sessions.
-- (Supabase's own audit log is off, and sessions are deleted on sign-out, so we keep our own history.)
-- Only the site's server (service-role key) can read these; RLS on, no policies. Safe to re-run.

create table if not exists public.account_signins (
  id       bigint generated always as identity primary key,
  user_id  uuid        not null,
  at       timestamptz not null default now()
);
create index if not exists account_signins_at on public.account_signins (at);

-- One row per user per UTC day they used the site signed in (a sign-in or a token refresh that day).
create table if not exists public.account_activity (
  user_id  uuid        not null,
  day      date        not null,
  at       timestamptz not null default now(),  -- first activity that day
  primary key (user_id, day)
);
create index if not exists account_activity_at on public.account_activity (at);

alter table public.account_signins enable row level security;
alter table public.account_activity enable row level security;

-- New session = a sign-in; any session insert/refresh = active today. Never blocks sign-in if it fails.
create or replace function public.track_auth_session() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  begin
    if tg_op = 'INSERT' then
      insert into public.account_signins (user_id, at) values (new.user_id, coalesce(new.created_at, now()));
    end if;
    insert into public.account_activity (user_id, day, at)
    values (new.user_id, (now() at time zone 'utc')::date, now())
    on conflict (user_id, day) do nothing;
  exception when others then
    null;
  end;
  return new;
end $$;

drop trigger if exists track_auth_session on auth.sessions;
create trigger track_auth_session after insert or update on auth.sessions
  for each row execute function public.track_auth_session();

-- Backfill from the sessions that exist now (first run only adds what's missing).
insert into public.account_signins (user_id, at)
select s.user_id, s.created_at from auth.sessions s
where not exists (select 1 from public.account_signins a where a.user_id = s.user_id and a.at = s.created_at);
insert into public.account_activity (user_id, day, at)
select s.user_id, (coalesce(s.refreshed_at, s.updated_at, s.created_at) at time zone 'utc')::date, coalesce(s.refreshed_at, s.updated_at, s.created_at)
from auth.sessions s
on conflict (user_id, day) do nothing;

-- Stats for a period, bucketed by day | week | month in the admin's time zone.
-- Returns { series: [{t, signups, signins, active}], totals: {...}, previous: {...}, users_total }.
create or replace function public.admin_account_stats(p_from timestamptz, p_to timestamptz, p_bucket text, p_tz text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  span interval := p_to - p_from;
  result jsonb;
begin
  if p_bucket not in ('day', 'week', 'month') then raise exception 'bad bucket'; end if;
  with buckets as (
    select g as t
    from generate_series(
      date_trunc(p_bucket, p_from at time zone p_tz),
      date_trunc(p_bucket, (p_to - interval '1 second') at time zone p_tz),
      ('1 ' || p_bucket)::interval
    ) g
  ),
  su as (
    select date_trunc(p_bucket, u.created_at at time zone p_tz) t, count(*) n
    from auth.users u where u.created_at >= p_from and u.created_at < p_to and u.email_confirmed_at is not null group by 1
  ),
  si as (
    select date_trunc(p_bucket, s.at at time zone p_tz) t, count(*) n
    from public.account_signins s where s.at >= p_from and s.at < p_to group by 1
  ),
  ac as (
    select date_trunc(p_bucket, a.at at time zone p_tz) t, count(distinct a.user_id) n
    from public.account_activity a where a.at >= p_from and a.at < p_to group by 1
  )
  select jsonb_build_object(
    'series', coalesce((
      select jsonb_agg(jsonb_build_object(
        't', to_char(b.t, 'YYYY-MM-DD'),
        'signups', coalesce(su.n, 0),
        'signins', coalesce(si.n, 0),
        'active', coalesce(ac.n, 0)
      ) order by b.t)
      from buckets b
      left join su on su.t = b.t
      left join si on si.t = b.t
      left join ac on ac.t = b.t
    ), '[]'::jsonb),
    'totals', jsonb_build_object(
      'signups', (select count(*) from auth.users u where u.created_at >= p_from and u.created_at < p_to and u.email_confirmed_at is not null),
      'signins', (select count(*) from public.account_signins s where s.at >= p_from and s.at < p_to),
      'active', (select count(distinct a.user_id) from public.account_activity a where a.at >= p_from and a.at < p_to)
    ),
    'previous', jsonb_build_object(
      'signups', (select count(*) from auth.users u where u.created_at >= p_from - span and u.created_at < p_from and u.email_confirmed_at is not null),
      'signins', (select count(*) from public.account_signins s where s.at >= p_from - span and s.at < p_from),
      'active', (select count(distinct a.user_id) from public.account_activity a where a.at >= p_from - span and a.at < p_from)
    ),
    'users_total', (select count(*) from auth.users u where u.email_confirmed_at is not null)
  ) into result;
  return result;
end $$;

-- Latest accounts for the list under the chart (admin only). Only confirmed accounts (email code/link or Google):
-- signInWithOtp creates the user before the code is entered, so unfinished sign-ups are left out everywhere here.
create or replace function public.admin_account_list(p_limit int default 100)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(x order by x.last_sign_in_at desc nulls last), '[]'::jsonb)
  from (
    select u.id, u.email, u.created_at, u.last_sign_in_at,
           coalesce(u.raw_app_meta_data ->> 'provider', 'email') as provider,
           (select count(*) from public.account_activity a where a.user_id = u.id and a.at > now() - interval '30 days') as active_days_30
    from auth.users u
    where u.email_confirmed_at is not null
    order by u.last_sign_in_at desc nulls last
    limit least(greatest(p_limit, 1), 500)
  ) x;
$$;

revoke all on function public.admin_account_stats(timestamptz, timestamptz, text, text) from public, anon, authenticated;
revoke all on function public.admin_account_list(int) from public, anon, authenticated;
revoke all on function public.track_auth_session() from public, anon, authenticated;
grant execute on function public.admin_account_stats(timestamptz, timestamptz, text, text) to service_role;
grant execute on function public.admin_account_list(int) to service_role;

-- ═══ traffic.sql ═══
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

-- ═══ subscriptions.sql ═══
-- Stellar Plus subscriptions. One row per subscribed user. Run in the Supabase SQL editor. Safe to re-run.
-- Written only by the site's server with the service-role key (admin grants today, a payment provider later).
-- Signed-in students may read their own row; there are no insert/update/delete policies, so browsers can't change it.
create table if not exists public.subscriptions (
  user_id     uuid        primary key references auth.users (id) on delete cascade,
  plan        text        not null check (plan in ('plus')),
  expires_at  timestamptz,                      -- null = no end date
  source      text        not null default 'admin',  -- 'admin', 'payment', ...
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.subscriptions_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists subscriptions_touch on public.subscriptions;
create trigger subscriptions_touch before insert or update on public.subscriptions for each row execute function public.subscriptions_touch();

alter table public.subscriptions enable row level security;

drop policy if exists "own row: select" on public.subscriptions;
create policy "own row: select" on public.subscriptions for select to authenticated using ((select auth.uid()) = user_id);

-- ═══ payments.sql ═══
-- Stellar Plus payments (Gumroad): one row per sale, a log of every webhook call, and the revenue numbers for /admin → Revenue.
-- Needs supabase/subscriptions.sql first (the KPIs count active subscriptions). Safe to re-run.
-- Only the site's server (service-role key) can read or write these; RLS on, no policies.

create table if not exists public.purchases (
  sale_id         text        primary key,                       -- Gumroad's sale id (a repeated ping updates the same row)
  provider        text        not null default 'gumroad',
  user_id         uuid        references auth.users (id) on delete set null,
  email           text,
  plan            text        check (plan in ('monthly', 'pass')),  -- null = product not mapped to a plan
  product_id      text,
  product_name    text,
  price_cents     int         not null default 0,
  fee_cents       int         not null default 0,
  currency        text        not null default 'usd',
  subscription_id text,
  is_recurring    boolean     not null default false,            -- a renewal charge of a membership
  test            boolean     not null default false,            -- the seller bought their own product
  refunded        boolean     not null default false,
  disputed        boolean     not null default false,
  sale_at         timestamptz not null,
  access_until    timestamptz,                                   -- the Plus end date this sale granted
  raw             jsonb,                                         -- the ping minus the card (legacy rows; new ones are sealed, see sealed.sql)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists purchases_sale_at on public.purchases (sale_at);
create index if not exists purchases_user_id on public.purchases (user_id);
create index if not exists purchases_subscription_id on public.purchases (subscription_id);

create or replace function public.purchases_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists purchases_touch on public.purchases;
create trigger purchases_touch before insert or update on public.purchases for each row execute function public.purchases_touch();

-- Every call to the webhook (accepted or not), so a missing sale can be traced.
create table if not exists public.payment_events (
  id            bigint      generated always as identity primary key,
  provider      text        not null default 'gumroad',
  resource_name text,
  ref_id        text,
  verified      boolean     not null default false,
  note          text,
  payload       jsonb,
  at            timestamptz not null default now()
);
create index if not exists payment_events_at on public.payment_events (at);

-- Personal data (buyer email, the ping) is stored encrypted for the admin only (see sealed.sql); these columns hold the ciphertext.
alter table public.purchases add column if not exists sealed text;
alter table public.payment_events add column if not exists sealed text;

alter table public.purchases enable row level security;
alter table public.payment_events enable row level security;

-- The account with this email (case-insensitive), or null.
create or replace function public.admin_user_id_by_email(p_email text)
returns uuid language sql stable security definer set search_path = '' as $$
  select u.id from auth.users u where lower(u.email) = lower(p_email) order by u.created_at limit 1;
$$;

-- Revenue = sales with test = false, refunded = false, disputed = false. gross = price, net = price - fee (integer cents).
-- Totals for [p_from, p_to): { gross_cents, net_cents, sales, refunds }. Internal helper for the functions below.
create or replace function public.revenue_totals(p_from timestamptz, p_to timestamptz)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'gross_cents', coalesce(sum(p.price_cents) filter (where not p.refunded and not p.disputed), 0),
    'net_cents', coalesce(sum(p.price_cents - p.fee_cents) filter (where not p.refunded and not p.disputed), 0),
    'sales', count(*) filter (where not p.refunded and not p.disputed),
    'refunds', count(*) filter (where p.refunded or p.disputed)
  )
  from public.purchases p
  where not p.test and p.sale_at >= p_from and p.sale_at < p_to;
$$;

-- Revenue for a period, bucketed by day | week | month in the admin's time zone.
-- Returns { series: [{t, gross_cents, net_cents, sales, refunds}], totals: {...}, previous: {...}, by_plan: {monthly, pass, other: {gross_cents, sales}} }.
-- previous = the same-length period right before p_from. refunds = refunded or disputed sales (count) by sale date.
create or replace function public.admin_revenue_stats(p_from timestamptz, p_to timestamptz, p_bucket text, p_tz text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  span interval := p_to - p_from;
  result jsonb;
begin
  if p_bucket not in ('day', 'week', 'month') then raise exception 'bad bucket'; end if;
  with buckets as (
    select g as t
    from generate_series(
      date_trunc(p_bucket, p_from at time zone p_tz),
      date_trunc(p_bucket, (p_to - interval '1 second') at time zone p_tz),
      ('1 ' || p_bucket)::interval
    ) g
  ),
  agg as (
    select date_trunc(p_bucket, p.sale_at at time zone p_tz) t,
           coalesce(sum(p.price_cents) filter (where not p.refunded and not p.disputed), 0) gross,
           coalesce(sum(p.price_cents - p.fee_cents) filter (where not p.refunded and not p.disputed), 0) net,
           count(*) filter (where not p.refunded and not p.disputed) sales,
           count(*) filter (where p.refunded or p.disputed) refunds
    from public.purchases p
    where not p.test and p.sale_at >= p_from and p.sale_at < p_to
    group by 1
  ),
  plans as (
    select coalesce(p.plan, 'other') plan, sum(p.price_cents) gross, count(*) sales
    from public.purchases p
    where not p.test and not p.refunded and not p.disputed and p.sale_at >= p_from and p.sale_at < p_to
    group by 1
  )
  select jsonb_build_object(
    'series', coalesce((
      select jsonb_agg(jsonb_build_object(
        't', to_char(b.t, 'YYYY-MM-DD'),
        'gross_cents', coalesce(a.gross, 0),
        'net_cents', coalesce(a.net, 0),
        'sales', coalesce(a.sales, 0),
        'refunds', coalesce(a.refunds, 0)
      ) order by b.t)
      from buckets b
      left join agg a on a.t = b.t
    ), '[]'::jsonb),
    'totals', public.revenue_totals(p_from, p_to),
    'previous', public.revenue_totals(p_from - span, p_from),
    'by_plan', jsonb_build_object(
      'monthly', jsonb_build_object('gross_cents', coalesce((select gross from plans where plan = 'monthly'), 0), 'sales', coalesce((select sales from plans where plan = 'monthly'), 0)),
      'pass', jsonb_build_object('gross_cents', coalesce((select gross from plans where plan = 'pass'), 0), 'sales', coalesce((select sales from plans where plan = 'pass'), 0)),
      'other', jsonb_build_object('gross_cents', coalesce((select gross from plans where plan = 'other'), 0), 'sales', coalesce((select sales from plans where plan = 'other'), 0))
    )
  ) into result;
  return result;
end $$;

-- Headline numbers. Windows are in p_tz: today = since local midnight, yesterday = the day before, week = since Monday,
-- month = since the 1st; last_week / last_month = the same elapsed span one week / one month earlier.
-- rejected_7d = calls rejected for a missing or wrong signature (payment_events notes starting 'sig:') in the last 7 days.
-- Returns { today, yesterday, week, last_week, month, last_month, all_time: {gross_cents, net_cents, sales},
--           active_plus, active_monthly, active_pass, unlinked_sales, rejected_7d, last_sale_at, currency }.
-- plpgsql (not sql) so this file can be created before subscriptions.sql has been run.
create or replace function public.admin_revenue_kpis(p_tz text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  now_l timestamp := now() at time zone p_tz;
  day_s timestamptz := date_trunc('day', now_l) at time zone p_tz;
  yday_s timestamptz := (date_trunc('day', now_l) - interval '1 day') at time zone p_tz;
  week_s timestamptz := date_trunc('week', now_l) at time zone p_tz;
  lweek_s timestamptz := (date_trunc('week', now_l) - interval '1 week') at time zone p_tz;
  lweek_e timestamptz := (now_l - interval '1 week') at time zone p_tz;
  month_s timestamptz := date_trunc('month', now_l) at time zone p_tz;
  lmonth_s timestamptz := (date_trunc('month', now_l) - interval '1 month') at time zone p_tz;
  lmonth_e timestamptz := (now_l - interval '1 month') at time zone p_tz;
  n timestamptz := now();
  a_plus int; a_monthly int; a_pass int;
begin
  select count(*),
         count(*) filter (where lp.plan = 'monthly'),
         count(*) filter (where lp.plan = 'pass')
    into a_plus, a_monthly, a_pass
  from public.subscriptions s
  left join lateral (
    select p.plan from public.purchases p
    where p.user_id = s.user_id and p.provider = 'gumroad' and not p.test and not p.refunded and not p.disputed
    order by p.sale_at desc limit 1
  ) lp on true
  where s.expires_at is null or s.expires_at > n;

  return jsonb_build_object(
    'today', public.revenue_totals(day_s, 'infinity') - 'refunds',
    'yesterday', public.revenue_totals(yday_s, day_s) - 'refunds',
    'week', public.revenue_totals(week_s, 'infinity') - 'refunds',
    'last_week', public.revenue_totals(lweek_s, lweek_e) - 'refunds',
    'month', public.revenue_totals(month_s, 'infinity') - 'refunds',
    'last_month', public.revenue_totals(lmonth_s, lmonth_e) - 'refunds',
    'all_time', public.revenue_totals('-infinity', 'infinity') - 'refunds',
    'active_plus', a_plus,
    'active_monthly', a_monthly,
    'active_pass', a_pass,
    'unlinked_sales', (select count(*) from public.purchases p where p.provider = 'gumroad' and not p.test and p.user_id is null),
    'rejected_7d', (select count(*) from public.payment_events e where not e.verified and e.note like 'sig:%' and e.at > n - interval '7 days'),
    'last_sale_at', (select max(p.sale_at) from public.purchases p where p.provider = 'gumroad' and not p.test),
    'currency', coalesce((select p.currency from public.purchases p where p.provider = 'gumroad' group by p.currency order by count(*) desc, p.currency limit 1), 'usd')
  );
end $$;

-- Latest purchases for the list under the chart (admin only). Test sales are included and flagged; the synthetic 'admin:<uid>' rows
-- (provider 'admin', see extendPlus in lib/access-server.ts) are left out, here and in every count above.
create or replace function public.admin_recent_purchases(p_limit int default 50)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(x order by x.sale_at desc), '[]'::jsonb)
  from (
    select p.sale_id, p.sale_at, p.email, p.sealed, p.user_id, p.plan, p.product_name, p.price_cents, p.fee_cents, p.currency,
           p.is_recurring, p.test, p.refunded, p.disputed
    from public.purchases p
    where p.provider = 'gumroad'
    order by p.sale_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
  ) x;
$$;

revoke all on function public.admin_user_id_by_email(text) from public, anon, authenticated;
revoke all on function public.revenue_totals(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_revenue_stats(timestamptz, timestamptz, text, text) from public, anon, authenticated;
revoke all on function public.admin_revenue_kpis(text) from public, anon, authenticated;
revoke all on function public.admin_recent_purchases(int) from public, anon, authenticated;
revoke all on function public.purchases_touch() from public, anon, authenticated;
grant execute on function public.admin_user_id_by_email(text) to service_role;
grant execute on function public.admin_revenue_stats(timestamptz, timestamptz, text, text) to service_role;
grant execute on function public.admin_revenue_kpis(text) to service_role;
grant execute on function public.admin_recent_purchases(int) to service_role;

-- ═══ discounts.sql ═══
-- Personal discounts: "50% off the first month of Monthly" for a student whose bug report was confirmed (or given by hand in
-- /admin → Accounts). Run in the Supabase SQL editor. Safe to re-run.
-- One row per discount. An OPEN one (not used, not revoked) is put into that student's checkout link on /plus as the shared
-- Gumroad code GUMROAD_BUG_CODE; the sale webhook closes it (used_at, sale_id). See docs/PAYMENTS.md → Bug-report discounts.
-- Written and read only by the site's server with the service-role key; RLS on, no policies, so browsers can't touch it.
create table if not exists public.discounts (
  id          bigint      generated always as identity primary key,
  user_id     uuid        not null,
  percent     int         not null check (percent between 1 and 100),
  source      text        not null check (source in ('bug', 'admin')),
  support_id  text        unique,               -- the support request that earned it (null for a hand-made one)
  note        text,
  created_at  timestamptz not null default now(),
  used_at     timestamptz,                      -- set when the Gumroad sale with the code arrives
  sale_id     text,                             -- that sale
  revoked_at  timestamptz
);

-- At most one open discount per student (no stacking).
create unique index if not exists discounts_one_open_per_user on public.discounts (user_id) where used_at is null and revoked_at is null;

alter table public.discounts enable row level security;

-- ═══ sealed.sql ═══
-- Admin-only encryption of personal data. Run after support.sql, reports.sql and payments.sql (npm run db:apply -- supabase/sealed.sql). Safe to re-run.
-- The site's server seals contacts, messages, notes, buyer emails and ping payloads with the admin's PUBLIC key (ADMIN_SEAL_PUBLIC_KEY) and
-- stores the ciphertext in `sealed`; the plain columns stay empty for new rows. Only the admin's browser holds the private key.
-- Rows written before this are encrypted in place by `npm run data:seal`.

alter table public.support_requests add column if not exists sealed text;
alter table public.support_requests alter column message drop not null;  -- new rows keep '' here; the text is in `sealed`
alter table public.question_reports add column if not exists sealed text;
alter table public.purchases add column if not exists sealed text;
alter table public.payment_events add column if not exists sealed text;

-- Latest purchases for /admin -> Revenue: `sealed` carries the buyer's email for new rows (the admin's browser opens it); `email` is only filled for old rows.
create or replace function public.admin_recent_purchases(p_limit int default 50)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(x order by x.sale_at desc), '[]'::jsonb)
  from (
    select p.sale_id, p.sale_at, p.email, p.sealed, p.user_id, p.plan, p.product_name, p.price_cents, p.fee_cents, p.currency,
           p.is_recurring, p.test, p.refunded, p.disputed
    from public.purchases p
    where p.provider = 'gumroad'
    order by p.sale_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
  ) x;
$$;

revoke all on function public.admin_recent_purchases(int) from public, anon, authenticated;
grant execute on function public.admin_recent_purchases(int) to service_role;
