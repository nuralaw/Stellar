import { NO_STORE, adminOnly } from "@/lib/admin";
import { PlausibleError, getPlausibleTraffic, plausibleConfigured } from "@/lib/plausible";
import type { TrafficBucket, TrafficNotConfigured, TrafficStats } from "@/lib/traffic-types";

// Admin only. GET ?from=<ISO>&to=<ISO>&bucket=day|week|month&tz=<IANA zone>
// → TrafficStats from Plausible's Stats API (src/lib/plausible.ts), or { configured: false } while
// PLAUSIBLE_API_KEY / the site ID aren't set. Never cached: every call asks Plausible afresh.
// A time zone caveat, if any, comes back in the X-Traffic-Note header.

const MAX_SPAN = 400 * 86_400_000;

function validZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;
  if (!plausibleConfigured()) return Response.json({ configured: false } satisfies TrafficNotConfigured, { headers: NO_STORE });

  const q = new URL(request.url).searchParams;
  const from = Date.parse(q.get("from") ?? "");
  const to = Date.parse(q.get("to") ?? "");
  const bucket = q.get("bucket") ?? "day";
  const tz = q.get("tz") ?? "UTC";
  if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to || to - from > MAX_SPAN) {
    return Response.json({ error: "Pick a period of up to 400 days." }, { status: 400, headers: NO_STORE });
  }
  if (!["day", "week", "month"].includes(bucket) || !validZone(tz)) {
    return Response.json({ error: "Bad bucket or time zone." }, { status: 400, headers: NO_STORE });
  }

  let note = "";
  try {
    const stats: TrafficStats = await getPlausibleTraffic({
      from: new Date(from),
      to: new Date(to),
      bucket: bucket as TrafficBucket,
      tz,
      onWarning: (m) => (note = m),
    });
    // Header values must be ByteString: keep the note ASCII.
    const headers = note ? { ...NO_STORE, "X-Traffic-Note": note.replace(/[^\x20-\x7e]/g, "") } : NO_STORE;
    return Response.json(stats, { headers });
  } catch (e) {
    // Upstream failures are 502/504 here, never 401/403: those would read as "you're signed out".
    const status = e instanceof PlausibleError && e.status === 504 ? 504 : 502;
    const message = e instanceof PlausibleError ? e.message : "Couldn't load the Plausible statistics.";
    if (!(e instanceof PlausibleError)) console.error("[admin/traffic/plausible]", e);
    return Response.json({ error: message }, { status, headers: NO_STORE });
  }
}
