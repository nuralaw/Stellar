"use client";

import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { PlanPicker } from "@/components/auth/PlanPicker";
import { formatDate } from "@/components/PlanLabel";
import { formatIsoDate } from "@/components/home/Countdown";
import { Skeleton } from "@/components/home/parts";
import { loginHref } from "@/components/profile/sync-label";
import { useAccess } from "@/lib/access";
import { useAuth } from "@/lib/auth-client";
import { PLAN_ORDER, PLUS, checkoutHref, discountedCents, formatPrice, isOnSale, paymentsLive, perDay, type PlanId } from "@/lib/plus-config";
import { daysUntil, upcomingSatDates } from "@/lib/sat-dates";
import { useHydrated, useProfile } from "@/lib/store";
import { LaunchSentence, useToday } from "./PlusPersonal";
import { BTN_LIQUID, BTN_PRIMARY, BTN_SECONDARY, FOCUS } from "./styles";

// The plan picker of /plus: the Pricing tab's switch sits in the Plus header row (<PlusBuyPicker>) and the buy row is the
// footer of the Plus area (<PlusBuyFooter>). They share the chosen plan through <PlusBuyProvider>. Checkout is Gumroad
// (plain link, same tab); the buyer's account id, email and (for the pass) SAT date ride along in the URL (checkoutHref).

const pl = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const OPTION_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
const SHORT_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const DISABLED = "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-strong";
const FOOTER = "mt-4 flex flex-wrap content-start items-center gap-3 border-t border-line pt-4";
const NOTE = "text-[13px] text-muted sm:ml-auto";

const Ctx = createContext<{ plan: PlanId; setPlan: (p: PlanId) => void } | null>(null);

function usePlusBuy() {
  const v = useContext(Ctx);
  if (!v) throw new Error("PlusBuyPicker/PlusBuyFooter must be inside <PlusBuyProvider>");
  return v;
}

/** Wrap the pricing grid with this; <PlusBuyPicker> and <PlusBuyFooter> inside it share the selected plan. */
export function PlusBuyProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId>("monthly");
  return <Ctx.Provider value={{ plan, setPlan }}>{children}</Ctx.Provider>;
}

/** The Monthly / Until test day switch with its price (the header row of the Plus area). */
export function PlusBuyPicker() {
  const { plan, setPlan } = usePlusBuy();
  const access = useAccess();
  return <PlanPicker value={plan} onChange={setPlan} discountPercent={access.discount?.percent} />;
}

