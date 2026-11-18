import type { ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { Stage } from "@/components/lessons/visuals/Stage";
import type { TestTile } from "@/lib/plus-facts";
import { SAMPLE_HISTORY, SAMPLE_SCORE } from "@/lib/plus-sample";
import { INTERVALS } from "@/lib/review";
import { getSkill } from "@/lib/taxonomy";
import { ExampleChip } from "./PlusMark";

// Static product previews for /plus. Server-safe: no hooks, and no lesson visuals imported here (pages pass them in).

export function ScreenFrame({ label, tone, children }: { label: string; tone: "dark" | "light"; children: ReactNode }) {
  return (
    <div
      className={`lesson-cover overflow-hidden rounded-2xl bg-surface [animation-delay:120ms] ${
        tone === "dark" ? "shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/10" : "shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)] ring-1 ring-line"
      }`}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-line" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-line" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-line" />
        <span className="ml-2 truncate text-[11px] font-medium text-muted">{label}</span>
      </div>
      <Stage className="aspect-[16/9] w-full p-[3%]">{children}</Stage>
    </div>
  );
}

const MINI = "rounded-2xl border border-line bg-surface p-4 text-ink shadow-xl";

export function ScoreMini({ className = "" }: { className?: string }) {
  return (
    <div className={`${MINI} lesson-pop [animation-delay:450ms] ${className}`}>
      <ExampleChip />
      <p className="mt-2 text-[13px] text-muted">Predicted score</p>
      <p className="text-3xl font-bold tracking-tight tabular-nums">≈ {SAMPLE_SCORE.score.toLocaleString("en-US")}</p>
      <p className="text-xs text-muted tabular-nums">
        Likely range {SAMPLE_SCORE.lo.toLocaleString("en-US")}–{SAMPLE_SCORE.hi.toLocaleString("en-US")}
      </p>
      <div className="relative mt-2 h-1.5 rounded-full bg-line" aria-hidden="true">
        <div className="stat-grow absolute inset-y-0 left-[70%] w-[8%] rounded-full bg-primary-strong" />
      </div>
    </div>
  );
}

export function ReviewMini({ className = "" }: { className?: string }) {
  return (
    <div className={`${MINI} lesson-pop [animation-delay:600ms] ${className}`}>
      <ExampleChip />
      <p className="mt-2 text-sm font-semibold">{getSkill("boundaries")?.name} · wrong 1×</p>
      <div className="mt-2 flex items-center gap-1" aria-hidden="true">
        <span className="h-1.5 w-5 rounded-full bg-primary-strong" />
        <span className="h-1.5 w-5 rounded-full bg-line" />
        <span className="h-1.5 w-5 rounded-full bg-line" />
      </div>
      <p className="mt-1 text-xs font-medium text-primary-strong">Back in {INTERVALS[1]} days</p>
    </div>
  );
}

export function TestsPreview({ tiles }: { tiles: TestTile[] }) {
  const sample = SAMPLE_HISTORY[1];
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t, i) => (
          <div key={t.id} className="lesson-in rounded-xl border border-line bg-surface p-4" style={{ animationDelay: `${i * 70}ms` }}>
            <p className="font-semibold">
              {t.month} {t.year}
            </p>
            <p className="text-xs text-muted">
              {t.where} · Form {t.form}
            </p>
            <p className="mt-2 text-xs text-muted tabular-nums">
              {t.questions} questions · {t.minutes}
            </p>
            {t.rwOnly && <span className="mt-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-xs font-semibold text-ink">R&amp;W only</span>}
          </div>
        ))}
      </div>
      <div className="lesson-pop mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-dashed border-line bg-surface p-4 text-sm [animation-delay:350ms]">
        <ExampleChip />
        <span className="font-semibold tabular-nums">Total {sample.total.toLocaleString("en-US")}</span>
        <span className="text-muted tabular-nums">
          R&amp;W {sample.rw} · Math {sample.math} · estimated
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  { icon: I.play, label: "See the idea" },
  { icon: I.layers, label: "Worked example" },
  { icon: I.check, label: "Check yourself" },
  { icon: I.badge, label: "Real SAT questions" },
];

