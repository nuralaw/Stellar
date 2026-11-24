// Date formatting for the SAT date pages and the landing page. No imports: safe for server and browser, and light enough that a
// page which only needs these does not pull in the test index or the question bank.

const UTC = { timeZone: "UTC" } as const;
const SHORT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...UTC });
const WITH_YEAR = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", ...UTC });
const at = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** "Dec 5" */
export const shortDate = (iso: string) => SHORT.format(at(iso));
/** "Dec 5, 2026" */
export const dateWithYear = (iso: string) => WITH_YEAR.format(at(iso));
/** "2026–27", or "2027" when every date falls in one year. */
export function seasonLabel(dates: string[]): string {
  if (dates.length === 0) return "";
  const first = dates[0].slice(0, 4);
  const last = dates[dates.length - 1].slice(0, 4);
  return first === last ? first : `${first}–${last.slice(2)}`;
}
