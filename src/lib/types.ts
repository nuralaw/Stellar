import type { SectionId } from "./taxonomy";

export type Difficulty = "easy" | "medium" | "hard";
export type ChoiceLetter = "A" | "B" | "C" | "D";

interface QuestionBase {
  /** Stable unique id, e.g. "m-alg-001". Never reuse or change once published. */
  id: string;
  section: SectionId;
  domain: string;
  skill: string;
  difficulty: Difficulty;
  /** Optional passage / table / context shown above the prompt. Supports $inline$ and $$block$$ math. */
  passage?: string;
  /** Second passage for Cross-Text Connections. */
  passage2?: string;
  prompt: string;
  /** Step-by-step explanation shown after answering. */
  explanation: string;
}

/** Multiple choice (A–D). */
export interface MCQuestion extends QuestionBase {
  type: "mcq";
  choices: Record<ChoiceLetter, string>;
  answer: ChoiceLetter;
}

/** Student-produced response (math grid-in). Any listed answer is accepted, e.g. ["3/4", ".75", "0.75"]. */
export interface SPRQuestion extends QuestionBase {
  type: "spr";
  answer: string[];
}

export type Question = MCQuestion | SPRQuestion;
