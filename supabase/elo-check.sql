-- Stellar ranked matches (ELO): checks for the database side. Run in the Supabase SQL Editor AFTER supabase/elo.sql. Safe to re-run.
-- Each block raises an exception on the first mismatch and prints a NOTICE on success.
-- Part 1 only calls elo_calc (no data touched). Part 2 plays a few matches through the real functions on throw-away users and
-- then rolls everything back itself; if your project has extra triggers on auth.users and the insert fails, Part 1 is still valid.
-- Expected numbers are the cases of docs/ELO.md section 4.4 (E1-E6) and of src/lib/elo.test.ts.

-- Part 1: the formula.
do $$
declare
  c record;
  r jsonb;
begin
  for c in
    select * from (values
      -- name,                         ra,   rb,  ma, mb, result, delta_a, delta_b, rating_a, rating_b
      ('E1 equal ratings, A wins',     1000, 1000, 20, 20, 'a',     12,    -12,    1012,     988),
      ('E2 favourite wins',            1200, 1000, 20, 20, 'a',      6,     -6,    1206,     994),
      ('E3 upset (B wins)',            1200, 1000, 20, 20, 'b',    -18,     18,    1182,    1018),
      ('E4 draw',                      1100, 1000, 20, 20, 'draw',  -3,      3,    1097,    1003),
      ('E5 A in calibration (K 40)',   1000, 1000,  3, 20, 'a',     20,    -12,    1020,     988),
      ('E6 floor at 100',               105,  105, 20, 20, 'b',     -5,     12,     100,     117),
      ('forfeit by A = B wins',        1000, 1000, 20, 20, 'b',    -12,     12,     988,    1012),
      ('draw at equal ratings',        1000, 1000, 20, 20, 'draw',   0,      0,    1000,    1000),
      ('both calibrating, draw',       1000, 1000,  0,  0, 'draw',   0,      0,    1000,    1000),
      ('floor from exactly 100',        100,  100, 20, 20, 'b',      0,     12,     100,     112),
      ('incoming rating below 100',      50,  100, 20, 20, 'b',      0,     12,     100,     112),
      ('K 16 from rating 2000',        2000, 2000, 20, 20, 'a',      8,     -8,    2008,    1992),
      ('K 24 just below 2000',         1999, 1999, 20, 20, 'a',     12,    -12,    2011,    1987),
      ('9 matches = calibration',      1000, 1000,  9, 10, 'a',     20,    -12,    1020,     988),
      ('10 matches = regular',         1000, 1000, 10, 10, 'a',     12,    -12,    1012,     988)
    ) as t(name, ra, rb, ma, mb, res, da, db, xa, xb)
  loop
    r := public.elo_calc(c.ra, c.rb, c.ma, c.mb, c.res);
    if (r ->> 'delta_a')::int <> c.da or (r ->> 'delta_b')::int <> c.db
       or (r ->> 'rating_a')::int <> c.xa or (r ->> 'rating_b')::int <> c.xb then
      raise exception 'elo_calc FAILED for %: got % / expected delta_a %, delta_b %, rating_a %, rating_b %', c.name, r, c.da, c.db, c.xa, c.xb;
    end if;
  end loop;

  -- round(numeric) goes half away from zero (round(double precision) would go to even).
  if round(2.5::numeric) <> 3 or round(-2.5::numeric) <> -3 or round(0.5::numeric) <> 1 or round(-0.5::numeric) <> -1 then
    raise exception 'round(numeric) is not half-away-from-zero';
  end if;
  if (public.elo_calc(1200, 1000, 20, 20, 'a') ->> 'expected_a')::numeric <> 0.759747 then
    raise exception 'expected score of 1200 vs 1000 is not 0.7597: %', public.elo_calc(1200, 1000, 20, 20, 'a');
  end if;

  begin
    perform public.elo_calc(1000, 1000, 20, 20, 'nope');
    raise exception 'elo_calc accepted a bad result';
  exception when others then
    if sqlerrm not like 'elo_calc: bad result%' then raise; end if;
  end;

  raise notice 'elo-check part 1 OK: elo_calc matches docs/ELO.md 4.4 (E1-E6) and the extra cases';
