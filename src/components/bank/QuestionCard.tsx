"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RichText } from "@/components/RichText";
import { isCorrect } from "@/lib/answers";
import type { ChoiceLetter, Difficulty, Question } from "@/lib/types";
import { I, Icon } from "./icons";
import { Highlightable } from "./Highlighter";

const LETTERS: ChoiceLetter[] = ["A", "B", "C", "D"];

const DIFF_COLOR: Record<Difficulty, string> = { easy: "bg-success", medium: "bg-accent", hard: "bg-danger" };

export function DifficultyBadge({ d }: { d: Difficulty }) {
  const bars = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-muted capitalize" title={`Difficulty: ${d}`}>
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`w-[3px] rounded-full ${i <= bars ? DIFF_COLOR[d] : "bg-line"}`} style={{ height: 4 + i * 2 }} />
        ))}
      </span>
      {d}
    </span>
  );
}

export function Figure({ src, caption, fullPage }: { src: string; caption?: string; fullPage?: boolean }) {
  return (
    <figure className="space-y-2">
      {caption && <figcaption className="text-sm font-semibold">{caption}</figcaption>}
      {/* Figures are scans on white; keep them on white in dark mode too. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption ?? (fullPage ? "Original question page with figure" : "Figure for this question")}
        loading="lazy"
        className="mx-auto w-full max-w-2xl rounded-xl border border-line bg-white p-2"
      />
    </figure>
  );
}

export function DataTable({ table, math }: { table: NonNullable<Question["table"]>; math: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-sm">
        {table.caption && <caption className="border-b border-line bg-surface-2/60 px-3 py-2 text-left font-semibold">{table.caption}</caption>}
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="border-b border-line bg-surface-2 px-3 py-2 text-left font-semibold [&:not(:first-child)]:border-l">
                <RichText text={h} math={math} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i} className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-line">
              {r.map((c, j) => (
                <td key={j} className="border-line px-3 py-2 tabular-nums [&:not(:first-child)]:border-l">
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

export type ChoiceState = "idle" | "selected" | "correct" | "wrong" | "dim";

export function ChoiceRow({
  letter,
  text,
  image,
  state,
  math,
  struck,
  onSelect,
  onStrike,
}: {
  letter: ChoiceLetter;
  text: string;
  /** Picture choice (e.g. a graph), shown instead of text. */
  image?: string;
  state: ChoiceState;
  math: boolean;
  struck: boolean;
  onSelect: () => void;
  onStrike: () => void;
}) {
  const locked = state === "correct" || state === "wrong" || state === "dim";
  const box = {
    idle: "border-line bg-surface hover:border-primary/50 hover:bg-primary-soft/40",
    selected: "border-primary bg-primary-soft ring-1 ring-primary",
    correct: "border-success bg-success-soft ring-1 ring-success",
    wrong: "border-danger bg-danger-soft ring-1 ring-danger",
    dim: "border-line bg-surface opacity-60",
  }[state];
  const badge = {
    idle: "border-line text-muted group-hover:border-primary/60 group-hover:text-primary-strong",
    selected: "border-primary bg-primary text-primary-ink",
    correct: "border-success bg-success text-surface",
    wrong: "border-danger bg-danger text-surface",
    dim: "border-line text-muted",
  }[state];
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onSelect}
        disabled={locked}
        aria-pressed={state === "selected"}
        className={`group flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left sm:gap-3.5 sm:px-4 transition-[background-color,border-color,opacity] ${box} ${struck && !locked ? "opacity-45" : ""}`}
      >
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.5px] text-sm font-semibold transition-colors ${badge}`}>
          {state === "correct" ? <Icon d={I.check} className="h-4 w-4" strokeWidth={2.8} /> : state === "wrong" ? <Icon d={I.x} className="h-4 w-4" strokeWidth={2.8} /> : letter}
        </span>
        <span className={`min-w-0 flex-1 text-[15px] leading-relaxed ${struck && !locked ? "line-through decoration-2" : ""}`}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={`Choice ${letter}`} loading="lazy" className="max-h-56 max-w-full rounded-lg bg-white p-1" />
          ) : text ? (
            <RichText text={text} math={math} />
          ) : (
            <span className="text-muted">Choice {letter} (see image above)</span>
          )}
        </span>
      </button>
      {!locked && (
        <button
          type="button"
          onClick={onStrike}
          aria-pressed={struck}
          aria-label={struck ? `Undo cross out ${letter}` : `Cross out ${letter}`}
          title={struck ? "Undo cross out" : "Cross out this choice"}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold transition-colors ${
            struck ? "bg-surface-2 text-ink" : "text-muted/60 hover:bg-surface-2 hover:text-ink"
          }`}
        >
          {struck ? <Icon d={I.undo} className="h-4 w-4" /> : <span className="relative">
              {letter}
              <span className="absolute top-1/2 -right-1.5 -left-1.5 h-[1.5px] -rotate-12 bg-current" />
            </span>}
        </button>
      )}
    </div>
  );
}

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40";
export const btnGhost = "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent";

