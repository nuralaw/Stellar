"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CalculatorDock } from "@/components/CalculatorDock";
import { I, Icon } from "@/components/bank/icons";
import { ReferenceButton } from "@/components/reference/ReferenceButton";
import { useFocusMode } from "@/lib/focus";
import { LEVELS, type Subtopic, type TaskLevel } from "@/lib/lesson-format";
import { rememberTab } from "@/lib/lesson-tab";
import { addAttempt, getLessonProgress, saveLessonProgress, useHydrated, useLessonProgress, type LessonProgress } from "@/lib/store";
import type { Question } from "@/lib/types";
import { inline, plain } from "./Markdown";
import { LearnScreen } from "./v2/Learn";
import { btnGhost, btnOutline, btnPrimary } from "./v2/Shell";
import { TaskScreen, type TaskResult } from "./v2/Task";
import { Stage } from "./visuals/Stage";

export interface PlayerLesson {
  slug: string;
  /** Version fingerprint: saved progress from another version restarts. */
  sig: string;
  title: string;
  summary: string;
  section: "rw" | "math" | "strategy";
  /** "R&W" / "Start here"; with `domain` it reads "R&W · Craft and Structure". */
  where: string;
  /** The lesson's domain page (null for strategy lessons): where "back" goes, and the domain part of `where` links to it. */
  domain: { name: string; href: string } | null;
  minutes: number;
  subtopics: Subtopic[];
  /** The bank questions of the lesson's bank tasks, by id. */
  questions: Record<string, Question>;
  /** Practice link for this skill (null for strategy lessons). */
  practice: string | null;
  next: { slug: string; title: string } | null;
}

const SLOTS = ["Learn", "Easy", "Medium", "Hard"] as const;
const LEVEL_LABEL: Record<TaskLevel, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

/**
 * Plays a lesson. Screen 0 is the overview; then four screens per subtopic (1 + 4k Learn, then Easy, Medium, Hard);
 * the last one, 4n + 1, is "Lesson complete". The arrows on each screen move freely between them. Progress (screen,
 * finished tasks) is saved per lesson; a subtopic is done when its three tasks are finished (right, or explained).
 */
