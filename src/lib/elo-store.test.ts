// Run: npm run elo:store-test  (node:test on the LOCAL file store; --conditions=react-server lets "server-only" load under plain Node).
// The Supabase twin of these rules is supabase/elo.sql (checked by supabase/elo-check.sql, run by the owner); here it is only checked
// for what it sends and how it reads the answers (mocked fetch).
// Matches are made the way the product makes them: two players join the queue (docs/ELO-live.md 2) and the queue pairs them.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { applyElo, matchResult } from "./elo.ts";
import {
  MAX_MATCHES_PER_DAY,
  QUEUE,
  QUEUE_WINDOW,
  RATING_FLOOR,
  REMATCH_COOLDOWN_H,
  START_DEADLINE_S,
  START_RATING,
} from "./elo-config.ts";
import {
  createLocalStore,
  createSupabaseStore,
  EloActiveMatchError,
  EloInvalidIdError,
  EloLimitError,
  EloNotFoundError,
  type EloMatch,
  type EloStore,
  type LocalDb,
  type QueueRecord,
} from "./elo-store.ts";

const S = 1000;
const H = 3_600_000;
const DAY = 24 * H;
const T0 = Date.UTC(2026, 10, 18, 12, 0, 0); // Wed 2026-11-18
const NOW = Date.UTC(2026, 10, 20, 12, 0, 0); // Fri 2026-11-20 (week 16-23 Nov, month Nov)
const IDS = Array.from({ length: 10 }, (_, i) => `q${i}`);
const IDS_B = Array.from({ length: 10 }, (_, i) => `b${i}`);

function fresh() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "elo-store-"));
  const file = path.join(dir, "elo.json");
  return { file, store: createLocalStore(file) };
}
function edit(file: string, fn: (db: LocalDb) => void) {
  const db = JSON.parse(fs.readFileSync(file, "utf8")) as LocalDb;
  fn(db);
  fs.writeFileSync(file, JSON.stringify(db));
}
const readDb = (file: string) => JSON.parse(fs.readFileSync(file, "utf8")) as LocalDb;
const uid = () => randomUUID();

async function player(s: EloStore, file: string, o: { rating?: number; matches?: number; name?: string; updatedAt?: number } = {}) {
  const id = uid();
  await s.ensurePlayer(id, { name: o.name ?? "P" }, o.updatedAt ?? T0);
  edit(file, (db) => {
    const p = db.players[id];
    if (o.rating !== undefined) {
      p.rating = o.rating;
      p.peak = Math.max(p.peak, o.rating);
    }
    if (o.matches !== undefined) p.matches = o.matches;
  });
  return id;
}

function blank(over: Partial<EloMatch> & Pick<EloMatch, "playerA" | "status">): EloMatch {
  return {
    id: uid(), mode: "mixed", playerB: null, questionIds: IDS, createdAt: T0, aStartedAt: null, bStartedAt: null, aFinishedAt: null, bFinishedAt: null,
    startBy: null, finishedAt: null, pointsA: null, pointsB: null, forfeit: null, result: null, ratingABefore: null, ratingBBefore: null, deltaA: null, deltaB: null,
    ...over,
  };
}

/**
 * `a` joins the queue first, `b` one second later (with other question sets, so the match's set shows who was A); then both are polled every
 * 10 s (a keeps polling too, as the page does) until the queue pairs them or `maxS` seconds have passed. Returns the last answers.
 */
async function trySearch(s: EloStore, a: string, b: string, o: { ra?: number; rb?: number; at?: number; mode?: "mixed" | "rw" | "math"; maxS?: number } = {}) {
  const at = o.at ?? T0;
  const mode = o.mode ?? "mixed";
  await s.queueJoin({ userId: a, mode, rating: o.ra ?? START_RATING, questionIds: IDS, now: at });
  let recB = await s.queueJoin({ userId: b, mode, rating: o.rb ?? START_RATING, questionIds: IDS_B, now: at + S });
  let t = S;
  while (recB.status !== "matched" && t < (o.maxS ?? 130) * S) {
    t += 10 * S;
    await s.queuePoll({ userId: a, now: at + t });
    recB = await s.queuePoll({ userId: b, now: at + t });
  }
  const recA = await s.queuePoll({ userId: a, now: at + t });
  return { recA, recB, at: at + t };
}

/** The queue pairs a and b (a is A); the match is returned. */
async function pairUp(s: EloStore, a: string, b: string, o: { ra?: number; rb?: number; at?: number; mode?: "mixed" | "rw" | "math" } = {}) {
  const { recA, recB } = await trySearch(s, a, b, o);
  assert.equal(recB.status, "matched", "the queue should pair them");
  assert.equal(recA.status, "matched");
  assert.equal(recA.matchId, recB.matchId);
  const m = await s.getMatch(recA.matchId!);
  assert.ok(m);
  return m;
}

interface Play {
  ra: number; rb: number; ma?: number; mb?: number; pointsA: number; pointsB: number; forfeit?: "a" | "b";
}
/** queue -> pair -> both parts closed -> finish. */
async function play(s: EloStore, file: string, o: Play) {
  const a = await player(s, file, { rating: o.ra, matches: o.ma ?? 20 });
  const b = await player(s, file, { rating: o.rb, matches: o.mb ?? 20 });
  const m = await pairUp(s, a, b, { ra: o.ra, rb: o.rb });
  const closed = await s.updateMatch(
    m.id,
    { aFinishedAt: m.createdAt + 5 * 60_000, bFinishedAt: m.createdAt + 6 * 60_000, pointsA: o.pointsA, pointsB: o.pointsB, ...(o.forfeit ? { forfeit: o.forfeit } : {}) },
    ["playing"],
  );
  assert.ok(closed);
  const out = await s.finishMatch(m.id, m.createdAt + 7 * 60_000);
  return { a, b, id: m.id, out, match: m };
}

// --- E1-E6 through queue -> finish, and parity with the TypeScript formulas ---

const E_CASES: { n: string; p: Play; da: number; db: number; ra: number; rb: number }[] = [
  { n: "E1", p: { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 }, da: 12, db: -12, ra: 1012, rb: 988 },
  { n: "E2", p: { ra: 1200, rb: 1000, pointsA: 500, pointsB: 400 }, da: 6, db: -6, ra: 1206, rb: 994 },
  { n: "E3", p: { ra: 1200, rb: 1000, pointsA: 400, pointsB: 500 }, da: -18, db: 18, ra: 1182, rb: 1018 },
  { n: "E4", p: { ra: 1100, rb: 1000, pointsA: 450, pointsB: 450 }, da: -3, db: 3, ra: 1097, rb: 1003 },
  { n: "E5", p: { ra: 1000, rb: 1000, ma: 3, pointsA: 500, pointsB: 400 }, da: 20, db: -12, ra: 1020, rb: 988 },
  { n: "E6", p: { ra: 105, rb: 105, pointsA: 400, pointsB: 500 }, da: -5, db: 12, ra: 100, rb: 117 },
  { n: "forfeit by A", p: { ra: 1000, rb: 1000, pointsA: 900, pointsB: 100, forfeit: "a" }, da: -12, db: 12, ra: 988, rb: 1012 },
];

for (const c of E_CASES) {
  test(`${c.n}: finish gives the document's deltas and equals applyElo`, async () => {
    const { file, store } = fresh();
    const { a, b, out } = await play(store, file, c.p);
    assert.equal(out.status, "finished");
    assert.equal(out.changed, true);
    assert.equal(out.deltaA, c.da);
    assert.equal(out.deltaB, c.db);
    assert.equal(out.ratingAAfter, c.ra);
    assert.equal(out.ratingBAfter, c.rb);
    const ts = applyElo({
      a: { rating: c.p.ra, matches: c.p.ma ?? 20 },
      b: { rating: c.p.rb, matches: c.p.mb ?? 20 },
      result: matchResult(c.p.pointsA, c.p.pointsB, c.p.forfeit),
    });
    assert.equal(out.deltaA, ts.deltaA);
    assert.equal(out.deltaB, ts.deltaB);
    assert.equal((await store.getPlayer(a))?.rating, ts.ratingA);
    assert.equal((await store.getPlayer(b))?.rating, ts.ratingB);
  });
}

