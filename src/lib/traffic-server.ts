import "server-only";
import type { TrafficBucket, TrafficStats } from "./traffic-types";

// Our own anonymous page-view counter in Supabase (supabase/traffic.sql).
//  - /api/track turns a beacon from the browser into a row: anonymous id, path, referring host, country. Nothing personal.
//  - /api/admin/traffic reads the stats through the admin_traffic_stats SQL function.
// Both use the service-role key; without SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY tracking is a no-op.

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const trafficConfigured = () => Boolean(SB_URL && SB_KEY);

export type PageView = { visitor: string; path: string; referrer: string | null; country: string | null };

/** Crawlers, link previews, headless browsers and scripts. An empty user agent counts as a bot too.
 *  (In-app browsers like Telegram's or Yandex's are real people, so only their *bot* agents match, via "bot".) */
const BOT =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|curl|wget|python|httpclient|http-client|java\/|go-http|okhttp|axios|node-fetch|undici|libwww|scrapy|phantom|selenium|puppeteer|playwright|facebookexternalhit|embedly|vkshare|pingdom|uptime|monitor|statuscake|ahrefs|semrush|bytespider|gptbot|perplexity/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent?.trim() || BOT.test(userAgent);
}

const bareHost = (host: string) => host.toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");

export function isLocalHost(host: string): boolean {
  const h = bareHost(host);
  return h === "localhost" || h.endsWith(".localhost") || h === "127.0.0.1" || h === "[::1]" || h === "::1" || h === "0.0.0.0";
}

/** "/practice?x=1#y" or a full URL → "/practice"; null for API/asset/file paths or junk. */
export function cleanPath(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw || raw.length > 2000) return null;
  let p: string;
  try {
    p = new URL(raw, "https://x.invalid").pathname;
  } catch {
    return null;
  }
  if (p.length > 1) p = p.replace(/\/+$/, "") || "/";
  if (/^\/(api|_next|_vercel)(\/|$)/.test(p)) return null;
  if (/\.[a-z0-9]{1,8}$/i.test(p.slice(p.lastIndexOf("/")))) return null; // a file: /favicon.ico, /robots.txt …
  return p.slice(0, 200);
}

/** document.referrer → "google.com" (lowercase, no "www."); null when direct, junk, or our own site. */
export function cleanReferrer(raw: unknown, ownHost: string): string | null {
  if (typeof raw !== "string" || !raw || raw.length > 2000) return null;
  let host: string;
  try {
    host = new URL(raw).hostname;
  } catch {
    return null;
  }
  host = bareHost(host);
  if (!host || host === bareHost(ownHost)) return null;
  return host.slice(0, 100);
}

export const cleanVisitor = (raw: unknown) => (typeof raw === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(raw) ? raw : null);

export function cleanCountry(raw: string | null): string | null {
  const c = raw?.trim().toUpperCase();
  return c && /^[A-Z]{2}$/.test(c) && c !== "XX" ? c : null;
}

export async function insertPageView(view: PageView): Promise<void> {
  if (!SB_URL || !SB_KEY) return;
  const res = await fetch(`${SB_URL}/rest/v1/page_views`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(view),
    cache: "no-store",
  });
  if (!res.ok) console.error(`[track] insert: ${res.status} ${(await res.text()).slice(0, 300)}`);
}

/** TrafficStats for [from, to) from admin_traffic_stats; throws an Error with a message fit for the admin. */
export async function trafficStats(from: Date, to: Date, bucket: TrafficBucket, tz: string): Promise<TrafficStats> {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/admin_traffic_stats`, {
    method: "POST",
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_from: from.toISOString(), p_to: to.toISOString(), p_bucket: bucket, p_tz: tz }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    if (body.includes("PGRST202")) throw new Error("The traffic statistics aren't set up yet: run supabase/traffic.sql in the Supabase SQL Editor.");
    console.error(`[admin/traffic] admin_traffic_stats: ${res.status} ${body.slice(0, 300)}`);
    throw new Error("Couldn't load the traffic statistics.");
  }
  const s = (await res.json()) as Omit<TrafficStats, "source" | "bucket">;
  return { source: "supabase", bucket, ...s };
}
