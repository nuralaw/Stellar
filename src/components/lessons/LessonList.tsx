"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { PlusLock } from "@/components/PlusLock";
import { PlusTag } from "@/components/plus/PlusMark";
import { LINK_STRONG } from "@/components/plus/styles";
import { Stage } from "@/components/lessons/visuals/Stage";
import { useAccess } from "@/lib/access";
import { computeStats } from "@/lib/stats";
import { useAttempts, useHydrated, useLessonProgress, useNow, useProfile, type LessonProgress } from "@/lib/store";
import { domainLessons, lessonGroups, type LessonTab } from "@/lib/lesson-order";
import { rememberTab, useRememberedTab } from "@/lib/lesson-tab";
import { SECTIONS, domainsFor, type Domain } from "@/lib/taxonomy";

export interface ListLesson {
  slug: string;
  section: "rw" | "math" | "strategy";
  domain: string;
  skill: string;
  title: string;
  minutes: number;
  stepCount: number;
  partCount: number;
  sig: string;
}

type Tab = LessonTab;
const TABS: { id: Tab; label: string }[] = [
  { id: "strategy", label: "Start here" },
  { id: "rw", label: "Reading and Writing" },
  { id: "math", label: "Math" },
];

export const isDone = (p?: LessonProgress) => Boolean(p?.done);
/** Started and not finished, in the lesson's current version (the player restarts a lesson whose screens changed). */
const inProgress = (p: LessonProgress | undefined, l: ListLesson) => Boolean(p && !p.done && p.max > 0 && p.steps === l.stepCount && p.sig === l.sig);

function StepBar({ p, total }: { p: LessonProgress; total: number }) {
  // Screens are 1-based (0 is the overview, total + 1 the complete screen).
  const at = Math.max(1, Math.min(p.step, total));
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(6, (at / total) * 100)}%` }} />
      </div>
      <span className="shrink-0 text-xs font-medium text-muted tabular-nums">
        Step {at} of {total}
      </span>
    </div>
  );
}

/** The topic's animation in a small island at the top of a card. */
export function Island({ visual, className = "" }: { visual: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-surface ring-1 ring-line transition-shadow duration-300 ${className}`}>
      <Stage className="aspect-[16/9] w-full">{visual}</Stage>
    </div>
  );
}

