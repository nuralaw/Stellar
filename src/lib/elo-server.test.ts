// Run: npm run elo:server-test  (node:test on the LOCAL file store and a small fake question bank; --conditions=react-server lets
// "server-only" load under plain Node). Covers docs/ELO-live.md 8.3 (and the unchanged checks of docs/ELO.md 9.5-9.6) for the server
// logic (src/lib/elo-server.ts): the queue, parallel play, the start deadline, abandoned parts, forfeits and the leak checks.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { applyElo, difficultyMix, questionPoints } from "./elo.ts";
import { ABANDON_AFTER_S, MATCH_SIZE, MAX_MATCHES_PER_DAY, MIXED_LAYOUT, NETWORK_GRACE_MS, QUEUE, START_DEADLINE_S, START_RATING } from "./elo-config.ts";
import { buildQuestionSet, createRankedService, publicImagePath, RankedError, splitMix, type QuestionBank } from "./elo-server.ts";
import { createLocalStore, type EloMatch, type EloStore, type LocalDb } from "./elo-store.ts";
import type { MatchState, NextResponse } from "./elo-api-types.ts";
import type { Difficulty, Question } from "./types";
import type { SectionId } from "./taxonomy";

const H = 3_600_000;
const DAY = 24 * H;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const T0 = Date.UTC(2026, 10, 20, 12, 0, 0);
/** When the players start playing: a second after the pair is made at T0 (well inside the 90 s start deadline). */
const S = T0 + 1000;
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

/* ---------------- fixtures ---------------- */

// 24 questions per section and difficulty. Alternating mcq (answer "B") and spr (answer 7.25). The explanation and the ids carry
// markers (EXPL_SECRET / QID_) so a leak is visible in any JSON.
function fakeQuestions(): Question[] {
  const out: Question[] = [];
  for (const section of ["rw", "math"] as SectionId[]) {
    for (const difficulty of DIFFS) {
      for (let i = 0; i < 24; i++) {
        const id = `QID_${section}_${difficulty}_${i}`;
        const base = { id, section, source: "cb", domain: "d", skill: "s", difficulty, prompt: `PROMPT ${section}-${difficulty}-${i}`, explanation: `EXPL_SECRET ${id}` };
        out.push(
          (i % 2 === 0
            ? { ...base, type: "mcq", choices: { A: "a", B: "b", C: "c", D: "d" }, answer: "B" }
            : { ...base, type: "spr", answer: ["7.25"] }) as unknown as Question,
        );
      }
    }
  }
  return out;
}

const QUESTIONS = fakeQuestions();
const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
const BY_PROMPT = new Map(QUESTIONS.map((q) => [q.prompt, q]));

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const bank: QuestionBank = {
  sample: ({ section, difficulty, limit, exclude }) => {
    const pool = QUESTIONS.filter((q) => q.section === section && q.difficulty === difficulty);
    const fresh = shuffle(pool.filter((q) => !exclude.has(q.id)));
    const seen = shuffle(pool.filter((q) => exclude.has(q.id)));
    return [...fresh, ...seen].slice(0, limit);
  },
  byIds: (ids) => ids.map((id) => BY_ID.get(id)).filter((q): q is Question => Boolean(q)),
};

/** The same bank with a figure and all choice images on every question (bank paths, as in the real bank). */
const imageBank: QuestionBank = {
  ...bank,
  byIds: (ids) =>
    bank.byIds(ids).map((q) => {
      const tag = `${q.section}-${q.difficulty}-${q.id.split("_")[3]}`;
      const withFigure = { ...q, figure: { src: `/bank/img/${q.section}/${tag}.webp` } };
      return (q.type === "mcq"
        ? {
            ...withFigure,
            choicesImage: `/bank/img/${q.section}/${tag}_choices.webp`,
            choiceImages: { A: `/tests/img/${tag}-A.webp`, B: `/tests/img/${tag}-B.webp`, C: `/tests/img/${tag}-C.webp`, D: `/tests/img/${tag}-D.webp` },
          }
        : withFigure) as Question;
    }),
};

function setup(wrap?: (store: EloStore) => EloStore, useBank: QuestionBank = bank) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "elo-server-"));
  const file = path.join(dir, "elo.json");
  const store = createLocalStore(file);
  return { file, store, svc: createRankedService(wrap ? wrap(store) : store, useBank) };
}
type Ctx = ReturnType<typeof setup>;

function edit(file: string, fn: (db: LocalDb) => void) {
  const db = JSON.parse(fs.readFileSync(file, "utf8")) as LocalDb;
  fn(db);
  fs.writeFileSync(file, JSON.stringify(db));
}

/** A user with a name; `matches: 10` = out of calibration (K 24), like case E1. */
async function user(c: Ctx, o: { matches?: number; rating?: number } = {}) {
  const id = randomUUID();
  await c.store.ensurePlayer(id, { name: `P-${id.slice(0, 4)}` }, T0);
  edit(c.file, (db) => {
    if (o.matches !== undefined) db.players[id].matches = o.matches;
    if (o.rating !== undefined) {
      db.players[id].rating = o.rating;
      db.players[id].peak = Math.max(db.players[id].peak, o.rating);
    }
  });
  return id;
}

const questionOf = (n: Extract<NextResponse, { done: false }>) => BY_PROMPT.get(n.question.prompt)!;
const rightAnswer = (q: Question) => (q.type === "mcq" ? q.answer : q.answer[0]);
const wrongAnswer = (q: Question) => (q.type === "mcq" ? "C" : "99");

/** A question handed out and answered at once: `after` = ms after the question was issued (and the network grace) the answer arrives. */
async function step(c: Ctx, userId: string, matchId: string, now: number, o: { right?: boolean; after?: number } = {}) {
  const n = await c.svc.next(userId, matchId, now);
  assert.equal(n.done, false);
  if (n.done) throw new Error("the part is already done");
  const q = questionOf(n);
  const at = n.issuedAt + NETWORK_GRACE_MS + (o.after ?? 0);
  return { next: n, at, res: await c.svc.answer(userId, matchId, n.idx, o.right === false ? wrongAnswer(q) : rightAnswer(q), at) };
}

/** Plays (all or the first `count`) questions of a match. `after` = ms after the question was issued the answer arrives. */
async function playThrough(
  c: Ctx,
  userId: string,
  matchId: string,
  start: number,
  o: { right?: boolean | ((idx: number) => boolean); after?: number; count?: number } = {},
) {
  const answers = [];
  let now = start;
  for (let i = 0; i < (o.count ?? MATCH_SIZE); i++) {
    const n = await c.svc.next(userId, matchId, now);
    assert.equal(n.done, false);
    if (n.done) break;
    const right = typeof o.right === "function" ? o.right(n.idx) : (o.right ?? true);
    const q = questionOf(n);
    now = n.issuedAt + NETWORK_GRACE_MS + (o.after ?? 0);
    answers.push({ next: n, res: await c.svc.answer(userId, matchId, n.idx, right ? rightAnswer(q) : wrongAnswer(q), now) });
  }
  return { answers, end: now };
}

/** The first player searches at `now`, the second a millisecond later and the pair is made: the first one is A. Returns the match id. */
async function pair(c: Ctx, first: string, second: string, now = T0): Promise<string> {
  assert.equal((await c.svc.queueJoin(first, { mode: "mixed" }, now)).status, "searching");
  const q = await c.svc.queueJoin(second, { mode: "mixed" }, now + 1);
  assert.equal(q.status, "matched");
  return q.matchId!;
}

/** A void match row (counts as "started" for the daily limit) for faking the history straight in the file. */
function fakeMatch(id: string, playerA: string, createdAt: number): EloMatch {
  return {
    id,
    mode: "mixed",
    status: "void",
    playerA,
    playerB: null,
    questionIds: Array.from({ length: MATCH_SIZE }, (_, i) => `QID_fake_${i}`),
    createdAt,
    aStartedAt: null,
    bStartedAt: null,
    aFinishedAt: null,
    bFinishedAt: null,
    startBy: null,
    finishedAt: null,
    pointsA: null,
    pointsB: null,
    forfeit: null,
    result: null,
    ratingABefore: null,
    ratingBBefore: null,
    deltaA: null,
    deltaB: null,
  };
}

async function rejects(p: Promise<unknown>, status: number, code?: string) {
  await assert.rejects(p, (e: unknown) => e instanceof RankedError && e.status === status && (code === undefined || e.code === code), `expected ${status} ${code ?? ""}`);
}

