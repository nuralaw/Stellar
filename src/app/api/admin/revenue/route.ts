import { NO_STORE, adminOnly } from "@/lib/admin";

// Admin only. GET ?from=<ISO>&to=<ISO>&bucket=day|week|month&tz=<IANA zone>
// → { stats, kpis, recent, configured } from the SQL functions in supabase/payments.sql
// (admin_revenue_stats, admin_revenue_kpis, admin_recent_purchases). Amounts are integer cents.
// `configured` = which Gumroad env vars are present (booleans only, never the values).

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MAX_SPAN = 400 * 86_400_000;

const SETUP_MESSAGE =
  "Payments aren't set up yet: run supabase/payments.sql (npm run db:apply -- supabase/subscriptions.sql supabase/payments.sql) or paste it in the Supabase SQL Editor.";

/** The SQL isn't applied yet: function missing (PGRST202) or table missing (PGRST205 / 42P01). */
class SetupError extends Error {}

async function rpc(name: string, args: Record<string, unknown>) {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    if (/PGRST202|PGRST205|42P01/.test(body)) throw new SetupError(SETUP_MESSAGE);
    console.error(`[admin/revenue] ${name}: ${res.status} ${body.slice(0, 300)}`);
    throw new Error("Couldn't load the revenue numbers.");
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

const present = (v: string | undefined) => Boolean(v && v.trim());
function configured() {
  return {
    pingSecret: present(process.env.GUMROAD_PING_SECRET),
    accessToken: present(process.env.GUMROAD_ACCESS_TOKEN),
    webhookKey: present(process.env.GUMROAD_WEBHOOK_KEY),
    monthlyUrl: present(process.env.NEXT_PUBLIC_GUMROAD_MONTHLY_URL),
    passUrl: present(process.env.NEXT_PUBLIC_GUMROAD_PASS_URL),
  };
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
    const [stats, kpis, recent] = await Promise.all([
      rpc("admin_revenue_stats", { p_from: new Date(from).toISOString(), p_to: new Date(to).toISOString(), p_bucket: bucket, p_tz: tz }),
      rpc("admin_revenue_kpis", { p_tz: tz }),
      rpc("admin_recent_purchases", { p_limit: 50 }),
    ]);
    return Response.json({ stats, kpis, recent, configured: configured() }, { headers: NO_STORE });
  } catch (e) {
    if (e instanceof SetupError) return Response.json({ error: SETUP_MESSAGE, setup: true, configured: configured() }, { status: 503, headers: NO_STORE });
    return Response.json({ error: e instanceof Error ? e.message : "Couldn't load.", configured: configured() }, { status: 503, headers: NO_STORE });
  }
}
