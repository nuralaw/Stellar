import "server-only";
import { cacheLife } from "next/cache";
import { SAT_DATES, type SatDate } from "./sat-dates";

/**
 * The SAT dates that are not over yet, split into official and anticipated (College Board's own wording, see sat-dates.ts).
 * Cached for a day, so the static /sat-dates page never needs a request-time clock. A date stays in the list until a day after
 * it (same one-day safety as `satClock` in components/landing/dusk/facts.ts). The cached HTML can still be older than that
 * (a day, or longer on a quiet site), so the page's OfficialDates component drops dates that are over in the visitor's browser.
 */
export async function satCalendar(): Promise<{ official: SatDate[]; anticipated: SatDate[] }> {
  "use cache";
  cacheLife("days");
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const ahead = SAT_DATES.filter((d) => d.date >= yesterday);
  return { official: ahead.filter((d) => !d.anticipated), anticipated: ahead.filter((d) => d.anticipated) };
}
