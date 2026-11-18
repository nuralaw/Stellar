"use client";

import { Fragment, useEffect, useRef } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { ExampleLine } from "@/lib/lesson-format";
import { inline } from "./Markdown";

/** Text with single line breaks kept. */
export function Lines({ text }: { text: string }) {
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

const LETTERS = ["A", "B", "C", "D"];
const PUNCT = /([,;:.!?—–])/;

/** Short choices (words and punctuation, like "stopped;") are set in monospace with the marks picked out. */
const shortChoices = (choices: string[]) => choices.every((c) => c.length <= 28 && c.split(/\s+/).length <= 3 && !/[*`[]/.test(c));

/**
 * An example's answer choices as lettered chips in a row that wraps. Choices that are a word or two plus punctuation
 * ("stopped," "stopped;") are shown in monospace with the punctuation mark highlighted, so the difference is obvious.
 */
export function ChoiceChips({ choices }: { choices: string[] }) {
  const mono = shortChoices(choices);
  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Answer choices">
      {choices.map((c, i) => (
        <li key={i} className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-line bg-surface px-2 py-1.5 pr-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold text-muted" aria-hidden="true">
            {LETTERS[i]}
          </span>
          <span className={`min-w-0 text-[15px] leading-snug font-semibold text-ink ${mono ? "font-mono" : ""}`}>
            <span className="sr-only">{LETTERS[i]}: </span>
            {mono
              ? c.split(PUNCT).map((part, j) =>
                  PUNCT.test(part) ? (
                    <span key={j} className="mx-px rounded bg-primary-soft px-0.5 text-[1.1em] font-bold text-primary">
                      {part}
                    </span>
                  ) : (
                    <Fragment key={j}>{part}</Fragment>
                  ),
                )
              : inline(c)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The lesson's one worked example. Lines appear one at a time (the player's bottom bar reveals the next one);
 * the last line is the answer. Hidden lines show as faint placeholders so the student sees how far it goes.
 */
export function Example({ prompt, choices, lines, shown }: { prompt: string; choices: string[]; lines: ExampleLine[]; shown: number }) {
  // Keep a newly opened line in view (long examples on a phone), but don't scroll on first render.
  const latest = useRef<HTMLLIElement>(null);
  const before = useRef(shown);
  useEffect(() => {
    if (shown > before.current) latest.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    before.current = shown;
  }, [shown]);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line bg-surface-2/40 px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">Example</p>
        <div className="mt-1.5 text-[17px] leading-relaxed font-semibold text-ink">
          <Lines text={prompt} />
        </div>
        {choices.length > 0 && <ChoiceChips choices={choices} />}
      </div>
      <ol className="relative px-4 py-4 sm:px-6 sm:py-5">
        {lines.map((l, i) => {
          const last = i === lines.length - 1;
          const open = i < shown;
          return (
            <li key={i} ref={i === shown - 1 ? latest : undefined} className="relative flex scroll-mb-28 gap-3.5 pb-4 last:pb-0">
              {/* connector to the next line */}
              {!last && <span aria-hidden="true" className={`absolute top-8 bottom-0 left-[13px] w-0.5 rounded-full transition-colors duration-500 ${i + 1 < shown ? "bg-primary/40" : "bg-line"}`} />}
              <span
                className={`relative z-[1] grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold tabular-nums transition-colors duration-300 ${
                  !open ? "bg-surface-2 text-muted" : last ? "lesson-pop bg-primary text-primary-ink" : "bg-primary-soft text-primary"
                }`}
              >
                {open && last ? <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              {open ? (
                <div className={`lesson-in min-w-0 flex-1 ${last ? "-my-1 rounded-xl bg-primary-soft px-3 py-1.5" : "pt-0.5"}`}>
                  <p className={`text-[16px] leading-relaxed font-semibold ${last ? "text-primary" : "text-ink"}`}>{inline(l.text)}</p>
                  {l.note && <p className="mt-0.5 text-sm leading-relaxed text-muted">{inline(l.note)}</p>}
                </div>
              ) : (
                <div aria-hidden="true" className="flex-1 space-y-2 pt-2">
                  <div className="h-3 w-2/3 rounded-full bg-surface-2" />
                  <div className="h-2.5 w-1/3 rounded-full bg-surface-2/70" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
