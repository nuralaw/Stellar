// Run: npm run elo:test  (node:test, Node 24 runs the .ts files directly). Cases come from docs/ELO.md section 9.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyElo,
  difficultyMix,
  expectedScore,
  kFactor,
  levelOf,
  matchResult,
  queueWindow,
  questionPoints,
  roundHalfAway,
  serverElapsedMs,
  timeLimitS,
} from "./elo.ts";
import { BASE_POINTS, MATCH_SIZE, MIXED_LAYOUT, RATING_FLOOR, START_RATING } from "./elo-config.ts";

// --- 9.1 Points per question (3.4) ---

test("Q1-Q7: points per question", () => {
  const cases = [
    { name: "Q1", q: { section: "rw", difficulty: "easy", correct: true, elapsedMs: 10_000 }, base: 100, bonus: 40, points: 140, timedOut: false },
    { name: "Q2", q: { section: "math", difficulty: "hard", correct: true, elapsedMs: 65_000 }, base: 200, bonus: 50, points: 250, timedOut: false },
    { name: "Q3", q: { section: "math", difficulty: "medium", correct: true, elapsedMs: 100_000 }, base: 150, bonus: 0, points: 150, timedOut: false },
    { name: "Q4", q: { section: "rw", difficulty: "medium", correct: true, elapsedMs: 30_000 }, base: 150, bonus: 45, points: 195, timedOut: false },
    { name: "Q5", q: { section: "rw", difficulty: "hard", correct: false, elapsedMs: 20_000 }, base: 0, bonus: 0, points: 0, timedOut: false },
    { name: "Q6", q: { section: "math", difficulty: "easy", correct: true, elapsedMs: 75_400 }, base: 0, bonus: 0, points: 0, timedOut: true },
    { name: "Q7", q: { section: "rw", difficulty: "easy", correct: true, elapsedMs: 1_000 }, base: 100, bonus: 40, points: 140, timedOut: false },
  ] as const;
  for (const c of cases) {
    const { name, q, ...want } = c;
    assert.deepEqual(questionPoints(q), want, name);
  }
});

test("time limits table", () => {
  assert.equal(timeLimitS("rw", "easy"), 60);
  assert.equal(timeLimitS("rw", "hard"), 90);
  assert.equal(timeLimitS("math", "easy"), 75);
  assert.equal(timeLimitS("math", "hard"), 130);
});

test("instant answer and zero time both get the capped bonus (40% of base)", () => {
  assert.equal(questionPoints({ section: "math", difficulty: "hard", correct: true, elapsedMs: 0 }).bonus, 80);
  assert.equal(questionPoints({ section: "math", difficulty: "hard", correct: true, elapsedMs: 26_000 }).bonus, 80);
});

test("bonus sweep: every whole ms matches exact rational rounding, 0 <= bonus <= 0.4 x base", () => {
  for (const [section, difficulty] of [["rw", "easy"], ["math", "hard"]] as const) {
    const limitMs = timeLimitS(section, difficulty) * 1000;
    const base = BASE_POINTS[difficulty];
    const floorMs = limitMs / 5;
    for (let ms = 0; ms <= limitMs; ms++) {
      const tEff = BigInt(Math.max(ms, floorMs));
      const num = BigInt(base) * (BigInt(limitMs) - tEff);
      const two = BigInt(2);
      const den = two * BigInt(limitMs);
      const want = Number((two * num + den) / (two * den)); // round half up == half away from zero for num >= 0
      const r = questionPoints({ section, difficulty, correct: true, elapsedMs: ms });
      assert.equal(r.bonus, want, `${section} ${difficulty} ${ms} ms`);
      assert.ok(r.bonus >= 0 && r.bonus <= 0.4 * base, `${section} ${difficulty} ${ms} ms bonus ${r.bonus}`);
      assert.equal(r.points, base + r.bonus);
      assert.equal(r.timedOut, false);
    }
    assert.equal(questionPoints({ section, difficulty, correct: true, elapsedMs: limitMs + 1 }).timedOut, true);
  }
});

test("non-finite elapsed is a timeout; negative counts as 0", () => {
  for (const elapsedMs of [NaN, Infinity, -Infinity]) {
    assert.deepEqual(questionPoints({ section: "rw", difficulty: "easy", correct: true, elapsedMs }), { base: 0, bonus: 0, points: 0, timedOut: true });
  }
  const neg = questionPoints({ section: "rw", difficulty: "easy", correct: true, elapsedMs: -500 });
  assert.deepEqual(neg, { base: 100, bonus: 40, points: 140, timedOut: false });
});

