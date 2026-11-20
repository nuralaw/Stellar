// Run: npm run elo:server-test  (node:test on the LOCAL file store and a small fake question bank; --conditions=react-server lets
// "server-only" load under plain Node). Covers docs/ELO.md 9.5-9.6 for the server logic (src/lib/elo-server.ts).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { applyElo, difficultyMix, questionPoints } from "./elo.ts";
import { MATCH_SIZE, MAX_WAITING_MATCHES, MIXED_LAYOUT, NETWORK_GRACE_MS } from "./elo-config.ts";
import { buildQuestionSet, createRankedService, publicImagePath, RankedError, splitMix, STALE_PART_MS, type QuestionBank } from "./elo-server.ts";
import { createLocalStore, EloActiveMatchError, type EloStore, type LocalDb } from "./elo-store.ts";
import type { MatchState, NextResponse } from "./elo-api-types.ts";
import type { Difficulty, Question } from "./types";
import type { SectionId } from "./taxonomy";

const H = 3_600_000;
const T0 = Date.UTC(2026, 10, 20, 12, 0, 0);
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

const play = (c: Ctx, userId: string, now = T0) => c.svc.play(userId, { mode: "mixed" }, now);

async function rejects(p: Promise<unknown>, status: number, code?: string) {
  await assert.rejects(p, (e: unknown) => e instanceof RankedError && e.status === status && (code === undefined || e.code === code), `expected ${status} ${code ?? ""}`);
}

/** No answer / explanation / question id anywhere in a pre-completion response. */
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

test("two players: playing_a -> waiting -> playing_b -> finished, ELO as case E1 (+12 / -12)", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });

  const pa = await play(c, a, T0);
  assert.equal(pa.role, "a");
  assert.equal(pa.opponent, null);
  assert.equal(pa.resumed, false);
  assert.equal((await c.store.getMatch(pa.matchId))!.status, "playing_a");

  const ra = await playThrough(c, a, pa.matchId, T0, { right: true, after: 1000 });
  assert.ok(ra.answers.every((x) => x.res.points > 0));
  assert.equal(ra.answers.at(-1)!.res.done, true);
  const wait = (await c.store.getMatch(pa.matchId))!;
  assert.equal(wait.status, "waiting");
  assert.equal(wait.pointsA, ra.answers.at(-1)!.res.totalPoints);
  assert.ok(wait.aFinishedAt !== null && wait.expiresAt !== null);

  // B joins the same set.
  const pb = await play(c, b, T0 + H);
  assert.equal(pb.role, "b");
  assert.equal(pb.matchId, pa.matchId);
  assert.equal(pb.resumed, false);
  assert.ok(pb.opponent && pb.opponent.rating === 1000);
  assert.equal((await c.store.getMatch(pa.matchId))!.status, "playing_b");
  const rb = await playThrough(c, b, pa.matchId, T0 + H, { right: false });
  assert.ok(rb.answers.every((x) => x.res.points === 0));
  assert.equal(rb.answers.at(-1)!.res.done, true);

  const fin = (await c.store.getMatch(pa.matchId))!;
  assert.equal(fin.status, "finished");
  assert.equal(fin.result, "a");
  const exp = applyElo({ a: { rating: 1000, matches: 10 }, b: { rating: 1000, matches: 10 }, result: "a" });
  assert.deepEqual([exp.deltaA, exp.deltaB], [12, -12]);
  assert.deepEqual([fin.deltaA, fin.deltaB], [12, -12]);
  assert.equal((await c.store.getPlayer(a))!.rating, 1012);
  assert.equal((await c.store.getPlayer(b))!.rating, 988);

  // Both get the same questions in the same order.
  const qa = ra.answers.map((x) => x.next.question.prompt);
  const qb = rb.answers.map((x) => x.next.question.prompt);
  assert.deepEqual(qa, qb);

  const sa = await c.svc.state(a, pa.matchId, T0 + 2 * H);
  assert.equal(sa.status, "finished");
  assert.equal(sa.outcome, "win");
  assert.equal(sa.delta, 12);
  assert.equal(sa.ratingBefore, 1000);
  assert.equal(sa.ratingAfter, 1012);
  assert.equal(sa.opponentPoints, 0);
  assert.equal(sa.myPoints, wait.pointsA);
  const sb = await c.svc.state(b, pa.matchId, T0 + 2 * H);
  assert.equal(sb.outcome, "loss");
  assert.equal(sb.delta, -12);
  assert.equal(sb.ratingAfter, 988);
  assert.equal(sb.opponentPoints, wait.pointsA);
  // The review is there once the own part is done, with answers and explanations.
  assert.equal(sa.review!.length, MATCH_SIZE);
  assert.ok(sa.review!.every((r) => typeof r.explanation === "string" && r.answer !== undefined && r.correct && r.status === "answered"));
  assert.ok(sb.review!.every((r) => !r.correct));
  // The review has no question id either (only the slot number).
  assert.ok(sa.review!.every((r) => !("id" in r) && !("qid" in r) && !("id" in r.question)));

  // Double finish does not apply ELO twice.
  await c.store.finishMatch(pa.matchId);
  assert.equal((await c.store.getPlayer(a))!.rating, 1012);
});

