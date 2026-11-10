"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TEST_START_HOUR, findSatDate, upcomingSatDates } from "@/lib/sat-dates";
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

/** Test-day countdown to 8:00 a.m. (doors close) in the test location's time zone. */
export function Countdown({ testDate, testTimeZone, onPickDate }: { testDate: string | null; testTimeZone: string | null; onPickDate: () => void }) {
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
    const next = upcomingSatDates(today)[0];
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <p className="text-sm font-medium text-muted">Test day countdown</p>
        <p className="mt-2 text-xl font-bold tracking-tight">{next ? `Next SAT: ${formatIsoDate(next.date)}` : "Pick your SAT date"}</p>
        {location}
        <button type="button" onClick={onPickDate} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
          Set your test date
        </button>
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
          <p className="mt-2 text-xl font-bold tracking-tight">{formatIsoDate(testDate)}</p>
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
            <button type="button" onClick={onPickDate} className="mt-2 text-sm font-semibold text-primary hover:underline">
              Pick your next date →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
