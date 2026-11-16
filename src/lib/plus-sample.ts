import { computeStats } from "./stats";
import { DOMAINS } from "./taxonomy";
import type { Attempt, TestResult } from "./store";

// Deterministic sample data for the "Example" previews on /plus (never a student's real numbers).

/** Fixed clock for the sample (same output on server and browser). */
export const SAMPLE_NOW = Date.UTC(2026, 10, 1, 12);
// [skill id, answered, correct] → weak list: Boundaries 48%, Nonlinear functions 55%, Inferences 58%, Percentages 64%, Transitions 69%.
const SKILLS: [string, number, number][] = [
  ["boundaries", 25, 12],
  ["nonlinear-functions", 20, 11],
  ["inferences", 12, 7],
  ["percentages", 14, 9],
  ["transitions", 16, 11],
  ["words-in-context", 30, 25],
  ["linear-functions", 22, 19],
  ["central-ideas", 20, 16],
  ["circles", 8, 6],
];
export const SAMPLE_ATTEMPTS: Attempt[] = SKILLS.flatMap(([skill, answered, correct], si) => {
  const d = DOMAINS.find((x) => x.skills.some((s) => s.id === skill))!;
  return Array.from({ length: answered }, (_, i) => ({
    qid: `sample-${skill}-${i}`,
    section: d.section,
    domain: d.id,
    skill,
    difficulty: "medium" as const,
    correct: i < correct,
    at: SAMPLE_NOW - (si * 40 + i + 1) * 3_600_000,
  }));
});
export const SAMPLE_STATS = computeStats(SAMPLE_ATTEMPTS, SAMPLE_NOW);
export const SAMPLE_HISTORY: TestResult[] = [
  { id: "sample-1", at: SAMPLE_NOW - 21 * 86_400_000, total: 1250, rw: 620, math: 630, kind: "full" },
  { id: "sample-2", at: SAMPLE_NOW - 14 * 86_400_000, total: 1280, rw: 640, math: 640, kind: "full" },
  { id: "sample-3", at: SAMPLE_NOW - 7 * 86_400_000, total: 1310, rw: 650, math: 660, kind: "full" },
];
export const SAMPLE_TARGET = 1400;
/** = predictScore(SAMPLE_HISTORY) (avg of the three ±40). Used by the static hero card; keep in sync with SAMPLE_HISTORY. */
export const SAMPLE_SCORE = { score: 1280, lo: 1240, hi: 1320 };