test("scoring is the server's: Q1 of the spec (RW easy, 10 s) = 140 points; the grace is subtracted", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const p = await play(c, a);
  const n = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n.done);
  if (n.done) return;
  assert.equal(n.section, "rw");
  assert.equal(n.difficulty, "easy");
  assert.equal(n.limitS, 60);
  assert.equal(n.idx, 0);
  assert.equal(n.issuedAt, T0);
  assert.equal(n.serverNow, T0);
  // 12 s after issue = 10 s of thinking + 2 s of network grace.
  const res = await c.svc.answer(a, p.matchId, 0, rightAnswer(questionOf(n)), T0 + 12_000);
  assert.deepEqual([res.base, res.bonus, res.points, res.elapsedMs, res.correct, res.timedOut], [100, 40, 140, 10_000, true, false]);
  assert.equal(res.totalPoints, 140);
  assert.equal(res.done, false);
});

test("the client's clock is irrelevant: the same schedule an hour apart gives the same points", async () => {
  const c = setup();
  const x = await user(c, { matches: 10 });
  const y = await user(c, { matches: 10 });
  const px = await play(c, x, T0);
  const rx = await playThrough(c, x, px.matchId, T0, { after: 5000 });
  // y plays a separate match one hour (and later) on the server's clock; the offsets inside each question are equal.
  const py = await c.svc.play(y, { mode: "mixed" }, T0 + 5 * H);
  assert.equal(py.role, "b"); // joins x's match (same questions)
  const ry = await playThrough(c, y, py.matchId, T0 + 5 * H, { after: 5000 });
  assert.deepEqual(
    rx.answers.map((r) => r.res.points),
    ry.answers.map((r) => r.res.points),
  );
});

/* ---------------- timing and answers ---------------- */

test("a second answer to a question is 409; so is an answer to a question never issued", async () => {
  const c = setup();
  const a = await user(c);
  const p = await play(c, a);
  const n = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n.done);
  if (n.done) return;
  await c.svc.answer(a, p.matchId, 0, rightAnswer(questionOf(n)), T0 + 3000);
  await rejects(c.svc.answer(a, p.matchId, 0, rightAnswer(questionOf(n)), T0 + 4000), 409, "conflict");
  await rejects(c.svc.answer(a, p.matchId, 1, "B", T0 + 4000), 409, "conflict"); // idx 1 not issued yet
  await rejects(c.svc.answer(a, p.matchId, 7, "B", T0 + 4000), 409, "conflict");
  assert.equal((await c.store.getAnswers(p.matchId, a))[0].points > 0, true); // the first answer still stands
});

test("an answer after the limit is 0 points and a timeout", async () => {
  const c = setup();
  const a = await user(c);
  const p = await play(c, a);
  const n = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n.done);
  if (n.done) return;
  const late = T0 + n.limitS * 1000 + NETWORK_GRACE_MS + 1; // 1 ms over the limit after the grace
  const res = await c.svc.answer(a, p.matchId, 0, rightAnswer(questionOf(n)), late);
  assert.deepEqual([res.points, res.base, res.bonus, res.timedOut, res.correct], [0, 0, 0, true, false]);
  assert.equal((await c.store.getAnswers(p.matchId, a))[0].status, "timeout");
  // Exactly at the limit still counts (4.3: t > L is the timeout), with the minimum speed bonus of 0.
  const n2 = await c.svc.next(a, p.matchId, late);
  assert.ok(!n2.done);
  if (n2.done) return;
  const ok = await c.svc.answer(a, p.matchId, 1, rightAnswer(questionOf(n2)), n2.issuedAt + n2.limitS * 1000 + NETWORK_GRACE_MS);
  const exp = questionPoints({ section: n2.section, difficulty: n2.difficulty, correct: true, elapsedMs: n2.limitS * 1000 });
  assert.equal(ok.points, exp.points);
  assert.equal(ok.bonus, 0);
});

test("next is idempotent while a question is open: same idx and issuedAt, current serverNow; no way to skip it", async () => {
  const c = setup();
  const a = await user(c);
  const p = await play(c, a);
  const n0 = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n0.done);
  if (n0.done) return;
  // Double clicks, reloads, double effects: the same question comes back, the countdown keeps the original issuedAt.
  for (const dt of [0, 1, 5000, 20_000]) {
    const again = await c.svc.next(a, p.matchId, T0 + dt);
    assert.ok(!again.done);
    if (again.done) return;
    assert.deepEqual([again.idx, again.issuedAt, again.serverNow, again.question.prompt], [0, T0, T0 + dt, n0.question.prompt]);
    assert.equal(again.limitS, n0.limitS);
  }
  assert.deepEqual((await c.store.getAnswers(p.matchId, a)).map((r) => [r.idx, r.status]), [[0, "open"]]);
  // Still open at limit + grace exactly (the same boundary as `answer`): nothing is skipped.
  const edge = await c.svc.next(a, p.matchId, T0 + n0.limitS * 1000 + NETWORK_GRACE_MS);
  assert.ok(!edge.done && edge.idx === 0);
  // The open question can still be answered after the repeats.
  const res = await c.svc.answer(a, p.matchId, 0, rightAnswer(questionOf(n0)), T0 + 12_000);
  assert.equal(res.correct, true);
  // After it is answered, next moves on.
  const n1 = await c.svc.next(a, p.matchId, T0 + 13_000);
  assert.ok(!n1.done && n1.idx === 1 && n1.issuedAt === T0 + 13_000);
});