/** The buy row under the benefit list and showcase. */
export function PlusBuyFooter() {
  const { plan: id } = usePlusBuy();
  const access = useAccess();
  const auth = useAuth();
  const hydrated = useHydrated();
  const today = useToday();
  const profile = useProfile();
  const [picked, setPicked] = useState<string | null>(null);

  // The pass only covers SAT dates up to PLUS.passMaxDays from today (the server enforces the same rule).
  const options = today ? upcomingSatDates(today).filter((d) => d.date > today && daysUntil(d.date, today) <= PLUS.passMaxDays).slice(0, 6) : [];
  const seed = hydrated && profile.testDate && options.some((o) => o.date === profile.testDate) ? profile.testDate : "";
  const date = picked ?? seed;
  const days = date && today ? daysUntil(date, today) : null;

  const plain = (text: ReactNode) => (
    <div className={FOOTER}>
      <p className="flex min-h-11 items-center text-sm text-muted">{text}</p>
    </div>
  );

  if (!access.ready)
    return (
      <div className={FOOTER}>
        <Skeleton className="h-11 w-full rounded-xl sm:w-64" />
      </div>
    );

  if (access.plan === "plus")
    return plain(
      <span className="font-semibold text-success">
        <span aria-hidden="true">✓ </span>
        You have Plus{access.expiresAt ? <span className="font-normal text-muted"> until {formatDate(access.expiresAt)}</span> : null}
      </span>,
    );

  const admin = access.plan === "admin";

  if (!paymentsLive())
    return (
      <div className={FOOTER}>
        <button type="button" disabled className={`${BTN_SECONDARY} w-full cursor-not-allowed opacity-60 hover:bg-surface sm:w-auto`}>
          Payments open soon
        </button>
        {/* Without a launch date the sentence would only repeat the button. */}
        {PLUS.launchDate && (
          <p className={`${NOTE} empty:hidden`}>
            <LaunchSentence format="short" />
          </p>
        )}
      </div>
    );

  // The footer of one plan. Every plan's footer is rendered in the same grid cell (below), so the card keeps the size of the
  // tallest one when the plan switch changes.
  const footerFor = (pid: PlanId) => {
    const p = PLUS.plans[pid];
    if (p.comingSoon)
      return (
        <div className={FOOTER}>
          <button type="button" disabled className={`${BTN_SECONDARY} w-full cursor-not-allowed opacity-60 hover:bg-surface sm:w-auto`}>
            Coming soon
          </button>
          <p className={NOTE}>Monthly is available now.</p>
        </div>
      );

    if (!auth.user && !admin)
      return (
        <div className={FOOTER}>
          <Link href={loginHref("/plus")} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Sign in to get Plus
          </Link>
          <p className={NOTE}>Plus is tied to your Stellar account.</p>
        </div>
      );

    const discount = pid === "monthly" ? access.discount : null; // a personal first-month discount, Monthly only
    const href = isOnSale(p)
      ? checkoutHref(p, { userId: auth.user?.id ?? "", email: auth.user?.email ?? undefined, testDate: pid === "pass" ? date : undefined, offerCode: discount?.code })
      : null;
    if (!href) return plain("Not on sale yet");

    // The renewal sentence is already beside the price (PlanPicker); here only the cancel and refund lines.
    const noteText = [p.billing === "month" ? PLUS.cancelText : null, PLUS.refundDays ? `Full refund within ${PLUS.refundDays} days.` : null].filter(Boolean).join(" ");
    const note = noteText ? <p className={NOTE}>{noteText}</p> : null;
    const adminNote = admin ? <p className="basis-full text-xs text-muted">Admin: Plus is already included; this is for testing the checkout.</p> : null;
    const c = p.amountCents;

    if (pid === "monthly")
      return (
        <div className={FOOTER}>
          <a href={href} className={`${BTN_LIQUID} w-full sm:w-auto`}>
            Get Monthly{c !== null ? (discount ? ` · ${formatPrice(discountedCents(c, discount.percent))} first month` : ` · ${formatPrice(c)}/mo`) : ""}
          </a>
          {note}
          {discount ? (
            <p className="basis-full text-xs text-muted">Your {discount.percent}% bug-report discount is applied at checkout.</p>
          ) : (
            c !== null && <p className="basis-full text-xs text-muted">{perDay(c)}</p>
          )}
          {adminNote}
        </div>
      );

    const noDates = Boolean(today) && options.length === 0;
    return (
      <div className={FOOTER}>
        {date && !noDates ? (
          <a href={href} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Get Plus until {formatIsoDate(date, SHORT_DATE)}
            {c !== null ? ` · ${formatPrice(c)}` : ""}
          </a>
        ) : (
          <button type="button" disabled className={`${BTN_PRIMARY} w-full sm:w-auto ${DISABLED}`}>
            Get Plus until your SAT
          </button>
        )}
        {!noDates &&
          (today ? (
            <select
              aria-label="Your SAT date"
              value={date}
              onChange={(e) => setPicked(e.target.value)}
              className={`h-11 w-full min-w-0 rounded-xl border border-line bg-bg px-3 text-sm text-ink sm:w-60 ${FOCUS}`}
            >
              <option value="">Pick your SAT date</option>
              {options.map((d) => (
                <option key={d.date} value={d.date}>
                  {formatIsoDate(d.date, OPTION_DATE)} · {d.anticipated ? "expected" : `in ${pl(daysUntil(d.date, today), "day", "days")}`}
                </option>
              ))}
            </select>
          ) : (
            <Skeleton className="h-11 w-full rounded-xl sm:w-60" />
          ))}
        {note}
        <p className="basis-full text-xs text-muted" aria-live="polite">
          {noDates
            ? `No SAT date within the next ${PLUS.passMaxDays} days. Monthly fits better.`
            : date && days !== null
              ? `${pl(days, "day", "days")} of prep.${days < PLUS.passRecommendMinDays ? " Monthly is a better fit for a test this close." : ""}`
              : "Pick your SAT date to see how long Plus lasts."}
        </p>
        {adminNote}
      </div>
    );
  };

  return (
    <div className="grid">
      {PLAN_ORDER.map((pid) => (
        <div key={pid} aria-hidden={pid === id ? undefined : true} className={pid === id ? "[grid-area:1/1]" : "invisible [grid-area:1/1]"}>
          {footerFor(pid)}
        </div>
      ))}
    </div>
  );
}
