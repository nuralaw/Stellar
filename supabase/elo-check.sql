-- Stellar ranked matches (ELO): checks for the database side. Run in the Supabase SQL Editor AFTER supabase/elo.sql. Safe to re-run.
-- Each block raises an exception on the first mismatch and prints a NOTICE on success.
-- Part 1 only calls elo_calc (no data touched). Part 2 plays a few matches and a queue run-through through the real functions on
-- throw-away users and then rolls everything back itself; if your project has extra triggers on auth.users and the insert fails, Part 1 is still valid.
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
-- The throwaway players are rated 9000 (K 16) in elo_players. The queue part runs on a made-up clock a day ahead (v_t), so every real
-- queue row (last polled "a day ago" from its point of view) is swept inside this transaction and can't be paired with a throwaway
-- player; everything, the sweep included, is rolled back at the end, and nobody else can touch the queue meanwhile (the queue lock).
do $$
declare
  ua uuid := gen_random_uuid();
  ub uuid := gen_random_uuid();
  uc uuid := gen_random_uuid();
  ud uuid := gen_random_uuid();
  ue uuid := gen_random_uuid();
  m1 uuid := gen_random_uuid();
  m2 uuid := gen_random_uuid();
  ids text[] := array['q0','q1','q2','q3','q4','q5','q6','q7','q8','q9'];
  ids_b text[] := array['b0','b1','b2','b3','b4','b5','b6','b7','b8','b9'];
  -- The same numbers as QUEUE, QUEUE_WINDOW, START_DEADLINE_S and REMATCH_COOLDOWN_H in src/lib/elo-config.ts.
  v_rules jsonb := jsonb_build_object('base', 100, 'step', 100, 'every_s', 30, 'open_after_s', 120, 'drop_after_s', 15,
                                      'search_max_s', 300, 'start_deadline_s', 90, 'rematch_h', 24);
  v_t timestamptz := now() + interval '1 day';
  v_t2 timestamptz := now() + interval '1 day 1 hour';
  v_t3 timestamptz := now() + interval '1 day 2 hours';
  v_t4 timestamptz := now() + interval '1 day 3 hours';
  r jsonb;
  r2 jsonb;
  pa public.elo_players%rowtype;
  pb public.elo_players%rowtype;
  mm public.elo_matches%rowtype;
  v_mid uuid;
  v_r0 int;
  i int;
