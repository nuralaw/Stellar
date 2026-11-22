-- Stellar ranked matches (ELO): players, the live matchmaking queue, matches, per-question answers, rating history, season results, and the
-- SQL twins of the formulas in src/lib/elo.ts (see docs/ELO.md sections 3-8 and docs/ELO-live.md). Safe to re-run. Needs nothing but Supabase Auth.
-- Only the site's server (service-role key) can read or write these: RLS on with no policies, functions executable by service_role only.
-- After applying, run supabase/elo-check.sql in the SQL Editor to verify the formulas.

create table if not exists public.elo_players (
  user_id        uuid        primary key references auth.users (id) on delete cascade,
  rating         int         not null default 100 check (rating >= 100),
  peak           int         not null default 100,
  matches        int         not null default 0,            -- finished matches only
  wins           int         not null default 0,
  losses         int         not null default 0,
  draws          int         not null default 0,
  name           text        not null default '',           -- public name (copied from the profile when the player starts a match)
  avatar         text        not null default '',           -- public avatar: an emoji or a small data: image
  updated_at     timestamptz not null default now()         -- last rating change (leaderboard tie-break: who got there first)
);
-- The start rating is 100 (START_RATING in src/lib/elo-config.ts, equal to the floor). Re-runnable: moves the column defaults of a database
-- created when the start was 1000 (existing rows keep their ratings).
alter table public.elo_players alter column rating set default 100, alter column peak set default 100;

