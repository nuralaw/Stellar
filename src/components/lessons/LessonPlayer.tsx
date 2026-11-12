"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalculatorDock } from "@/components/CalculatorDock";
import { DifficultyBadge, QuestionCard } from "@/components/bank/QuestionCard";
import { I, Icon } from "@/components/bank/icons";
import { useFocusMode } from "@/lib/focus";
import type { Step } from "@/lib/lesson-format";
import { addAttempt, saveLessonProgress, useHydrated, useLessonProgress, type LessonProgress } from "@/lib/store";
import type { Question } from "@/lib/types";
import { estMinutes } from "@/lib/ui";
import { Markdown } from "./Markdown";
import { Quiz } from "./Quiz";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent";
const btnOutline = "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2";

export interface PlayerLesson {
  slug: string;
  title: string;
  section: "rw" | "math" | "strategy";
  /** "R&W · Craft and Structure" / "Start here". */
  where: string;
  minutes: number;
  steps: Step[];
  questions: Record<string, Question>;
  /** Practice link for this skill (null for strategy lessons). */
  practice: string | null;
  next: { slug: string; title: string } | null;
}

export function LessonPlayer({ lesson }: { lesson: PlayerLesson }) {
  useFocusMode();
  const { slug, steps, questions } = lesson;
  const n = steps.length;
  const hydrated = useHydrated();
  const saved: LessonProgress | undefined = useLessonProgress()[slug];
  // null = not moved yet in this visit: resume where the student left off (a finished lesson reopens at step 1).
  const [moved, setMoved] = useState<number | null>(null);
  const resume = saved && !saved.done ? Math.min(saved.step, n) : 0;
  const pos = moved ?? (hydrated ? resume : 0);
  const [sel, setSel] = useState<number | null>(null);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);

  // Answers are keyed by step index, so they only apply to the same version of the lesson.
  const picks = saved && saved.steps === n ? saved.picks : {};
  const step = pos < n ? steps[pos] : null;
  const block = step?.block ?? null;
  const question = block?.t === "check" ? questions[block.id] : undefined;
  const pick = picks[pos];
  // "Your turn: hard" → "Your turn"; the question's real difficulty shows as a badge.
  const title = step && block?.t === "check" ? step.title.replace(/^Your turn:.*$/, "Your turn") : (step?.title ?? "");
  const quizPicked = block?.t === "quiz" && pick ? Number(pick.r) : null;
  const hasMath = lesson.section === "math" || slug === "desmos";
  const showCalc = hasMath && calcOpen;
  const wide = Boolean(question && ((question.passage && question.section === "rw") || question.table || question.figure));

  const save = (patch: Partial<LessonProgress>) => {
    const base: LessonProgress = saved ?? { step: 0, max: 0, steps: n, picks: {}, at: Date.now() };
    saveLessonProgress(slug, { ...base, ...patch, steps: n, at: Date.now() });
  };

  const go = (i: number) => {
    const to = Math.max(0, Math.min(n, i));
    setMoved(to);
    setSel(null);
    const finished = to === n;
    save({ step: to, max: Math.max(saved?.max ?? 0, to), ...(finished && !saved?.done ? { done: Date.now() } : {}) });
    window.scrollTo({ top: 0 });
  };
  const next = () => go(pos + 1);
  const back = () => go(pos - 1);
  const restart = () => {
    setMoved(0);
    setSel(null);
    save({ step: 0, picks: {} });
    window.scrollTo({ top: 0 });
  };

  const checkQuiz = () => {
    if (block?.t !== "quiz" || sel === null || pick) return;
    save({ picks: { ...picks, [pos]: { r: String(sel), ok: Boolean(block.options[sel]?.correct) } } });
  };
  const answerCheck = (ok: boolean, response: string) => {
    if (!question) return;
    save({ picks: { ...picks, [pos]: { r: response, ok } } });
    addAttempt({ qid: question.id, section: question.section, domain: question.domain, skill: question.skill, difficulty: question.difficulty, correct: ok, at: Date.now() });
  };

  const needsCheck = block?.t === "quiz" && !pick;

  // Keyboard on text/quiz steps (check steps use QuestionCard's own keys): A–D / 1–4 choose, Enter checks or continues.
  useEffect(() => {
    if (!step || block?.t === "check") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as Element | null)?.closest?.("[data-calculator]")) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Enter") {
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) return;
        e.preventDefault();
        if (needsCheck) checkQuiz();
        else next();
        return;
      }
      if (block?.t === "quiz" && !pick) {
        const k = e.key.toUpperCase();
        const i = "ABCD".indexOf(k) >= 0 ? "ABCD".indexOf(k) : "1234".indexOf(k);
        if (i >= 0 && i < block.options.length) setSel(i);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const answered = Object.values(picks);
  const right = answered.filter((p) => p.ok).length;
  const checkSteps = steps.map((s, i) => (s.block?.t === "check" ? i : -1)).filter((i) => i >= 0);
  const realRight = checkSteps.filter((i) => picks[i]?.ok).length;
  const max = Math.max(saved?.max ?? 0, pos);

  return (
    <section className={`mx-auto px-4 md:px-8 ${showCalc ? "max-w-[1600px]" : wide ? "max-w-6xl" : "max-w-3xl"}`}>
      {/* Toolbar */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-bg/90 px-4 pt-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link href="/lessons" className="inline-flex shrink-0 items-center gap-1 rounded-lg py-1.5 pr-2 pl-1 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
              <Icon d={I.chevronL} className="h-4 w-4" />
              <span className="hidden sm:inline">Lessons</span>
            </Link>
            <span className="hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
            <span className="truncate text-sm font-semibold">{lesson.title}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {hasMath && (
              <button
                type="button"
                onClick={() => {
                  setCalcUsed(true);
                  setCalcOpen((v) => !v);
                }}
                aria-pressed={calcOpen}
                title={calcOpen ? "Hide calculator" : "Open Desmos calculator"}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-semibold transition-colors ${
                  calcOpen ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-ink hover:bg-surface-2"
                }`}
              >
                <Icon d={I.calculator} className="h-4.5 w-4.5" />
                <span className="hidden sm:inline">Calculator</span>
              </button>
            )}
          </div>
        </div>
        {/* Progress: one segment per step; visited ones can be revisited. */}
        <div className="mt-3 flex gap-1 pb-3">
          {steps.map((s, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              disabled={i > max}
              onClick={() => go(i)}
              title={s.title}
              aria-label={`Step ${i + 1}: ${s.title}`}
              className="group flex h-3 flex-1 items-center disabled:cursor-default"
            >
              <span className={`block w-full rounded-full transition-all ${i === pos ? "h-2 bg-primary" : i < pos || i <= max ? "h-1 bg-primary/45 group-hover:h-1.5" : "h-1 bg-line"}`} />
            </button>
          ))}
        </div>
      </div>

      <CalculatorDock used={hasMath && calcUsed} open={showCalc} onClose={() => setCalcOpen(false)} stickyClass="lg:top-24" fullHeight="calc(100vh - 7.5rem)">
        <div className="pt-8 md:pt-10">
          {step ? (
            <div key={pos} className="flex min-h-[calc(100dvh-8rem)] flex-col">
              {pos === 0 && (
                <div className="mb-8">
                  <p className="text-sm font-medium text-primary">{lesson.where}</p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{lesson.title}</h1>
                  <p className="mt-2 text-sm text-muted tabular-nums">
                    {n} steps · about {lesson.minutes} min
                  </p>
                </div>
              )}
              {pos === 0 ? (
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              ) : (
                <>
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase tabular-nums">
                    Step {pos + 1} of {n}
                  </p>
                  <h1 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
                </>
              )}
              {step.body && (
                <div className="mt-4 [&>div>*:first-child]:mt-0">
                  <Markdown source={step.body} />
                </div>
              )}

              {block?.t === "quiz" && (
                <Quiz prompt={block.prompt} options={block.options} explain={block.explain} selected={sel} picked={quizPicked} onSelect={(i) => !pick && setSel(i)} />
              )}

              {block?.t === "check" &&
                (question ? (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2.5">
                      <p className="text-xs font-semibold tracking-wide text-muted uppercase">Real SAT question</p>
                      <DifficultyBadge d={question.difficulty} />
                    </div>
                    <QuestionCard
                      key={`${slug}:${pos}`}
                      q={question}
                      saved={pick ? { response: pick.r } : undefined}
                      onAnswered={(ok, r) => answerCheck(ok, r)}
                      onNext={next}
                      onPrev={pos > 0 ? back : undefined}
                      nextLabel={pos === n - 1 ? "Finish lesson" : "Continue"}
                    />
                  </div>
                ) : (
                  <p className="mt-6 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">This question isn&apos;t available right now. Continue to the next step.</p>
                ))}

              {step.after && (
                <div className="mt-6">
                  <Markdown source={step.after} />
                </div>
              )}

              {/* Bottom bar, pinned to the bottom of the screen (check steps use the question's own bar). */}
              <div className="h-8 shrink-0" aria-hidden="true" />
              {!(block?.t === "check" && question) && (
                <div className="sticky bottom-0 z-10 -mx-4 mt-auto border-t border-line bg-bg/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
                  <div className="flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
                    <button type="button" onClick={back} disabled={pos === 0} className={btnGhost} aria-label="Previous step">
                      <Icon d={I.chevronL} className="h-4 w-4" />
                      <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="flex-1" />
                    {needsCheck ? (
                      <>
                        <button type="button" onClick={next} className={btnGhost}>
                          Skip
                        </button>
                        <button type="button" onClick={checkQuiz} disabled={sel === null} className={`${btnPrimary} min-w-36`}>
                          Check
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={next} className={`${btnPrimary} min-w-36`}>
                        {pos === n - 1 ? "Finish lesson" : "Continue"}
                        <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Complete lesson={lesson} answered={answered.length} right={right} real={checkSteps.length} realRight={realRight} onRestart={restart} onBack={back} />
          )}
        </div>
      </CalculatorDock>
    </section>
  );
}

function Complete({
  lesson,
  answered,
  right,
  real,
  realRight,
  onRestart,
  onBack,
}: {
  lesson: PlayerLesson;
  answered: number;
  right: number;
  real: number;
  realRight: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const section = lesson.section === "strategy" ? null : lesson.section;
  return (
    <div className="mx-auto max-w-xl pb-16 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
        <Icon d={I.check} className="h-8 w-8" strokeWidth={2.6} />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">Lesson complete</h1>
      <p className="mt-2 text-muted">{lesson.title}</p>

      {answered > 0 && (
        <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 divide-x divide-line rounded-2xl bg-surface-2/60 py-4">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {right}
              <span className="text-base font-semibold text-muted">/{answered}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted">checks right</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{real ? `${realRight}/${real}` : "—"}</p>
            <p className="mt-0.5 text-xs text-muted">real SAT questions</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        {lesson.practice && section ? (
          <>
            <Link href={lesson.practice} className={`${btnPrimary} w-full max-w-sm`}>
              Practice this skill
              <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
            </Link>
            <p className="-mt-1 text-xs text-muted">10 questions · ~{estMinutes(10, section)} min, fresh ones first</p>
            {lesson.next && (
              <Link href={`/lessons/${lesson.next.slug}`} className={`${btnOutline} mt-2 w-full max-w-sm`}>
                Next lesson: {lesson.next.title}
              </Link>
            )}
          </>
        ) : (
          lesson.next && (
            <Link href={`/lessons/${lesson.next.slug}`} className={`${btnPrimary} w-full max-w-sm`}>
              Next lesson: {lesson.next.title}
              <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          )
        )}
        <div className="mt-2 flex items-center gap-1">
          <button type="button" onClick={onBack} className={btnGhost}>
            <Icon d={I.chevronL} className="h-4 w-4" />
            Back to the recap
          </button>
          <button type="button" onClick={onRestart} className={btnGhost}>
            <Icon d={I.undo} className="h-4 w-4" />
            Start over
          </button>
        </div>
        <Link href="/lessons" className="text-sm font-medium text-muted hover:text-ink">
          All lessons
        </Link>
      </div>
    </div>
  );
}