test("roundHalfAway never returns -0", () => {
  assert.ok(Object.is(roundHalfAway(-0.2), 0));
  assert.ok(Object.is(roundHalfAway(-0), 0));
  assert.ok(Object.is(roundHalfAway(0.2), 0));
});

test("applyElo clamps incoming ratings to the floor (a 50-rated loser does not gain)", () => {
  const r = applyElo({ a: p(50), b: p(100), result: "b" });
  assert.equal(r.ratingA, 100);
  assert.equal(r.deltaA, 0);
  assert.equal(r.ratingB, 112);
  assert.equal(r.deltaB, 12);
});

test("wrong answer after the limit: zero and timed out", () => {
  const r = questionPoints({ section: "rw", difficulty: "easy", correct: false, elapsedMs: 61_000 });
  assert.deepEqual(r, { base: 0, bonus: 0, points: 0, timedOut: true });
});

test("roundHalfAway", () => {
  assert.equal(roundHalfAway(2.5), 3);
  assert.equal(roundHalfAway(-2.5), -3);
  assert.equal(roundHalfAway(2.4), 2);
  assert.equal(roundHalfAway(-2.4), -2);
  assert.equal(roundHalfAway(0), 0);
});

test("serverElapsedMs: minus grace, never negative", () => {
  assert.equal(serverElapsedMs(1_000, 13_000), 10_000);
  assert.equal(serverElapsedMs(1_000, 2_500), 0);
  assert.equal(serverElapsedMs(5_000, 1_000), 0);
});

// --- 9.2 ELO (4.4) ---

const near = (a: number, b: number) => assert.equal(Math.round(a * 10_000) / 10_000, b);
const p = (rating: number, matches = 20) => ({ rating, matches });

test("E1: equal ratings, A wins", () => {
  const r = applyElo({ a: p(1000), b: p(1000), result: "a" });
  near(r.expectedA, 0.5);
  assert.equal(r.deltaA, 12);
  assert.equal(r.deltaB, -12);
  assert.equal(r.ratingA, 1012);
  assert.equal(r.ratingB, 988);
});

test("E2: favourite wins", () => {
  const r = applyElo({ a: p(1200), b: p(1000), result: "a" });
  near(r.expectedA, 0.7597);
  assert.equal(r.deltaA, 6);
  assert.equal(r.deltaB, -6);
  assert.equal(r.ratingA, 1206);
  assert.equal(r.ratingB, 994);
});

test("E3: upset", () => {
  const r = applyElo({ a: p(1200), b: p(1000), result: "b" });
  near(r.expectedA, 0.7597);
  assert.equal(r.deltaA, -18);
  assert.equal(r.deltaB, 18);
  assert.equal(r.ratingA, 1182);
  assert.equal(r.ratingB, 1018);
});

test("E4: draw", () => {
  const r = applyElo({ a: p(1100), b: p(1000), result: "draw" });
  near(r.expectedA, 0.6401);
  assert.equal(r.deltaA, -3);
  assert.equal(r.deltaB, 3);
  assert.equal(r.ratingA, 1097);
  assert.equal(r.ratingB, 1003);
});

test("E5: A in calibration (K 40), B regular (K 24)", () => {
  const r = applyElo({ a: p(1000, 3), b: p(1000, 20), result: "a" });
  near(r.expectedA, 0.5);
  assert.equal(r.deltaA, 20);
  assert.equal(r.deltaB, -12);
  assert.equal(r.ratingA, 1020);
  assert.equal(r.ratingB, 988);
});

test("E6: rating floor at 100; delta is the real change", () => {
  const r = applyElo({ a: p(105), b: p(105), result: "b" });
  near(r.expectedA, 0.5);
  assert.equal(r.ratingA, 100);
  assert.equal(r.ratingB, 117);
  assert.equal(r.deltaA, -5);
  assert.equal(r.deltaB, 12);
});

test("start rating = floor (100): a newcomer's loss changes nothing, the winner gains", () => {
  assert.equal(START_RATING, 100);
  assert.equal(START_RATING, RATING_FLOOR);
  assert.equal(levelOf(START_RATING, 10).level, 1);
  const r = applyElo({ a: p(START_RATING), b: p(START_RATING), result: "a" });
  assert.deepEqual([r.deltaA, r.deltaB, r.ratingA, r.ratingB], [12, 0, 112, 100]);
});

test("expectedScore is symmetric", () => {
  near(expectedScore(1200, 1000) + expectedScore(1000, 1200), 1);
});

test("floor at 100 even from exactly 100", () => {
  const r = applyElo({ a: p(100), b: p(100), result: "b" });
  assert.equal(r.ratingA, 100);
  assert.equal(r.deltaA, 0);
});

// --- Match result (4.2) ---

