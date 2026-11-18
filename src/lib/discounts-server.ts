import "server-only";
import { PLUS } from "./plus-config";

// Personal "first month of Monthly" discounts (supabase/discounts.sql), read and written with the service-role key only.
// A student with an OPEN row (not used, not revoked) gets the shared Gumroad code GUMROAD_BUG_CODE in their checkout link;
// the sale webhook (payments-server.ts) closes the row with markUsed(). See docs/PAYMENTS.md → Bug-report discounts.

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUPPORT_ID = /^[\w-]{1,64}$/;
const OPEN = "used_at=is.null&revoked_at=is.null";

export type DiscountSource = "bug" | "admin";
export type DiscountStatus = "open" | "used" | "revoked";

/** The shared Gumroad offer code (env GUMROAD_BUG_CODE), or null when it isn't set. */
export const bugCode = (): string | null => process.env.GUMROAD_BUG_CODE?.trim() || null;

class UniqueViolation extends Error {}

async function rest(path: string, init: RequestInit = {}) {
  if (!SB_URL || !SB_KEY) throw new Error("Supabase isn't configured on this server.");
  const res = await fetch(`${SB_URL}/rest/v1/discounts${path}`, {
    ...init,
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 409 || body.includes("23505")) throw new UniqueViolation();
    console.error(`[discounts] ${init.method ?? "GET"} ${path}: ${res.status} ${body.slice(0, 300)}`);
    if (body.includes("PGRST205") || body.includes("42P01")) throw new Error("Discounts aren't set up yet: run supabase/discounts.sql in the Supabase SQL Editor.");
    throw new Error("Couldn't reach the discounts table.");
  }
  return res;
}

function checkId(userId: string) {
  if (!UUID.test(userId)) throw new Error("Bad user id.");
}

/** The user's open discount (not used, not revoked), or null. */
export async function openDiscount(userId: string): Promise<{ percent: number } | null> {
  checkId(userId);
  const rows: { percent: number }[] = await (await rest(`?user_id=eq.${userId}&${OPEN}&select=percent&limit=1`)).json();
  return rows[0] ? { percent: rows[0].percent } : null;
}

/**
 * Gives the user a discount of PLUS.bugDiscountPercent. No stacking: "already" when the user has an open one, or when a row with
 * this supportId exists (even a used or revoked one: one request earns at most one discount).
 */
export async function grantDiscount(userId: string, o: { source: DiscountSource; supportId?: string; note?: string | null }): Promise<"granted" | "already"> {
  checkId(userId);
  const percent = PLUS.bugDiscountPercent;
  if (!percent) throw new Error("Discounts are turned off (bugDiscountPercent).");
  if (o.supportId !== undefined && !SUPPORT_ID.test(o.supportId)) throw new Error("Bad support id.");
  if (await openDiscount(userId)) return "already";
  if (o.supportId) {
    const rows: { used_at: string | null; revoked_at: string | null }[] = await (
      await rest(`?support_id=eq.${encodeURIComponent(o.supportId)}&select=used_at,revoked_at&limit=1`)
    ).json();
    if (rows.length) {
      // Un-confirmed and confirmed again: an unused, revoked discount of this request is re-opened. A used one stays used.
      if (rows[0].used_at || !rows[0].revoked_at) return "already";
      try {
        const back = await closeRowsWhere(`support_id=eq.${encodeURIComponent(o.supportId)}&used_at=is.null&revoked_at=not.is.null`, { revoked_at: null });
        return back > 0 ? "granted" : "already";
      } catch (e) {
        if (e instanceof UniqueViolation) return "already"; // the user got another open discount meanwhile
        throw e;
      }
    }
  }
  try {
    await rest("", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ user_id: userId, percent, source: o.source, support_id: o.supportId ?? null, note: o.note?.trim() || null }),
    });
  } catch (e) {
    if (e instanceof UniqueViolation) return "already"; // a parallel request got in first
    throw e;
  }
  return "granted";
}

/** PATCHes the rows matching a full filter; returns how many were changed. */
async function closeRowsWhere(filter: string, patch: Record<string, unknown>): Promise<number> {
  const rows: unknown[] = await (await rest(`?${filter}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(patch) })).json();
  return rows.length;
}

/** Changes the OPEN rows matching a filter (revoke, mark used); returns how many were changed. */
const closeRows = (filter: string, patch: Record<string, unknown>) => closeRowsWhere(`${filter}&${OPEN}`, patch);

/** Takes back the discount a support request earned, but only while it is unused. Returns whether one was revoked. */
export async function revokeForSupport(supportId: string): Promise<boolean> {
  if (!SUPPORT_ID.test(supportId)) throw new Error("Bad support id.");
  return (await closeRows(`support_id=eq.${encodeURIComponent(supportId)}`, { revoked_at: new Date().toISOString() })) > 0;
}

/** Takes back the user's open discount. Returns whether there was one. */
export async function revokeOpen(userId: string): Promise<boolean> {
  checkId(userId);
  return (await closeRows(`user_id=eq.${userId}`, { revoked_at: new Date().toISOString() })) > 0;
}

/** The sale used the code: closes the user's open discount. Returns whether there was one (a repeat call is a no-op → false). */
export async function markUsed(userId: string, saleId: string): Promise<boolean> {
  checkId(userId);
  return (await closeRows(`user_id=eq.${userId}`, { used_at: new Date().toISOString(), sale_id: saleId })) > 0;
}

/** Whether this id is a real account (Supabase Auth admin lookup). Support requests of signed-out visitors carry an anonymous id. */
export async function isAccount(userId: string): Promise<boolean> {
  return (await accountLookup(userId)) === "account";
}

/** Three-state lookup: "account" (200), "none" (404, a bad id, or no Supabase so no accounts exist), "unknown" (any other answer or a network error). */
export async function accountLookup(userId: string): Promise<"account" | "none" | "unknown"> {
  if (!UUID.test(userId) || !SB_URL || !SB_KEY) return "none";
  try {
    const res = await fetch(`${SB_URL}/auth/v1/admin/users/${userId}`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: "no-store" });
    return res.ok ? "account" : res.status === 404 ? "none" : "unknown";
  } catch {
    return "unknown";
  }
}

/** Which of these users have an open discount (one query). */
export async function openDiscountUserIds(userIds: string[]): Promise<Set<string>> {
  const ids = userIds.filter((u) => UUID.test(u));
  if (!ids.length) return new Set();
  const rows: { user_id: string }[] = await (await rest(`?user_id=in.(${ids.join(",")})&${OPEN}&select=user_id`)).json();
  return new Set(rows.map((r) => r.user_id));
}

/** The discount state per support request id (one query); ids without a row are left out. */
export async function discountsBySupportIds(ids: string[]): Promise<Map<string, DiscountStatus>> {
  const list = ids.filter((i) => SUPPORT_ID.test(i));
  const out = new Map<string, DiscountStatus>();
  if (!list.length) return out;
  const rows: { support_id: string; used_at: string | null; revoked_at: string | null }[] = await (
    await rest(`?support_id=in.(${list.map((i) => `"${i}"`).join(",")})&select=support_id,used_at,revoked_at`)
  ).json();
  for (const r of rows) out.set(r.support_id, r.used_at ? "used" : r.revoked_at ? "revoked" : "open");
  return out;
}
