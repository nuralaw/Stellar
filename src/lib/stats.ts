import type { Attempt } from "./store";
import { DOMAINS, type SectionId } from "./taxonomy";

export interface Tally {
  answered: number;
  correct: number;
  /** 0–100, or null when nothing answered. */
  accuracy: number | null;
}

function tally(list: Attempt[]): Tally {
  const correct = list.filter((a) => a.correct).length;
  return { answered: list.length, correct, accuracy: list.length ? Math.round((correct / list.length) * 100) : null };
}

const dayKey = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/** Consecutive days with at least one answer, ending today (or yesterday, so a streak isn't lost before you study today). */
function streak(attempts: Attempt[], now: number): number {
  const days = new Set(attempts.map((a) => dayKey(a.at)));
  const d = new Date(now);
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(d.getTime()))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** `now` (Unix ms) is passed in so nothing reads the clock during server prerender. */
export function computeStats(attempts: Attempt[], now: number) {
  const bySection = Object.fromEntries(
    (["rw", "math"] as SectionId[]).map((s) => [s, tally(attempts.filter((a) => a.section === s))]),
  ) as Record<SectionId, Tally>;
  const byDomain = DOMAINS.map((d) => ({ domain: d, ...tally(attempts.filter((a) => a.domain === d.id)) }));
  // Weakest domain: lowest accuracy among domains with at least 3 answers.
  const weakest = byDomain
    .filter((d) => d.answered >= 3 && d.accuracy !== null)
    .sort((a, b) => a.accuracy! - b.accuracy!)[0];
  return {
    overall: tally(attempts),
    bySection,
    byDomain,
    weakest,
    streak: streak(attempts, now),
    today: attempts.filter((a) => dayKey(a.at) === dayKey(now)).length,
  };
}

/** Whole days from today (local) until a "YYYY-MM-DD" date; negative if past. */
export function daysUntil(date: string, now: Date): number {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
