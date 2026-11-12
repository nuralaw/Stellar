"use client";

import { Fragment } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { QuizOption } from "@/lib/lesson-format";
import { inline } from "./Markdown";

const LETTERS = ["A", "B", "C", "D"];

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

/**
 * A lesson quiz. Controlled by the player: `selected` is the option being considered, `picked` the checked answer
 * (null until Check). The Check / Continue buttons live in the player's bottom bar.
 */
export function Quiz({
  prompt,
  options,
  explain,
  selected,
  picked,
  onSelect,
}: {
  prompt: string;
  options: QuizOption[];
  explain: string[];
  selected: number | null;
  picked: number | null;
  onSelect: (i: number) => void;
}) {
  const checked = picked !== null;
  const right = options.findIndex((o) => o.correct);
  const ok = checked && options[picked]?.correct;
  const feedback = checked ? options[picked]?.feedback : undefined;

  return (
    <div className="mt-8 rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="text-[16px] leading-relaxed font-medium text-ink">
        <Lines text={prompt} />
      </div>

      <div className="mt-5 space-y-2.5" role="radiogroup">
        {options.map((o, i) => {
          const state = checked ? (i === right ? "correct" : i === picked ? "wrong" : "dim") : i === selected ? "selected" : "idle";
          const box = {
            idle: "border-line bg-surface hover:border-primary/50 hover:bg-primary-soft/40",
            selected: "border-primary bg-primary-soft ring-1 ring-primary",
            correct: "border-success bg-success-soft ring-1 ring-success",
            wrong: "border-danger bg-danger-soft ring-1 ring-danger",
            dim: "border-line bg-surface opacity-60",
          }[state];
          const badge = {
            idle: "border-line text-muted group-hover:border-primary/60 group-hover:text-primary",
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
              disabled={checked}
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

      {checked && (
        <div className={`lesson-in mt-5 overflow-hidden rounded-xl border ${ok ? "border-success/40" : "border-danger/40"}`} role="status">
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 ${ok ? "bg-success-soft" : "bg-danger-soft"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-surface ${ok ? "bg-success" : "bg-danger"}`}>
              <Icon d={ok ? I.check : I.x} className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className={`font-semibold ${ok ? "text-success" : "text-danger"}`}>{ok ? "Correct!" : `Not quite — the answer is ${LETTERS[right]}`}</p>
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
        </div>
      )}
    </div>
  );
}
