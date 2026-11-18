import "server-only";
import { freeFacts, lessonFacts, testFacts, type FreeFacts, type LessonFacts, type TestFacts } from "./plus-facts";
import { getVocabWords } from "./vocab";

// Numbers and the sample word shown on /register and /login (Features and Pricing tabs). Static pages only
// (freeFacts reads the bank at build time). Every number comes from the data, never typed in by hand.

export interface AuthFacts {
  tests: TestFacts;
  lessons: LessonFacts;
  free: FreeFacts;
  /** cb + general questions; null if either is null. */
  questions: number | null;
  /** A real vocabulary word for the Features flashcard (first word whose id doesn't start with "m-"); null if the list can't be read. */
  word: { word: string; pos: string; def: string } | null;
}

export function authFacts(): AuthFacts {
  const free = freeFacts();
  const questions = free.cbQuestions === null || free.generalQuestions === null ? null : free.cbQuestions + free.generalQuestions;
  let word: AuthFacts["word"] = null;
  try {
    const w = getVocabWords().find((v) => !v.id.startsWith("m-"));
    word = w ? { word: w.word, pos: w.pos, def: w.def } : null;
  } catch {
    word = null;
  }
  return { tests: testFacts(), lessons: lessonFacts(), free, questions, word };
}
