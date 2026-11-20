"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { matchesAnswer, type DesmosMove, type QuizOption, type QuizWrong } from "@/lib/lesson-format";
import { DesmosDemo } from "./DesmosDemo";
import { inline } from "./Markdown";

const LETTERS = ["A", "B", "C", "D"];

/** Desmos used only as a calculator (no graph, point, slider or table): it checks, it isn't a faster route. */
const calcOnly = (moves: DesmosMove[]) =>
  moves.every((m) => m.a === "say" || m.a === "zoom" || (m.a === "type" && !/[xy]/.test(m.latex.replace(/\\[a-zA-Z]+/g, ""))));

/** Text with single line breaks kept (quiz questions can hold a short passage or two equations). */
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {inline(line)}
        </Fragment>
      ))}
    </>
  );
}

/** What the player tells the quiz after a first miss or an unreadable entry (shown under the question, not final). */
export interface QuizNote {
  /** A first wrong answer: the student tries once more. */
  kind: "retry";
  text?: string;
}

/**
 * A lesson quiz, multiple choice or typed (the SAT's student-produced response). Controlled by the player:
 * `result` is the final answer (null until the student is right or has missed twice), `selected` / `value` the
 * answer being prepared. A first miss shows `note` and lets the student try again. The Check / Continue buttons live
 * in the player's bottom bar. A quiz with a Desmos walkthrough plays it right after a final wrong answer (the
 * fastest way to the answer); after a right one it's a button.
 */