/** No answer / explanation / question id anywhere in a response before the match is over. */
function assertNoLeak(value: unknown, label: string) {
  const json = JSON.stringify(value);
  assert.ok(!/"(answer|explanation|qid)"\s*:/.test(json), `${label}: answer/explanation/qid key`);
  assert.ok(!json.includes("EXPL_SECRET"), `${label}: explanation text`);
  assert.ok(!json.includes("QID_"), `${label}: question id`);
  assert.ok(!json.includes("/bank/") && !json.includes("/tests/"), `${label}: bank image path`);
}

/* ---------------- question set ---------------- */

test("splitMix: every mix splits 5 + 5 and keeps the difficulty totals", () => {
  for (const rating of [100, 899, 900, 1299, 1300, 1699, 1700, 2500]) {
    const mix = difficultyMix(rating);
    const split = splitMix(mix);
    for (const s of ["rw", "math"] as const) assert.equal(split[s].easy + split[s].medium + split[s].hard, 5, `${rating} ${s}`);
    for (const d of DIFFS) assert.equal(split.rw[d] + split.math[d], mix[d], `${rating} ${d}`);
  }
  assert.deepEqual(splitMix({ easy: 3, medium: 5, hard: 2 }), { rw: { easy: 2, medium: 2, hard: 1 }, math: { easy: 1, medium: 3, hard: 1 } });
});

test("buildQuestionSet: 10 slots alternate RW/Math, easy to hard inside a section, mix by rating, no repeats", () => {
  for (const rating of [800, 1000, 1500, 1900]) {
    const ids = buildQuestionSet(rating, new Set(), bank);
    const qs = bank.byIds(ids);
    assert.equal(ids.length, MATCH_SIZE);
    assert.equal(new Set(ids).size, MATCH_SIZE);
    assert.deepEqual(qs.map((q) => q.section), [...MIXED_LAYOUT]);
    for (const s of ["rw", "math"] as const) {
      const ranks = qs.filter((q) => q.section === s).map((q) => DIFFS.indexOf(q.difficulty));
      assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b));
    }
    const mix = difficultyMix(rating);
    for (const d of DIFFS) assert.equal(qs.filter((q) => q.difficulty === d).length, mix[d]);
  }
});

test("buildQuestionSet: avoids recent questions when the bank allows, repeats them when it doesn't", () => {
  const recent = new Set(QUESTIONS.filter((q) => Number(q.id.split("_")[3]) < 10).map((q) => q.id));
  for (let i = 0; i < 20; i++) assert.ok(!buildQuestionSet(1000, recent, bank).some((id) => recent.has(id)));
  const all = new Set(QUESTIONS.map((q) => q.id));
  assert.equal(buildQuestionSet(1000, all, bank).length, MATCH_SIZE);
  // A bank without hard questions: the set is topped up with the nearest difficulty, not an error.
  const noHard: QuestionBank = { ...bank, sample: (q) => (q.difficulty === "hard" ? [] : bank.sample(q)) };
  const ids = buildQuestionSet(1900, new Set(), noHard);
  assert.equal(new Set(ids).size, MATCH_SIZE);
  assert.ok(bank.byIds(ids).every((q) => q.difficulty !== "hard"));
});

/* ---------------- a whole match ---------------- */

test("two players play in parallel (calls interleaved): playing -> finished, new players at 100 (winner +12, loser stays at the floor)", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const m0 = (await c.store.getMatch(id))!;
  assert.deepEqual([m0.status, m0.playerA, m0.playerB, m0.pointsA, m0.pointsB], ["playing", a, b, null, null]);
  assert.equal(m0.startBy, m0.createdAt + START_DEADLINE_S * 1000);

  // Before anybody starts: both see the start deadline, nothing of the opponent.
  const s0 = await c.svc.state(a, id, S);
  assert.deepEqual([s0.status, s0.myPartDone, s0.opponentDone, s0.startBy, s0.serverNow, s0.review], ["playing", false, false, m0.startBy, S, null]);

  let ta = S;
  let tb = S + 500;
  const ra: { next: Extract<NextResponse, { done: false }>; res: Awaited<ReturnType<Ctx["svc"]["answer"]>> }[] = [];
  const rb: typeof ra = [];
  for (let i = 0; i < MATCH_SIZE; i++) {
    const x = await step(c, a, id, ta, { right: true, after: 1000 });
    ta = x.at;
    ra.push(x);
    if (i === 0) assert.equal((await c.svc.state(a, id, ta)).startBy, null, "started: no start deadline any more");
    if (i === MATCH_SIZE - 1) {
      // A is done, B still plays: A waits. No review, no opponent points, no outcome; opponentDone false for A, true for B.
      assert.equal(x.res.done, true);
      const wait = (await c.store.getMatch(id))!;
      assert.deepEqual([wait.status, wait.pointsA, wait.pointsB], ["playing", x.res.totalPoints, null]);
      assert.ok(wait.aFinishedAt !== null && wait.bFinishedAt === null);
      const sa = await c.svc.state(a, id, ta);
      assert.deepEqual([sa.status, sa.myPartDone, sa.opponentDone, sa.opponentPoints, sa.outcome, sa.delta, sa.review], ["playing", true, false, null, null, null, null]);
      assert.equal(sa.myPoints, x.res.totalPoints);
      const sb = await c.svc.state(b, id, ta);
      assert.deepEqual([sb.status, sb.myPartDone, sb.opponentDone, sb.opponentPoints, sb.review], ["playing", false, true, null, null]);
      assert.deepEqual(await c.svc.next(a, id, ta + 1000), { done: true, totalPoints: x.res.totalPoints });
      const hubA = await c.svc.hub(a, ta);
      assert.deepEqual([hubA.active!.id, hubA.active!.myPartDone, hubA.active!.opponentDone], [id, true, false]);
    } else {
      const sa = await c.svc.state(a, id, ta);
      assert.deepEqual([sa.review, sa.opponentPoints, sa.opponentDone], [null, null, false]);
    }
    const y = await step(c, b, id, tb, { right: false, after: 2000 });
    tb = y.at;
    rb.push(y);
    if (i < MATCH_SIZE - 1) assert.equal((await c.svc.state(b, id, tb)).review, null);
  }
  assert.ok(ra.every((x) => x.res.points > 0));
  assert.ok(rb.every((x) => x.res.points === 0));
  assert.equal(rb.at(-1)!.res.done, true);

  const fin = (await c.store.getMatch(id))!;
  assert.equal(fin.status, "finished");
  assert.equal(fin.result, "a");
  assert.ok(fin.bFinishedAt !== null && fin.finishedAt !== null);
  const exp = applyElo({ a: { rating: START_RATING, matches: 10 }, b: { rating: START_RATING, matches: 10 }, result: "a" });
  assert.deepEqual([exp.deltaA, exp.deltaB], [12, 0], "B would drop to 88: the floor keeps 100, delta 0");
  assert.deepEqual([fin.deltaA, fin.deltaB], [12, 0]);
  assert.equal((await c.store.getPlayer(a))!.rating, START_RATING + 12);
  assert.equal((await c.store.getPlayer(b))!.rating, START_RATING);

  // Both got the same questions in the same order.
  assert.deepEqual(
    ra.map((x) => x.next.question.prompt),
    rb.map((x) => x.next.question.prompt),
  );

  const sa = await c.svc.state(a, id, tb + H);
  assert.deepEqual([sa.status, sa.outcome, sa.delta, sa.ratingBefore, sa.ratingAfter, sa.opponentPoints, sa.myPoints], ["finished", "win", 12, START_RATING, START_RATING + 12, 0, fin.pointsA]);
  assert.deepEqual([sa.myPartDone, sa.opponentDone], [true, true]);
  const sb = await c.svc.state(b, id, tb + H);
  assert.deepEqual([sb.outcome, sb.delta, sb.ratingAfter, sb.opponentPoints], ["loss", 0, START_RATING, fin.pointsA]);
  // The review comes only now, with answers and explanations, and has no question id (only the slot number).
  assert.equal(sa.review!.length, MATCH_SIZE);
  assert.ok(sa.review!.every((r) => typeof r.explanation === "string" && r.answer !== undefined && r.correct && r.status === "answered"));
  assert.ok(sb.review!.every((r) => !r.correct));
  assert.ok(sa.review!.every((r) => !("id" in r) && !("qid" in r) && !("id" in r.question)));

  // Double finish does not apply ELO twice.
  await c.store.finishMatch(id);
  assert.equal((await c.store.getPlayer(a))!.rating, START_RATING + 12);
  assert.equal((await c.store.getPlayer(a))!.matches, 11);
});