test("next after the limit closes the open question as a timeout and moves on", async () => {
  const c = setup();
  const a = await user(c);
  const p = await play(c, a);
  const n0 = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n0.done);
  if (n0.done) return;
  const late = T0 + n0.limitS * 1000 + NETWORK_GRACE_MS + 1;
  const n1 = await c.svc.next(a, p.matchId, late);
  assert.ok(!n1.done && n1.idx === 1 && n1.issuedAt === late);
  const rows = await c.store.getAnswers(p.matchId, a);
  assert.deepEqual(rows.map((r) => [r.idx, r.status, r.points]), [[0, "timeout", 0], [1, "open", 0]]);
  // The closed question can't be answered any more.
  await rejects(c.svc.answer(a, p.matchId, 0, "B", late + 1000), 409, "conflict");
  // A whole match of waiting it out: every question is a timeout, the part still completes.
  let now = late;
  for (let i = 2; i <= MATCH_SIZE; i++) {
    now += 200_000; // longer than any limit + grace
    const r = await c.svc.next(a, p.matchId, now);
    if (i < MATCH_SIZE) assert.ok(!r.done && r.idx === i);
    else assert.deepEqual(r, { done: true, totalPoints: 0 });
  }
  assert.equal((await c.store.getMatch(p.matchId))!.status, "waiting");
  assert.equal((await c.store.getMatch(p.matchId))!.pointsA, 0);
  // next on a finished part is harmless.
  assert.deepEqual(await c.svc.next(a, p.matchId, now + 99_000), { done: true, totalPoints: 0 });
});

test("annul gives 0 points, can be repeated, and doesn't touch an answered question", async () => {
  const c = setup();
  const a = await user(c);
  const p = await play(c, a);
  const n = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n.done);
  const res = await c.svc.annul(a, p.matchId, 0, T0 + 4000);
  assert.deepEqual([res.points, res.base, res.bonus, res.correct, res.totalPoints, res.done], [0, 0, 0, false, 0, false]);
  assert.equal((await c.store.getAnswers(p.matchId, a))[0].status, "annulled");
  // Repeated: the same result. The question can't be answered after that.
  assert.equal((await c.svc.annul(a, p.matchId, 0, T0 + 5000)).points, 0);
  await rejects(c.svc.answer(a, p.matchId, 0, "B", T0 + 5000), 409);
  // An answered question can't be annulled.
  const n1 = await c.svc.next(a, p.matchId, T0 + 6000);
  assert.ok(!n1.done);
  if (n1.done) return;
  await c.svc.answer(a, p.matchId, 1, rightAnswer(questionOf(n1)), T0 + 9000);
  await rejects(c.svc.annul(a, p.matchId, 1, T0 + 9500), 409);
  await rejects(c.svc.annul(a, p.matchId, 5, T0 + 9500), 409); // never issued
  await rejects(c.svc.annul(a, p.matchId, 99, T0 + 9500), 400, "bad_request");
});

test("bad bodies are 400", async () => {
  const c = setup();
  const a = await user(c);
  const p = await play(c, a);
  await c.svc.next(a, p.matchId, T0);
  await rejects(c.svc.answer(a, p.matchId, "0", "B", T0), 400, "bad_request");
  await rejects(c.svc.answer(a, p.matchId, 1.5, "B", T0), 400, "bad_request");
  await rejects(c.svc.answer(a, p.matchId, -1, "B", T0), 400, "bad_request");
  await rejects(c.svc.answer(a, p.matchId, 0, 5, T0), 400, "bad_request");
  await rejects(c.svc.answer(a, p.matchId, 0, "x".repeat(13), T0), 400, "bad_request");
  await rejects(c.svc.play(a, { mode: "rw" }, T0), 400, "bad_request");
  // A wrong answer text is just wrong, a blank one too.
  const res = await c.svc.answer(a, p.matchId, 0, "", T0 + 3000);
  assert.deepEqual([res.correct, res.points, res.timedOut], [false, 0, false]);
});

/* ---------------- who may do what ---------------- */

