import "server-only";
import type { TrafficBucket, TrafficPoint, TrafficRow, TrafficStats, TrafficTotals } from "@/lib/traffic-types";

// Plausible Stats API v2 → TrafficStats (src/lib/traffic-types.ts), for /admin → Traffic.
// Off until PLAUSIBLE_API_KEY and a site ID are set; the owner's checklist is docs/PLAUSIBLE.md.
//
// API reference: https://plausible.io/docs/stats-api
//   POST {host}/api/v2/query, header "Authorization: Bearer <key>", JSON body
//   { site_id, metrics, date_range, dimensions?, filters?, order_by?, include?, pagination? }
//   → { results: [{ dimensions: [...], metrics: [...] }], meta: {...}, query: {...} }.
//   date_range takes ["YYYY-MM-DD", "YYYY-MM-DD"] or ISO 8601 datetimes with an offset.
//   Rate limit 600 requests/hour per key. Business plan (or Enterprise) only: https://plausible.io/docs/subscription-plans
// Sample responses: https://github.com/plausible/docs/tree/master/src/js/apiv2-examples
// Behaviour checked in the source (https://github.com/plausible/analytics), not spelled out in the docs:
//   - time:* labels are dates in the site's *reporting time zone* (lib/plausible/stats/sql/expression.ex);
//     time:week = the Monday of the week, but never before the range start (date_or_weekstart in
//     lib/plausible/stats/time.ex); time:month = 1st of the month.
//   - visit:source is "Direct / None" for visits without a referrer (@no_ref in expression.ex).
//   - visit:country is the ISO 3166-1 alpha-2 code; "A1" = anonymous VPN, "ZZ"/empty = unknown.
//   - the echoed query.date_range is rendered in the site's time zone (lib/plausible/stats/query/result.ex),
//     which is how we learn the site's UTC offset.
//   - errors are { "error": "..." }: 400 bad query, 401 bad key/site, 402 plan lacks the Stats API
//     or site locked, 429 rate limit (lib/plausible_web/plugs/authorize_public_api.ex).
//
// Time zones: Plausible buckets the chart by the site's reporting time zone and the API has no
// time zone parameter. We send the period as exact instants, so totals and top lists are exact for
// [from, to). Chart buckets are exact only when the site's time zone (Plausible → Site settings →
// General) equals the admin's `tz`; otherwise the labels are site-zone days, slotted into our
// buckets by date, and days falling outside the period are dropped (never merged, since unique
// visitors can't be added up). getPlausibleTraffic reports that through `onWarning`.
//
// Caching: none. Every admin page load makes 6 fresh calls (cache: "no-store"); Plausible counts in
// real time and one admin stays far below 600 requests/hour, so a stale cache would only hide data.

const TIMEOUT_MS = 10_000;
const TOP = 10;

type Env = { apiKey: string; siteId: string; host: string };

function env(): Env | null {
  const apiKey = process.env.PLAUSIBLE_API_KEY?.trim() ?? "";
  const siteId = (process.env.PLAUSIBLE_SITE_ID?.trim() || process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim()) ?? "";
  const host = (process.env.PLAUSIBLE_HOST?.trim() || "https://plausible.io").replace(/\/+$/, "");
  return apiKey && siteId ? { apiKey, siteId, host } : null;
}

export function plausibleConfigured(): boolean {
  return env() !== null;
}

/** An error whose message is safe and readable for the admin panel. */
export class PlausibleError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "PlausibleError";
    this.status = status;
  }
}

// ---------- the API call ----------

export type PlausibleQuery = {
  metrics: string[];
  date_range: [string, string];
  dimensions?: string[];
  order_by?: [string, "asc" | "desc"][];
  pagination?: { limit: number; offset?: number };
};

export type PlausibleResponse = {
  results: { dimensions: (string | number | null)[]; metrics: (number | null)[] }[];
  meta?: Record<string, unknown>;
  query?: { date_range?: [string, string] };
};