test("whoever finishes first sees opponentDone false -> true: B first, then A", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const first = await step(c, a, id, S); // A has started and is mid-part
  const r = await playThrough(c, b, id, S, { right: false });
  const sb = await c.svc.state(b, id, r.end);
  assert.deepEqual([sb.status, sb.myPartDone, sb.opponentDone, sb.review, sb.opponentPoints], ["playing", true, false, null, null]);
  const sa = await c.svc.state(a, id, r.end);
  assert.deepEqual([sa.myPartDone, sa.opponentDone, sa.review], [false, true, null]);
  assert.equal((await c.svc.hub(b, r.end)).active!.opponentDone, false);
  await playThrough(c, a, id, first.at, { right: true, count: MATCH_SIZE - 1 });
  const sb2 = await c.svc.state(b, id, r.end + H);
  assert.deepEqual([sb2.status, sb2.myPartDone, sb2.opponentDone, sb2.outcome], ["finished", true, true, "loss"]);
  assert.equal(sb2.review!.length, MATCH_SIZE);
});

test("scoring is the server's: Q1 of the spec (RW easy, 10 s) = 140 points; the grace is subtracted", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const n = await c.svc.next(a, id, S);
  assert.ok(!n.done);
  if (n.done) return;
  assert.equal(n.section, "rw");
  assert.equal(n.difficulty, "easy");
  assert.equal(n.limitS, 60);
  assert.equal(n.idx, 0);
  assert.equal(n.issuedAt, S);
  assert.equal(n.serverNow, S);
  // The part started: the server stamped it (once).
  assert.equal((await c.store.getMatch(id))!.aStartedAt, S);
  assert.equal((await c.store.getMatch(id))!.bStartedAt, null);
  await c.svc.next(a, id, S + 1000);
  assert.equal((await c.store.getMatch(id))!.aStartedAt, S, "a repeated next doesn't move the start");
  // 12 s after issue = 10 s of thinking + 2 s of network grace.
  const res = await c.svc.answer(a, id, 0, rightAnswer(questionOf(n)), S + 12_000);
  assert.deepEqual([res.base, res.bonus, res.points, res.elapsedMs, res.correct, res.timedOut], [100, 40, 140, 10_000, true, false]);
  assert.equal(res.totalPoints, 140);
  assert.equal(res.done, false);
});

test("the client's clock is irrelevant: the same schedule an hour apart gives the same points", async () => {
  const c = setup();
  const x = await user(c, { matches: 10 });
  const y = await user(c, { matches: 10 });
  const x2 = await user(c, { matches: 10 });
  const y2 = await user(c, { matches: 10 });
  const m1 = await pair(c, x, y, T0);
  const m2 = await pair(c, x2, y2, T0 + 5 * H);
  const r1 = await playThrough(c, x, m1, S, { after: 5000 });
  const r2 = await playThrough(c, x2, m2, S + 5 * H, { after: 5000 });
  assert.deepEqual(
    r1.answers.map((r) => r.res.points),
    r2.answers.map((r) => r.res.points),
  );
});

/* ---------------- timing and answers ---------------- */

test("a second answer to a question is 409; so is an answer to a question never issued", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  const n = await c.svc.next(a, id, S);
  assert.ok(!n.done);
  if (n.done) return;
  await c.svc.answer(a, id, 0, rightAnswer(questionOf(n)), S + 3000);
  await rejects(c.svc.answer(a, id, 0, rightAnswer(questionOf(n)), S + 4000), 409, "conflict");
  await rejects(c.svc.answer(a, id, 1, "B", S + 4000), 409, "conflict"); // idx 1 not issued yet
  await rejects(c.svc.answer(a, id, 7, "B", S + 4000), 409, "conflict");
  assert.equal((await c.store.getAnswers(id, a))[0].points > 0, true); // the first answer still stands
});

test("an answer after the limit is 0 points and a timeout", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  const n = await c.svc.next(a, id, S);
  assert.ok(!n.done);
  if (n.done) return;
  const late = S + n.limitS * 1000 + NETWORK_GRACE_MS + 1; // 1 ms over the limit after the grace
  const res = await c.svc.answer(a, id, 0, rightAnswer(questionOf(n)), late);
  assert.deepEqual([res.points, res.base, res.bonus, res.timedOut, res.correct], [0, 0, 0, true, false]);
  assert.equal((await c.store.getAnswers(id, a))[0].status, "timeout");
  // Exactly at the limit still counts (4.3: t > L is the timeout), with the minimum speed bonus of 0.
  const n2 = await c.svc.next(a, id, late);
  assert.ok(!n2.done);
  if (n2.done) return;
  const ok = await c.svc.answer(a, id, 1, rightAnswer(questionOf(n2)), n2.issuedAt + n2.limitS * 1000 + NETWORK_GRACE_MS);
  const exp = questionPoints({ section: n2.section, difficulty: n2.difficulty, correct: true, elapsedMs: n2.limitS * 1000 });
  assert.equal(ok.points, exp.points);
  assert.equal(ok.bonus, 0);
});

test("next is idempotent while a question is open: same idx and issuedAt, current serverNow; no way to skip it", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  const n0 = await c.svc.next(a, id, S);
  assert.ok(!n0.done);
  if (n0.done) return;
  // Double clicks, reloads, double effects: the same question comes back, the countdown keeps the original issuedAt.
  for (const dt of [0, 1, 5000, 20_000]) {
    const again = await c.svc.next(a, id, S + dt);
    assert.ok(!again.done);
    if (again.done) return;
    assert.deepEqual([again.idx, again.issuedAt, again.serverNow, again.question.prompt], [0, S, S + dt, n0.question.prompt]);
    assert.equal(again.limitS, n0.limitS);
  }
  assert.deepEqual((await c.store.getAnswers(id, a)).map((r) => [r.idx, r.status]), [[0, "open"]]);
  // Still open at limit + grace exactly (the same boundary as `answer`): nothing is skipped.
  const edge = await c.svc.next(a, id, S + n0.limitS * 1000 + NETWORK_GRACE_MS);
  assert.ok(!edge.done && edge.idx === 0);
  // The open question can still be answered after the repeats.
  const res = await c.svc.answer(a, id, 0, rightAnswer(questionOf(n0)), S + 12_000);
  assert.equal(res.correct, true);
  // After it is answered, next moves on.
  const n1 = await c.svc.next(a, id, S + 13_000);
  assert.ok(!n1.done && n1.idx === 1 && n1.issuedAt === S + 13_000);
});

test("next after the limit closes the open question as a timeout and moves on; a whole part of timeouts completes", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  const n0 = await c.svc.next(a, id, S);
  assert.ok(!n0.done);
  if (n0.done) return;
  const late = S + n0.limitS * 1000 + NETWORK_GRACE_MS + 1;
  const n1 = await c.svc.next(a, id, late);
  assert.ok(!n1.done && n1.idx === 1 && n1.issuedAt === late);
  const rows = await c.store.getAnswers(id, a);
  assert.deepEqual(rows.map((r) => [r.idx, r.status, r.points]), [[0, "timeout", 0], [1, "open", 0]]);
  // The closed question can't be answered any more.
  await rejects(c.svc.answer(a, id, 0, "B", late + 1000), 409, "conflict");
  // A whole match of waiting each question out: every question is a timeout, the part still completes. (B never started: the start
  // deadline passed meanwhile, so B forfeited and the match ends together with A's part.)
  let now = late;
  let cur: NextResponse = n1;
  for (let i = 2; i <= MATCH_SIZE; i++) {
    assert.ok(!cur.done);
    if (cur.done) return;
    now = cur.issuedAt + cur.limitS * 1000 + NETWORK_GRACE_MS + 1;
    cur = await c.svc.next(a, id, now);
    if (i < MATCH_SIZE) assert.ok(!cur.done && cur.idx === i);
  }
  assert.deepEqual(cur, { done: true, totalPoints: 0 });
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.pointsA, m.forfeit, m.status], [0, "b", "finished"]);
  // next on a finished part is harmless.
  assert.deepEqual(await c.svc.next(a, id, now + 99_000), { done: true, totalPoints: 0 });
});

test("annul gives 0 points, can be repeated, and doesn't touch an answered question", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  const n = await c.svc.next(a, id, S);
  assert.ok(!n.done);
  const res = await c.svc.annul(a, id, 0, S + 4000);
  assert.deepEqual([res.points, res.base, res.bonus, res.correct, res.totalPoints, res.done], [0, 0, 0, false, 0, false]);
  assert.equal((await c.store.getAnswers(id, a))[0].status, "annulled");
  // Repeated: the same result. The question can't be answered after that.
  assert.equal((await c.svc.annul(a, id, 0, S + 5000)).points, 0);
  await rejects(c.svc.answer(a, id, 0, "B", S + 5000), 409);
  // An answered question can't be annulled.
  const n1 = await c.svc.next(a, id, S + 6000);
  assert.ok(!n1.done);
  if (n1.done) return;
  await c.svc.answer(a, id, 1, rightAnswer(questionOf(n1)), S + 9000);
  await rejects(c.svc.annul(a, id, 1, S + 9500), 409);
  await rejects(c.svc.annul(a, id, 5, S + 9500), 409); // never issued
  await rejects(c.svc.annul(a, id, 99, S + 9500), 400, "bad_request");
});

