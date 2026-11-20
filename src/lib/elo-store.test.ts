// Run: npm run elo:store-test  (node:test on the LOCAL file store; --conditions=react-server lets "server-only" load under plain Node).
// The Supabase twin of these rules is supabase/elo.sql (checked by supabase/elo-check.sql, run by the owner).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { applyElo, matchResult } from "./elo.ts";
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
} from "./elo-store.ts";

const H = 3_600_000;
const DAY = 24 * H;
const T0 = Date.UTC(2026, 10, 18, 12, 0, 0); // Wed 2026-11-18
const NOW = Date.UTC(2026, 10, 20, 12, 0, 0); // Fri 2026-11-20 (week 16-23 Nov, month Nov)
const IDS = Array.from({ length: 10 }, (_, i) => `q${i}`);

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
    id: uid(), mode: "mixed", playerB: null, questionIds: IDS, createdAt: T0, aFinishedAt: null, bStartedAt: null, finishedAt: null,
    expiresAt: null, pointsA: null, pointsB: null, forfeit: null, result: null, ratingABefore: null, ratingBBefore: null, deltaA: null, deltaB: null,
    ...over,
  };
}

/** A waiting match of `a`, created at `at`, A's part done. */
async function waitingMatch(s: EloStore, a: string, at = T0, mode: "mixed" | "rw" | "math" = "mixed", pointsA = 300) {
  const m = await s.createMatch({ mode, playerA: a, questionIds: IDS, now: at });
  const w = await s.updateMatch(m.id, { status: "waiting", aFinishedAt: at, pointsA }, ["playing_a"]);
  assert.ok(w);
  return w;
}

interface Play {
  ra: number; rb: number; ma?: number; mb?: number; pointsA: number; pointsB: number; forfeit?: "a" | "b"; waitH?: number;
}
/** create -> A done -> B claims -> B done -> finish. */
async function play(s: EloStore, file: string, o: Play) {
  const a = await player(s, file, { rating: o.ra, matches: o.ma ?? 20 });
  const b = await player(s, file, { rating: o.rb, matches: o.mb ?? 20 });
  const w = await waitingMatch(s, a, T0, "mixed", o.pointsA);
  const at = T0 + (o.waitH ?? 0) * H;
  const claimed = await s.claimWaiting({ userId: b, rating: o.rb, mode: "mixed", now: at });
  assert.ok(claimed, "B should be able to claim");
  assert.equal(claimed.id, w.id);
  await s.updateMatch(w.id, { pointsB: o.pointsB, ...(o.forfeit ? { forfeit: o.forfeit } : {}) }, ["playing_b"]);
  const out = await s.finishMatch(w.id, at + 60_000);
  return { a, b, id: w.id, out };
}

// --- E1-E6 through create -> claim -> finish, and parity with the TypeScript formulas ---

const E_CASES: { n: string; p: Play; da: number; db: number; ra: number; rb: number }[] = [
  { n: "E1", p: { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 }, da: 12, db: -12, ra: 1012, rb: 988 },
  { n: "E2", p: { ra: 1200, rb: 1000, pointsA: 500, pointsB: 400, waitH: 2 }, da: 6, db: -6, ra: 1206, rb: 994 },
  { n: "E3", p: { ra: 1200, rb: 1000, pointsA: 400, pointsB: 500, waitH: 2 }, da: -18, db: 18, ra: 1182, rb: 1018 },
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

test("E1 flow: statuses playing_a -> waiting -> playing_b -> finished, counters and history", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: 1000, matches: 20 });
  const b = await player(store, file, { rating: 1000, matches: 20 });
  const m = await store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 });
  assert.equal(m.status, "playing_a");
  assert.equal(m.playerB, null);
  const w = await store.updateMatch(m.id, { status: "waiting", aFinishedAt: T0, pointsA: 500 }, ["playing_a"]);
  assert.equal(w?.status, "waiting");
  assert.equal(w?.expiresAt, T0 + 48 * H);
  assert.equal(await store.updateMatch(m.id, { pointsA: 1 }, ["playing_a"]), null, "a status guard that doesn't match changes nothing");
  const claimed = await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + H });
  assert.equal(claimed?.status, "playing_b");
  assert.equal(claimed?.playerB, b);
  assert.equal(claimed?.bStartedAt, T0 + H);
  await store.updateMatch(m.id, { pointsB: 400 }, ["playing_b"]);
  const out = await store.finishMatch(m.id, T0 + 2 * H);
  assert.equal(out.result, "a");
  assert.equal(out.finishedAt, T0 + 2 * H);
  const pa = (await store.getPlayer(a))!;
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pa.rating, pa.peak, pa.matches, pa.wins, pa.losses, pa.draws], [1012, 1012, 21, 1, 0, 0]);
  assert.deepEqual([pb.rating, pb.peak, pb.matches, pb.wins, pb.losses, pb.draws], [988, 1000, 21, 0, 1, 0]);
  const db = JSON.parse(fs.readFileSync(file, "utf8")) as LocalDb;
  assert.equal(db.history.filter((h) => h.matchId === m.id).length, 2);
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
  const db = JSON.parse(fs.readFileSync(file, "utf8")) as LocalDb;
  assert.equal(db.history.length, 2);
});