export function LessonPlayer({ lesson, visual, stepVisuals }: { lesson: PlayerLesson; visual: ReactNode; stepVisuals: Record<string, ReactNode> }) {
  useFocusMode();
  // Back from a Start-here lesson lands on that tab.
  const strategyLesson = lesson.section === "strategy";
  useEffect(() => {
    if (strategyLesson) rememberTab("strategy");
  }, [strategyLesson]);
  const { slug, subtopics, questions } = lesson;
  const count = subtopics.length;
  const total = count * 4;
  const complete = total + 1;
  const hydrated = useHydrated();
  const saved: LessonProgress | undefined = useLessonProgress()[slug];
  // Saved progress only applies to the same version of the lesson (same screens and tasks).
  const same = saved?.steps === total && saved?.sig === lesson.sig;
  // null = not moved yet in this visit: resume where the student left off (a finished lesson reopens at the overview).
  const [moved, setMoved] = useState<number | null>(null);
  const resume = same && saved && !saved.done ? Math.max(0, Math.min(saved.step, complete)) : 0;
  const pos = moved ?? (hydrated ? resume : 0);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);

  const picks = same && saved ? saved.picks : {};
  const max = Math.max(same ? (saved?.max ?? 0) : 0, pos);
  const k = pos >= 1 && pos <= total ? Math.floor((pos - 1) / 4) : -1;
  const slot = k >= 0 ? (pos - 1) % 4 : -1;
  const sub = k >= 0 ? subtopics[k] : null;
  const hasMath = lesson.section === "math" || slug === "desmos";
  const showCalc = hasMath && calcOpen;

  /** The screen of task `level` (0 easy … 2 hard) of subtopic `s`. */
  const taskScreen = (s: number, level: number) => 4 * s + 2 + level;
  const taskDone = (s: number, level: number) => Boolean(picks[taskScreen(s, level)]);
  const tasksDone = (s: number) => [0, 1, 2].filter((l) => taskDone(s, l)).length;
  const subDone = (s: number) => tasksDone(s) === 3;
  const doneCount = subtopics.filter((_, s) => subDone(s)).length;
  const allDone = doneCount === count;

  // Reads the store fresh: two saves in one event (attempt logged, then task finished) must not overwrite each other.
  const save = (patch: Partial<LessonProgress>) => {
    const cur = getLessonProgress()[slug];
    const ok = cur?.steps === total && cur?.sig === lesson.sig;
    // A new version of the lesson starts fresh, but a lesson finished before stays finished.
    const base: LessonProgress = ok && cur ? cur : { step: 0, max: 0, steps: total, picks: {}, at: Date.now(), ...(cur?.done ? { done: cur.done } : {}) };
    saveLessonProgress(slug, { ...base, ...patch, steps: total, sig: lesson.sig, at: Date.now() });
  };
  const fresh = (): LessonProgress | undefined => {
    const cur = getLessonProgress()[slug];
    return cur?.steps === total && cur?.sig === lesson.sig ? cur : undefined;
  };

  const go = (i: number) => {
    const to = Math.max(0, Math.min(complete, i));
    setMoved(to);
    save({ step: to, max: Math.max(fresh()?.max ?? 0, to) });
    window.scrollTo({ top: 0 });
  };
  const next = () => go(pos + 1);
  const back = () => go(pos - 1);
  const restart = () => {
    setMoved(1);
    save({ step: 1, max: 1, picks: {}, tried: {} });
    window.scrollTo({ top: 0 });
  };

  // A task was answered for the first time (this pass): bank questions go to the attempt log (and the mistakes notebook).
  // `tried` keeps whether that first answer was right, so leaving and coming back cannot turn a miss into "right on the first try".
  const tried = (screen: number, q: Question | undefined, correct: boolean) => {
    setMoved(pos); // pin the screen: a saved "done" must not make the resume position fall back to the overview
    save({ tried: { ...fresh()?.tried, [screen]: correct } });
    if (q) addAttempt({ qid: q.id, section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty, correct, at: Date.now() });
  };
  // A task is finished (right, or its explanation was opened): the subtopic is done with its third, the lesson with the last.
  const resolved = (screen: number, r: TaskResult) => {
    setMoved(pos);
    const nextPicks = { ...fresh()?.picks, [screen]: { r: r.how, ok: r.ok } };
    const every = subtopics.every((_, s) => [0, 1, 2].every((l) => nextPicks[taskScreen(s, l)]));
    save({ picks: nextPicks, ...(every && !fresh()?.done ? { done: Date.now() } : {}) });
  };

  // Where "Start" / "Continue" on the overview goes: the first subtopic not finished, at its first open screen.
  const openSub = subtopics.findIndex((_, s) => !subDone(s));
  const startAt = openSub < 0 ? 1 : tasksDone(openSub) > 0 ? taskScreen(openSub, [0, 1, 2].find((l) => !taskDone(openSub, l)) ?? 0) : 1 + 4 * openSub;

  // Keyboard: ← / → go back / on (the task screens handle A–D, 1–4 and Enter themselves).
  useEffect(() => {
    if (pos === 0) {
      const onEnter = (e: KeyboardEvent) => {
        if (e.key !== "Enter" || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement || e.target instanceof HTMLInputElement) return;
        e.preventDefault();
        go(startAt);
      };
      window.addEventListener("keydown", onEnter);
      return () => window.removeEventListener("keydown", onEnter);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if ((e.target as Element | null)?.closest?.("[data-calculator], [data-reference]")) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        back();
      } else if (e.key === "ArrowRight" && pos < complete) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // The score of the Complete screen: tasks right at the first answer, and the same for the real SAT questions.
  const finishedTasks = Object.keys(picks).length;
  const firstTry = Object.values(picks).filter((p) => p.ok).length;
  const bankScreens = subtopics.flatMap((s, i) => s.tasks.flatMap((t, l) => (t.kind === "bank" ? [taskScreen(i, l)] : [])));
  const realRight = bankScreens.filter((s) => picks[s]?.ok).length;

  const where = sub ? `Subtopic ${k + 1} of ${count} · ${SLOTS[slot]}` : pos === complete ? "Complete" : "";
  const task = sub && slot > 0 ? sub.tasks[slot - 1] : undefined;

  return (
    <section className={`mx-auto px-4 md:px-8 ${showCalc ? "max-w-[1600px]" : "max-w-6xl"}`}>
      {/* Toolbar */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-bg/90 px-4 pt-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link href={lesson.domain?.href ?? "/lessons"} aria-label={lesson.domain ? `Back to ${lesson.domain.name}` : "All lessons"} className="inline-flex shrink-0 items-center gap-1 rounded-lg py-1.5 pr-2 pl-1 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
              <Icon d={I.chevronL} className="h-4 w-4" />
              <span className="hidden max-w-40 truncate sm:inline">{lesson.domain?.name ?? "Lessons"}</span>
            </Link>
            <span className="hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
            <button type="button" onClick={() => go(0)} disabled={pos === 0} className="min-w-0 truncate rounded-lg px-1 py-1 text-left text-sm font-semibold hover:text-primary-strong disabled:hover:text-ink" title="Overview of this lesson">
              {lesson.title}
              {sub && <span className="hidden font-normal text-muted sm:inline"> · {inline(sub.title)}</span>}
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {where && <span className="hidden text-xs font-semibold tracking-wide text-muted uppercase tabular-nums md:inline">{where}</span>}
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
                  calcOpen ? "border-primary bg-primary-soft text-primary-strong" : "border-line bg-surface text-ink hover:bg-surface-2"
                }`}
              >
                <Icon d={I.calculator} className="h-4.5 w-4.5" />
                <span className="hidden sm:inline">Calculator</span>
              </button>
            )}
            {hasMath && pos > 0 && <ReferenceButton labelFrom="lg" calcOpen={calcOpen} onCloseCalc={() => setCalcOpen(false)} />}
          </div>
        </div>
        {/* Progress: four segments per subtopic (Learn, Easy, Medium, Hard); visited ones can be revisited. */}
        <div className="mt-3 flex gap-2.5 pb-3">
          {subtopics.map((s, si) => (
            <div key={si} className="flex flex-1 gap-0.5">
              {SLOTS.map((name, j) => {
                const i = 4 * si + 1 + j;
                const finished = j > 0 && taskDone(si, j - 1);
                return (
                  <button
                    key={i}
                    type="button"
                    tabIndex={-1}
                    disabled={i > max}
                    onClick={() => go(i)}
                    title={plain(`${s.title}: ${name}`)}
                    aria-label={plain(`Subtopic ${si + 1}, ${s.title}: ${name}${finished ? " (done)" : ""}`)}
                    className="group flex h-3 flex-1 items-center disabled:cursor-default"
                  >
                    <span
                      className={`block w-full rounded-full transition-all duration-300 ${
                        i === pos ? "h-2 bg-primary" : finished ? "h-1 bg-success/70 group-hover:h-1.5" : i <= max ? "h-1 bg-primary/45 group-hover:h-1.5" : "h-1 bg-line"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <CalculatorDock used={hasMath && calcUsed} open={showCalc} onClose={() => setCalcOpen(false)} stickyClass="lg:top-24" fullHeight="calc(100vh - 7.5rem)">
        <div className="pt-6 pb-12 md:pt-8">
          {pos === 0 ? (
            <Overview lesson={lesson} visual={visual} subDone={subDone} tasksDone={tasksDone} openSub={openSub} started={max > 0 || doneCount > 0} realCount={bankScreens.length} doneCount={doneCount} onOpen={(s) => go(1 + 4 * s)} onStart={() => go(startAt)} onRestart={restart} />
          ) : sub && slot === 0 ? (
            <div key={pos} className="lesson-in">
              <LearnScreen subtopic={sub} visual={stepVisuals[sub.visual]} onBack={back} onNext={next} />
            </div>
          ) : sub && task ? (
            <div key={pos} className="lesson-in">
              <TaskScreen
                task={task}
                question={task.kind === "bank" ? questions[task.id] : undefined}
                resolved={picks[pos] ? { ok: picks[pos].ok, how: picks[pos].r === "shown" ? "shown" : "right" } : null}
                tried={same ? saved?.tried?.[pos] : undefined}
                onTried={(correct) => tried(pos, task.kind === "bank" ? questions[task.id] : undefined, correct)}
                onResolved={(r) => resolved(pos, r)}
                onBack={back}
                onNext={next}
                nextLabel={pos === total ? "Finish" : slot === 3 ? "Next subtopic" : "Next"}
              />
            </div>
          ) : (
            <Complete lesson={lesson} allDone={allDone} doneCount={doneCount} finished={finishedTasks} firstTry={firstTry} real={bankScreens.length} realRight={realRight} onRestart={restart} onBack={back} onOverview={() => go(0)} onOpen={() => go(startAt)} />
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

/** Screen 0: the topic's animation, one line on what the lesson teaches, and its subtopics to pick from. */
function Overview({
  lesson,
  visual,
  subDone,
  tasksDone,
  openSub,
  started,
  realCount,
  doneCount,
  onOpen,
  onStart,
  onRestart,
}: {
  lesson: PlayerLesson;
  visual: ReactNode;
  subDone: (s: number) => boolean;
  tasksDone: (s: number) => number;
  openSub: number;
  started: boolean;
  realCount: number;
  doneCount: number;
  onOpen: (subtopic: number) => void;
  onStart: () => void;
  onRestart: () => void;
}) {
  const { subtopics } = lesson;
  return (
    <div className="flex min-h-[calc(100dvh-10rem)] flex-col">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <p className="lesson-in text-sm font-medium text-primary-strong">
            {lesson.where}
            {lesson.domain && (
              <>
                {" · "}
                <Link href={lesson.domain.href} className="hover:underline">
                  {lesson.domain.name}
                </Link>
              </>
            )}
          </p>
          <h1 className="lesson-in mt-1 text-3xl font-bold tracking-tight [animation-delay:60ms] md:text-4xl">{lesson.title}</h1>
        </div>
        {visual && (
          <div className="lesson-cover mt-6 overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)] ring-1 ring-line [animation-delay:120ms]">
            <Stage className="aspect-[16/9] w-full p-[3%]">{visual}</Stage>
          </div>
        )}
        {lesson.summary && <p className="lesson-in mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-ink [animation-delay:200ms]">{lesson.summary}</p>}

        {/* The subtopics */}
        <div className="mt-8 flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">{subtopics.length} subtopics</h2>
          <p className="text-sm text-muted tabular-nums">
            {doneCount ? `${doneCount} of ${subtopics.length} done · ` : ""}~{lesson.minutes} min{realCount ? ` · ${realCount} real SAT questions` : ""}
          </p>
        </div>
        <ol className="mt-3 space-y-2">
          {subtopics.map((s, i) => {
            const done = subDone(i);
            const isNext = i === openSub;
            const n = tasksDone(i);
            return (
              <li key={i} className="lesson-in" style={{ animationDelay: `${240 + i * 50}ms` }}>
                <button
                  type="button"
                  onClick={() => onOpen(i)}
                  className={`group flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left ring-1 transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px sm:p-4 ${
                    isNext ? "bg-primary-soft/50 ring-primary/40 hover:ring-primary/60" : "bg-surface ring-line hover:bg-surface-2/50 hover:ring-muted/50"
                  }`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums ${done ? "bg-success-soft text-success" : isNext ? "bg-primary text-primary-ink" : "bg-surface-2 text-muted"}`}>
                    {done ? <Icon d={I.check} className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block leading-snug font-semibold group-hover:text-primary-strong">{inline(s.title)}</span>
                    {s.tagline && <span className="mt-0.5 block text-sm leading-snug text-muted">{inline(s.tagline)}</span>}
                  </span>
                  <span className="flex shrink-0 items-center gap-1" title={`${n} of 3 tasks done`} aria-label={`${n} of 3 tasks done`}>
                    {LEVELS.map((lv, l) => (
                      <span key={lv} title={LEVEL_LABEL[lv]} className={`h-2 w-2 rounded-full ${l < n || done ? "bg-success" : "bg-line"}`} />
                    ))}
                  </span>
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
        {openSub < 0 && (
          <button type="button" onClick={onRestart} className={btnGhost}>
            <Icon d={I.undo} className="h-4 w-4" />
            Start over
          </button>
        )}
        <button type="button" onClick={onStart} className={`${btnPrimary} min-w-44`} autoFocus>
          {openSub < 0 ? "Review" : started ? <>Continue: {inline(subtopics[openSub].title)}</> : "Start lesson"}
          <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </BottomBar>
    </div>
  );
}

function Complete({
  lesson,
  allDone,
  doneCount,
  finished,
  firstTry,
  real,
  realRight,
  onRestart,
  onBack,
  onOverview,
  onOpen,
}: {
  lesson: PlayerLesson;
  allDone: boolean;
  doneCount: number;
  finished: number;
  firstTry: number;
  real: number;
  realRight: number;
  onRestart: () => void;
  onBack: () => void;
  onOverview: () => void;
  onOpen: () => void;
}) {
  const section = lesson.section === "strategy" ? null : lesson.section;
  const open = lesson.subtopics.length - doneCount;
  return (
    <div className="lesson-in mx-auto max-w-xl text-center">
      <span className={`lesson-pop mx-auto grid h-16 w-16 place-items-center rounded-full ${allDone ? "bg-success-soft text-success" : "bg-primary-soft text-primary-strong"}`}>
        <Icon d={I.check} className="h-8 w-8" strokeWidth={2.6} />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">{allDone ? "Lesson complete" : "End of the lesson"}</h1>
      <p className="mt-2 text-muted">{lesson.title}</p>
      {!allDone && (
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          {open} {open === 1 ? "subtopic is" : "subtopics are"} not finished yet: answer its Easy, Medium and Hard tasks to complete the lesson.
        </p>
      )}

      {finished > 0 && (
        <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 divide-x divide-line rounded-2xl bg-surface-2/60 py-4">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {firstTry}
              <span className="text-base font-semibold text-muted">/{finished}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted">right on the first try</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{real ? `${realRight}/${real}` : "—"}</p>
            <p className="mt-0.5 text-xs text-muted">real SAT questions</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        {!allDone && (
          <button type="button" onClick={onOpen} className={`${btnPrimary} w-full max-w-sm`}>
            Go to the open subtopic
            <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
          </button>
        )}
        {lesson.practice && section ? (
          <>
            <Link href={lesson.practice} className={`${allDone ? btnPrimary : btnOutline} w-full max-w-sm`}>
              Practice this skill
              <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
            </Link>
            <p className="-mt-1 text-xs text-muted">No limit, fresh questions first</p>
            {lesson.next && (
              <Link href={`/lessons/${lesson.next.slug}`} className={`${btnOutline} mt-2 w-full max-w-sm`}>
                Next lesson: {lesson.next.title}
              </Link>
            )}
          </>
        ) : (
          lesson.next && (
            <Link href={`/lessons/${lesson.next.slug}`} className={`${allDone ? btnPrimary : btnOutline} w-full max-w-sm`}>
              Next lesson: {lesson.next.title}
              {allDone && <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />}
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
            All subtopics
          </button>
          <button type="button" onClick={onRestart} className={btnGhost}>
            <Icon d={I.undo} className="h-4 w-4" />
            Start over
          </button>
        </div>
        <Link href={lesson.domain?.href ?? "/lessons"} className="text-sm font-medium text-muted hover:text-ink">
          {lesson.domain ? `All ${lesson.domain.name} lessons` : "All lessons"}
        </Link>
      </div>
    </div>
  );
}