export function plausibleErrorMessage(status: number, detail: string): string {
  const d = detail ? ` Plausible says: "${detail.slice(0, 200)}"` : "";
  switch (status) {
    case 400:
      return `Plausible refused the query (400).${d}`;
    case 401:
      return `Plausible rejected the API key or site ID (401). Check PLAUSIBLE_API_KEY and PLAUSIBLE_SITE_ID.${d}`;
    case 402:
      return `Plausible's subscription doesn't include the Stats API, or the site is locked (402). The Stats API needs the Business plan.${d}`;
    case 403:
      return `This API key isn't allowed to read stats for the site (403).${d}`;
    case 404:
      return `Plausible doesn't know this site (404). PLAUSIBLE_SITE_ID must match the domain added in Plausible.${d}`;
    case 429:
      return "Plausible's rate limit is reached (600 requests per hour). Try again in a few minutes.";
    default:
      return status >= 500 ? `Plausible is having trouble right now (${status}). Try again later.` : `Plausible answered ${status}.${d}`;
  }
}

async function query(e: Env, q: PlausibleQuery): Promise<PlausibleResponse> {
  let res: Response;
  try {
    res = await fetch(`${e.host}/api/v2/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${e.apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ site_id: e.siteId, ...q }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new PlausibleError(`Plausible didn't answer within ${TIMEOUT_MS / 1000} s.`, 504);
    }
    throw new PlausibleError(`Couldn't reach Plausible at ${e.host}.`, 502);
  }
  const text = await res.text();
  if (!res.ok) {
    let detail = "";
    try {
      const body = JSON.parse(text) as { error?: unknown };
      if (typeof body.error === "string") detail = body.error;
    } catch {
      /* not JSON */
    }
    console.error(`[plausible] ${res.status} ${text.slice(0, 300)}`);
    throw new PlausibleError(plausibleErrorMessage(res.status, detail), res.status);
  }
  try {
    const body = JSON.parse(text) as PlausibleResponse;
    if (!Array.isArray(body.results)) throw new Error("no results");
    return body;
  } catch {
    throw new PlausibleError("Plausible sent an answer we couldn't read.", 502);
  }
}

// ---------- dates (calendar math on "YYYY-MM-DD", no time zones involved) ----------

/** The calendar date of an instant in a time zone, "YYYY-MM-DD". */
export function ymdIn(instant: number, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
}

/** UTC offset of a time zone at an instant, "+05:00" / "-03:30" / "+00:00". */
export function offsetIn(instant: number, tz: string): string {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
    .formatToParts(instant)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = name?.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : "+00:00";
}

const toDate = (ymd: string) => new Date(`${ymd}T00:00:00Z`);
const fmt = (d: Date) => d.toISOString().slice(0, 10);

/** Start of the bucket containing a date: the day itself, its Monday, or the 1st of its month (like Postgres date_trunc). */
export function bucketStart(ymd: string, bucket: TrafficBucket): string {
  const d = toDate(ymd);
  if (bucket === "week") d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  if (bucket === "month") d.setUTCDate(1);
  return fmt(d);
}