-- Matches are made by the queue (elo_queue_join / elo_queue_poll below): both players are known from the start, status 'playing'
-- until both parts are closed, then 'finished' (elo_finish_match) or 'void' (nobody started in time, or an admin voided it).
create table if not exists public.elo_matches (
  id              uuid        primary key default gen_random_uuid(),
  mode            text        not null default 'mixed' check (mode in ('mixed', 'rw', 'math')),
  status          text        not null check (status in ('playing', 'finished', 'void')),
  player_a        uuid        not null references auth.users (id) on delete cascade,   -- the one who started searching first
  player_b        uuid        references auth.users (id) on delete set null,
  question_ids    text[]      not null check (cardinality(question_ids) = 10),   -- exactly 10, fixed order (A's set)
  created_at      timestamptz not null default now(),       -- when the pair was made
  a_started_at    timestamptz,                              -- A opened the first question
  b_started_at    timestamptz,                              -- B opened the first question
  a_finished_at   timestamptz,                              -- A's part is closed
  b_finished_at   timestamptz,                              -- B's part is closed
  start_by        timestamptz,                              -- created_at + the start deadline: a side that hasn't started by then loses
  finished_at     timestamptz,                              -- the rating change was applied
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
-- Re-runnable migration of a database made by the older (asynchronous) flow: new columns, the status list, the indexes.
alter table public.elo_matches add column if not exists a_started_at  timestamptz;
alter table public.elo_matches add column if not exists b_finished_at timestamptz;
alter table public.elo_matches add column if not exists start_by       timestamptz;
drop function if exists public.elo_claim_waiting(uuid, int, text, timestamptz);   -- replaced by the queue
drop index if exists public.elo_matches_waiting;
drop index if exists public.elo_matches_one_playing_a;
drop index if exists public.elo_matches_a_finished;
do $$
declare
  c record;
begin
  -- 1. drop the old status check (the one that still lists 'waiting' etc.), whatever its name is
  for c in
    select conname from pg_catalog.pg_constraint
    where conrelid = 'public.elo_matches'::regclass and contype = 'c'
      and pg_catalog.pg_get_constraintdef(oid) ilike '%status%' and pg_catalog.pg_get_constraintdef(oid) ilike '%waiting%'
  loop
    execute pg_catalog.format('alter table public.elo_matches drop constraint %I', c.conname);
  end loop;
  -- 2. unfinished matches of the old flow become void: no rating was applied to them, so there is nothing to revert
  update public.elo_matches set status = 'void' where status in ('playing_a', 'waiting', 'playing_b', 'expired');
  -- 3. the new status list
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.elo_matches'::regclass and contype = 'c' and pg_catalog.pg_get_constraintdef(oid) ilike '%status%'
  ) then
    alter table public.elo_matches add constraint elo_matches_status_check check (status in ('playing', 'finished', 'void'));
  end if;
end $$;
alter table public.elo_matches drop column if exists expires_at;
create index if not exists elo_matches_a on public.elo_matches (player_a, created_at desc);
-- One match in progress per player, as A and as B: the queue can never put a player into two matches.
create unique index if not exists elo_matches_one_playing_as_a on public.elo_matches (player_a) where status = 'playing';
create unique index if not exists elo_matches_one_playing_as_b on public.elo_matches (player_b) where status = 'playing';
create index if not exists elo_matches_b on public.elo_matches (player_b, created_at desc);
create index if not exists elo_matches_finished on public.elo_matches (finished_at) where status = 'finished';

-- The live matchmaking queue (docs/ELO-live.md 2): one row per searching player. 'searching' -> 'matched' (match_id set) or 'timeout'.
-- A 'matched' row lives while its match is 'playing' (a reload returns the player to the match), then it is deleted on the next read.
create table if not exists public.elo_queue (
  user_id      uuid        primary key references auth.users (id) on delete cascade,
  mode         text        not null default 'mixed' check (mode in ('mixed', 'rw', 'math')),
  rating       int         not null,
  question_ids text[]      not null check (cardinality(question_ids) = 10),   -- prepared when the player joins; used if they become A
  since        timestamptz not null,                                          -- when the search started (never reset by a repeated join)
  last_seen    timestamptz not null,                                          -- the last poll: the player's sign of life
  status       text        not null check (status in ('searching', 'matched', 'timeout')),
  match_id     uuid        references public.elo_matches (id) on delete set null
);
create index if not exists elo_queue_searching on public.elo_queue (mode, since) where status = 'searching';

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
alter table public.elo_queue          enable row level security;
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
  a_rating int := greatest(100, coalesce(ra, 100));
  b_rating int := greatest(100, coalesce(rb, 100));
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

-- Finishes a match atomically (docs/ELO.md 8.3). The server writes points_a / points_b (and forfeit) first, then calls this once both
-- parts are closed. Idempotent: anything but 'playing' returns the stored outcome unchanged (changed = false).
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
  if m.status <> 'playing' then return public.elo_match_json(p_match, false); end if;
  -- A player's account was deleted (player_b is set null): nobody to rate against, so the match is void, no rating change.
  if m.player_b is null then
    update public.elo_matches set status = 'void' where id = m.id;
    return public.elo_match_json(m.id, true);
  end if;
  if m.points_a is null or m.points_b is null then
    raise exception 'elo_finish_match: match % has no points yet', p_match;
  end if;

  -- Both players exist at 100 (the start rating, the column default) if they never played; lock their rows in user_id order so two matches can't deadlock.
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
-- remaining matches. A 'playing' match simply becomes 'void'. Idempotent: a voided match returns unchanged (changed = false).
-- A player whose latest 'reset' history row (supabase/elo-admin.sql) is later than this match's finish keeps their rating: the reset
-- already wiped this match's effect, so subtracting the delta again would punish them twice. The counters are still fixed and the
-- reverting history row is still written (rating_before = rating_after). The peak counts only matches after the latest reset (min 100).
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
      peak = greatest(v_ra, 100, coalesce((
        select max(h.rating_after) from public.elo_history h join public.elo_matches mm on mm.id = h.match_id
        where h.user_id = p.user_id and h.reason = 'match' and mm.status <> 'void' and (v_reset_a is null or h.at > v_reset_a)
      ), 100)),   -- never below the start rating 100 (START_RATING in elo-config.ts)
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
      peak = greatest(v_rb, 100, coalesce((
        select max(h.rating_after) from public.elo_history h join public.elo_matches mm on mm.id = h.match_id
        where h.user_id = p.user_id and h.reason = 'match' and mm.status <> 'void' and (v_reset_b is null or h.at > v_reset_b)
      ), 100)),
      updated_at = v_now
    where p.user_id = pb.user_id;
    insert into public.elo_history (user_id, match_id, at, rating_before, rating_after, reason)
      values (pb.user_id, m.id, v_now, pb.rating, v_rb, 'void');
  end if;

  return public.elo_match_json(m.id, true);
end $$;

-- ---------------------------------------------------------------------------------------------------------------------
-- Live matchmaking (docs/ELO-live.md 2 and 4.1). Three public functions: elo_queue_join, elo_queue_poll, elo_queue_cancel; each answers
-- { status: 'idle' | 'searching' | 'matched' | 'timeout', since, match_id, searching } (searching = how many OTHER players search in the same mode).
-- The numbers of the rules come from src/lib/elo-config.ts as p_rules jsonb {base, step, every_s, open_after_s, drop_after_s,
-- search_max_s, start_deadline_s, rematch_h}; nothing is hard-coded here. All three take the same transaction lock first, so two
-- simultaneous polls can never make two matches. p_now is the caller's clock (the server's), as everywhere else.

