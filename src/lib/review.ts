// Mistakes notebook + spaced repetition, derived from the attempt log (no extra storage).
//
// A question enters the notebook when you answer it wrong. It comes back 1 day later; answer it right on/after
// the due day and the next gap is 3 days, then 7. A right answer at the 7-day step masters it. A wrong answer
// at any point starts over at 1 day. Right answers before the due day don't move the schedule (no cramming credit).

import type { Attempt } from "./store";
import { localDay } from "./stats";
import type { SectionId } from "./taxonomy";

export const INTERVALS = [1, 3, 7] as const; // days

export interface MistakeCard {
  qid: string;
  section: SectionId;
  /** 0, 1 or 2: index into INTERVALS for the current wait. */
  stage: number;
  /** Local day "YYYY-MM-DD" when it's due again. */
  dueDay: string;
  /** Times answered wrong. */
  wrong: number;
  /** Unix ms of the latest attempt. */
  lastAt: number;
}

export interface ReviewQueue {
  /** Due today or overdue, oldest due first. */
  due: MistakeCard[];
  /** Waiting for a later day, soonest first. */
  upcoming: MistakeCard[];
  /** Answered right at every step. */
  mastered: MistakeCard[];
}

/** Question-bank questions only (practice-test attempts are "testId:key" and have their own review). */
export const isBankQid = (qid: string) => !qid.includes(":");

function addDays(at: number, days: number) {
  const d = new Date(at);
  d.setDate(d.getDate() + days);
  return localDay(d.getTime());
}

export function reviewQueue(attempts: Attempt[], now: number): ReviewQueue {
  const cards = new Map<string, MistakeCard & { mastered: boolean }>();
  // Attempts are appended in time order; sort anyway so imports/merges can't break the schedule.
  const sorted = [...attempts].sort((a, b) => a.at - b.at);
  for (const a of sorted) {
    if (!isBankQid(a.qid)) continue;
    const c = cards.get(a.qid);
    if (!a.correct) {
      cards.set(a.qid, { qid: a.qid, section: a.section, stage: 0, dueDay: addDays(a.at, INTERVALS[0]), wrong: (c?.wrong ?? 0) + 1, lastAt: a.at, mastered: false });
      continue;
    }
    if (!c || c.mastered) continue;
    c.lastAt = a.at;
    if (localDay(a.at) < c.dueDay) continue; // early: no credit
    if (c.stage + 1 >= INTERVALS.length) c.mastered = true;
    else {
      c.stage += 1;
      c.dueDay = addDays(a.at, INTERVALS[c.stage]);
    }
  }

  const today = localDay(now);
  const out: ReviewQueue = { due: [], upcoming: [], mastered: [] };
  for (const { mastered, ...c } of cards.values()) {
    if (mastered) out.mastered.push(c);
    else if (c.dueDay <= today) out.due.push(c);
    else out.upcoming.push(c);
  }
  out.due.sort((a, b) => a.dueDay.localeCompare(b.dueDay) || a.lastAt - b.lastAt);
  out.upcoming.sort((a, b) => a.dueDay.localeCompare(b.dueDay) || a.lastAt - b.lastAt);
  out.mastered.sort((a, b) => b.lastAt - a.lastAt);
  return out;
}

/** "today", "tomorrow", "in 3 days" for a due day. */
export function dueLabel(dueDay: string, now: number) {
  const today = localDay(now);
  if (dueDay <= today) return "due today";
  const [y, m, d] = dueDay.split("-").map(Number);
  const t = new Date(now);
  const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())) / 86_400_000);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}