test("bad bodies are 400", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  await c.svc.next(a, id, S);
  await rejects(c.svc.answer(a, id, "0", "B", S), 400, "bad_request");
  await rejects(c.svc.answer(a, id, 1.5, "B", S), 400, "bad_request");
  await rejects(c.svc.answer(a, id, -1, "B", S), 400, "bad_request");
  await rejects(c.svc.answer(a, id, 0, 5, S), 400, "bad_request");
  await rejects(c.svc.answer(a, id, 0, "x".repeat(13), S), 400, "bad_request");
  await rejects(c.svc.queueJoin(a, { mode: "rw" }, S), 400, "bad_request");
  // A wrong answer text is just wrong, a blank one too.
  const res = await c.svc.answer(a, id, 0, "", S + 3000);
  assert.deepEqual([res.correct, res.points, res.timedOut], [false, 0, false]);
});

/* ---------------- who may do what ---------------- */

test("a stranger gets 404 on every route of someone else's match; unknown ids too", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const x = await user(c);
  const id = await pair(c, a, b);
  await c.svc.next(a, id, S);
  await rejects(c.svc.state(x, id, S), 404, "not_found");
  await rejects(c.svc.next(x, id, S), 404, "not_found");
  await rejects(c.svc.answer(x, id, 0, "B", S), 404, "not_found");
  await rejects(c.svc.annul(x, id, 0, S), 404, "not_found");
  await rejects(c.svc.leave(x, id, S), 404, "not_found");
  await rejects(c.svc.image(x, id, 0, "figure"), 404, "not_found");
  await rejects(c.svc.state(a, randomUUID(), S), 404, "not_found");
  await rejects(c.svc.state(a, "not-an-id", S), 404, "not_found");
  // A stranger's attempts changed nothing.
  assert.equal((await c.store.getAnswers(id, a)).length, 1);
  assert.equal((await c.store.getAnswers(id, x)).length, 0);
  assert.equal((await c.store.getMatch(id))!.status, "playing");
});

/* ---------------- the queue ---------------- */

test("queue join: the search state, the growing window, 'players searching', and a repeated join keeps `since`", async () => {
  const c = setup();
  const a = await user(c);
  const x = await user(c, { rating: 1000 }); // too far from A to pair for the first two minutes
  const j = await c.svc.queueJoin(a, { mode: "mixed" }, T0);
  assert.deepEqual(j, {
    status: "searching",
    since: T0,
    window: 100,
    until: T0 + QUEUE.searchMaxS * 1000,
    matchId: null,
    opponent: null,
    searching: 0,
    serverNow: T0,
  });
  assert.equal((await c.svc.queueJoin(x, { mode: "mixed" }, T0 + 1000)).searching, 1);
  // A repeated join only refreshes the sign of life; the search clock keeps running.
  const again = await c.svc.queueJoin(a, { mode: "mixed" }, T0 + 10_000);
  assert.deepEqual([again.status, again.since, again.window, again.searching, again.serverNow], ["searching", T0, 100, 1, T0 + 10_000]);
  // Poll: the window follows the search time; `until` stays. X polls too (so both stay in the queue) but is out of reach.
  const checkpoints: [number, number][] = [[10, 100], [20, 100], [29, 100], [30, 200], [40, 200], [50, 200], [59, 200], [60, 300], [70, 300], [80, 300], [89, 300], [90, 400], [100, 400], [110, 400], [119, 400]];
  for (const [sec, w] of checkpoints) {
    await c.svc.queuePoll(x, T0 + sec * 1000);
    const p = await c.svc.queuePoll(a, T0 + sec * 1000);
    assert.deepEqual([p.status, p.window, p.until, p.since, p.serverNow, p.searching], ["searching", w, T0 + 300_000, T0, T0 + sec * 1000, 1], `${sec} s`);
  }
  // From 2 minutes on there is no limit and the two meet.
  await c.svc.queuePoll(x, T0 + 120_000);
  const open = await c.svc.queuePoll(a, T0 + 120_000);
  assert.deepEqual([open.status, open.window, open.opponent!.rating], ["matched", null, 1000]);
});

test("queue: two players pair into one match, A = who joined first, both polls say matched with the opponent", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  await c.svc.queueJoin(a, { mode: "mixed" }, T0);
  const qb = await c.svc.queueJoin(b, { mode: "mixed" }, T0 + 5000);
  assert.equal(qb.status, "matched");
  assert.ok(qb.matchId);
  assert.deepEqual([qb.window, qb.until, qb.since === T0 + 5000], [null, null, true]);
  assert.equal(qb.opponent!.name, (await c.store.getPlayer(a))!.name);
  assert.equal(qb.opponent!.rating, START_RATING);
  assert.equal(qb.serverNow, T0 + 5000);
  const pa = await c.svc.queuePoll(a, T0 + 6000);
  assert.deepEqual([pa.status, pa.matchId, pa.window, pa.until], ["matched", qb.matchId, null, null]);
  assert.equal(pa.opponent!.name, (await c.store.getPlayer(b))!.name);
  const m = (await c.store.getMatch(qb.matchId!))!;
  assert.deepEqual([m.status, m.playerA, m.playerB], ["playing", a, b]);
  assert.equal(m.createdAt, T0 + 5000);
  // The hub shows the same.
  const h = await c.svc.hub(b, T0 + 7000);
  assert.deepEqual([h.queue.status, h.queue.matchId, h.active!.id, h.active!.role], ["matched", qb.matchId, qb.matchId, "b"]);
  assert.equal(h.active!.opponent!.name, (await c.store.getPlayer(a))!.name);
  // Joining again, or polling, doesn't make a second match.
  await rejects(c.svc.queueJoin(a, { mode: "mixed" }, T0 + 8000), 409, "in_match");
  assert.equal(Object.keys((JSON.parse(fs.readFileSync(c.file, "utf8")) as LocalDb).matches).length, 1);
});

test("queue cancel: idle when searching, matched when the pair is already made", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const x = await user(c, { rating: 1000 });
  await c.svc.queueJoin(a, { mode: "mixed" }, T0);
  const cancelled = await c.svc.queueCancel(a, T0 + 1000);
  assert.deepEqual(cancelled, { status: "idle", since: null, window: null, until: null, matchId: null, opponent: null, searching: 0, serverNow: T0 + 1000 });
  assert.equal((await c.svc.queuePoll(a, T0 + 2000)).status, "idle");
  // Cancelling when nothing is going on is harmless.
  assert.equal((await c.svc.queueCancel(x, T0)).status, "idle");
  // A cancelled player is out of the way: B doesn't pair with them ...
  assert.equal((await c.svc.queueJoin(b, { mode: "mixed" }, T0 + 3000)).status, "searching");
  // ... and once the pair exists, cancelling doesn't undo it.
  assert.equal((await c.svc.queueJoin(a, { mode: "mixed" }, T0 + 4000)).status, "matched");
  const late = await c.svc.queueCancel(b, T0 + 5000);
  assert.equal(late.status, "matched");
  assert.ok(late.matchId && late.opponent);
});

test("queue timeout: after 5 minutes of searching it says timeout once, then idle", async () => {
  const c = setup();
  const a = await user(c);
  await c.svc.queueJoin(a, { mode: "mixed" }, T0);
  for (let sec = 10; sec < QUEUE.searchMaxS; sec += 10) assert.equal((await c.svc.queuePoll(a, T0 + sec * 1000)).status, "searching", `${sec} s`);
  const t = await c.svc.queuePoll(a, T0 + QUEUE.searchMaxS * 1000);
  assert.deepEqual([t.status, t.window, t.until, t.matchId, t.opponent], ["timeout", null, null, null, null]);
  assert.equal((await c.svc.queuePoll(a, T0 + QUEUE.searchMaxS * 1000 + 2000)).status, "idle");
  // A silent player drops out of the queue (no poll for 15 s) and the next search starts from scratch.
  await c.svc.queueJoin(a, { mode: "mixed" }, T0 + H);
  const back = await c.svc.queuePoll(a, T0 + H + (QUEUE.dropAfterS + 1) * 1000);
  assert.equal(back.status, "idle");
});

