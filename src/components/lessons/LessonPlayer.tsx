"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CalculatorDock } from "@/components/CalculatorDock";
import { DifficultyBadge, QuestionCard } from "@/components/bank/QuestionCard";
import { I, Icon } from "@/components/bank/icons";
import { useFocusMode } from "@/lib/focus";
import { gradeTyped, type Part, type Step } from "@/lib/lesson-format";
import { addAttempt, saveLessonProgress, useHydrated, useLessonProgress, type LessonProgress } from "@/lib/store";
import type { Question } from "@/lib/types";
import { estMinutes } from "@/lib/ui";
import { DesmosDemo } from "./DesmosDemo";
import { Example } from "./Example";
import { Markdown } from "./Markdown";
import { More } from "./More";
import { Quiz, type QuizNote } from "./Quiz";
import { Stage } from "./visuals/Stage";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent";
const btnOutline = "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2";

export interface PlayerLesson {
  slug: string;
  /** Version fingerprint: saved progress from another version restarts. */
  sig: string;
  title: string;
  summary: string;
  section: "rw" | "math" | "strategy";
  /** "R&W · Craft and Structure" / "Start here". */
  where: string;
  minutes: number;
  steps: Step[];
  parts: Part[];
  questions: Record<string, Question>;
  /** Practice link for this skill (null for strategy lessons). */
  practice: string | null;
  next: { slug: string; title: string } | null;
}

/** The part a screen belongs to (screen i ≥ 1 is step i − 1). */
const partAt = (parts: Part[], screen: number) => parts.findIndex((p) => screen - 1 >= p.start && screen - 1 < p.end);

/**
 * Plays a lesson. Screen 0 is the overview (the topic's animation and its parts, the subtopics); screen i ≥ 1 is step
 * i − 1 of the lesson file; screen n is "Lesson complete". Progress (screen, answers by screen, finished parts) is
 * saved per lesson.
 */