test("E1 flow: queue -> playing -> finished, counters and history", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: 1000, matches: 20 });
  const b = await player(store, file, { rating: 1000, matches: 20 });
  const m = await pairUp(store, a, b, { ra: 1000, rb: 1000 });
  assert.equal(m.status, "playing");
  assert.equal(m.playerA, a);
  assert.equal(m.playerB, b);
  assert.deepEqual([m.aStartedAt, m.bStartedAt, m.aFinishedAt, m.bFinishedAt, m.finishedAt, m.pointsA, m.pointsB], [null, null, null, null, null, null, null]);
  assert.equal(m.startBy, m.createdAt + START_DEADLINE_S * S);
  assert.equal(await store.updateMatch(m.id, { pointsA: 1 }, ["finished"]), null, "a status guard that doesn't match changes nothing");
  const patched = await store.updateMatch(m.id, { aStartedAt: T0 + 20 * S, bStartedAt: T0 + 30 * S, aFinishedAt: T0 + H, bFinishedAt: T0 + 2 * H, pointsA: 500, pointsB: 400 }, ["playing"]);
  assert.deepEqual([patched?.aStartedAt, patched?.bStartedAt, patched?.aFinishedAt, patched?.bFinishedAt, patched?.pointsA, patched?.pointsB], [T0 + 20 * S, T0 + 30 * S, T0 + H, T0 + 2 * H, 500, 400]);
  assert.equal(patched?.status, "playing", "a patch never moves the status");
  const out = await store.finishMatch(m.id, T0 + 3 * H);
  assert.equal(out.result, "a");
  assert.equal(out.finishedAt, T0 + 3 * H);
  const pa = (await store.getPlayer(a))!;
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pa.rating, pa.peak, pa.matches, pa.wins, pa.losses, pa.draws], [1012, 1012, 21, 1, 0, 0]);
  assert.deepEqual([pb.rating, pb.peak, pb.matches, pb.wins, pb.losses, pb.draws], [988, 1000, 21, 0, 1, 0]);
  assert.equal(readDb(file).history.filter((h) => h.matchId === m.id).length, 2);
  assert.equal((await store.getMatch(m.id))?.status, "finished");
});

test("finishing twice applies the rating once", async () => {
  const { file, store } = fresh();
  const { a, id } = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 });
  const again = await store.finishMatch(id, T0 + 5 * H);
  assert.equal(again.changed, false);
  assert.equal(again.status, "finished");
  assert.equal(again.deltaA, 12);
  const pa = (await store.getPlayer(a))!;
  assert.deepEqual([pa.rating, pa.matches, pa.wins], [1012, 21, 1]);
  assert.equal(readDb(file).history.length, 2);
});

test("finish needs the points of both parts; nothing changes until they are there", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const m = await pairUp(store, a, b);
  await assert.rejects(store.finishMatch(m.id), /no points/);
  await store.updateMatch(m.id, { pointsA: 300, aFinishedAt: T0 });
  await assert.rejects(store.finishMatch(m.id), /no points/, "only A's part is closed");
  assert.equal((await store.getMatch(m.id))?.status, "playing");
  assert.equal((await store.getPlayer(a))?.matches, 0);
  await store.updateMatch(m.id, { pointsB: 200, bFinishedAt: T0 });
  assert.equal((await store.finishMatch(m.id, T0 + H)).status, "finished");
  assert.equal((await store.finishMatch(m.id, T0 + 2 * H)).changed, false);
});

// --- void ---

test("void reverts a finished match by subtracting each delta from the CURRENT rating", async () => {
  const { file, store } = fresh();
  const { a, b, id } = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 });
  edit(file, (db) => {
    db.players[a].rating = 1050; // a later match moved A
    db.players[a].peak = 1050;
  });
  const out = await store.voidMatch(id, T0 + 9 * H);
  assert.equal(out.status, "void");
  assert.equal(out.changed, true);
  const pa = (await store.getPlayer(a))!;
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pa.rating, pa.matches, pa.wins, pa.peak], [1038, 20, 0, 1038], "peak comes from the history of the remaining matches, never below the rating");
  assert.deepEqual([pb.rating, pb.matches, pb.losses, pb.peak], [1000, 20, 0, 1000]);
  const again = await store.voidMatch(id);
  assert.equal(again.changed, false);
  assert.equal((await store.getPlayer(a))?.rating, 1038);
});

test("void of a clean E1 puts everything back; peak is recomputed", async () => {
  const { file, store } = fresh();
  const { a, b, id } = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 });
  await store.voidMatch(id);
  const pa = (await store.getPlayer(a))!;
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pa.rating, pa.peak, pa.matches, pa.wins], [1000, 1000, 20, 0]);
  assert.deepEqual([pb.rating, pb.peak, pb.matches, pb.losses], [1000, 1000, 20, 0]);
});

test("void respects the rating floor", async () => {
  const { file, store } = fresh();
  const { a, id } = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 }); // A +12
  edit(file, (db) => {
    db.players[a].rating = 105; // A has dropped since
  });
  await store.voidMatch(id);
  assert.equal((await store.getPlayer(a))?.rating, 100, "105 - 12 = 93 -> floor 100");
});

test("void of a draw takes back the draw counters", async () => {
  const { file, store } = fresh();
  const { a, b, id } = await play(store, file, { ra: 1100, rb: 1000, pointsA: 450, pointsB: 450 });
  assert.equal((await store.getPlayer(a))?.draws, 1);
  await store.voidMatch(id);
  const pa = (await store.getPlayer(a))!;
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pa.draws, pa.rating, pb.draws, pb.rating], [0, 1100, 0, 1000]);
});

test("void of a playing match just voids it (no rating change); the queue forgets the pair", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const m = await pairUp(store, a, b);
  const out = await store.voidMatch(m.id);
  assert.equal(out.status, "void");
  assert.equal(out.changed, true);
  assert.equal((await store.getPlayer(a))?.rating, START_RATING);
  assert.equal((await store.getPlayer(a))?.matches, 0);
  assert.equal((await store.getPlayer(b))?.matches, 0);
  assert.equal((await store.queuePoll({ userId: a, now: T0 + 5 * 60_000 })).status, "idle", "a voided match is not 'playing' any more");
  assert.equal((await store.queuePoll({ userId: b, now: T0 + 5 * 60_000 })).status, "idle");
  assert.deepEqual(readDb(file).queue, {});
});

test("setForfeit: the first call sets it, a second (even for the other side) doesn't overwrite; only while playing", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const m = await pairUp(store, a, b);
  assert.equal(await store.setForfeit(m.id, "b"), true);
  assert.equal((await store.getMatch(m.id))!.forfeit, "b");
  assert.equal(await store.setForfeit(m.id, "a"), false);
  assert.equal(await store.setForfeit(m.id, "b"), false);
  assert.equal((await store.getMatch(m.id))!.forfeit, "b");
  // Not a playing match / unknown id: nothing is set.
  const m2 = await pairUp(store, await player(store, file), await player(store, file), { at: T0 + DAY });
  await store.voidMatch(m2.id);
  assert.equal(await store.setForfeit(m2.id, "a"), false);
  assert.equal((await store.getMatch(m2.id))!.forfeit, null);
  assert.equal(await store.setForfeit(uid(), "a"), false);
});

test("Supabase store: setForfeit patches only a playing match without a forfeit and answers whether it wrote", async () => {
  const id = uid();
  await withFetch(
    () => new Response(JSON.stringify([{ id }]), { status: 200 }),
    async (seen) => {
      assert.equal(await createSupabaseStore("http://sb.test", "key").setForfeit(id, "a"), true);
      const r = seen[0];
      assert.equal(r.method, "PATCH");
      assert.ok(r.url.includes(`id=eq.${id}`) && r.url.includes("status=eq.playing") && r.url.includes("forfeit=is.null"));
      assert.deepEqual(JSON.parse(r.body), { forfeit: "a" });
    },
  );
  await withFetch(
    () => new Response("[]", { status: 200 }),
    async () => assert.equal(await createSupabaseStore("http://sb.test", "key").setForfeit(id, "b"), false),
  );
  assert.equal(await createSupabaseStore("http://127.0.0.1:9", "key").setForfeit("not-a-uuid", "a"), false);
});

// --- the queue: pairing ---

test("queue: two players -> exactly one playing match; A is who joined first, with A's questions", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const first = await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  assert.deepEqual(first, { status: "searching", since: T0, matchId: null, searching: 0 });
  const second = await store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 + 5 * S });
  assert.equal(second.status, "matched");
  assert.equal(second.since, T0 + 5 * S);
  assert.equal(second.searching, 0);
  const pa = await store.queuePoll({ userId: a, now: T0 + 6 * S });
  assert.equal(pa.status, "matched");
  assert.equal(pa.matchId, second.matchId, "the first player's poll returns the same match");
  assert.equal(pa.since, T0);
  const all = Object.values(readDb(file).matches);
  assert.equal(all.length, 1);
  const m = all[0];
  assert.equal(m.status, "playing");
  assert.equal(m.playerA, a);
  assert.equal(m.playerB, b);
  assert.deepEqual(m.questionIds, IDS, "A's set, not B's");
  assert.equal(m.mode, "mixed");
  assert.equal(m.createdAt, T0 + 5 * S, "created when the pair was made");
  assert.equal(m.startBy, T0 + 5 * S + START_DEADLINE_S * S);
  assert.deepEqual([m.aStartedAt, m.bStartedAt, m.aFinishedAt, m.bFinishedAt, m.finishedAt, m.pointsA, m.pointsB, m.result], [null, null, null, null, null, null, null, null]);
  // A reload (another poll) of either player gives the same match as long as it is playing.
  assert.equal((await store.queuePoll({ userId: b, now: T0 + 30 * S })).matchId, m.id);
  assert.equal((await store.queuePoll({ userId: a, now: T0 + 31 * S })).matchId, m.id);
  assert.equal(Object.keys(readDb(file).matches).length, 1);
});