test("queue join needs a public name (403 name), saves it, and keeps the stored one when none is sent", async () => {
  const c = setup();
  const id = randomUUID();
  await rejects(c.svc.queueJoin(id, { mode: "mixed" }, T0), 403, "name");
  const hub0 = await c.svc.hub(id, T0);
  assert.equal(hub0.me.needsName, true);
  assert.equal(hub0.me.rating, START_RATING);
  assert.equal(hub0.queue.status, "idle");
  const p = await c.svc.queueJoin(id, { mode: "mixed", name: "Vega", avatar: "star" }, T0);
  assert.equal(p.status, "searching");
  const rec = (await c.store.getPlayer(id))!;
  assert.deepEqual([rec.name, rec.avatar], ["Vega", "star"]);
  // New name from the profile replaces it; none sent keeps it.
  await c.svc.queueJoin(id, { mode: "mixed", name: "Vega2" }, T0);
  assert.equal((await c.store.getPlayer(id))!.name, "Vega2");
  await c.svc.queueJoin(id, { mode: "mixed" }, T0);
  assert.equal((await c.store.getPlayer(id))!.name, "Vega2");
  assert.equal((await c.svc.hub(id, T0)).me.needsName, false);
});

test("queue join: 409 in_match while a match is playing (even after the own part is done); a parallel double join is one search", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await rejects(c.svc.queueJoin(a, { mode: "mixed" }, S), 409, "in_match");
  const r = await playThrough(c, a, id, S);
  assert.equal((await c.store.getMatch(id))!.status, "playing");
  await rejects(c.svc.queueJoin(a, { mode: "mixed" }, r.end + 1000), 409, "in_match");
  await rejects(c.svc.queueJoin(b, { mode: "mixed" }, r.end + 1000), 409, "in_match");
  // Once the match is over, the way is free.
  await playThrough(c, b, id, r.end + 2000);
  assert.equal((await c.store.getMatch(id))!.status, "finished");
  const [j1, j2] = await Promise.all([c.svc.queueJoin(a, { mode: "mixed" }, T0 + H), c.svc.queueJoin(a, { mode: "mixed" }, T0 + H)]);
  assert.deepEqual([j1.status, j2.status, j1.since, j2.since], ["searching", "searching", T0 + H, T0 + H]);
});

test("the daily limit: the 31st match in 24 hours is 429 limit_daily", async () => {
  const c = setup();
  const d = await user(c);
  edit(c.file, (db) => {
    for (let i = 0; i < MAX_MATCHES_PER_DAY; i++) {
      const id = randomUUID();
      db.matches[id] = fakeMatch(id, d, T0 + 5 * H);
    }
  });
  await rejects(c.svc.queueJoin(d, { mode: "mixed" }, T0 + 6 * H), 429, "limit_daily");
  assert.equal((await c.svc.hub(d, T0 + 6 * H)).limits.dailyLeft, 0);
  // A day later the oldest ones fall out of the window.
  assert.equal((await c.svc.queueJoin(d, { mode: "mixed" }, T0 + 5 * H + DAY + 1)).status, "searching");
});

/* ---------------- forfeit ---------------- */

test("forfeit loses regardless of points: B ahead on points leaves and loses", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await playThrough(c, a, id, S, { right: false }); // A scores 0
  const r = await playThrough(c, b, id, S, { right: true, count: 3 });
  const earned = r.answers.at(-1)!.res.totalPoints;
  assert.ok(earned > 0);
  assert.equal((await c.store.getMatch(id))!.status, "playing");
  assert.deepEqual(await c.svc.leave(b, id, r.end + 60_000), { forfeit: true });
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.result, m.pointsB, m.pointsA], ["finished", "b", "a", earned, 0]);
  assert.ok(m.pointsB! > m.pointsA!);
  assert.deepEqual([m.deltaA, m.deltaB], [12, 0]);
  const rows = await c.store.getAnswers(id, b);
  assert.equal(rows.length, MATCH_SIZE);
  assert.deepEqual(rows.slice(3).map((x) => x.status), Array(7).fill("annulled"));
  const sb = await c.svc.state(b, id, r.end + 2 * H);
  assert.deepEqual([sb.outcome, sb.forfeit, sb.myPartDone], ["loss", "b", true]);
  assert.equal(sb.review!.length, MATCH_SIZE);
  // Leaving again is harmless; a finished part can't be left.
  assert.deepEqual(await c.svc.leave(b, id, r.end + 3 * H), { forfeit: true });
  await rejects(c.svc.leave(a, id, r.end + 3 * H), 409, "conflict");
});

test("A forfeits mid-match: B still plays its part and wins whatever the points; the loss is applied when B finishes", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const r = await playThrough(c, a, id, S, { count: 2 }); // A scores something ...
  await c.svc.leave(a, id, r.end + 1000);
  const m1 = (await c.store.getMatch(id))!;
  assert.deepEqual([m1.status, m1.forfeit, m1.pointsA, m1.pointsB], ["playing", "a", r.answers.at(-1)!.res.totalPoints, null]);
  assert.ok(m1.pointsA! > 0);
  assert.equal((await c.store.getAnswers(id, a)).length, MATCH_SIZE);
  // The forfeiter's own view: done, waiting for the opponent, no result yet and no review (B is playing the same set).
  const sa = await c.svc.state(a, id, r.end + 2000);
  assert.deepEqual([sa.myPartDone, sa.status, sa.forfeit, sa.review, sa.outcome], [true, "playing", "a", null, null]);
  assert.equal((await c.svc.hub(a, r.end + 2000)).active!.id, id);
  assert.deepEqual(await c.svc.next(a, id, r.end + 3000), { done: true, totalPoints: m1.pointsA });
  // B plays everything wrong (0 points against A's positive ones) and still wins.
  await playThrough(c, b, id, r.end + 3000, { right: false });
  const fin = (await c.store.getMatch(id))!;
  assert.deepEqual([fin.status, fin.result, fin.forfeit, fin.pointsB, fin.deltaA, fin.deltaB], ["finished", "b", "a", 0, 0, 12]);
  assert.ok(fin.pointsA! > fin.pointsB!);
});

test("A forfeits at once: B plays on with the worst play and still wins; B sees the forfeit only at the end", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await c.svc.next(a, id, S);
  await c.svc.leave(a, id, S + 1000);
  const m1 = (await c.store.getMatch(id))!;
  assert.deepEqual([m1.status, m1.forfeit, m1.pointsA], ["playing", "a", 0]);
  assert.equal((await c.store.getAnswers(id, a)).length, MATCH_SIZE);
  const r = await playThrough(c, b, id, S + 2000, { right: false, count: 4 });
  const mid = await c.svc.state(b, id, r.end);
  assert.deepEqual([mid.status, mid.forfeit, mid.opponentDone, mid.review], ["playing", null, true, null]);
  await playThrough(c, b, id, r.end, { right: false, count: MATCH_SIZE - 4 });
  const fin = (await c.store.getMatch(id))!;
  assert.deepEqual([fin.status, fin.result, fin.forfeit, fin.pointsB], ["finished", "b", "a", 0]);
  assert.equal((await c.store.getPlayer(a))!.rating, START_RATING);
  assert.equal((await c.store.getPlayer(b))!.rating, START_RATING + 12);
  assert.equal((await c.svc.state(b, id, r.end + H)).forfeit, "a");
});

test("leave before the first question works too (nothing issued yet)", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await c.svc.leave(a, id, S);
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.pointsA], ["playing", "a", 0]);
  assert.equal((await c.store.getAnswers(id, a)).length, MATCH_SIZE);
});

test("the first forfeit stands: A leaves, then B leaves too (or is abandoned) and B still wins", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await c.svc.next(a, id, S);
  await c.svc.leave(a, id, S + 1000);
  await c.svc.next(b, id, S + 2000);
  await c.svc.leave(b, id, S + 3000);
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.result], ["finished", "a", "b"]);
  assert.equal((await c.store.getPlayer(b))!.rating, START_RATING + 12);
  // The same when B just stops playing (abandoned) instead of leaving.
  const a2 = await user(c, { matches: 10 });
  const b2 = await user(c, { matches: 10 });
  const id2 = await pair(c, a2, b2, T0 + 5 * H);
  const base = T0 + 5 * H + 1000;
  await c.svc.leave(a2, id2, base);
  const r2 = await playThrough(c, b2, id2, base, { count: 1 });
  await c.svc.hub(a2, r2.end + 121_000); // B's part is abandoned now
  const m2 = (await c.store.getMatch(id2))!;
  assert.deepEqual([m2.status, m2.forfeit, m2.result], ["finished", "a", "b"]);
});

/* ---------------- start deadline ---------------- */