test("finish refuses a match without points", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const w = await waitingMatch(store, a);
  await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 });
  await assert.rejects(store.finishMatch(w.id), /no points/);
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

test("void of a waiting match just voids it (no rating change)", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const w = await waitingMatch(store, a);
  const out = await store.voidMatch(w.id);
  assert.equal(out.status, "void");
  assert.equal((await store.getPlayer(a))?.rating, 1000);
  assert.equal((await store.getPlayer(a))?.matches, 0);
});

// --- expiry ---

test("a waiting match expires after 48 h and changes no rating", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const w = await waitingMatch(store, a);
  assert.equal(await store.expireStale(T0 + 48 * H - 1), 0);
  assert.equal((await store.getMatch(w.id))?.status, "waiting");
  assert.equal(await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + 49 * H }), null);
  assert.equal((await store.getMatch(w.id))?.status, "expired");
  const lists = await store.listMatches(a, { now: T0 + 49 * H });
  assert.equal(lists.waiting.length, 0);
  assert.equal(lists.recent[0]?.status, "expired");
  const pa = (await store.getPlayer(a))!;
  assert.deepEqual([pa.rating, pa.matches], [1000, 0]);
});

test("listMatches expires stale matches lazily", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const w = await waitingMatch(store, a);
  assert.equal((await store.listMatches(a, { now: T0 + 47 * H })).waiting[0]?.id, w.id);
  const lists = await store.listMatches(a, { now: T0 + 48 * H });
  assert.equal(lists.waiting.length, 0);
  assert.equal((await store.getMatch(w.id))?.status, "expired");
});

// --- claim rules ---

test("claim: the rating window grows 50 per hour (100 at start, cap 400)", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: 1150, matches: 20 });
  const b = await player(store, file, { rating: 1000, matches: 20 });
  const w = await waitingMatch(store, a);
  assert.equal(await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + 30 * 60_000 }), null, "gap 150 > window 125");
  const hit = await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + H });
  assert.equal(hit?.id, w.id, "gap 150 <= window 150 after one hour");
});

test("claim: a far-away rating never matches before 6 hours, then the cap of 400 applies", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: 1500, matches: 20 });
  const b = await player(store, file, { rating: 1000, matches: 20 });
  const c = await player(store, file, { rating: 1100, matches: 20 });
  await waitingMatch(store, a);
  assert.equal(await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + 10 * H }), null, "gap 500 > cap 400");
  assert.ok(await store.claimWaiting({ userId: c, rating: 1100, mode: "mixed", now: T0 + 10 * H }), "gap 400 <= cap");
});

test("claim: not your own match", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  await waitingMatch(store, a);
  assert.equal(await store.claimWaiting({ userId: a, rating: 1000, mode: "mixed", now: T0 }), null);
});

test("claim: only the same mode", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const w = await waitingMatch(store, a, T0, "rw");
  assert.equal(await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 }), null);
  assert.equal((await store.claimWaiting({ userId: b, rating: 1000, mode: "rw", now: T0 }))?.id, w.id);
});

test("claim: the oldest waiting match first, and a match is taken once", async () => {
  const { file, store } = fresh();
  const a1 = await player(store, file);
  const a2 = await player(store, file);
  const b = await player(store, file);
  const c = await player(store, file);
  const d = await player(store, file);
  const newer = await waitingMatch(store, a2, T0 + H);
  const older = await waitingMatch(store, a1, T0);
  assert.equal((await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + 2 * H }))?.id, older.id);
  assert.equal((await store.claimWaiting({ userId: c, rating: 1000, mode: "mixed", now: T0 + 2 * H }))?.id, newer.id);
  assert.equal(await store.claimWaiting({ userId: d, rating: 1000, mode: "mixed", now: T0 + 3 * H }), null, "nothing left to take");
});

