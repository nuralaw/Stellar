import type { SectionId } from "./taxonomy";
import type { SourceId } from "./sources";

export type Difficulty = "easy" | "medium" | "hard";
export type ChoiceLetter = "A" | "B" | "C" | "D";

/**
 * A question from the bank (content/bank/source + content/bank/answers, merged by scripts/bank-build.mjs).
 * Text is plain: math uses ^ exponent, _ subscript, sqrt( ), a/b; R&W may contain <u>underline</u>.
 */
interface QuestionBase {
  /** "rw-0001" / "m-0001". Never change once published (progress is stored by id). */
  id: string;
  section: SectionId;
  /** Who wrote it (see lib/sources.ts). */
  source: SourceId;
  domain: string;
  skill: string;
  difficulty: Difficulty;
  passage?: string;
  prompt: string;
  /** Data table shown with the question. */
  table?: { caption?: string; headers: string[]; rows: string[][] };
  /** Graph / diagram. fullPage = the whole original page image (figure wasn't extracted separately). */
  figure?: { src: string; caption?: string; fullPage?: boolean };
  /** Original page image, for checking transcribed formulas. */
  sourceImage?: string;
  explanation: string;
}

export interface MCQuestion extends QuestionBase {
  type: "mcq";
  /** Empty strings when the choices are only shown in choicesImage. */
  choices: Record<ChoiceLetter, string>;
  choicesImage?: string;
  answer: ChoiceLetter;
}

/** Student-produced response (grid-in). Any listed value (or a numeric equivalent) is accepted. */
export interface SPRQuestion extends QuestionBase {
  type: "spr";
  answer: string[];
}

export type Question = MCQuestion | SPRQuestion;

/** Row of content/bank/dist/index.json: [id, domain, skill, difficulty initial, text preview, source]. */
export type BankIndexRow = [id: string, domain: string, skill: string, difficulty: "e" | "m" | "h", preview: string, source: SourceId];

/** Live question counts: section → domain → skill → difficulty (content/bank/dist/counts.json). */
export interface BankCounts {
  total: number;
  rw: Record<string, Record<string, Record<Difficulty, number>>>;
  math: Record<string, Record<string, Record<Difficulty, number>>>;
}
