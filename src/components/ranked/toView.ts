import type { RankedQuestion, ReviewItem } from "@/lib/elo-api-types";
import type { TestQuestion } from "@/lib/test-types";
import type { ChoiceLetter, Difficulty } from "@/lib/types";

/** A match question (no answer while playing; with the answer and explanation in the review) -> the shape TestQuestionView renders. */
export function toView(q: RankedQuestion, key: string, n: number, difficulty: Difficulty, review?: ReviewItem): TestQuestion {
  return {
    key,
    section: q.section,
    module: 1,
    n,
    type: q.type,
    passage: q.passage,
    prompt: q.prompt,
    table: q.table,
    figure: q.figure ? { src: q.figure.src, w: 0, h: 0 } : undefined,
    choices: q.choices,
    choiceImages: q.choiceImages,
    choicesImage: q.choicesImage,
    answer: review ? (review.answer as TestQuestion["answer"]) : q.type === "mcq" ? ("" as ChoiceLetter) : [],
    domain: "",
    skill: "",
    difficulty,
    explanation: review?.explanation || undefined,
  };
}