test("a stranger gets 404 on every route of someone else's match; unknown ids too", async () => {
  const c = setup();
  const a = await user(c);
  const x = await user(c);
  const p = await play(c, a);
  await c.svc.next(a, p.matchId, T0);
  await rejects(c.svc.state(x, p.matchId, T0), 404, "not_found");
  await rejects(c.svc.next(x, p.matchId, T0), 404, "not_found");
  await rejects(c.svc.answer(x, p.matchId, 0, "B", T0), 404, "not_found");
  await rejects(c.svc.annul(x, p.matchId, 0, T0), 404, "not_found");
  await rejects(c.svc.leave(x, p.matchId, T0), 404, "not_found");
  await rejects(c.svc.state(a, randomUUID(), T0), 404, "not_found");
  await rejects(c.svc.state(a, "not-an-id", T0), 404, "not_found");
  // A stranger's attempts changed nothing.
  assert.equal((await c.store.getAnswers(p.matchId, a)).length, 1);
  assert.equal((await c.store.getMatch(p.matchId))!.status, "playing_a");
});

test("a player can't become their own opponent", async () => {
  const c = setup();
  const a = await user(c);
  const p1 = await play(c, a);
  await playThrough(c, a, p1.matchId, T0);
  assert.equal((await c.store.getMatch(p1.matchId))!.status, "waiting");
  const p2 = await play(c, a, T0 + H);
  assert.equal(p2.role, "a");
  assert.notEqual(p2.matchId, p1.matchId);
  assert.equal((await c.store.getMatch(p1.matchId))!.playerB, null);
});

test("play resumes the match in progress (as A and as B) instead of creating another", async () => {
  const c = setup();
  const a = await user(c);
  const b = await user(c);
  const p = await play(c, a);
  await playThrough(c, a, p.matchId, T0, { count: 3 });
  const again = await play(c, a, T0 + 60_000);
  assert.deepEqual([again.matchId, again.role, again.resumed, again.opponent], [p.matchId, "a", true, null]);
  assert.equal((await c.store.listMatches(a)).active!.id, p.matchId);
  // The rest of the part: the next question continues where it stopped.
  const n = await c.svc.next(a, p.matchId, T0 + 70_000);
  assert.ok(!n.done && n.idx === 3);

  // Question 3 is open: asking again returns it. Finish A by letting every remaining question run out.
  const same = await c.svc.next(a, p.matchId, T0 + 71_000);
  assert.ok(!same.done && same.idx === 3 && same.issuedAt === T0 + 70_000);
  for (let t = T0 + 300_000; ; t += 300_000) {
    if ((await c.svc.next(a, p.matchId, t)).done) break;
  }
  const pb = await play(c, b, T0 + H);
  assert.equal(pb.role, "b");
  await playThrough(c, b, p.matchId, T0 + H, { count: 2 });
  const resumedB = await play(c, b, T0 + H + 10 * 60_000);
  assert.deepEqual([resumedB.matchId, resumedB.role, resumedB.resumed], [p.matchId, "b", true]);
  assert.ok(resumedB.opponent);
  assert.equal(resumedB.opponent!.name, (await c.store.getPlayer(a))!.name);
});

test("play needs a public name (403 name), saves it, and keeps the stored one when none is sent", async () => {
  const c = setup();
  const id = randomUUID();
  await rejects(c.svc.play(id, { mode: "mixed" }, T0), 403, "name");
  const hub0 = await c.svc.hub(id, T0);
  assert.equal(hub0.me.needsName, true);
  assert.equal(hub0.me.rating, 1000);
  const p = await c.svc.play(id, { mode: "mixed", name: "Vega", avatar: "star" }, T0);
  assert.equal(p.role, "a");
  const rec = (await c.store.getPlayer(id))!;
  assert.deepEqual([rec.name, rec.avatar], ["Vega", "star"]);
  // New name from the profile replaces it; none sent keeps it.
  await c.svc.play(id, { mode: "mixed", name: "Vega2" }, T0);
  assert.equal((await c.store.getPlayer(id))!.name, "Vega2");
  await c.svc.play(id, { mode: "mixed" }, T0);
  assert.equal((await c.store.getPlayer(id))!.name, "Vega2");
  assert.equal((await c.svc.hub(id, T0)).me.needsName, false);
});

test("limits: a 4th waiting match is 429 limit_waiting; the daily limit is 429 limit_daily", async () => {
  const c = setup();
  const a = await user(c);
  for (let i = 0; i < MAX_WAITING_MATCHES; i++) {
    const p = await play(c, a, T0 + i * H);
    await playThrough(c, a, p.matchId, T0 + i * H);
  }
  assert.equal((await c.svc.hub(a, T0 + 4 * H)).limits.waitingLeft, 0);
  await rejects(play(c, a, T0 + 4 * H), 429, "limit_waiting");
  // The daily limit: 30 matches started in the last day (rows faked straight into the file).
  const d = await user(c);
  edit(c.file, (db) => {
    for (let i = 0; i < 30; i++) {
      const id = randomUUID();
      db.matches[id] = { ...Object.values(db.matches)[0], id, playerA: d, playerB: null, status: "expired", createdAt: T0 + 5 * H };
    }
  });
  await rejects(play(c, d, T0 + 6 * H), 429, "limit_daily");
  assert.equal((await c.svc.hub(d, T0 + 6 * H)).limits.dailyLeft, 0);
});

