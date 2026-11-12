"use client";

import Link from "next/link";
import { useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { mastery, type computeStats, type Mastery, type Tally } from "@/lib/stats";
import { SECTIONS, type SectionId } from "@/lib/taxonomy";
import { CountUp } from "./CountUp";

type Stats = ReturnType<typeof computeStats>;

const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;

/** Accuracy bar (0–100). A thin track; the fill is the brand color and grows in from the left. */
function Bar({ value, className = "h-2", delay = 0 }: { value: number | null; className?: string; delay?: number }) {
  return (
    <div className={`overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div className="stat-grow h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${value ?? 0}%`, animationDelay: `${delay}ms` }} />
    </div>
  );
}

const MASTERY: Record<Mastery, { label: string; cls: string; icon?: string }> = {
  none: { label: "Not started", cls: "text-muted" },
  new: { label: "Just started", cls: "text-muted" },
  weak: { label: "Needs work", cls: "bg-danger-soft text-danger", icon: "M12 8v5m0 3h.01" },
  fair: { label: "Getting there", cls: "bg-accent-soft text-accent", icon: "M6 12h12" },
  strong: { label: "Strong", cls: "bg-success-soft text-success", icon: I.check },
};

function MasteryPill({ t }: { t: Tally }) {
  const m = MASTERY[mastery(t)];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${m.cls}`}>
      {m.icon && <Icon d={m.icon} className="h-3 w-3" strokeWidth={2.6} />}
      {m.label}
    </span>
  );
}

const pct = (t: Tally) => (t.accuracy === null ? "—" : `${t.accuracy}%`);

/* ---------------- By section ---------------- */

export function SectionCard({ s, stats, delay = 0 }: { s: SectionId; stats: Stats; delay?: number }) {
  const t = stats.bySection[s];
  const peak = Math.max(1, ...t.recent.map((d) => d.answered));
  const last7 = t.recent.slice(7).reduce((n, d) => n + d.answered, 0);
  return (
    <div className="lesson-in rounded-2xl border border-line bg-surface p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{SECTIONS[s].name}</h3>
          <p className="mt-0.5 text-xs text-muted tabular-nums">
            {t.answered.toLocaleString("en-US")} answered · {t.correct.toLocaleString("en-US")} correct
          </p>
        </div>
        <Link href={`/practice?section=${s}`} className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-surface-2">
          Practice
        </Link>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <p className="text-4xl font-bold tracking-tight tabular-nums">{t.accuracy === null ? "—" : <CountUp value={t.accuracy} suffix="%" delay={delay + 150} />}</p>
        <p className="pb-1.5 text-xs text-muted">accuracy</p>
      </div>
      <div className="mt-2">
        <Bar value={t.accuracy} delay={delay + 150} />
      </div>

      {/* By difficulty */}
      <p className="mt-5 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">By difficulty</p>
      <ul className="mt-2 space-y-2.5">
        {t.byDifficulty.map((d, i) => (
          <li key={d.difficulty} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 text-sm">
            <span className="text-muted">{DIFF_LABEL[d.difficulty]}</span>
            <Bar value={d.accuracy} className="h-1.5" delay={delay + 300 + i * 90} />
            <span className="w-20 text-right text-xs tabular-nums">
              <span className="font-semibold">{pct(d)}</span>
              <span className="text-muted"> · {d.correct}/{d.answered}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Last 14 days */}
      <div className="mt-5 flex items-baseline justify-between">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Last 14 days</p>
        <p className="text-xs text-muted tabular-nums">{last7} this week</p>
      </div>
      <div className="mt-2 flex h-14 items-end gap-1" role="img" aria-label={`Questions per day over the last 14 days: ${t.recent.map((d) => d.answered).join(", ")}`}>
        {t.recent.map((d, i) => (
          <div key={d.day} className="group relative flex h-full flex-1 items-end" title={`${new Date(`${d.day}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}: ${d.answered}`}>
            <div
              className={`stat-rise w-full rounded-t-[4px] ${d.answered ? "bg-primary" : "bg-surface-2"} ${i === t.recent.length - 1 ? "" : "opacity-80"} group-hover:opacity-100`}
              style={{ height: d.answered ? `${Math.max(8, (d.answered / peak) * 100)}%` : "3px", animationDelay: `${delay + 450 + i * 35}ms` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>2 weeks ago</span>
        <span>today</span>
      </div>
    </div>
  );
}

/* ---------------- By topic ---------------- */

export function TopicBreakdown({ stats }: { stats: Stats }) {
  const [tab, setTab] = useState<SectionId>("rw");
  const domains = stats.byDomain.filter((d) => d.domain.section === tab);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">By topic</h2>
          <p className="mt-0.5 text-xs text-muted">Accuracy for every domain and skill. Click one to practice it.</p>
        </div>
        <div className="flex rounded-xl border border-line bg-surface-2/60 p-1" role="tablist" aria-label="Section">
          {(["rw", "math"] as SectionId[]).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={tab === s}
              onClick={() => setTab(s)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${tab === s ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {SECTIONS[s].name}
            </button>
          ))}
        </div>
      </div>

      {stats.focus.length > 0 && (
        <div className="mt-5 rounded-xl bg-accent-soft p-4">
          <p className="text-sm font-semibold">Focus next</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {stats.focus.map((f, i) => (
              <li key={f.skill.id} className="lesson-in" style={{ animationDelay: `${i * 70}ms` }}>
                <Link
                  href={`/practice?section=${f.domain.section}&skills=${f.skill.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm transition-colors hover:border-primary/50"
                >
                  <span className="font-medium">{f.skill.name}</span>
                  <span className="text-xs text-muted tabular-nums">
                    {f.accuracy}% · {f.answered}
                  </span>
                  <Icon d={I.chevronR} className="h-3.5 w-3.5 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* keyed by tab: switching sections replays the entrance */}
      <div key={tab} className="mt-5 grid gap-4 md:grid-cols-2">
        {domains.map((d, di) => (
          <section key={d.domain.id} className="lesson-in min-w-0 rounded-xl border border-line p-4" style={{ animationDelay: `${di * 80}ms` }}>
            <div className="flex items-baseline justify-between gap-3">
              <Link href={`/practice?section=${d.domain.section}&domain=${d.domain.id}`} className="font-semibold hover:text-primary">
                {d.domain.name}
              </Link>
              <span className="shrink-0 text-lg font-bold tabular-nums">{pct(d)}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted tabular-nums">
              {d.answered ? `${d.answered} answered · ${d.correct} correct` : "Not started"} · about {d.domain.weight} of the section
            </p>
            <div className="mt-2">
              <Bar value={d.accuracy} delay={di * 80 + 150} />
            </div>
            <ul className="mt-4 space-y-3">
              {d.skills.map((s, si) => (
                <li key={s.skill.id}>
                  <Link href={`/practice?section=${d.domain.section}&skills=${s.skill.id}`} className="group block" title={`Practice ${s.skill.name}`}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 truncate group-hover:text-primary">{s.skill.name}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-xs whitespace-nowrap text-muted tabular-nums">{s.answered ? `${pct(s)} · ${s.answered}` : ""}</span>
                        {/* Phones: the % and bar say enough; only flag the skills that need attention. */}
                        <span className={mastery(s) === "weak" || mastery(s) === "strong" ? "" : "hidden sm:inline"}>
                          <MasteryPill t={s} />
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Bar value={s.accuracy} className="h-1" delay={di * 80 + 250 + si * 60} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