end $$;

-- Part 2: the functions on real rows (rolled back at the end).
-- The throwaway players are rated 9000 (K 16), so they can never be matched with a real waiting match in the live queue
-- (the matchmaking window is at most 400), and a real player can never be matched with them.
do $$
declare
  ua uuid := gen_random_uuid();
  ub uuid := gen_random_uuid();
  uc uuid := gen_random_uuid();
  m1 uuid := gen_random_uuid();
  m2 uuid := gen_random_uuid();
  ids text[] := array['q0','q1','q2','q3','q4','q5','q6','q7','q8','q9'];
  r jsonb;
  pa public.elo_players%rowtype;
  pb public.elo_players%rowtype;
  v_claim uuid;
begin
  begin
    insert into auth.users (id) values (ua), (ub), (uc);
    insert into public.elo_players (user_id, rating, peak, matches) values (ua, 9000, 9000, 20), (ub, 9000, 9000, 20), (uc, 9000, 9000, 20);

    -- E1 through elo_finish_match: A wins at equal ratings (K 16 at 9000: +8 / -8).
    insert into public.elo_matches (id, status, player_a, player_b, question_ids, a_finished_at, b_started_at, points_a, points_b)
      values (m1, 'playing_b', ua, ub, ids, now(), now(), 500, 400);
    r := public.elo_finish_match(m1);
    if r ->> 'status' <> 'finished' or r ->> 'result' <> 'a' or (r ->> 'delta_a')::int <> 8 or (r ->> 'delta_b')::int <> -8
       or (r ->> 'changed')::boolean is not true then
      raise exception 'elo_finish_match E1 failed: %', r;
    end if;
    select * into pa from public.elo_players where user_id = ua;
    select * into pb from public.elo_players where user_id = ub;
    if pa.rating <> 9008 or pb.rating <> 8992 or pa.matches <> 21 or pb.matches <> 21 or pa.wins <> 1 or pb.losses <> 1 or pa.peak <> 9008 then
      raise exception 'elo_finish_match E1 left wrong player rows: % / %', pa, pb;
    end if;
    if (select count(*) from public.elo_history where match_id = m1) <> 2 then
      raise exception 'elo_finish_match E1 wrote % history rows, expected 2', (select count(*) from public.elo_history where match_id = m1);
    end if;

    -- Calling it again changes nothing.
    r := public.elo_finish_match(m1);
    select * into pa from public.elo_players where user_id = ua;
    if (r ->> 'changed')::boolean is not false or pa.rating <> 9008 or pa.matches <> 21
       or (select count(*) from public.elo_history where match_id = m1) <> 2 then
      raise exception 'elo_finish_match is not idempotent: % / %', r, pa;
    end if;

    -- Void puts both back (each player's own delta is subtracted), and a second void changes nothing.
    r := public.elo_void_match(m1);
    select * into pa from public.elo_players where user_id = ua;
    select * into pb from public.elo_players where user_id = ub;
    if r ->> 'status' <> 'void' or pa.rating <> 9000 or pb.rating <> 9000 or pa.matches <> 20 or pb.matches <> 20
       or pa.wins <> 0 or pb.losses <> 0 or pa.peak <> 9000 then
      raise exception 'elo_void_match failed: % / % / %', r, pa, pb;
    end if;
    r := public.elo_void_match(m1);
    select * into pa from public.elo_players where user_id = ua;
    if (r ->> 'changed')::boolean is not false or pa.rating <> 9000 then
      raise exception 'elo_void_match is not idempotent: % / %', r, pa;
    end if;

    -- Forfeit: A has more points but forfeited, so B wins.
    insert into public.elo_matches (id, status, player_a, player_b, question_ids, a_finished_at, b_started_at, points_a, points_b, forfeit)
      values (m2, 'playing_b', ua, ub, ids, now(), now(), 900, 100, 'a');
    r := public.elo_finish_match(m2);
    if r ->> 'result' <> 'b' or (r ->> 'delta_a')::int <> -8 or (r ->> 'delta_b')::int <> 8 then
      raise exception 'forfeit failed: %', r;
    end if;

    -- Matchmaking: C takes the waiting match of A; A cannot take their own; nothing is left for a second try.
    delete from public.elo_matches where id in (m1, m2);
    insert into public.elo_matches (id, status, player_a, question_ids, a_finished_at, expires_at, points_a)
      values (m1, 'waiting', ua, ids, now(), now() + interval '48 hours', 300);
    if public.elo_claim_waiting(ua, 9000, 'mixed', now()) is not null then
      raise exception 'elo_claim_waiting let a player take their own match';
    end if;
    if public.elo_claim_waiting(uc, 9000, 'rw', now()) is not null then
      raise exception 'elo_claim_waiting ignored the mode';
    end if;
    if public.elo_claim_waiting(uc, 9600, 'mixed', now()) is not null then
      raise exception 'elo_claim_waiting ignored the rating window';
    end if;
    v_claim := public.elo_claim_waiting(uc, 9000, 'mixed', now());
    if v_claim is distinct from m1 or (select status from public.elo_matches where id = m1) <> 'playing_b'
       or (select player_b from public.elo_matches where id = m1) <> uc then
      raise exception 'elo_claim_waiting did not claim the waiting match: %', v_claim;
    end if;
    if public.elo_claim_waiting(ub, 9000, 'mixed', now()) is not null then
      raise exception 'elo_claim_waiting claimed a match twice';
    end if;

    -- A player in a match already can't claim another one.
    begin
      perform public.elo_claim_waiting(uc, 9000, 'mixed', now());
      raise exception 'elo_claim_waiting let a player with a match in progress claim again';
    exception when others then
      if sqlerrm not like 'ELO_ACTIVE_MATCH%' then raise; end if;
    end;

    -- A waiting match older than 48 h expires without touching ratings.
    update public.elo_matches set status = 'waiting', player_b = null, b_started_at = null where id = m1;
    update public.elo_matches set a_finished_at = now() - interval '49 hours', expires_at = now() - interval '1 hour' where id = m1;
    -- Call first, check after: one SQL expression reads the table from a snapshot taken before the function's own update.
    v_claim := public.elo_claim_waiting(uc, 9000, 'mixed', now());
    if v_claim is not null or (select status from public.elo_matches where id = m1) <> 'expired' then
      raise exception 'a stale waiting match was not expired';
    end if;

    -- A match whose second player is gone (account deleted) becomes void without touching any rating.
    insert into public.elo_matches (id, status, player_a, question_ids, a_finished_at, b_started_at, points_a, points_b)
      values (m2, 'playing_b', ua, ids, now(), now(), 1, 0);
    r := public.elo_finish_match(m2);
    select * into pa from public.elo_players where user_id = ua;
    if r ->> 'status' <> 'void' or pa.rating <> 8992 then raise exception 'finish without a second player failed: % / %', r, pa; end if;

    -- The boards run and shape their answer.
    r := public.elo_leaderboard('global', 1, 10, ua);
    if jsonb_typeof(r -> 'rows') <> 'array' or r -> 'total' is null then raise exception 'global board has a wrong shape: %', r; end if;
    r := public.elo_leaderboard('season', 1, 10, ua);
    if jsonb_typeof(r -> 'rows') <> 'array' then raise exception 'season board has a wrong shape: %', r; end if;
    r := public.elo_leaderboard('week', 1, 100, ua);
    if jsonb_typeof(r -> 'rows') <> 'array' or jsonb_array_length(r -> 'rows') > 50 then raise exception 'week board has a wrong shape: %', r; end if;
    perform public.elo_close_season('2020-01');

    raise exception 'ELO_CHECK_ROLLBACK';
  exception when others then
    if sqlerrm <> 'ELO_CHECK_ROLLBACK' then raise; end if;
  end;

  raise notice 'elo-check part 2 OK: finish, idempotency, void, forfeit, claim, expiry, boards (all rolled back)';
end $$;
