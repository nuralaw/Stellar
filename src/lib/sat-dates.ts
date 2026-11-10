// Official SAT weekend test dates (same dates for U.S. and international students).
// Source: https://satsuite.collegeboard.org/sat/dates-deadlines (checked 2026-11-11).
// 2027–28 dates are "anticipated" by College Board and have no registration deadlines yet.

export interface SatDate {
  /** "YYYY-MM-DD" (a Saturday, in the test center's local time). */
  date: string;
  /** Regular registration deadline, if published. */
  register?: string;
  anticipated?: boolean;
}

export const SAT_DATES: SatDate[] = [
  { date: "2026-10-03", register: "2026-09-18" },
  { date: "2026-11-07", register: "2026-10-23" },
  { date: "2026-12-05", register: "2026-11-20" },
  { date: "2027-03-06", register: "2027-02-19" },
  { date: "2027-05-01", register: "2027-04-16" },
  { date: "2027-06-05", register: "2027-05-21" },
  { date: "2027-08-28", anticipated: true },
  { date: "2027-09-18", anticipated: true },
  { date: "2027-10-09", anticipated: true },
  { date: "2027-11-06", anticipated: true },
  { date: "2027-12-04", anticipated: true },
  { date: "2028-03-04", anticipated: true },
  { date: "2028-05-06", anticipated: true },
  { date: "2028-06-03", anticipated: true },
];

/** Test center doors close at 8:00 a.m. local time; the countdown counts down to that moment. */
export const TEST_START_HOUR = 8;

/** Official dates that are today or later (by the given local "YYYY-MM-DD"). */
export function upcomingSatDates(todayIso: string): SatDate[] {
  return SAT_DATES.filter((d) => d.date >= todayIso);
}

export function findSatDate(iso: string | null): SatDate | undefined {
  return SAT_DATES.find((d) => d.date === iso);
}
