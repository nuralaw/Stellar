// Stellar Plus: plans, prices and launch state shown on /plus and across the app. Display only: the gate is
// lib/access-core / access / access-server. Going live = fill amountCents + checkoutUrl per plan; no component changes.

export type PlanId = "monthly" | "pass";

export interface PlusPlan {
  id: PlanId;
  name: string;
  /** One line under the price. */
  blurb: string;
  /** US cents (999 = $9.99). null = not decided: "Price at launch", never recommended, never buyable. */
  amountCents: number | null;
  /** "month" renews every month until cancelled; "once" is one payment that never renews. */
  billing: "month" | "once";
  /** Provider checkout link. "{userId}" and "{testDate}" are replaced (URL-encoded). null = not on sale. */
  checkoutUrl: string | null;
}

export interface PlusConfig {
  /** "YYYY-MM-DD". Shown as "Plus opens Nov 29" while that day is still ahead (computed in the browser). null or past → "Payments open soon". */
  launchDate: string | null;
  plans: Record<PlanId, PlusPlan>;
  /** With the SAT at least this many days away, the pass is recommended (only when BOTH plans have a price and a date is picked). */
  passRecommendMinDays: number;
  /** One true sentence on how to cancel Monthly. null hides the cancel FAQ and every cancel line. */
  cancelText: string | null;
  /** Full-refund window in days. null hides every refund line and the refund FAQ. */
  refundDays: number | null;
  /** Discount for confirmed bug reports (the promise in SupportButton.tsx). null hides it. */
  bugDiscountPercent: number | null;
  /** Owner-confirmed: Stellar shows no ads. Gates the "no ads" line in the parents summary. */
  noAds: boolean;
  /** Owner opt-in: list part titles (table of contents only) on the lesson lock page. */
  lockShowsPartTitles: boolean;
  priceNote: string;
}

export const PLUS: PlusConfig = {
  launchDate: null, // no public payments date until the owner commits to one
  plans: {
    monthly: {
      id: "monthly",
      name: "Monthly",
      blurb: "Everything in Plus, month to month. A good fit if your SAT is close or you haven't picked a date yet.",
      amountCents: 999,
      billing: "month",
      checkoutUrl: null,
    },
    pass: {
      id: "pass",
      name: "Until test day",
      blurb: "Everything in Plus until your SAT. Pay once and nothing renews.",
      amountCents: null,
      billing: "once",
      checkoutUrl: null,
    },
  },
  passRecommendMinDays: 28,
  cancelText: null,
  refundDays: null,
  bugDiscountPercent: 50,
  noAds: true,
  lockShowsPartTitles: false,
  priceNote: "Prices in US dollars. Tax may be added at checkout.",
};

export const PLAN_ORDER: PlanId[] = ["monthly", "pass"];

export const isOnSale = (p: PlusPlan) => p.amountCents !== null && p.checkoutUrl !== null;
/** True once any plan can be bought. */
export const paymentsLive = () => PLAN_ORDER.some((id) => isOnSale(PLUS.plans[id]));

/** 999 → "$9.99", 4900 → "$49". */
export function formatPrice(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}
/** "$9.99" → { whole: "$9", frac: ".99" }; "$49" → { whole: "$49", frac: "" }. */
export function priceParts(cents: number): { whole: string; frac: string } {
  const s = formatPrice(cents);
  const i = s.indexOf(".");
  return i < 0 ? { whole: s, frac: "" } : { whole: s.slice(0, i), frac: s.slice(i) };
}
/** Monthly framing: "about 33¢ a day". */
export function perDay(cents: number): string {
  const c = Math.round(cents / 30.44);
  return c < 100 ? `about ${c}¢ a day` : `about ${formatPrice(c)} a day`;
}
/** Price per week over `days`, e.g. "$2.30". */
export function perWeek(cents: number, days: number): string {
  return formatPrice(Math.round(cents / Math.max(1, days / 7)));
}
/** Monthly payments needed to cover `days` (one payment per started 30 days). */
export const monthlyPaymentsFor = (days: number) => Math.max(1, Math.ceil(days / 30));
/** Which plan to highlight for a test `daysToTest` away; null = highlight nothing. */
export function recommendedPlan(daysToTest: number | null): PlanId | null {
  if (daysToTest === null || daysToTest <= 0) return null;
  if (PLUS.plans.monthly.amountCents === null || PLUS.plans.pass.amountCents === null) return null;
  return daysToTest >= PLUS.passRecommendMinDays ? "pass" : "monthly";
}
/** Label of every cross-page Plus CTA. */
export const plusCtaLabel = () => (paymentsLive() ? "Get Plus" : "See Plus plans");
/** "from $9.99/mo" next to lock CTAs; null when Monthly has no price. */
export function priceHint(): { text: string; sr: string } | null {
  const c = PLUS.plans.monthly.amountCents;
  return c === null ? null : { text: `from ${formatPrice(c)}/mo`, sr: `from ${formatPrice(c)} a month` };
}
/** Launch day still ahead of `todayIso` ("" = unknown yet → false). Call only in the browser. */
export const launchUpcoming = (todayIso: string) => Boolean(PLUS.launchDate && todayIso && PLUS.launchDate > todayIso);
/** Checkout link for a signed-in student; null when the plan isn't on sale. */
export function checkoutHref(p: PlusPlan, ctx: { userId: string; testDate?: string }): string | null {
  if (!isOnSale(p) || !p.checkoutUrl) return null;
  return p.checkoutUrl.split("{userId}").join(encodeURIComponent(ctx.userId)).split("{testDate}").join(encodeURIComponent(ctx.testDate ?? ""));
}
/** The message "Send to a parent" shares (the link is added separately). Same text is shown in #parents. */
export function parentMessage(tests: number, lessons: number): string {
  const m = PLUS.plans.monthly.amountCents;
  return `Hi! Could you look at Stellar Plus for my SAT prep? It has all ${tests} past-paper practice tests and ${lessons} interactive lessons${m !== null ? `, and Monthly is ${formatPrice(m)} a month` : ""}. Here's what it includes:`;
}
