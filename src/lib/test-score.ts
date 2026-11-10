import { parseNumeric } from "./answers";
import type { TestQuestion } from "./test-types";
import type { SectionId } from "./taxonomy";

/** Checks a response against a practice-test question (MCQ letter, or numeric match for grid-ins). */
export function isTestCorrect(q: TestQuestion, response: string | undefined): boolean {
  if (!response) return false;
  if (typeof q.answer === "string") return response === q.answer;
  const v = parseNumeric(response);
  if (v === null) return false;
  return q.answer.some((a) => {
    const t = parseNumeric(a);
    return t !== null && Math.abs(t - v) < 1e-4;
  });
}

// Estimated raw → scaled (200–800) curves, modeled on the conversion tables published for the linear
// (non-adaptive) Digital SAT practice forms. Points are [share of questions correct, scaled score];
// scores in between are interpolated and rounded to 10. It's an estimate: real curves vary by form.
const CURVE: Record<SectionId, [number, number][]> = {
  rw: [
    [0, 200], [0.09, 260], [0.19, 340], [0.28, 400], [0.37, 450], [0.46, 490], [0.56, 530], [0.65, 580],
    [0.74, 630], [0.83, 680], [0.93, 740], [1, 800],
  ],
  math: [
    [0, 200], [0.11, 290], [0.23, 370], [0.34, 430], [0.45, 480], [0.57, 530], [0.68, 590], [0.8, 650],
    [0.91, 730], [1, 800],
  ],
};

export function scaledScore(section: SectionId, correct: number, total: number): number {
  if (total <= 0) return 200;
  const p = Math.min(1, Math.max(0, correct / total));
  const pts = CURVE[section];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (p <= x1) return Math.round((y0 + ((p - x0) / (x1 - x0)) * (y1 - y0)) / 10) * 10;
  }
  return 800;
}
