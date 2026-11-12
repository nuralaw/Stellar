"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CalculatorDock } from "@/components/CalculatorDock";
import { DifficultyBadge, QuestionCard } from "@/components/bank/QuestionCard";
import { I, Icon } from "@/components/bank/icons";
import { useFocusMode } from "@/lib/focus";
import type { Step } from "@/lib/lesson-format";
import { addAttempt, saveLessonProgress, useHydrated, useLessonProgress, type LessonProgress } from "@/lib/store";
import type { Question } from "@/lib/types";
import { estMinutes } from "@/lib/ui";
import { Example } from "./Example";
import { Markdown } from "./Markdown";
import { Quiz } from "./Quiz";
import { Stage } from "./visuals/Stage";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent";
const btnOutline = "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2";

export interface PlayerLesson {
  slug: string;
  title: string;
  summary: string;
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

/**
 * Plays a lesson. Screen 0 is the cover (the topic's animation, title, one line); screen i ≥ 1 is step i − 1 of the
 * lesson file; screen n is "Lesson complete". Progress (screen, answers by screen) is saved per lesson.
 */
export function LessonPlayer({ lesson, visual }: { lesson: PlayerLesson; visual: ReactNode }) {
  useFocusMode();
  const { slug, steps, questions } = lesson;
  const n = steps.length + 1;
  const hydrated = useHydrated();
  const saved: LessonProgress | undefined = useLessonProgress()[slug];
  // Saved progress only applies to the same version of the lesson (same screen count).
  const same = saved?.steps === n;
  // null = not moved yet in this visit: resume where the student left off (a finished lesson reopens at the cover).
  const [moved, setMoved] = useState<number | null>(null);
  const resume = same && saved && !saved.done ? Math.min(saved.step, n) : 0;
  const pos = moved ?? (hydrated ? resume : 0);
  const [sel, setSel] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);

  const picks = same && saved ? saved.picks : {};
  const max = Math.max(same ? (saved?.max ?? 0) : 0, pos);
  const step = pos > 0 && pos < n ? steps[pos - 1] : null;
  const block = step?.block ?? null;
  const question = block?.t === "check" ? questions[block.id] : undefined;
  const pick = picks[pos];
  // "Your turn: hard" → "Your turn"; the question's real difficulty shows as a badge.
  const title = step && block?.t === "check" ? step.title.replace(/^Your turn:.*$/, "Your turn") : (step?.title ?? "");
  const quizPicked = block?.t === "quiz" && pick ? Number(pick.r) : null;
  const hasMath = lesson.section === "math" || slug === "desmos";
  const showCalc = hasMath && calcOpen;
  const wide = Boolean(question && ((question.passage && question.section === "rw") || question.table || question.figure));
  // A worked example opens line by line the first time; fully when revisited.
  const exampleLines = block?.t === "example" ? block.lines.length : 0;
  const revealed = pos < max ? exampleLines : Math.min(exampleLines, Math.max(1, shown));
  const moreLines = block?.t === "example" && revealed < exampleLines;

  const save = (patch: Partial<LessonProgress>) => {
    // A new version of the lesson starts fresh, but a lesson finished before stays finished.
    const base: LessonProgress = same && saved ? saved : { step: 0, max: 0, steps: n, picks: {}, at: Date.now(), ...(saved?.done ? { done: saved.done } : {}) };
    saveLessonProgress(slug, { ...base, ...patch, steps: n, at: Date.now() });
  };