test("claim: the same pair can't meet again within 24 h", async () => {
  const { file, store } = fresh();
  const { a, b } = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 }); // paired at T0
  const c = await player(store, file);
  const w2 = await waitingMatch(store, a, T0 + H);
  assert.equal(await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + 2 * H }), null, "B met A an hour ago");
  assert.equal((await store.claimWaiting({ userId: c, rating: 1000, mode: "mixed", now: T0 + 2 * H }))?.id, w2.id, "someone else can");
  // A fresh store for the second half: after the cooldown B may play A again.
  const t = fresh();
  const r = await play(t.store, t.file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 });
  const w3 = await waitingMatch(t.store, r.a, T0 + H);
  const later = await t.store.claimWaiting({ userId: r.b, rating: 1000, mode: "mixed", now: T0 + 25 * H });
  assert.equal(later?.id, w3.id);
});

test("limits: at most 3 waiting matches per player", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  for (let i = 0; i < 3; i++) await waitingMatch(store, a, T0 + i);
  assert.equal(await store.countWaiting(a), 3);
  await assert.rejects(store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 + 10 }), (e: unknown) => e instanceof EloLimitError && e.kind === "waiting");
  const other = await player(store, file);
  assert.ok(await store.createMatch({ mode: "mixed", playerA: other, questionIds: IDS, now: T0 }), "another player is not affected");
});

test("limits: at most 30 started matches per rolling day", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  edit(file, (db) => {
    for (let i = 0; i < 30; i++) {
      const m = blank({ playerA: a, status: "finished", createdAt: T0 - i * 1000 });
      db.matches[m.id] = m;
    }
  });
  assert.equal(await store.countStarted(a, T0 - DAY), 30);
  await assert.rejects(store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 }), (e: unknown) => e instanceof EloLimitError && e.kind === "daily");
  await assert.rejects(store.claimWaiting({ userId: a, rating: 1000, mode: "mixed", now: T0 }), (e: unknown) => e instanceof EloLimitError && e.kind === "daily");
  assert.ok(await store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 + DAY + 1 }), "a day later it's fine");
});

test("createMatch needs exactly 10 question ids", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  await assert.rejects(store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS.slice(0, 9), now: T0 }), /exactly 10/);
});

// --- questions and answers ---

test("open / close answer rows: opened once, closed once, ordered by slot", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const w = await waitingMatch(store, a);
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
  const w = await waitingMatch(store, a);
  const base = { matchId: w.id, userId: a, section: "math" as const, difficulty: "hard" as const, limitS: 130 };
  await store.openAnswer({ ...base, idx: 0, qid: "m-1", issuedAt: T0 - 40 * DAY });
  await store.openAnswer({ ...base, idx: 1, qid: "m-2", issuedAt: T0 - DAY });
  await store.openAnswer({ ...base, idx: 2, qid: "m-2", issuedAt: T0 });
  assert.deepEqual((await store.recentQuestionIds(a, T0 - 30 * DAY)).sort(), ["m-2"]);
  assert.deepEqual((await store.recentQuestionIds(uid(), T0 - 30 * DAY)), []);
});

test("listMatches: active / waiting / recent", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  const done = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 });
  const w = await waitingMatch(store, done.a, T0 + H); // done.a: one waiting, one finished
  const playing = await store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 + 2 * H });
  const asA = await store.listMatches(done.a, { now: T0 + 3 * H });
  assert.equal(asA.active, null);
  assert.deepEqual(asA.waiting.map((m) => m.id), [w.id]);
  assert.deepEqual(asA.recent.map((m) => m.id), [done.id]);
  const asB = await store.listMatches(done.b, { now: T0 + 3 * H });
  assert.deepEqual(asB.recent.map((m) => m.id), [done.id], "the opponent sees it too");
  const mine = await store.listMatches(a, { now: T0 + 3 * H });
  assert.equal(mine.active?.id, playing.id);
  // B joins the waiting match: for B it is active, for its creator still "waiting" (their part is done).
  const claimed = await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + 3 * H });
  assert.equal(claimed?.id, w.id);
  assert.equal((await store.listMatches(b, { now: T0 + 3 * H })).active?.id, w.id);
  assert.deepEqual((await store.listMatches(done.a, { now: T0 + 3 * H })).waiting.map((m) => m.id), [w.id]);
});

