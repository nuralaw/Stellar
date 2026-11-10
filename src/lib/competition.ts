// Weekly competition: rules shared by the server (grading) and the client (UI).
//
// Every week (Monday 00:00 UTC → next Monday) has two rounds, Reading & Writing and Math. Each participant gets their
// own random set per round: 15 easy, 10 medium, 5 hard questions. One attempt per round per week.
// Points: correct answers by difficulty, plus a speed bonus of up to +50% for finishing early.

import type { Difficulty } from "./types";
import type { SectionId } from "./taxonomy";

export type RoundId = SectionId;

export const ROUND_MIX: Record<Difficulty, number> = { easy: 15, medium: 10, hard: 5 };
export const ROUND_SIZE = ROUND_MIX.easy + ROUND_MIX.medium + ROUND_MIX.hard;

export const ROUNDS: Record<RoundId, { name: string; minutes: number }> = {
  rw: { name: "Reading and Writing", minutes: 35 },
  math: { name: "Math", minutes: 45 },
};

export const POINTS: Record<Difficulty, number> = { easy: 10, medium: 20, hard: 30 };
/** Highest possible base (all correct). */
export const MAX_BASE = (Object.keys(ROUND_MIX) as Difficulty[]).reduce((n, d) => n + ROUND_MIX[d] * POINTS[d], 0);
export const SPEED_BONUS = 0.5;
/** Answers saved / submitted up to this long after the time limit still count (network slack). */
export const GRACE_MS = 60_000;

export function computeScore(correct: Record<Difficulty, number>, seconds: number, limitSeconds: number) {
  const base = (Object.keys(POINTS) as Difficulty[]).reduce((n, d) => n + (correct[d] ?? 0) * POINTS[d], 0);
  const speed = Math.max(0, 1 - Math.min(seconds, limitSeconds) / limitSeconds);
  const bonus = Math.round(base * SPEED_BONUS * speed);
  return { base, bonus, score: base + bonus };
}

const DAY = 86_400_000;

/** Week id = its Monday (UTC) as "YYYY-MM-DD". */
export function weekId(now: number): string {
  const d = new Date(now);
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  const monday = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - dow * DAY;
  return new Date(monday).toISOString().slice(0, 10);
}

export function weekStart(id: string): number {
  return Date.parse(`${id}T00:00:00Z`);
}

export function weekEnd(id: string): number {
  return weekStart(id) + 7 * DAY;
}

export function shiftWeek(id: string, n: number): string {
  return new Date(weekStart(id) + n * 7 * DAY).toISOString().slice(0, 10);
}

/** "Nov 9 – 15" / "Nov 30 – Dec 6" */
export function weekLabel(id: string): string {
  const a = new Date(weekStart(id));
  const b = new Date(weekEnd(id) - DAY);
  const f = (d: Date, month: boolean) => d.toLocaleDateString("en-US", { ...(month ? { month: "short" } : {}), day: "numeric", timeZone: "UTC" });
  return `${f(a, true)} – ${f(b, a.getUTCMonth() !== b.getUTCMonth())}`;
}

/** A question as sent to a participant: no answer, no explanation. */
export interface CompetitionQuestion {
  id: string;
  section: SectionId;
  difficulty: Difficulty;
  type: "mcq" | "spr";
  passage?: string;
  prompt: string;
  table?: { caption?: string; headers: string[]; rows: string[][] };
  figure?: { src: string };
  choices?: Record<"A" | "B" | "C" | "D", string>;
  choicesImage?: string;
  choiceImages?: Partial<Record<"A" | "B" | "C" | "D", string>>;
}

/** After submitting: the correct answers and explanations. */
export interface ReviewItem {
  id: string;
  answer: string | string[];
  explanation: string;
  correct: boolean;
}

export interface LeaderRow {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  score: number;
  /** Correct answers (of ROUND_SIZE per round). */
  correct: number;
  seconds: number;
  /** Rounds finished (overall board). */
  rounds: number;
}

/** A leaderboard row as the browser sees it. */
export type PublicRow = Omit<LeaderRow, "userId"> & { me: boolean };

export interface Board {
  total: number;
  top: PublicRow[];
  me: PublicRow | null;
}

export interface MyRound {
  round: RoundId;
  status: "none" | "running" | "done";
  startedAt?: number;
  endsAt?: number;
  score?: number;
  base?: number;
  bonus?: number;
  correct?: Record<Difficulty, number>;
  seconds?: number;
  rank?: number;
}
