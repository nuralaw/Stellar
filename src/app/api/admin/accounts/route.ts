import { NO_STORE, adminOnly } from "@/lib/admin";
import { rpc } from "./rpc";

// Admin only. GET ?from=<ISO>&to=<ISO>&bucket=day|week|month&tz=<IANA zone>
// → { stats: { series, totals, previous, users_total } } from admin_account_stats in supabase/account_stats.sql.
// Finding accounts is /api/admin/accounts/search.

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
  const denied = await adminOnly(request);
  if (denied) return denied;
  if (!SB_URL || !SB_KEY) return Response.json({ error: "Supabase isn't configured on this server." }, { status: 503, headers: NO_STORE });

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

  try {
    const stats = await rpc("admin_account_stats", { p_from: new Date(from).toISOString(), p_to: new Date(to).toISOString(), p_bucket: bucket, p_tz: tz });
    return Response.json({ stats }, { headers: NO_STORE });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Couldn't load." }, { status: 503, headers: NO_STORE });
  }
}