-- One rule number out of p_rules; a missing key is a bug of the caller, not a silent null.
create or replace function public.elo_queue_rule(p_rules jsonb, p_key text)
returns numeric language plpgsql immutable set search_path = '' as $$
declare
  v numeric := (p_rules ->> p_key)::numeric;
begin
  if v is null then raise exception 'elo_queue: rule % is missing', p_key; end if;
  return v;
end $$;

-- Allowed rating gap after searching p_searched_s seconds: base + step x floor(s / every_s) while s < open_after_s, then null = no limit.
-- Twin of queueWindow() in src/lib/elo.ts.
create or replace function public.elo_queue_window(p_searched_s numeric, p_rules jsonb)
returns int language plpgsql immutable set search_path = '' as $$
declare
  s numeric := greatest(p_searched_s, 0);
begin
  if s >= public.elo_queue_rule(p_rules, 'open_after_s') then return null; end if;
  return (public.elo_queue_rule(p_rules, 'base') + public.elo_queue_rule(p_rules, 'step') * floor(s / public.elo_queue_rule(p_rules, 'every_s')))::int;
end $$;

-- The answer of the queue functions for one player: idle when there is no row.
create or replace function public.elo_queue_state(p_user uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  q public.elo_queue%rowtype;
  v_n int;
begin
  select * into q from public.elo_queue where user_id = p_user;
  if not found then
    return jsonb_build_object('status', 'idle', 'since', null, 'match_id', null, 'searching', 0);
  end if;
  select count(*) into v_n from public.elo_queue o where o.status = 'searching' and o.mode = q.mode and o.user_id <> p_user;
  return jsonb_build_object('status', q.status, 'since', q.since, 'match_id', q.match_id, 'searching', v_n);
end $$;

-- Housekeeping, run by join and poll under the lock: searching / timeout rows with no poll for drop_after_s are deleted (the player left),
-- 'matched' rows whose match is no longer 'playing' are deleted, searches older than search_max_s become 'timeout'.
create or replace function public.elo_queue_sweep(p_now timestamptz, p_rules jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_drop interval := pg_catalog.make_interval(secs => public.elo_queue_rule(p_rules, 'drop_after_s')::double precision);
  v_max interval := pg_catalog.make_interval(secs => public.elo_queue_rule(p_rules, 'search_max_s')::double precision);
begin
  delete from public.elo_queue where status in ('searching', 'timeout') and last_seen < p_now - v_drop;
  delete from public.elo_queue q
  where q.status = 'matched'
    and not exists (select 1 from public.elo_matches m where m.id = q.match_id and m.status = 'playing');
  update public.elo_queue set status = 'timeout' where status = 'searching' and since <= p_now - v_max;
end $$;

-- Tries to pair p_user (who must be 'searching') with the player who has searched longest among those that fit (docs/ELO-live.md 2.2):
-- same mode, still polling, nobody in a 'playing' match, this pair has no non-void match in the last rematch_h hours, and
-- |rating gap| <= the larger of the two windows (null window = any rating). A = whoever started searching first (tie: smaller user_id);
-- the match gets A's question set, created_at = p_now, start_by = p_now + start_deadline_s. Both queue rows become 'matched'.
create or replace function public.elo_queue_try_match(p_user uuid, p_now timestamptz, p_rules jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  me public.elo_queue%rowtype;
  o public.elo_queue%rowtype;
  v_a public.elo_queue%rowtype;
  v_b public.elo_queue%rowtype;
  v_drop interval := pg_catalog.make_interval(secs => public.elo_queue_rule(p_rules, 'drop_after_s')::double precision);
  v_rematch interval := pg_catalog.make_interval(secs => (public.elo_queue_rule(p_rules, 'rematch_h') * 3600)::double precision);
  v_deadline interval := pg_catalog.make_interval(secs => public.elo_queue_rule(p_rules, 'start_deadline_s')::double precision);
  v_my_window int;
  v_id uuid;
begin
  select * into me from public.elo_queue where user_id = p_user and status = 'searching';
  if not found then return; end if;
  v_my_window := public.elo_queue_window(extract(epoch from (p_now - me.since))::numeric, p_rules);

  select q.* into o
  from public.elo_queue q
  where q.status = 'searching'
    and q.mode = me.mode
    and q.user_id <> me.user_id
    and q.last_seen >= p_now - v_drop
    and not exists (
      select 1 from public.elo_matches x
      where x.status = 'playing' and (x.player_a in (q.user_id, me.user_id) or x.player_b in (q.user_id, me.user_id))
    )
    and not exists (
      select 1 from public.elo_matches x
      where x.status <> 'void' and x.player_b is not null
        and ((x.player_a = me.user_id and x.player_b = q.user_id) or (x.player_a = q.user_id and x.player_b = me.user_id))
        and x.created_at > p_now - v_rematch
    )
    and (
      v_my_window is null
      or public.elo_queue_window(extract(epoch from (p_now - q.since))::numeric, p_rules) is null
      or abs(q.rating - me.rating) <= greatest(v_my_window, public.elo_queue_window(extract(epoch from (p_now - q.since))::numeric, p_rules))
    )
  order by q.since, q.user_id
  limit 1;
  if not found then return; end if;

  if (me.since, me.user_id) <= (o.since, o.user_id) then
    v_a := me; v_b := o;
  else
    v_a := o; v_b := me;
  end if;
  insert into public.elo_matches (mode, status, player_a, player_b, question_ids, created_at, start_by)
    values (me.mode, 'playing', v_a.user_id, v_b.user_id, v_a.question_ids, p_now, p_now + v_deadline)
    returning id into v_id;
  update public.elo_queue set status = 'matched', match_id = v_id where user_id in (me.user_id, o.user_id);
end $$;

-- Joins the queue. Raises 'ELO_ACTIVE_MATCH' when the player has a match in 'playing'. A repeated join while searching only refreshes last_seen
-- (since, rating and question set stay); after 'timeout' it starts a new search. Then the same pairing attempt as in poll.
create or replace function public.elo_queue_join(p_user uuid, p_mode text, p_rating int, p_question_ids text[], p_now timestamptz, p_rules jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('elo_queue'));
  if exists (select 1 from public.elo_matches x where x.status = 'playing' and (x.player_a = p_user or x.player_b = p_user)) then
    raise exception 'ELO_ACTIVE_MATCH: player % already has a match in progress', p_user;
  end if;
  perform public.elo_queue_sweep(p_now, p_rules);

  insert into public.elo_queue as qq (user_id, mode, rating, question_ids, since, last_seen, status)
    values (p_user, p_mode, p_rating, p_question_ids, p_now, p_now, 'searching')
  on conflict (user_id) do update set
    mode         = case when qq.status = 'searching' then qq.mode         else excluded.mode         end,
    rating       = case when qq.status = 'searching' then qq.rating       else excluded.rating       end,
    question_ids = case when qq.status = 'searching' then qq.question_ids else excluded.question_ids end,
    since        = case when qq.status = 'searching' then qq.since        else excluded.since        end,
    last_seen    = excluded.last_seen,
    status       = 'searching',
    match_id     = null;

  perform public.elo_queue_try_match(p_user, p_now, p_rules);
  return public.elo_queue_state(p_user);
end $$;

-- One poll: housekeeping, refresh last_seen, try to pair, answer. 'timeout' is answered once, then the row is deleted (next answer: idle).
create or replace function public.elo_queue_poll(p_user uuid, p_now timestamptz, p_rules jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_state jsonb;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('elo_queue'));
  perform public.elo_queue_sweep(p_now, p_rules);
  update public.elo_queue set last_seen = p_now where user_id = p_user and status = 'searching';
  perform public.elo_queue_try_match(p_user, p_now, p_rules);
  v_state := public.elo_queue_state(p_user);
  if v_state ->> 'status' = 'timeout' then delete from public.elo_queue where user_id = p_user; end if;
  return v_state;
end $$;

-- Cancels the search: deletes a 'searching' / 'timeout' row. A pair that is already made can't be cancelled (the answer is 'matched'),
-- unless its match is over (then the row is just gone). p_now is unused: the cancel needs no rules; it is here so the three calls look alike.
create or replace function public.elo_queue_cancel(p_user uuid, p_now timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('elo_queue'));
  delete from public.elo_queue q
  where q.user_id = p_user and q.status = 'matched'
    and not exists (select 1 from public.elo_matches m where m.id = q.match_id and m.status = 'playing');
  delete from public.elo_queue where user_id = p_user and status in ('searching', 'timeout');
  return public.elo_queue_state(p_user);
end $$;

-- Leaderboards (docs/ELO.md 7). p_board: 'global' | 'season' | 'week'. Page is 1-based, size is capped at 50.
--   global: players with >= 10 finished matches, by rating desc, matches desc, updated_at asc (who got there first).
--   season: the current UTC month; players with >= 5 matches finished in it; same order.
--   week:   the current UTC week (Monday 00:00 -> next Monday): the sum of both players' points over FINISHED matches whose
--           finished_at is in the week (points_a for A, points_b for B); ties: more correct answers, then less total elapsed time.
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
    where p_board = 'week' and m.status = 'finished' and m.points_a is not null
      and m.finished_at >= v_from and m.finished_at < v_to
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
                     order by h.at desc, h.id desc limit 1), 100) as rating,
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
revoke all on function public.elo_queue_rule(jsonb, text) from public, anon, authenticated;
revoke all on function public.elo_queue_window(numeric, jsonb) from public, anon, authenticated;
revoke all on function public.elo_queue_state(uuid) from public, anon, authenticated;
revoke all on function public.elo_queue_sweep(timestamptz, jsonb) from public, anon, authenticated;
revoke all on function public.elo_queue_try_match(uuid, timestamptz, jsonb) from public, anon, authenticated;
revoke all on function public.elo_queue_join(uuid, text, int, text[], timestamptz, jsonb) from public, anon, authenticated;
revoke all on function public.elo_queue_poll(uuid, timestamptz, jsonb) from public, anon, authenticated;
revoke all on function public.elo_queue_cancel(uuid, timestamptz) from public, anon, authenticated;
revoke all on function public.elo_leaderboard(text, int, int, uuid) from public, anon, authenticated;
revoke all on function public.elo_close_season(text) from public, anon, authenticated;
grant execute on function public.elo_calc(int, int, int, int, text) to service_role;
grant execute on function public.elo_match_json(uuid, boolean) to service_role;
grant execute on function public.elo_finish_match(uuid) to service_role;
grant execute on function public.elo_void_match(uuid) to service_role;
grant execute on function public.elo_queue_join(uuid, text, int, text[], timestamptz, jsonb) to service_role;
grant execute on function public.elo_queue_poll(uuid, timestamptz, jsonb) to service_role;
grant execute on function public.elo_queue_cancel(uuid, timestamptz) to service_role;
-- (the helpers elo_queue_rule / _window / _state / _sweep / _try_match are internal: only the functions above call them)
grant execute on function public.elo_leaderboard(text, int, int, uuid) to service_role;
grant execute on function public.elo_close_season(text) to service_role;