export function LessonPlayer({ lesson, visual, stepVisuals }: { lesson: PlayerLesson; visual: ReactNode; stepVisuals: Record<string, ReactNode> }) {
  useFocusMode();
  const { slug, steps, parts, questions } = lesson;
  const n = steps.length + 1;
  const hydrated = useHydrated();
  const saved: LessonProgress | undefined = useLessonProgress()[slug];
  // Saved progress only applies to the same version of the lesson (same screen count).
  const same = saved?.steps === n && saved?.sig === lesson.sig;
  // null = not moved yet in this visit: resume where the student left off (a finished lesson reopens at the overview).
  const [moved, setMoved] = useState<number | null>(null);
  const resume = same && saved && !saved.done ? Math.min(saved.step, n) : 0;
  const pos = moved ?? (hydrated ? resume : 0);
  const [sel, setSel] = useState<number | null>(null);
  // Quiz retry: a first wrong answer lets the student try once more; the second one ends the quiz (see checkQuiz).
  const [missed, setMissed] = useState<number[]>([]);
  const [text, setText] = useState("");
  const [note, setNote] = useState<QuizNote | null>(null);
  // A typed entry the SAT does not take: shown under the retry note (if any), so "Try once more" stays visible.
  const [hint, setHint] = useState<string | null>(null);
  const [shown, setShown] = useState(0);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);

  const picks = same && saved ? saved.picks : {};
  const doneParts = same && saved?.parts ? saved.parts : {};
  const max = Math.max(same ? (saved?.max ?? 0) : 0, pos);
  const step = pos > 0 && pos < n ? steps[pos - 1] : null;
  const k = step ? partAt(parts, pos) : -1;
  const part = k >= 0 ? parts[k] : null;
  const block = step?.block ?? null;
  const question = block?.t === "check" ? questions[block.id] : undefined;
  const pick = picks[pos];
  // "Your turn: hard" → "Your turn"; the question's real difficulty shows as a badge.
  const title = step && block?.t === "check" ? step.title.replace(/^Your turn:.*$/, "Your turn") : (step?.title ?? "");
  const typedQuiz = block?.t === "quiz" && block.answers.length > 0;
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
    saveLessonProgress(slug, { ...base, ...patch, steps: n, sig: lesson.sig, at: Date.now() });
  };

  const resetQuiz = () => {
    setSel(null);
    setMissed([]);
    setText("");
    setNote(null);
    setHint(null);
  };

  const go = (i: number) => {
    const to = Math.max(0, Math.min(n, i));
    setMoved(to);
    resetQuiz();
    setShown(1);
    // Moving forward off the last step of a part finishes that part.
    const leaving = part && to === pos + 1 && pos === part.end ? { parts: { ...doneParts, [k]: doneParts[k] ?? Date.now() } } : {};
    const finished = to === n;
    save({ step: to, max: Math.max(max, to), ...leaving, ...(finished && !(same && saved?.done) ? { done: Date.now() } : {}) });
    window.scrollTo({ top: 0 });
  };
  const next = () => go(pos + 1);
  const back = () => go(pos - 1);
  const restart = () => {
    setMoved(0);
    resetQuiz();
    save({ step: 0, picks: {} });
    window.scrollTo({ top: 0 });
  };

  // Right: done. First wrong: say so (with that choice's feedback) and let the student try again. Second wrong: the
  // answer and the explanation. A typed entry that isn't a number (or is a mixed number) gets a hint and isn't a try.
  const checkQuiz = () => {
    if (block?.t !== "quiz" || pick) return;
    const final = (r: string, ok: boolean) => save({ picks: { ...picks, [pos]: { r, ok } } });
    if (block.answers.length) {
      const entry = text.trim();
      if (!entry) return;
      const g = gradeTyped(block, entry);
      if (g.kind === "invalid") return setHint(g.hint);
      setHint(null);
      if (g.kind === "right" || missed.length) return final(entry, g.kind === "right");
      setMissed([0]);
      setNote({ kind: "retry", text: g.feedback });
      setText("");
      return;
    }
    if (sel === null) return;
    const ok = Boolean(block.options[sel]?.correct);
    if (ok || missed.length) return final(String(sel), ok);
    setMissed([sel]);
    setNote({ kind: "retry", text: block.options[sel]?.feedback });
    setSel(null);
  };
  const answerCheck = (ok: boolean, response: string) => {
    if (!question) return;
    save({ picks: { ...picks, [pos]: { r: response, ok } } });
    addAttempt({ qid: question.id, section: question.section, domain: question.domain, skill: question.skill, difficulty: question.difficulty, correct: ok, at: Date.now() });
  };
  const showLine = () => setShown(Math.min(exampleLines, revealed + 1));

  // Where "Start" / "Continue" on the overview goes: the first part not finished yet.
  const nextPart = parts.findIndex((_, i) => !doneParts[i]);
  const startAt = nextPart >= 0 ? parts[nextPart].start + 1 : 1;
  const needsCheck = block?.t === "quiz" && !pick;

  // Keyboard on overview/text/example/quiz screens (check steps use QuestionCard's own keys):
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
        if (pos === 0) go(startAt);
        else if (needsCheck) checkQuiz();
        else if (moreLines) showLine();
        else next();
        return;
      }
      if (block?.t === "quiz" && !pick) {
        const key = e.key.toUpperCase();
        const i = "ABCD".indexOf(key) >= 0 ? "ABCD".indexOf(key) : "1234".indexOf(key);
        if (i >= 0 && i < block.options.length && !missed.includes(i)) setSel(i);
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
            <button type="button" onClick={() => go(0)} disabled={pos === 0} className="min-w-0 truncate rounded-lg px-1 py-1 text-left text-sm font-semibold hover:text-primary disabled:hover:text-ink" title="All parts of this lesson">
              {lesson.title}
              {part && <span className="font-normal text-muted"> · {part.title}</span>}
            </button>
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
        {/* Progress: one segment per step, grouped by part; visited ones can be revisited. */}
        <div className="mt-3 flex gap-2.5 pb-3">
          {parts.map((p, pi) => (
            <div key={pi} className="flex flex-1 gap-0.5" style={{ flexGrow: p.end - p.start }}>
              {Array.from({ length: p.end - p.start }, (_, j) => {
                const i = p.start + j + 1;
                const s = steps[i - 1];
                return (
                  <button
                    key={i}
                    type="button"
                    tabIndex={-1}
                    disabled={i > max}
                    onClick={() => go(i)}
                    title={`${p.title}: ${s.title}`}
                    aria-label={`${p.title}, step ${j + 1}: ${s.title}`}
                    className="group flex h-3 flex-1 items-center disabled:cursor-default"
                  >
                    <span className={`block w-full rounded-full transition-all duration-300 ${i === pos ? "h-2 bg-primary" : i <= max ? "h-1 bg-primary/45 group-hover:h-1.5" : "h-1 bg-line"}`} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <CalculatorDock used={hasMath && calcUsed} open={showCalc} onClose={() => setCalcOpen(false)} stickyClass="lg:top-24" fullHeight="calc(100vh - 7.5rem)">
        <div className="pt-8 md:pt-10">
          {pos === 0 ? (
            <Overview lesson={lesson} visual={visual} doneParts={doneParts} nextPart={nextPart} realCount={realCount} started={max > 0} onOpen={(pi) => go(parts[pi].start + 1)} onStart={() => go(startAt)} />
          ) : step && part ? (
            <div key={pos} className="lesson-in flex min-h-[calc(100dvh-8rem)] flex-col">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold tracking-wide uppercase tabular-nums">
                <span key={k} className={`rounded-full px-2 py-0.5 ${pos - 1 === part.start ? "lesson-pop bg-primary text-primary-ink" : "bg-primary-soft text-primary"}`}>
                  Part {k + 1} of {parts.length}
                </span>
                <span className="text-muted">
                  {part.end - part.start > 1 ? `Step ${pos - part.start} of ${part.end - part.start}` : part.title}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              {step.body && (
                <div className="mt-3 text-[17px] [&>div>*:first-child]:mt-0">
                  <Markdown source={step.body} />
                </div>
              )}

              {/* The step's animation comes first; next to an example or a Desmos walkthrough it is a little smaller. */}
              {step.visual && (
                <div
                  className={`lesson-cover mt-6 overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)] ring-1 ring-line ${
                    block ? "mx-auto max-w-xl" : ""
                  }`}
                >
                  {stepVisuals[step.visual] ? (
                    <Stage className="aspect-[16/9] w-full p-[3%]">{stepVisuals[step.visual]}</Stage>
                  ) : (
                    <p className="p-6 text-sm text-muted">Animation not found: {step.visual}</p>
                  )}
                </div>
              )}

              {block?.t === "example" && <Example prompt={block.prompt} choices={block.choices} lines={block.lines} shown={revealed} />}

              {block?.t === "desmos" && (
                <div className="mt-6">
                  <DesmosDemo key={pos} moves={block.moves} prompt={block.prompt || undefined} label="Watch it in Desmos" />
                </div>
              )}

              {block?.t === "quiz" && (
                <Quiz
                  prompt={block.prompt}
                  options={block.options}
                  answers={block.answers}
                  wrong={block.wrong}
                  explain={block.explain}
                  desmos={block.desmos}
                  selected={sel}
                  missed={missed}
                  result={pick ?? null}
                  note={note}
                  hint={hint}
                  value={text}
                  onSelect={(i) => !pick && !missed.includes(i) && setSel(i)}
                  onValue={(v) => {
                    setText(v);
                    setHint(null);
                  }}
                  onSubmit={checkQuiz}
                />
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

              {step.more && <More source={step.more} />}

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
                      <button type="button" onClick={checkQuiz} disabled={typedQuiz ? !text.trim() : sel === null} className={`${btnPrimary} min-w-36`}>
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
                      {pos === n - 1 ? "Finish lesson" : pos - 1 === part.end - 1 ? `Next: ${parts[k + 1]?.title ?? "finish"}` : "Continue"}
                      <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                  )}
                </BottomBar>
              )}
            </div>
          ) : (
            <Complete lesson={lesson} answered={answered.length} right={right} real={realCount} realRight={realRight} onRestart={restart} onBack={back} onOverview={() => go(0)} />
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

/** Screen 0: the topic's animation, one line on what the lesson teaches, and its parts to pick from. */
function Overview({
  lesson,
  visual,
  doneParts,
  nextPart,
  realCount,
  started,
  onOpen,
  onStart,
}: {
  lesson: PlayerLesson;
  visual: ReactNode;
  doneParts: Record<number, number>;
  nextPart: number;
  realCount: number;
  started: boolean;
  onOpen: (part: number) => void;
  onStart: () => void;
}) {
  const { parts } = lesson;
  const finished = Object.keys(doneParts).length;
  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <p className="lesson-in text-sm font-medium text-primary">{lesson.where}</p>
          <h1 className="lesson-in mt-1 text-3xl font-bold tracking-tight [animation-delay:60ms] md:text-4xl">{lesson.title}</h1>
        </div>
        {visual && (
          <div className="lesson-cover mt-6 overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)] ring-1 ring-line [animation-delay:120ms]">
            <Stage className="aspect-[16/9] w-full p-[3%]">{visual}</Stage>
          </div>
        )}
        {lesson.summary && <p className="lesson-in mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-ink [animation-delay:200ms]">{lesson.summary}</p>}

        {/* The parts (subtopics) */}
        <div className="mt-8 flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">{parts.length} parts</h2>
          <p className="text-sm text-muted tabular-nums">
            {finished ? `${finished} of ${parts.length} done · ` : ""}~{lesson.minutes} min{realCount ? ` · ${realCount} real SAT questions` : ""}
          </p>
        </div>
        <ol className="mt-3 space-y-2">
          {parts.map((p, i) => {
            const done = Boolean(doneParts[i]);
            const isNext = i === nextPart;
            const count = p.end - p.start;
            return (
              <li key={i} className="lesson-in" style={{ animationDelay: `${240 + i * 50}ms` }}>
                <button
                  type="button"
                  onClick={() => onOpen(i)}
                  className={`group flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left ring-1 transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px sm:p-4 ${
                    isNext ? "bg-primary-soft/50 ring-primary/40 hover:ring-primary/60" : "bg-surface ring-line hover:bg-surface-2/50 hover:ring-muted/50"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums ${
                      done ? "bg-success-soft text-success" : isNext ? "bg-primary text-primary-ink" : "bg-surface-2 text-muted"
                    }`}
                  >
                    {done ? <Icon d={I.check} className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block leading-snug font-semibold group-hover:text-primary">{p.title}</span>
                    {p.tagline && <span className="mt-0.5 block text-sm leading-snug text-muted">{p.tagline}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-muted tabular-nums">{count === 1 ? "1 step" : `${count} steps`}</span>
                  <Icon d={I.chevronR} className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="h-8 shrink-0" aria-hidden="true" />
      <BottomBar>
        <div className="flex-1" />
        <button type="button" onClick={onStart} className={`${btnPrimary} min-w-44`} autoFocus>
          {nextPart < 0 ? "Go through again" : started || finished ? `Continue: ${parts[nextPart].title}` : "Start lesson"}
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
  onOverview,
}: {
  lesson: PlayerLesson;
  answered: number;
  right: number;
  real: number;
  realRight: number;
  onRestart: () => void;
  onBack: () => void;
  onOverview: () => void;
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
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
          <button type="button" onClick={onBack} className={btnGhost}>
            <Icon d={I.chevronL} className="h-4 w-4" />
            Back
          </button>
          <button type="button" onClick={onOverview} className={btnGhost}>
            <Icon d={I.grid} className="h-4 w-4" />
            All parts
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
