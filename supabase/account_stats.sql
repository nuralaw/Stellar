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
