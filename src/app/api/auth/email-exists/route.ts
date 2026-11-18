import type { NextRequest } from "next/server";

// POST { email } → { exists: boolean | null }: does an account with this email already exist? Used by /register to offer
// "sign in" instead of creating a second account. Reachable signed out (the proxy doesn't gate /api/*).
// null = couldn't tell (not configured, Supabase unreachable, rate limited): the caller carries on with registration.
// This does tell anyone whether an address is registered, so it is rate limited per IP (best effort: in memory, per instance).

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HEADERS = { "Cache-Control": "no-store" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

/** True when this IP is over its limit; otherwise counts the request. */
function limited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  hits.set(ip, [...recent, now]);
  return false;
}

const reply = (body: { exists: boolean | null } | { error: string }, status = 200) => Response.json(body, { status, headers: HEADERS });

async function exists(email: string): Promise<boolean | null> {
  if (!SB_URL || !SB_KEY) return null;
  try {
    // `filter` is a substring match (ilike), so ask for a page of candidates and compare exactly.
    const res = await fetch(`${SB_URL}/auth/v1/admin/users?filter=${encodeURIComponent(email)}&per_page=100`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { users?: { email?: string | null; email_confirmed_at?: string | null }[] };
    if (!Array.isArray(body.users)) return null;
    // Only confirmed accounts count: signInWithOtp creates the user before the code is entered, and an unfinished
    // sign-up must not block registering again with the same email.
    return body.users.some((u) => u.email?.toLowerCase() === email && Boolean(u.email_confirmed_at));
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return reply({ exists: null }, 429);

  let email = "";
  try {
    const body: unknown = await request.json();
    const v = body && typeof body === "object" ? (body as { email?: unknown }).email : undefined;
    if (typeof v === "string") email = v.trim().toLowerCase();
  } catch {
    return reply({ error: "Bad request." }, 400);
  }
  if (!email || email.length > 254 || !EMAIL.test(email)) return reply({ error: "Bad request." }, 400);

  return reply({ exists: await exists(email) });
}
