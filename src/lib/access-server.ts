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

const floorId = (userId: string) => `admin:${userId}`;

/** purchases table call (service role). A missing table (payments.sql not run) is reported as such. */
async function purchasesRest(path: string, init: RequestInit = {}) {
  if (!SB_URL || !SB_KEY) throw new Error("Supabase isn't configured on this server.");
  const res = await fetch(`${SB_URL}/rest/v1/purchases${path}`, {
    ...init,
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    if (body.includes("PGRST205") || body.includes("42P01")) throw new Error("Payments tables aren't set up: run supabase/payments.sql.");
    console.error(`[purchases] ${init.method ?? "GET"}: ${res.status} ${body.slice(0, 300)}`);
    throw new Error("Couldn't reach the purchases table.");
  }
}

/**
 * Drops the synthetic "admin floor" purchase of a user (see extendPlus). Called whenever an admin sets or removes Plus by hand, so an
 * old floor can never come back through a later recompute. Does nothing when the payments tables don't exist yet.
 */
export async function dropAdminFloor(userId: string): Promise<void> {
  checkId(userId);
  try {
    await purchasesRest(`?sale_id=eq.${encodeURIComponent(floorId(userId))}`, { method: "DELETE" });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Payments tables aren't set up")) return;
    throw e;
  }
}

/**
 * Extends Plus to `until` without ever shortening it: a row with no end date (lifetime/admin) is kept, and so is one that already
 * ends later. When a sale extends an ACTIVE admin grant that has an end date, the old end date is first saved as a synthetic purchase
 * (sale_id 'admin:<userId>', provider 'admin', a test row, so it never counts as revenue) and the row becomes a Gumroad one. A later
 * refund then recomputes Plus as the max of that floor and the remaining valid purchases, so the admin's grant survives.
 * Returns the row now in force and whether it was written.
 */
export async function extendPlus(userId: string, until: Date, note?: string | null, source = "gumroad"): Promise<{ subscription: Subscription; changed: boolean }> {
  const current = await getSubscription(userId);
  if (current && (current.expiresAt === null || Date.parse(current.expiresAt) >= until.getTime())) return { subscription: current, changed: false };
  if (current && current.source === "admin" && isActive(current)) {
    await purchasesRest("?on_conflict=sale_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        sale_id: floorId(userId),
        provider: "admin",
        user_id: userId,
        price_cents: 0,
        fee_cents: 0,
        test: true,
        sale_at: current.createdAt || new Date().toISOString(),
        access_until: current.expiresAt,
        raw: { note: "Admin grant kept as the lowest Plus end date for this user." },
      }),
    });
  }
  return { subscription: await setPlus(userId, until, note, source), changed: true };
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