begin
  begin
    insert into auth.users (id) values (ua), (ub), (uc), (ud), (ue);
    insert into public.elo_players (user_id, rating, peak, matches) values (ua, 9000, 9000, 20), (ub, 9000, 9000, 20), (uc, 9000, 9000, 20);

    -- E1 through elo_finish_match: A wins at equal ratings (K 16 at 9000: +8 / -8).
    insert into public.elo_matches (id, status, player_a, player_b, question_ids, a_finished_at, b_finished_at, points_a, points_b)
      values (m1, 'playing', ua, ub, ids, now(), now(), 500, 400);
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
    insert into public.elo_matches (id, status, player_a, player_b, question_ids, a_finished_at, b_finished_at, points_a, points_b, forfeit)
      values (m2, 'playing', ua, ub, ids, now(), now(), 900, 100, 'a');
    r := public.elo_finish_match(m2);
    if r ->> 'result' <> 'b' or (r ->> 'delta_a')::int <> -8 or (r ->> 'delta_b')::int <> 8 then
      raise exception 'forfeit failed: %', r;
    end if;

    -- A 'playing' match can be voided by an admin without touching any rating (a finished one is reverted, above).
    delete from public.elo_matches where id in (m1, m2);
    insert into public.elo_matches (id, status, player_a, player_b, question_ids) values (m1, 'playing', uc, ud, ids);
    r := public.elo_void_match(m1);
    select * into pa from public.elo_players where user_id = uc;
    if r ->> 'status' <> 'void' or pa.rating <> 9000 or pa.matches <> 20 then raise exception 'voiding a playing match failed: % / %', r, pa; end if;
    delete from public.elo_matches where id = m1;

    -- Queue (docs/ELO-live.md 2): ua joins first, ub second; ub's join already makes the pair, the polls then answer the same match.
    r := public.elo_queue_join(ua, 'mixed', 9000, ids, v_t, v_rules);
    if r ->> 'status' <> 'searching' or (r ->> 'searching')::int <> 0 or r ->> 'match_id' is not null then
      raise exception 'queue join did not start a search: %', r;
    end if;
    r := public.elo_queue_join(ua, 'mixed', 9000, ids_b, v_t + interval '1 second', v_rules);   -- repeated join: only the sign of life moves
    if r ->> 'status' <> 'searching' or (r ->> 'since')::timestamptz <> v_t
       or (select question_ids from public.elo_queue where user_id = ua) <> ids then
      raise exception 'a repeated queue join reset the search: %', r;
    end if;
    r := public.elo_queue_join(ub, 'mixed', 9000, ids_b, v_t + interval '2 seconds', v_rules);
    if r ->> 'status' <> 'matched' or r ->> 'match_id' is null then raise exception 'two players did not get a match: %', r; end if;
    v_mid := (r ->> 'match_id')::uuid;
    r := public.elo_queue_poll(ua, v_t + interval '4 seconds', v_rules);
    r2 := public.elo_queue_poll(ub, v_t + interval '4 seconds', v_rules);
    if r ->> 'status' <> 'matched' or r2 ->> 'status' <> 'matched' or (r ->> 'match_id')::uuid <> v_mid or (r2 ->> 'match_id')::uuid <> v_mid then
      raise exception 'the two polls did not return the same match: % / % (expected %)', r, r2, v_mid;
    end if;
    if (select count(*) from public.elo_matches where player_a in (ua, ub) or player_b in (ua, ub)) <> 1 then
      raise exception 'the queue made more than one match for one pair';
    end if;
    select * into mm from public.elo_matches where id = v_mid;
    if mm.status <> 'playing' or mm.player_a <> ua or mm.player_b <> ub or mm.question_ids <> ids
       or mm.created_at <> v_t + interval '2 seconds'
       or mm.start_by <> mm.created_at + pg_catalog.make_interval(secs => ((v_rules ->> 'start_deadline_s')::int)::double precision) then
      raise exception 'the queue match has wrong fields (A must be who joined first, with their questions): %', mm;
    end if;

    -- A player in a match can't join; a made pair can't be cancelled.
    begin
      perform public.elo_queue_join(ua, 'mixed', 9000, ids, v_t + interval '5 seconds', v_rules);
      raise exception 'elo_queue_join let a player with a match in progress join';
    exception when others then
      if sqlerrm not like 'ELO_ACTIVE_MATCH%' then raise; end if;
    end;
    r := public.elo_queue_cancel(ua, v_t + interval '5 seconds');
    if r ->> 'status' <> 'matched' or (r ->> 'match_id')::uuid <> v_mid then raise exception 'cancel after the pair was made did not answer matched: %', r; end if;

    -- Finish the queue match (points first, as the server does); the queue rows are gone once the match is over.
    select rating into v_r0 from public.elo_players where user_id = ua;
    update public.elo_matches set a_finished_at = v_t, b_finished_at = v_t, points_a = 300, points_b = 200 where id = v_mid;
    r := public.elo_finish_match(v_mid);
    if r ->> 'status' <> 'finished' or r ->> 'result' <> 'a' then raise exception 'finishing the queue match failed: %', r; end if;
    r := public.elo_queue_poll(ua, v_t + interval '10 seconds', v_rules);
    if r ->> 'status' <> 'idle' or (select count(*) from public.elo_queue where user_id in (ua, ub)) <> 0 then
      raise exception 'the queue rows of a finished match were not removed: %', r;
    end if;

    -- The same pair can't meet again within 24 h (a finished match counts), then both leave.
    perform public.elo_queue_join(ua, 'mixed', 9000, ids, v_t + interval '20 seconds', v_rules);
    r := public.elo_queue_join(ub, 'mixed', 9000, ids_b, v_t + interval '21 seconds', v_rules);
    if r ->> 'status' <> 'searching' or (r ->> 'searching')::int <> 1 then raise exception 'a pair was matched again within 24 h: %', r; end if;
    -- Cancel first, count after: in one IF the count subquery would run before the cancels (Postgres evaluates it as an InitPlan).
    r := public.elo_queue_cancel(ua, v_t + interval '22 seconds');
    r2 := public.elo_queue_cancel(ub, v_t + interval '22 seconds');
    if r ->> 'status' <> 'idle' or r2 ->> 'status' <> 'idle'
       or (select count(*) from public.elo_queue where user_id in (ua, ub)) <> 0 then
      raise exception 'queue cancel did not remove the rows';
    end if;

    -- Voiding the queue match puts the ratings back.
    r := public.elo_void_match(v_mid);
    select * into pa from public.elo_players where user_id = ua;
    if r ->> 'status' <> 'void' or pa.rating <> v_r0 then raise exception 'voiding the queue match did not restore the rating: % / % (before the finish: %)', r, pa, v_r0; end if;

    -- The rating window: uc (9600) and ud (9000) are 600 apart. Polled every 10 s, they are paired at 120 s ("any rating") and not before (400 at 110 s).
    perform public.elo_queue_join(ud, 'mixed', 9000, ids, v_t2, v_rules);
    r := public.elo_queue_join(uc, 'mixed', 9600, ids_b, v_t2, v_rules);
    if r ->> 'status' <> 'searching' or (r ->> 'searching')::int <> 1 then raise exception 'the 600 gap was matched at 0 s: %', r; end if;
    for i in 1..12 loop
      r := public.elo_queue_poll(ud, v_t2 + make_interval(secs => i * 10), v_rules);
      if i < 12 and r ->> 'status' <> 'searching' then raise exception 'the 600 gap was matched too early (at % s): %', i * 10, r; end if;
      if i = 12 and r ->> 'status' <> 'matched' then raise exception 'the rating window did not open at 120 s: %', r; end if;
      if i < 12 then
        r2 := public.elo_queue_poll(uc, v_t2 + make_interval(secs => i * 10), v_rules);
        if r2 ->> 'status' <> 'searching' then raise exception 'the other player of the pair lost the search at % s: %', i * 10, r2; end if;
      end if;
    end loop;
    r2 := public.elo_queue_poll(uc, v_t2 + interval '121 seconds', v_rules);
    if r2 ->> 'status' <> 'matched' or r2 ->> 'match_id' <> r ->> 'match_id' then raise exception 'the pair got two different matches: % / %', r, r2; end if;

    -- Timeout: a search that polls every 10 s ends after 300 s with "timeout", answered once, then idle. (Mode 'math': nobody else is there.)
    perform public.elo_queue_join(ue, 'math', 9000, ids, v_t3, v_rules);
    for i in 1..29 loop
      r := public.elo_queue_poll(ue, v_t3 + make_interval(secs => i * 10), v_rules);
      if r ->> 'status' <> 'searching' then raise exception 'the search ended too early (at % s): %', i * 10, r; end if;
    end loop;
    r := public.elo_queue_poll(ue, v_t3 + interval '300 seconds', v_rules);
    if r ->> 'status' <> 'timeout' then raise exception 'the search did not time out at 300 s: %', r; end if;
    r := public.elo_queue_poll(ue, v_t3 + interval '310 seconds', v_rules);
    if r ->> 'status' <> 'idle' then raise exception 'timeout was not reported once: %', r; end if;

    -- No poll for more than 15 s: the player drops out of the queue.
    perform public.elo_queue_join(ue, 'math', 9000, ids, v_t4, v_rules);
    r := public.elo_queue_poll(ue, v_t4 + interval '16 seconds', v_rules);
    if r ->> 'status' <> 'idle' or (select count(*) from public.elo_queue where user_id = ue) <> 0 then raise exception 'a silent player stayed in the queue: %', r; end if;

    -- A match whose second player is gone (account deleted) becomes void without touching any rating.
    select rating into v_r0 from public.elo_players where user_id = ua;
    insert into public.elo_matches (id, status, player_a, question_ids, a_finished_at, b_finished_at, points_a, points_b)
      values (m2, 'playing', ua, ids, now(), now(), 1, 0);
    r := public.elo_finish_match(m2);
    select * into pa from public.elo_players where user_id = ua;
    if r ->> 'status' <> 'void' or pa.rating <> v_r0 then raise exception 'finish without a second player failed: % / %', r, pa; end if;

    -- The boards run and shape their answer.
    r := public.elo_leaderboard('global', 1, 10, ua);
    if jsonb_typeof(r -> 'rows') <> 'array' or r -> 'total' is null then raise exception 'global board has a wrong shape: %', r; end if;
    r := public.elo_leaderboard('season', 1, 10, ua);
    if jsonb_typeof(r -> 'rows') <> 'array' then raise exception 'season board has a wrong shape: %', r; end if;
    r := public.elo_leaderboard('week', 1, 100, ua);
    if jsonb_typeof(r -> 'rows') <> 'array' or jsonb_array_length(r -> 'rows') > 50 then raise exception 'week board has a wrong shape: %', r; end if;
    perform public.elo_close_season('2020-01');

    -- A new player starts at the floor: rating 100, peak 100 (START_RATING in src/lib/elo-config.ts).
    insert into public.elo_players (user_id) values (ud);
    select * into pa from public.elo_players where user_id = ud;
    if pa.rating <> 100 or pa.peak <> 100 then raise exception 'a new elo_players row does not start at 100 / 100: %', pa; end if;

    raise exception 'ELO_CHECK_ROLLBACK';
  exception when others then
    if sqlerrm <> 'ELO_CHECK_ROLLBACK' then raise; end if;
  end;

  raise notice 'elo-check part 2 OK: finish, idempotency, void, forfeit, queue (pair, A, rematch, window, timeout, drop, cancel), start rating, boards (all rolled back)';
end $$;
