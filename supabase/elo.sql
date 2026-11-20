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
