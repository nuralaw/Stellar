-- Stellar: every table at once. Paste the whole file into Supabase → SQL Editor → Run. Safe to re-run.
-- Same content as competition.sql + reports.sql + support.sql + user_data.sql + account_stats.sql + traffic.sql + subscriptions.sql + payments.sql + discounts.sql + sealed.sql + elo.sql + elo-admin.sql.

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

-- ═══ elo.sql ═══
-- Stellar ranked matches (ELO): players, matches, per-question answers, rating history, season results, and the SQL twins of the
-- formulas in src/lib/elo.ts (see docs/ELO.md sections 3-8). Safe to re-run. Needs nothing but Supabase Auth.
-- Only the site's server (service-role key) can read or write these: RLS on with no policies, functions executable by service_role only.
-- After applying, run supabase/elo-check.sql in the SQL Editor to verify the formulas.

create table if not exists public.elo_players (
  user_id        uuid        primary key references auth.users (id) on delete cascade,
  rating         int         not null default 1000 check (rating >= 100),
  peak           int         not null default 1000,
  matches        int         not null default 0,            -- finished matches only
  wins           int         not null default 0,
  losses         int         not null default 0,
  draws          int         not null default 0,
  name           text        not null default '',           -- public name (copied from the profile when the player starts a match)
  avatar         text        not null default '',           -- public avatar: an emoji or a small data: image
  updated_at     timestamptz not null default now()         -- last rating change (leaderboard tie-break: who got there first)
);

create table if not exists public.elo_matches (
  id              uuid        primary key default gen_random_uuid(),
  mode            text        not null default 'mixed' check (mode in ('mixed', 'rw', 'math')),
  status          text        not null check (status in ('playing_a', 'waiting', 'playing_b', 'finished', 'expired', 'void')),
  player_a        uuid        not null references auth.users (id) on delete cascade,
  player_b        uuid        references auth.users (id) on delete set null,
  question_ids    text[]      not null check (cardinality(question_ids) = 10),   -- exactly 10, fixed order
  created_at      timestamptz not null default now(),
  a_finished_at   timestamptz,
  b_started_at    timestamptz,
  finished_at     timestamptz,
  expires_at      timestamptz,                              -- a_finished_at + 48 h
  points_a        int,
  points_b        int,
  forfeit         text        check (forfeit in ('a', 'b')),
  result          text        check (result in ('a', 'b', 'draw')),
  rating_a_before int,
  rating_b_before int,
  delta_a         int,
  delta_b         int,
  check (player_b is null or player_b <> player_a)
);
create index if not exists elo_matches_waiting on public.elo_matches (created_at) where status = 'waiting';
create index if not exists elo_matches_a on public.elo_matches (player_a, created_at desc);
-- One match in progress as A per player: two concurrent /play calls can't both create a playing_a match (the second insert fails with 23505).
create unique index if not exists elo_matches_one_playing_a on public.elo_matches (player_a) where status = 'playing_a';
create index if not exists elo_matches_b on public.elo_matches (player_b, created_at desc);
create index if not exists elo_matches_finished on public.elo_matches (finished_at) where status = 'finished';
create index if not exists elo_matches_a_finished on public.elo_matches (a_finished_at) where a_finished_at is not null;

create table if not exists public.elo_answers (
  match_id     uuid        not null references public.elo_matches (id) on delete cascade,
  user_id      uuid        not null,
  idx          smallint    not null check (idx between 0 and 9),
  qid          text        not null,
  section      text        not null check (section in ('rw', 'math')),
  difficulty   text        not null check (difficulty in ('easy', 'medium', 'hard')),
  limit_s      smallint    not null,
  issued_at    timestamptz not null default now(),
  answered_at  timestamptz,
  response     text,
  elapsed_ms   int,
  status       text        not null default 'open' check (status in ('open', 'answered', 'timeout', 'annulled')),
  correct      boolean,
  base         int         not null default 0,
  bonus        int         not null default 0,
  points       int         not null default 0,
  primary key (match_id, user_id, idx)
);
create index if not exists elo_answers_user on public.elo_answers (user_id, issued_at desc);