/**
 * One question: stimulus, answer input, Check and feedback + explanation. Its right-hand buttons (Skip / Check / Next)
 * are rendered into `actionsSlot`, a bar the parent keeps mounted across questions.
 * Mount with key={q.id} so state resets per question; pass `saved` to show an answer given earlier in the session.
 */
export function QuestionCard({
  q,
  saved,
  onAnswered,
  onNext,
  nextLabel,
  timeSpent,
  actionsSlot,
}: {
  q: Question;
  saved?: { response: string };
  /** Called once when the student checks an answer. */
  onAnswered: (correct: boolean, response: string) => void;
  onNext?: () => void;
  nextLabel: string;
  /** Seconds spent, shown in the feedback once answered. */
  timeSpent?: number;
  /** Where the Skip / Check answer / Next buttons go (the parent's action bar). */
  actionsSlot: HTMLElement | null;
}) {
  const [response, setResponse] = useState(saved?.response ?? "");
  const [checked, setChecked] = useState(Boolean(saved));
  const [struck, setStruck] = useState<Set<ChoiceLetter>>(new Set());
  const [showSource, setShowSource] = useState(false);
  const math = q.section === "math";
  const correct = checked && isCorrect(q, response);
  // Text, tables and pictures on the left, the question on the right (like the official questions).
  // Math has no passages; a table or figure goes left.
  const twoColumn = Boolean(q.table || q.figure || (!math && q.passage));

  const check = () => {
    if (checked || !response.trim()) return;
    setChecked(true);
    onAnswered(isCorrect(q, response), response);
  };
  const select = (l: ChoiceLetter) => {
    if (checked) return;
    setResponse(l);
    setStruck((s) => {
      if (!s.has(l)) return s;
      const n = new Set(s);
      n.delete(l);
      return n;
    });
  };
  const strike = (l: ChoiceLetter) => {
    setStruck((s) => {
      const n = new Set(s);
      if (n.has(l)) n.delete(l);
      else n.add(l);
      return n;
    });
    if (response === l) setResponse("");
  };

  // Keyboard: A–D choose, Shift+A–D cross out, Enter checks / goes next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as Element | null)?.closest?.("[data-calculator], [data-reference]")) return; // keys typed into Desmos
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;
      if (e.key === "Enter") {
        if (e.target instanceof HTMLButtonElement || (typing && !(e.target as HTMLElement).dataset.answer)) return;
        e.preventDefault();
        if (checked) onNext?.();
        else check();
        return;
      }
      if (!typing && !checked && q.type === "mcq") {
        const l = e.key.toUpperCase() as ChoiceLetter;
        if (!LETTERS.includes(l)) return;
        if (e.shiftKey) strike(l);
        else select(l);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const stimulus = (
    <div className="space-y-5">
      {q.passage &&
        (math ? (
          <div className="text-base leading-[1.75]">
            <RichText text={q.passage} math />
          </div>
        ) : (
          // R&W: select text to highlight / underline it, like Bluebook.
          <Highlightable hkey={`${q.id}:passage`} className="text-base leading-[1.75]">
            <RichText text={q.passage} math={false} />
          </Highlightable>
        ))}
      {q.table && <DataTable table={q.table} math={math} />}
      {q.figure && <Figure {...q.figure} />}
    </div>
  );

  const correctText = q.type === "mcq" ? q.answer : q.answer.join(" or ");
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const answerArea = (
    <div className="space-y-5">
      {math ? (
        <div className="text-base leading-relaxed font-medium">
          <RichText text={q.prompt} math />
        </div>
      ) : (
        <Highlightable hkey={`${q.id}:prompt`} className="text-base leading-relaxed font-medium">
          <RichText text={q.prompt} math={false} />
        </Highlightable>
      )}

      {q.type === "mcq" ? (
        <div className="space-y-2.5">
          {q.choicesImage && <Figure src={q.choicesImage} caption="Answer choices" />}
          {LETTERS.map((l) => {
            let state: ChoiceState = response === l ? "selected" : "idle";
            if (checked) state = l === q.answer ? "correct" : response === l ? "wrong" : "dim";
            return (
              <ChoiceRow key={l} letter={l} text={q.choices[l]} image={q.choiceImages?.[l]} state={state} math={math} struck={struck.has(l)} onSelect={() => select(l)} onStrike={() => strike(l)} />
            );
          })}
        </div>
      ) : (
        <div>
          <label htmlFor="spr" className="text-sm font-semibold">
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
            placeholder="e.g. 12, 3.5, -3/4"
            className={`mt-2 block w-full max-w-56 rounded-xl border-[1.5px] px-4 py-3 font-mono text-xl outline-none transition-shadow focus:border-primary focus:ring-3 focus:ring-primary/15 ${
              checked ? (correct ? "border-success bg-success-soft" : "border-danger bg-danger-soft") : "border-line bg-surface"
            }`}
          />
          <p className="mt-2 text-xs text-muted">Number, decimal, or fraction. Negative answers are allowed.</p>
        </div>
      )}

      {q.sourceImage && !q.figure?.fullPage && (
        <div>
          <button type="button" onClick={() => setShowSource((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink">
            <Icon d={showSource ? I.eyeOff : I.eye} className="h-3.5 w-3.5" />
            {showSource ? "Hide original" : "Formula looks off? View the original"}
          </button>
          {showSource && (
            <div className="mt-2">
              <Figure src={q.sourceImage} fullPage />
            </div>
          )}
        </div>
      )}

      {checked && (
        <div className={`overflow-hidden rounded-2xl border ${correct ? "border-success/40" : "border-danger/40"}`} role="status">
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3.5 sm:px-5 ${correct ? "bg-success-soft" : "bg-danger-soft"}`}>
            <span className={`grid h-7 w-7 place-items-center rounded-full text-surface ${correct ? "bg-success" : "bg-danger"}`}>
              <Icon d={correct ? I.check : I.x} className="h-4 w-4" strokeWidth={2.8} />
            </span>
            <p className={`font-semibold ${correct ? "text-success" : "text-danger"}`}>{correct ? "Correct!" : "Not quite"}</p>
            <p className="text-sm text-muted">
              {!correct && (
                <>
                  Correct answer: <span className="font-semibold text-ink">{correctText}</span>
                </>
              )}
              {timeSpent !== undefined && timeSpent > 0 && <span className={!correct ? "ml-3" : ""}>Time: {fmtTime(timeSpent)}</span>}
            </p>
          </div>
          <div className="bg-surface px-4 py-4 sm:px-5">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Explanation</p>
            <div className="mt-2 text-[15px] leading-relaxed">
              <RichText text={q.explanation} math={math} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const actions =
    actionsSlot &&
    createPortal(
      !checked ? (
        <>
          {onNext && (
            <button type="button" onClick={onNext} className={btnGhost}>
              Skip
            </button>
          )}
          <button type="button" onClick={check} disabled={!response.trim()} className={`${btnPrimary} min-w-36`}>
            Check answer
          </button>
        </>
      ) : (
        onNext && (
          <button type="button" onClick={onNext} autoFocus className={`${btnPrimary} min-w-36`}>
            {nextLabel}
            <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
          </button>
        )
      ),
      actionsSlot,
    );

  if (twoColumn)
    return (
      <div>
        <div className="grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-2">
          <div className="border-b border-line p-4 sm:p-6 md:p-8 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:border-r lg:border-b-0">{stimulus}</div>
          <div className="p-4 sm:p-6 md:p-8">{answerArea}</div>
        </div>
        {actions}
      </div>
    );
  return (
    <div>
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6 md:p-8">
        {answerArea}
      </div>
      {actions}
    </div>
  );
}