export function LessonCard({ l, p, visual, i, locked }: { l: ListLesson; p?: LessonProgress; visual: ReactNode; i: number; locked: boolean }) {
  const done = isDone(p);
  return (
    <Link
      href={`/lessons/${l.slug}`}
      style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
      className="lesson-in group flex flex-col rounded-2xl bg-surface p-2 ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-16px_rgb(0_0_0/0.35)] hover:ring-muted/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      {visual && <Island visual={visual} className="group-hover:ring-primary/30" />}
      <div className="flex items-start justify-between gap-3 px-2 pt-3">
        <span className="leading-snug font-semibold group-hover:text-primary-strong">{l.title}</span>
        {done && (
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success" title="Done">
            <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="mt-auto px-2 pt-2 pb-1.5">
        {inProgress(p, l) ? (
          <StepBar p={p!} total={l.stepCount} />
        ) : (
          <span className="text-xs text-muted tabular-nums">
            {l.partCount} {l.partCount === 1 ? "subtopic" : "subtopics"} · {l.minutes} min
            {locked && (
              <>
                {" · "}
                <PlusTag />
              </>
            )}
          </span>
        )}
      </div>
    </Link>
  );
}

/** A domain of a section: its name and weight, how many lessons and minutes, and how many are done. Opens the domain's lesson list. */
function DomainCard({ d, lessons, progress, visual, i, locked }: { d: Domain; lessons: ListLesson[]; progress?: Record<string, LessonProgress>; visual: ReactNode; i: number; locked: boolean }) {
  const total = lessons.length;
  const done = progress ? lessons.filter((l) => isDone(progress[l.slug])).length : 0;
  const all = total > 0 && done === total;
  const minutes = lessons.reduce((sum, l) => sum + l.minutes, 0);
  return (
    <Link
      href={`/lessons/${d.id}`}
      style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
      className="lesson-in group flex flex-col rounded-2xl bg-surface p-2 ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-16px_rgb(0_0_0/0.35)] hover:ring-muted/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      {visual && <Island visual={visual} className="group-hover:ring-primary/30" />}
      <div className="flex items-start justify-between gap-3 px-2 pt-3">
        <span className="leading-snug font-semibold group-hover:text-primary-strong">{d.name}</span>
        {all && (
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success" title="All done">
            <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <p className="px-2 pt-1 text-xs text-muted">
        ≈{d.weight} of {SECTIONS[d.section].short} questions
      </p>
      <div className="mt-auto px-2 pt-2 pb-1.5">
        <span className="text-xs text-muted tabular-nums">
          {total} {total === 1 ? "lesson" : "lessons"} · {minutes} min
          {locked && (
            <>
              {" · "}
              <PlusTag />
            </>
          )}
        </span>
        {done > 0 && (
          <div className="mt-2 flex items-center gap-2.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            <span className="shrink-0 text-xs font-medium text-muted tabular-nums">
              {done} of {total} done
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

/** The one lesson we suggest now: the one in progress → "Start here" for new students → weakest practiced skill → next not done. */
function useSuggestion(lessons: ListLesson[], progress: Record<string, LessonProgress>) {
  const attempts = useAttempts();
  const now = useNow();
  const profile = useProfile();
  const pick = () => {
    const open = lessons.filter((l) => inProgress(progress[l.slug], l)).sort((a, b) => progress[b.slug].at - progress[a.slug].at)[0];
    if (open) return { lesson: open, kind: "continue" as const, why: "Pick up where you left off" };
    const todo = lessons.filter((l) => !isDone(progress[l.slug]));
    if (!todo.length) return null;
    const touched = lessons.some((l) => progress[l.slug]);
    const firstStrategy = todo.find((l) => l.section === "strategy");
    if (!touched && firstStrategy) return { lesson: firstStrategy, kind: "start" as const, why: "New here? Start with how the test works" };
    const stats = computeStats(attempts, now);
    for (const f of stats.focus) {
      const l = todo.find((x) => x.skill === f.skill.id);
      if (l) return { lesson: l, kind: "start" as const, why: `${f.accuracy}% correct in practice — your weakest skill` };
    }
    const order: Tab[] = profile.focusSection ? ["strategy", profile.focusSection, profile.focusSection === "rw" ? "math" : "rw"] : ["strategy", "rw", "math"];
    for (const s of order) {
      const l = todo.find((x) => x.section === s);
      if (l) return { lesson: l, kind: "start" as const, why: "Next lesson on your list" };
    }
    return null;
  };
  return pick();
}

export function LessonList({ lessons, visuals }: { lessons: ListLesson[]; visuals: Record<string, ReactNode> }) {
  const hydrated = useHydrated();
  const progress = useLessonProgress();
  const suggestion = useSuggestion(lessons, progress);
  // Lessons are Plus. Locks only show once the plan is known (no flash while it loads); the server gates the lesson itself.
  const access = useAccess();
  const locked = access.ready && !access.can("lessons");
  // Tab: the remembered one (picked here, or set by a domain or lesson page), else the suggested lesson's section.
  const remembered = useRememberedTab();
  const tab: Tab = remembered ?? (hydrated && suggestion ? suggestion.lesson.section : "rw");
  const pick = rememberTab;

  const count = (t: Tab) => {
    const list = lessons.filter((l) => l.section === t);
    return { done: hydrated ? list.filter((l) => isDone(progress[l.slug])).length : 0, total: list.length };
  };
  const s = suggestion;
  const n = (sec: ListLesson["section"]) => lessons.filter((l) => l.section === sec).length;
  const sp = s ? progress[s.lesson.slug] : undefined;

  return (
    <>
      {/* One suggested lesson */}
      <div className="mt-8 min-h-[148px]">
        {hydrated && s && access.ready && (
          <div className="lesson-in flex flex-col gap-4 rounded-2xl bg-primary-soft/50 p-3 ring-1 ring-primary/25 sm:flex-row sm:items-center sm:gap-6 sm:p-4">
            {visuals[s.lesson.slug] && <Island visual={visuals[s.lesson.slug]} className="w-full shrink-0 sm:w-72" />}
            <div className="min-w-0 flex-1 px-2 pb-1 sm:px-0 sm:pb-0">
              <p className="text-sm font-medium text-primary-strong">{s.why}</p>
              <p className="mt-1 text-xl font-bold tracking-tight">{s.lesson.title}</p>
              <div className="mt-2 max-w-sm">
                {s.kind === "continue" && sp ? (
                  <StepBar p={sp} total={s.lesson.stepCount} />
                ) : (
                  <p className="text-sm text-muted tabular-nums">
                    {s.lesson.partCount} {s.lesson.partCount === 1 ? "subtopic" : "subtopics"} · {s.lesson.minutes} min · Easy, Medium and Hard tasks after each
                  </p>
                )}
              </div>
              {locked && (
                <p className="mt-2 text-sm text-muted">
                  Part of Stellar Plus · all {lessons.length} lessons ·{" "}
                  <Link href="/plus#plans" className={LINK_STRONG}>
                    See plans
                  </Link>
                </p>
              )}
            </div>
            <Link
              href={`/lessons/${s.lesson.slug}`}
              className={`mx-2 mb-1 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-colors sm:mx-0 sm:mr-2 sm:mb-0 ${
                locked ? "bg-primary-strong text-primary-strong-ink hover:bg-primary-strong-hover" : "bg-primary text-primary-ink hover:bg-primary-hover"
              }`}
            >
              {locked ? "Preview lesson" : s.kind === "continue" ? "Continue" : "Start lesson"}
              <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        )}
        {hydrated && access.ready && !s && locked && (
          <PlusLock
            variant="row"
            feature="lessons"
            title={`All ${lessons.length} lessons come with Stellar Plus`}
            fact={`${n("strategy")} Start here · ${n("rw")} Reading and Writing · ${n("math")} Math`}
          />
        )}
      </div>

      {/* Sections */}
      <div className="mt-10 flex gap-1 overflow-x-auto shadow-[inset_0_-1px_0_var(--color-line)] [scrollbar-width:none]" role="tablist">
        {TABS.map((t) => {
          const c = count(t.id);
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => pick(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                on ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${on ? "bg-primary-soft text-primary-strong" : "bg-surface-2 text-muted"}`}>
                {c.done ? `${c.done}/${c.total}` : c.total}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        {tab === "strategy" ? (
          lessonGroups(lessons, "strategy").map((g) => (
            <div key={g.id} className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.lessons.map((l, i) => (
                  <LessonCard key={l.slug} l={l} p={hydrated ? progress[l.slug] : undefined} visual={visuals[l.slug]} i={i} locked={locked} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {domainsFor(tab).map((d, i) => {
              const list = domainLessons(lessons, d.id);
              return list.length ? <DomainCard key={d.id} d={d} lessons={list} progress={hydrated ? progress : undefined} visual={visuals[list[0].slug]} i={i} locked={locked} /> : null;
            })}
          </div>
        )}
      </div>
    </>
  );
}