export function StepsStrip() {
  return (
    <ol className="mt-5 flex flex-wrap items-center gap-2">
      {STEPS.map((s, i) => (
        <li key={s.label} className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium ring-1 ring-line">
            <Icon d={s.icon} className="h-4 w-4 text-primary-strong" />
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <span aria-hidden="true" className="text-muted">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

const SUBS = ["Right? It moves on.", "Right again? On to the next.", "Right again: mastered"];

/** The 1 → 3 → 7 day review schedule, drawn from INTERVALS. */
export function ReviewTimeline({ compact = false }: { compact?: boolean }) {
  const days = (d: number) => (d === 1 ? "day" : "days");
  const steps = [
    { label: compact ? "Missed" : "Wrong answer", sub: "Saved to Mistakes", tone: "miss" as const, n: 0 },
    ...INTERVALS.map((d, i) => ({
      label: compact ? `+${d} ${days(d)}` : `${d} ${days(d)} later`,
      sub: SUBS[i],
      tone: i === INTERVALS.length - 1 ? ("done" as const) : ("step" as const),
      n: d,
    })),
  ];
  return (
    <div>
      <div className="relative">
        <span aria-hidden="true" className={`absolute right-[12.5%] left-[12.5%] h-0.5 bg-line ${compact ? "top-4" : "top-5 hidden sm:block"}`}>
          <span className="stat-grow block h-full bg-primary-strong" />
        </span>
        <ol aria-label="How spaced review works" className={`relative grid ${compact ? "grid-cols-4 gap-1" : "gap-5 sm:grid-cols-4 sm:gap-2"}`}>
          {steps.map((s, i) => (
            <li key={s.label} className={compact ? "relative flex flex-col items-center gap-1.5 text-center" : "relative flex items-center gap-3 sm:flex-col sm:text-center"}>
              <span
                className={`lesson-pop grid shrink-0 place-items-center rounded-full font-bold ${compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"} ${
                  s.tone === "miss" ? "bg-danger-soft text-danger" : s.tone === "done" ? "bg-success-soft text-success" : "bg-surface text-ink ring-1 ring-line"
                }`}
                style={{ animationDelay: `${150 + i * 250}ms` }}
              >
                {s.tone === "miss" ? <Icon d={I.x} className="h-4 w-4" /> : s.tone === "done" ? <Icon d={I.check} className="h-4 w-4" strokeWidth={3} /> : s.n}
              </span>
              <span>
                <span className={compact ? "text-xs font-medium" : "block text-sm font-semibold"}>{s.label}</span>
                {!compact && <span className="block text-xs text-muted">{s.sub}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {!compact && (
        <p className="mt-4 text-[13px] text-muted">
          A wrong answer at any step starts it over at {INTERVALS[0]} day.
        </p>
      )}
    </div>
  );
}

export function SampleMistake() {
  return (
    <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <ExampleChip />
        <span className="flex items-center gap-2 text-xs">
          <span aria-hidden="true" className="flex items-center gap-1">
            <span className="h-1.5 w-4 rounded-full bg-primary-strong" />
            <span className="h-1.5 w-4 rounded-full bg-line" />
            <span className="h-1.5 w-4 rounded-full bg-line" />
          </span>
          <span className="font-semibold text-primary-strong">due today</span>
        </span>
      </div>
      <p className="mt-3 text-xs text-muted">{getSkill("boundaries")?.name} · Hard · wrong once</p>
      <div aria-hidden="true" className="mt-2 space-y-2">
        <div className="h-2.5 w-[85%] rounded bg-surface-2" />
        <div className="h-2.5 w-[60%] rounded bg-surface-2" />
      </div>
    </div>
  );
}
