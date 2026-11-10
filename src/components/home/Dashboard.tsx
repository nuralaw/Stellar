"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { computeStats } from "@/lib/stats";
import { SectionCard, TopicBreakdown } from "./Breakdown";
import { StudyCalendar } from "./StudyCalendar";
import { upcomingSatDates } from "@/lib/sat-dates";
import { effectiveZone, todayIn } from "@/lib/timezone";
import { AccuracyDonut } from "./AccuracyDonut";
import { Countdown } from "./Countdown";
import { ScoreChart } from "./ScoreChart";
import { SatDatePicker } from "./SatDatePicker";
import { isFullTest, updateProfile, useAttempts, useHydrated, useNow, useProfile, useTestResults } from "@/lib/store";
import type { SectionId } from "@/lib/taxonomy";

const SCORE_PRESETS = [1200, 1300, 1400, 1500];

function greeting(now: number) {
  const h = new Date(now).getHours();
  return h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 ${className}`}>{children}</div>;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
}

function EmptyChart({ text, href = "/practice", link = "Start practicing" }: { text: string; href?: string; link?: string }) {
  return (
    <div className="grid h-44 place-content-center rounded-xl border border-dashed border-line px-6 text-center">
      <p className="text-sm text-muted">{text}</p>
      <Link href={href} className="mt-2 text-sm font-semibold text-primary hover:underline">
        {link} →
      </Link>
    </div>
  );
}

// ---------- goals editor ----------

function GoalsForm({ onDone }: { onDone: () => void }) {
  const profile = useProfile();
  const now = useNow();
  const official = upcomingSatDates(todayIn(effectiveZone(profile.testTimeZone), now || 0));
  const [score, setScore] = useState(profile.targetScore?.toString() ?? "");
  const [date, setDate] = useState(profile.testDate ?? "");
  const n = Number(score);
  const scoreValid = score === "" || (Number.isInteger(n) && n >= 400 && n <= 1600 && n % 10 === 0);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreValid) return;
    updateProfile({ targetScore: score === "" ? null : n, testDate: date || null });
    onDone();
  };

  return (
    <form onSubmit={save} className="rounded-2xl border border-primary/40 bg-surface p-5">
      <h3 className="font-semibold">Your SAT goal</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="target" className="text-sm font-medium text-muted">
            Target score (400–1600)
          </label>
          <input
            id="target"
            type="number"
            min={400}
            max={1600}
            step={10}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 1400"
            className={`mt-2 block w-full rounded-xl border bg-bg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary ${scoreValid ? "border-line" : "border-danger"}`}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SCORE_PRESETS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScore(String(s))}
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  score === String(s) ? "border-primary bg-primary-soft text-primary" : "border-line text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {!scoreValid && <p className="mt-2 text-xs text-danger">Enter a multiple of 10 between 400 and 1600.</p>}
        </div>
        <div>
          <label htmlFor="testdate" className="text-sm font-medium text-muted">
            Test date
          </label>
          <SatDatePicker value={date} onChange={setDate} dates={official} />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
          Save goal
        </button>
        <button type="button" onClick={onDone} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:text-ink">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------- main ----------

export function Dashboard() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const attempts = useAttempts();
  const [editing, setEditing] = useState(false);
  const now = useNow(); // 0 during server prerender
  const stats = computeStats(attempts, now);
  const hasGoal = profile.targetScore !== null || profile.testDate !== null;
  const tests = useTestResults();
  const history = useMemo(() => tests.filter(isFullTest).sort((a, b) => a.at - b.at), [tests]);
  const latest = history[history.length - 1];
  const change = history.length > 1 ? latest.total - history[0].total : null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-6 md:px-8 md:pt-14">
      {/* Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/profile" title="Edit profile" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent-soft text-3xl">
            {hydrated ? profile.avatar : ""}
          </Link>
          <div>
            {hydrated ? (
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {greeting(now)}
                {profile.name ? `, ${profile.name}` : ""}
              </h1>
            ) : (
              <Skeleton className="h-8 w-64" />
            )}
            <p className="mt-1 text-muted">Here&apos;s your progress.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/practice" className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
            Practice now
          </Link>
          <Link href="/test" className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold transition-colors hover:bg-surface-2">
            Practice test
          </Link>
        </div>
      </div>

      {/* Test-day countdown */}
      <div className="mt-8">
        {hydrated ? (
          <Countdown testDate={profile.testDate} testTimeZone={profile.testTimeZone} onPickDate={() => setEditing(true)} />
        ) : (
          <Skeleton className="h-40 rounded-2xl" />
        )}
      </div>

      {/* Headline numbers */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-sm font-medium text-muted">Latest test score</p>
          {!hydrated ? (
            <Skeleton className="mt-3 h-10 w-24" />
          ) : latest ? (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{latest.total}</p>
              <p className="mt-1 text-xs text-muted">
                {change === null || change === 0 ? `practice test #${history.length}` : `${change > 0 ? "+" : "−"}${Math.abs(change)} since your first test`}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight text-muted">—</p>
              <Link href="/test" className="mt-1 block text-xs font-medium text-primary hover:underline">
                take a practice test →
              </Link>
            </>
          )}
        </Card>

        <Card>
          <p className="text-sm font-medium text-muted">Target score</p>
          {!hydrated ? (
            <Skeleton className="mt-3 h-10 w-24" />
          ) : profile.targetScore === null ? (
            <button type="button" onClick={() => setEditing(true)} className="mt-3 text-left font-semibold text-primary hover:underline">
              Set a target score →
            </button>
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{profile.targetScore}</p>
              <p className="mt-1 text-xs text-muted">
                {latest ? (latest.total >= profile.targetScore ? "reached 🎉" : `${profile.targetScore - latest.total} to go`) : "out of 1600"}
              </p>
            </>
          )}
        </Card>

        <Card>
          <p className="text-sm font-medium text-muted">Questions answered</p>
          {!hydrated ? (
            <Skeleton className="mt-3 h-10 w-24" />
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{stats.overall.answered.toLocaleString("en-US")}</p>
              <p className="mt-1 text-xs text-muted">{stats.today} today</p>
            </>
          )}
        </Card>

        <Card>
          <p className="text-sm font-medium text-muted">Study streak</p>
          {!hydrated ? (
            <Skeleton className="mt-3 h-10 w-24" />
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">
                {stats.streak}
                <span className="ml-1.5 text-base font-medium text-muted">{stats.streak === 1 ? "day" : "days"}</span>
              </p>
              <p className="mt-1 text-xs text-muted">{stats.today ? "keep it going" : "practice today to keep it"}</p>
            </>
          )}
        </Card>
      </div>

      {hydrated && (
        <div className="mt-3 flex justify-end">
          {!editing && hasGoal && (
            <button type="button" onClick={() => setEditing(true)} className="text-sm font-medium text-muted hover:text-ink">
              Edit goal
            </button>
          )}
        </div>
      )}
      {editing && (
        <div className="mt-2">
          <GoalsForm onDone={() => setEditing(false)} />
        </div>
      )}

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <h2 className="font-semibold">Score trend</h2>
          <p className="mt-0.5 text-xs text-muted">Your total score on each practice test (400–1600)</p>
          <div className="mt-4">
            {!hydrated ? (
              <Skeleton className="h-60 rounded-xl" />
            ) : history.length ? (
              <ScoreChart points={history} target={profile.targetScore} />
            ) : (
              <EmptyChart text="Your score trend appears after your first practice test." href="/test" link="Take a practice test" />
            )}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Correct vs incorrect</h2>
          <p className="mt-0.5 text-xs text-muted">Every question you&apos;ve answered</p>
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

      {/* Study calendar */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <div className="mb-4">
          <h2 className="font-semibold">Study calendar</h2>
          <p className="mt-0.5 text-xs text-muted">Questions you answered each day, with official SAT dates and your test day</p>
        </div>
        {hydrated ? <StudyCalendar days={stats.days} now={now} testDate={profile.testDate} /> : <Skeleton className="h-96 rounded-xl" />}
      </div>

      {/* By section */}
      <h2 className="mt-8 font-semibold">By section</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {hydrated ? (
          (["rw", "math"] as SectionId[]).map((s) => <SectionCard key={s} s={s} stats={stats} />)
        ) : (
          <>
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </>
        )}
      </div>

      {/* By topic */}
      <div className="mt-6">{hydrated ? <TopicBreakdown stats={stats} /> : <Skeleton className="h-[40rem] rounded-2xl" />}</div>

      <p className="mt-4 text-xs text-muted">Progress is saved in this browser. Sign-in to sync across devices is coming soon.</p>
    </section>
  );
}
