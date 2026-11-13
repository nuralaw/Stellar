import { NO_STORE, adminOnly } from "@/lib/admin";

// Admin only. GET ?from=<ISO>&to=<ISO>&bucket=day|week|month&tz=<IANA zone>
// → { stats: { series, totals, previous, users_total }, users: [...] } from the SQL functions in supabase/account_stats.sql.

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MAX_SPAN = 400 * 86_400_000;

async function rpc(name: string, args: Record<string, unknown>) {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    if (body.includes("PGRST202")) throw new Error("The account statistics aren't set up yet: run supabase/account_stats.sql in the Supabase SQL Editor.");
    console.error(`[admin/accounts] ${name}: ${res.status} ${body.slice(0, 300)}`);
    throw new Error("Couldn't load the account statistics.");
  }
  return res.json();
}

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
    const [stats, users] = await Promise.all([
      rpc("admin_account_stats", { p_from: new Date(from).toISOString(), p_to: new Date(to).toISOString(), p_bucket: bucket, p_tz: tz }),
      rpc("admin_account_list", { p_limit: 100 }),
    ]);
    return Response.json({ stats, users }, { headers: NO_STORE });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Couldn't load." }, { status: 503, headers: NO_STORE });
  }
}