export function Quiz({
  prompt,
  options,
  answers,
  wrong,
  explain,
  desmos,
  selected,
  missed,
  result,
  note,
  hint,
  value,
  onSelect,
  onValue,
  onSubmit,
}: {
  prompt: string;
  options: QuizOption[];
  answers: string[];
  wrong: QuizWrong[];
  explain: string[];
  desmos: DesmosMove[];
  selected: number | null;
  /** Options already tried and wrong. */
  missed: number[];
  result: { r: string; ok: boolean } | null;
  note: QuizNote | null;
  /** The entry is not a number the SAT takes (not a try); shown under `note`. */
  hint: string | null;
  value: string;
  onSelect: (i: number) => void;
  onValue: (v: string) => void;
  onSubmit: () => void;
}) {
  const typed = answers.length > 0;
  const ok = Boolean(result?.ok);
  const picked = result && !typed ? Number(result.r) : null;
  const right = options.findIndex((o) => o.correct);
  const feedback = !result ? undefined : typed ? wrong.find((w) => matchesAnswer(result.r, [w.value]))?.feedback : options[picked ?? -1]?.feedback;
  const [showDesmos, setShowDesmos] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const checked = result !== null;

  // Typed quiz: put the cursor in the field (only with a physical keyboard; a phone would pop its keyboard open),
  // and again after a first miss, which empties it.
  useEffect(() => {
    if (typed && !checked && window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
  }, [typed, checked, note?.kind]);

  return (
    <div className="mt-8 rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="text-[16px] leading-relaxed font-medium text-ink">
        <Lines text={prompt} />
      </div>

      {typed ? (
        <div className="mt-5">
          <label htmlFor="quiz-answer" className="text-sm font-semibold">
            Your answer
          </label>
          <input
            id="quiz-answer"
            ref={input}
            // Not "decimal": iOS's decimal keypad has no "/" or "−", so fractions and negatives couldn't be typed.
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={result ? result.r : value}
            disabled={checked}
            maxLength={9}
            aria-invalid={hint ? true : undefined}
            aria-describedby="quiz-note"
            onChange={(e) => onValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="e.g. 12, 3.5, -3/4"
            className={`mt-2 block w-full max-w-56 rounded-xl border-[1.5px] px-4 py-3 font-mono text-xl outline-none transition-shadow focus:border-primary focus:ring-3 focus:ring-primary/15 ${
              checked ? (ok ? "border-success bg-success-soft" : "border-danger bg-danger-soft") : "border-line bg-surface"
            }`}
          />
          {!checked && <p className="mt-2 text-xs text-muted">Number, decimal or fraction. Negative answers are allowed.</p>}
        </div>
      ) : (
        <div className="mt-5 space-y-2.5" role="radiogroup">
          {options.map((o, i) => {
            const tried = missed.includes(i);
            const state = checked ? (i === right ? "correct" : i === picked || tried ? "wrong" : "dim") : tried ? "wrong" : i === selected ? "selected" : "idle";
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
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={i === (picked ?? selected)}
                disabled={checked || tried}
                onClick={() => onSelect(i)}
                className={`group flex min-h-13 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-[background-color,border-color,opacity] sm:px-4 ${box} ${state === "wrong" ? "lesson-shake" : ""}`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.5px] text-sm font-semibold transition-colors ${badge} ${state === "correct" ? "lesson-pop" : ""}`}>
                  {state === "correct" ? (
                    <Icon d={I.check} className="h-4 w-4" strokeWidth={2.8} />
                  ) : state === "wrong" ? (
                    <Icon d={I.x} className="h-4 w-4" strokeWidth={2.8} />
                  ) : (
                    LETTERS[i]
                  )}
                </span>
                <span className="min-w-0 flex-1 text-[15px] leading-relaxed">{inline(o.text)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* A first miss, or an entry the SAT does not take: said politely, without ending the quiz. */}
      <div aria-live="polite" id="quiz-note">
        {!checked && note && (
          <div className="lesson-in mt-5 flex items-start gap-3 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-danger text-surface">
              <Icon d={I.x} className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <div className="min-w-0 text-[15px] leading-relaxed">
              <p className="font-semibold text-danger">Not quite. Try once more.</p>
              {note.text && <p className="mt-0.5 font-medium text-ink">{inline(note.text)}</p>}
            </div>
          </div>
        )}
        {!checked && hint && (
          <div className="lesson-in mt-3 flex items-start gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-surface">
              <Icon d={I.undo} className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className="min-w-0 text-[15px] leading-relaxed font-medium text-ink">{hint}</p>
          </div>
        )}
      </div>

      {result && (
        <div className={`lesson-in mt-5 overflow-hidden rounded-xl border ${ok ? "border-success/40" : "border-danger/40"}`} role="status">
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 ${ok ? "bg-success-soft" : "bg-danger-soft"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-surface ${ok ? "bg-success" : "bg-danger"}`}>
              <Icon d={ok ? I.check : I.x} className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className={`font-semibold ${ok ? "text-success" : "text-danger"}`}>
              {ok ? "Correct!" : typed ? `Not quite — the answer is ${answers.map((a) => a.replace(/^-/, "−")).join(" or ")}` : `Not quite — the answer is ${LETTERS[right]}`}
            </p>
          </div>
          {(feedback || explain.length > 0) && (
            <div className="space-y-2.5 bg-surface px-4 py-3.5 text-[15px] leading-relaxed">
              {feedback && <p className="font-medium text-ink">{inline(feedback)}</p>}
              {explain.map((p, i) => (
                <p key={i} className="text-ink/85">
                  {inline(p)}
                </p>
              ))}
            </div>
          )}
          {desmos.length > 0 &&
            (ok && !showDesmos ? (
              <div className="border-t border-line bg-surface px-4 py-3">
                <button
                  type="button"
                  onClick={() => setShowDesmos(true)}
                  className="inline-flex items-center gap-2 rounded-lg px-1 text-sm font-semibold text-primary-strong hover:underline"
                >
                  <Icon d={I.calculator} className="h-4 w-4" />
                  See the fastest way in Desmos
                </button>
              </div>
            ) : (
              <div className="border-t border-line bg-surface p-3 sm:p-4">
                <DesmosDemo moves={desmos} label={calcOnly(desmos) ? "Check it in Desmos" : ok ? "In Desmos" : "Faster in Desmos"} reveal={!ok} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