test("matchResult: points decide, equal points draw", () => {
  assert.equal(matchResult(500, 400), "a");
  assert.equal(matchResult(400, 500), "b");
  assert.equal(matchResult(450, 450), "draw");
  assert.equal(matchResult(0, 0), "draw");
});

test("matchResult: a forfeit loses even with more points", () => {
  assert.equal(matchResult(900, 100, "a"), "b");
  assert.equal(matchResult(100, 900, "b"), "a");
  assert.equal(matchResult(450, 450, "b"), "a");
});

// --- 9.3 Levels (4.5) ---

test("levelOf: boundaries", () => {
  const cases: [number, number][] = [[100, 1], [500, 1], [501, 2], [1000, 4], [1050, 4], [1051, 5], [2000, 9], [2001, 10]];
  for (const [rating, level] of cases) assert.equal(levelOf(rating, 50).level, level, `rating ${rating}`);
});

test("levelOf: names, range, progress", () => {
  const l4 = levelOf(1000, 50);
  assert.equal(l4.name, "Meteor");
  assert.equal(l4.min, 901);
  assert.equal(l4.max, 1050);
  assert.equal(l4.next, 1051);
  near(l4.progress, 0.66);
  assert.equal(levelOf(901, 50).progress, 0);
  assert.equal(levelOf(100, 50).progress, 0);
  const top = levelOf(2500, 50);
  assert.equal(top.level, 10);
  assert.equal(top.name, "Stellar");
  assert.equal(top.max, null);
  assert.equal(top.next, null);
  assert.equal(top.progress, 1);
});

test("levelOf: placement state while matches < 10", () => {
  assert.deepEqual([levelOf(1000, 0).placement, levelOf(1000, 0).left], [true, 10]);
  assert.deepEqual([levelOf(1000, 9).placement, levelOf(1000, 9).left], [true, 1]);
  assert.deepEqual([levelOf(1000, 10).placement, levelOf(1000, 10).left], [false, 0]);
});

// --- 9.4 K factor (4.3) ---

test("kFactor", () => {
  assert.equal(kFactor({ matches: 9, rating: 1000 }), 40);
  assert.equal(kFactor({ matches: 0, rating: 2500 }), 40);
  assert.equal(kFactor({ matches: 10, rating: 1999 }), 24);
  assert.equal(kFactor({ matches: 10, rating: 2000 }), 16);
});

// --- Match set and matchmaking (5) ---

test("difficultyMix: boundaries and size", () => {
  assert.deepEqual(difficultyMix(899), { easy: 5, medium: 4, hard: 1 });
  assert.deepEqual(difficultyMix(900), { easy: 3, medium: 5, hard: 2 });
  assert.deepEqual(difficultyMix(1299), { easy: 3, medium: 5, hard: 2 });
  assert.deepEqual(difficultyMix(1300), { easy: 2, medium: 4, hard: 4 });
  assert.deepEqual(difficultyMix(1699), { easy: 2, medium: 4, hard: 4 });
  assert.deepEqual(difficultyMix(1700), { easy: 1, medium: 4, hard: 5 });
  for (const r of [100, 899, 900, 1299, 1300, 1699, 1700, 3000]) {
    const m = difficultyMix(r);
    assert.equal(m.easy + m.medium + m.hard, MATCH_SIZE, `rating ${r}`);
  }
});

test("difficultyMix returns a copy", () => {
  difficultyMix(1000).easy = 99;
  assert.equal(difficultyMix(1000).easy, 3);
});

test("Mixed layout: 5 RW + 5 Math, alternating", () => {
  assert.equal(MIXED_LAYOUT.length, MATCH_SIZE);
  assert.equal(MIXED_LAYOUT.filter((s) => s === "rw").length, 5);
  assert.equal(MIXED_LAYOUT.filter((s) => s === "math").length, 5);
  MIXED_LAYOUT.forEach((s, i) => assert.equal(s, i % 2 === 0 ? "rw" : "math"));
});

test("queueWindow: 100 + 100 per 30 s, no limit from 120 s", () => {
  assert.equal(queueWindow(0), 100);
  assert.equal(queueWindow(29_000), 100);
  assert.equal(queueWindow(29_999), 100);
  assert.equal(queueWindow(30_000), 200);
  assert.equal(queueWindow(59_999), 200);
  assert.equal(queueWindow(60_000), 300);
  assert.equal(queueWindow(89_999), 300);
  assert.equal(queueWindow(90_000), 400);
  assert.equal(queueWindow(119_000), 400);
  assert.equal(queueWindow(120_000), null);
  assert.equal(queueWindow(10 * 60_000), null);
  assert.equal(queueWindow(-5_000), 100, "negative time counts as 0");
});
