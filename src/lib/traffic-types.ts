// Shared shape of site-traffic statistics for /admin → Traffic.
// Two sources return exactly this: our own counter in Supabase (/api/admin/traffic) and, later,
// Plausible's Stats API (/api/admin/traffic/plausible). The admin tab renders either one.
//
// Both endpoints: GET ?from=<ISO instant>&to=<ISO instant>&bucket=day|week|month&tz=<IANA zone>
// (the same query the Accounts tab sends to /api/admin/accounts; max span 400 days)
// → TrafficStats, or { error: string } with a 4xx/5xx status.
// The Plausible endpoint answers { configured: false } (200) while PLAUSIBLE_API_KEY / NEXT_PUBLIC_PLAUSIBLE_DOMAIN aren't set.

export type TrafficSource = "supabase" | "plausible";
export type TrafficBucket = "day" | "week" | "month";

/** One bucket of the chart. t = bucket start as "YYYY-MM-DD" in the requested time zone. */
export type TrafficPoint = { t: string; visitors: number; pageviews: number };

/** One row of a top list. */
export type TrafficRow = { name: string; visitors: number; pageviews: number };

export type TrafficTotals = { visitors: number; pageviews: number };

export type TrafficStats = {
  source: TrafficSource;
  bucket: TrafficBucket;
  series: TrafficPoint[];
  /** Unique visitors / page views over the whole period. */
  totals: TrafficTotals;
  /** The same numbers for the period of equal length right before. */
  previous: TrafficTotals;
  /** Top 10 paths, e.g. "/practice". */
  pages: TrafficRow[];
  /** Top 10 sources: a host like "google.com", "t.me", "instagram.com", or "Direct". */
  referrers: TrafficRow[];
  /** Top 10 countries as ISO 3166-1 alpha-2 codes ("KZ"), "Unknown" when missing. */
  countries: TrafficRow[];
};

export type TrafficNotConfigured = { configured: false };
