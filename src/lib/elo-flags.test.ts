// Run: node --test --conditions=react-server src/lib/elo-flags.test.ts  (docs/ELO.md section 6.4)

import { test } from "node:test";
import assert from "node:assert/strict";
import { fastAccurate, flagsForMatch, ratingSpike, samePair, type FlagAnswer, type FlagMatch, type PairMatch } from "./elo-flags.ts";

const H = 3_600_000;
const D = 24 * H;

/** n answers: `right` of them correct, each taking `share` of a 100 s limit. */
function answers(n: number, right: number, share: number): FlagAnswer[] {
  return Array.from({ length: n }, (_, i) => ({ status: "answered" as const, correct: i < right, elapsedMs: share * 100_000, limitS: 100 }));
}

test("fast_accurate: 9/10 correct at 20% of the limit is flagged", () => {
  const r = fastAccurate(answers(10, 9, 0.2));
  assert.equal(r.flagged, true);
  assert.equal(r.correct, 9);
  assert.equal(r.answered, 10);
});

test("fast_accurate: 8/10 is the lowest count that flags, 7/10 is not", () => {
  assert.equal(fastAccurate(answers(10, 8, 0.1)).flagged, true);
  assert.equal(fastAccurate(answers(10, 7, 0.1)).flagged, false);
});

test("fast_accurate: a mean of exactly 25% is not flagged, just under is", () => {
  assert.equal(fastAccurate(answers(10, 10, 0.25)).flagged, false);
  assert.equal(fastAccurate(answers(10, 10, 0.249)).flagged, true);
});

test("fast_accurate: wrong answers also count in the mean", () => {
  const a = [...answers(8, 8, 0.1), ...answers(2, 0, 0.9)]; // mean = (8 x 0.1 + 2 x 0.9) / 10 = 0.26
  assert.equal(fastAccurate(a).flagged, false);
});

test("fast_accurate: timeouts and open rows stay out of the mean; nothing answered is never flagged", () => {
  const a: FlagAnswer[] = [...answers(8, 8, 0.1), { status: "timeout", correct: null, elapsedMs: null, limitS: 100 }, { status: "open", correct: null, elapsedMs: null, limitS: 100 }];
  const r = fastAccurate(a);
  assert.equal(r.answered, 8);
  assert.equal(r.flagged, true);
  const none = fastAccurate([{ status: "open", correct: null, elapsedMs: null, limitS: 100 }]);
  assert.equal(none.flagged, false);
  assert.equal(none.meanShare, null);
  assert.equal(fastAccurate([]).flagged, false);
});

const T0 = Date.UTC(2026, 0, 10, 12);
const pm = (id: string, a: string, b: string | null, at: number, status = "finished"): PairMatch => ({ id, playerA: a, playerB: b, status, createdAt: at });

test("same_pair: 3 matches inside 7 days do not flag", () => {
  const others = [pm("m1", "x", "y", T0 - 3 * D), pm("m2", "y", "x", T0 - D)];
  const r = samePair(pm("m3", "x", "y", T0), others);
  assert.equal(r.count, 3);
  assert.equal(r.flagged, false);
});

test("same_pair: the 4th match is the first to flag (count 4 > 3)", () => {
  const others = [pm("m1", "x", "y", T0 - 3 * D), pm("m2", "x", "y", T0 - 2 * D), pm("m3", "x", "y", T0 - D)];
  const r = samePair(pm("m4", "x", "y", T0), others);
  assert.equal(r.count, 4);
  assert.equal(r.flagged, true);
});

test("same_pair: matches more than 7 days apart do not add up", () => {
  const others = [pm("m1", "x", "y", T0 - 8 * D), pm("m2", "x", "y", T0 - 7.5 * D), pm("m3", "x", "y", T0 - 7 * D - H)];
  const r = samePair(pm("m4", "x", "y", T0), others);
  assert.equal(r.count, 1);
  assert.equal(r.flagged, false);
});

test("same_pair: exactly 7 days still counts as one window", () => {
  const others = [pm("m1", "x", "y", T0 - 7 * D), pm("m2", "x", "y", T0 - 4 * D), pm("m3", "x", "y", T0 - 2 * D)];
  assert.equal(samePair(pm("m4", "x", "y", T0), others).flagged, true);
});

