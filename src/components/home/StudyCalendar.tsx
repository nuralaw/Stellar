"use client";

import { useId, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { SAT_DATES, findSatDate } from "@/lib/sat-dates";
import { localDay, type DayStats } from "@/lib/stats";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Questions answered per day → a flame: a dim little ember for a few questions, a big bright fire for a lot.
const LEVELS = [
  { min: 1, size: 0.62, opacity: 0.6, saturate: 0.5, speed: 2.4, glow: 0, halo: 0.06 },
  { min: 10, size: 0.75, opacity: 0.78, saturate: 0.8, speed: 1.9, glow: 2, halo: 0.11 },
  { min: 30, size: 0.85, opacity: 0.92, saturate: 1, speed: 1.5, glow: 4, halo: 0.17 },
  { min: 60, size: 1, opacity: 1, saturate: 1.25, speed: 1.15, glow: 8, halo: 0.26 },
];
const level = (n: number) => (n <= 0 ? -1 : LEVELS.reduce((l, s, i) => (n >= s.min ? i : l), 0));
/** Warm glow behind a day's flame (stronger for bigger days). */
const halo = (l: number) => (l < 0 ? undefined : `radial-gradient(circle at 50% 80%, rgb(249 115 22 / ${LEVELS[l].halo}), transparent 72%)`);

const FLAME_OUTER = "M12 1.5c.8 3.2-1.2 5.1-2.6 7C7.6 10.9 6 13 6 15.8 6 19.5 8.7 22 12 22s6-2.5 6-6.2c0-2.6-1.3-4.6-2.6-6.1-.3 1.6-1.1 2.7-2.2 3.1.6-3.9-.3-8.6-1.2-11.3Z";
const FLAME_INNER = "M12 11.5c.3 1.6-.6 2.6-1.3 3.5-.6.8-1.2 1.6-1.2 2.8 0 1.8 1.1 3.2 2.5 3.2s2.5-1.3 2.5-3.1c0-1.5-.8-2.6-1.4-3.4-.2.7-.6 1.1-1 1.3.1-1.6-.1-3.2-.1-4.3Z";

/** Gradients shared by every flame in one calendar. */
function FlameDefs({ id }: { id: string }) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-o`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="0.55" stopColor="#f97316" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id={`${id}-i`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="1" stopColor="#fffbeb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** A flickering flame; `l` is the activity level (0 = a few questions … 3 = a lot). */
function Flame({ id, l, seed = 0, still = false, className = "", height }: { id: string; l: number; seed?: number; still?: boolean; className?: string; height?: string }) {
  const f = LEVELS[l];
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${still ? "" : "flame"} ${className}`}
      style={{
        height,
        opacity: f.opacity,
        filter: `saturate(${f.saturate})${f.glow ? ` drop-shadow(0 0 ${f.glow}px rgb(249 115 22 / 0.7))` : ""}`,
        animationDuration: `${f.speed}s`,
        // Different phase per day, so the fires don't flicker in sync.
        animationDelay: `-${(seed * 0.37) % f.speed}s`,
      }}
    >
      <path d={FLAME_OUTER} fill={`url(#${id}-o)`} />
      <path d={FLAME_INNER} fill={`url(#${id}-i)`} className={still ? "" : "flame-core"} style={{ animationDelay: `-${(seed * 0.21) % 1}s` }} />
    </svg>
  );
}

