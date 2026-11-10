"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { useHydrated, useTestResults, useTestSession } from "@/lib/store";
import { MODULE_INFO, testName, type ModuleId, type TestIndexRow } from "@/lib/test-types";
import { PAGE } from "@/lib/ui";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
type Filter = "all" | "full" | "rw";

const questionCount = (t: TestIndexRow) => Object.values(t.counts).reduce((a, b) => a + (b ?? 0), 0);
const minutesOf = (t: TestIndexRow) => (Object.keys(t.counts) as ModuleId[]).reduce((a, m) => a + (MODULE_INFO[m]?.minutes ?? 0), 0);
const fmtMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"}`;

export function TestList({ tests }: { tests: TestIndexRow[] }) {
  const hydrated = useHydrated();
  const results = useTestResults();
  const session = useTestSession();
  const [filter, setFilter] = useState<Filter>("all");
  const [year, setYear] = useState<number | "all">("all");

  const years = useMemo(() => [...new Set(tests.map((t) => t.year))].sort((a, b) => b - a), [tests]);
  const shown = tests.filter(
    (t) => (year === "all" || t.year === year) && (filter === "all" || (filter === "full" ? t.sections.length === 2 : t.sections.length === 1)),
  );
  const groups = years.map((y) => ({ year: y, tests: shown.filter((t) => t.year === y) })).filter((g) => g.tests.length);

  const last = new Map<string, number>();
  if (hydrated) for (const r of results) if (r.testId) last.set(r.testId, r.total);
  const current = hydrated && session ? tests.find((t) => t.id === session.testId) : undefined;
  // One clear next step instead of 71 equal cards: the newest full test you haven't taken.
  const recommended = hydrated && !current ? tests.find((t) => t.sections.length === 2 && !last.has(t.id)) : undefined;
  const full = tests.find((t) => t.sections.length === 2);
  const rwOnly = tests.find((t) => t.sections.length === 1);

  return (
    <div className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Practice tests</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {tests.length} past Digital SAT papers from {years[years.length - 1]}–{years[0]}, module by module. Timed like the real test, with an estimated
        score and a question-by-question review.
      </p>
      <p className="mt-2 text-sm text-muted tabular-nums">
        {full && (
          <>
            Full test: {questionCount(full)} questions · {fmtMinutes(minutesOf(full))}
          </>
        )}
        {rwOnly && (
          <>
            {" "}
            · R&amp;W only: {questionCount(rwOnly)} questions · {fmtMinutes(minutesOf(rwOnly))}
          </>
        )}
      </p>

      {recommended && (
        <Link
          href={`/test/${recommended.id}`}
          className="group mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-primary/50"
        >
          <span className="min-w-0 flex-1">
            <span className="text-sm font-medium text-primary">Recommended next</span>
            <span className="mt-0.5 block text-lg font-semibold">{testName(recommended)}</span>
            <span className="text-sm text-muted">
              The newest full test you haven&apos;t taken · {questionCount(recommended)} questions · {fmtMinutes(minutesOf(recommended))}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors group-hover:bg-primary-hover">
            <Icon d={I.play} className="h-4 w-4" filled />
            Start test
          </span>
        </Link>
      )}

      {current && session && (
        <Link
          href={`/test/${current.id}`}
          className="mt-6 flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary-soft px-5 py-4 transition-colors hover:border-primary"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-ink">
            <Icon d={I.play} className="h-4 w-4" filled />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Continue {testName(current)}</span>
            <span className="text-sm text-muted">
              {MODULE_INFO[session.modules[session.module] as ModuleId]?.label} · module {session.module + 1} of {session.modules.length}
            </span>
          </span>
          <Icon d={I.chevronR} className="h-5 w-5 text-primary" />
        </Link>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(
          [
            ["all", "All tests"],
            ["full", "R&W + Math"],
            ["rw", "R&W only"],
          ] as const
        ).map(([v, label]) => (
          <button key={v} type="button" onClick={() => setFilter(v)} aria-pressed={filter === v} className={chip(filter === v)}>
            {label}
          </button>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
        <button type="button" onClick={() => setYear("all")} aria-pressed={year === "all"} className={chip(year === "all")}>
          Any year
        </button>
        {years.map((y) => (
          <button key={y} type="button" onClick={() => setYear(y)} aria-pressed={year === y} className={chip(year === y)}>
            {y}
          </button>
        ))}
      </div>

      {groups.length === 0 && <p className="mt-10 text-muted">No tests match these filters.</p>}

      {groups.map((g) => (
        <section key={g.year} className="mt-10">
          <h2 className="flex items-baseline gap-2 text-xl font-semibold">
            {g.year} <span className="text-sm font-normal text-muted">{g.tests.length} tests</span>
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.tests.map((t) => {
              const score = last.get(t.id);
              return (
                <Link
                  key={t.id}
                  href={`/test/${t.id}`}
                  className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{MONTHS[t.month - 1]}</p>
                      <p className="text-sm text-muted">
                        {t.version === "US" ? "US" : "International"} · Form {t.form}
                      </p>
                    </div>
                    {score !== undefined && (
                      <span className="rounded-lg bg-success-soft px-2 py-1 text-sm font-bold text-success tabular-nums" title="Your last score">
                        {score}
                      </span>
                    )}
                  </div>
                  {/* Only what differs between cards; the shared facts are in the header. */}
                  {(t.sections.length === 1 || !t.reviewed) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      {t.sections.length === 1 && <span className="rounded-md bg-surface-2 px-2 py-0.5 font-semibold">R&amp;W only</span>}
                      {!t.reviewed && <span className="text-muted">Explanations coming</span>}
                    </div>
                  )}
                  <span className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-semibold transition-colors group-hover:bg-primary group-hover:text-primary-ink">
                      {score !== undefined ? "Retake or review" : "Start test"}
                      <Icon d={I.chevronR} className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