/** Every bucket start from the one holding `from` to the one holding the last second before `to`, in tz. */
export function bucketList(from: number, to: number, bucket: TrafficBucket, tz: string): string[] {
  const first = bucketStart(ymdIn(from, tz), bucket);
  const last = bucketStart(ymdIn(to - 1000, tz), bucket);
  const out: string[] = [];
  for (const d = toDate(first); fmt(d) <= last; ) {
    out.push(fmt(d));
    if (bucket === "day") d.setUTCDate(d.getUTCDate() + 1);
    else if (bucket === "week") d.setUTCDate(d.getUTCDate() + 7);
    else d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return out;
}

/** [from, to) as Plausible's inclusive datetime pair, second precision, in UTC. */
export function plausibleRange(from: number, to: number): [string, string] {
  const iso = (ms: number) => new Date(Math.floor(ms / 1000) * 1000).toISOString().replace(".000Z", "+00:00");
  return [iso(from), iso(to - 1000)];
}

// ---------- mapping ----------

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

export function mapTotals(r: PlausibleResponse): TrafficTotals {
  const m = r.results[0]?.metrics ?? [];
  return { visitors: num(m[0]), pageviews: num(m[1]) };
}

/** Zero-filled series over `buckets`; Plausible's labels are slotted in by their bucket start. */
export function mapSeries(r: PlausibleResponse, buckets: string[], bucket: TrafficBucket): { series: TrafficPoint[]; dropped: number } {
  const byStart = new Map(buckets.map((t) => [t, { t, visitors: 0, pageviews: 0 }]));
  let dropped = 0;
  for (const row of r.results) {
    const label = String(row.dimensions[0] ?? "").slice(0, 10);
    const point = /^\d{4}-\d{2}-\d{2}$/.test(label) ? byStart.get(bucketStart(label, bucket)) : undefined;
    if (!point) {
      dropped++;
      continue;
    }
    // At most one label per bucket (a first week clipped to the range start still maps to its own Monday).
    point.visitors = num(row.metrics[0]);
    point.pageviews = num(row.metrics[1]);
  }
  return { series: [...byStart.values()], dropped };
}

const NOT_COUNTRIES = new Set(["ZZ", "XX", "A1", "A2", "O1", "T1", "EU", "AP"]);

export function sourceName(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return !s || s === "Direct / None" || s === "(Direct / None)" ? "Direct" : s;
}

export function countryName(v: unknown): string {
  const s = typeof v === "string" ? v.trim().toUpperCase() : "";
  return /^[A-Z]{2}$/.test(s) && !NOT_COUNTRIES.has(s) ? s : "Unknown";
}

/** Top list rows with names normalised; rows that end up with the same name are merged. */
export function mapRows(r: PlausibleResponse, name: (v: unknown) => string = (v) => String(v ?? "")): TrafficRow[] {
  const rows = new Map<string, TrafficRow>();
  for (const row of r.results) {
    const n = name(row.dimensions[0]);
    const prev = rows.get(n) ?? { name: n, visitors: 0, pageviews: 0 };
    prev.visitors += num(row.metrics[0]);
    prev.pageviews += num(row.metrics[1]);
    rows.set(n, prev);
  }
  return [...rows.values()].sort((a, b) => b.visitors - a.visitors || b.pageviews - a.pageviews).slice(0, TOP);
}

// ---------- the whole tab ----------

export type PlausibleTrafficOptions = {
  from: Date;
  to: Date;
  bucket: TrafficBucket;
  tz: string;
  /** Called with a human-readable note when the numbers need a caveat (time zone mismatch). */
  onWarning?: (message: string) => void;
};

/** Traffic for [from, to) from Plausible. Throws PlausibleError with a readable message. */
export async function getPlausibleTraffic({ from, to, bucket, tz, onWarning }: PlausibleTrafficOptions): Promise<TrafficStats> {
  const e = env();
  if (!e) throw new PlausibleError("Plausible isn't configured on this server.", 503);
  const f = from.getTime();
  const t = to.getTime();
  const range = plausibleRange(f, t);
  const previous = plausibleRange(f - (t - f), f);
  const metrics = ["visitors", "pageviews"];
  const top = (dimension: string): PlausibleQuery => ({
    metrics,
    date_range: range,
    dimensions: [dimension],
    order_by: [["visitors", "desc"]],
    pagination: { limit: TOP },
  });

  const [series, totals, prev, pages, sources, countries] = await Promise.all([
    query(e, { metrics, date_range: range, dimensions: [`time:${bucket}`] }),
    query(e, { metrics, date_range: range }),
    query(e, { metrics, date_range: previous }),
    query(e, top("event:page")),
    query(e, top("visit:source")),
    query(e, top("visit:country")),
  ]);

  const buckets = bucketList(f, t, bucket, tz);
  const mapped = mapSeries(series, buckets, bucket);

  // The echoed range is printed in the site's time zone, e.g. "2026-11-01T00:00:00+05:00".
  const echoed = series.query?.date_range ?? totals.query?.date_range;
  const siteOffsets = echoed?.map((s) => s.match(/([+-]\d{2}:\d{2}|Z)$/)?.[1]?.replace("Z", "+00:00"));
  const ourOffsets = [offsetIn(f, tz), offsetIn(t - 1000, tz)];
  if (onWarning && siteOffsets?.every(Boolean) && siteOffsets.some((o, i) => o !== ourOffsets[i])) {
    onWarning(
      `Plausible's chart uses the site's time zone (UTC${siteOffsets[0]}), not ${tz} (UTC${ourOffsets[0]}): ` +
        `days are shifted${mapped.dropped ? ` and ${mapped.dropped} bucket(s) outside the period were left out` : ""}. ` +
        `Totals and top lists are exact. Set the site's time zone in Plausible (Site settings > General) to fix it.`,
    );
  }

  return {
    source: "plausible",
    bucket,
    series: mapped.series,
    totals: mapTotals(totals),
    previous: mapTotals(prev),
    pages: mapRows(pages),
    referrers: mapRows(sources, sourceName),
    countries: mapRows(countries, countryName),
  };
}
