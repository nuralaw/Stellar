import "server-only";
import { currentUser, isAdmin } from "./admin";
import { accessFor, type Access } from "./access-core";

// Server-side access. The subscriptions table (supabase/subscriptions.sql) is read and written with the
// service-role key only. Plus is granted by an admin for now (setPlus), later by a payment provider.

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface Subscription {
  userId: string;
  plan: "plus";
  /** ISO date, null = no end. */
  expiresAt: string | null;
  source: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Row {
  user_id: string;
  plan: "plus";
  expires_at: string | null;
  source: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

const fromRow = (r: Row): Subscription => ({
  userId: r.user_id,
  plan: r.plan,
  expiresAt: r.expires_at,
  source: r.source,
  note: r.note,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

/** Whether the subscription is in force right now (no end date, or the end is in the future). */
export function isActive(sub: Pick<Subscription, "expiresAt"> | null): boolean {
  if (!sub) return false;
  return sub.expiresAt === null || Date.parse(sub.expiresAt) > Date.now();
}

async function rest(path: string, init: RequestInit = {}) {
  if (!SB_URL || !SB_KEY) throw new Error("Supabase isn't configured on this server.");
  const res = await fetch(`${SB_URL}/rest/v1/subscriptions${path}`, {
    ...init,
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[subscriptions] ${init.method ?? "GET"} ${path}: ${res.status} ${body.slice(0, 300)}`);
    if (body.includes("PGRST205") || body.includes("42P01")) throw new Error("Subscriptions aren't set up yet: run supabase/subscriptions.sql in the Supabase SQL Editor.");
    throw new Error("Couldn't reach the subscriptions table.");
  }
  return res;
}

function checkId(userId: string) {
  if (!UUID.test(userId)) throw new Error("Bad user id.");
}

/** The user's subscription row (active or expired), or null. Throws when Supabase isn't reachable or set up. */
export async function getSubscription(userId: string): Promise<Subscription | null> {
  checkId(userId);
  const rows: Row[] = await (await rest(`?user_id=eq.${userId}&select=*`)).json();
  return rows[0] ? fromRow(rows[0]) : null;
}

/** Grants (or changes) Plus. expiresAt null = no end. Returns the saved row. */
export async function setPlus(userId: string, expiresAt: Date | string | null, note?: string | null, source = "admin"): Promise<Subscription> {
  checkId(userId);
  let expires: string | null = null;
  if (expiresAt !== null) {
    const t = expiresAt instanceof Date ? expiresAt.getTime() : Date.parse(expiresAt);
    if (!Number.isFinite(t)) throw new Error("Bad end date.");
    expires = new Date(t).toISOString();
  }
  const res = await rest("?on_conflict=user_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ user_id: userId, plan: "plus", expires_at: expires, source, note: note?.trim() || null }),
  });
  const rows: Row[] = await res.json();
  return fromRow(rows[0]);
}

/** Takes Plus away (deletes the row). */
export async function removePlus(userId: string): Promise<void> {
  checkId(userId);
  await rest(`?user_id=eq.${userId}`, { method: "DELETE" });
}

/** Server-side access for the signed-in visitor (checked with Supabase Auth). Admin gets everything; an active subscription gives Plus; otherwise free. Never throws. */
export async function getAccess(): Promise<Access> {
  try {
    const user = await currentUser();
    if (!user) return accessFor("free");
    if (isAdmin(user)) return accessFor("admin");
    if (!SB_URL || !SB_KEY) return accessFor("free");
    const sub = await getSubscription(user.id);
    return sub && isActive(sub) ? accessFor("plus", sub.expiresAt) : accessFor("free");
  } catch {
    return accessFor("free");
  }
}
