"use client";

import Link from "next/link";
import { useState } from "react";
import { formatIsoDate } from "@/components/home/Countdown";
import { Skeleton } from "@/components/home/parts";
import { loginHref } from "@/components/profile/sync-label";
import { useAccess } from "@/lib/access";
import { useAuth } from "@/lib/auth-client";
import {
  PLAN_ORDER,
  PLUS,
  checkoutHref,
  formatPrice,
  isOnSale,
  monthlyPaymentsFor,
  paymentsLive,
  perDay,
  perWeek,
  priceParts,
  recommendedPlan,
  type PlusPlan,
} from "@/lib/plus-config";
import { daysUntil, findSatDate, upcomingSatDates } from "@/lib/sat-dates";
import { useHydrated, useProfile } from "@/lib/store";
import { useToday } from "./PlusPersonal";
import { BTN_PRIMARY, BTN_SECONDARY, FOCUS, LINK_STRONG } from "./styles";

const pl = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const LONG_DATE: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
const SHORT_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

/** The two plans, with the SAT-date picker that sizes "Until test day". The picker is local: this page never writes the profile. */
export function PlanCards() {
  const hydrated = useHydrated();
  const today = useToday();
  const profile = useProfile();
  const options = today ? upcomingSatDates(today).filter((d) => d.date > today).slice(0, 6) : [];
  const seed = hydrated && profile.testDate && options.some((o) => o.date === profile.testDate) ? profile.testDate : "";
  const [picked, setPicked] = useState<string | null>(null);
  const date = picked ?? seed;
  const days = date && today ? daysUntil(date, today) : null;
  const rec = recommendedPlan(days);
  const monthlyCents = PLUS.plans.monthly.amountCents;
  const passCents = PLUS.plans.pass.amountCents;
  const bothPriced = monthlyCents !== null && passCents !== null;

  return (
    <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
      {PLAN_ORDER.map((id) => {
        const p = PLUS.plans[id];
        const c = p.amountCents;
        const parts = c !== null ? priceParts(c) : null;
        const official = date ? findSatDate(date) : undefined;
        return (
          <article
            key={id}
            aria-labelledby={`plan-${id}`}
            className={`relative flex flex-col rounded-3xl bg-surface p-6 sm:p-7 ${
              rec === id ? "order-first shadow-[0_20px_50px_-24px_rgb(234_88_12/0.45)] ring-2 ring-primary-strong sm:order-none" : "ring-1 ring-line"
            }`}
          >
            {rec === id && date && (
              <p className="absolute -top-3 left-6 rounded-full bg-primary-strong px-3 py-1 text-xs font-semibold text-primary-ink">Fits your {formatIsoDate(date, SHORT_DATE)} SAT</p>
            )}
            <span className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold ${id === "monthly" ? "bg-surface-2 text-ink" : "bg-accent-soft text-primary-strong"}`}>
              {id === "monthly" ? "Month to month" : "One payment · no auto-renew"}
            </span>
            <h3 id={`plan-${id}`} className="mt-3 text-lg font-semibold">
              {p.name}
            </h3>
            {c !== null && parts ? (
              <>
                <p className="mt-2 flex items-baseline">
                  <span className="sr-only">
                    {formatPrice(c)} {p.billing === "month" ? "per month" : "one payment"}
                  </span>
                  <span aria-hidden="true" className="text-5xl font-bold tracking-tight tabular-nums">
                    {parts.whole}
                  </span>
                  <span aria-hidden="true" className="text-2xl font-bold tabular-nums">
                    {parts.frac}
                  </span>
                  <span aria-hidden="true" className="ml-1.5 text-sm text-muted">
                    {p.billing === "month" ? "/ month" : "one payment"}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  {id === "monthly" ? perDay(c) : days !== null ? `About ${perWeek(c, days)} a week over ${pl(Math.max(1, Math.round(days / 7)), "week", "weeks")}` : "Pick your SAT date below"}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-2xl font-semibold text-muted">Price at launch</p>
                <p className="mt-1 text-sm text-muted">Announced when payments open</p>
              </>
            )}
            <p className="mt-4 text-[15px]">{p.blurb}</p>
            {id === "pass" && (
              <div className="mt-5">
                <label htmlFor="pass-date" className="block text-sm font-medium">
                  Your SAT date
                </label>
                {today ? (
                  <select
                    id="pass-date"
                    value={date}
                    onChange={(e) => setPicked(e.target.value)}
                    className={`mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-ink ${FOCUS}`}
                  >
                    <option value="">Pick your SAT date</option>
                    {options.map((d) => (
                      <option key={d.date} value={d.date}>
                        {formatIsoDate(d.date, LONG_DATE)} · {d.anticipated ? "expected date" : `in ${pl(daysUntil(d.date, today), "day", "days")}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Skeleton className="mt-1.5 h-11 rounded-xl" />
                )}
                <div className="mt-3 min-h-10 space-y-2 text-sm" aria-live="polite">
                  {date && days !== null ? (
                    <>
                      <p>
                        Plus until <strong className="font-semibold">{formatIsoDate(date, LONG_DATE)}</strong> · {pl(days, "day", "days")} of prep
                      </p>
                      {official?.register && official.register >= today && (
                        <p className="text-xs text-muted">
                          Register for this SAT by {formatIsoDate(official.register, SHORT_DATE)} on{" "}
                          <a href="https://satsuite.collegeboard.org/sat/dates-deadlines" target="_blank" rel="noopener noreferrer" className={LINK_STRONG}>
                            collegeboard.org
                          </a>
                        </p>
                      )}
                      {days < PLUS.passRecommendMinDays && (
                        <p className="rounded-xl bg-bg p-3">
                          Your SAT is in {pl(days, "day", "days")}. Monthly covers that{bothPriced && passCents > monthlyCents ? " for less" : ""}.
                        </p>
                      )}
                      {bothPriced && passCents < monthlyPaymentsFor(days) * monthlyCents && (
                        <p className="text-muted">
                          Paying monthly until then would be {pl(monthlyPaymentsFor(days), "payment", "payments")} of {formatPrice(monthlyCents)} ({formatPrice(monthlyPaymentsFor(days) * monthlyCents)}).
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted">Pick your SAT date to see how long Plus would last.</p>
                  )}
                </div>
              </div>
            )}
            <div className="mt-auto pt-6">
              {paymentsLive() && <PlanBuy plan={p} date={date} />}
              <p className="mt-3 text-center text-[13px] text-muted">
                {p.billing === "month" ? "Renews every month until you cancel." : "One payment. Nothing renews."}
                {p.billing === "month" && PLUS.cancelText ? ` ${PLUS.cancelText}` : ""}
                {PLUS.refundDays ? ` Full refund within ${PLUS.refundDays} days.` : ""}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PlanBuy({ plan: p, date }: { plan: PlusPlan; date: string }) {
  const access = useAccess();
  const auth = useAuth();
  if (!access.ready) return <Skeleton className="h-11 w-full rounded-xl" />;
  if (access.plan === "plus") return <p className="text-center text-sm font-medium text-success">✓ Included in your Plus</p>;
  if (!isOnSale(p)) return <p className="text-center text-sm text-muted">Not on sale yet</p>;
  if (!auth.user && access.plan !== "admin")
    return (
      <Link href={loginHref("/plus#plans")} className={`${BTN_PRIMARY} w-full`}>
        Sign in to get {p.name}
      </Link>
    );
  if (p.id === "pass" && !date)
    return (
      <button type="button" onClick={() => document.getElementById("pass-date")?.focus()} className={`${BTN_SECONDARY} w-full`}>
        Pick your SAT date first
      </button>
    );
  return (
    <a href={checkoutHref(p, { userId: auth.user?.id ?? "", testDate: date }) ?? undefined} className={`${BTN_PRIMARY} w-full`}>
      {p.id === "monthly" ? "Get Monthly" : `Get Plus until ${formatIsoDate(date, SHORT_DATE)}`}
    </a>
  );
}