test("start deadline: nobody started -> void, ratings untouched; the deadline itself is still fine", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const { startBy } = (await c.store.getMatch(id))!;
  assert.ok(startBy !== null);
  assert.equal((await c.svc.state(a, id, startBy!)).status, "playing"); // exactly at the deadline
  const s1 = await c.svc.state(a, id, startBy! + 1);
  assert.deepEqual([s1.status, s1.outcome, s1.delta, s1.startBy, s1.forfeit, s1.review, s1.myPartDone], ["void", null, null, null, null, null, false]);
  assert.deepEqual([(await c.store.getPlayer(a))!.rating, (await c.store.getPlayer(a))!.matches, (await c.store.getPlayer(b))!.matches], [START_RATING, 10, 10]);
  assert.equal((await c.store.getAnswers(id, a)).length + (await c.store.getAnswers(id, b)).length, 0);
  assert.deepEqual([(await c.svc.state(b, id, startBy! + 2)).status], ["void"]);
  await rejects(c.svc.next(b, id, startBy! + 3), 409, "conflict");
  const h = await c.svc.hub(a, startBy! + 4);
  assert.deepEqual([h.active, h.recent[0].status, h.recent[0].id, h.queue.status], [null, "void", id, "idle"]);
  // Both are free to search again, and a void match doesn't count as having played each other.
  await c.svc.queueJoin(a, { mode: "mixed" }, startBy! + 5000);
  assert.equal((await c.svc.queueJoin(b, { mode: "mixed" }, startBy! + 6000)).status, "matched");
});

test("start deadline: only A started -> B loses (when A finishes, or at once if A is done)", async () => {
  const c = setup();
  const a = await user(c, { matches: 10, rating: 1000 });
  const b = await user(c, { matches: 10, rating: 1000 });
  const id = await pair(c, a, b);
  const { startBy } = (await c.store.getMatch(id))!;
  const r = await playThrough(c, a, id, S, { right: false }); // A plays everything wrong: B still loses
  assert.ok(r.end < startBy!);
  assert.equal((await c.store.getMatch(id))!.status, "playing");
  const sb = await c.svc.state(b, id, startBy! + 1);
  assert.deepEqual([sb.status, sb.outcome, sb.delta, sb.forfeit, sb.myPartDone, sb.ratingAfter], ["finished", "loss", -12, "b", true, 988]);
  assert.equal(sb.review!.length, MATCH_SIZE);
  assert.ok(sb.review!.every((x) => x.status === "annulled" && x.points === 0));
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.result, m.forfeit, m.deltaA, m.deltaB, m.pointsA, m.pointsB], ["a", "b", 12, -12, 0, 0]);
  assert.deepEqual([(await c.store.getPlayer(a))!.rating, (await c.store.getPlayer(b))!.rating], [1012, 988]);
});

test("start deadline: A is mid-part when B no-shows -> B's part is closed, the match goes on and A wins when done", async () => {
  const c = setup();
  const a = await user(c, { matches: 10, rating: 1000 });
  const b = await user(c, { matches: 10, rating: 1000 });
  const id = await pair(c, a, b);
  const { startBy } = (await c.store.getMatch(id))!;
  const r = await playThrough(c, a, id, S, { count: 3 });
  const sb = await c.svc.state(b, id, startBy! + 1);
  assert.deepEqual([sb.status, sb.myPartDone, sb.opponentDone, sb.startBy, sb.forfeit, sb.review], ["playing", true, false, null, "b", null]);
  assert.equal((await c.svc.state(a, id, startBy! + 1)).opponentDone, true);
  // A, 80 s after the last answer, is fine and finishes.
  assert.ok(startBy! + 2 - r.end < ABANDON_AFTER_S * 1000);
  await playThrough(c, a, id, startBy! + 2, { right: false, count: MATCH_SIZE - 3 });
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.result, m.forfeit], ["finished", "a", "b"]);
  assert.deepEqual([(await c.store.getPlayer(a))!.rating, (await c.store.getPlayer(b))!.rating], [1012, 988]);
});

test("start deadline: a first question opened after the deadline is too late (that part is forfeited)", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const { startBy } = (await c.store.getMatch(id))!;
  await c.svc.next(b, id, S);
  const done = await c.svc.next(a, id, startBy! + 1); // A is the one who didn't start
  assert.deepEqual(done, { done: true, totalPoints: 0 });
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.pointsA, m.aStartedAt], ["playing", "a", 0, null]);
});

/* ---------------- abandoned parts ---------------- */

test("an abandoned part is forfeited after 120 s without a sign of life, not at 119 s (seen from the opponent's side)", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await playThrough(c, b, id, S, { right: false });
  const ra = await playThrough(c, a, id, S, { count: 2, after: 1000 });
  assert.equal(ABANDON_AFTER_S, 120);
  assert.equal((await c.svc.state(b, id, ra.end + 119_000)).status, "playing");
  assert.equal((await c.svc.state(b, id, ra.end + 120_000)).status, "playing", "exactly 120 s is not over it");
  assert.equal((await c.store.getMatch(id))!.pointsA, null);
  const fin = await c.svc.state(b, id, ra.end + 121_000);
  assert.equal(fin.status, "finished");
  assert.deepEqual([fin.outcome, fin.forfeit, fin.opponentPoints], ["win", "a", ra.answers.at(-1)!.res.totalPoints]);
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.result, m.forfeit, m.deltaA, m.deltaB], ["b", "a", 0, 12]);
  const rows = await c.store.getAnswers(id, a);
  assert.equal(rows.length, MATCH_SIZE);
  assert.deepEqual(rows.slice(2).map((x) => x.status), Array(8).fill("annulled"));
  assert.equal(m.pointsA, rows.slice(0, 2).reduce((t, x) => t + x.points, 0));
  // A coming back finds the match lost; next just says done.
  assert.equal((await c.svc.state(a, id, ra.end + 200_000)).outcome, "loss");
  assert.equal((await c.svc.next(a, id, ra.end + 200_000)).done, true);
});

test("the abandon clock starts when the open question's time limit ends; the hub of the abandoning player resolves it too", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await playThrough(c, b, id, S);
  const n = await c.svc.next(a, id, S);
  assert.ok(!n.done);
  if (n.done) return;
  const limitEnd = S + n.limitS * 1000;
  assert.equal((await c.svc.state(b, id, limitEnd + 119_000)).status, "playing");
  const h = await c.svc.hub(a, limitEnd + 121_000);
  assert.equal(h.active, null);
  assert.deepEqual([h.recent[0].status, h.recent[0].outcome], ["finished", "loss"]);
});

test("a no-show or abandoned match doesn't block the queue: queueJoin resolves it first", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const { startBy } = (await c.store.getMatch(id))!;
  await rejects(c.svc.queueJoin(a, { mode: "mixed" }, startBy! - 1000), 409, "in_match");
  assert.equal((await c.svc.queueJoin(a, { mode: "mixed" }, startBy! + 1)).status, "searching"); // nobody started: void
  assert.equal((await c.store.getMatch(id))!.status, "void");

  // Abandoned: B played, A opened a question and vanished.
  const a2 = await user(c, { matches: 10 });
  const b2 = await user(c, { matches: 10 });
  const t = T0 + 3 * H;
  const id2 = await pair(c, a2, b2, t);
  await playThrough(c, b2, id2, t + 1000);
  const n = await c.svc.next(a2, id2, t + 1000);
  assert.ok(!n.done);
  if (n.done) return;
  await rejects(c.svc.queueJoin(a2, { mode: "mixed" }, t + 1000 + n.limitS * 1000 + 119_000), 409, "in_match");
  const j = await c.svc.queueJoin(a2, { mode: "mixed" }, t + 1000 + n.limitS * 1000 + 121_000);
  assert.equal(j.status, "searching");
  assert.deepEqual([(await c.store.getMatch(id2))!.status, (await c.store.getMatch(id2))!.forfeit], ["finished", "a"]);
});

test("poll doesn't resolve matches (only the hub, the match and next do)", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  const { startBy } = (await c.store.getMatch(id))!;
  const p = await c.svc.queuePoll(a, startBy! + 60_000);
  assert.deepEqual([p.status, p.matchId], ["matched", id]);
  assert.equal((await c.store.getMatch(id))!.status, "playing");
});

/* ---------------- who gives up first ---------------- */

test("leave racing the opponent's poll: the leaver still loses (the forfeit is recorded before any row is closed)", async () => {
  // Every close of a row is followed by a pause, so the opponent's state calls land between the last annul and the leaver's own settle.
  let slow = false;
  const c = setup((inner) => ({
    ...inner,
    closeAnswer: async (...args: Parameters<EloStore["closeAnswer"]>) => {
      const r = await inner.closeAnswer(...args);
      if (slow) await sleep(60);
      return r;
    },
  }));
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await playThrough(c, a, id, S, { right: false }); // A finishes with 0 points
  const r = await playThrough(c, b, id, S, { right: true, count: 3 }); // B is ahead
  slow = true;
  let over = false;
  const leaving = c.svc.leave(b, id, r.end + 1000).finally(() => (over = true));
  while (!over) {
    await c.svc.state(a, id, r.end + 1000);
    await sleep(15);
  }
  await leaving;
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.result, m.deltaA, m.deltaB], ["finished", "b", "a", 12, 0]);
  assert.ok(m.pointsB! > m.pointsA!);
  // A retried leave is not a 409.
  assert.deepEqual(await c.svc.leave(b, id, r.end + 5000), { forfeit: true });
});

