"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { computeStats } from "@/lib/stats";
import { StudyCalendar } from "./StudyCalendar";
import { upcomingSatDates } from "@/lib/sat-dates";
import { effectiveZone, todayIn } from "@/lib/timezone";
import { Countdown } from "./Countdown";
import { SatDatePicker } from "./SatDatePicker";
import { Card, EmptyChart, Skeleton, milestone } from "./parts";
import { TargetChart } from "./TargetChart";
import { STATS_ICON } from "@/lib/nav";
import { isFullTest, updateProfile, useAttempts, useHydrated, useNow, useProfile, useTestResults } from "@/lib/store";
import { SECTIONS, type SectionId } from "@/lib/taxonomy";
import { DAILY_GOAL, PAGE, estMinutes } from "@/lib/ui";
import { SyncNudge } from "@/components/SyncNudge";
import { Avatar } from "@/components/Avatar";
import { useAccess } from "@/lib/access";
import { reviewQueue, type MistakeCard } from "@/lib/review";

const SCORE_PRESETS = [1200, 1300, 1400, 1500];

function greeting(now: number) {
  const h = new Date(now).getHours();
  return h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/** Per-browser "don't show again" flags (checklist, first-run plan). */
function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
function writeFlag(key: string) {
  try {
    localStorage.setItem(key, "1");
  } catch {}
}
const CHECKLIST_KEY = "stellar:checklist-dismissed";
const PLAN_KEY = "stellar:plan-skipped";

type Stats = ReturnType<typeof computeStats>;
const SET_SIZE = 10;

/** The one set we'd suggest right now: due mistakes (Plus only) -> weakest skill -> weakest domain -> new questions in the chosen section. */
function nextUp(stats: Stats, focus: SectionId | null, due: MistakeCard[], canReview: boolean) {
  if (canReview && due.length) {
    const math = due.filter((c) => c.section === "math").length;
    return {
      href: "/mistakes?review=1",
      title: `Review ${due.length} ${due.length === 1 ? "mistake" : "mistakes"}`,
      why: "Due today — reviewing on time is what makes them stick",
      section: (math === due.length ? "math" : math ? "mixed" : "rw") as SectionId | "mixed",
      count: due.length,
      cta: `Review ${due.length}`,
    };
  }
  const f = stats.focus[0];
  if (f)
    return {
      href: `/practice?section=${f.domain.section}&skills=${f.skill.id}&status=new&practice=${SET_SIZE}`,
      title: f.skill.name,
      why: `${f.accuracy}% correct so far — your weakest topic`,
      section: f.domain.section as SectionId | "mixed",
      count: SET_SIZE,
      cta: `Practice ${SET_SIZE} questions`,
    };
  const d = stats.weakest;
  if (d && (d.accuracy ?? 100) < 75)
    return {
      href: `/practice?section=${d.domain.section}&domain=${d.domain.id}&status=new&practice=${SET_SIZE}`,
      title: d.domain.name,
      why: `${d.accuracy}% correct so far — your weakest area`,
      section: d.domain.section as SectionId | "mixed",
      count: SET_SIZE,
      cta: `Practice ${SET_SIZE} questions`,
    };
  const sec: SectionId = focus ?? (stats.bySection.rw.answered > stats.bySection.math.answered ? "math" : "rw");
  return {
    href: `/practice?section=${sec}&status=new&practice=${SET_SIZE}`,
    title: `New ${SECTIONS[sec].name} questions`,
    why: stats.overall.answered ? "Fresh questions you haven't seen yet" : "A mixed first set to find your strong and weak spots",
    section: sec as SectionId | "mixed",
    count: SET_SIZE,
    cta: `Practice ${SET_SIZE} questions`,
  };
}

/** Hours left until local midnight. */
function hoursToMidnight(now: number) {
  const d = new Date(now);
  d.setHours(24, 0, 0, 0);
  return Math.max(1, Math.ceil((d.getTime() - now) / 3_600_000));
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

// ---------- today ----------

function TodayCard({ stats, next, now }: { stats: Stats; next: ReturnType<typeof nextUp>; now: number }) {
  const done = Math.min(stats.today, DAILY_GOAL);
  const pct = Math.round((done / DAILY_GOAL) * 100);
  const atRisk = stats.streak > 0 && stats.today === 0;
  return (
    <div className="grid gap-5 rounded-2xl border border-line bg-surface p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-muted">Today&apos;s goal</p>
          <p className="text-sm font-medium text-primary-strong">{stats.today >= DAILY_GOAL ? "Done 🎉" : `${DAILY_GOAL - stats.today} to go`}</p>
        </div>
        <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
          {stats.today}
          <span className="text-base font-medium text-muted"> / {DAILY_GOAL} questions</span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className={`mt-2 text-[13px] ${atRisk ? "font-medium text-primary-strong" : "text-muted"}`}>
          {atRisk
            ? `Your ${stats.streak}-day streak ends in ${hoursToMidnight(now)} h — one question keeps it.`
            : stats.streak > 0
              ? `${stats.streak}-day streak · keep it going`
              : "Answer one question today to start a streak."}
        </p>
      </div>
      <div className="flex flex-col justify-between gap-4 md:border-l md:border-line md:pl-8">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">Next up</p>
          <p className="mt-1 text-lg font-semibold">{next.title}</p>
          <p className="text-[13px] text-muted">{next.why}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={next.href} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
            {next.cta}
          </Link>
          <span className="text-[13px] text-muted">about {estMinutes(next.count, next.section)} min</span>
        </div>
      </div>
    </div>
  );
}

// ---------- getting started ----------

interface Step {
  label: string;
  done: boolean;
  action: React.ReactNode;
}

function GettingStarted({ steps, onDismiss }: { steps: Step[]; onDismiss: () => void }) {
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Get set up</h2>
          <p className="mt-0.5 text-[13px] text-muted tabular-nums">
            {done} of {steps.length} done · {pct}%
          </p>
        </div>
        <button type="button" onClick={onDismiss} className="rounded-lg px-2 py-1 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
          Hide
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s) => (
          <li key={s.label} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${s.done ? "bg-surface-2/50" : "border border-line"}`}>
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${s.done ? "bg-primary text-primary-ink" : "border-2 border-line"}`} aria-hidden="true">
              {s.done && <CheckIcon />}
            </span>
            <span className="min-w-0 flex-1 text-sm">{s.done ? <span className="text-muted">{s.label}</span> : s.action}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- goals editor ----------

function GoalsForm({ onDone, firstRun = false }: { onDone: () => void; firstRun?: boolean }) {
  const profile = useProfile();
  const [focus, setFocus] = useState<SectionId | null>(profile.focusSection);
  const now = useNow();
  const official = upcomingSatDates(todayIn(effectiveZone(profile.testTimeZone), now || 0));
  const [score, setScore] = useState(profile.targetScore?.toString() ?? "");
  const [date, setDate] = useState(profile.testDate ?? "");
  const n = Number(score);
  const scoreValid = score === "" || (Number.isInteger(n) && n >= 400 && n <= 1600 && n % 10 === 0);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreValid) return;
    updateProfile({ targetScore: score === "" ? null : n, testDate: date || null, focusSection: focus });
    onDone();
  };

  return (
    <form onSubmit={save} className="rounded-2xl border border-primary/40 bg-surface p-5">
      <h3 className="text-lg font-semibold">{firstRun ? "Build your study plan" : "Your SAT goal"}</h3>
      {firstRun && <p className="mt-1 text-sm text-muted">Three quick choices and your dashboard is set up around you. No account needed.</p>}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  score === String(s) ? "border-primary bg-primary-soft text-primary-strong" : "border-line text-muted hover:text-ink"
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
        <div>
          <p className="text-sm font-medium text-muted" id="focus-label">
            Which section needs more work?
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby="focus-label">
            {(
              [
                ["rw", "Reading & Writing"],
                ["math", "Math"],
                [null, "Not sure"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={focus === v}
                onClick={() => setFocus(v)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                  focus === v ? "border-primary bg-primary-soft text-primary-strong" : "border-line text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
          {firstRun ? "Save my plan" : "Save goal"}
        </button>
        <button type="button" onClick={onDone} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:text-ink">
          {firstRun ? "Skip for now" : "Cancel"}
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
  const [, rerender] = useState(0);
  const now = useNow(); // 0 during server prerender
  const stats = computeStats(attempts, now);
  const hasGoal = profile.targetScore !== null || profile.testDate !== null;
  const tests = useTestResults();
  const history = useMemo(() => tests.filter(isFullTest).sort((a, b) => a.at - b.at), [tests]);
  const latest = history[history.length - 1];
  const change = history.length > 1 ? latest.total - history[0].total : null;
  const due = useMemo(() => (now ? reviewQueue(attempts, now).due : []), [attempts, now]);
  const access = useAccess();
  // Not "ready" yet counts as no: never flash a Plus-only link at a free user.
  const next = nextUp(stats, profile.focusSection, due, access.ready && access.can("mistake-review"));

  // Brand-new student: open "Build your plan" right away (until saved or skipped).
  const firstRun = hydrated && !hasGoal && attempts.length === 0 && !readFlag(PLAN_KEY);
  const planOpen = editing || firstRun;
  const closePlan = () => {
    if (firstRun) writeFlag(PLAN_KEY);
    setEditing(false);
    rerender((n) => n + 1);
  };
  const openPlan = () => {
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Getting started: the first step is already done, so nobody starts at 0%.
  const steps: Step[] = [
    { label: "Open your study space", done: true, action: null },
    {
      label: "Pick your test date",
      done: profile.testDate !== null,
      action: (
        <button type="button" onClick={openPlan} className="text-left font-medium hover:text-primary-strong">
          Pick your test date →
        </button>
      ),
    },
    {
      label: "Set a target score",
      done: profile.targetScore !== null,
      action: (
        <button type="button" onClick={openPlan} className="text-left font-medium hover:text-primary-strong">
          Set a target score →
        </button>
      ),
    },
    {
      label: "Answer 10 questions",
      done: attempts.length >= 10,
      action: (
        <Link href={next.href} className="font-medium hover:text-primary-strong">
          Answer 10 questions ({Math.min(attempts.length, 10)}/10) →
        </Link>
      ),
    },
    {
      label: "Take a practice test",
      done: tests.length > 0,
      action: (
        <Link href="/test" className="font-medium hover:text-primary-strong">
          Take a practice test →
        </Link>
      ),
    },
  ];
  const showChecklist = hydrated && steps.some((s) => !s.done) && !readFlag(CHECKLIST_KEY);

  const tile = "mt-1 text-[13px] text-muted";

  return (
    <section className={PAGE}>
      {/* Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/profile" title="Edit profile" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent-soft text-3xl">
            {hydrated ? <Avatar value={profile.avatar} className="h-14 w-14 text-3xl" /> : ""}
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
        <Link href="/test" className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold transition-colors hover:bg-surface-2">
          Practice test
        </Link>
      </div>

      {planOpen && (
        <div className="mt-8">
          <GoalsForm onDone={closePlan} firstRun={firstRun && !editing} />
        </div>
      )}

      {showChecklist && !firstRun && (
        <div className="mt-8">
          <GettingStarted
            steps={steps}
            onDismiss={() => {
              writeFlag(CHECKLIST_KEY);
              rerender((n) => n + 1);
            }}
          />
        </div>
      )}

      {/* Today: daily goal + the one set we suggest */}
      <div className="mt-8">{hydrated ? <TodayCard stats={stats} next={next} now={now} /> : <Skeleton className="h-36 rounded-2xl" />}</div>

      {/* Test-day countdown */}
      <div className="mt-4">
        {hydrated ? (
          <Countdown testDate={profile.testDate} testTimeZone={profile.testTimeZone} />
        ) : (
          <Skeleton className="h-40 rounded-2xl" />
        )}
      </div>

      {/* Headline numbers + a compact study calendar */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="grid grid-cols-2 content-start gap-4 lg:grid-rows-[auto_1fr] lg:content-stretch">
          <Card>
            <p className="text-sm font-medium text-muted">Latest test score</p>
            {!hydrated ? (
              <Skeleton className="mt-3 h-10 w-24" />
            ) : latest ? (
              <>
                <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{latest.total}</p>
                <p className={tile}>
                  {change === null || change === 0 ? `R&W ${latest.rw} · Math ${latest.math}` : `${change > 0 ? "+" : "−"}${Math.abs(change)} since your first test`}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-4xl font-bold tracking-tight text-muted">—</p>
                <Link href="/test" className="mt-1 block text-[13px] font-medium text-primary-strong hover:underline">
                  take a practice test →
                </Link>
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
                <p className={stats.streak > 0 && !stats.today ? "mt-1 text-[13px] font-medium text-primary-strong" : tile}>
                  {stats.today ? "kept today ✓" : stats.streak > 0 ? `ends in ${hoursToMidnight(now)} h` : "start one today"}
                </p>
              </>
            )}
          </Card>

          <Card className="col-span-2 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-muted">Target score</p>
              {hydrated && hasGoal && !planOpen && (
                <button type="button" onClick={openPlan} className="-mt-1 -mr-2 rounded-lg px-2 py-1 text-[13px] font-medium text-muted hover:bg-surface-2 hover:text-ink">
                  Edit
                </button>
              )}
            </div>
            {!hydrated ? (
              <Skeleton className="mt-2 h-8 w-24" />
            ) : profile.targetScore === null ? (
              <button type="button" onClick={openPlan} className="mt-2 w-fit text-left font-semibold text-primary-strong hover:underline">
                Set a target score →
              </button>
            ) : (
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2.5">
                <span className="text-2xl font-bold tracking-tight tabular-nums">{profile.targetScore}</span>
                <span className="text-[13px] text-muted">
                  {!latest
                    ? "out of 1600"
                    : latest.total >= profile.targetScore
                      ? "reached 🎉"
                      : `next milestone ${milestone(latest.total, profile.targetScore)} (+${milestone(latest.total, profile.targetScore) - latest.total})`}
                </span>
              </p>
            )}
            {/* The chart fills what's left of the card (at least 180px; on wide screens the card is as tall as the calendar). */}
            <div className="relative mt-3 min-h-[180px] flex-1">
              {!hydrated ? (
                <Skeleton className="absolute inset-0 rounded-xl" />
              ) : history.length === 0 ? (
                <EmptyChart text="Your practice test scores will show up here, next to your target." href="/test" link="Take a practice test" />
              ) : (
                <TargetChart points={history} target={profile.targetScore} />
              )}
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="font-semibold">Study calendar</h2>
          <p className="mt-0.5 text-[13px] text-muted">Questions answered each day</p>
          <div className="mt-4">{hydrated ? <StudyCalendar days={stats.days} now={now} testDate={profile.testDate} compact /> : <Skeleton className="h-80 rounded-xl" />}</div>
        </Card>
      </div>

      {/* Ask to sign in only once there's progress worth keeping */}
      <div className="mt-4 empty:hidden">
        <SyncNudge />
      </div>

      {/* Everything else lives on /statistics */}
      <Link
        href="/statistics"
        className="group mt-4 flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-muted"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted group-hover:text-ink" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={STATS_ICON} />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Statistics</span>
          <span className="mt-0.5 block text-[13px] text-muted">
            {hydrated && stats.overall.answered
              ? `${stats.overall.answered.toLocaleString("en-US")} questions · ${stats.overall.accuracy}% correct · score trend and sections`
              : "Score trend, accuracy and sections"}
          </span>
        </span>
        <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true">
          →
        </span>
      </Link>
    </section>
  );
}
