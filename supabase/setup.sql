-- Stellar: every table at once. Paste the whole file into Supabase → SQL Editor → Run. Safe to re-run.
-- Same content as competition.sql + reports.sql + support.sql + user_data.sql + account_stats.sql.

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
    from auth.users u where u.created_at >= p_from and u.created_at < p_to group by 1
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
      'signups', (select count(*) from auth.users u where u.created_at >= p_from and u.created_at < p_to),
      'signins', (select count(*) from public.account_signins s where s.at >= p_from and s.at < p_to),
      'active', (select count(distinct a.user_id) from public.account_activity a where a.at >= p_from and a.at < p_to)
    ),
    'previous', jsonb_build_object(
      'signups', (select count(*) from auth.users u where u.created_at >= p_from - span and u.created_at < p_from),
      'signins', (select count(*) from public.account_signins s where s.at >= p_from - span and s.at < p_from),
      'active', (select count(distinct a.user_id) from public.account_activity a where a.at >= p_from - span and a.at < p_from)
    ),
    'users_total', (select count(*) from auth.users)
  ) into result;
  return result;
end $$;

-- Latest accounts for the list under the chart (admin only).
create or replace function public.admin_account_list(p_limit int default 100)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(x order by x.last_sign_in_at desc nulls last), '[]'::jsonb)
  from (
    select u.id, u.email, u.created_at, u.last_sign_in_at,
           coalesce(u.raw_app_meta_data ->> 'provider', 'email') as provider,
           (select count(*) from public.account_activity a where a.user_id = u.id and a.at > now() - interval '30 days') as active_days_30
    from auth.users u
    order by u.last_sign_in_at desc nulls last
    limit least(greatest(p_limit, 1), 500)
  ) x;
$$;

revoke all on function public.admin_account_stats(timestamptz, timestamptz, text, text) from public, anon, authenticated;
revoke all on function public.admin_account_list(int) from public, anon, authenticated;
revoke all on function public.track_auth_session() from public, anon, authenticated;
grant execute on function public.admin_account_stats(timestamptz, timestamptz, text, text) to service_role;
grant execute on function public.admin_account_list(int) to service_role;
