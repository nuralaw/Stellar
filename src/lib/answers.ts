import type { Question } from "./types";

/** Parses "7", "-2.5", ".75", "3/4", "-1/3" to a number; null if not a valid SAT grid-in style answer. */
export function parseNumeric(input: string): number | null {
  const s = input.replace(/\s+/g, "").replace(/−/g, "-");
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return Number(s);
  const frac = s.match(/^(-?)(\d+)\/(\d+)$/);
  if (frac && Number(frac[3]) !== 0) return (frac[1] ? -1 : 1) * (Number(frac[2]) / Number(frac[3]));
  return null;
}

/** Checks a student response. MCQ: choice letter. SPR: numeric equality with any accepted answer. */
export function isCorrect(q: Question, response: string): boolean {
  if (q.type === "mcq") return response === q.answer;
  const value = parseNumeric(response);
  if (value === null) return false;
  return q.answer.some((a) => {
    const target = parseNumeric(a);
    return target !== null && Math.abs(target - value) < 1e-4;
  });
}
