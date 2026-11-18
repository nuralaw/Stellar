import "server-only";
import { getIndex } from "./bank";
import { freeTestIds } from "./free-tests";
import { getLesson, getLessons, type Lesson } from "./lessons";
import { DOMAINS } from "./taxonomy";
import { MODULE_INFO, MONTHS, fmtMinutes, minutesOf, monthsLabel, questionCount, testName, type TestIndexRow } from "./test-types";
import { getTestIndex } from "./tests";
import { getVocabWords } from "./vocab";

// Numbers shown on /plus and the lock pages, all computed from the data (never typed in by hand).

export interface TestTile {
  id: string;
  month: string;
  year: number;
  where: "International" | "US";
  form: string;
  rwOnly: boolean;
  questions: number;
  minutes: string;
}
export interface FreeRow {
  id: string;
  name: string;
  questions: number;
  minutes: string;
  full: boolean;
}
export interface TestFacts {
  total: number;
  full: number;
  rwOnly: number;
  free: number;
  plusOnly: number;
  firstYear: number;
  lastYear: number;
  questions: number;
  allReviewed: boolean;
  rwMin: number;
  mathMin: number;
  freeLabel: string;
  freeRows: FreeRow[];
  newestFreeFullId: string | null;
  /** The 4 newest Plus-only rows. */
  tiles: TestTile[];
}

const recency = (t: Pick<TestIndexRow, "year" | "month">) => t.year * 12 + t.month;

export function testFacts(index: TestIndexRow[] = getTestIndex()): TestFacts {
  const freeIds = freeTestIds(index);
  const byNewest = (a: TestIndexRow, b: TestIndexRow) => recency(b) - recency(a);
  const freeRows = index
    .filter((t) => freeIds.has(t.id))
    .sort(byNewest)
    .map((t) => ({ id: t.id, name: testName(t), questions: questionCount(t), minutes: fmtMinutes(minutesOf(t)), full: t.sections.length === 2 }));
  const tiles = index
    .filter((t) => !freeIds.has(t.id))
    .sort(byNewest)
    .slice(0, 4)
    .map((t) => ({
      id: t.id,
      month: MONTHS[t.month - 1],
      year: t.year,
      where: t.version === "US" ? ("US" as const) : ("International" as const),
      form: t.form,
      rwOnly: t.sections.length === 1,
      questions: questionCount(t),
      minutes: fmtMinutes(minutesOf(t)),
    }));
  const years = index.map((t) => t.year);
  return {
    total: index.length,
    full: index.filter((t) => t.sections.length === 2).length,
    rwOnly: index.filter((t) => t.sections.length === 1).length,
    free: freeRows.length,
    plusOnly: index.length - freeRows.length,
    firstYear: years.length ? Math.min(...years) : 0,
    lastYear: years.length ? Math.max(...years) : 0,
    questions: index.reduce((n, t) => n + questionCount(t), 0),
    allReviewed: index.every((t) => t.reviewed),
    rwMin: MODULE_INFO.rw1.minutes,
    mathMin: MODULE_INFO.math1.minutes,
    freeLabel: monthsLabel(index.filter((t) => freeIds.has(t.id))),
    freeRows,
    newestFreeFullId: freeRows.find((r) => r.full)?.id ?? null,
    tiles,
  };
}

export interface LessonBlocks {
  examples: number;
  quizzes: number;
  checks: number;
  desmos: number;
}
/** Block counts of one lesson (numbers only, safe to render on a lock page). */
export function lessonBlocks(l: Lesson): LessonBlocks {
  const out: LessonBlocks = { examples: 0, quizzes: 0, checks: 0, desmos: 0 };
  for (const s of l.steps) {
    const t = s.block?.t;
    if (t === "example") out.examples++;
    else if (t === "quiz") out.quizzes++;
    else if (t === "check") out.checks++;
    else if (t === "desmos") out.desmos++;
  }
  return out;
}

export interface LessonFacts {
  total: number;
  strategy: number;
  rw: number;
  math: number;
  minutes: number;
  examples: number;
  quizzes: number;
  checks: number;
  desmosLessons: number;
}
export function lessonFacts(): LessonFacts {
  const metas = getLessons();
  const out: LessonFacts = {
    total: metas.length,
    strategy: metas.filter((m) => m.section === "strategy").length,
    rw: metas.filter((m) => m.section === "rw").length,
    math: metas.filter((m) => m.section === "math").length,
    minutes: metas.reduce((n, m) => n + m.minutes, 0),
    examples: 0,
    quizzes: 0,
    checks: 0,
    desmosLessons: 0,
  };
  for (const m of metas) {
    const l = getLesson(m.slug);
    if (!l) continue;
    const b = lessonBlocks(l);
    out.examples += b.examples;
    out.quizzes += b.quizzes;
    out.checks += b.checks;
    if (b.desmos > 0) out.desmosLessons++;
  }
  return out;
}

export interface FreeFacts {
  /** College Board bank (free). */
  cbQuestions: number | null;
  /** General bank: past-paper and Stellar questions (Plus). */
  generalQuestions: number | null;
  vocabWords: number | null;
  skills: number;
}
/** ONLY call from static pages: /plus, and /register and /login via lib/auth-facts.ts (bank files are traced for /api routes only; this runs at build there). */
export function freeFacts(): FreeFacts {
  let cbQuestions: number | null = null;
  let generalQuestions: number | null = null;
  let vocabWords: number | null = null;
  try {
    const rows = getIndex();
    cbQuestions = rows.filter((row) => (row[5] ?? "cb") === "cb").length;
    generalQuestions = rows.length - cbQuestions;
  } catch {
    cbQuestions = null;
    generalQuestions = null;
  }
  try {
    vocabWords = getVocabWords().length;
  } catch {
    vocabWords = null;
  }
  return { cbQuestions, generalQuestions, vocabWords, skills: DOMAINS.flatMap((d) => d.skills).length };
}
