"use client";

import { formatIsoDate } from "@/components/home/Countdown";
import { useAccess } from "@/lib/access";
import { PLUS, formatPrice, launchUpcoming, paymentsLive } from "@/lib/plus-config";
import { dueLabel, reviewQueue } from "@/lib/review";
import { daysUntil } from "@/lib/sat-dates";
import { useAttempts, useHydrated, useNow, useProfile, useTestResults } from "@/lib/store";
import { effectiveZone, todayIn } from "@/lib/timezone";

// Small personal islands on /plus. The page itself is static; each island fills in once the browser data is known.

/** Today as "YYYY-MM-DD" in the student's test time zone; "" on the server and before the clock is read. */
export function useToday(): string {
  const now = useNow();
  const profile = useProfile();
  return now ? todayIn(effectiveZone(profile.testTimeZone), now) : "";
}

/** The line under the hero buttons: price and launch state. */
export function TrustLine() {
  const today = useToday();
  const m = PLUS.plans.monthly.amountCents;
  // Without a launch date the text doesn't depend on today's date, so it can render on the server too.
  if (!today && PLUS.launchDate)
    return (
      <p aria-hidden="true" className="mt-3 min-h-5 text-sm text-side-ink/80">
        &nbsp;
      </p>
    );
  const parts = paymentsLive()
    ? [m !== null && `From ${formatPrice(m)} a month`, "Everything free stays free"]
    : [
        launchUpcoming(today) ? `Plus opens ${formatIsoDate(PLUS.launchDate as string, { month: "short", day: "numeric" })}` : "Payments open soon",
        m !== null && `${formatPrice(m)} a month`,
        "Everything free stays free",
      ];
  return <p className="mt-3 min-h-5 text-sm text-side-ink/80">{parts.filter(Boolean).join(" · ")}</p>;
}

/** "Plus opens Nov 29." / "Payments open soon." (nothing once payments are live). */
export function LaunchSentence({ format }: { format: "short" | "long" }) {
  const today = useToday();
  if (paymentsLive()) return null;
  const d = PLUS.launchDate;
  if (!d) return <>Payments open soon.</>;
  if (!today) return null;
  if (!launchUpcoming(today)) return <>Payments open soon.</>;
  return format === "short" ? (
    <>Plus opens {formatIsoDate(d, { month: "short", day: "numeric" })}.</>
  ) : (
    <>Payments are planned to open on {formatIsoDate(d, { month: "long", day: "numeric", year: "numeric" })}.</>
  );
}

const mistakes = (n: number) => `${n} ${n === 1 ? "mistake" : "mistakes"}`;

/** One personal sentence in the hero, from this browser's own data (free, admin and guest visitors only). */
export function HeroPersonal({ freeIds, plusOnly }: { freeIds: string[]; plusOnly: number }) {
  const hydrated = useHydrated();
  const access = useAccess();
  const now = useNow();
  const attempts = useAttempts();
  const results = useTestResults();
  let text: string | null = null;
  if (hydrated && now && access.ready && access.plan !== "plus") {
    const q = reviewQueue(attempts, now);
    const total = q.due.length + q.upcoming.length + q.mastered.length;
    const taken = freeIds.filter((id) => results.some((r) => r.testId === id)).length;
    if (q.due.length > 0) text = `You have ${mistakes(total)} saved. With Plus, ${q.due.length} would be due for review today.`;
    else if (q.upcoming.length > 0) text = `You have ${mistakes(total)} saved. With Plus, they'd start coming back ${dueLabel(q.upcoming[0].dueDay, now)}.`;
    else if (taken > 0) text = `You've taken ${taken} of ${freeIds.length} free practice tests. Plus adds ${plusOnly} more past papers.`;
    else if (attempts.length >= 20) text = `You've answered ${attempts.length.toLocaleString("en-US")} questions. Plus shows which skills are costing you points.`;
  }
  return <p className="mt-4 min-h-10 text-sm text-side-ink/80 sm:min-h-5">{text}</p>;
}

/** On the Mistakes tour: what Plus would do with this browser's saved mistakes. */
export function ReviewPersonal() {
  const hydrated = useHydrated();
  const access = useAccess();
  const now = useNow();
  const attempts = useAttempts();
  if (!hydrated || !now || !access.ready || access.plan === "plus") return null;
  const q = reviewQueue(attempts, now);
  if (q.due.length + q.upcoming.length === 0) return null;
  const total = q.due.length + q.upcoming.length + q.mastered.length;
  return (
    <p className="mt-4 rounded-xl bg-primary-soft/60 px-4 py-3 text-sm">
      You have {mistakes(total)} saved.{" "}
      {q.due.length > 0 ? `With Plus, ${q.due.length} would be due for review today.` : `With Plus, they'd start coming back ${dueLabel(q.upcoming[0].dueDay, now)}.`} They&apos;re scheduled from your
      history the moment Plus starts.
    </p>
  );
}

/** "Your SAT: Sat, Mar 6, 2027 · 110 days to go." in the final band. */
export function FinalDateLine() {
  const today = useToday();
  const d = useProfile().testDate;
  let text: string | null = null;
  if (today && d && d >= today) {
    const n = daysUntil(d, today);
    text = `Your SAT: ${formatIsoDate(d, { weekday: "short", month: "short", day: "numeric", year: "numeric" })} · ${n === 0 ? "it's today" : `${n} ${n === 1 ? "day" : "days"} to go`}.`;
  }
  return <p className="mt-3 min-h-6 text-side-ink/80">{text}</p>;
}