/* ---------------- forfeit ---------------- */

test("forfeit loses regardless of points: B ahead on points leaves and loses", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  await playThrough(c, a, p.matchId, T0, { right: false }); // A scores 0
  await play(c, b, T0 + H);
  const r = await playThrough(c, b, p.matchId, T0 + H, { right: true, count: 3 });
  const earned = r.answers.at(-1)!.res.totalPoints;
  assert.ok(earned > 0);
  assert.deepEqual(await c.svc.leave(b, p.matchId, T0 + H + 60_000), { forfeit: true });
  const m = (await c.store.getMatch(p.matchId))!;
  assert.deepEqual([m.status, m.forfeit, m.result, m.pointsB, m.pointsA], ["finished", "b", "a", earned, 0]);
  assert.ok(m.pointsB! > m.pointsA!);
  assert.deepEqual([m.deltaA, m.deltaB], [12, -12]);
  const rows = await c.store.getAnswers(p.matchId, b);
  assert.equal(rows.length, MATCH_SIZE);
  assert.deepEqual(rows.slice(3).map((x) => x.status), Array(7).fill("annulled"));
  const sb = await c.svc.state(b, p.matchId, T0 + 2 * H);
  assert.deepEqual([sb.outcome, sb.forfeit, sb.myPartDone], ["loss", "b", true]);
  assert.equal(sb.review!.length, MATCH_SIZE);
  // Leaving again is harmless; a finished part can't be left.
  assert.deepEqual(await c.svc.leave(b, p.matchId, T0 + 3 * H), { forfeit: true });
  await rejects(c.svc.leave(a, p.matchId, T0 + 3 * H), 409, "conflict");
});

test("A forfeits at once: the match waits, B plays it and wins with any points", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  await c.svc.next(a, p.matchId, T0);
  await c.svc.leave(a, p.matchId, T0 + 1000);
  const waiting = (await c.store.getMatch(p.matchId))!;
  assert.deepEqual([waiting.status, waiting.forfeit, waiting.pointsA], ["waiting", "a", 0]);
  assert.equal((await c.store.getAnswers(p.matchId, a)).length, MATCH_SIZE);
  // The forfeiter's own view; the hub lists the match as waiting.
  assert.equal((await c.svc.state(a, p.matchId, T0 + 2000)).myPartDone, true);
  assert.equal((await c.svc.hub(a, T0 + 2000)).waiting[0].id, p.matchId);
  await play(c, b, T0 + H);
  await playThrough(c, b, p.matchId, T0 + H, { right: false });
  const fin = (await c.store.getMatch(p.matchId))!;
  assert.deepEqual([fin.status, fin.result, fin.forfeit], ["finished", "b", "a"]);
  assert.equal((await c.store.getPlayer(a))!.rating, 988);
  assert.equal((await c.store.getPlayer(b))!.rating, 1012);
});

test("leave before the first question works too (nothing issued yet)", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const p = await play(c, a);
  await c.svc.leave(a, p.matchId, T0);
  assert.equal((await c.store.getMatch(p.matchId))!.status, "waiting");
  assert.equal((await c.store.getAnswers(p.matchId, a)).length, MATCH_SIZE);
});

/* ---------------- no leaks ---------------- */

test("no answer / explanation / question id in any response before the player's part is done", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const seen: [string, unknown][] = [];
  const keep = <T>(label: string, v: T): T => (seen.push([label, v]), v);

  const p = keep("play a", await play(c, a));
  keep("hub", await c.svc.hub(a, T0));
  keep("state 0", await c.svc.state(a, p.matchId, T0));
  let now = T0;
  for (let i = 0; i < MATCH_SIZE; i++) {
    const n = keep(`next ${i}`, await c.svc.next(a, p.matchId, now));
    assert.ok(!n.done);
    if (n.done) break;
    assert.ok(!("id" in n.question));
    if (i === 2) keep("annul", await c.svc.annul(a, p.matchId, i, now + 2000));
    else if (i === 4) keep("late", await c.svc.answer(a, p.matchId, i, "B", now + 200_000));
    else if (i < MATCH_SIZE - 1) {
      keep(`answer ${i}`, await c.svc.answer(a, p.matchId, i, rightAnswer(questionOf(n)), now + 4000));
      keep(`state ${i + 1}`, await c.svc.state(a, p.matchId, now + 4500));
    } else break;
    now += 10_000;
  }
  // idx 9 is open: the part isn't done yet; look at everything again.
  keep("state mid", await c.svc.state(a, p.matchId, now));
  keep("hub mid", await c.svc.hub(a, now));
  for (const [label, v] of seen) {
    assertNoLeak(v, label);
    if (label.startsWith("state")) assert.equal((v as MatchState).review, null, label);
  }
  // B, before the finish, sees nothing of A's answers either, and A's points stay hidden until the match is finished.
  await c.svc.next(a, p.matchId, now + 300_000); // 9 ran out: closed as a timeout -> done
  assert.equal((await c.store.getMatch(p.matchId))!.status, "waiting");
  const pb = await play(c, b, T0 + H);
  const sb0 = await c.svc.state(b, p.matchId, T0 + H);
  assertNoLeak(sb0, "state b 0");
  assert.equal(sb0.review, null);
  assert.equal(sb0.opponentPoints, null);
  assertNoLeak(pb, "play b");
  const n = await c.svc.next(b, p.matchId, T0 + H);
  assertNoLeak(n, "next b");
  const sa = await c.svc.state(a, p.matchId, T0 + H); // A is done but B isn't: review yes, opponent points no
  assert.ok(sa.review);
  assert.equal(sa.opponentPoints, null);
  assert.equal(sa.outcome, null);
  assert.equal(sa.delta, null);
});