test("ensurePlayer: created at 1000, name and avatar follow the profile", async () => {
  const { store } = fresh();
  const u = uid();
  const p = await store.ensurePlayer(u, { name: "Ada", avatar: "x" }, T0);
  assert.deepEqual([p.rating, p.peak, p.matches, p.name, p.avatar, p.updatedAt], [1000, 1000, 0, "Ada", "x", T0]);
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

test("week board: points of finished parts in the UTC week; tie-break correct answers, then less time", async () => {
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
    // u1: A part 300 (Tue) + B part 250 (finished Wed) + the A part 10 of a match already playing_b = 560.
    const m1 = put(blank({ playerA: u1, status: "waiting", aFinishedAt: tue, pointsA: 300 }));
    ans(m1, u1, 4, 1000);
    const m2 = put(blank({ playerA: u4, playerB: u1, status: "finished", aFinishedAt: tue, finishedAt: wed, pointsA: 100, pointsB: 250, result: "b" }));
    ans(m2, u1, 0, 1000);
    // u2: 550 in one waiting match, 6 correct, 600 s total.
    const m3 = put(blank({ playerA: u2, status: "waiting", aFinishedAt: mon, pointsA: 550 }));
    ans(m3, u2, 6, 60_000);
    // u3: 550, 6 correct, less time -> above u2.
    const m4 = put(blank({ playerA: u3, status: "waiting", aFinishedAt: wed, pointsA: 550 }));
    ans(m4, u3, 6, 30_000);
    // u5: 550 with only 2 correct but fast: below u2 and u3 (more correct answers beat less time).
    const m5 = put(blank({ playerA: u5, status: "waiting", aFinishedAt: wed, pointsA: 550 }));
    ans(m5, u5, 2, 1000);
    // Not counted: a voided match, last week's part, B's part while the match is still playing_b.
    put(blank({ playerA: u2, status: "void", aFinishedAt: tue, pointsA: 999 }));
    put(blank({ playerA: u3, status: "waiting", aFinishedAt: sunBefore, pointsA: 999 }));
    put(blank({ playerA: u1, playerB: u2, status: "playing_b", aFinishedAt: tue, pointsA: 10, pointsB: 999 }));
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
  const db = JSON.parse(fs.readFileSync(file, "utf8")) as LocalDb;
  assert.deepEqual(db.seasons.map((s) => [s.userId === y ? "y" : "x", s.place, s.rating]), [["y", 1, 1200], ["x", 2, 1100]]);
  await assert.rejects(store.closeSeason("2026-11", NOW), /not over/);
  await assert.rejects(store.closeSeason("2026-13", NOW), /YYYY-MM/);
});

// --- review fixes ---

test("void never drops peak below the start rating 1000", async () => {
  const { file, store } = fresh();
  const { a, b, id } = await play(store, file, { ra: 500, rb: 500, pointsA: 500, pointsB: 400 }); // A 512, B 488
  await store.voidMatch(id);
  const pa = (await store.getPlayer(a))!;
  const pb = (await store.getPlayer(b))!;
  assert.deepEqual([pa.rating, pa.peak, pb.rating, pb.peak], [500, 1000, 500, 1000]);
});

/** What the admin reset does to the local file (supabase/elo-admin.sql elo_reset_player): rating and peak back to 1000, a 'reset' history row. */
function resetPlayer(file: string, userId: string, at: number) {
  edit(file, (db) => {
    const p = db.players[userId];
    db.history.push({ id: db.nextHistoryId++, userId, matchId: "00000000-0000-0000-0000-000000000000", at, ratingBefore: p.rating, ratingAfter: 1000, reason: "reset" });
    p.rating = 1000;
    p.peak = 1000;
  });
}

test("reset after a match, then void: the rating is not taken off twice, the counters are fixed", async () => {
  const { file, store } = fresh();
  const { a, b, id } = await play(store, file, { ra: 1000, rb: 1000, pointsA: 500, pointsB: 400 }); // A +12, B -12, finished at T0 + 60 s
  edit(file, (db) => {
    db.players[a].rating = 1300; // A kept winning...
    db.players[a].peak = 1300;
  });
  resetPlayer(file, a, T0 + 2 * H); // ...and the admin reset them to 1000
  const out = await store.voidMatch(id, T0 + 9 * H);
  assert.equal(out.changed, true);
  const pa = (await store.getPlayer(a))!;
  assert.deepEqual([pa.rating, pa.peak, pa.matches, pa.wins], [1000, 1000, 20, 0], "rating stays 1000 (no -12 again), wins/matches fixed");
  const row = JSON.parse(fs.readFileSync(file, "utf8")).history.filter((h: { userId: string; reason: string }) => h.userId === a && h.reason === "void");
  assert.equal(row.length, 1);
  assert.equal(row[0].ratingBefore, row[0].ratingAfter, "the reverting history row has delta 0");
  const pb = (await store.getPlayer(b))!; // B was never reset: their change is taken back as usual
  assert.deepEqual([pb.rating, pb.matches, pb.losses], [1000, 20, 0]);
});

test("void of a match played AFTER the reset still takes its delta off; the peak counts only matches after the reset", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: 1000, matches: 20 });
  const b = await player(store, file, { rating: 1000, matches: 20 });
  // A's old match (before the reset) pushed the peak to 1200.
  edit(file, (db) => {
    db.matches.old = blank({ id: "old", playerA: a, playerB: b, status: "finished", createdAt: T0 - 3 * DAY, bStartedAt: T0 - 3 * DAY, finishedAt: T0 - 3 * DAY, result: "a", deltaA: 200, deltaB: -200 });
    db.history.push({ id: db.nextHistoryId++, userId: a, matchId: "old", at: T0 - 3 * DAY, ratingBefore: 1000, ratingAfter: 1200, reason: "match" });
    db.players[a].rating = 1200;
    db.players[a].peak = 1200;
  });
  resetPlayer(file, a, T0 + H);
  const w = await waitingMatch(store, a, T0 + 2 * H, "mixed", 500);
  assert.ok(await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 + 3 * H }), "B joins");
  assert.ok(await store.updateMatch(w.id, { pointsB: 400 }, ["playing_b"]));
  await store.finishMatch(w.id, T0 + 4 * H);
  const after = (await store.getPlayer(a))!;
  assert.equal(after.rating > 1000, true);
  await store.voidMatch(w.id, T0 + 5 * H);
  const pa = (await store.getPlayer(a))!;
  assert.deepEqual([pa.rating, pa.peak], [1000, 1000], "the new match is reverted from 1000 + delta; the pre-reset 1200 doesn't come back as peak");
});

