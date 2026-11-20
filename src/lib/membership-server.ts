import "server-only";
import { gumroadGet } from "./payments-server";

// The billing state of a student's Monthly membership. Gumroad's API can only READ a membership (it can't cancel one), so this
// finds the latest Monthly sale of the account in `purchases` and asks Gumroad about its subscription. Cancelling happens on
// Gumroad's own pages (manageUrl for the buyer, sellerUrl for the seller). See docs/PAYMENTS.md "Cancelling a membership".

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type MembershipStatus = "active" | "cancelling" | "ended" | "unknown";

export interface Membership {
  subscriptionId: string;
  /** Latest sale of that membership. */
  saleId: string;
  /** Its sale_at (ISO). */
  lastChargeAt: string;
  status: MembershipStatus;
  /** cancelling: when the paid period ends; ended: when it ended; else null. */
  endsAt: string | null;
  /** Buyer page. */
  manageUrl: string;
  /** Seller dashboard page of the latest sale. */
  sellerUrl: string;
}

interface Row {
  sale_id: string;
  subscription_id: string;
  sale_at: string;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** A parseable date re-emitted as ISO, else null. */
function isoOrNull(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const t = Date.parse(v);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

async function latestMonthlySale(userId: string): Promise<Row | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase isn't configured on this server.");
  const query =
    `user_id=eq.${userId}&provider=eq.gumroad&plan=eq.monthly&subscription_id=not.is.null&refunded=eq.false&disputed=eq.false` +
    "&select=sale_id,subscription_id,sale_at&order=sale_at.desc&limit=1";
  const res = await fetch(`${url}/rest/v1/purchases?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    if (body.includes("PGRST205") || body.includes("42P01")) return null; // payments tables not set up: no memberships yet
    console.error(`[membership] GET purchases: ${res.status} ${body.slice(0, 300)}`);
    throw new Error("Couldn't reach the purchases table.");
  }
  const rows: Row[] = await res.json();
  return rows[0] ?? null;
}

/** Asks Gumroad about the subscription. Any failure or odd answer is "unknown". Never logs the token or the URL. */
async function statusOf(subscriptionId: string): Promise<{ status: MembershipStatus; endsAt: string | null }> {
  try {
    const api = await gumroadGet(`subscribers/${encodeURIComponent(subscriptionId)}`);
    const sub = api && isObj(api.subscriber) ? api.subscriber : null;
    if (!api || api.success !== true || !sub) return { status: "unknown", endsAt: null };
    switch (sub.status) {
      case "alive":
      case "pending_failure":
      case "payment_method_update_required":
        return { status: "active", endsAt: null };
      case "pending_cancellation":
        return { status: "cancelling", endsAt: isoOrNull(sub.cancelled_at) };
      case "cancelled":
      case "failed_payment":
      case "fixed_subscription_period_ended":
        return { status: "ended", endsAt: isoOrNull(sub.ended_at) ?? isoOrNull(sub.failed_at) ?? isoOrNull(sub.cancelled_at) };
      default:
        return { status: "unknown", endsAt: null };
    }
  } catch {
    return { status: "unknown", endsAt: null };
  }
}

/** The student's Monthly membership and its billing state, or null when they have none. Throws when Supabase isn't reachable. */
export async function membershipFor(userId: string): Promise<Membership | null> {
  if (!UUID.test(userId)) throw new Error("Bad user id.");
  const row = await latestMonthlySale(userId);
  if (!row) return null;
  const { status, endsAt } = await statusOf(row.subscription_id);
  return {
    subscriptionId: row.subscription_id,
    saleId: row.sale_id,
    lastChargeAt: new Date(row.sale_at).toISOString(),
    status,
    endsAt,
    manageUrl: `https://gumroad.com/subscriptions/${encodeURIComponent(row.subscription_id)}/manage`,
    sellerUrl: `https://gumroad.com/customers/sale/${encodeURIComponent(row.sale_id)}`,
  };
}
