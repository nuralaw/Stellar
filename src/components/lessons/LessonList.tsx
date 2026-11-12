"use client";

import Link from "next/link";
import { useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { computeStats } from "@/lib/stats";
import { useAttempts, useHydrated, useLessonProgress, useNow, useProfile, type LessonProgress } from "@/lib/store";
import { domainsFor, type SectionId } from "@/lib/taxonomy";

export interface ListLesson {
  slug: string;
  section: "rw" | "math" | "strategy";
  domain: string;
  skill: string;
  title: string;
  minutes: number;
  stepCount: number;
}

type Tab = "strategy" | SectionId;
const TABS: { id: Tab; label: string }[] = [
  { id: "strategy", label: "Start here" },
  { id: "rw", label: "Reading and Writing" },
  { id: "math", label: "Math" },
];
const TAB_KEY = "stellar:lessons-tab";

function readTab(): Tab | null {
  try {
    const t = localStorage.getItem(TAB_KEY);
    return t === "strategy" || t === "rw" || t === "math" ? t : null;
  } catch {
    return null;
  }
}

const isDone = (p?: LessonProgress) => Boolean(p?.done);
const inProgress = (p?: LessonProgress) => Boolean(p && !p.done && p.max > 0);

function StepBar({ p, total }: { p: LessonProgress; total: number }) {
  const at = Math.min(p.step, total);
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(6, (at / total) * 100)}%` }} />
      </div>
      <span className="shrink-0 text-xs font-medium text-muted tabular-nums">
        Step {Math.min(at + 1, total)} of {total}
      </span>
    </div>
  );
}

function LessonCard({ l, p }: { l: ListLesson; p?: LessonProgress }) {
  const done = isDone(p);
  return (
    <Link href={`/lessons/${l.slug}`} className="group flex min-h-24 flex-col rounded-2xl bg-surface p-4 ring-1 ring-line transition-shadow hover:ring-muted/60">
      <div className="flex items-start justify-between gap-3">
        <span className="font-semibold leading-snug group-hover:text-primary">{l.title}</span>
        {done && (
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success" title="Done">
            <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="mt-auto pt-3">
        {inProgress(p) ? (
          <StepBar p={p!} total={l.stepCount} />
        ) : (
          <span className="text-xs text-muted tabular-nums">
            {l.minutes} min · {l.stepCount} steps
          </span>
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
    const open = lessons.filter((l) => inProgress(progress[l.slug])).sort((a, b) => progress[b.slug].at - progress[a.slug].at)[0];
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

export function LessonList({ lessons }: { lessons: ListLesson[] }) {
  const hydrated = useHydrated();
  const progress = useLessonProgress();
  const suggestion = useSuggestion(lessons, progress);
  // Tab: the one picked now, else the one remembered, else the suggested lesson's section.
  const [chosen, setChosen] = useState<Tab | null>(null);
  const remembered = hydrated ? readTab() : null;
  const tab: Tab = chosen ?? remembered ?? (hydrated && suggestion ? suggestion.lesson.section : "rw");
  const pick = (t: Tab) => {
    setChosen(t);
    try {
      localStorage.setItem(TAB_KEY, t);
    } catch {}
  };

  const bySkill = new Map(lessons.map((l) => [l.skill, l]));
  const count = (t: Tab) => {
    const list = lessons.filter((l) => l.section === t);
    return { done: hydrated ? list.filter((l) => isDone(progress[l.slug])).length : 0, total: list.length };
  };
  const s = suggestion;
  const sp = s ? progress[s.lesson.slug] : undefined;

  return (
    <>
      {/* One suggested lesson */}
      <div className="mt-8 min-h-[148px]">
        {hydrated && s && (
          <div className="flex flex-col gap-4 rounded-2xl bg-primary-soft/50 p-5 ring-1 ring-primary/25 sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-primary">{s.why}</p>
              <p className="mt-1 text-xl font-bold tracking-tight">{s.lesson.title}</p>
              <div className="mt-2 max-w-sm">
                {s.kind === "continue" && sp ? (
                  <StepBar p={sp} total={s.lesson.stepCount} />
                ) : (
                  <p className="text-sm text-muted tabular-nums">
                    {s.lesson.minutes} min · {s.lesson.stepCount} steps · ends with real SAT questions
                  </p>
                )}
              </div>
            </div>
            <Link
              href={`/lessons/${s.lesson.slug}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
            >
              {s.kind === "continue" ? "Continue" : "Start lesson"}
              <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
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
              <span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${on ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted"}`}>
                {c.done ? `${c.done}/${c.total}` : c.total}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        {tab === "strategy" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lessons
              .filter((l) => l.section === "strategy")
              .map((l) => (
                <LessonCard key={l.slug} l={l} p={hydrated ? progress[l.slug] : undefined} />
              ))}
          </div>
        ) : (
          domainsFor(tab).map((d) => {
            const list = d.skills.map((sk) => bySkill.get(sk.id)).filter((l): l is ListLesson => Boolean(l));
            if (!list.length) return null;
            const done = hydrated ? list.filter((l) => isDone(progress[l.slug])).length : 0;
            return (
              <div key={d.id} className="mt-8">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-base font-semibold">{d.name}</h2>
                  {done > 0 && (
                    <span className="text-xs text-muted tabular-nums">
                      {done} of {list.length} done
                    </span>
                  )}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((l) => (
                    <LessonCard key={l.slug} l={l} p={hydrated ? progress[l.slug] : undefined} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