/* ---------------- hub ---------------- */

test("hub: me, active, waiting, recent and limits", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  const h1 = await c.svc.hub(a, T0);
  assert.equal(h1.active!.id, p.matchId);
  assert.deepEqual([h1.active!.status, h1.active!.role, h1.active!.answered, h1.active!.total], ["playing_a", "a", 0, MATCH_SIZE]);
  assert.equal(h1.waiting.length + h1.recent.length, 0);
  assert.equal(h1.me.rating, 1000);
  assert.equal(h1.me.level.level, 4);
  assert.equal(h1.limits.dailyLeft, 29);
  assert.equal(h1.limits.waitingLeft, 3);

  await playThrough(c, a, p.matchId, T0);
  const h2 = await c.svc.hub(a, T0 + 1000);
  assert.equal(h2.active, null);
  assert.equal(h2.waiting.length, 1);
  assert.equal(h2.waiting[0].status, "waiting");
  assert.equal(h2.waiting[0].opponent, null);
  assert.equal(h2.waiting[0].expiresAt, (await c.store.getMatch(p.matchId))!.expiresAt);
  assert.equal(h2.waiting[0].answered, MATCH_SIZE);
  assert.equal(h2.limits.waitingLeft, 2);

  await play(c, b, T0 + H);
  await playThrough(c, b, p.matchId, T0 + H, { right: false });
  const h3 = await c.svc.hub(a, T0 + 2 * H);
  assert.equal(h3.waiting.length, 0);
  assert.equal(h3.recent.length, 1);
  assert.deepEqual([h3.recent[0].outcome, h3.recent[0].delta, h3.recent[0].opponentPoints], ["win", 12, 0]);
  assert.equal(h3.recent[0].opponent!.name, (await c.store.getPlayer(b))!.name);
  assert.equal(h3.me.rating, 1012);
  assert.deepEqual([h3.me.matches, h3.me.wins], [11, 1]);
  const hb = await c.svc.hub(b, T0 + 2 * H);
  assert.deepEqual([hb.recent[0].outcome, hb.recent[0].delta, hb.recent[0].role], ["loss", -12, "b"]);
});

/* ---------------- races ---------------- */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MIN = 60_000;

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
  const p = await play(c, a);

  // Nothing open yet: three parallel calls hand out the same first question.
  const first = await Promise.all([0, 1, 2].map(() => c.svc.next(a, p.matchId, T0)));
  assert.ok(first.every((n) => !n.done && n.idx === 0 && n.issuedAt === T0));
  assert.equal((await c.store.getAnswers(p.matchId, a)).length, 1);

  // The question ran out: two parallel calls both close it (one slowly) and both land on question 1.
  const late = T0 + 200_000;
  slow = true;
  const both = await Promise.all([c.svc.next(a, p.matchId, late), c.svc.next(a, p.matchId, late)]);
  for (const n of both) assert.ok(!n.done && n.idx === 1 && n.issuedAt === late);
  const rows = await c.store.getAnswers(p.matchId, a);
  assert.deepEqual(rows.map((r) => [r.idx, r.status]), [[0, "timeout"], [1, "open"]]);
  // And the match continues normally from question 1.
  const n2 = await c.svc.next(a, p.matchId, late + 1000);
  assert.ok(!n2.done && n2.idx === 1);
});

test("a parallel /play that created the match first is resumed, not an error", async () => {
  const c = setup((inner) => ({
    ...inner,
    createMatch: async (input: Parameters<EloStore["createMatch"]>[0]) => {
      await inner.createMatch(input); // the other request wins the race ...
      throw new EloActiveMatchError("The player already has a match in progress"); // ... and the unique index refuses ours
    },
  }));
  const a = await user(c);
  const p = await play(c, a);
  assert.equal(p.resumed, true);
  assert.equal(p.role, "a");
  assert.equal((await c.store.listMatches(a)).active!.id, p.matchId);
});

/* ---------------- images ---------------- */