test("queue: a tie in `since` goes to the smaller user id as A", async () => {
  const { store } = fresh();
  const [lo, hi] = [uid(), uid()].sort();
  await store.queueJoin({ userId: hi, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 });
  const rec = await store.queueJoin({ userId: lo, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  assert.equal(rec.status, "matched");
  const m = (await store.getMatch(rec.matchId!))!;
  assert.deepEqual([m.playerA, m.playerB], [lo, hi]);
  assert.deepEqual(m.questionIds, IDS);
});

test("queue: the one who searched LONGEST gets the pair (and is A), not the first one that fits", async () => {
  const { store } = fresh();
  const [a, b, c] = [uid(), uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: 1000, questionIds: IDS, now: T0 });
  const rb = await store.queueJoin({ userId: b, mode: "mixed", rating: 1150, questionIds: IDS_B, now: T0 + S });
  assert.equal(rb.status, "searching", "150 apart: outside both windows (100)");
  const rc = await store.queueJoin({ userId: c, mode: "mixed", rating: 1100, questionIds: IDS_B, now: T0 + 2 * S });
  assert.equal(rc.status, "matched");
  const m = (await store.getMatch(rc.matchId!))!;
  assert.deepEqual([m.playerA, m.playerB], [a, c], "a searched longest; b keeps waiting");
  assert.equal((await store.queuePoll({ userId: b, now: T0 + 3 * S })).status, "searching");
});

test("queue: the rating window grows with the search; the longer searcher's window counts for both", async () => {
  const { store } = fresh();
  const [a, b] = [uid(), uid()];
  // 100 vs 450 = 350 apart: needs +-400, which a window reaches after 90 s of searching.
  await store.queueJoin({ userId: a, mode: "mixed", rating: 100, questionIds: IDS, now: T0 });
  assert.equal((await store.queueJoin({ userId: b, mode: "mixed", rating: 450, questionIds: IDS_B, now: T0 })).status, "searching", "not at 0 s");
  for (let s = 10; s <= 80; s += 10) {
    await store.queuePoll({ userId: a, now: T0 + s * S });
    assert.equal((await store.queuePoll({ userId: b, now: T0 + s * S })).status, "searching", `not at ${s} s (window ${100 + 100 * Math.floor(s / 30)})`);
  }
  await store.queuePoll({ userId: a, now: T0 + 89 * S });
  assert.equal((await store.queuePoll({ userId: b, now: T0 + 89 * S })).status, "searching", "89 s: still +-300");
  const hit = await store.queuePoll({ userId: a, now: T0 + 90 * S });
  assert.equal(hit.status, "matched", "90 s: +-400");
  assert.equal((await store.queuePoll({ userId: b, now: T0 + 91 * S })).matchId, hit.matchId);
});

test("queue: a late joiner is matched at once if the earlier player's window already reaches", async () => {
  const { store } = fresh();
  const [a, b] = [uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: 1000, questionIds: IDS, now: T0 });
  for (let s = 10; s <= 60; s += 10) await store.queuePoll({ userId: a, now: T0 + s * S });
  // At 60 s a's window is +-300; b (own window +-100) is 250 away and still fits.
  const rec = await store.queueJoin({ userId: b, mode: "mixed", rating: 1250, questionIds: IDS_B, now: T0 + 60 * S });
  assert.equal(rec.status, "matched");
});

test("queue: after 120 s of searching any rating fits (not at 119 s)", async () => {
  const { store } = fresh();
  const [a, b] = [uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: 100, questionIds: IDS, now: T0 });
  await store.queueJoin({ userId: b, mode: "mixed", rating: 1900, questionIds: IDS_B, now: T0 });
  for (let s = 10; s <= 110; s += 10) {
    await store.queuePoll({ userId: a, now: T0 + s * S });
    assert.equal((await store.queuePoll({ userId: b, now: T0 + s * S })).status, "searching");
  }
  await store.queuePoll({ userId: a, now: T0 + 119 * S });
  assert.equal((await store.queuePoll({ userId: b, now: T0 + 119 * S })).status, "searching", "119 s: +-400, 1800 apart");
  assert.equal(QUEUE_WINDOW.openAfterS, 120);
  assert.equal((await store.queuePoll({ userId: a, now: T0 + 120 * S })).status, "matched", "120 s: no limit");
});

test("queue: only the same mode is paired", async () => {
  const { store } = fresh();
  const [a, b, c] = [uid(), uid(), uid()];
  await store.queueJoin({ userId: a, mode: "rw", rating: START_RATING, questionIds: IDS, now: T0 });
  assert.equal((await store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 })).status, "searching");
  const hit = await store.queueJoin({ userId: c, mode: "rw", rating: START_RATING, questionIds: IDS_B, now: T0 });
  assert.equal(hit.status, "matched");
  assert.equal((await store.getMatch(hit.matchId!))?.mode, "rw");
  assert.equal((await store.queuePoll({ userId: b, now: T0 + S })).searching, 0, "b is alone in mixed");
});

test("queue: 'searching' counts the OTHER players of the same mode", async () => {
  const { store } = fresh();
  const [a, b, c, d] = [uid(), uid(), uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: 100, questionIds: IDS, now: T0 });
  await store.queueJoin({ userId: b, mode: "mixed", rating: 1000, questionIds: IDS, now: T0 });
  const rc = await store.queueJoin({ userId: c, mode: "mixed", rating: 2000, questionIds: IDS, now: T0 });
  await store.queueJoin({ userId: d, mode: "rw", rating: 2000, questionIds: IDS, now: T0 });
  assert.equal(rc.searching, 2);
  assert.equal((await store.queuePoll({ userId: a, now: T0 + S })).searching, 2);
});

test("queue: nobody is paired with a player who is in a match", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const c = await player(store, file);
  const m = await pairUp(store, a, b);
  const rec = await store.queueJoin({ userId: c, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 + 10 * S });
  assert.equal(rec.status, "searching", "a and b are in a match");
  assert.equal(rec.searching, 0);
  assert.equal(Object.values(readDb(file).matches).length, 1);
  assert.equal((await store.queuePoll({ userId: a, now: T0 + 11 * S })).matchId, m.id);
});

test("queue: the same pair can't meet again within 24 h, others can, and after the cool-down it may", async () => {
  const { file, store } = fresh();
  assert.equal(REMATCH_COOLDOWN_H, 24);
  const { a, b } = await play(store, file, { ra: 100, rb: 100, pointsA: 500, pointsB: 400 }); // paired at about T0
  const c = await player(store, file);
  const again = await trySearch(store, a, b, { at: T0 + H });
  assert.equal(again.recA.status, "searching", "met an hour ago");
  assert.equal(again.recB.status, "searching");
  // c is not blocked: the longest searcher among those that fit is a.
  const cRec = await store.queueJoin({ userId: c, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: again.at + 5 * S });
  assert.equal(cRec.status, "matched");
  assert.equal((await store.getMatch(cRec.matchId!))?.playerA, a);
  // 24 h after the first match (fresh store: the old searches are long gone) the same pair is paired again.
  const t = fresh();
  const first = await play(t.store, t.file, { ra: 100, rb: 100, pointsA: 500, pointsB: 400 });
  const firstMatch = (await t.store.getMatch(first.id))!;
  const early = await trySearch(t.store, first.a, first.b, { at: firstMatch.createdAt + 24 * H - 10 * 60_000, maxS: 20 });
  assert.equal(early.recB.status, "searching", "23 h 50 min");
  const late = await trySearch(t.store, first.a, first.b, { at: firstMatch.createdAt + 24 * H + S });
  assert.equal(late.recB.status, "matched", "24 h later");
});

test("queue: a void match doesn't count for the cool-down", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const first = await pairUp(store, a, b);
  await store.voidMatch(first.id);
  const rematch = await trySearch(store, a, b, { at: T0 + 10 * 60_000 });
  assert.equal(rematch.recB.status, "matched", "the first match was void");
  assert.notEqual(rematch.recB.matchId, first.id);
});

