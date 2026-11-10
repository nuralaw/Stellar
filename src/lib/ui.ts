// Shared layout + study constants used across pages.

/** Content container for the main pages (Home, Question Bank, Practice tests, Compete): same width and left edge everywhere. */
export const PAGE = "mx-auto w-full max-w-6xl px-4 pt-8 pb-12 md:px-8 md:pt-12";

/** Daily practice goal (questions per day) shown on Home and in the Question Bank. */
export const DAILY_GOAL = 20;

/** Rough minutes per question (Digital SAT pace: ~71 s R&W, ~95 s Math). */
export const MIN_PER_Q = { rw: 1.2, math: 1.6 } as const;

/** "about 12 min" for n questions of a section. */
export function estMinutes(n: number, section: "rw" | "math" | "mixed" = "rw") {
  const per = section === "mixed" ? (MIN_PER_Q.rw + MIN_PER_Q.math) / 2 : MIN_PER_Q[section];
  return Math.max(1, Math.round(n * per));
}
