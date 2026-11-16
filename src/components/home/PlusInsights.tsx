"use client";

import Link from "next/link";
import { useMemo } from "react";
import { I, Icon } from "@/components/bank/icons";
import { PlusLock } from "@/components/PlusLock";
import { ExampleChip } from "@/components/plus/PlusMark";
import { DOMAINS } from "@/lib/taxonomy";
import { SAMPLE_HISTORY, SAMPLE_SCORE, SAMPLE_STATS, SAMPLE_TARGET } from "@/lib/plus-sample";
import type { computeStats } from "@/lib/stats";
import { useHydrated, type TestResult } from "@/lib/store";
import { CountUp } from "./CountUp";
import { Card, Skeleton, enter } from "./parts";

type Stats = ReturnType<typeof computeStats>;

const RANGE = 40;
const MIN_ANSWERED = 5;
const MAX_WEAK = 5;

/** Average of the latest (up to) 3 full-test totals, rounded to the nearest 10. `history` is oldest first. */
export function predictScore(history: TestResult[]) {
  const last = history.slice(-3);
  if (!last.length) return null;
  const avg = last.reduce((n, t) => n + t.total, 0) / last.length;
  return { score: Math.min(1600, Math.max(400, Math.round(avg / 10) * 10)), tests: last.length };
}

function Predicted({ history, target }: { history: TestResult[]; target: number | null }) {
  const p = predictScore(history);
  const lo = p && Math.max(400, p.score - RANGE);
  const hi = p && Math.min(1600, p.score + RANGE);
  return (
    <Card {...enter(0)}>
      <h3 className="font-semibold">Predicted score</h3>
      <p className="mt-0.5 text-[13px] text-muted">From your latest full practice tests</p>
      {p ? (
        <div className="mt-4">
          <p className="text-5xl font-bold tracking-tight tabular-nums">
            <span className="mr-1 text-3xl font-semibold text-muted">≈</span>
            <CountUp value={p.score} duration={1000} />
          </p>
          <p className="mt-2 text-sm text-muted tabular-nums">
            Likely range {lo}–{hi} · based on {p.tests} {p.tests === 1 ? "test" : "tests"}
          </p>
          {target !== null && (
            <p className="mt-3 text-sm tabular-nums">
              {p.score >= target ? (
                <span className="font-medium text-success">On track for your target of {target}</span>
              ) : (
                <span className="text-muted">
                  <span className="font-semibold text-ink">{target - p.score}</span> points to your target of {target}
                </span>
              )}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4 grid h-36 place-content-center rounded-xl border border-dashed border-line px-6 text-center">
          <p className="text-sm text-muted">Take a practice test to get a prediction.</p>
          <Link href="/test" className="mt-2 text-sm font-semibold text-primary hover:underline">
            Practice tests →
          </Link>
        </div>
      )}
    </Card>
  );
}

function WeakSkills({ stats }: { stats: Stats }) {
  const weak = useMemo(
    () =>
      stats.byDomain
        .flatMap((d) => d.skills.map((s) => ({ ...s, section: d.domain.section })))
        .filter((s) => s.answered >= MIN_ANSWERED && s.accuracy !== null)
        .sort((a, b) => a.accuracy! - b.accuracy! || b.answered - a.answered)
        .slice(0, MAX_WEAK),
    [stats],
  );
  return (
    <Card {...enter(1)}>
      <h3 className="font-semibold">Weak skills</h3>
      <p className="mt-0.5 text-[13px] text-muted">Lowest accuracy, among skills you&apos;ve answered {MIN_ANSWERED}+ times</p>
      {weak.length ? (
        <ul className="mt-3 divide-y divide-line">
          {weak.map((s) => (
            <li key={s.skill.id}>
              <Link
                href={`/practice?section=${s.section}&skills=${s.skill.id}&status=new&practice=10`}
                className="group flex items-center gap-3 py-2.5"
                title={`Practice ${s.skill.name}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium group-hover:text-primary">{s.skill.name}</span>
                  <span className="text-xs text-muted tabular-nums">
                    {s.accuracy}% · {s.correct}/{s.answered} correct
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold transition-colors group-hover:bg-surface-2">
                  Practice
                  <Icon d={I.chevronR} className="h-3 w-3 text-muted" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 grid h-36 place-content-center rounded-xl border border-dashed border-line px-6 text-center">
          <p className="text-sm text-muted">Answer {MIN_ANSWERED}+ questions in a skill and your weakest ones show up here.</p>
          <Link href="/practice" className="mt-2 text-sm font-semibold text-primary hover:underline">
            Start practicing →
          </Link>
        </div>
      )}
    </Card>
  );
}

/** The two Plus-only cards: predicted score and weak skills. */
export function PlusInsights({ stats, history, target }: { stats: Stats; history: TestResult[]; target: number | null }) {
  return (
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      <Predicted history={history} target={target} />
      <WeakSkills stats={stats} />
    </div>
  );
}

/** The real Predicted + Weak skills cards on sample data, inert and labelled "Example" (/plus and /statistics). */
export function SampleInsights({ className = "" }: { className?: string }) {
  const hydrated = useHydrated();
  return (
    <figure className={`rounded-2xl border border-dashed border-line p-3 sm:p-4 ${className}`}>
      <figcaption className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
        <ExampleChip /> Sample data. Yours shows here with Plus.
      </figcaption>
      <p className="sr-only">
        Example preview with sample numbers, not your data: a predicted score of about {SAMPLE_SCORE.score}, likely range {SAMPLE_SCORE.lo} to {SAMPLE_SCORE.hi}, and five sample weak skills.
      </p>
      {hydrated ? (
        <div inert aria-hidden="true">
          <PlusInsights stats={SAMPLE_STATS} history={SAMPLE_HISTORY} target={SAMPLE_TARGET} />
        </div>
      ) : (
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      )}
    </figure>
  );
}

/** Free users on /statistics: the real cards on sample data + one row with honest teasers from their own counts (never their values). */
export function PlusInsightsPreview({ stats, history }: { stats: Stats; history: TestResult[] }) {
  const ready = stats.byDomain.flatMap((d) => d.skills).filter((s) => s.answered >= MIN_ANSWERED).length;
  const skills = DOMAINS.flatMap((d) => d.skills).length;
  const n = history.length;
  return (
    <>
      <SampleInsights className="mt-3" />
      <PlusLock
        variant="row"
        feature="insights"
        headingLevel={3}
        className="mt-4"
        title={n > 0 ? `Plus can predict your score from your ${n} full practice ${n === 1 ? "test" : "tests"}` : "Take one full practice test and Plus predicts your score"}
        fact={`Plus also ranks your weakest skills and breaks down all ${skills} skills by topic.${ready ? ` ${ready} of your skills already have enough answers to rank.` : ""}`}
      />
    </>
  );
}
