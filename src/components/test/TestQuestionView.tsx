"use client";

import { RichText } from "@/components/RichText";
import { ChoiceRow, DataTable, Figure, type ChoiceState } from "@/components/bank/QuestionCard";
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
  const twoColumn = !math && Boolean(q.passage || q.table || q.figure);
  const correct = isTestCorrect(q, response);

  const stimulus = (
    <div className="space-y-5">
      {q.passage && (
        <div className="text-base leading-[1.75]">
          <RichText text={q.passage} math={math} />
        </div>
      )}
      {q.table && <DataTable table={q.table} math={math} />}
      {q.figure && <Figure src={q.figure.src} />}
    </div>
  );

  const answerArea = (
    <div className="space-y-5">
      {math && (q.table || q.figure) && stimulus}
      {math && q.passage && (
        <div className="text-base leading-relaxed">
          <RichText text={q.passage} math />
        </div>
      )}
      <div className="text-base leading-relaxed font-medium">
        <RichText text={q.prompt} math={math} />
      </div>

      {q.type === "mcq" ? (
        <div className="space-y-2.5">
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
      {!math && q.passage && <div className="mb-6">{stimulus}</div>}
      {answerArea}
    </div>
  );
}