const monthKey = (iso: string) => iso.slice(0, 7);
function addMonths(key: string, n: number) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
const fmtMonth = (key: string) => new Date(`${key}-01T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const fmtDay = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

/**
 * Month calendar of study activity: each studied day burns with a flame (bigger and brighter = more questions).
 * Official SAT dates and the student's own test day are marked. Click a day for its breakdown.
 * compact: small cells with just the date and flame (Home); counts show in the day box below.
 * Switching months slides the grid in from the side you're moving to.
 */
export function StudyCalendar({ days, now, testDate, compact = false }: { days: Map<string, DayStats>; now: number; testDate: string | null; compact?: boolean }) {
  const today = localDay(now);
  const first = [...days.keys()].sort()[0];
  // Navigable range: from the first study month (or this month) to the test month / two months ahead.
  const minMonth = first && first < today ? monthKey(first) : monthKey(today);
  const ahead = addMonths(monthKey(today), 2);
  const maxMonth = testDate && monthKey(testDate) > ahead ? monthKey(testDate) : ahead;

  const [month, setMonth] = useState(monthKey(today));
  const [selected, setSelected] = useState(today);
  /** Direction of the last month change: 1 = forward, -1 = back (drives the slide). */
  const [dir, setDir] = useState(0);
  const go = (to: string) => {
    if (to === month) return;
    setDir(to > month ? 1 : -1);
    setMonth(to);
  };
  const fid = `fl${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const slide = dir > 0 ? "cal-next" : dir < 0 ? "cal-prev" : "";

  const [y, m] = month.split("-").map(Number);
  const lead = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array.from({ length }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);

  const inMonth = cells.map((d) => days.get(d)).filter((d): d is DayStats => Boolean(d));
  const monthTotal = inMonth.reduce((n, d) => n + d.answered, 0);
  const activeDays = inMonth.length;
  const best = Math.max(0, ...inMonth.map((d) => d.answered));

  const sel = days.get(selected);
  const selSat = findSatDate(selected);
  const satInView = SAT_DATES.some((d) => monthKey(d.date) === month);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(addMonths(month, -1))}
            disabled={month <= minMonth}
            aria-label="Previous month"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Icon d={I.chevronL} className="h-4 w-4" />
          </button>
          <p className="min-w-36 overflow-hidden text-center font-semibold" aria-live="polite">
            <span key={month} className={`block ${slide}`}>
              {fmtMonth(month)}
            </span>
          </p>
          <button
            type="button"
            onClick={() => go(addMonths(month, 1))}
            disabled={month >= maxMonth}
            aria-label="Next month"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Icon d={I.chevronR} className="h-4 w-4" />
          </button>
          {month !== monthKey(today) && (
            <button
              type="button"
              onClick={() => {
                go(monthKey(today));
                setSelected(today);
              }}
              className="ml-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-soft"
            >
              Today
            </button>
          )}
        </div>
        {compact ? (
          <p className="text-[13px] text-muted tabular-nums">
            <span className="font-semibold text-ink">{monthTotal.toLocaleString("en-US")}</span> this month · {activeDays} active {activeDays === 1 ? "day" : "days"}
          </p>
        ) : (
        <dl className="flex gap-5 text-sm">
          <div>
            <dt className="text-xs text-muted">This month</dt>
            <dd className="font-semibold tabular-nums">{monthTotal.toLocaleString("en-US")} questions</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Active days</dt>
            <dd className="font-semibold tabular-nums">{activeDays}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Best day</dt>
            <dd className="font-semibold tabular-nums">{best}</dd>
          </div>
        </dl>
        )}
      </div>

      <FlameDefs id={fid} />
      <div className={`grid grid-cols-7 ${compact ? "mt-3 gap-1" : "mt-4 gap-1 sm:gap-1.5"}`} aria-hidden="true">
        {WEEKDAYS.map((w) => (
          <span key={w} className="pb-1 text-center text-xs font-medium text-muted">
            <span className="sm:hidden">{w[0]}</span>
            <span className="hidden sm:inline">{w}</span>
          </span>
        ))}
      </div>
      <div className="-m-1 overflow-hidden p-1">
      <div key={month} className={`grid grid-cols-7 ${compact ? "gap-1" : "gap-1 sm:gap-1.5"} ${slide}`} role="grid" aria-label={`Study activity, ${fmtMonth(month)}`}>
        {Array.from({ length: lead }, (_, i) => (
          <span key={`b${i}`} aria-hidden="true" />
        ))}
        {cells.map((iso) => {
          const d = days.get(iso);
          const n = d?.answered ?? 0;
          const l = level(n);
          const future = iso > today;
          const sat = findSatDate(iso);
          const isTest = iso === testDate;
          const label = `${fmtDay(iso)}: ${n ? `${n} question${n === 1 ? "" : "s"}` : future ? "upcoming" : "no questions"}${sat ? ", SAT date" : ""}${isTest ? ", your test day" : ""}`;
          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              onClick={() => setSelected(iso)}
              aria-label={label}
              aria-selected={selected === iso}
              title={label}
              style={{ background: halo(l) }}
              className={`relative flex rounded-lg border transition-shadow ${compact ? "h-9 items-center justify-center sm:h-10" : "aspect-square flex-col p-1 text-left sm:aspect-auto sm:h-20 sm:p-2"} ${
                l < 0 ? (future || compact ? "border-transparent bg-transparent hover:bg-surface-2/60" : "border-transparent bg-surface-2/40") : "border-transparent"
              } ${isTest ? "ring-2 ring-accent ring-offset-1 ring-offset-surface" : iso === today ? "ring-2 ring-ink/70 ring-offset-1 ring-offset-surface" : ""} ${
                selected === iso && !isTest && iso !== today ? "ring-2 ring-primary/50" : ""
              } hover:shadow-md`}
            >
              {l >= 0 && (
                <span className="pointer-events-none absolute inset-0 flex items-end justify-center pb-0.5" aria-hidden="true">
                  <Flame id={fid} l={l} seed={Number(iso.slice(8))} className="w-auto" height={`${LEVELS[l].size * 100}%`} />
                </span>
              )}
              <span
                className={`relative leading-none ${compact ? "text-[13px] tabular-nums" : "text-[10px] sm:text-xs"} ${
                  l >= 2 ? "font-bold text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.65)]" : l >= 0 ? "font-semibold text-ink" : future ? "font-medium text-muted/60" : "font-medium text-muted"
                }`}
              >
                {Number(iso.slice(8))}
              </span>
              {n > 0 && !compact && (
                <span className={`relative mt-auto self-center text-xs font-bold tabular-nums sm:self-end sm:text-lg ${l >= 2 ? "text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.65)]" : "text-ink"}`}>{n}</span>
              )}
              {(sat || isTest) && compact && (
                <span className={`absolute top-1 right-1 h-1.5 w-1.5 rounded-full ${isTest ? "bg-accent" : "bg-ink/70"}`} aria-hidden="true" />
              )}
              {(sat || isTest) && !compact && (
                <span
                  className={`absolute top-1 right-1 rounded px-1 text-[8px] leading-tight font-bold tracking-wide uppercase sm:text-[9px] ${
                    isTest ? "bg-accent text-white" : "bg-ink/80 text-bg"
                  }`}
                >
                  <span className="sm:hidden">{isTest ? "★" : "S"}</span>
                  <span className="hidden sm:inline">{isTest ? "Test" : "SAT"}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          Fewer
          <span className="flex items-end gap-0.5">
            {LEVELS.map((_, i) => (
              <Flame key={i} id={fid} l={i} still className="w-auto" height={`${10 + i * 2}px`} />
            ))}
          </span>
          More
        </span>
        {!compact && <span className="tabular-nums">1–9 · 10–29 · 30–59 · 60+ questions</span>}
        {satInView && (
          <span className="flex items-center gap-1.5">
            {compact ? <span className="h-1.5 w-1.5 rounded-full bg-ink/70" /> : <span className="rounded bg-ink/80 px-1 text-[9px] font-bold text-bg">SAT</span>} official SAT date
          </span>
        )}
        {testDate && monthKey(testDate) === month && (
          <span className="flex items-center gap-1.5">
            {compact ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : <span className="rounded bg-accent px-1 text-[9px] font-bold text-white">TEST</span>} your test day
          </span>
        )}
      </div>

      {/* Selected day */}
      <div className={`rounded-xl bg-surface-2/60 px-4 text-sm ${compact ? "mt-3 py-2.5" : "mt-4 py-3"}`} aria-live="polite">
        <p className="font-semibold">
          {fmtDay(selected)}
          {selected === today && <span className="ml-2 text-xs font-medium text-muted">today</span>}
          {selected === testDate && <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">Your SAT</span>}
          {selSat && selected !== testDate && <span className="ml-2 text-xs font-medium text-muted">official SAT date{selSat.anticipated ? " (anticipated)" : ""}</span>}
        </p>
        {sel ? (
          <p className="mt-1 text-muted tabular-nums">
            <span className="font-semibold text-ink">{sel.answered}</span> question{sel.answered === 1 ? "" : "s"} ·{" "}
            <span className="font-semibold text-ink">{Math.round((sel.correct / sel.answered) * 100)}%</span> correct · R&amp;W {sel.rw} · Math {sel.math}
          </p>
        ) : (
          <p className="mt-1 text-muted">{selected > today ? "Nothing yet — this day is ahead." : "No questions answered this day."}</p>
        )}
      </div>
    </div>
  );
}
