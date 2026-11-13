import { after } from "next/server";
import { cleanCountry, cleanPath, cleanReferrer, cleanVisitor, insertPageView, isBot, isLocalHost, trafficConfigured } from "@/lib/traffic-server";

// Anonymous page views from the browser tracker (navigator.sendBeacon, so the JSON may come as text/plain).
// POST { visitor, path, referrer? } → always 204, right away; the row is written after the response.
// Skipped: bots, API/asset paths, bad ids, more than 60 views a minute from one visitor, and localhost
// (dev shares the production Supabase project) unless TRACK_LOCALHOST=1.

const MAX_BODY = 2048;
const LIMIT = 60;
const WINDOW = 60_000;
const recent = new Map<string, { start: number; n: number }>();

function overLimit(visitor: string, now: number): boolean {
  if (recent.size > 5000) for (const [k, v] of recent) if (now - v.start > WINDOW) recent.delete(k);
  const r = recent.get(visitor);
  if (!r || now - r.start > WINDOW) {
    recent.set(visitor, { start: now, n: 1 });
    return false;
  }
  return ++r.n > LIMIT;
}

const done = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (!trafficConfigured() || isBot(request.headers.get("user-agent"))) return done();
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) return done();

  const host = request.headers.get("host") ?? new URL(request.url).host;
  if (isLocalHost(host) && process.env.TRACK_LOCALHOST !== "1") return done();

  let body: { visitor?: unknown; path?: unknown; referrer?: unknown };
  try {
    const text = await request.text(); // JSON either way: application/json or sendBeacon's text/plain
    if (text.length > MAX_BODY) return done();
    body = JSON.parse(text);
  } catch {
    return done();
  }
  if (!body || typeof body !== "object") return done();

  const visitor = cleanVisitor(body.visitor);
  const path = cleanPath(body.path);
  if (!visitor || !path || overLimit(visitor, Date.now())) return done();

  const view = {
    visitor,
    path,
    referrer: cleanReferrer(body.referrer, host),
    country: cleanCountry(request.headers.get("x-vercel-ip-country")),
  };
  after(() => insertPageView(view).catch((e) => console.error("[track]", e)));
  return done();
}