create table if not exists public.elo_history (
  id             bigint      generated always as identity primary key,
  user_id        uuid        not null,
  match_id       uuid        not null,
  at             timestamptz not null default now(),
  rating_before  int         not null,
  rating_after   int         not null,
  reason         text        not null default 'match' check (reason in ('match', 'void'))   -- 'void' = the revert of a voided match
);
create index if not exists elo_history_user on public.elo_history (user_id, at desc);
create index if not exists elo_history_match on public.elo_history (match_id);

create table if not exists public.elo_season_results (
  season   text not null,                                   -- 'YYYY-MM'
  user_id  uuid not null,
  place    int  not null,
  rating   int  not null,
  primary key (season, user_id)
);

-- Leaderboard indexes: the global board is the calibrated players ordered by rating.
create index if not exists elo_players_board on public.elo_players (rating desc, matches desc, updated_at asc) where matches >= 10;

alter table public.elo_players        enable row level security;
alter table public.elo_matches        enable row level security;
alter table public.elo_answers        enable row level security;
alter table public.elo_history        enable row level security;
alter table public.elo_season_results enable row level security;
-- No policies: only the server (service role) reads and writes, like the other tables of the project.

-- ---------------------------------------------------------------------------------------------------------------------
-- Rating math. Mirrors applyElo() in src/lib/elo.ts exactly: numeric arithmetic, round(numeric) = half away from zero, each
-- player's own K (40 while fewer than 10 finished matches, then 24 below 2000, 16 from 2000), incoming ratings clamped to >= 100,
-- floor 100 on the way out, delta reported after the floor. result: 'a' | 'b' | 'draw' (a forfeit is passed as the other side's win).
-- Returns { delta_a, delta_b, rating_a, rating_b, expected_a, k_a, k_b }.
-- (Constants live in src/lib/elo-config.ts: change both places together.)
create or replace function public.elo_calc(ra int, rb int, ma int, mb int, result text)
returns jsonb language plpgsql immutable set search_path = '' as $$
declare
  a_rating int := greatest(100, coalesce(ra, 1000));
  b_rating int := greatest(100, coalesce(rb, 1000));
  sa numeric;
  sb numeric;
  ea numeric;
  eb numeric;
  ka int;
  kb int;
  new_a int;
  new_b int;
begin
  if result = 'a' then sa := 1;
  elsif result = 'draw' then sa := 0.5;
  elsif result = 'b' then sa := 0;
  else raise exception 'elo_calc: bad result %', result;
  end if;
  sb := 1 - sa;
  ea := 1 / (1 + power(10::numeric, (b_rating - a_rating)::numeric / 400));
  eb := 1 - ea;
  ka := case when coalesce(ma, 0) < 10 then 40 when a_rating < 2000 then 24 else 16 end;
  kb := case when coalesce(mb, 0) < 10 then 40 when b_rating < 2000 then 24 else 16 end;
  new_a := greatest(100, a_rating + round(ka * (sa - ea))::int);
  new_b := greatest(100, b_rating + round(kb * (sb - eb))::int);
  return jsonb_build_object(
    'delta_a', new_a - a_rating,
    'delta_b', new_b - b_rating,
    'rating_a', new_a,
    'rating_b', new_b,
    'expected_a', round(ea, 6),
    'k_a', ka,
    'k_b', kb
  );
end $$;

-- The stored outcome of a match, as the functions below return it. `changed` = this call applied something.
create or replace function public.elo_match_json(p_match uuid, p_changed boolean default false)
returns jsonb language sql security definer set search_path = '' as $$
  select jsonb_build_object(
    'match_id', m.id,
    'status', m.status,
    'result', m.result,
    'forfeit', m.forfeit,
    'points_a', m.points_a,
    'points_b', m.points_b,
    'rating_a_before', m.rating_a_before,
    'rating_b_before', m.rating_b_before,
    'delta_a', m.delta_a,
    'delta_b', m.delta_b,
    'rating_a_after', m.rating_a_before + m.delta_a,
    'rating_b_after', m.rating_b_before + m.delta_b,
    'finished_at', m.finished_at,
    'changed', p_changed
  )
  from public.elo_matches m where m.id = p_match;
$$;

-- Finishes a match atomically (docs/ELO.md 8.3). The server writes points_a / points_b (and forfeit) first, then calls this.
-- Idempotent: anything but 'playing_b' returns the stored outcome unchanged (changed = false).
create or replace function public.elo_finish_match(p_match uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  m public.elo_matches%rowtype;
  pa public.elo_players%rowtype;
  pb public.elo_players%rowtype;
  v_result text;
  v_calc jsonb;
  v_now timestamptz := now();
  v_da int;
  v_db int;
  v_ra int;
  v_rb int;
begin
  select * into m from public.elo_matches where id = p_match for update;
  if not found then raise exception 'ELO_NOT_FOUND: elo_finish_match: match % not found', p_match; end if;
  if m.status <> 'playing_b' then return public.elo_match_json(p_match, false); end if;
  -- The second player's account was deleted (player_b is set null): nobody to rate against, so the match is void, no rating change.
  if m.player_b is null then
    update public.elo_matches set status = 'void' where id = m.id;
    return public.elo_match_json(m.id, true);
  end if;
  if m.points_a is null or m.points_b is null then
    raise exception 'elo_finish_match: match % has no points yet', p_match;
  end if;

  -- Both players exist at 1000 if they never played; lock their rows in user_id order so two matches can't deadlock.
  insert into public.elo_players (user_id) select t.u from unnest(array[m.player_a, m.player_b]) as t(u) order by t.u on conflict (user_id) do nothing;
  perform 1 from public.elo_players where user_id in (m.player_a, m.player_b) order by user_id for update;
  select * into pa from public.elo_players where user_id = m.player_a;
  select * into pb from public.elo_players where user_id = m.player_b;

  v_result := case
    when m.forfeit = 'a' then 'b'
    when m.forfeit = 'b' then 'a'
    when m.points_a > m.points_b then 'a'
    when m.points_a < m.points_b then 'b'
    else 'draw'
  end;
  v_calc := public.elo_calc(pa.rating, pb.rating, pa.matches, pb.matches, v_result);
  v_da := (v_calc ->> 'delta_a')::int;
  v_db := (v_calc ->> 'delta_b')::int;
  v_ra := (v_calc ->> 'rating_a')::int;
  v_rb := (v_calc ->> 'rating_b')::int;

  update public.elo_players set
    rating = v_ra,
    peak = greatest(peak, v_ra),
    matches = matches + 1,
    wins = wins + case when v_result = 'a' then 1 else 0 end,
    losses = losses + case when v_result = 'b' then 1 else 0 end,
    draws = draws + case when v_result = 'draw' then 1 else 0 end,
    updated_at = v_now
  where user_id = m.player_a;
  update public.elo_players set
    rating = v_rb,
    peak = greatest(peak, v_rb),
    matches = matches + 1,
    wins = wins + case when v_result = 'b' then 1 else 0 end,
    losses = losses + case when v_result = 'a' then 1 else 0 end,
    draws = draws + case when v_result = 'draw' then 1 else 0 end,
    updated_at = v_now
  where user_id = m.player_b;

  insert into public.elo_history (user_id, match_id, at, rating_before, rating_after, reason) values
    (m.player_a, m.id, v_now, pa.rating, v_ra, 'match'),
    (m.player_b, m.id, v_now, pb.rating, v_rb, 'match');

  update public.elo_matches set
    status = 'finished',
    result = v_result,
    rating_a_before = pa.rating,
    rating_b_before = pb.rating,
    delta_a = v_da,
    delta_b = v_db,
    finished_at = v_now
  where id = m.id;

  return public.elo_match_json(m.id, true);
end $$;

-- Voids a match (admin). A finished match is reverted by subtracting each player's own delta from their CURRENT rating
-- (later matches stay counted), floor 100, with the counters fixed and a reverting history row each; peak is recomputed from the
-- remaining matches. Any other status simply becomes 'void'. Idempotent: a voided match returns unchanged (changed = false).
-- A player whose latest 'reset' history row (supabase/elo-admin.sql) is later than this match's finish keeps their rating: the reset
-- already wiped this match's effect, so subtracting the delta again would punish them twice. The counters are still fixed and the
-- reverting history row is still written (rating_before = rating_after). The peak counts only matches after the latest reset (min 1000).
create or replace function public.elo_void_match(p_match uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  m public.elo_matches%rowtype;
  pa public.elo_players%rowtype;
  pb public.elo_players%rowtype;
  v_now timestamptz := now();
  v_ra int;
  v_rb int;
  v_reset_a timestamptz;
  v_reset_b timestamptz;
begin
  select * into m from public.elo_matches where id = p_match for update;
  if not found then raise exception 'ELO_NOT_FOUND: elo_void_match: match % not found', p_match; end if;
  if m.status = 'void' then return public.elo_match_json(p_match, false); end if;

  if m.status <> 'finished' then
    update public.elo_matches set status = 'void' where id = m.id;
    return public.elo_match_json(m.id, true);
  end if;

  perform 1 from public.elo_players where user_id in (m.player_a, m.player_b) order by user_id for update;
  select * into pa from public.elo_players where user_id = m.player_a;
  select * into pb from public.elo_players where user_id = m.player_b;

  update public.elo_matches set status = 'void' where id = m.id;

  -- A player may be gone (account deleted: player_b is set null) - then there is nothing to revert for them.
  if pa.user_id is not null then
    select max(h.at) into v_reset_a from public.elo_history h where h.user_id = pa.user_id and h.reason = 'reset';
    v_ra := case when v_reset_a > m.finished_at then pa.rating else greatest(100, pa.rating - coalesce(m.delta_a, 0)) end;
    update public.elo_players p set
      rating = v_ra,
      matches = greatest(p.matches - 1, 0),
      wins = greatest(p.wins - case when m.result = 'a' then 1 else 0 end, 0),
      losses = greatest(p.losses - case when m.result = 'b' then 1 else 0 end, 0),
      draws = greatest(p.draws - case when m.result = 'draw' then 1 else 0 end, 0),
      peak = greatest(v_ra, 1000, coalesce((
        select max(h.rating_after) from public.elo_history h join public.elo_matches mm on mm.id = h.match_id
        where h.user_id = p.user_id and h.reason = 'match' and mm.status <> 'void' and (v_reset_a is null or h.at > v_reset_a)
      ), 1000)),   -- never below the start rating 1000 (START_RATING in elo-config.ts)
      updated_at = v_now
    where p.user_id = pa.user_id;
    insert into public.elo_history (user_id, match_id, at, rating_before, rating_after, reason)
      values (pa.user_id, m.id, v_now, pa.rating, v_ra, 'void');
  end if;

  if pb.user_id is not null then
    select max(h.at) into v_reset_b from public.elo_history h where h.user_id = pb.user_id and h.reason = 'reset';
    v_rb := case when v_reset_b > m.finished_at then pb.rating else greatest(100, pb.rating - coalesce(m.delta_b, 0)) end;
    update public.elo_players p set
      rating = v_rb,
      matches = greatest(p.matches - 1, 0),
      wins = greatest(p.wins - case when m.result = 'b' then 1 else 0 end, 0),
      losses = greatest(p.losses - case when m.result = 'a' then 1 else 0 end, 0),
      draws = greatest(p.draws - case when m.result = 'draw' then 1 else 0 end, 0),
      peak = greatest(v_rb, 1000, coalesce((
        select max(h.rating_after) from public.elo_history h join public.elo_matches mm on mm.id = h.match_id
        where h.user_id = p.user_id and h.reason = 'match' and mm.status <> 'void' and (v_reset_b is null or h.at > v_reset_b)
      ), 1000)),
      updated_at = v_now
    where p.user_id = pb.user_id;
    insert into public.elo_history (user_id, match_id, at, rating_before, rating_after, reason)
      values (pb.user_id, m.id, v_now, pb.rating, v_rb, 'void');
  end if;

  return public.elo_match_json(m.id, true);
end $$;

-- Matchmaking (docs/ELO.md 5.4): expires stale waiting matches (48 h after A finished, no rating change), then takes the OLDEST
-- waiting match this player may join and makes them player B. Returns the match id, or null when there is none.
-- A match fits when: not the player's own, same mode, A's current rating is within min(400, 100 + 50 x hours waited) of p_rating,
-- and the two have not been paired within the last 24 h. FOR UPDATE SKIP LOCKED: two players never take the same match.
-- (Window numbers live in src/lib/elo-config.ts MATCH_WINDOW; the per-player limits - 3 waiting, 30 a day - are the server's job.)
create or replace function public.elo_claim_waiting(p_user uuid, p_rating int, p_mode text, p_now timestamptz default now())
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  -- One claim per player at a time (two quick taps must not take two matches), and never while they are already in a match.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text, 0));
  if exists (
    select 1 from public.elo_matches x
    where (x.player_a = p_user and x.status = 'playing_a') or (x.player_b = p_user and x.status = 'playing_b')
  ) then
    raise exception 'ELO_ACTIVE_MATCH: player % already has a match in progress', p_user;
  end if;

  update public.elo_matches set status = 'expired'
  where status = 'waiting' and coalesce(expires_at, a_finished_at + interval '48 hours') <= p_now;

  select m.id into v_id
  from public.elo_matches m
  left join public.elo_players pa on pa.user_id = m.player_a
  where m.status = 'waiting'
    and m.mode = p_mode
    and m.player_a <> p_user
    and abs(coalesce(pa.rating, 1000) - p_rating)
        <= least(400, 100 + 50 * greatest(0, extract(epoch from (p_now - coalesce(m.a_finished_at, m.created_at))) / 3600))
    and not exists (
      select 1 from public.elo_matches x
      where x.status <> 'void'
        and x.player_b is not null
        and ((x.player_a = m.player_a and x.player_b = p_user) or (x.player_a = p_user and x.player_b = m.player_a))
        and coalesce(x.b_started_at, x.created_at) > p_now - interval '24 hours'
    )
  order by m.created_at
  limit 1
  for update of m skip locked;

  if v_id is null then return null; end if;
  update public.elo_matches set status = 'playing_b', player_b = p_user, b_started_at = p_now where id = v_id;
  return v_id;
end $$;

-- Leaderboards (docs/ELO.md 7). p_board: 'global' | 'season' | 'week'. Page is 1-based, size is capped at 50.
--   global: players with >= 10 finished matches, by rating desc, matches desc, updated_at asc (who got there first).
--   season: the current UTC month; players with >= 5 matches finished in it; same order.
--   week:   the current UTC week (Monday 00:00 -> next Monday): the sum of every player's points over their finished part of
--           non-void matches (as player A: a_finished_at in the week -> points_a; as player B: finished_at in the week and
--           status 'finished' -> points_b); ties: more correct answers, then less total elapsed time.
-- Returns { total, rows: [{ rank, name, avatar, rating, matches, wins, losses, draws, points? }], me }. Public fields only.
-- me is the caller's row with their real rank; a player who is not on the board yet gets rank null with their stats; null if unknown.
create or replace function public.elo_leaderboard(p_board text, p_page int, p_size int, p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_size int := least(greatest(coalesce(p_size, 50), 1), 50);
  v_off int := (greatest(coalesce(p_page, 1), 1) - 1) * least(greatest(coalesce(p_size, 50), 1), 50);
  v_from timestamptz;
  v_to timestamptz;
  v_total int;
  v_rows jsonb;
  v_me jsonb;
begin
  if p_board = 'season' then
    v_from := date_trunc('month', now() at time zone 'UTC') at time zone 'UTC';
    v_to := (date_trunc('month', now() at time zone 'UTC') + interval '1 month') at time zone 'UTC';
  elsif p_board = 'week' then
    v_from := date_trunc('week', now() at time zone 'UTC') at time zone 'UTC';
    v_to := (date_trunc('week', now() at time zone 'UTC') + interval '7 days') at time zone 'UTC';
  elsif p_board <> 'global' or p_board is null then
    raise exception 'elo_leaderboard: unknown board %', p_board;
  end if;

  with parts as (
    select m.player_a as u, m.id as mid, m.points_a as pts
    from public.elo_matches m
    where p_board = 'week' and m.status <> 'void' and m.points_a is not null
      and m.a_finished_at >= v_from and m.a_finished_at < v_to
    union all
    select m.player_b, m.id, m.points_b
    from public.elo_matches m
    where p_board = 'week' and m.status = 'finished' and m.player_b is not null and m.points_b is not null
      and m.finished_at >= v_from and m.finished_at < v_to
  ),
  played as (
    select u, sum(pts)::numeric as pts from parts group by u
  ),
  ans as (
    select a.user_id as u, (count(*) filter (where a.correct))::numeric as cor, coalesce(sum(a.elapsed_ms), 0)::numeric as ms
    from public.elo_answers a
    join parts p on p.u = a.user_id and p.mid = a.match_id
    group by a.user_id
  ),
  sc as (
    select x.u from (
      select m.player_a as u from public.elo_matches m
      where p_board = 'season' and m.status = 'finished' and m.finished_at >= v_from and m.finished_at < v_to
      union all
      select m.player_b from public.elo_matches m
      where p_board = 'season' and m.status = 'finished' and m.player_b is not null and m.finished_at >= v_from and m.finished_at < v_to
    ) x
    group by x.u having count(*) >= 5
  ),
  base as (
    select p.user_id as u, p.rating::numeric as k1, p.matches::numeric as k2, 0::numeric as k3,
           extract(epoch from p.updated_at)::numeric as k4, null::numeric as pts
    from public.elo_players p
    where p_board = 'global' and p.matches >= 10
    union all
    select p.user_id, p.rating::numeric, p.matches::numeric, 0::numeric, extract(epoch from p.updated_at)::numeric, null::numeric
    from public.elo_players p join sc on sc.u = p.user_id
    where p_board = 'season'
    union all
    select pl.u, pl.pts, coalesce(a.cor, 0), coalesce(a.ms, 0), 0::numeric, pl.pts
    from played pl
    join public.elo_players ep on ep.user_id = pl.u
    left join ans a on a.u = pl.u
  ),
  ranked as (
    select b.*, row_number() over (order by b.k1 desc, b.k2 desc, b.k3 asc, b.k4 asc, b.u) as rnk from base b
  ),
  shown as (
    select r.rnk, (r.u = p_user) as is_me,
           jsonb_build_object('rank', r.rnk, 'name', p.name, 'avatar', p.avatar, 'rating', p.rating, 'matches', p.matches,
                              'wins', p.wins, 'losses', p.losses, 'draws', p.draws)
           || case when p_board = 'week' then jsonb_build_object('points', r.pts) else '{}'::jsonb end as j
    from ranked r
    join public.elo_players p on p.user_id = r.u
    where (r.rnk > v_off and r.rnk <= v_off + v_size) or r.u = p_user
  )
  select (select count(*) from ranked),
         coalesce((select jsonb_agg(s.j order by s.rnk) from shown s where s.rnk > v_off and s.rnk <= v_off + v_size), '[]'::jsonb),
         (select s.j from shown s where s.is_me limit 1)
  into v_total, v_rows, v_me;

  if v_me is null and p_user is not null then
    select jsonb_build_object('rank', null, 'name', p.name, 'avatar', p.avatar, 'rating', p.rating, 'matches', p.matches,
                              'wins', p.wins, 'losses', p.losses, 'draws', p.draws)
           || case when p_board = 'week' then jsonb_build_object('points', 0) else '{}'::jsonb end
    into v_me
    from public.elo_players p where p.user_id = p_user;
  end if;

  return jsonb_build_object('total', v_total, 'rows', v_rows, 'me', v_me);
end $$;

-- Saves the final table of a finished month ('YYYY-MM') into elo_season_results: players with >= 5 matches finished in that month,
-- placed by their rating at the END of the month (from elo_history), then more matches in the month, then who got there first.
-- Idempotent: if the month is already saved it returns its row count and changes nothing. Refuses a month that isn't over.
-- Returns the number of rows saved.
create or replace function public.elo_close_season(p_season text)
returns int language plpgsql security definer set search_path = '' as $$
declare
  v_from timestamptz;
  v_to timestamptz;
  v_n int;
begin
  if p_season is null or p_season !~ '^\d{4}-(0[1-9]|1[0-2])$' then
    raise exception 'elo_close_season: season must look like YYYY-MM, got %', p_season;
  end if;
  v_from := (p_season || '-01')::timestamp at time zone 'UTC';
  v_to := ((p_season || '-01')::timestamp + interval '1 month') at time zone 'UTC';
  if v_to > now() then raise exception 'elo_close_season: season % is not over yet', p_season; end if;

  select count(*) into v_n from public.elo_season_results where season = p_season;
  if v_n > 0 then return v_n; end if;

  insert into public.elo_season_results (season, user_id, place, rating)
  select p_season, r.u, (row_number() over (order by r.rating desc, r.cnt desc, r.last_at asc, r.u))::int, r.rating
  from (
    select c.u, c.cnt,
           coalesce((select h.rating_after from public.elo_history h where h.user_id = c.u and h.at < v_to
                     order by h.at desc, h.id desc limit 1), 1000) as rating,
           (select max(h.at) from public.elo_history h where h.user_id = c.u and h.at < v_to) as last_at
    from (
      select x.u, count(*) as cnt from (
        select m.player_a as u from public.elo_matches m
        where m.status = 'finished' and m.finished_at >= v_from and m.finished_at < v_to
        union all
        select m.player_b from public.elo_matches m
        where m.status = 'finished' and m.player_b is not null and m.finished_at >= v_from and m.finished_at < v_to
      ) x
      group by x.u having count(*) >= 5
    ) c
  ) r
  on conflict (season, user_id) do nothing;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

revoke all on function public.elo_calc(int, int, int, int, text) from public, anon, authenticated;
revoke all on function public.elo_match_json(uuid, boolean) from public, anon, authenticated;
revoke all on function public.elo_finish_match(uuid) from public, anon, authenticated;
revoke all on function public.elo_void_match(uuid) from public, anon, authenticated;
revoke all on function public.elo_claim_waiting(uuid, int, text, timestamptz) from public, anon, authenticated;
revoke all on function public.elo_leaderboard(text, int, int, uuid) from public, anon, authenticated;
revoke all on function public.elo_close_season(text) from public, anon, authenticated;
grant execute on function public.elo_calc(int, int, int, int, text) to service_role;
grant execute on function public.elo_match_json(uuid, boolean) to service_role;
grant execute on function public.elo_finish_match(uuid) to service_role;
grant execute on function public.elo_void_match(uuid) to service_role;
grant execute on function public.elo_claim_waiting(uuid, int, text, timestamptz) to service_role;
grant execute on function public.elo_leaderboard(text, int, int, uuid) to service_role;
grant execute on function public.elo_close_season(text) to service_role;

-- ═══ elo-admin.sql ═══
-- Ranked matches (docs/ELO.md stage 6): admin log, the rating reset and the logged void. Safe to re-run. Apply AFTER supabase/elo.sql.
-- Only the server (service role) touches these: RLS on with no policies, the function is executable by service_role alone.

-- 1. The admin log: every admin action on ranked matches / players (void a match, reset a rating).
create table if not exists public.elo_admin_log (
  id           bigint      generated always as identity primary key,
  at           timestamptz not null default now(),
  admin_email  text        not null default '',
  action       text        not null,                 -- 'void_match' | 'reset_rating'
  match_id     uuid,
  user_id      uuid,
  details      jsonb       not null default '{}'::jsonb
);
create index if not exists elo_admin_log_at on public.elo_admin_log (at desc);
alter table public.elo_admin_log enable row level security;

-- 2. elo_history.reason may also be 'reset' (elo.sql allows 'match' | 'void'). The column's CHECK is replaced, whatever its name is.
do $$
declare
  c record;
begin
  for c in
    select conname from pg_catalog.pg_constraint
    where conrelid = 'public.elo_history'::regclass and contype = 'c'
      and pg_catalog.pg_get_constraintdef(oid) ilike '%reason%' and pg_catalog.pg_get_constraintdef(oid) not ilike '%reset%'
  loop
    execute pg_catalog.format('alter table public.elo_history drop constraint %I', c.conname);
  end loop;
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.elo_history'::regclass and contype = 'c' and pg_catalog.pg_get_constraintdef(oid) ilike '%reset%'
  ) then
    alter table public.elo_history add constraint elo_history_reason_check check (reason in ('match', 'void', 'reset'));
  end if;
end $$;

-- 3. Reset a player's rating to the start value (1000, START_RATING in src/lib/elo-config.ts).
--  - rating := 1000 and peak := 1000 (the peak is reset too: after a cheating case it is the inflated number). A history row with
--    reason 'reset' is written whenever something changes (match_id = the nil uuid: a reset belongs to no match); elo_void_match
--    uses its time to tell matches played before the reset from later ones.
--  - matches / wins / losses / draws are kept (they drive the calibration K factor and the leaderboard threshold, and the matches did happen).
--  - updated_at moves only when the rating changes (it is the leaderboard tie-break "who reached the rating first").
--  - Idempotent-safe: on a player already at 1000 / 1000 nothing changes; the call is still logged with changed = false.
--  - Raises 'ELO_NOT_FOUND: ...' for a player without a rating row.
-- Voiding a match the player played BEFORE the reset doesn't take its delta off again (elo_void_match skips the rating for a player
-- whose latest 'reset' is later than the match's finish, and counts the peak only from matches after the reset).
create or replace function public.elo_reset_player(p_user uuid, p_admin text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  p public.elo_players%rowtype;
  v_now timestamptz := now();
  v_changed boolean;
begin
  select * into p from public.elo_players where user_id = p_user for update;
  if not found then raise exception 'ELO_NOT_FOUND: elo_reset_player: player % not found', p_user; end if;

  v_changed := p.rating <> 1000 or p.peak <> 1000;
  if v_changed then
    insert into public.elo_history (user_id, match_id, at, rating_before, rating_after, reason)
      values (p.user_id, '00000000-0000-0000-0000-000000000000', v_now, p.rating, 1000, 'reset');
    update public.elo_players set rating = 1000, peak = 1000,
      updated_at = case when p.rating <> 1000 then v_now else updated_at end
    where user_id = p.user_id;
  end if;

  insert into public.elo_admin_log (at, admin_email, action, match_id, user_id, details)
    values (v_now, coalesce(p_admin, ''), 'reset_rating', null, p.user_id,
            pg_catalog.jsonb_build_object('rating_before', p.rating, 'peak_before', p.peak, 'rating_after', 1000, 'changed', v_changed));

  return pg_catalog.jsonb_build_object(
    'user_id', p.user_id, 'rating_before', p.rating, 'peak_before', p.peak, 'rating_after', 1000, 'peak_after', 1000, 'changed', v_changed
  );
end $$;

revoke all on function public.elo_reset_player(uuid, text) from public, anon, authenticated;
grant execute on function public.elo_reset_player(uuid, text) to service_role;

-- 4. Void a match and log it in ONE transaction (the admin tab calls this instead of elo_void_match + a separate insert).
--  - Takes the match row lock, remembers how the match looked, calls elo_void_match, writes the admin log row, returns elo_void_match's JSON
--    (match_id, status, result, ..., changed). Voiding an already void match changes nothing and is logged with changed = false.
--  - Raises 'ELO_NOT_FOUND: ...' for an unknown match.
create or replace function public.elo_admin_void(p_match uuid, p_admin text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  m public.elo_matches%rowtype;
  v_out jsonb;
begin
  select * into m from public.elo_matches where id = p_match for update;
  if not found then raise exception 'ELO_NOT_FOUND: elo_admin_void: match % not found', p_match; end if;

  v_out := public.elo_void_match(p_match);

  insert into public.elo_admin_log (at, admin_email, action, match_id, user_id, details)
    values (now(), coalesce(p_admin, ''), 'void_match', m.id, null,
            pg_catalog.jsonb_build_object(
              'status_before', m.status, 'result_before', m.result, 'delta_a', m.delta_a, 'delta_b', m.delta_b,
              'player_a', m.player_a, 'player_b', m.player_b, 'changed', coalesce((v_out ->> 'changed')::boolean, false)
            ));
  return v_out;
end $$;

revoke all on function public.elo_admin_void(uuid, text) from public, anon, authenticated;
grant execute on function public.elo_admin_void(uuid, text) to service_role;
