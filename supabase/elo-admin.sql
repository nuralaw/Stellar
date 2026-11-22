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

-- 3. Reset a player's rating to the start value (100, START_RATING in src/lib/elo-config.ts).
--  - rating := 100 and peak := 100 (the peak is reset too: after a cheating case it is the inflated number). A history row with
--    reason 'reset' is written whenever something changes (match_id = the nil uuid: a reset belongs to no match); elo_void_match
--    uses its time to tell matches played before the reset from later ones.
--  - matches / wins / losses / draws are kept (they drive the calibration K factor and the leaderboard threshold, and the matches did happen).
--  - updated_at moves only when the rating changes (it is the leaderboard tie-break "who reached the rating first").
--  - Idempotent-safe: on a player already at 100 / 100 nothing changes; the call is still logged with changed = false.
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

  v_changed := p.rating <> 100 or p.peak <> 100;
  if v_changed then
    insert into public.elo_history (user_id, match_id, at, rating_before, rating_after, reason)
      values (p.user_id, '00000000-0000-0000-0000-000000000000', v_now, p.rating, 100, 'reset');
    update public.elo_players set rating = 100, peak = 100,
      updated_at = case when p.rating <> 100 then v_now else updated_at end
    where user_id = p.user_id;
  end if;

  insert into public.elo_admin_log (at, admin_email, action, match_id, user_id, details)
    values (v_now, coalesce(p_admin, ''), 'reset_rating', null, p.user_id,
            pg_catalog.jsonb_build_object('rating_before', p.rating, 'peak_before', p.peak, 'rating_after', 100, 'changed', v_changed));

  return pg_catalog.jsonb_build_object(
    'user_id', p.user_id, 'rating_before', p.rating, 'peak_before', p.peak, 'rating_after', 100, 'peak_after', 100, 'changed', v_changed
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
