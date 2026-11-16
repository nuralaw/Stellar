import type { ChoiceLetter, Difficulty } from "./types";
import type { SectionId } from "./taxonomy";

/** A question of a past-paper practice test (content/tests/dist/<id>.json, built by scripts/tests-build.mjs). */
export interface TestQuestion {
  /** "rw1-01", "m2-22": section + module + number. */
  key: string;
  section: SectionId;
  module: number;
  n: number;
  type: "mcq" | "spr";
  passage?: string;
  prompt: string;
  table?: { caption?: string; headers: string[]; rows: string[][] };
  figure?: { src: string; w: number; h: number };
  choices?: Record<ChoiceLetter, string>;
  /** Picture choices (graphs), per letter. */
  choiceImages?: Partial<Record<ChoiceLetter, string>>;
  /** All four choices as one picture. */
  choicesImage?: string;
  /** MCQ letter, or accepted grid-in values. */
  answer: ChoiceLetter | string[];
  domain: string;
  skill: string;
  /** Only on reviewed tests. */
  difficulty?: Difficulty;
  explanation?: string;
  /** The answer is uncertain (flagged for a human check). */
  unsure?: boolean;
}

/** Module id: "rw1" | "rw2" | "math1" | "math2". */
export type ModuleId = `${SectionId}${1 | 2}`;

export interface PracticeTest {
  id: string;
  /** "May 2024 INT A" */
  title: string;
  year: number;
  month: number;
  /** "INT" (international) | "US" */
  version: string;
  form: string;
  sections: SectionId[];
  /** Answers checked and explanations written. */
  reviewed: boolean;
  modules: Partial<Record<ModuleId, TestQuestion[]>>;
}

export type TestIndexRow = Omit<PracticeTest, "modules"> & { counts: Partial<Record<ModuleId, number>> };

export const MODULE_INFO: Record<ModuleId, { section: SectionId; n: 1 | 2; minutes: number; label: string }> = {
  rw1: { section: "rw", n: 1, minutes: 32, label: "Reading and Writing · Module 1" },
  rw2: { section: "rw", n: 2, minutes: 32, label: "Reading and Writing · Module 2" },
  math1: { section: "math", n: 1, minutes: 35, label: "Math · Module 1" },
  math2: { section: "math", n: 2, minutes: 35, label: "Math · Module 2" },
};

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "May 2024 · International · Form A" */
export function testName(t: Pick<PracticeTest, "year" | "month" | "version" | "form">, short = false) {
  const month = MONTHS[t.month - 1];
  const where = t.version === "US" ? "US" : short ? "Intl" : "International";
  return short ? `${month.slice(0, 3)} ${t.year} ${where} ${t.form}` : `${month} ${t.year} · ${where} · Form ${t.form}`;
}

export const questionCount = (t: Pick<TestIndexRow, "counts">) => Object.values(t.counts).reduce((a, b) => a + (b ?? 0), 0);
export const minutesOf = (t: Pick<TestIndexRow, "counts">) => (Object.keys(t.counts) as ModuleId[]).reduce((a, m) => a + (MODULE_INFO[m]?.minutes ?? 0), 0);
export const fmtMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);

/** "October and September 2026" / "January 2027 and December 2026" / "October 2026" for the distinct months of `rows`, newest first. */
export function monthsLabel(rows: ReadonlyArray<Pick<TestIndexRow, "year" | "month">>): string {
  const keys = [...new Set(rows.map((r) => r.year * 12 + (r.month - 1)))].sort((a, b) => b - a);
  const items = keys.map((k) => ({ y: Math.floor(k / 12), m: MONTHS[k % 12] }));
  if (items.length === 0) return "";
  const join = (parts: string[]) => (parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`);
  if (items.every((i) => i.y === items[0].y)) return `${join(items.map((i) => i.m))} ${items[0].y}`;
  return join(items.map((i) => `${i.m} ${i.y}`));
}