  const go = (i: number) => {
    const to = Math.max(0, Math.min(n, i));
    setMoved(to);
    setSel(null);
    setShown(1);
    const finished = to === n;
    save({ step: to, max: Math.max(max, to), ...(finished && !(same && saved?.done) ? { done: Date.now() } : {}) });
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
  const showLine = () => setShown(Math.min(exampleLines, revealed + 1));

  const needsCheck = block?.t === "quiz" && !pick;

  // Keyboard on cover/text/example/quiz screens (check steps use QuestionCard's own keys):
  // A–D / 1–4 choose, Enter checks, shows the next example line or continues.
  useEffect(() => {
    if (pos >= n || block?.t === "check") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as Element | null)?.closest?.("[data-calculator]")) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Enter") {
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) return;
        e.preventDefault();
        if (needsCheck) checkQuiz();
        else if (moreLines) showLine();
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
  const checkScreens = steps.map((s, i) => (s.block?.t === "check" ? i + 1 : -1)).filter((i) => i >= 0);
  const realRight = checkScreens.filter((i) => picks[i]?.ok).length;
  const realCount = checkScreens.length;

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
            {hasMath && pos > 0 && (
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
        {/* Progress: one segment per screen; visited ones can be revisited. */}
        <div className="mt-3 flex gap-1 pb-3">
          {Array.from({ length: n }, (_, i) => {
            const label = i === 0 ? "Start" : steps[i - 1].title;
            return (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                disabled={i > max}
                onClick={() => go(i)}
                title={label}
                aria-label={`Step ${i + 1}: ${label}`}
                className="group flex h-3 flex-1 items-center disabled:cursor-default"
              >
                <span className={`block w-full rounded-full transition-all duration-300 ${i === pos ? "h-2 bg-primary" : i <= max ? "h-1 bg-primary/45 group-hover:h-1.5" : "h-1 bg-line"}`} />
              </button>
            );
          })}
        </div>
      </div>

      <CalculatorDock used={hasMath && calcUsed} open={showCalc} onClose={() => setCalcOpen(false)} stickyClass="lg:top-24" fullHeight="calc(100vh - 7.5rem)">
        <div className="pt-8 md:pt-10">
          {pos === 0 ? (
            <Cover lesson={lesson} visual={visual} screens={n} realCount={realCount} onStart={next} />
          ) : step ? (
            <div key={pos} className="lesson-in flex min-h-[calc(100dvh-8rem)] flex-col">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase tabular-nums">
                Step {pos} of {n - 1}
              </p>
              <h1 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              {step.body && (
                <div className="mt-3 text-[17px] [&>div>*:first-child]:mt-0">
                  <Markdown source={step.body} />
                </div>
              )}

              {block?.t === "example" && <Example prompt={block.prompt} lines={block.lines} shown={revealed} />}

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
                      onPrev={back}
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
                <BottomBar>
                  <button type="button" onClick={back} className={btnGhost} aria-label="Previous step">
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
                  ) : moreLines ? (
                    <>
                      <button type="button" onClick={() => setShown(exampleLines)} className={btnGhost}>
                        Show all
                      </button>
                      <button type="button" onClick={showLine} className={`${btnPrimary} min-w-36`}>
                        Next line
                        <Icon d={I.chevronD} className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={next} className={`${btnPrimary} min-w-36`}>
                      {pos === n - 1 ? "Finish lesson" : "Continue"}
                      <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                  )}
                </BottomBar>
              )}
            </div>
          ) : (
            <Complete lesson={lesson} answered={answered.length} right={right} real={realCount} realRight={realRight} onRestart={restart} onBack={back} />
          )}
        </div>
      </CalculatorDock>
    </section>
  );
}

function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-auto border-t border-line bg-bg/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      <div className="flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">{children}</div>
    </div>
  );
}

/** Screen 0: the topic's animation in a big island, the title and one line on what the lesson teaches. */
function Cover({ lesson, visual, screens, realCount, onStart }: { lesson: PlayerLesson; visual: ReactNode; screens: number; realCount: number; onStart: () => void }) {
  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col">
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="lesson-in text-sm font-medium text-primary">{lesson.where}</p>
        <h1 className="lesson-in mt-1 text-3xl font-bold tracking-tight [animation-delay:60ms] md:text-4xl">{lesson.title}</h1>
        {visual && (
          <div className="lesson-cover mt-6 overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)] ring-1 ring-line [animation-delay:120ms]">
            <Stage className="aspect-[16/9] w-full p-[3%]">{visual}</Stage>
          </div>
        )}
        {lesson.summary && <p className="lesson-in mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink [animation-delay:240ms]">{lesson.summary}</p>}
        <p className="lesson-in mt-2 text-sm text-muted tabular-nums [animation-delay:300ms]">
          {screens - 1} short steps · ~{lesson.minutes} min{realCount ? ` · ${realCount} real SAT questions` : ""}
        </p>
      </div>
      <div className="h-8 shrink-0" aria-hidden="true" />
      <BottomBar>
        <div className="flex-1" />
        <button type="button" onClick={onStart} className={`${btnPrimary} min-w-44`} autoFocus>
          Start lesson
          <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </BottomBar>
    </div>
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
    <div className="lesson-in mx-auto max-w-xl pb-16 text-center">
      <span className="lesson-pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
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
