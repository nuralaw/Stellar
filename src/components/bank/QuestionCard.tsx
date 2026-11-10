"use client";

import { useEffect, useState } from "react";
import { RichText } from "@/components/RichText";
import { isCorrect } from "@/lib/answers";
import type { ChoiceLetter, Difficulty, Question } from "@/lib/types";

const LETTERS: ChoiceLetter[] = ["A", "B", "C", "D"];

export function DifficultyBadge({ d }: { d: Difficulty }) {
  const dots = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted capitalize">
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= dots ? "bg-accent" : "bg-line"}`} />
        ))}
      </span>
      {d}
    </span>
  );
}

function Figure({ src, caption, fullPage }: { src: string; caption?: string; fullPage?: boolean }) {
  return (
    <figure className="space-y-2">
      {caption && <figcaption className="text-sm font-semibold">{caption}</figcaption>}
      {/* Figures are scans on white; keep them on white in dark mode too. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption ?? (fullPage ? "Original question page with figure" : "Figure for this question")}
        loading="lazy"
        className="w-full rounded-lg border border-line bg-white p-2"
      />
    </figure>
  );
}

function DataTable({ table, math }: { table: NonNullable<Question["table"]>; math: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {table.caption && <caption className="mb-2 text-left font-semibold">{table.caption}</caption>}
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="border border-line bg-surface-2 px-3 py-2 text-left font-semibold">
                <RichText text={h} math={math} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="border border-line px-3 py-2">
                  <RichText text={c} math={math} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ChoiceState = "idle" | "selected" | "correct" | "wrong" | "dim";

function ChoiceButton({ letter, text, state, math, onSelect }: { letter: ChoiceLetter; text: string; state: ChoiceState; math: boolean; onSelect: () => void }) {
  const styles = {
    idle: "border-line bg-surface hover:border-muted",
    selected: "border-primary bg-primary-soft ring-1 ring-primary",
    correct: "border-success bg-success-soft",
    wrong: "border-danger bg-danger-soft",
    dim: "border-line bg-surface opacity-55",
  }[state];
  const badge = {
    idle: "border-line text-muted",
    selected: "border-primary bg-primary text-primary-ink",
    correct: "border-success bg-success text-surface",
    wrong: "border-danger bg-danger text-surface",
    dim: "border-line text-muted",
  }[state];
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={state === "correct" || state === "wrong" || state === "dim"}
      aria-pressed={state === "selected"}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${styles}`}
    >
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold ${badge}`}>{letter}</span>
      <span className="min-w-0 flex-1">{text ? <RichText text={text} math={math} /> : <span className="text-muted">Choice {letter} (see image above)</span>}</span>
    </button>
  );
}

/**
 * One question: stimulus, answer input, Check, feedback + explanation.
 * Mount with key={q.id} so state resets per question.
 */
export function QuestionCard({
  q,
  onAnswered,
  onNext,
  nextLabel,
}: {
  q: Question;
  /** Called once when the student checks an answer. */
  onAnswered: (correct: boolean) => void;
  onNext?: () => void;
  nextLabel: string;
}) {
  const [response, setResponse] = useState("");
  const [checked, setChecked] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const math = q.section === "math";
  const correct = checked && isCorrect(q, response);
  // R&W: passage / table / graph on the left, question on the right (like the real test).
  const twoColumn = !math && Boolean(q.passage || q.table || q.figure);

  const check = () => {
    if (checked || !response.trim()) return;
    setChecked(true);
    onAnswered(isCorrect(q, response));
  };

  // Keyboard: A–D choose, Enter checks / goes next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === "Enter") {
        if (e.target instanceof HTMLButtonElement || (typing && !(e.target as HTMLElement).dataset.answer)) return;
        e.preventDefault();
        if (checked) onNext?.();
        else check();
        return;
      }
      if (!typing && !checked && q.type === "mcq") {
        const l = e.key.toUpperCase();
        if ((LETTERS as string[]).includes(l)) setResponse(l);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const stimulus = (
    <div className="space-y-5">
      {q.passage && <RichText text={q.passage} math={math} />}
      {q.table && <DataTable table={q.table} math={math} />}
      {q.figure && <Figure {...q.figure} />}
    </div>
  );

  const answerArea = (
    <div className="space-y-5">
      {math && (q.table || q.figure) && stimulus}
      <div className="text-[15px] leading-relaxed font-medium">
        <RichText text={q.prompt} math={math} />
      </div>
      {q.sourceImage && !q.figure?.fullPage && (
        <div>
          <button type="button" onClick={() => setShowSource((v) => !v)} className="text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline">
            {showSource ? "Hide original" : "Formulas look off? View the original"}
          </button>
          {showSource && (
            <div className="mt-2">
              <Figure src={q.sourceImage} fullPage />
            </div>
          )}
        </div>
      )}

      {q.type === "mcq" ? (
        <div className="space-y-2.5">
          {q.choicesImage && <Figure src={q.choicesImage} caption="Answer choices" />}
          {LETTERS.map((l) => {
            let state: ChoiceState = response === l ? "selected" : "idle";
            if (checked) state = l === q.answer ? "correct" : response === l ? "wrong" : "dim";
            return <ChoiceButton key={l} letter={l} text={q.choices[l]} state={state} math={math} onSelect={() => setResponse(l)} />;
          })}
        </div>
      ) : (
        <div>
          <label htmlFor="spr" className="text-sm font-medium text-muted">
            Your answer
          </label>
          <input
            id="spr"
            data-answer="1"
            inputMode="decimal"
            autoComplete="off"
            value={response}
            disabled={checked}
            onChange={(e) => setResponse(e.target.value.slice(0, 7))}
            placeholder="e.g. 12, 3.5, or 3/4"
            className={`mt-2 block w-48 rounded-xl border bg-surface px-4 py-3 font-mono text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
              checked ? (correct ? "border-success bg-success-soft" : "border-danger bg-danger-soft") : "border-line"
            }`}
          />
          <p className="mt-2 text-xs text-muted">Enter a number, decimal, or fraction. Negative answers are allowed.</p>
        </div>
      )}

      {!checked ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={check}
            disabled={!response.trim()}
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
          {onNext && (
            <button type="button" onClick={onNext} className="rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:text-ink">
              Skip
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`rounded-2xl border p-5 ${correct ? "border-success/40 bg-success-soft" : "border-danger/40 bg-danger-soft"}`} role="status">
            <p className={`font-semibold ${correct ? "text-success" : "text-danger"}`}>
              {correct ? "Correct!" : `Not quite — the correct answer is ${q.type === "mcq" ? q.answer : q.answer[0]}.`}
            </p>
            <div className="mt-3 text-[15px] leading-relaxed">
              <RichText text={q.explanation} math={math} />
            </div>
          </div>
          {onNext && (
            <button type="button" onClick={onNext} autoFocus className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
              {nextLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (twoColumn)
    return (
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-0">
        <div className="rounded-2xl border border-line bg-surface p-6 text-[15px] leading-relaxed lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:rounded-r-none">
          {stimulus}
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6 lg:rounded-l-none lg:border-l-0">{answerArea}</div>
      </div>
    );
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      {!math && q.passage && <div className="mb-5 text-[15px] leading-relaxed">{stimulus}</div>}
      {answerArea}
    </div>
  );
}