test("queue: a player in a match can't join (EloActiveMatchError); free again once it is over", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const m = await pairUp(store, a, b);
  await assert.rejects(store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 + 5 * 60_000 }), EloActiveMatchError);
  await assert.rejects(store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 + 5 * 60_000 }), EloActiveMatchError);
  await store.voidMatch(m.id);
  const rec = await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 + 6 * 60_000 });
  assert.equal(rec.status, "searching");
});

test("queue: at most 30 started matches per rolling day (EloLimitError daily); a day later it's fine", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  edit(file, (db) => {
    for (let i = 0; i < MAX_MATCHES_PER_DAY; i++) {
      // Half of them as A, half as B: both roles count.
      const m = i % 2 === 0 ? blank({ playerA: a, status: "finished", createdAt: T0 - i * 1000 }) : blank({ playerA: uid(), playerB: a, status: "finished", createdAt: T0 - i * 1000 });
      db.matches[m.id] = m;
    }
  });
  assert.equal(await store.countStarted(a, T0 - DAY), MAX_MATCHES_PER_DAY);
  await assert.rejects(store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 }), (e: unknown) => e instanceof EloLimitError && e.kind === "daily");
  assert.equal(readDb(file).queue[a], undefined, "a refused join leaves no queue row");
  assert.equal((await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 + DAY + 1 })).status, "searching", "a day later it's fine");
});

test("queue: a join needs exactly 10 question ids", async () => {
  const { store } = fresh();
  await assert.rejects(store.queueJoin({ userId: uid(), mode: "mixed", rating: START_RATING, questionIds: IDS.slice(0, 9), now: T0 }), /exactly 10/);
});

// --- the queue: leaving, dropping, timeout ---

test("queue: a repeated join while searching keeps the search (since, questions); after a timeout it starts a new one", async () => {
  const { file, store } = fresh();
  const a = uid();
  await store.queueJoin({ userId: a, mode: "mixed", rating: 500, questionIds: IDS, now: T0 });
  const again = await store.queueJoin({ userId: a, mode: "mixed", rating: 900, questionIds: IDS_B, now: T0 + 10 * S });
  assert.equal(again.status, "searching");
  assert.equal(again.since, T0, "the search start is not reset");
  const row = readDb(file).queue[a];
  assert.deepEqual([row.rating, row.questionIds, row.lastSeen], [500, IDS, T0 + 10 * S]);
  // A search that has run out (and was not read yet) is replaced by a fresh one.
  const fresh2 = await store.queueJoin({ userId: a, mode: "mixed", rating: 900, questionIds: IDS_B, now: T0 + 10 * S + QUEUE.searchMaxS * S });
  assert.equal(fresh2.status, "searching");
  assert.equal(fresh2.since, T0 + 10 * S + QUEUE.searchMaxS * S);
  assert.deepEqual([readDb(file).queue[a].rating, readDb(file).queue[a].questionIds], [900, IDS_B]);
});

test("queue: no poll for more than 15 s drops the player (exactly 15 s still counts)", async () => {
  const { store } = fresh();
  const [a, b, c] = [uid(), uid(), uid()];
  assert.equal(QUEUE.dropAfterS, 15);
  await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  const alone = await store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 + 15 * S + 1 });
  assert.equal(alone.status, "searching", "a was silent for 15.001 s");
  assert.equal(alone.searching, 0, "and is gone from the count");
  assert.deepEqual(await store.queuePoll({ userId: a, now: T0 + 16 * S }), { status: "idle", since: null, matchId: null, searching: 0 });
  // Exactly 15 s: still there.
  const rec = await store.queueJoin({ userId: c, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 + 15 * S + 1 + 15 * S });
  assert.equal(rec.status, "matched", "b polled 15 s ago: still searching");
});

test("queue: polling keeps a player in; a silent one can't be paired", async () => {
  const { store } = fresh();
  const [a, b] = [uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  for (let s = 10; s <= 50; s += 10) assert.equal((await store.queuePoll({ userId: a, now: T0 + s * S })).status, "searching");
  const rec = await store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 + 55 * S });
  assert.equal(rec.status, "matched", "a kept polling for 50 s");
});

test("queue: after 5 minutes the search times out - answered once, then idle", async () => {
  const { file, store } = fresh();
  const a = uid();
  assert.equal(QUEUE.searchMaxS, 300);
  await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  for (let s = 10; s <= 290; s += 10) assert.equal((await store.queuePoll({ userId: a, now: T0 + s * S })).status, "searching");
  assert.equal((await store.queuePoll({ userId: a, now: T0 + 299_999 })).status, "searching", "299.999 s");
  const t = await store.queuePoll({ userId: a, now: T0 + 300 * S });
  assert.deepEqual(t, { status: "timeout", since: T0, matchId: null, searching: 0 });
  assert.equal(readDb(file).queue[a], undefined, "the row is deleted after it was reported");
  assert.deepEqual(await store.queuePoll({ userId: a, now: T0 + 302 * S }), { status: "idle", since: null, matchId: null, searching: 0 });
  // A new search starts from scratch.
  const again = await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 + 310 * S });
  assert.deepEqual([again.status, again.since], ["searching", T0 + 310 * S]);
});

test("queue: a timed-out player can't be paired, and cancelling a timed-out row clears it", async () => {
  const { file, store } = fresh();
  const [a, b] = [uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  for (let s = 10; s <= 290; s += 10) await store.queuePoll({ userId: a, now: T0 + s * S });
  // b joins just after a's 5 minutes: a is "timeout" (not read yet) and must not be paired.
  const rec = await store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 + 301 * S });
  assert.equal(rec.status, "searching");
  assert.equal(readDb(file).queue[a].status, "timeout");
  assert.deepEqual(await store.queueCancel({ userId: a }), { status: "idle", since: null, matchId: null, searching: 0 });
  assert.equal(readDb(file).queue[a], undefined);
});

test("queue: cancel leaves the queue; nobody pairs with a cancelled player", async () => {
  const { file, store } = fresh();
  const [a, b] = [uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  assert.deepEqual(await store.queueCancel({ userId: a, now: T0 + S }), { status: "idle", since: null, matchId: null, searching: 0 });
  assert.equal(readDb(file).queue[a], undefined);
  assert.equal((await store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 + 2 * S })).status, "searching");
  assert.deepEqual(await store.queueCancel({ userId: uid() }), { status: "idle", since: null, matchId: null, searching: 0 }, "cancelling without a search is fine");
});

test("queue: cancel after the pair was made does nothing and answers matched; once the match is over it is just idle", async () => {
  const { file, store } = fresh();
  const [a, b] = [uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 });
  const made = await store.queueJoin({ userId: b, mode: "mixed", rating: START_RATING, questionIds: IDS_B, now: T0 + S });
  assert.equal(made.status, "matched");
  // a never polled since the pair was made: the cancel must not undo it.
  const c = await store.queueCancel({ userId: a, now: T0 + 2 * S });
  assert.equal(c.status, "matched");
  assert.equal(c.matchId, made.matchId);
  assert.equal(Object.values(readDb(file).matches).filter((m) => m.status === "playing").length, 1);
  await store.voidMatch(made.matchId!);
  assert.equal((await store.queueCancel({ userId: a, now: T0 + 3 * S })).status, "idle");
  assert.equal(readDb(file).queue[a], undefined);
});

test("queue: a matched row lives while the match is playing, then a read removes it", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const m = await pairUp(store, a, b);
  assert.equal((await store.queuePoll({ userId: a, now: T0 + 10 * 60_000 })).matchId, m.id, "still playing: a reload returns to the match");
  await store.updateMatch(m.id, { pointsA: 5, pointsB: 4, aFinishedAt: T0, bFinishedAt: T0 });
  await store.finishMatch(m.id, T0 + 11 * 60_000);
  assert.deepEqual(await store.queuePoll({ userId: a, now: T0 + 12 * 60_000 }), { status: "idle", since: null, matchId: null, searching: 0 });
  assert.equal(readDb(file).queue[a], undefined);
  assert.equal((await store.queuePoll({ userId: b, now: T0 + 12 * 60_000 })).status, "idle");
  assert.deepEqual(readDb(file).queue, {});
});

test("queue: two simultaneous polls make one match", async () => {
  const { file, store } = fresh();
  const [a, b] = [uid(), uid()];
  await store.queueJoin({ userId: a, mode: "mixed", rating: 100, questionIds: IDS, now: T0 });
  await store.queueJoin({ userId: b, mode: "mixed", rating: 300, questionIds: IDS_B, now: T0 + S });
  for (let s = 10; s <= 20; s += 10) {
    await store.queuePoll({ userId: a, now: T0 + s * S });
    await store.queuePoll({ userId: b, now: T0 + s * S });
  }
  const [ra, rb] = await Promise.all([store.queuePoll({ userId: a, now: T0 + 31 * S }), store.queuePoll({ userId: b, now: T0 + 31 * S })]);
  assert.equal(ra.status, "matched");
  assert.equal(rb.status, "matched");
  assert.equal(ra.matchId, rb.matchId);
  assert.equal(Object.keys(readDb(file).matches).length, 1);
});

