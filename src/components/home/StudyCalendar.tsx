"use client";

import { useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { SAT_DATES, findSatDate } from "@/lib/sat-dates";
import { localDay, type DayStats } from "@/lib/stats";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sequential scale (one hue, light → dark): questions answered per day.
const LEVELS = [
  { min: 1, mix: 18 },
  { min: 10, mix: 38 },
  { min: 30, mix: 62 },
  { min: 60, mix: 88 },
];
const level = (n: number) => (n <= 0 ? -1 : LEVELS.reduce((l, s, i) => (n >= s.min ? i : l), 0));
const fill = (l: number) => (l < 0 ? undefined : `color-mix(in oklab, var(--primary) ${LEVELS[l].mix}%, var(--surface))`);

const monthKey = (iso: string) => iso.slice(0, 7);
function addMonths(key: string, n: number) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
const fmtMonth = (key: string) => new Date(`${key}-01T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const fmtDay = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

/**
 * Month calendar of study activity: each day shows how many questions were answered (shade = amount).
 * Official SAT dates and the student's own test day are marked. Click a day for its breakdown.
 */
export function StudyCalendar({ days, now, testDate }: { days: Map<string, DayStats>; now: number; testDate: string | null }) {
  const today = localDay(now);
  const first = [...days.keys()].sort()[0];
  // Navigable range: from the first study month (or this month) to the test month / two months ahead.
  const minMonth = first && first < today ? monthKey(first) : monthKey(today);
  const ahead = addMonths(monthKey(today), 2);
  const maxMonth = testDate && monthKey(testDate) > ahead ? monthKey(testDate) : ahead;

  const [month, setMonth] = useState(monthKey(today));
  const [selected, setSelected] = useState(today);

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
            onClick={() => setMonth(addMonths(month, -1))}
            disabled={month <= minMonth}
            aria-label="Previous month"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Icon d={I.chevronL} className="h-4 w-4" />
          </button>
          <p className="min-w-36 text-center font-semibold" aria-live="polite">
            {fmtMonth(month)}
          </p>
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
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
                setMonth(monthKey(today));
                setSelected(today);
              }}
              className="ml-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-soft"
            >
              Today
            </button>
          )}
        </div>
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
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 sm:gap-1.5" role="grid" aria-label={`Study activity, ${fmtMonth(month)}`}>
        {WEEKDAYS.map((w) => (
          <span key={w} className="pb-1 text-center text-xs font-medium text-muted" role="columnheader">
            <span className="sm:hidden">{w[0]}</span>
            <span className="hidden sm:inline">{w}</span>
          </span>
        ))}
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
              style={{ background: fill(l) }}
              className={`relative flex aspect-square flex-col rounded-lg border p-1 text-left transition-shadow sm:aspect-auto sm:h-20 sm:p-2 ${
                l < 0 ? (future ? "border-transparent bg-transparent" : "border-transparent bg-surface-2/40") : "border-transparent"
              } ${isTest ? "ring-2 ring-accent ring-offset-1 ring-offset-surface" : iso === today ? "ring-2 ring-ink/70 ring-offset-1 ring-offset-surface" : ""} ${
                selected === iso && !isTest && iso !== today ? "ring-2 ring-primary/50" : ""
              } hover:shadow-md`}
            >
              <span className={`text-[10px] leading-none font-medium sm:text-xs ${l >= 2 ? "text-white/85" : future ? "text-muted/60" : "text-muted"}`}>
                {Number(iso.slice(8))}
              </span>
              {n > 0 && (
                <span className={`mt-auto self-center text-xs font-bold tabular-nums sm:self-end sm:text-lg ${l >= 2 ? "text-white" : "text-ink"}`}>{n}</span>
              )}
              {(sat || isTest) && (
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

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          Fewer
          <span className="h-3 w-3 rounded-sm bg-surface-2" />
          {LEVELS.map((_, i) => (
            <span key={i} className="h-3 w-3 rounded-sm" style={{ background: fill(i) }} />
          ))}
          More
        </span>
        <span className="tabular-nums">1–9 · 10–29 · 30–59 · 60+ questions</span>
        {satInView && (
          <span className="flex items-center gap-1.5">
            <span className="rounded bg-ink/80 px-1 text-[9px] font-bold text-bg">SAT</span> official test date
          </span>
        )}
        {testDate && monthKey(testDate) === month && (
          <span className="flex items-center gap-1.5">
            <span className="rounded bg-accent px-1 text-[9px] font-bold text-white">TEST</span> your test day
          </span>
        )}
      </div>

      {/* Selected day */}
      <div className="mt-4 rounded-xl bg-surface-2/60 px-4 py-3 text-sm" aria-live="polite">
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