test("both parts abandoned: the one who went silent first loses, whatever the side", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await playThrough(c, b, id, S, { count: 1 }); // B's last sign of life: S + 2 s
  await playThrough(c, a, id, S + 58_000, { count: 1 }); // A's: S + 60 s
  const h = await c.svc.hub(a, S + 600_000);
  assert.equal(h.active, null);
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.result], ["finished", "b", "a"]);
  // And the other way round.
  const a2 = await user(c, { matches: 10 });
  const b2 = await user(c, { matches: 10 });
  const id2 = await pair(c, a2, b2, T0 + 5 * H);
  const t = T0 + 5 * H + 1000;
  await playThrough(c, a2, id2, t, { count: 1 });
  await playThrough(c, b2, id2, t + 58_000, { count: 1 });
  await c.svc.state(b2, id2, t + 600_000);
  const m2 = (await c.store.getMatch(id2))!;
  assert.deepEqual([m2.status, m2.forfeit, m2.result], ["finished", "a", "b"]);
});

test("a no-show gives up at the start deadline, before any abandon (last sign + 120 s is always later): the no-show loses", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await playThrough(c, a, id, S, { count: 1 }); // A started and then went silent; B never started
  await c.svc.hub(a, S + 3600_000);
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.result], ["finished", "b", "a"]);
  // The same with the roles swapped.
  const a2 = await user(c, { matches: 10 });
  const b2 = await user(c, { matches: 10 });
  const id2 = await pair(c, a2, b2, T0 + 5 * H);
  await playThrough(c, b2, id2, T0 + 5 * H + 1000, { count: 1 });
  await c.svc.hub(b2, T0 + 5 * H + 3600_000);
  const m2 = (await c.store.getMatch(id2))!;
  assert.deepEqual([m2.status, m2.forfeit, m2.result], ["finished", "a", "b"]);
});

test("leave first settles an opponent who has been silent for over 120 s: they are the first forfeit, the leaver's own forfeit comes second", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  await playThrough(c, b, id, S, { count: 2 }); // B's last sign of life: about S + 4 s
  const ra = await playThrough(c, a, id, S + 80_000, { count: 2 });
  assert.ok(S + 130_000 - ra.end < ABANDON_AFTER_S * 1000); // A itself is still fine
  assert.deepEqual(await c.svc.leave(a, id, S + 130_000), { forfeit: true });
  const m = (await c.store.getMatch(id))!;
  assert.deepEqual([m.status, m.forfeit, m.result, m.deltaA, m.deltaB], ["finished", "b", "a", 12, 0]);
});

test("a match whose points are both stored but whose finish failed is finished by the hub, by queueJoin, and by next", async () => {
  let fail = false;
  const c = setup((inner) => ({
    ...inner,
    finishMatch: async (...args: Parameters<EloStore["finishMatch"]>) => {
      if (fail) {
        fail = false;
        throw new Error("boom");
      }
      return inner.finishMatch(...args);
    },
  }));
  // Plays a match where B's last answer is the one whose finish fails.
  const stuck = async (t: number) => {
    const a = await user(c, { matches: 10 });
    const b = await user(c, { matches: 10 });
    const id = await pair(c, a, b, t);
    await playThrough(c, a, id, t + 1000);
    const r = await playThrough(c, b, id, t + 1000, { count: MATCH_SIZE - 1 });
    const n = await c.svc.next(b, id, r.end);
    assert.ok(!n.done);
    if (n.done) throw new Error("unexpected");
    fail = true;
    await assert.rejects(c.svc.answer(b, id, n.idx, rightAnswer(questionOf(n)), r.end + 3000), /boom/);
    const m = (await c.store.getMatch(id))!;
    assert.deepEqual([m.status, m.pointsA !== null, m.pointsB !== null], ["playing", true, true]);
    return { a, b, id, at: r.end + 5000 };
  };
  const s1 = await stuck(T0);
  const h = await c.svc.hub(s1.a, s1.at);
  assert.deepEqual([h.active, h.recent[0].status], [null, "finished"]);
  assert.equal((await c.store.getMatch(s1.id))!.status, "finished");
  assert.equal((await c.store.getPlayer(s1.a))!.matches, 11);

  const s2 = await stuck(T0 + 5 * H);
  assert.equal((await c.svc.queueJoin(s2.b, { mode: "mixed" }, s2.at)).status, "searching");
  assert.equal((await c.store.getMatch(s2.id))!.status, "finished");

  const s3 = await stuck(T0 + 10 * H);
  assert.deepEqual(await c.svc.next(s3.a, s3.id, s3.at), { done: true, totalPoints: (await c.store.getMatch(s3.id))!.pointsA });
  assert.equal((await c.store.getMatch(s3.id))!.status, "finished");
});

/* ---------------- no leaks ---------------- */

test("no answer / explanation / question id in any response before the match is over", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const seen: [string, unknown][] = [];
  const keep = <T>(label: string, v: T): T => (seen.push([label, v]), v);

  keep("join a", await c.svc.queueJoin(a, { mode: "mixed" }, T0));
  keep("poll a", await c.svc.queuePoll(a, T0 + 1000));
  const qb = keep("join b", await c.svc.queueJoin(b, { mode: "mixed" }, T0 + 2000));
  const id = qb.matchId!;
  keep("poll a matched", await c.svc.queuePoll(a, T0 + 3000));
  keep("hub", await c.svc.hub(a, T0 + 3000));
  keep("state a 0", await c.svc.state(a, id, T0 + 3000));
  keep("state b 0", await c.svc.state(b, id, T0 + 3000));
  let now = S;
  for (let i = 0; i < MATCH_SIZE; i++) {
    const n = keep(`next a ${i}`, await c.svc.next(a, id, now));
    assert.ok(!n.done);
    if (n.done) break;
    assert.ok(!("id" in n.question));
    if (i === 2) keep("annul", await c.svc.annul(a, id, i, now + 2000));
    else if (i === 4) keep("late", await c.svc.answer(a, id, i, "B", now + 200_000));
    else keep(`answer a ${i}`, await c.svc.answer(a, id, i, rightAnswer(questionOf(n)), now + 4000));
    keep(`state a ${i + 1}`, await c.svc.state(a, id, now + 4500));
    if (i < MATCH_SIZE - 1) {
      const nb = keep(`next b ${i}`, await c.svc.next(b, id, now));
      assert.ok(!nb.done);
      if (!nb.done) keep(`answer b ${i}`, await c.svc.answer(b, id, i, rightAnswer(questionOf(nb)), now + 5000));
      keep(`state b ${i + 1}`, await c.svc.state(b, id, now + 5500));
    }
    now += 10_000;
  }
  // A is done (all 10 closed), B has 9 answered: look at everything again.
  keep("state a done", await c.svc.state(a, id, now));
  keep("state b final", await c.svc.state(b, id, now));
  keep("hub a", await c.svc.hub(a, now));
  keep("hub b", await c.svc.hub(b, now));
  keep("next a done", await c.svc.next(a, id, now));
  keep("cancel a", await c.svc.queueCancel(a, now)); // matched: the pair is already made
  keep("leave b", await c.svc.leave(b, id, now)); // B gives up: the match is over, so nothing is looked at after this
  for (const [label, v] of seen) {
    assertNoLeak(v, label);
    if (label.startsWith("state")) assert.equal((v as MatchState).review, null, label);
  }
  const sa = seen.find(([l]) => l === "state a done")![1] as MatchState;
  assert.deepEqual([sa.status, sa.myPartDone, sa.opponentDone, sa.opponentPoints, sa.outcome, sa.delta, sa.forfeit], ["playing", true, false, null, null, null, null]);
  const sb = seen.find(([l]) => l === "state b final")![1] as MatchState;
  assert.deepEqual([sb.myPartDone, sb.opponentDone, sb.opponentPoints], [false, true, null]);
});

/* ---------------- hub ---------------- */