test("queue: polling without a search is idle; an old file without a queue still loads", async () => {
  const { file, store } = fresh();
  fs.writeFileSync(file, JSON.stringify({ players: {}, matches: {}, answers: {}, history: [], seasons: [], nextHistoryId: 1 }));
  assert.deepEqual(await store.queuePoll({ userId: uid(), now: T0 }), { status: "idle", since: null, matchId: null, searching: 0 });
  assert.equal((await store.queueJoin({ userId: uid(), mode: "mixed", rating: START_RATING, questionIds: IDS, now: T0 })).status, "searching");
});

test("an old file: matches of the old flow load as void (no rating change), and the pair can be matched again at once", async () => {
  const { file, store } = fresh();
  const [a, b] = [uid(), uid()];
  const oldStatuses = ["playing_a", "waiting", "playing_b", "expired"];
  const matches: Record<string, unknown> = {};
  for (const st of oldStatuses) {
    const id = uid();
    matches[id] = { ...blank({ id, playerA: a, playerB: b, status: "finished", createdAt: T0 - H }), status: st, expiresAt: T0 + H, bStartedAt: T0 - H };
  }
  fs.writeFileSync(file, JSON.stringify({ players: {}, matches, answers: {}, history: [], seasons: [], nextHistoryId: 1 }));
  const lists = await store.listMatches(a);
  assert.equal(lists.active, null);
  assert.equal(lists.recent.length, 4, "none of them is lost from recent");
  assert.ok(lists.recent.every((m) => m.status === "void" && !("expiresAt" in m)));
  const rec = await trySearch(store, a, b, { at: T0 });
  assert.equal(rec.recB.status, "matched", "void matches don't block the pair for 24 h");
  await store.queueCancel({ userId: a });
  assert.ok(Object.values(readDb(file).matches).every((m) => m.status === "void" || m.status === "playing"));
});

// --- questions and answers ---

test("open / close answer rows: opened once, closed once, ordered by slot", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const w = await pairUp(store, a, b);
  const base = { matchId: w.id, userId: a, section: "rw" as const, difficulty: "easy" as const, limitS: 60 };
  const o1 = await store.openAnswer({ ...base, idx: 1, qid: "q1", issuedAt: T0 });
  const o0 = await store.openAnswer({ ...base, idx: 0, qid: "q0", issuedAt: T0 });
  assert.equal(o1.status, "open");
  const again = await store.openAnswer({ ...base, idx: 1, qid: "other", issuedAt: T0 + 5 });
  assert.equal(again.qid, "q1", "an existing row is left alone");
  assert.equal(again.issuedAt, T0);
  const closed = await store.closeAnswer(w.id, a, 0, { status: "answered", answeredAt: T0 + 12_000, response: "B", elapsedMs: 10_000, correct: true, base: 100, bonus: 40, points: 140 });
  assert.equal(closed?.points, 140);
  assert.equal(await store.closeAnswer(w.id, a, 0, { status: "answered", answeredAt: T0 + 13_000, response: "C", elapsedMs: 11_000, correct: false, base: 0, bonus: 0, points: 0 }), null, "second answer is refused");
  assert.equal(await store.closeAnswer(w.id, a, 5, { status: "timeout", answeredAt: null, response: null, elapsedMs: null, correct: null, base: 0, bonus: 0, points: 0 }), null, "unopened slot");
  const rows = await store.getAnswers(w.id, a);
  assert.deepEqual(rows.map((r) => [r.idx, r.status, r.points]), [[0, "answered", 140], [1, "open", 0]]);
  assert.equal(o0.idx, 0);
  await assert.rejects(store.openAnswer({ ...base, idx: 10, qid: "x" }), /slot/);
});

test("recentQuestionIds: issued since the cut-off, unique", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const w = await pairUp(store, a, b);
  const base = { matchId: w.id, userId: a, section: "math" as const, difficulty: "hard" as const, limitS: 130 };
  await store.openAnswer({ ...base, idx: 0, qid: "m-1", issuedAt: T0 - 40 * DAY });
  await store.openAnswer({ ...base, idx: 1, qid: "m-2", issuedAt: T0 - DAY });
  await store.openAnswer({ ...base, idx: 2, qid: "m-2", issuedAt: T0 });
  assert.deepEqual((await store.recentQuestionIds(a, T0 - 30 * DAY)).sort(), ["m-2"]);
  assert.deepEqual((await store.recentQuestionIds(uid(), T0 - 30 * DAY)), []);
});

test("listMatches: the playing match as A or B is active; recent is finished / void, newest first, limited", async () => {
  const { file, store } = fresh();
  const done = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 }); // finished around T0
  const c = await player(store, file);
  const d = await player(store, file);
  const live = await pairUp(store, c, d, { at: T0 + 2 * H });
  const mineC = await store.listMatches(c);
  assert.equal(mineC.active?.id, live.id);
  assert.deepEqual(mineC.recent, []);
  assert.equal((await store.listMatches(d)).active?.id, live.id, "the other side sees it as active too");
  const asA = await store.listMatches(done.a);
  assert.equal(asA.active, null);
  assert.deepEqual(asA.recent.map((m) => m.id), [done.id]);
  assert.deepEqual((await store.listMatches(done.b)).recent.map((m) => m.id), [done.id], "the opponent sees it too");
  assert.deepEqual(await store.listMatches(uid()), { active: null, recent: [] });
  // Recent: finished and void only, newest first by createdAt, as either role, cut at recentLimit.
  edit(file, (db) => {
    for (let i = 0; i < 12; i++) {
      const m = i % 2 === 0 ? blank({ playerA: d, status: "finished", createdAt: T0 - (i + 1) * H }) : blank({ playerA: uid(), playerB: d, status: "void", createdAt: T0 - (i + 1) * H });
      db.matches[m.id] = m;
    }
  });
  const list = await store.listMatches(d);
  assert.equal(list.recent.length, 10, "default limit");
  assert.ok(list.recent.every((m) => m.status !== "playing"));
  assert.deepEqual(list.recent.map((m) => m.createdAt), [...list.recent.map((m) => m.createdAt)].sort((x, y) => y - x));
  assert.equal((await store.listMatches(d, { recentLimit: 3 })).recent.length, 3);
  assert.equal((await store.listMatches(d)).active?.id, live.id);
});

test("countStarted: matches as A or B by createdAt", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  edit(file, (db) => {
    for (const m of [
      blank({ playerA: a, status: "finished", createdAt: T0 }),
      blank({ playerA: uid(), playerB: a, status: "void", createdAt: T0 + H }),
      blank({ playerA: a, status: "finished", createdAt: T0 - 2 * DAY }),
      blank({ playerA: uid(), playerB: uid(), status: "finished", createdAt: T0 }),
    ]) db.matches[m.id] = m;
  });
  assert.equal(await store.countStarted(a, T0 - DAY), 2);
  assert.equal(await store.countStarted(a, T0 + 1), 1);
  assert.equal(await store.countStarted(a, T0 - 3 * DAY), 3);
});

test("ensurePlayer: created at the start rating (100), name and avatar follow the profile", async () => {
  const { store } = fresh();
  const u = uid();
  const p = await store.ensurePlayer(u, { name: "Ada", avatar: "x" }, T0);
  assert.deepEqual([p.rating, p.peak, p.matches, p.name, p.avatar, p.updatedAt], [START_RATING, START_RATING, 0, "Ada", "x", T0]);
  assert.equal(START_RATING, 100);
  assert.equal(START_RATING, RATING_FLOOR, "a new player starts at the floor");
  const q = await store.ensurePlayer(u, { name: "Ada L." }, T0 + H);
  assert.deepEqual([q.name, q.avatar, q.updatedAt], ["Ada L.", "x", T0], "rename keeps the avatar and the tie-break time");
  assert.equal((await store.ensurePlayer(u)).name, "Ada L.");
  assert.equal(await store.getPlayer(uid()), null);
  assert.deepEqual(Object.keys(await store.getPlayers([u, uid()])), [u]);
});

// --- leaderboards ---

