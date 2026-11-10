// Estimated SAT score from practice answers (until the practice test gives real scores).
// Per section: a Rasch (1-parameter IRT) ability estimate from the most recent answers, where harder
// questions say more, pulled toward the middle by a prior so a handful of answers can't give 800.
// Ability maps to 200–800 per section; total = R&W + Math (400–1600).

import type { Attempt } from "./store";
import type { SectionId } from "./taxonomy";

const DIFFICULTY = { easy: -1.2, medium: 0, hard: 1.2 } as const;
const WINDOW = 80; // recent answers per section that count
const SCALE = 125; // section points per unit of ability

function ability(list: Attempt[]): number {
  let theta = 0;
  for (let it = 0; it < 25; it++) {
    // MAP with a standard normal prior: maximize Σ log P(answer) − θ²/2 (Newton steps).
    let grad = -theta;
    let hess = -1;
    for (const a of list) {
      const p = 1 / (1 + Math.exp(-(theta - DIFFICULTY[a.difficulty])));
      grad += (a.correct ? 1 : 0) - p;
      hess -= p * (1 - p);
    }
    const step = grad / hess;
    theta -= step;
    if (Math.abs(step) < 1e-4) break;
  }
  return theta;
}

export function sectionScore(list: Attempt[]): number {
  const s = 500 + SCALE * ability(list.slice(-WINDOW));
  return Math.min(800, Math.max(200, Math.round(s / 10) * 10));
}

export interface ScorePoint {
  /** Local day "YYYY-MM-DD". */
  day: string;
  total: number;
  rw: number;
  math: number;
  /** Answers given that day. */
  answered: number;
}

const dayOf = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** One point per study day: the estimate using every answer up to the end of that day. */
export function scoreHistory(attempts: Attempt[]): ScorePoint[] {
  const sorted = [...attempts].sort((a, b) => a.at - b.at);
  const out: ScorePoint[] = [];
  const bySection: Record<SectionId, Attempt[]> = { rw: [], math: [] };
  let answered = 0;
  sorted.forEach((a, i) => {
    bySection[a.section].push(a);
    answered++;
    const day = dayOf(a.at);
    const last = i === sorted.length - 1 || dayOf(sorted[i + 1].at) !== day;
    if (!last) return;
    const rw = sectionScore(bySection.rw);
    const math = sectionScore(bySection.math);
    out.push({ day, total: rw + math, rw, math, answered });
    answered = 0;
  });
  return out;
}