test("question images are match-scoped URLs: no bank path in any pre-completion response, real paths only in the review", async () => {
  const c = setup(undefined, imageBank);
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const x = await user(c);
  const p = await play(c, a);
  let now = T0;
  const seen: unknown[] = [];
  let mcqSeen = 0;
  for (let i = 0; i < MATCH_SIZE; i++) {
    const n = await c.svc.next(a, p.matchId, now);
    assert.ok(!n.done);
    if (n.done) break;
    seen.push(n, await c.svc.state(a, p.matchId, now), await c.svc.hub(a, now));
    const url = (k: string) => `/api/ranked/${p.matchId}/img?idx=${i}&k=${k}`;
    assert.equal(n.question.figure!.src, url("figure"));
    if (n.question.type === "mcq") {
      mcqSeen++;
      assert.equal(n.question.choicesImage, url("choices"));
      assert.deepEqual(n.question.choiceImages, { A: url("A"), B: url("B"), C: url("C"), D: url("D") });
    }
    // The route resolves its own player's issued question to the real file ...
    assert.equal(await c.svc.image(a, p.matchId, i, "figure"), `bank/img/${n.section}/${n.section}-${n.difficulty}-${questionOf(n).id.split("_")[3]}.webp`);
    // ... but not a question that wasn't issued yet, another player, or garbage.
    await rejects(c.svc.image(a, p.matchId, i + 1, "figure"), i + 1 < MATCH_SIZE ? 404 : 400);
    await rejects(c.svc.image(x, p.matchId, i, "figure"), 404, "not_found");
    await rejects(c.svc.image(a, p.matchId, i, "Z"), 400, "bad_request");
    await rejects(c.svc.image(a, p.matchId, -1, "figure"), 400, "bad_request");
    if (n.question.type === "spr") await rejects(c.svc.image(a, p.matchId, i, "choices"), 404, "not_found");
    now = n.issuedAt + 4000;
    seen.push(await c.svc.answer(a, p.matchId, i, rightAnswer(questionOf(n)), now));
    now += 1000;
  }
  assert.ok(mcqSeen > 0);
  seen.push(await play(c, b, T0 + H));
  for (const v of seen) assertNoLeak(v, "images");
  // After the part is done, the review may carry the real bank paths.
  const st = await c.svc.state(a, p.matchId, now);
  assert.ok(st.review!.every((r) => r.question.figure!.src.startsWith("/bank/img/")));
});

test("publicImagePath only allows plain /bank/ and /tests/ paths", () => {
  assert.equal(publicImagePath("/bank/img/rw/eng_0006.webp"), "bank/img/rw/eng_0006.webp");
  assert.equal(publicImagePath("/tests/img/2024-08-int-a/m2-08-1.webp"), "tests/img/2024-08-int-a/m2-08-1.webp");
  for (const bad of ["/bank/../.env.local", "/bank/img/../../x.webp", "/etc/passwd", "bank/img/a.webp", "/bank//a.webp", "/bank/a b.webp", "/bank/a\\b", "/bank/a?x=1", "https://x.test/bank/a.webp", ""]) {
    assert.equal(publicImagePath(bad), null, bad);
  }
});

/* ---------------- abandoned parts ---------------- */

test("a stale B part is forfeited lazily (hub of A), a fresh one is left alone", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  await playThrough(c, a, p.matchId, T0);
  await play(c, b, T0 + H);
  const r = await playThrough(c, b, p.matchId, T0 + H, { count: 2, after: 1000 });
  // The last sign of life is B's second answer.
  assert.equal(STALE_PART_MS, 30 * MIN);
  assert.equal((await c.svc.hub(a, r.end + 29 * MIN)).waiting[0].status, "playing_b");
  assert.equal((await c.store.getMatch(p.matchId))!.status, "playing_b");
  const hubA = await c.svc.hub(a, r.end + 31 * MIN);
  assert.equal(hubA.waiting.length, 0);
  assert.deepEqual([hubA.recent[0].outcome, hubA.recent[0].delta], ["win", 12]);
  const m = (await c.store.getMatch(p.matchId))!;
  assert.deepEqual([m.status, m.forfeit, m.result], ["finished", "b", "a"]);
  const rows = await c.store.getAnswers(p.matchId, b);
  assert.equal(rows.length, MATCH_SIZE);
  assert.deepEqual(rows.slice(2).map((x) => x.status), Array(8).fill("annulled"));
  assert.equal(m.pointsB, rows.slice(0, 2).reduce((t, x) => t + x.points, 0));
  // B coming back finds the match lost; next just says done.
  assert.equal((await c.svc.state(b, p.matchId, r.end + 40 * MIN)).outcome, "loss");
  assert.equal((await c.svc.next(b, p.matchId, r.end + 40 * MIN)).done, true);
});

test("the stale clock starts when the open question's time limit ends", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  await playThrough(c, a, p.matchId, T0);
  await play(c, b, T0 + H);
  const n = await c.svc.next(b, p.matchId, T0 + H);
  assert.ok(!n.done);
  if (n.done) return;
  const limitEnd = T0 + H + n.limitS * 1000;
  assert.equal((await c.svc.state(a, p.matchId, limitEnd + 29 * MIN)).status, "playing_b");
  assert.equal((await c.svc.state(a, p.matchId, limitEnd + 31 * MIN)).status, "finished");
});