test("global board: >= 10 matches, rating desc, matches desc, earlier first; paging and me", async () => {
  const { file, store } = fresh();
  const p1 = await player(store, file, { rating: 1500, matches: 12, name: "p1", updatedAt: T0 });
  const p2 = await player(store, file, { rating: 1500, matches: 15, name: "p2", updatedAt: T0 + 5 });
  const p3 = await player(store, file, { rating: 1500, matches: 15, name: "p3", updatedAt: T0 + 9 });
  const p4 = await player(store, file, { rating: 1600, matches: 9, name: "p4" });
  const p5 = await player(store, file, { rating: 1400, matches: 10, name: "p5" });
  edit(file, (db) => {
    db.players[p2].updatedAt = T0 + 5;
    db.players[p3].updatedAt = T0 + 9;
    db.players[p1].updatedAt = T0;
  });
  const all = await store.leaderboard({ board: "global", userId: p4, now: NOW });
  assert.equal(all.total, 4);
  assert.deepEqual(all.rows.map((r) => [r.rank, r.name]), [[1, "p2"], [2, "p3"], [3, "p1"], [4, "p5"]]);
  assert.deepEqual(all.me && [all.me.rank, all.me.name, all.me.rating], [null, "p4", 1600], "not on the board yet: stats without a rank");
  assert.equal("points" in all.rows[0], false);
  assert.equal("userId" in all.rows[0], false, "public fields only");
  const page2 = await store.leaderboard({ board: "global", page: 2, size: 2, userId: p5, now: NOW });
  assert.deepEqual(page2.rows.map((r) => [r.rank, r.name]), [[3, "p1"], [4, "p5"]]);
  assert.equal(page2.me?.rank, 4);
  assert.equal((await store.leaderboard({ board: "global", userId: uid(), now: NOW })).me, null);
  assert.equal((await store.leaderboard({ board: "global", size: 500, now: NOW })).rows.length, 4);
});

test("season board: >= 5 matches finished in the current month, same order", async () => {
  const { file, store } = fresh();
  const x = await player(store, file, { rating: 1300, matches: 30, name: "x" });
  const y = await player(store, file, { rating: 1400, matches: 30, name: "y" });
  const z = await player(store, file, { rating: 1500, matches: 30, name: "z" });
  const w = await player(store, file, { rating: 1300, matches: 40, name: "w" });
  const finished = (db: LocalDb, who: string, n: number, at: number) => {
    for (let i = 0; i < n; i++) {
      const m = blank({ playerA: who, playerB: uid(), status: "finished", finishedAt: at + i, pointsA: 1, pointsB: 0, result: "a" });
      db.matches[m.id] = m;
    }
  };
  edit(file, (db) => {
    finished(db, x, 5, Date.UTC(2026, 10, 2)); // in
    finished(db, y, 4, Date.UTC(2026, 10, 3)); // one short
    finished(db, z, 9, Date.UTC(2026, 9, 28)); // last month
    finished(db, w, 6, Date.UTC(2026, 10, 4)); // in, same rating as x but more matches overall
  });
  const board = await store.leaderboard({ board: "season", userId: z, now: NOW });
  assert.equal(board.total, 2);
  assert.deepEqual(board.rows.map((r) => [r.rank, r.name]), [[1, "w"], [2, "x"]]);
  assert.equal(board.me?.rank, null);
  assert.equal(board.me?.name, "z");
  // Voided matches don't count.
  edit(file, (db) => {
    const first = Object.values(db.matches).find((m) => m.playerA === x)!;
    first.status = "void";
  });
  assert.equal((await store.leaderboard({ board: "season", now: NOW })).total, 1);
});

test("week board: points of both sides of matches FINISHED in the UTC week; tie-break correct answers, then less time", async () => {
  const { file, store } = fresh();
  const u1 = await player(store, file, { name: "u1" });
  const u2 = await player(store, file, { name: "u2" });
  const u3 = await player(store, file, { name: "u3" });
  const u4 = await player(store, file, { name: "u4" });
  const u5 = await player(store, file, { name: "u5" });
  const mon = Date.UTC(2026, 10, 16);
  const tue = Date.UTC(2026, 10, 17, 10);
  const wed = Date.UTC(2026, 10, 18, 10);
  const sunBefore = Date.UTC(2026, 10, 15, 23, 59);
  edit(file, (db) => {
    const put = (m: EloMatch) => {
      db.matches[m.id] = m;
      return m;
    };
    const ans = (m: EloMatch, user: string, correct: number, msEach: number) => {
      for (let i = 0; i < 10; i++) {
        db.answers[`${m.id}|${user}|${i}`] = {
          matchId: m.id, userId: user, idx: i, qid: `q${i}`, section: "rw", difficulty: "easy", limitS: 60, issuedAt: tue,
          answeredAt: tue, response: "A", elapsedMs: msEach, status: "answered", correct: i < correct, base: 0, bonus: 0, points: 0,
        };
      }
    };
    const fin = (over: Partial<EloMatch> & Pick<EloMatch, "playerA">) => put(blank({ playerB: uid(), status: "finished", result: "a", ...over }));
    // u1: A's part 310 (finished Tue) + B's part 250 of another match (finished Wed) = 560.
    const m1 = fin({ playerA: u1, finishedAt: tue, pointsA: 310, pointsB: 5 });
    ans(m1, u1, 4, 1000);
    const m2 = put(blank({ playerA: u4, playerB: u1, status: "finished", finishedAt: wed, pointsA: 100, pointsB: 250, result: "b" }));
    ans(m2, u1, 0, 1000);
    // u2: 550 in one match, 6 correct, 600 s total. Finished Monday 00:00 (the week starts then: counts).
    const m3 = fin({ playerA: u2, finishedAt: mon, pointsA: 550 });
    ans(m3, u2, 6, 60_000);
    // u3: 550, 6 correct, less time -> above u2.
    const m4 = fin({ playerA: u3, finishedAt: wed, pointsA: 550 });
    ans(m4, u3, 6, 30_000);
    // u5: 550 with only 2 correct but fast: below u2 and u3 (more correct answers beat less time).
    const m5 = fin({ playerA: u5, finishedAt: wed, pointsA: 550 });
    ans(m5, u5, 2, 1000);
    // Not counted: a voided match, last week's match, and a match that is still playing (even with both parts closed).
    put(blank({ playerA: u2, playerB: uid(), status: "void", finishedAt: tue, pointsA: 999 }));
    fin({ playerA: u3, finishedAt: sunBefore, pointsA: 999 });
    put(blank({ playerA: u1, playerB: u2, status: "playing", aFinishedAt: tue, bFinishedAt: tue, pointsA: 10, pointsB: 999 }));
  });
  const board = await store.leaderboard({ board: "week", userId: u4, now: NOW });
  assert.deepEqual(board.rows.map((r) => [r.rank, r.name, r.points]), [[1, "u1", 560], [2, "u3", 550], [3, "u2", 550], [4, "u5", 550], [5, "u4", 100]]);
  assert.deepEqual(board.me && [board.me.rank, board.me.points], [5, 100]);
  assert.equal(board.total, 5);
  const nobody = await store.leaderboard({ board: "week", userId: uid(), now: NOW });
  assert.equal(nobody.me, null);
  // Next week the board starts from zero.
  assert.equal((await store.leaderboard({ board: "week", now: Date.UTC(2026, 10, 23) })).total, 0);
});

test("close season: saves places once, refuses an unfinished month", async () => {
  const { file, store } = fresh();
  const x = await player(store, file, { name: "x" });
  const y = await player(store, file, { name: "y" });
  const oct = Date.UTC(2026, 9, 10);
  edit(file, (db) => {
    for (const [who, rating] of [[x, 1100], [y, 1200]] as const) {
      for (let i = 0; i < 5; i++) {
        const m = blank({ playerA: who, playerB: uid(), status: "finished", finishedAt: oct + i });
        db.matches[m.id] = m;
      }
      db.history.push({ id: db.nextHistoryId++, userId: who, matchId: uid(), at: oct + 10, ratingBefore: 1000, ratingAfter: rating, reason: "match" });
      // A change after the month ended must not leak into the season table.
      db.history.push({ id: db.nextHistoryId++, userId: who, matchId: uid(), at: Date.UTC(2026, 10, 3), ratingBefore: rating, ratingAfter: 5000, reason: "match" });
    }
  });
  assert.equal(await store.closeSeason("2026-10", NOW), 2);
  assert.equal(await store.closeSeason("2026-10", NOW), 2, "idempotent");
  const db = readDb(file);
  assert.deepEqual(db.seasons.map((s) => [s.userId === y ? "y" : "x", s.place, s.rating]), [["y", 1, 1200], ["x", 2, 1100]]);
  await assert.rejects(store.closeSeason("2026-11", NOW), /not over/);
  await assert.rejects(store.closeSeason("2026-13", NOW), /YYYY-MM/);
});

// --- review fixes ---

