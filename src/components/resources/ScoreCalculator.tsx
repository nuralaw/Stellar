"use client";

import { useId, useState } from "react";
import { SCORE_DEFAULTS, SCORE_QUESTIONS, SECTION_SCORE, TOTAL_SCORE } from "@/lib/score-calculator";
import type { SectionId } from "@/lib/taxonomy";
import { scaledScore } from "@/lib/test-score";
import { CARD } from "./styles";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "rw", label: "Reading and Writing" },
  { id: "math", label: "Math" },
];

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, Math.trunc(n)));

/** Estimated SAT score from the number of correct answers (the curve in lib/test-score.ts). Renders a result on the server too. */
export function ScoreCalculator() {
  const [correct, setCorrect] = useState<Record<SectionId, number>>({ ...SCORE_DEFAULTS });
  // What is typed in a number field while it is being edited (it may be empty); null = show the value.
  const [draft, setDraft] = useState<Record<SectionId, string | null>>({ rw: null, math: null });
  const uid = useId();

  const slide = (id: SectionId, value: number) => {
    setCorrect((c) => ({ ...c, [id]: value }));
    setDraft((d) => ({ ...d, [id]: null }));
  };
  const type = (id: SectionId, raw: string) => {
    if (raw === "") {
      setCorrect((c) => ({ ...c, [id]: 0 }));
      setDraft((d) => ({ ...d, [id]: "" }));
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    const v = clamp(n, SCORE_QUESTIONS[id]);
    setCorrect((c) => ({ ...c, [id]: v }));
    setDraft((d) => ({ ...d, [id]: v === n ? raw : null }));
  };

  const scores = { rw: scaledScore("rw", correct.rw, SCORE_QUESTIONS.rw), math: scaledScore("math", correct.math, SCORE_QUESTIONS.math) };
  const total = scores.rw + scores.math;

  return (
    <div className={`${CARD} mt-8 grid gap-8 p-5 sm:p-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10 md:p-8`}>
      <div className="space-y-7">
        {SECTIONS.map(({ id, label }) => {
          const max = SCORE_QUESTIONS[id];
          return (
            <fieldset key={id} className="min-w-0">
              <legend className="text-lg font-bold tracking-tight">{label}</legend>
              <input
                type="range"
                min={0}
                max={max}
                step={1}
                value={correct[id]}
                onChange={(e) => slide(id, clamp(Number(e.target.value), max))}
                aria-label={`${label} correct answers, slider`}
                className="mt-4 h-6 w-full cursor-pointer accent-primary"
              />
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                <label htmlFor={`${uid}-${id}`} className="text-sm text-muted">
                  Correct answers
                </label>
                <input
                  id={`${uid}-${id}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={max}
                  step={1}
                  value={draft[id] ?? String(correct[id])}
                  onChange={(e) => type(id, e.target.value)}
                  onBlur={() => setDraft((d) => ({ ...d, [id]: null }))}
                  className="min-h-11 w-24 rounded-xl border border-line bg-surface px-3 py-2 text-center font-semibold tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
                />
                <span className="text-sm text-muted tabular-nums">of {max}</span>
              </div>
            </fieldset>
          );
        })}
      </div>

      <output aria-live="polite" className="block rounded-2xl bg-surface-2 p-5 text-center sm:p-6">
        <span className="block text-sm font-semibold text-muted">Estimated total score</span>
        <span className="mt-1 block text-6xl font-bold tracking-tight tabular-nums md:text-7xl">{total}</span>
        <span className="block text-sm text-muted tabular-nums">
          out of {TOTAL_SCORE.max} (lowest {TOTAL_SCORE.min})
        </span>
        <span className="mt-5 grid grid-cols-2 gap-3 text-left">
          {SECTIONS.map(({ id, label }) => (
            <span key={id} className="block rounded-xl bg-surface p-3 ring-1 ring-line">
              <span className="block text-xs font-semibold text-muted">{label}</span>
              <span className="block text-2xl font-bold tabular-nums">{scores[id]}</span>
              <span className="block text-xs text-muted tabular-nums">
                {SECTION_SCORE.min}–{SECTION_SCORE.max}
              </span>
            </span>
          ))}
        </span>
      </output>
    </div>
  );
}
