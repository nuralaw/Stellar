"use client";

import { formatIsoDate } from "@/components/home/Countdown";
import { PLUS, launchUpcoming, paymentsLive } from "@/lib/plus-config";
import { daysUntil } from "@/lib/sat-dates";
import { useNow, useProfile } from "@/lib/store";
import { effectiveZone, todayIn } from "@/lib/timezone";

// Small personal islands on /plus. The page itself is static; each island fills in once the browser data is known.

/** Today as "YYYY-MM-DD" in the student's test time zone; "" on the server and before the clock is read. */
export function useToday(): string {
  const now = useNow();
  const profile = useProfile();
  return now ? todayIn(effectiveZone(profile.testTimeZone), now) : "";
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
