import type { Question } from "@/lib/types";
import { MATH_QUESTIONS } from "./math";
import { RW_QUESTIONS } from "./rw";

export const QUESTIONS: Question[] = [...RW_QUESTIONS, ...MATH_QUESTIONS];

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