test("a stale A part that answered something is forfeited into waiting; B can still play it and win", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  const r = await playThrough(c, a, p.matchId, T0, { count: 2 });
  const earned = r.answers.at(-1)!.res.totalPoints;
  const sa = await c.svc.state(a, p.matchId, r.end + 31 * MIN); // the player's own view triggers it too
  const m = (await c.store.getMatch(p.matchId))!;
  assert.deepEqual([m.status, m.forfeit, m.pointsA], ["waiting", "a", earned]);
  assert.equal(sa.myPartDone, true);
  assert.equal(sa.forfeit, "a");
  await play(c, b, r.end + 32 * MIN);
  // B can't see A's forfeit while playing; after the finish it shows.
  const mid = await c.svc.state(b, p.matchId, r.end + 33 * MIN);
  assert.equal(mid.forfeit, null);
  await playThrough(c, b, p.matchId, r.end + 33 * MIN, { right: false });
  const fin = (await c.store.getMatch(p.matchId))!;
  assert.deepEqual([fin.status, fin.result], ["finished", "b"]);
  assert.equal((await c.svc.state(b, p.matchId, r.end + 99 * MIN)).forfeit, "a");
  assert.equal((await c.store.getPlayer(b))!.rating, 1012);
});

test("a stale A part that answered nothing just expires, and play starts a fresh match", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const p = await play(c, a);
  const n = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n.done);
  if (n.done) return;
  // Within the limit + 30 minutes the match is still resumed.
  const soon = await play(c, a, T0 + n.limitS * 1000 + 29 * MIN);
  assert.deepEqual([soon.matchId, soon.resumed], [p.matchId, true]);
  const later = await play(c, a, T0 + n.limitS * 1000 + 31 * MIN);
  assert.equal(later.resumed, false);
  assert.notEqual(later.matchId, p.matchId);
  assert.equal((await c.store.getMatch(p.matchId))!.status, "expired");
  assert.equal((await c.store.getPlayer(a))!.rating, 1000);
});

test("a stale B part is also ended when B plays again, and B can then start a new match", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  await playThrough(c, a, p.matchId, T0);
  await play(c, b, T0 + H);
  await c.svc.next(b, p.matchId, T0 + H);
  const again = await play(c, b, T0 + H + 3 * 60 * MIN);
  assert.equal((await c.store.getMatch(p.matchId))!.status, "finished");
  assert.deepEqual([again.resumed, again.role], [false, "a"]); // nobody else is waiting: a new match as A
});

test("the first forfeit stands: A stale-forfeits, B then leaves too, and B still wins", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const b = await user(c, { matches: 10 });
  const p = await play(c, a);
  const r = await playThrough(c, a, p.matchId, T0, { count: 2 });
  await c.svc.state(a, p.matchId, r.end + 31 * MIN); // A abandoned: forfeit a, waiting
  await play(c, b, r.end + 32 * MIN);
  await c.svc.next(b, p.matchId, r.end + 32 * MIN);
  await c.svc.leave(b, p.matchId, r.end + 33 * MIN);
  const m = (await c.store.getMatch(p.matchId))!;
  assert.deepEqual([m.status, m.forfeit, m.result], ["finished", "a", "b"]);
  assert.equal((await c.store.getPlayer(b))!.rating, 1012);
  // The same when B just stops playing (stale) instead of leaving.
  const a2 = await user(c, { matches: 10 });
  const b2 = await user(c, { matches: 10 });
  const p2 = await play(c, a2, T0 + 5 * H);
  const r2 = await playThrough(c, a2, p2.matchId, T0 + 5 * H, { count: 1 });
  await c.svc.state(a2, p2.matchId, r2.end + 31 * MIN);
  await play(c, b2, r2.end + 32 * MIN);
  await c.svc.hub(a2, r2.end + 100 * MIN); // B's part is stale now
  const m2 = (await c.store.getMatch(p2.matchId))!;
  assert.deepEqual([m2.status, m2.forfeit, m2.result], ["finished", "a", "b"]);
});

test("hub shows the real answered count of an abandoned A match that expired", async () => {
  const c = setup();
  const a = await user(c, { matches: 10 });
  const p = await play(c, a);
  const n = await c.svc.next(a, p.matchId, T0);
  assert.ok(!n.done);
  if (n.done) return;
  // Question 0 timed out (closed by the next call), then the player vanished with nothing answered.
  const n1 = await c.svc.next(a, p.matchId, T0 + 200_000);
  assert.ok(!n1.done && n1.idx === 1);
  const h = await c.svc.hub(a, T0 + 200_000 + 4 * H);
  assert.equal((await c.store.getMatch(p.matchId))!.status, "expired");
  const s = h.recent.find((m) => m.id === p.matchId)!;
  assert.deepEqual([s.status, s.answered], ["expired", 1]); // question 0 closed (timeout), question 1 still open, not 10
});
