import type { Attempt } from "./store";
import { DOMAINS, type SectionId } from "./taxonomy";
import type { Difficulty } from "./types";

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

/** Local calendar day "YYYY-MM-DD" of a Unix ms time (the student's device time zone). */
export function localDay(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Consecutive days with at least one answer, ending today (or yesterday, so a streak isn't lost before you study today). */
function streak(days: Set<string>, now: number): number {
  const d = new Date(now);
  if (!days.has(localDay(d.getTime()))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(localDay(d.getTime()))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export interface DayStats {
  answered: number;
  correct: number;
  rw: number;
  math: number;
}

/** Questions answered per local day. */
export function byDay(attempts: Attempt[]): Map<string, DayStats> {
  const m = new Map<string, DayStats>();
  for (const a of attempts) {
    const k = localDay(a.at);
    const d = m.get(k) ?? { answered: 0, correct: 0, rw: 0, math: 0 };
    d.answered++;
    if (a.correct) d.correct++;
    d[a.section]++;
    m.set(k, d);
  }
  return m;
}

export type Mastery = "none" | "new" | "weak" | "fair" | "strong";

/** Skill status from accuracy, once there's enough to judge (3+ answers). */
export function mastery(t: Tally): Mastery {
  if (!t.answered) return "none";
  if (t.answered < 3 || t.accuracy === null) return "new";
  return t.accuracy >= 75 ? "strong" : t.accuracy >= 50 ? "fair" : "weak";
}

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

/** `now` (Unix ms) is passed in so nothing reads the clock during server prerender. */
export function computeStats(attempts: Attempt[], now: number) {
  const days = byDay(attempts);
  const sections = (["rw", "math"] as SectionId[]).map((s) => {
    const mine = attempts.filter((a) => a.section === s);
    // Questions per day for the last 14 days (oldest first).
    const recent = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (13 - i));
      const key = localDay(d.getTime());
      return { day: key, answered: days.get(key)?.[s] ?? 0 };
    });
    return {
      section: s,
      ...tally(mine),
      byDifficulty: DIFFS.map((d) => ({ difficulty: d, ...tally(mine.filter((a) => a.difficulty === d)) })),
      recent,
    };
  });
  const bySection = Object.fromEntries(sections.map((s) => [s.section, s])) as Record<SectionId, (typeof sections)[number]>;

  const byDomain = DOMAINS.map((d) => {
    const mine = attempts.filter((a) => a.domain === d.id);
    return { domain: d, ...tally(mine), skills: d.skills.map((s) => ({ skill: s, ...tally(mine.filter((a) => a.skill === s.id)) })) };
  });
  // Weakest domain: lowest accuracy among domains with at least 3 answers.
  const weakest = byDomain
    .filter((d) => d.answered >= 3 && d.accuracy !== null)
    .sort((a, b) => a.accuracy! - b.accuracy!)[0];
  // Weakest skills (3+ answers, below 75%), lowest accuracy first.
  const focus = byDomain
    .flatMap((d) => d.skills.map((s) => ({ ...s, domain: d.domain })))
    .filter((s) => s.answered >= 3 && s.accuracy !== null && s.accuracy < 75)
    .sort((a, b) => a.accuracy! - b.accuracy! || b.answered - a.answered)
    .slice(0, 3);
  return {
    overall: tally(attempts),
    bySection,
    byDomain,
    weakest,
    focus,
    days,
    streak: streak(new Set(days.keys()), now),
    today: days.get(localDay(now))?.answered ?? 0,
  };
}
