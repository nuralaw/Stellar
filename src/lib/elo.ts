// Ranked matches (ELO): pure formulas from docs/ELO.md sections 3-5. No I/O, no clock, no server-only imports,
// so the same code runs in the browser, on the server and under plain Node for the tests. All numbers come from elo-config.ts.
// The SQL twin of these formulas (elo_finish_match) must give identical results.

import type { Difficulty } from "./types";
import type { SectionId } from "./taxonomy";
import {
  BASE_POINTS,
  DIFFICULTY_MIX,
  ELO_SCALE,
  K_FACTOR,
  LEVELS,
  MATCH_WINDOW,
  MS_PER_S,
  NETWORK_GRACE_MS,
  PERMILLE,
  PLACEMENT_MATCHES,
  RATING_FLOOR,
  RESULT_SCORE,
  SPEED_BONUS_SHARE,
  SPEED_FLOOR_PERMILLE,
  TIME_LIMIT_S,
} from "./elo-config.ts";

export type MatchResult = "a" | "b" | "draw";

/** Rounds half away from zero, like Postgres round(numeric): 2.5 -> 3, -2.5 -> -3. Never returns -0. */
export function roundHalfAway(x: number): number {
  return Math.sign(x) * Math.round(Math.abs(x)) + 0;
}

// --- Points per question (3) ---

/** Time limit L in seconds (3.1). */
export function timeLimitS(section: SectionId, difficulty: Difficulty): number {
  return TIME_LIMIT_S[section][difficulty];
}

export interface QuestionPoints {
  base: number;
  bonus: number;
  points: number;
  /** The answer took longer than the limit. */
  timedOut: boolean;
}

/**
 * Points for one question (3.3). `elapsedMs` is the server-measured time after the network grace was already subtracted;
 * it is floored to whole ms (negative -> 0; NaN/Infinity count as a timeout). A wrong answer, no answer or a timeout gives 0
 * (base and bonus both).
 * Integer arithmetic: bonus = roundHalfAway(base x num x (L_ms - t_eff_ms) / (den x L_ms)), t_eff_ms = max(elapsed, floor).
 */
export function questionPoints(q: { section: SectionId; difficulty: Difficulty; correct: boolean; elapsedMs: number }): QuestionPoints {
  const limitMs = timeLimitS(q.section, q.difficulty) * MS_PER_S;
  const timedOut = !Number.isFinite(q.elapsedMs) || Math.floor(q.elapsedMs) > limitMs;
  const elapsedMs = timedOut ? limitMs : Math.max(0, Math.floor(q.elapsedMs));
  if (!q.correct || timedOut) return { base: 0, bonus: 0, points: 0, timedOut };
  const base = BASE_POINTS[q.difficulty];
  const tEffMs = Math.max(elapsedMs, (limitMs * SPEED_FLOOR_PERMILLE) / PERMILLE);
  const bonus = roundHalfAway((base * SPEED_BONUS_SHARE.num * (limitMs - tEffMs)) / (SPEED_BONUS_SHARE.den * limitMs));
  return { base, bonus, points: base + bonus, timedOut };
}

/** Server-side elapsed time of an answer: answered - issued - network grace, never negative (6.1). */
export function serverElapsedMs(issuedAtMs: number, answeredAtMs: number): number {
  return Math.max(0, answeredAtMs - issuedAtMs - NETWORK_GRACE_MS);
}

// --- ELO (4) ---

/** Expected score of player A against B (4.1). */
export function expectedScore(ra: number, rb: number): number {
  return 1 / (1 + Math.pow(10, (rb - ra) / ELO_SCALE));
}

/** K factor of one player (4.3): calibration first, then by rating. */
export function kFactor(p: { matches: number; rating: number }): number {
  if (p.matches < PLACEMENT_MATCHES) return K_FACTOR.calibration;
  return p.rating < K_FACTOR.highFromRating ? K_FACTOR.standard : K_FACTOR.high;
}

/** Winner by points; a forfeit loses regardless of points (4.2). */
export function matchResult(pointsA: number, pointsB: number, forfeit?: "a" | "b"): MatchResult {
  if (forfeit === "a") return "b";
  if (forfeit === "b") return "a";
  if (pointsA > pointsB) return "a";
  if (pointsA < pointsB) return "b";
  return "draw";
}

export interface EloPlayer {
  rating: number;
  /** Finished matches so far. */
  matches: number;
}

export interface EloOutcome {
  /** Actual rating change (after the floor). */
  deltaA: number;
  deltaB: number;
  ratingA: number;
  ratingB: number;
  expectedA: number;
}

/** New ratings after a match (4.4): each player's own K, floor RATING_FLOOR (also applied to the incoming ratings), ratings as of the finish time. */
export function applyElo(m: { a: EloPlayer; b: EloPlayer; result: MatchResult }): EloOutcome {
  const ra = Math.max(RATING_FLOOR, m.a.rating);
  const rb = Math.max(RATING_FLOOR, m.b.rating);
  const sa = m.result === "a" ? RESULT_SCORE.win : m.result === "draw" ? RESULT_SCORE.draw : RESULT_SCORE.loss;
  const sb = RESULT_SCORE.win + RESULT_SCORE.loss - sa;
  const expectedA = expectedScore(ra, rb);
  const expectedB = 1 - expectedA;
  const ratingA = Math.max(RATING_FLOOR, ra + roundHalfAway(kFactor({ matches: m.a.matches, rating: ra }) * (sa - expectedA)));
  const ratingB = Math.max(RATING_FLOOR, rb + roundHalfAway(kFactor({ matches: m.b.matches, rating: rb }) * (sb - expectedB)));
  return { deltaA: ratingA - ra, deltaB: ratingB - rb, ratingA, ratingB, expectedA };
}

// --- Levels (4.5) ---

export interface LevelInfo {
  level: number;
  name: string;
  min: number;
  max: number | null;
  /** Rating where the next level starts; null at the top level. */
  next: number | null;
  /** 0..1 progress inside the level (1 at the top level). */
  progress: number;
  /** Still in calibration: show "Placement" instead of the level. */
  placement: boolean;
  /** Calibration matches left (0 once done). */
  left: number;
}

/** Level of a rating plus the calibration state of the player (4.5). */
export function levelOf(rating: number, matches: number): LevelInfo {
  let i = LEVELS.findIndex((l) => l.max === null || rating <= l.max);
  if (i < 0) i = LEVELS.length - 1;
  const cur = LEVELS[i];
  const nextLevel = LEVELS[i + 1];
  const next = nextLevel ? nextLevel.min : null;
  const progress = next === null ? 1 : Math.min(1, Math.max(0, (rating - cur.min) / (next - cur.min)));
  const left = Math.max(0, PLACEMENT_MATCHES - matches);
  return { level: cur.level, name: cur.name, min: cur.min, max: cur.max, next, progress, placement: left > 0, left };
}

// --- Match set and matchmaking (5) ---

/** How many easy / medium / hard questions a match gets, by the creator's rating (5.2). */
export function difficultyMix(rating: number): Record<Difficulty, number> {
  const row = DIFFICULTY_MIX.find((r) => rating < r.below) ?? DIFFICULTY_MIX[DIFFICULTY_MIX.length - 1];
  return { ...row.mix };
}

/** Allowed rating gap to the opponent after waiting this many hours (5.4). */
export function matchWindow(hoursWaiting: number): number {
  return Math.min(MATCH_WINDOW.cap, MATCH_WINDOW.base + MATCH_WINDOW.perHour * Math.max(0, hoursWaiting));
}