test("same_pair: other pairs, void matches and the target itself are ignored", () => {
  const target = pm("m4", "x", "y", T0);
  const others = [
    pm("m4", "x", "y", T0), // the target again
    pm("v1", "x", "y", T0 - D, "void"),
    pm("v2", "x", "y", T0 - 2 * D, "void"),
    pm("o1", "x", "z", T0 - D),
    pm("o2", "z", "y", T0 - D),
    pm("o3", "x", "y", T0 - D, "waiting"),
    pm("n1", "x", null, T0 - D, "waiting"),
  ];
  const r = samePair(target, others);
  assert.equal(r.count, 2); // the target and o3
  assert.equal(r.flagged, false);
});

test("same_pair: a match without an opponent is never flagged; a void target is still evaluated", () => {
  assert.equal(samePair(pm("m", "x", null, T0, "waiting"), []).flagged, false);
  const others = [pm("m1", "x", "y", T0 - D), pm("m2", "x", "y", T0 - 2 * D), pm("m3", "x", "y", T0 - 3 * D)];
  assert.equal(samePair(pm("m4", "x", "y", T0, "void"), others).flagged, true);
});

test("same_pair: window counts only matches that can sit in one window with the target", () => {
  // 3 matches 6 days before the target and the target: they all fit one window [T0-6d, T0] -> 4.
  const others = [pm("m1", "x", "y", T0 - 6 * D), pm("m2", "x", "y", T0 - 6 * D + H), pm("m3", "x", "y", T0 - 6 * D + 2 * H)];
  assert.equal(samePair(pm("m4", "x", "y", T0), others).count, 4);
  // Matches after the target also share a window with it.
  const later = [pm("m5", "x", "y", T0 + D), pm("m6", "x", "y", T0 + 2 * D), pm("m7", "x", "y", T0 + 3 * D)];
  assert.equal(samePair(pm("m4", "x", "y", T0), later).flagged, true);
});

test("rating_spike: +151 within 24 h is flagged, +150 is not", () => {
  assert.equal(ratingSpike(T0, [{ matchId: "a", at: T0 - 2 * H, delta: 100 }, { matchId: "b", at: T0, delta: 51 }]).flagged, true);
  const exact = ratingSpike(T0, [{ matchId: "a", at: T0 - 2 * H, delta: 100 }, { matchId: "b", at: T0, delta: 50 }]);
  assert.equal(exact.gain, 150);
  assert.equal(exact.flagged, false);
});

test("rating_spike: rows older than 24 h or after the match are outside the window; the edge at exactly 24 h is inside", () => {
  const rows = [
    { matchId: "old", at: T0 - 24 * H - 1, delta: 500 },
    { matchId: "edge", at: T0 - 24 * H, delta: 100 },
    { matchId: "later", at: T0 + 1, delta: 500 },
    { matchId: "now", at: T0, delta: 60 },
  ];
  const r = ratingSpike(T0, rows);
  assert.equal(r.gain, 160);
  assert.equal(r.flagged, true);
});

test("rating_spike: losses offset gains", () => {
  const r = ratingSpike(T0, [{ matchId: "a", at: T0 - H, delta: 120 }, { matchId: "b", at: T0 - 30 * 60_000, delta: -40 }, { matchId: "c", at: T0, delta: 80 }]);
  assert.equal(r.gain, 160);
  assert.equal(r.flagged, true);
  const calm = ratingSpike(T0, [{ matchId: "a", at: T0 - H, delta: 120 }, { matchId: "b", at: T0 - 30 * 60_000, delta: -60 }, { matchId: "c", at: T0, delta: 80 }]);
  assert.equal(calm.flagged, false);
});

test("flagsForMatch: collects flags per side and adds the match itself to the gain rows", () => {
  const m: FlagMatch = { id: "m", playerA: "x", playerB: "y", status: "finished", createdAt: T0 - H, finishedAt: T0, deltaA: 160, deltaB: -160 };
  const flags = flagsForMatch(m, { answersA: answers(10, 9, 0.2), answersB: answers(10, 5, 0.6), pairMatches: [], gainsA: [], gainsB: [] });
  assert.deepEqual(flags.map((f) => `${f.kind}:${f.side}`).sort(), ["fast_accurate:a", "rating_spike:a"]);
});

test("flagsForMatch: a match that isn't finished gets no rating flag", () => {
  const m: FlagMatch = { id: "m", playerA: "x", playerB: "y", status: "playing_b", createdAt: T0, finishedAt: null, deltaA: null, deltaB: null };
  assert.deepEqual(flagsForMatch(m, { answersA: [], answersB: [], pairMatches: [], gainsA: [], gainsB: [] }), []);
});
