"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { Skeleton } from "@/components/home/parts";
import { PlusLock } from "@/components/PlusLock";
import { PlusTag } from "@/components/plus/PlusMark";
import { FOCUS } from "@/components/plus/styles";
import { useAccess } from "@/lib/access";
import { canOpenTest } from "@/lib/free-tests";
import { useHydrated, useTestResults, useTestSession, type TestResult } from "@/lib/store";
import { MODULE_INFO, fmtMinutes, minutesOf, monthsLabel, questionCount, testName, type ModuleId, type TestIndexRow } from "@/lib/test-types";
import { PAGE } from "@/lib/ui";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
type Filter = "all" | "full" | "rw";

/** Free students: the free tests, their scores, and the one Plus prompt of this page. */
function FreeBand({ rows, last, results, plusOnly, firstYear }: { rows: TestIndexRow[]; last: Map<string, number>; results: TestResult[]; plusOnly: number; firstYear: number }) {
  const taken = rows.filter((t) => last.has(t.id)).length;
  const fullRows = rows.filter((t) => t.sections.length === 2);
  const exhausted = fullRows.length > 0 && fullRows.every((t) => last.has(t.id));
  const latest = [...results]
    .filter((r) => r.testId && rows.some((t) => t.id === r.testId))
    .sort((a, b) => a.at - b.at)
    .at(-1)?.total;
  const newest = fullRows[0] ?? rows[0];
  return (
    <section aria-labelledby="free-now-title" className="mt-6 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="free-now-title" className="text-lg font-semibold">
          Free right now
        </h2>
        <p className="text-sm text-muted tabular-nums">
          You&apos;ve taken {taken} of {rows.length}
        </p>
      </div>
      <p className="mt-0.5 text-sm text-muted">
        {exhausted && latest !== undefined
          ? `You've taken every free full test. Your latest score: ${latest}.`
          : `${rows.length} tests from ${monthsLabel(rows)}. Free tests move forward when newer papers are added.`}
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rows.map((t) => (
          <li key={t.id}>
            <Link
              href={`/test/${t.id}`}
              className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium transition-colors hover:border-primary-strong/50 ${FOCUS}`}
            >
              <span className="truncate">{testName(t, true)}</span>
              {last.has(t.id) && <span className="shrink-0 rounded-md bg-success-soft px-1.5 py-0.5 text-xs font-bold text-success tabular-nums">{last.get(t.id)}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-line pt-4">
        {exhausted && newest ? (
          <PlusLock
            variant="card"
            feature="tests"
            headingLevel={3}
            title={`Keep going with ${plusOnly} more past papers`}
            body={`Every month back to ${firstYear}, each timed and scored with a full review.`}
            free={{ href: `/test/${newest.id}`, label: "Retake a free test" }}
          />
        ) : (
          <PlusLock variant="row" bare feature="tests" headingLevel={3} title={`${plusOnly} more past papers with Plus`} fact={`Every month back to ${firstYear}, timed and scored the same way.`} />
        )}
      </div>
    </section>
  );
}

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"}`;

export function TestList({ tests, freeIds }: { tests: TestIndexRow[]; freeIds: string[] }) {
  const hydrated = useHydrated();
  const access = useAccess();
  const free = useMemo(() => new Set(freeIds), [freeIds]);
  // Locks and "Free" tags only show once the plan is known (no flash while it loads); the server gates each test itself.
  const locked = (id: string) => access.ready && !canOpenTest(access, id, free);
  const showFree = access.ready && !access.can("all-tests");
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
  const recommended =
    hydrated && access.ready && !current ? tests.find((t) => t.sections.length === 2 && !last.has(t.id) && canOpenTest(access, t.id, free)) : undefined;
  const full = tests.find((t) => t.sections.length === 2);
  const rwOnly = tests.find((t) => t.sections.length === 1);
  const freeRows = tests.filter((t) => free.has(t.id));
  const plusOnly = tests.length - freeRows.length;
  const firstYear = years[years.length - 1];

  return (
    <div className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Practice tests</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {tests.length} past Digital SAT papers from {years[years.length - 1]}–{years[0]}, module by module. Timed like the real test, with an estimated
        score and a question-by-question review.{showFree && ` ${free.size} are free right now.`}
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
          className="group mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-primary/50 sm:flex-row sm:items-center"
        >
          <span className="min-w-0 flex-1">
            <span className="text-sm font-medium text-primary-strong">Recommended next</span>
            <span className="mt-0.5 block text-lg font-semibold">{testName(recommended)}</span>
            <span className="text-sm text-muted">
              The newest full test you haven&apos;t taken · {questionCount(recommended)} questions · {fmtMinutes(minutesOf(recommended))}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors group-hover:bg-primary-hover">
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
          <Icon d={I.chevronR} className="h-5 w-5 text-primary-strong" />
        </Link>
      )}

      {!access.ready && <Skeleton className="mt-6 h-[23rem] rounded-2xl sm:h-[20.75rem]" />}
      {showFree && <FreeBand rows={freeRows} last={last} results={results} plusOnly={plusOnly} firstYear={firstYear} />}

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
              const lock = locked(t.id);
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
                    <div className="mt-1 flex shrink-0 items-center gap-2">
                      {lock && <PlusTag className="text-xs" />}
                      {!lock && showFree && free.has(t.id) && <span className="rounded-md bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">Free</span>}
                      {score !== undefined && (
                        <span className="rounded-lg bg-success-soft px-2 py-1 text-sm font-bold text-success tabular-nums" title="Your last score">
                          {score}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Only what differs between cards; the shared facts are in the header. */}
                  {(t.sections.length === 1 || !t.reviewed) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      {t.sections.length === 1 && <span className="rounded-md bg-surface-2 px-2 py-0.5 font-semibold">R&amp;W only</span>}
                      {!t.reviewed && <span className="text-muted">Explanations coming</span>}
                    </div>
                  )}
                  <span className="mt-auto pt-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                        lock ? "group-hover:bg-line" : "group-hover:bg-primary group-hover:text-primary-ink"
                      }`}
                    >
                      {lock ? "Preview" : score !== undefined ? "Retake or review" : "Start test"}
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
