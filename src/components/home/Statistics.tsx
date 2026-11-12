"use client";

import Link from "next/link";
import { useMemo } from "react";
import { computeStats } from "@/lib/stats";
import { isFullTest, useAttempts, useHydrated, useNow, useProfile, useTestResults, type TestResult } from "@/lib/store";
import type { SectionId } from "@/lib/taxonomy";
import { PAGE } from "@/lib/ui";
import { AccuracyDonut } from "./AccuracyDonut";
import { CountUp } from "./CountUp";
import { SectionCard, TopicBreakdown } from "./Breakdown";
import { Reveal } from "./Reveal";
import { ScoreChart } from "./ScoreChart";
import { Card, EmptyChart, Skeleton, enter, milestone } from "./parts";

/** One test so far: show the score instead of a one-point chart. */
function FirstScore({ r, target }: { r: TestResult; target: number | null }) {
  return (
    <div className="flex h-60 flex-col justify-between rounded-xl bg-surface-2/40 p-5">
      <div>
        <p className="text-[13px] text-muted">Your first practice test</p>
        <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums">
          <CountUp value={r.total} delay={200} duration={1200} />
        </p>
        <p className="mt-2 text-sm text-muted tabular-nums">
          Reading and Writing <span className="font-semibold text-ink">{r.rw}</span> · Math <span className="font-semibold text-ink">{r.math}</span>
          {target !== null && r.total < target && (
            <>
              {" "}
              · next milestone <span className="font-semibold text-ink">{milestone(r.total, target)}</span>
            </>
          )}
        </p>
      </div>
      <p className="text-sm text-muted">
        Take one more test to see your trend.{" "}
        <Link href="/test" className="font-semibold text-primary hover:underline">
          Practice tests →
        </Link>
      </p>
    </div>
  );
}

/** Everything about the student's progress: totals, score trend, accuracy, sections and topics. */
export function Statistics() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const attempts = useAttempts();
  const now = useNow();
  const stats = computeStats(attempts, now);
  const tests = useTestResults();
  const history = useMemo(() => tests.filter(isFullTest).sort((a, b) => a.at - b.at), [tests]);
  const latest = history[history.length - 1];
  const best = history.reduce((m, t) => Math.max(m, t.total), 0);
  const bestDay = Math.max(0, ...[...stats.days.values()].map((d) => d.answered));
  const tile = "mt-1 text-[13px] text-muted";

  return (
    <section className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Statistics</h1>
      <p className="mt-2 text-muted">How your practice is going: totals, score trend, and your strong and weak topics.</p>

      {/* Totals */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card {...enter(0)}>
          <p className="text-sm font-medium text-muted">Questions answered</p>
          {!hydrated ? (
            <Skeleton className="mt-3 h-10 w-24" />
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">
                <CountUp value={stats.overall.answered} />
              </p>
              <p className={tile}>{stats.overall.answered ? `R&W ${stats.bySection.rw.answered} · Math ${stats.bySection.math.answered}` : "none yet"}</p>
            </>
          )}
        </Card>
        <Card {...enter(1)}>
          <p className="text-sm font-medium text-muted">Active days</p>
          {!hydrated ? (
            <Skeleton className="mt-3 h-10 w-24" />
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">
                <CountUp value={stats.days.size} delay={80} />
              </p>
              <p className={tile}>{bestDay ? `best day: ${bestDay} questions` : "no study days yet"}</p>
            </>
          )}
        </Card>
        <Card className="lesson-in col-span-2 lg:col-span-1" style={{ animationDelay: "140ms" }}>
          <p className="text-sm font-medium text-muted">Practice tests</p>
          {!hydrated ? (
            <Skeleton className="mt-3 h-10 w-24" />
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">
                <CountUp value={history.length} delay={160} />
              </p>
              {history.length ? (
                <p className={tile}>best score {best}</p>
              ) : (
                <Link href="/test" className="mt-1 block text-[13px] font-medium text-primary hover:underline">
                  take a practice test →
                </Link>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card {...enter(3)}>
          <h2 className="font-semibold">Score trend</h2>
          <p className="mt-0.5 text-[13px] text-muted">Your total score on each practice test (400–1600)</p>
          <div className="mt-4">
            {!hydrated ? (
              <Skeleton className="h-60 rounded-xl" />
            ) : history.length > 1 ? (
              <ScoreChart points={history} target={profile.targetScore} />
            ) : latest ? (
              <FirstScore r={latest} target={profile.targetScore} />
            ) : (
              <EmptyChart text="Your score trend appears after your first practice test." href="/test" link="Take a practice test" />
            )}
          </div>
        </Card>
        <Card {...enter(4)}>
          <h2 className="font-semibold">Correct vs incorrect</h2>
          <p className="mt-0.5 text-[13px] text-muted">Every question you&apos;ve answered</p>
          <div className="mt-4">
            {!hydrated ? (
              <Skeleton className="h-44 rounded-xl" />
            ) : stats.overall.answered ? (
              <AccuracyDonut correct={stats.overall.correct} wrong={stats.overall.answered - stats.overall.correct} />
            ) : (
              <EmptyChart text="Answer questions to see how many you get right." />
            )}
          </div>
        </Card>
      </div>

      {/* By section */}
      <h2 className="mt-8 font-semibold">By section</h2>
      <Reveal className="mt-3 grid gap-4 md:grid-cols-2">
        {hydrated ? (
          (["rw", "math"] as SectionId[]).map((s, i) => <SectionCard key={s} s={s} stats={stats} delay={i * 90} />)
        ) : (
          <>
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </>
        )}
      </Reveal>

      {/* By topic */}
      <Reveal className="mt-6">{hydrated ? <TopicBreakdown stats={stats} /> : <Skeleton className="h-[40rem] rounded-2xl" />}</Reveal>
    </section>
  );
}