test("createMatch: a second playing_a match for the same player is refused (EloActiveMatchError); a waiting one doesn't block", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const first = await store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 });
  await assert.rejects(store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 + 1000 }), EloActiveMatchError);
  await store.updateMatch(first.id, { status: "waiting", aFinishedAt: T0 + 2000, pointsA: 100 }, ["playing_a"]);
  const second = await store.createMatch({ mode: "mixed", playerA: a, questionIds: IDS, now: T0 + 3000 });
  assert.equal(second.status, "playing_a");
});

test("Supabase store: a 23505 on the one-playing_a index becomes EloActiveMatchError", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: unknown) => {
    const url = String(input);
    if (url.includes("elo_matches") && !url.includes("?")) {
      return new Response(JSON.stringify({ code: "23505", message: 'duplicate key value violates unique constraint "elo_matches_one_playing_a"' }), { status: 409 });
    }
    return new Response("[]", { status: 200 });
  }) as typeof fetch;
  try {
    const s = createSupabaseStore("http://sb.test", "key");
    await assert.rejects(s.createMatch({ mode: "mixed", playerA: uid(), questionIds: IDS, now: T0 }), EloActiveMatchError);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("unknown ids: reads give null, finish / void say not found", async () => {
  const { file, store } = fresh();
  assert.equal(await store.getMatch("nope"), null);
  assert.equal(await store.getPlayer("nope"), null);
  assert.equal(await store.updateMatch("nope", { pointsA: 1 }), null);
  await assert.rejects(store.finishMatch("nope"), EloNotFoundError);
  await assert.rejects(store.voidMatch("nope"), EloNotFoundError);
  void file;
});

test("Supabase store: a malformed id is null / empty on reads and a typed error on writes (no request is sent)", async () => {
  const s = createSupabaseStore("http://127.0.0.1:9", "key");
  assert.equal(await s.getMatch("not-a-uuid"), null);
  assert.equal(await s.getPlayer("not-a-uuid"), null);
  assert.equal(await s.updateMatch("not-a-uuid", { pointsA: 1 }), null);
  assert.deepEqual(await s.getPlayers(["x", "y"]), {});
  assert.deepEqual(await s.getAnswers("x", "y"), []);
  assert.deepEqual(await s.recentQuestionIds("x", 0), []);
  assert.deepEqual(await s.listMatches("x"), { active: null, waiting: [], recent: [] });
  assert.equal(await s.countWaiting("x"), 0);
  assert.equal(await s.countStarted("x", 0), 0);
  assert.equal(await s.closeAnswer("x", "y", 0, { status: "timeout", answeredAt: null, response: null, elapsedMs: null, correct: null, base: 0, bonus: 0, points: 0 }), null);
  await assert.rejects(s.finishMatch("x"), EloNotFoundError);
  await assert.rejects(s.voidMatch("x"), EloNotFoundError);
  await assert.rejects(s.ensurePlayer("x"), EloInvalidIdError);
  await assert.rejects(s.createMatch({ mode: "mixed", playerA: "x", questionIds: IDS }), EloInvalidIdError);
  await assert.rejects(s.claimWaiting({ userId: "x", rating: 1000, mode: "mixed" }), EloInvalidIdError);
});

test("Supabase store requests: expiry uses lte, the board page is capped, listMatches queries both roles by activity", async () => {
  const seen: { url: string; body: string }[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: unknown, init?: RequestInit) => {
    seen.push({ url: String(input), body: String(init?.body ?? "") });
    const url = String(input);
    const text = url.includes("rpc/elo_leaderboard") ? JSON.stringify({ total: 0, rows: [], me: null }) : "[]";
    return new Response(text, { status: 200 });
  }) as typeof fetch;
  try {
    const s = createSupabaseStore("http://sb.test", "key");
    const u = uid();
    await s.expireStale(T0);
    await s.leaderboard({ board: "global", page: 9e15 });
    await s.listMatches(u, { now: T0 });
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.ok(seen.some((r) => r.url.includes("expires_at=lte.")), "expireStale must use lte");
  const board = seen.find((r) => r.url.includes("rpc/elo_leaderboard"))!;
  assert.equal(JSON.parse(board.body).p_page, 1_000_000);
  assert.ok(seen.some((r) => r.url.includes("player_a=eq.") && r.url.includes("order=created_at.desc")));
  assert.ok(seen.some((r) => r.url.includes("player_b=eq.") && r.url.includes("order=b_started_at.desc")));
});

test("a waiting match with no second player is voided by finish when player_b is gone (no rating change)", async () => {
  const { file, store } = fresh();
  const a = await player(store, file, { rating: 1000, matches: 20 });
  const w = await waitingMatch(store, a);
  edit(file, (db) => {
    db.matches[w.id].status = "playing_b"; // B joined and then deleted their account: player_b is null
    db.matches[w.id].pointsB = 100;
  });
  const out = await store.finishMatch(w.id);
  assert.equal(out.status, "void");
  assert.equal(out.changed, true);
  assert.equal((await store.finishMatch(w.id)).changed, false);
  assert.deepEqual([(await store.getPlayer(a))?.rating, (await store.getPlayer(a))?.matches], [1000, 20]);
});

test("a player with a match in progress can't claim another", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  const b = await player(store, file);
  await waitingMatch(store, a);
  const mine = await store.createMatch({ mode: "mixed", playerA: b, questionIds: IDS, now: T0 });
  await assert.rejects(store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 }), EloActiveMatchError);
  await store.updateMatch(mine.id, { status: "waiting", aFinishedAt: T0, pointsA: 1 }, ["playing_a"]);
  assert.ok(await store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 }), "free again once their part is done");
  await assert.rejects(store.claimWaiting({ userId: b, rating: 1000, mode: "mixed", now: T0 }), EloActiveMatchError, "playing_b counts too");
});

test("expiry is inclusive at exactly 48 h", async () => {
  const { file, store } = fresh();
  const a = await player(store, file);
  await waitingMatch(store, a);
  assert.equal(await store.expireStale(T0 + 48 * H), 1);
});

test("listMatches: a match just joined as B is not buried under older-created matches of the user", async () => {
  const { file, store } = fresh();
  const me = await player(store, file);
  const other = await player(store, file);
  edit(file, (db) => {
    const joined = blank({ playerA: other, playerB: me, status: "finished", createdAt: T0, bStartedAt: T0 + 10 * H, finishedAt: T0 + 11 * H });
    const mineLater = blank({ playerA: me, playerB: uid(), status: "finished", createdAt: T0 + 5 * H, bStartedAt: T0 + 6 * H, finishedAt: T0 + 7 * H });
    db.matches[joined.id] = joined;
    db.matches[mineLater.id] = mineLater;
  });
  const lists = await store.listMatches(me, { now: T0 + 12 * H });
  assert.equal(lists.recent[0]?.playerB, me, "joined at T0+10h beats created at T0+5h");
  assert.equal(lists.recent.length, 2);
});
