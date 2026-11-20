// Ranked matches (ELO): every tunable number from docs/ELO.md sections 3-6 lives here, so rules change without touching logic.
// Pure data, no imports of runtime code (the formulas in elo.ts also run under plain Node for the tests).

import type { Difficulty } from "./types";
import type { SectionId } from "./taxonomy";

// --- 3. Points per question -------------------------------------------------------------------------------------------

/** Milliseconds per second. */
export const MS_PER_S = 1000;
/** Denominator of per-mille values. */
export const PERMILLE = 1000;

/** Time limit L per question, in seconds (3.1). */
export const TIME_LIMIT_S: Record<SectionId, Record<Difficulty, number>> = {
  rw: { easy: 60, medium: 75, hard: 90 },
  math: { easy: 75, medium: 100, hard: 130 },
};

/** Base points for a correct answer (3.2). */
export const BASE_POINTS: Record<Difficulty, number> = { easy: 100, medium: 150, hard: 200 };

/**
 * Speed bonus is up to this share of the base (3.3): 1/2 as an integer fraction, so the bonus is computed in whole
 * milliseconds without float ties (the SQL twin must do the same).
 */
export const SPEED_BONUS_SHARE = { num: 1, den: 2 } as const;
/**
 * Answers faster than this share of the limit count as exactly this share (the "floor" of 3.3), in per-mille: 200 = 0.2.
 * Exact in integer ms: floor_ms = L_s x 1000 x permille / 1000 = L_s x permille.
 */
export const SPEED_FLOOR_PERMILLE = 200;

/** Network slack (ms) subtracted from the measured server time of an answer (6.1). */
export const NETWORK_GRACE_MS = 2000;

// --- 4. ELO -----------------------------------------------------------------------------------------------------------

export const START_RATING = 1000;
export const RATING_FLOOR = 100;
/** Finished matches a player needs to leave calibration (4.3, 4.5). */
export const PLACEMENT_MATCHES = 10;

/** Divisor of the expected-score formula (4.1). */
export const ELO_SCALE = 400;
/** Actual score S by match result (4.2). */
export const RESULT_SCORE = { win: 1, draw: 0.5, loss: 0 } as const;

/** K factor (4.3): calibration first, then by rating. */
export const K_FACTOR = { calibration: 40, standard: 24, high: 16, highFromRating: 2000 } as const;

export interface LevelDef {
  level: number;
  name: string;
  /** Lowest rating of the level. */
  min: number;
  /** Highest rating of the level; null = no upper bound. */
  max: number | null;
}

/** Levels (4.5), ascending. A level starts right after the previous one's max. */
export const LEVELS: readonly LevelDef[] = [
  { level: 1, name: "Spark", min: 100, max: 500 },
  { level: 2, name: "Ember", min: 501, max: 750 },
  { level: 3, name: "Comet", min: 751, max: 900 },
  { level: 4, name: "Meteor", min: 901, max: 1050 },
  { level: 5, name: "Moon", min: 1051, max: 1200 },
  { level: 6, name: "Planet", min: 1201, max: 1350 },
  { level: 7, name: "Star", min: 1351, max: 1530 },
  { level: 8, name: "Nova", min: 1531, max: 1750 },
  { level: 9, name: "Supernova", min: 1751, max: 2000 },
  { level: 10, name: "Stellar", min: 2001, max: null },
];

// --- 5. Match set and matchmaking -------------------------------------------------------------------------------------

/** Questions per match (5.2). */
export const MATCH_SIZE = 10;
/** Section of each slot in Mixed mode: 5 RW + 5 Math, alternating (5.2). */
export const MIXED_LAYOUT: readonly SectionId[] = ["rw", "math", "rw", "math", "rw", "math", "rw", "math", "rw", "math"];

/** Difficulty mix by the match creator's rating (5.2); the first row whose `below` exceeds the rating applies. */
export const DIFFICULTY_MIX: readonly { below: number; mix: Record<Difficulty, number> }[] = [
  { below: 900, mix: { easy: 5, medium: 4, hard: 1 } },
  { below: 1300, mix: { easy: 3, medium: 5, hard: 2 } },
  { below: 1700, mix: { easy: 2, medium: 4, hard: 4 } },
  { below: Infinity, mix: { easy: 1, medium: 4, hard: 5 } },
];

/** Avoid questions the player saw in ranked matches within this many days, when the bank allows (5.2). */
export const RECENT_QUESTIONS_DAYS = 30;

/** Matchmaking rating window (5.4): min(cap, base + perHour x hours waited). */
export const MATCH_WINDOW = { base: 100, perHour: 50, cap: 400 } as const;

/** A waiting match without an opponent expires after this many hours (5.3). */
export const WAITING_EXPIRY_H = 48;
/** The same pair cannot meet again within this many hours (5.4). */
export const REMATCH_COOLDOWN_H = 24;
/** Max matches of one player waiting for an opponent at once (5.4). */
export const MAX_WAITING_MATCHES = 3;
/** Max matches a player may start per day (5.4). */
export const MAX_MATCHES_PER_DAY = 30;

// --- 6. Anti-cheat ----------------------------------------------------------------------------------------------------

/** Leaving full screen / the tab longer than this (seconds) counts as a forfeit (6.3). */
export const FULLSCREEN_ABSENCE_LIMIT_S = 15;

// --- 7. Leaderboards --------------------------------------------------------------------------------------------------

/** Finished matches needed to appear on a board (7). */
export const LEADERBOARD_MIN_MATCHES = { global: 10, season: 5 } as const;