test("void never drops peak below the start rating (100)", async () => {
  const { file, store } = fresh();
  const { a, b, id } = await play(store, file, { ra: 500, rb: 500, pointsA: 500, pointsB: 400 }); // A 512, B 488
  await store.voidMatch(id);
  const pa = (await store.getPlayer(a))!;
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pa.rating, pa.peak, pb.rating, pb.peak], [500, 500, 500, 500], "peak = the rating again; the start rating (100) is only a lower bound");
});

test("new players start at 100: a newcomer's loss at the floor changes nothing, the winner gains", async () => {
  const { file, store } = fresh();
  const a = await player(store, file); // created by ensurePlayer: default rating, 0 matches (both calibrating, K 40)
  const b = await player(store, file);
  const w = await pairUp(store, a, b);
  await store.updateMatch(w.id, { pointsA: 500, pointsB: 400, aFinishedAt: T0 + H, bFinishedAt: T0 + H }, ["playing"]);
  const out = await store.finishMatch(w.id, T0 + 2 * H);
  assert.deepEqual([out.ratingABefore, out.ratingBBefore], [100, 100]);
  assert.deepEqual([out.deltaA, out.deltaB, out.ratingAAfter, out.ratingBAfter], [20, 0, 120, 100], "-20 would go below the floor: B stays at 100, delta 0 after the floor");
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pb.rating, pb.peak, pb.matches, pb.losses], [100, 100, 1, 1]);
  await store.voidMatch(w.id, T0 + 3 * H);
  const pa = (await store.getPlayer(a))!;
  assert.deepEqual([pa.rating, pa.peak, pa.matches], [100, 100, 0]);
});

/** What the admin reset does to the local file (supabase/elo-admin.sql elo_reset_player): rating and peak back to the start rating (100), a 'reset' history row. */
function resetPlayer(file: string, userId: string, at: number) {
  edit(file, (db) => {
    const p = db.players[userId];
    db.history.push({ id: db.nextHistoryId++, userId, matchId: "00000000-0000-0000-0000-000000000000", at, ratingBefore: p.rating, ratingAfter: START_RATING, reason: "reset" });
    p.rating = START_RATING;
    p.peak = START_RATING;
  });
}

test("reset after a match, then void: the rating is not taken off twice, the counters are fixed", async () => {
  const { file, store } = fresh();
  const { a, b, id, match } = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 }); // A +12, B -12
  edit(file, (db) => {
    db.players[a].rating = 1300; // A kept winning...
    db.players[a].peak = 1300;
  });
  resetPlayer(file, a, match.createdAt + 2 * H); // ...and the admin reset them to the start rating
  const out = await store.voidMatch(id, match.createdAt + 9 * H);
  assert.equal(out.changed, true);
  const pa = (await store.getPlayer(a))!;
  assert.deepEqual([pa.rating, pa.peak, pa.matches, pa.wins], [START_RATING, START_RATING, 20, 0], "rating stays at the reset value (no -12 again), wins/matches fixed");
  const row = readDb(file).history.filter((h) => h.userId === a && h.reason === "void");
  assert.equal(row.length, 1);
  assert.equal(row[0].ratingBefore, row[0].ratingAfter, "the reverting history row has delta 0");
  const pb = (await store.getPlayer(b))!; // B was never reset: their change is taken back as usual
  assert.deepEqual([pb.rating, pb.matches, pb.losses], [1000, 20, 0]);
});

test("void of a match played AFTER the reset still takes its delta off; the peak counts only matches after the reset", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: START_RATING, matches: 20 });
  const b = await player(store, file, { rating: START_RATING, matches: 20 });
  // A's old match (before the reset) pushed the peak to 1200.
  edit(file, (db) => {
    db.matches.old = blank({ id: "old", playerA: a, playerB: b, status: "finished", createdAt: T0 - 3 * DAY, bStartedAt: T0 - 3 * DAY, finishedAt: T0 - 3 * DAY, result: "a", deltaA: 200, deltaB: -200 });
    db.history.push({ id: db.nextHistoryId++, userId: a, matchId: "old", at: T0 - 3 * DAY, ratingBefore: START_RATING, ratingAfter: 1200, reason: "match" });
    db.players[a].rating = 1200;
    db.players[a].peak = 1200;
  });
  resetPlayer(file, a, T0 + H);
  const w = await pairUp(store, a, b, { at: T0 + 2 * H });
  assert.ok(await store.updateMatch(w.id, { pointsA: 500, pointsB: 400, aFinishedAt: T0 + 3 * H, bFinishedAt: T0 + 3 * H }, ["playing"]));
  await store.finishMatch(w.id, T0 + 4 * H);
  const after = (await store.getPlayer(a))!;
  assert.equal(after.rating > START_RATING, true);
  await store.voidMatch(w.id, T0 + 5 * H);
  const pa = (await store.getPlayer(a))!;
  assert.deepEqual([pa.rating, pa.peak], [START_RATING, START_RATING], "the new match is reverted from the reset value + delta; the pre-reset 1200 doesn't come back as peak");
});

test("a playing match whose second player is gone (account deleted) is voided by finish (no rating change)", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: 1000, matches: 20 });
  const b = await player(store, file, { rating: 1000, matches: 20 });
  const w = await pairUp(store, a, b, { ra: 1000, rb: 1000 });
  edit(file, (db) => {
    db.matches[w.id].playerB = null; // B deleted their account: player_b is null
    db.matches[w.id].pointsA = 100;
    db.matches[w.id].pointsB = 100;
  });
  const out = await store.finishMatch(w.id);
  assert.equal(out.status, "void");
  assert.equal(out.changed, true);
  assert.equal((await store.finishMatch(w.id)).changed, false);
  assert.deepEqual([(await store.getPlayer(a))?.rating, (await store.getPlayer(a))?.matches], [1000, 20]);
});

test("unknown ids: reads give null, finish / void say not found", async () => {
  const { store } = fresh();
  assert.equal(await store.getMatch("nope"), null);
  assert.equal(await store.getPlayer("nope"), null);
  assert.equal(await store.updateMatch("nope", { pointsA: 1 }), null);
  await assert.rejects(store.finishMatch("nope"), EloNotFoundError);
  await assert.rejects(store.voidMatch("nope"), EloNotFoundError);
});

// --- the Supabase store: what it sends, how it reads the answers (mocked fetch) ---

const QUEUE_RULES = {
  base: QUEUE_WINDOW.base,
  step: QUEUE_WINDOW.step,
  every_s: QUEUE_WINDOW.everyS,
  open_after_s: QUEUE_WINDOW.openAfterS,
  drop_after_s: QUEUE.dropAfterS,
  search_max_s: QUEUE.searchMaxS,
  start_deadline_s: START_DEADLINE_S,
  rematch_h: REMATCH_COOLDOWN_H,
};

/** Runs `fn` with fetch replaced; every request is recorded. `reply` decides the answer (default: an empty list). */
async function withFetch(reply: (url: string, init: RequestInit | undefined) => Response | undefined, fn: (seen: { url: string; method: string; body: string }[]) => Promise<void>) {
  const seen: { url: string; method: string; body: string }[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: unknown, init?: RequestInit) => {
    const url = String(input);
    seen.push({ url, method: init?.method ?? "GET", body: String(init?.body ?? "") });
    return reply(url, init) ?? new Response("[]", { status: 200 });
  }) as typeof fetch;
  try {
    await fn(seen);
  } finally {
    globalThis.fetch = realFetch;
  }
}