test("hub: me, queue, active, recent and limits through a whole match", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const h0 = await c.svc.hub(a, T0);
  assert.deepEqual([h0.active, h0.recent.length, h0.queue.status, h0.limits.dailyLeft], [null, 0, "idle", MAX_MATCHES_PER_DAY]);
  assert.equal(h0.me.rating, START_RATING);
  assert.equal(h0.me.level.level, 1);
  assert.equal("waiting" in h0, false);

  await c.svc.queueJoin(a, { mode: "mixed" }, T0 + 1000);
  const h1 = await c.svc.hub(a, T0 + 2000);
  assert.deepEqual([h1.queue.status, h1.queue.since, h1.queue.window, h1.queue.serverNow, h1.active], ["searching", T0 + 1000, 100, T0 + 2000, null]);

  assert.equal((await c.svc.queueJoin(b, { mode: "mixed" }, T0 + 3000)).status, "matched"); // A has been searching since T0+1000
  const m = (await c.store.listMatches(a)).active!;
  const h2 = await c.svc.hub(a, T0 + 4000);
  assert.deepEqual([h2.active!.id, h2.active!.status, h2.active!.role, h2.active!.answered, h2.active!.total], [m.id, "playing", "a", 0, MATCH_SIZE]);
  assert.deepEqual([h2.active!.myPartDone, h2.active!.opponentDone, h2.active!.startBy, h2.queue.status, h2.queue.matchId], [false, false, m.startBy, "matched", m.id]);
  assert.equal(h2.active!.opponent!.name, (await c.store.getPlayer(b))!.name);
  assert.equal(h2.limits.dailyLeft, MAX_MATCHES_PER_DAY - 1);
  assert.equal(h2.recent.length, 0);
});

test("hub: the player's own part done = still active; both done = recent; the queue is idle again", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const id = await pair(c, a, b);
  const ra = await playThrough(c, a, id, S);
  const h1 = await c.svc.hub(a, ra.end);
  assert.deepEqual([h1.active!.id, h1.active!.answered, h1.active!.myPartDone, h1.active!.opponentDone, h1.active!.myPoints, h1.recent.length], [id, MATCH_SIZE, true, false, ra.answers.at(-1)!.res.totalPoints, 0]);
  assert.equal(h1.active!.startBy, null);
  const rb = await playThrough(c, b, id, S, { right: false });
  const h2 = await c.svc.hub(a, rb.end + 1000);
  assert.equal(h2.active, null);
  assert.equal(h2.queue.status, "idle");
  assert.equal(h2.recent.length, 1);
  assert.deepEqual([h2.recent[0].status, h2.recent[0].outcome, h2.recent[0].delta, h2.recent[0].opponentPoints, h2.recent[0].myPartDone, h2.recent[0].opponentDone], ["finished", "win", 12, 0, true, true]);
  assert.equal(h2.recent[0].opponent!.name, (await c.store.getPlayer(b))!.name);
  assert.equal(h2.me.rating, START_RATING + 12);
  assert.deepEqual([h2.me.matches, h2.me.wins], [11, 1]);
  const hb = await c.svc.hub(b, rb.end + 1000);
  assert.deepEqual([hb.recent[0].outcome, hb.recent[0].delta, hb.recent[0].role], ["loss", 0, "b"]);
});

test("hub is a sign of life in the queue and pairs the player when the window opens", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const x = await user(c, { matches: 10, rating: 1000 });
  await c.svc.queueJoin(a, { mode: "mixed" }, T0);
  await c.svc.queueJoin(x, { mode: "mixed" }, T0);
  for (let sec = 10; sec < 120; sec += 10) {
    await c.svc.queuePoll(x, T0 + sec * 1000);
    assert.equal((await c.svc.hub(a, T0 + sec * 1000)).queue.status, "searching", `${sec} s`);
  }
  await c.svc.queuePoll(x, T0 + 115_000);
  const h = await c.svc.hub(a, T0 + 120_000);
  assert.deepEqual([h.queue.status, h.queue.window, h.active!.status, h.active!.opponent!.rating], ["matched", null, "playing", 1000]);
});

/* ---------------- races ---------------- */

test("parallel next calls never open two questions or skip one", async () => {
  // The first close of a question is slowed down by 50 ms, so the two requests interleave.
  let slow = false;
  const c = setup((inner) => ({
    ...inner,
    closeAnswer: async (...args: Parameters<EloStore["closeAnswer"]>) => {
      if (slow) {
        slow = false;
        await sleep(50);
      }
      return inner.closeAnswer(...args);
    },
  }));
  const a = await user(c);
  const b = await user(c);
  const id = await pair(c, a, b);
  await c.svc.next(b, id, S); // B has started too, so the start deadline doesn't interfere

  // Nothing open yet: three parallel calls hand out the same first question.
  const first = await Promise.all([0, 1, 2].map(() => c.svc.next(a, id, S)));
  assert.ok(first.every((n) => !n.done && n.idx === 0 && n.issuedAt === S));
  assert.equal((await c.store.getAnswers(id, a)).length, 1);
  assert.equal((await c.store.getMatch(id))!.aStartedAt, S);

  // The question ran out: two parallel calls both close it (one slowly) and both land on question 1.
  const late = S + 100_000;
  slow = true;
  const both = await Promise.all([c.svc.next(a, id, late), c.svc.next(a, id, late)]);
  for (const n of both) assert.ok(!n.done && n.idx === 1 && n.issuedAt === late);
  const rows = await c.store.getAnswers(id, a);
  assert.deepEqual(rows.map((r) => [r.idx, r.status]), [[0, "timeout"], [1, "open"]]);
  // And the match continues normally from question 1.
  const n2 = await c.svc.next(a, id, late + 1000);
  assert.ok(!n2.done && n2.idx === 1);
});

/* ---------------- images ---------------- */

test("question images are match-scoped URLs: no bank path in any pre-completion response, real paths only in the review", async () => {
  const c = setup(undefined, imageBank);
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const x = await user(c);
  const seen: unknown[] = [];
  seen.push(await c.svc.queueJoin(a, { mode: "mixed" }, T0));
  const qb = await c.svc.queueJoin(b, { mode: "mixed" }, T0 + 1);
  seen.push(qb);
  const id = qb.matchId!;
  let now = S;
  let mcqSeen = 0;
  for (let i = 0; i < MATCH_SIZE; i++) {
    const n = await c.svc.next(a, id, now);
    assert.ok(!n.done);
    if (n.done) break;
    seen.push(n, await c.svc.state(a, id, now), await c.svc.hub(a, now));
    const url = (k: string) => `/api/ranked/${id}/img?idx=${i}&k=${k}`;
    assert.equal(n.question.figure!.src, url("figure"));
    if (n.question.type === "mcq") {
      mcqSeen++;
      assert.equal(n.question.choicesImage, url("choices"));
      assert.deepEqual(n.question.choiceImages, { A: url("A"), B: url("B"), C: url("C"), D: url("D") });
    }
    // The route resolves its own player's issued question to the real file ...
    assert.equal(await c.svc.image(a, id, i, "figure"), `bank/img/${n.section}/${n.section}-${n.difficulty}-${questionOf(n).id.split("_")[3]}.webp`);
    // ... but not a question that wasn't issued yet, another player, or garbage.
    await rejects(c.svc.image(a, id, i + 1, "figure"), i + 1 < MATCH_SIZE ? 404 : 400);
    await rejects(c.svc.image(x, id, i, "figure"), 404, "not_found");
    await rejects(c.svc.image(a, id, i, "Z"), 400, "bad_request");
    await rejects(c.svc.image(a, id, -1, "figure"), 400, "bad_request");
    if (n.question.type === "spr") await rejects(c.svc.image(a, id, i, "choices"), 404, "not_found");
    now = n.issuedAt + 4000;
    seen.push(await c.svc.answer(a, id, i, rightAnswer(questionOf(n)), now));
    now += 1000;
  }
  assert.ok(mcqSeen > 0);
  for (const v of seen) assertNoLeak(v, "images");
  // A is done, B is still playing: no review. After B leaves the match is over and the review may carry the real bank paths.
  assert.equal((await c.svc.state(a, id, now)).review, null);
  await c.svc.leave(b, id, now + 1000);
  const st = await c.svc.state(a, id, now + 2000);
  assert.ok(st.review!.every((r) => r.question.figure!.src.startsWith("/bank/img/")));
});

test("publicImagePath only allows plain /bank/ and /tests/ paths", () => {
  assert.equal(publicImagePath("/bank/img/rw/eng_0006.webp"), "bank/img/rw/eng_0006.webp");
  assert.equal(publicImagePath("/tests/img/2024-08-int-a/m2-08-1.webp"), "tests/img/2024-08-int-a/m2-08-1.webp");
  for (const bad of ["/bank/../.env.local", "/bank/img/../../x.webp", "/etc/passwd", "bank/img/a.webp", "/bank//a.webp", "/bank/a b.webp", "/bank/a\\b", "/bank/a?x=1", "https://x.test/bank/a.webp", ""]) {
    assert.equal(publicImagePath(bad), null, bad);
  }
});
