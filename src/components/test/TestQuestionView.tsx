"use client";

import { RichText } from "@/components/RichText";
import { ChoiceRow, DataTable, Figure, type ChoiceState } from "@/components/bank/QuestionCard";
import { Highlightable } from "@/components/bank/Highlighter";
import type { ChoiceLetter } from "@/lib/types";
import type { TestQuestion } from "@/lib/test-types";
import { isTestCorrect } from "@/lib/test-score";

const LETTERS: ChoiceLetter[] = ["A", "B", "C", "D"];

/**
 * One practice-test question. While testing: pick / cross out (no feedback). In review mode (`review`), shows the
 * student's response against the correct answer, plus the explanation.
 */
export function TestQuestionView({
  q,
  response,
  struck = [],
  onRespond,
  onStrike,
  review = false,
}: {
  q: TestQuestion;
  response: string | undefined;
  struck?: ChoiceLetter[];
  onRespond?: (r: string) => void;
  onStrike?: (l: ChoiceLetter) => void;
  review?: boolean;
}) {
  const math = q.section === "math";
  // Text, tables and pictures on the left, the question on the right (math has no passages).
  const twoColumn = Boolean(q.table || q.figure || (!math && q.passage));
  // Highlight key: the question key repeats across tests ("rw1-01"), so add a bit of its text.
  const hk = `test:${q.key}:${(q.passage ?? q.prompt).slice(0, 32)}`;
  const correct = isTestCorrect(q, response);

  const stimulus = (
    <div className="space-y-5">
      {q.passage &&
        (math ? (
          <div className="text-base leading-[1.75]">
            <RichText text={q.passage} math />
          </div>
        ) : (
          <Highlightable hkey={`${hk}:passage`} className="text-base leading-[1.75]">
            <RichText text={q.passage} math={false} />
          </Highlightable>
        ))}
      {q.table && <DataTable table={q.table} math={math} />}
      {q.figure && <Figure src={q.figure.src} />}
    </div>
  );

  const answerArea = (
    <div className="space-y-5">
      {math && !twoColumn && q.passage && (
        <div className="text-base leading-relaxed">
          <RichText text={q.passage} math />
        </div>
      )}
      {math ? (
        <div className="text-base leading-relaxed font-medium">
          <RichText text={q.prompt} math />
        </div>
      ) : (
        <Highlightable hkey={`${hk}:prompt`} className="text-base leading-relaxed font-medium">
          <RichText text={q.prompt} math={false} />
        </Highlightable>
      )}

      {q.type === "mcq" ? (
        <div className="space-y-2.5">
          {q.choicesImage && <Figure src={q.choicesImage} caption="Answer choices" />}
          {LETTERS.map((l) => {
            let state: ChoiceState = response === l ? "selected" : "idle";
            if (review) state = l === q.answer ? "correct" : response === l ? "wrong" : "dim";
            return (
              <ChoiceRow
                key={l}
                letter={l}
                text={q.choices?.[l] ?? ""}
                image={q.choiceImages?.[l]}
                state={state}
                math={math}
                struck={struck.includes(l)}
                onSelect={() => onRespond?.(l)}
                onStrike={() => onStrike?.(l)}
              />
            );
          })}
        </div>
      ) : (
        <div>
          <label htmlFor={`spr-${q.key}`} className="text-sm font-semibold">
            Your answer
          </label>
          <input
            id={`spr-${q.key}`}
            data-answer="1"
            inputMode="decimal"
            autoComplete="off"
            value={response ?? ""}
            disabled={review}
            onChange={(e) => onRespond?.(e.target.value.replace(/[^\d./-]/g, "").slice(0, q.answer[0]?.startsWith("-") ? 6 : 5))}
            placeholder={review ? "No answer" : "e.g. 12, 3.5, 3/4"}
            className={`mt-2 block w-full max-w-56 rounded-xl border-[1.5px] px-4 py-3 font-mono text-xl outline-none transition-shadow focus:border-primary focus:ring-3 focus:ring-primary/15 ${
              review ? (correct ? "border-success bg-success-soft" : "border-danger bg-danger-soft") : "border-line bg-surface"
            }`}
          />
          {!review && <p className="mt-2 text-xs text-muted">Up to 5 characters (6 for a negative answer): a number, decimal, or fraction.</p>}
        </div>
      )}

      {review && (
        <div className={`overflow-hidden rounded-2xl border ${correct ? "border-success/40" : "border-danger/40"}`}>
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 sm:px-5 ${correct ? "bg-success-soft" : "bg-danger-soft"}`}>
            <p className={`font-semibold ${correct ? "text-success" : "text-danger"}`}>{correct ? "Correct" : response ? "Incorrect" : "Not answered"}</p>
            {!correct && (
              <p className="text-sm text-muted">
                Correct answer: <span className="font-semibold text-ink">{typeof q.answer === "string" ? q.answer : q.answer.join(" or ")}</span>
              </p>
            )}
          </div>
          <div className="bg-surface px-4 py-4 sm:px-5">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Explanation</p>
            <div className="mt-2 text-[15px] leading-relaxed">
              {q.explanation ? <RichText text={q.explanation} math={math} /> : <span className="text-muted">The explanation for this test hasn&apos;t been written yet.</span>}
            </div>
            {q.unsure && <p className="mt-3 text-xs text-muted">This answer is still being double-checked.</p>}
          </div>
        </div>
      )}
    </div>
  );

  if (twoColumn)
    return (
      <div className="grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-2">
        <div className="border-b border-line p-4 sm:p-6 md:p-8 lg:max-h-[calc(100vh-13rem)] lg:overflow-y-auto lg:border-r lg:border-b-0">{stimulus}</div>
        <div className="p-4 sm:p-6 md:p-8">{answerArea}</div>
      </div>
    );
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6 md:p-8">
      {answerArea}
    </div>
  );
}
