import { NO_STORE, adminOnly } from "@/lib/admin";
import { dropAdminFloor, removePlus, setPlus } from "@/lib/access-server";

// Admin only. Stellar Plus is granted by hand for now.
// GET    → { subscriptions: [{ userId, email, plan, expiresAt, source, note, createdAt, updatedAt }] }
// POST   { userId, expiresAt: ISO | null, note? } → grants or changes Plus (null = no end date)
// DELETE { userId } → takes Plus away

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ROWS = 500;

interface Row {
  user_id: string;
  plan: string;
  expires_at: string | null;
  source: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

function fail(e: unknown, fallback: string, status = 503) {
  return Response.json({ error: e instanceof Error ? e.message : fallback }, { status, headers: NO_STORE });
}

async function emailOf(userId: string): Promise<string | null> {
  try {
    const res = await fetch(`${SB_URL}/auth/v1/admin/users/${userId}`, {
      headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return typeof json?.email === "string" ? json.email : null;
  } catch {
    return null;
  }
}

async function listRows(): Promise<Row[]> {
  const res = await fetch(`${SB_URL}/rest/v1/subscriptions?select=*&order=updated_at.desc&limit=${MAX_ROWS}`, {
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[admin/subscriptions] list: ${res.status} ${body.slice(0, 300)}`);
    if (body.includes("PGRST205") || body.includes("42P01")) throw new Error("Subscriptions aren't set up yet: run supabase/subscriptions.sql in the Supabase SQL Editor.");
    throw new Error("Couldn't load the subscriptions.");
  }
  return res.json();
}

export async function GET(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  if (!SB_URL || !SB_KEY) return Response.json({ error: "Supabase isn't configured on this server." }, { status: 503, headers: NO_STORE });
  try {
    const rows = await listRows();
    const emails = await Promise.all(rows.map((r) => emailOf(r.user_id)));
    const subscriptions = rows.map((r, i) => ({
      userId: r.user_id,
      email: emails[i],
      plan: r.plan,
      expiresAt: r.expires_at,
      source: r.source,
      note: r.note,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    return Response.json({ subscriptions }, { headers: NO_STORE });
  } catch (e) {
    return fail(e, "Couldn't load.");
  }
}

async function body(request: Request): Promise<Record<string, unknown> | null> {
  const json = await request.json().catch(() => null);
  return json && typeof json === "object" ? (json as Record<string, unknown>) : null;
}

const bad = (error: string) => Response.json({ error }, { status: 400, headers: NO_STORE });

export async function POST(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const b = await body(request);
  if (!b) return bad("Bad request.");

  const { userId, expiresAt, note } = b;
  if (typeof userId !== "string" || !UUID.test(userId)) return bad("Bad user id.");
  let end: string | null = null;
  if (expiresAt !== null) {
    if (typeof expiresAt !== "string") return bad("Bad end date.");
    const t = Date.parse(expiresAt);
    if (!Number.isFinite(t)) return bad("Bad end date.");
    if (t <= Date.now()) return bad("The end date must be in the future.");
    end = new Date(t).toISOString();
  }
  if (note !== undefined && note !== null && typeof note !== "string") return bad("Bad note.");
  if (typeof note === "string" && note.trim().length > 200) return bad("The note can be at most 200 characters.");

  try {
    await dropAdminFloor(userId); // a hand-made grant replaces any floor a Gumroad sale saved from an earlier one
    const subscription = await setPlus(userId, end, typeof note === "string" ? note : null, "admin");
    return Response.json({ subscription }, { headers: NO_STORE });
  } catch (e) {
    return fail(e, "Couldn't save.");
  }
}

export async function DELETE(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const b = await body(request);
  if (!b) return bad("Bad request.");
  if (typeof b.userId !== "string" || !UUID.test(b.userId)) return bad("Bad user id.");
  try {
    await dropAdminFloor(b.userId);
    await removePlus(b.userId);
    return Response.json({ ok: true }, { headers: NO_STORE });
  } catch (e) {
    return fail(e, "Couldn't remove.");
  }
}
