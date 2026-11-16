"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TEST_START_HOUR, daysUntil, findSatDate, upcomingSatDates, type SatDate } from "@/lib/sat-dates";
import { updateProfile } from "@/lib/store";
import { countryName, countryOfZone, deviceZone, effectiveZone, todayIn, utcOffsetLabel, zoneCity, zonedInstant } from "@/lib/timezone";

/** A calendar date "YYYY-MM-DD" as text, independent of any time zone. */
export function formatIsoDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

function useTick(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl bg-surface-2/70 px-1 py-3 sm:min-w-[4.75rem] sm:px-3">
      <span className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">{String(value).padStart(2, "0")}</span>
      <span className="mt-0.5 text-[11px] font-medium tracking-wide text-muted uppercase">{label}</span>
    </div>
  );
}

const inDays = (n: number) => (n === 0 ? "today" : n === 1 ? "tomorrow" : n < 60 ? `in ${n} days` : `in ${Math.round(n / 30.4)} months`);

/** One line about registration for an official date. */
function registerNote(d: SatDate, today: string) {
  if (d.anticipated) return "Date not confirmed yet";
  if (!d.register) return "";
  return d.register >= today ? `Register by ${formatIsoDate(d.register, { month: "short", day: "numeric" })}` : "Regular registration closed";
}

/** Pick / change the SAT date in one click: a popover with the upcoming official dates. */
function DateMenu({ value, today, label, className }: { value: string | null; today: string; label: string; className: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dates = upcomingSatDates(today).slice(0, 8);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (iso: string | null) => {
    updateProfile({ testDate: iso });
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open} className={className}>
        {label}
      </button>
      {open && (
        <div role="dialog" aria-label="Choose your SAT date" className="absolute top-full left-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-2 shadow-xl">
          <p className="px-3 pt-2 pb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">Official SAT dates</p>
          <ul className="max-h-80 overflow-y-auto">
            {dates.map((d) => {
              const on = d.date === value;
              const note = registerNote(d, today);
              return (
                <li key={d.date}>
                  <button
                    type="button"
                    onClick={() => pick(d.date)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${on ? "bg-primary-soft" : "hover:bg-surface-2"}`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-semibold ${on ? "text-primary" : ""}`}>
                        {formatIsoDate(d.date, { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="block text-xs text-muted">
                        {inDays(daysUntil(d.date, today))}
                        {note && ` · ${note}`}
                      </span>
                    </span>
                    {on && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {value && (
            <button type="button" onClick={() => pick(null)} className="mt-1 w-full rounded-xl border-t border-line px-3 py-2.5 text-left text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
              I&apos;m not sure yet — clear the date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Test-day countdown to 8:00 a.m. (doors close) in the test location's time zone. */
export function Countdown({ testDate, testTimeZone }: { testDate: string | null; testTimeZone: string | null }) {
  const now = useTick(1000);
  const tz = effectiveZone(testTimeZone);
  const cc = countryOfZone(tz);
  const today = todayIn(tz, now);
  const where = `${zoneCity(tz)}${cc ? `, ${countryName(cc)}` : ""} (${utcOffsetLabel(tz, now)})`;
  const location = (
    <p className="mt-1 text-sm text-muted">
      Time zone: {where}
      {testTimeZone ? "" : " · from your device"}{" "}
      <Link href="/profile#test-location" className="font-medium text-primary hover:underline">
        Change
      </Link>
    </p>
  );

  if (!testDate) {
    const soon = upcomingSatDates(today).slice(0, 3);
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <p className="text-sm font-medium text-muted">Test day countdown</p>
        <p className="mt-2 text-xl font-bold tracking-tight">When is your SAT?</p>
        <p className="mt-1 text-sm text-muted">Tap a date to start the countdown. You can change it any time.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {soon.map((d) => (
            <button
              key={d.date}
              type="button"
              onClick={() => updateProfile({ testDate: d.date })}
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-left transition-colors hover:border-primary hover:bg-primary-soft"
            >
              <span className="block text-sm font-semibold">{formatIsoDate(d.date, { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className="block text-xs text-muted">{inDays(daysUntil(d.date, today))}</span>
            </button>
          ))}
          <DateMenu value={null} today={today} label="Other dates" className="h-full rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink" />
        </div>
        {location}
      </div>
    );
  }

  const start = zonedInstant(testDate, TEST_START_HOUR, tz);
  const left = start - now;
  const official = findSatDate(testDate);
  const sameZone = tz === deviceZone();
  const startText = new Date(start).toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });
  const yourTime = new Date(start).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
  const testOver = left < -5 * 3_600_000; // about when the SAT (with breaks) is finished

  const total = Math.max(0, Math.floor(left / 1000));
  const units = [
    { value: Math.floor(total / 86_400), label: "Days" },
    { value: Math.floor((total % 86_400) / 3600), label: "Hours" },
    { value: Math.floor((total % 3600) / 60), label: "Min" },
    { value: total % 60, label: "Sec" },
  ];

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{official ? "SAT test day" : "Your test day"}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xl font-bold tracking-tight">{formatIsoDate(testDate)}</p>
            <DateMenu
              value={testDate}
              today={today}
              label="Change date"
              className="rounded-lg border border-line px-2.5 py-1 text-[13px] font-semibold text-muted transition-colors hover:border-muted hover:text-ink"
            />
          </div>
          <p className="mt-1 text-sm text-muted">
            Doors close at {startText} local time{!sameZone && <> · {yourTime} on this device</>}
          </p>
          {location}
          {!official && <p className="mt-2 text-xs text-accent">This isn&apos;t an official SAT weekend date. Check it on the College Board website.</p>}
          {official?.register && official.register >= today && left > 0 && (
            <p className="mt-2 text-xs text-muted">Registration deadline: {formatIsoDate(official.register, { month: "long", day: "numeric" })}</p>
          )}
        </div>

        {left > 0 ? (
          <div className="flex gap-2 lg:shrink-0" role="timer" aria-label={`${units[0].value} days ${units[1].value} hours ${units[2].value} minutes left`}>
            {units.map((u) => (
              <Unit key={u.label} {...u} />
            ))}
          </div>
        ) : !testOver ? (
          <p className="text-2xl font-bold tracking-tight text-primary">Test day — good luck! 🍀</p>
        ) : (
          <div className="lg:text-right">
            <p className="font-semibold">This test date has passed.</p>
            <DateMenu value={testDate} today={today} label="Pick your next date →" className="mt-2 text-sm font-semibold text-primary hover:underline" />
          </div>
        )}
      </div>
    </div>
  );
}