test("Supabase store: queueJoin / queuePoll / queueCancel call the functions with the rules of elo-config and read the answer", async () => {
  const since = "2026-11-18T12:00:00+00:00";
  await withFetch(
    (url) => {
      if (url.includes("rpc/elo_queue_join")) return new Response(JSON.stringify({ status: "searching", since, match_id: null, searching: 2 }), { status: 200 });
      if (url.includes("rpc/elo_queue_poll")) return new Response(JSON.stringify({ status: "matched", since, match_id: "11111111-2222-3333-4444-555555555555", searching: 0 }), { status: 200 });
      if (url.includes("rpc/elo_queue_cancel")) return new Response(JSON.stringify({ status: "idle", since: null, match_id: null, searching: 0 }), { status: 200 });
      return undefined;
    },
    async (seen) => {
      const s = createSupabaseStore("http://sb.test", "key");
      const u = uid();
      const joined: QueueRecord = await s.queueJoin({ userId: u, mode: "mixed", rating: 777, questionIds: IDS, now: T0 });
      assert.deepEqual(joined, { status: "searching", since: Date.parse(since), matchId: null, searching: 2 });
      const polled = await s.queuePoll({ userId: u, now: T0 + 2 * S });
      assert.deepEqual(polled, { status: "matched", since: Date.parse(since), matchId: "11111111-2222-3333-4444-555555555555", searching: 0 });
      assert.deepEqual(await s.queueCancel({ userId: u, now: T0 + 3 * S }), { status: "idle", since: null, matchId: null, searching: 0 });

      const join = JSON.parse(seen.find((r) => r.url.includes("rpc/elo_queue_join"))!.body);
      assert.deepEqual(join, { p_user: u, p_mode: "mixed", p_rating: 777, p_question_ids: IDS, p_now: new Date(T0).toISOString(), p_rules: QUEUE_RULES });
      assert.deepEqual(QUEUE_RULES, { base: 100, step: 100, every_s: 30, open_after_s: 120, drop_after_s: 15, search_max_s: 300, start_deadline_s: 90, rematch_h: 24 });
      const poll = JSON.parse(seen.find((r) => r.url.includes("rpc/elo_queue_poll"))!.body);
      assert.deepEqual(poll, { p_user: u, p_now: new Date(T0 + 2 * S).toISOString(), p_rules: QUEUE_RULES });
      const cancel = JSON.parse(seen.find((r) => r.url.includes("rpc/elo_queue_cancel"))!.body);
      assert.deepEqual(cancel, { p_user: u, p_now: new Date(T0 + 3 * S).toISOString() });
      // The join looked for a running match and counted today's matches first (both through one user filter).
      assert.ok(seen.some((r) => r.url.includes("elo_matches?status=eq.playing") && r.url.includes(`player_a.eq.${u}`) && r.url.includes(`player_b.eq.${u}`)));
      assert.ok(seen.some((r) => r.url.includes("elo_matches?or=") && r.url.includes("created_at=gte.")));
    },
  );
});

test("Supabase store: a running match, the daily limit and the database's own errors become typed errors", async () => {
  const u = uid();
  // A match in progress is refused before the function is called.
  await withFetch(
    (url) => (url.includes("status=eq.playing") ? new Response(JSON.stringify([{ id: uid() }]), { status: 200 }) : undefined),
    async (seen) => {
      const s = createSupabaseStore("http://sb.test", "key");
      await assert.rejects(s.queueJoin({ userId: u, mode: "mixed", rating: 1, questionIds: IDS, now: T0 }), EloActiveMatchError);
      assert.equal(seen.some((r) => r.url.includes("rpc/")), false);
    },
  );
  // 30 started matches in the last 24 h.
  await withFetch(
    (url) => (url.includes("created_at=gte.") ? new Response(JSON.stringify(Array.from({ length: MAX_MATCHES_PER_DAY }, () => ({ id: uid() }))), { status: 200 }) : undefined),
    async (seen) => {
      const s = createSupabaseStore("http://sb.test", "key");
      await assert.rejects(s.queueJoin({ userId: u, mode: "mixed", rating: 1, questionIds: IDS, now: T0 }), (e: unknown) => e instanceof EloLimitError && e.kind === "daily");
      assert.equal(seen.some((r) => r.url.includes("rpc/")), false);
    },
  );
  // The function itself raises ELO_ACTIVE_MATCH (a race), or a unique index fires.
  for (const body of [{ message: "ELO_ACTIVE_MATCH: player x already has a match in progress" }, { code: "23505", message: 'duplicate key value violates unique constraint "elo_matches_one_playing_as_b"' }]) {
    await withFetch(
      (url) => (url.includes("rpc/elo_queue_join") ? new Response(JSON.stringify(body), { status: 400 }) : undefined),
      async () => {
        await assert.rejects(createSupabaseStore("http://sb.test", "key").queueJoin({ userId: u, mode: "mixed", rating: 1, questionIds: IDS, now: T0 }), EloActiveMatchError);
      },
    );
  }
  // A missing function is a setup problem.
  await withFetch(
    (url) => (url.includes("rpc/elo_queue_poll") ? new Response(JSON.stringify({ code: "PGRST202", message: "no function" }), { status: 404 }) : undefined),
    async () => {
      await assert.rejects(createSupabaseStore("http://sb.test", "key").queuePoll({ userId: u, now: T0 }), /run supabase\/elo\.sql/);
    },
  );
});

test("Supabase store: listMatches asks for the playing match and the newest finished / void ones; the board page is capped", async () => {
  await withFetch(
    (url) => (url.includes("rpc/elo_leaderboard") ? new Response(JSON.stringify({ total: 0, rows: [], me: null }), { status: 200 }) : undefined),
    async (seen) => {
      const s = createSupabaseStore("http://sb.test", "key");
      const u = uid();
      await s.leaderboard({ board: "global", page: 9e15 });
      assert.deepEqual(await s.listMatches(u, { recentLimit: 4 }), { active: null, recent: [] });
      const board = seen.find((r) => r.url.includes("rpc/elo_leaderboard"))!;
      assert.equal(JSON.parse(board.body).p_page, 1_000_000);
      assert.ok(seen.some((r) => r.url.includes("status=eq.playing") && r.url.includes(`player_a.eq.${u}`) && r.url.includes("limit=1")));
      assert.ok(seen.some((r) => r.url.includes("status=in.(finished,void)") && r.url.includes("order=created_at.desc") && r.url.includes("limit=4")));
    },
  );
});

test("Supabase store: a match row is read with the new columns", async () => {
  const id = uid();
  const a = uid();
  const b = uid();
  const row = {
    id, mode: "mixed", status: "playing", player_a: a, player_b: b, question_ids: IDS, created_at: "2026-11-18T12:00:00+00:00",
    a_started_at: "2026-11-18T12:00:10+00:00", b_started_at: null, a_finished_at: null, b_finished_at: "2026-11-18T12:10:00+00:00",
    start_by: "2026-11-18T12:01:30+00:00", finished_at: null, points_a: null, points_b: 120, forfeit: null, result: null,
    rating_a_before: null, rating_b_before: null, delta_a: null, delta_b: null,
  };
  await withFetch(
    () => new Response(JSON.stringify([row]), { status: 200 }),
    async () => {
      const m = await createSupabaseStore("http://sb.test", "key").getMatch(id);
      assert.ok(m);
      assert.deepEqual([m.status, m.playerA, m.playerB], ["playing", a, b]);
      assert.deepEqual([m.createdAt, m.aStartedAt, m.bStartedAt, m.aFinishedAt, m.bFinishedAt, m.startBy], [T0, T0 + 10 * S, null, null, T0 + 10 * 60_000, T0 + 90 * S]);
      assert.equal("expiresAt" in m, false);
    },
  );
});

test("Supabase store: a patch writes the new columns, never a status", async () => {
  const id = uid();
  await withFetch(
    () => undefined,
    async (seen) => {
      await createSupabaseStore("http://sb.test", "key").updateMatch(id, { aStartedAt: T0, bFinishedAt: T0 + S, pointsA: 5, forfeit: "b" }, ["playing"]);
      const r = seen[0];
      assert.equal(r.method, "PATCH");
      assert.ok(r.url.includes(`id=eq.${id}`) && r.url.includes("status=in.(playing)"));
      assert.deepEqual(JSON.parse(r.body), { a_started_at: new Date(T0).toISOString(), b_finished_at: new Date(T0 + S).toISOString(), points_a: 5, forfeit: "b" });
    },
  );
});

test("Supabase store: a malformed id is null / empty on reads and a typed error on writes (no request is sent)", async () => {
  const s = createSupabaseStore("http://127.0.0.1:9", "key");
  assert.equal(await s.getMatch("not-a-uuid"), null);
  assert.equal(await s.getPlayer("not-a-uuid"), null);
  assert.equal(await s.updateMatch("not-a-uuid", { pointsA: 1 }), null);
  assert.deepEqual(await s.getPlayers(["x", "y"]), {});
  assert.deepEqual(await s.getAnswers("x", "y"), []);
  assert.deepEqual(await s.recentQuestionIds("x", 0), []);
  assert.deepEqual(await s.listMatches("x"), { active: null, recent: [] });
  assert.equal(await s.countStarted("x", 0), 0);
  assert.deepEqual(await s.queuePoll({ userId: "x" }), { status: "idle", since: null, matchId: null, searching: 0 });
  assert.deepEqual(await s.queueCancel({ userId: "x" }), { status: "idle", since: null, matchId: null, searching: 0 });
  assert.equal(await s.closeAnswer("x", "y", 0, { status: "timeout", answeredAt: null, response: null, elapsedMs: null, correct: null, base: 0, bonus: 0, points: 0 }), null);
  await assert.rejects(s.finishMatch("x"), EloNotFoundError);
  await assert.rejects(s.voidMatch("x"), EloNotFoundError);
  await assert.rejects(s.ensurePlayer("x"), EloInvalidIdError);
  await assert.rejects(s.queueJoin({ userId: "x", mode: "mixed", rating: 1, questionIds: IDS }), EloInvalidIdError);
});
