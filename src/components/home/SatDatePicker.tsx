"use client";

import { useEffect, useRef, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { SatDate } from "@/lib/sat-dates";
import { formatIsoDate } from "./Countdown";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthKey = (iso: string) => iso.slice(0, 7); // "YYYY-MM"

/** Calendar popover where only official SAT dates can be picked; arrows jump between months that have one. */
export function SatDatePicker({ value, onChange, dates }: { value: string; onChange: (iso: string) => void; dates: SatDate[] }) {
  const months = [...new Set(dates.map((d) => monthKey(d.date)))];
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => (months.includes(monthKey(value)) ? monthKey(value) : months[0]));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const i = months.indexOf(month);
  const [y, m] = (month ?? "2000-01").split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const byDay = new Map(dates.filter((d) => monthKey(d.date) === month).map((d) => [Number(d.date.slice(8)), d]));

  return (
    <div className="relative mt-2" ref={ref}>
      <button
        id="testdate"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-bg px-4 py-2.5 text-left outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <span className={value ? "" : "text-muted"}>{value ? formatIsoDate(value) : "Choose an SAT date"}</span>
        <Icon d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" className="h-4.5 w-4.5 shrink-0 text-muted" />
      </button>

      {open && month && (
        <div role="dialog" aria-label="SAT dates" className="absolute top-full left-0 z-30 mt-2 w-72 rounded-2xl border border-line bg-surface p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setMonth(months[i - 1])} disabled={i <= 0} aria-label="Previous SAT month" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30">
              <Icon d={I.chevronL} className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold">{formatIsoDate(`${month}-01`, { month: "long", year: "numeric" })}</p>
            <button type="button" onClick={() => setMonth(months[i + 1])} disabled={i >= months.length - 1} aria-label="Next SAT month" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30">
              <Icon d={I.chevronR} className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-[11px] font-medium text-muted">
                {w}
              </span>
            ))}
            {Array.from({ length: first }, (_, k) => (
              <span key={`b${k}`} />
            ))}
            {Array.from({ length }, (_, k) => {
              const day = k + 1;
              const sat = byDay.get(day);
              if (!sat)
                return (
                  <span key={day} className="grid h-9 place-items-center text-sm text-muted/40">
                    {day}
                  </span>
                );
              const on = sat.date === value;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    onChange(sat.date);
                    setOpen(false);
                  }}
                  aria-pressed={on}
                  title={sat.anticipated ? "Anticipated SAT date (not confirmed yet)" : "SAT date"}
                  className={`grid h-9 place-items-center rounded-lg text-sm font-semibold transition-colors ${
                    on ? "bg-primary text-primary-ink" : "bg-primary-soft text-primary ring-1 ring-primary/40 hover:bg-primary hover:text-primary-ink"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
