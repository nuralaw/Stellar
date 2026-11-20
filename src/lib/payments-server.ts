import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { extendPlus, getSubscription, removePlus, setPlus } from "./access-server";
import { bugCode, markUsed } from "./discounts-server";
import { PLUS } from "./plus-config";
import { findSatDate } from "./sat-dates";
import { sealConfigured, sealJsonServer } from "./seal-server";

// Gumroad → Stellar Plus. The webhook route (app/api/gumroad/ping) hands every request to handleGumroadRequest().
// Tables: supabase/payments.sql (purchases, payment_events); Plus itself lives in subscriptions (access-server.ts).
// See docs/PAYMENTS.md for the rules in plain words.
// The buyer's email and the raw ping are personal: they're stored sealed with the admin's public key (seal-server.ts), never in the
// clear. Without ADMIN_SEAL_PUBLIC_KEY they aren't stored at all; encryption never makes a payment fail.
//
// Env: GUMROAD_PING_SECRET (Ping signing secret), GUMROAD_WEBHOOK_KEY (?key= on the resource-subscription URLs),
// GUMROAD_ACCESS_TOKEN (API token, used to double-check unsigned events), GUMROAD_SELLER_ID (optional),
// GUMROAD_PRODUCT_MONTHLY / GUMROAD_PRODUCT_PASS (comma-separated product ids or permalinks).

type Obj = Record<string, unknown>;
type PlanId = "monthly" | "pass";

const DAY_MS = 86_400_000;
const MAX_SKEW_S = 300;
const FALLBACK_PASS_DAYS = 120;
const GRACE_DAYS = 3;
/** The /plus picker counts days in the buyer's time zone; the server allows a little more than PLUS.passMaxDays. */
const PASS_SLACK_DAYS = 2;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SETUP_MESSAGE = "Payments tables aren't set up: run supabase/payments.sql (npm run db:apply -- supabase/subscriptions.sql supabase/payments.sql, or paste it into the Supabase SQL Editor).";
const BAD_KEYS = new Set(["__proto__", "constructor", "prototype"]);

class PaymentsSetupError extends Error {}

const env = (name: string) => process.env[name]?.trim() || undefined;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/** A trimmed non-empty string (numbers are accepted), else undefined. */
function str(v: unknown): string | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t || undefined;
}
const bool = (v: unknown) => v === true || (typeof v === "string" && v.toLowerCase() === "true");
const cents = (v: unknown) => {
  const n = Number(str(v));
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
};

// --- Request checks -------------------------------------------------------------------------------------------------

/** Constant-time string equality (both sides hashed first, so lengths don't leak). */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

/** X-Gumroad-Signature: `t=<unix seconds>,v1=<hex>`, hex = HMAC-SHA256(secret, `${t}.${rawBody}`). Max skew 300 s. */
export function verifySignature(raw: string, header: string | null | undefined): boolean {
  const secret = env("GUMROAD_PING_SECRET");
  if (!secret || !header) return false;
  let t: string | undefined;
  const sigs: string[] = [];
  for (const part of header.split(",")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "t") t = v;
    else if (k === "v1") sigs.push(v);
  }
  const ts = Number(t);
  if (!t || !Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > MAX_SKEW_S) return false;
  const want = createHmac("sha256", secret).update(`${t}.${raw}`).digest();
  return sigs.some((s) => /^[0-9a-f]{64}$/i.test(s) && timingSafeEqual(want, Buffer.from(s, "hex")));
}

/** JSON, or a form body whose bracket keys nest (`url_params[uid]=x` → { url_params: { uid: "x" } }, `a[]=1` → array). */
export function parseBody(raw: string, contentType: string | null | undefined): Obj {
  const ct = (contentType ?? "").toLowerCase();
  if (ct.includes("json") || (!ct.includes("form") && raw.trimStart().startsWith("{"))) {
    try {
      const j: unknown = JSON.parse(raw);
      return isObj(j) ? j : {};
    } catch {
      return {};
    }
  }
  const out: Obj = {};
  for (const [name, value] of new URLSearchParams(raw)) {
    const m = /^([^[\]]+)((?:\[[^[\]]*\])*)$/.exec(name);
    if (!m) continue;
    const path = [m[1], ...[...m[2].matchAll(/\[([^[\]]*)\]/g)].map((x) => x[1])];
    if (path.some((k, i) => BAD_KEYS.has(k) || (k === "" && i !== path.length - 1))) continue;
    const push = path[path.length - 1] === "";
    const keys = push ? path.slice(0, -1) : path;
    let node = out;
    for (const k of keys.slice(0, -1)) {
      if (!isObj(node[k])) node[k] = {};
      node = node[k] as Obj;
    }
    const last = keys[keys.length - 1];
    if (push) {
      if (!Array.isArray(node[last])) node[last] = [];
      (node[last] as unknown[]).push(value);
    } else {
      node[last] = value;
    }
  }
  return out;
}

/** The payload for storage: no card details, and capped so a junk request can't fill the table. */
function cleanPayload(body: Obj): Obj {
  const { card: _card, ...rest } = body;
  void _card;
  if (JSON.stringify(rest).length > 20_000) return { truncated: true, resource_name: rest.resource_name ?? null, sale_id: rest.sale_id ?? null };
  return rest;
}

// --- Database (PostgREST, service role) -----------------------------------------------------------------------------

interface PurchaseRow {
  sale_id: string;
  user_id: string | null;
  plan: PlanId | null;
  subscription_id: string | null;
  test: boolean;
  refunded: boolean;
  disputed: boolean;
  sale_at: string;
  access_until: string | null;
}

async function pg(path: string, init: RequestInit = {}): Promise<Response> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase isn't configured on this server.");
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    // PGRST204 = an unknown column (e.g. `sealed` before supabase/sealed.sql ran).
    if (body.includes("PGRST205") || body.includes("PGRST202") || body.includes("PGRST204") || body.includes("42P01")) throw new PaymentsSetupError(SETUP_MESSAGE);
    console.error(`[payments] ${init.method ?? "GET"} ${path.split("?")[0]}: ${res.status} ${body.slice(0, 300)}`);
    throw new Error("Couldn't reach the payments tables.");
  }
  return res;
}

async function getPurchase(saleId: string): Promise<PurchaseRow | null> {
  const rows: PurchaseRow[] = await (await pg(`purchases?sale_id=eq.${encodeURIComponent(saleId)}&select=*`)).json();
  return rows[0] ?? null;
}

async function patchPurchase(saleId: string, patch: Obj) {
  await pg(`purchases?sale_id=eq.${encodeURIComponent(saleId)}`, { method: "PATCH", body: JSON.stringify(patch) });
}

/**
 * The payload columns of an event row: `{}` stays as is (rejected requests log no body), anything else goes sealed (payload null).
 * When it can't be sealed (no key, or an error) neither column is sent, so the row is still logged and the `sealed` column
 * is only ever named once there is something to put in it (it doesn't exist before supabase/sealed.sql).
 */
async function sealedPayload(body: Obj): Promise<Obj> {
  if (Object.keys(body).length === 0) return { payload: {} };
  if (!sealConfigured()) return {};
  try {
    return { payload: null, sealed: await sealJsonServer(cleanPayload(body)) };
  } catch (err) {
    console.error(`[payments] couldn't seal the event payload: ${err instanceof Error ? err.message : "unknown"}`);
    return {};
  }
}

/** Best effort: logging must never change the answer to Gumroad. */
async function logEvent(e: { resource: string | null; ref: string | null; verified: boolean; note: string; payload: Obj }) {
  try {
    await pg("payment_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ provider: "gumroad", resource_name: e.resource, ref_id: e.ref, verified: e.verified, note: e.note.slice(0, 500), ...(await sealedPayload(e.payload)) }),
    });
  } catch (err) {
    console.error(`[payments] couldn't log the event: ${err instanceof Error ? err.message : "unknown"}`);
  }
}

// --- Gumroad API (the truth for events that aren't signed) ----------------------------------------------------------

/** GET /v2/<path>?access_token=…, or null when Gumroad says 404. Throws (→ Gumroad retries) on anything else. 4 s timeout: Gumroad waits only 5 s for our answer. Never logs the URL. */
async function gumroadGet(path: string): Promise<Obj | null> {
  const token = env("GUMROAD_ACCESS_TOKEN");
  if (!token) throw new Error("No GUMROAD_ACCESS_TOKEN.");
  let res: Response;
  try {
    res = await fetch(`https://api.gumroad.com/v2/${path}?access_token=${encodeURIComponent(token)}`, { cache: "no-store", signal: AbortSignal.timeout(4_000) });
  } catch {
    throw new Error("Couldn't reach the Gumroad API.");
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`The Gumroad API answered ${res.status}.`);
  const j: unknown = await res.json().catch(() => null);
  return isObj(j) ? j : null;
}

// --- Rules ----------------------------------------------------------------------------------------------------------

const csv = (v: string | undefined) => (v ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

/** Which plan a sale is for, matched on product_id, short_product_id, permalink or the last segment of product_permalink. */
function planFor(p: Obj): PlanId | null {
  const link = str(p.product_permalink);
  const last = link ? link.split(/[?#]/)[0].split("/").filter(Boolean).pop() : undefined;
  const ids = [str(p.product_id), str(p.short_product_id), str(p.permalink), last].filter((x): x is string => Boolean(x)).map((x) => x.toLowerCase());
  const lists: [PlanId, string[]][] = [["monthly", csv(env("GUMROAD_PRODUCT_MONTHLY"))], ["pass", csv(env("GUMROAD_PRODUCT_PASS"))]];
  for (const [plan, list] of lists) if (ids.some((i) => list.includes(i))) return plan;
  return null;
}

function addMonthsUtc(d: Date, months: number): Date {
  const r = new Date(d.getTime());
  const day = r.getUTCDate();
  r.setUTCDate(1);
  r.setUTCMonth(r.getUTCMonth() + months);
  r.setUTCDate(Math.min(day, new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 0)).getUTCDate()));
  return r;
}

/**
 * The Plus end date a sale grants. Monthly: a month + 3 days' grace. Pass: the end of the chosen SAT day (UTC) when it's an official
 * date no more than PLUS.passMaxDays (+ PASS_SLACK_DAYS) after the sale (the link's sat param is buyer-editable), else 120 days.
 */
function accessUntil(plan: PlanId, saleAt: Date, urlParams: Obj): { until: Date; note?: string } {
  if (plan === "monthly") return { until: new Date(addMonthsUtc(saleAt, 1).getTime() + GRACE_DAYS * DAY_MS) };
  const sat = str(urlParams.sat);
  if (sat && /^\d{4}-\d{2}-\d{2}$/.test(sat) && findSatDate(sat)) {
    const end = Date.parse(`${sat}T00:00:00Z`) + DAY_MS;
    if (end > saleAt.getTime() && end <= saleAt.getTime() + (PLUS.passMaxDays + PASS_SLACK_DAYS) * DAY_MS) return { until: new Date(end) };
  }
  return { until: new Date(saleAt.getTime() + FALLBACK_PASS_DAYS * DAY_MS), note: `pass without a usable SAT date (sat=${(sat ?? "none").slice(0, 20)}, official, in the future and within ${PLUS.passMaxDays} days needed): gave ${FALLBACK_PASS_DAYS} days` };
}

/** The account a sale belongs to: url_params.uid if that user exists, else the account with the buyer's email, else null. */
async function findUserId(uid: string | undefined, email: string | undefined): Promise<string | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase isn't configured on this server.");
  if (uid && UUID.test(uid)) {
    const res = await fetch(`${url}/auth/v1/admin/users/${uid}`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" });
    if (res.ok) {
      const u: unknown = await res.json().catch(() => null);
      if (isObj(u) && typeof u.id === "string" && u.id.toLowerCase() === uid.toLowerCase()) return u.id;
    } else if (res.status !== 404 && res.status !== 400) {
      throw new Error(`The Supabase user lookup answered ${res.status}.`);
    }
  }
  if (email) {
    const id: unknown = await (await pg("rpc/admin_user_id_by_email", { method: "POST", body: JSON.stringify({ p_email: email }) })).json();
    if (typeof id === "string" && UUID.test(id)) return id;
  }
  return null;
}

/** Re-derives the user's Plus from their remaining valid purchases (the latest access_until). Only touches Gumroad-granted rows. */
async function recomputeAccess(userId: string): Promise<string> {
  const rows: { access_until: string | null }[] = await (
    await pg(`purchases?user_id=eq.${userId}&refunded=eq.false&disputed=eq.false&access_until=not.is.null&select=access_until&order=access_until.desc&limit=1`)
  ).json();
  const target = rows[0]?.access_until ? new Date(rows[0].access_until) : null;
  const sub = await getSubscription(userId);
  if (sub && sub.source !== "gumroad") return "Plus kept (not granted by Gumroad)";
  if (!target || target.getTime() <= Date.now()) {
    if (!sub) return "no Plus to change";
    await removePlus(userId);
    return "Plus removed";
  }
  if (!sub || sub.expiresAt === null || Date.parse(sub.expiresAt) !== target.getTime()) {
    await setPlus(userId, target, "Gumroad (recomputed)", "gumroad");
    return `Plus set to ${target.toISOString().slice(0, 10)}`;
  }
  return "Plus unchanged";
}

// --- Events ---------------------------------------------------------------------------------------------------------

interface Outcome {
  note: string;
  /** True when the signature or a Gumroad API check confirmed the event. */
  verified: boolean;
}

/** Gumroad's API sale, renamed to the field names a ping uses so one code path stores both. Reads defensively (missing = default). */
function pingFromApiSale(sale: Obj, saleId: string): Obj {
  const pick = (...names: string[]) => names.map((n) => sale[n]).find((v) => v !== undefined && v !== null);
  return {
    sale_id: saleId,
    product_id: pick("product_id"),
    product_name: pick("product_name"),
    permalink: pick("permalink"),
    short_product_id: pick("short_product_id"),
    product_permalink: pick("product_permalink"),
    email: pick("email"),
    price: pick("price"),
    gumroad_fee: pick("gumroad_fee"),
    currency: pick("currency"),
    url_params: sale.url_params, // the API includes them (include_url_params): from Gumroad, not from the request
    sale_timestamp: pick("created_at", "timestamp", "sale_timestamp"),
    test: pick("test"),
    subscription_id: pick("subscription_id"),
    is_recurring_charge: pick("recurring_charge", "is_recurring_charge"),
    offer_code: pick("offer_code"),
    refunded: bool(sale.refunded),
    disputed: bool(sale.disputed) || bool(sale.chargedback),
    dispute_won: bool(sale.dispute_won),
  };
}

/** The sale as Gumroad's API reports it, or null when Gumroad doesn't know it. */
async function confirmedSale(saleId: string): Promise<Obj | null> {
  const api = await gumroadGet(`sales/${encodeURIComponent(saleId)}`);
  const sale = api && isObj(api.sale) ? api.sale : null;
  return api && api.success === true && sale && str(sale.id) === saleId ? sale : null;
}

function purchaseRow(d: Obj, o: { saleId: string; userId: string | null; plan: PlanId | null; saleAt: Date; test: boolean; refunded: boolean; disputed: boolean; until: Date | null }) {
  return {
    sale_id: o.saleId,
    provider: "gumroad",
    user_id: o.userId,
    email: str(d.email) ?? null,
    plan: o.plan,
    product_id: str(d.product_id) ?? null,
    product_name: str(d.product_name) ?? null,
    price_cents: cents(d.price),
    fee_cents: cents(d.gumroad_fee),
    currency: (str(d.currency) ?? "usd").toLowerCase(),
    subscription_id: str(d.subscription_id) ?? null,
    is_recurring: bool(d.is_recurring_charge),
    test: o.test,
    refunded: o.refunded,
    disputed: o.disputed,
    sale_at: o.saleAt.toISOString(),
    access_until: o.until ? o.until.toISOString() : null,
    raw: cleanPayload(d),
  };
}

/**
 * Writes the sale. email + raw never go to the table in the clear: they're sealed into `sealed` (email/raw columns set to null).
 * When they can't be sealed (no seal key, or an error) email, raw and sealed are left out of the write altogether: a new row gets
 * null there, and an existing row keeps whatever it has (a sealed value, or an old plaintext email not migrated yet), so a repeat
 * or refund ping never wipes it. Returns a note for the event log in that case; the sale itself is still stored.
 */
async function upsertPurchase(row: Obj): Promise<string | null> {
  const { email, raw, ...rest } = row;
  let sealed: string | null = null;
  let note: string | null = null;
  if (!sealConfigured()) note = "email and raw ping not stored: ADMIN_SEAL_PUBLIC_KEY isn't set";
  else {
    try {
      sealed = await sealJsonServer({ email, raw });
    } catch (err) {
      console.error(`[payments] couldn't seal the purchase: ${err instanceof Error ? err.message : "unknown"}`);
      note = "email and raw ping not stored: sealing failed";
    }
  }
  await pg("purchases?on_conflict=sale_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(sealed ? { ...rest, email: null, raw: null, sealed } : rest),
  });
  return note;
}

/** The offer code a sale used: the ping sends a string, Gumroad's API sale an object with a name. */
function offerCodeOf(d: Obj): string | undefined {
  const v = d.offer_code;
  return str(isObj(v) ? v.name : v);
}

/**
 * First Monthly payment with the shared bug-report code (GUMROAD_BUG_CODE): closes that student's open discount. Returns a note, or
 * null when the sale didn't use the code. Never throws (a failure is only a note), so it can't fail the webhook or the Plus grant.
 * A repeated ping finds no open discount any more, so it changes nothing (and `repeat` keeps it from adding the "without" note).
 */
async function noteBugCode(d: Obj, plan: PlanId | null, userId: string | null, saleId: string, repeat: boolean): Promise<string | null> {
  try {
    const code = bugCode();
    const used = offerCodeOf(d);
    if (plan !== "monthly" || bool(d.is_recurring_charge) || !code || !used || used.toLowerCase() !== code.toLowerCase()) return null;
    if (userId && (await markUsed(userId, saleId))) return "bug discount used";
    return repeat ? null : "bug code used without an open discount"; // a retry of a sale we already stored finds its discount closed
  } catch (e) {
    console.error("[payments] bug discount:", e);
    return "bug code used, but closing the discount failed";
  }
}

/**
 * A sale. Signed pings (the seller's own Ping URL) are trusted. Without a signature the body is forgeable, so an unsigned sale is
 * ignored when a Ping secret is set; with no secret but an API token, every field is taken from Gumroad's API instead of the body.
 */
async function handleSale(body: Obj, signed: boolean): Promise<Outcome> {
  const saleId = str(body.sale_id);
  if (!saleId) return { note: "ignored: no sale_id", verified: signed };

  let d = body;
  const notes: string[] = [];
  if (!signed) {
    if (env("GUMROAD_PING_SECRET")) return { note: "ignored: unsigned sale (sales must arrive signed on the Ping URL), no access granted", verified: false };
    if (!env("GUMROAD_ACCESS_TOKEN")) return { note: "ignored: unsigned sale and no GUMROAD_ACCESS_TOKEN to check it, no access granted", verified: false };
    const sale = await confirmedSale(saleId);
    if (!sale) return { note: "ignored: Gumroad doesn't confirm this sale", verified: false };
    d = pingFromApiSale(sale, saleId); // nothing from the request body: url_params and everything else come from Gumroad
    notes.push("unsigned: data from the Gumroad API");
  }

  // Independent lookups run together (Gumroad waits only 5 s per attempt). A missing table surfaces from getPurchase first.
  const urlParams = isObj(d.url_params) ? d.url_params : {}; // from the signed ping or from Gumroad's API, never from an unsigned request
  const [existingR, foundR] = await Promise.allSettled([getPurchase(saleId), findUserId(str(urlParams.uid), str(d.email))]);
  if (existingR.status === "rejected") throw existingR.reason;
  const existing = existingR.value;
  // "Send test ping" in Gumroad resends the latest real sale (same sale_id) flagged as a test: leave everything as it is.
  if (existing && !existing.test && bool(d.test)) return { note: "test ping for a real sale: nothing changed", verified: true };
  if (!existing?.user_id && foundR.status === "rejected") throw foundR.reason;
  const userId = existing?.user_id ?? (foundR.status === "fulfilled" ? foundR.value : null);
  const plan = planFor(d);
  const parsedAt = Date.parse(str(d.sale_timestamp) ?? "");
  const saleAt = Number.isFinite(parsedAt) ? new Date(parsedAt) : existing ? new Date(existing.sale_at) : new Date();
  const refunded = Boolean(existing?.refunded) || bool(d.refunded);
  const disputed = Boolean(existing?.disputed) || (bool(d.disputed) && !bool(d.dispute_won));
  // The API sale has no test flag, so test purchases can only be told apart on signed pings. A stored row keeps its flag.
  const test = existing ? existing.test : signed && bool(d.test);

  let until: Date | null = existing?.access_until ? new Date(existing.access_until) : null;
  if (!until && plan) {
    const a = accessUntil(plan, saleAt, urlParams);
    until = a.until;
    if (a.note) notes.push(a.note);
  }

  const row = purchaseRow(d, { saleId, userId, plan, saleAt, test, refunded, disputed, until });
  if (plan && userId && !refunded && !disputed && until && until.getTime() > Date.now()) {
    // Purchase row FIRST, then Plus: if the purchase write fails, no Plus is granted (Gumroad retries), so a later
    // refund always finds the row and can take Plus back. Never write the two in parallel.
    const sealNote = await upsertPurchase(row);
    if (sealNote) notes.push(sealNote);
    const { subscription, changed } = await extendPlus(userId, until, `Gumroad ${plan}`, "gumroad");
    notes.push(changed ? `${plan} sale: Plus until ${until.toISOString().slice(0, 10)}` : `${plan} sale: Plus unchanged (already ${subscription.expiresAt ? `until ${subscription.expiresAt.slice(0, 10)}` : "no end date"})`);
  } else {
    const sealNote = await upsertPurchase(row);
    if (sealNote) notes.push(sealNote);
    if (!plan) notes.push("stored: product isn't mapped to a plan (check GUMROAD_PRODUCT_MONTHLY / _PASS), access unchanged");
    else if (!userId) notes.push("stored: no account matched the uid or email, no access granted");
    else if (refunded || disputed) notes.push(`stored as ${refunded ? "refunded" : "disputed"}: ${await recomputeAccess(userId)}`);
    else notes.push("stored: the access end is already past, no access granted");
  }
  const used = await noteBugCode(d, plan, userId, saleId, Boolean(existing));
  if (used) notes.push(used);
  if (test) notes.push("test purchase");
  return { note: notes.join("; "), verified: true }; // signed, or confirmed by the Gumroad API above
}

/** refund / dispute / dispute_won: re-read the sale from Gumroad, store its flags, then recompute Plus. */
async function handleSaleFlags(body: Obj, resource: string): Promise<Outcome> {
  const saleId = str(body.sale_id);
  if (!saleId) return { note: `ignored ${resource}: no sale_id`, verified: false };
  if (!env("GUMROAD_ACCESS_TOKEN")) return { note: `ignored ${resource}: no GUMROAD_ACCESS_TOKEN to check it, nothing changed`, verified: false };
  const sale = await confirmedSale(saleId);
  if (!sale) return { note: `ignored ${resource}: Gumroad doesn't confirm this sale`, verified: false };

  const refundKnown = typeof sale.refunded === "boolean";
  const disputeKnown = typeof sale.disputed === "boolean" || typeof sale.chargedback === "boolean";
  const refunded = bool(sale.refunded);
  const disputed = (bool(sale.disputed) || bool(sale.chargedback)) && !bool(sale.dispute_won);

  const existing = await getPurchase(saleId);
  if (!existing) {
    // The refund beat the sale ping: keep what Gumroad says, so the sale ping that follows can't grant Plus (handleSale keeps the flags).
    const d = pingFromApiSale(sale, saleId);
    const parsedAt = Date.parse(str(d.sale_timestamp) ?? "");
    const params = isObj(d.url_params) ? d.url_params : {};
    const userId = await findUserId(str(params.uid), str(d.email));
    const sealNote = await upsertPurchase(purchaseRow(d, { saleId, userId, plan: planFor(d), saleAt: Number.isFinite(parsedAt) ? new Date(parsedAt) : new Date(), test: false, refunded, disputed, until: null }));
    // Recheck Plus anyway: covers Plus that exists without this purchase row (e.g. an older partial write).
    const access = userId ? await recomputeAccess(userId) : "no account matched";
    return { note: `${resource}: sale not stored yet, kept a stub from Gumroad's data (refunded=${refunded} disputed=${disputed}); ${access}${sealNote ? `; ${sealNote}` : ""}`, verified: true };
  }
  const patch: Obj = {};
  if (refundKnown) patch.refunded = refunded;
  if (disputeKnown) patch.disputed = disputed;
  if (Object.keys(patch).length === 0) return { note: `${resource}: Gumroad's answer had no refund/dispute fields, nothing changed`, verified: true };
  await patchPurchase(saleId, patch);
  const access = existing.user_id ? await recomputeAccess(existing.user_id) : "sale has no account";
  return { note: `${resource}: refunded=${String(patch.refunded ?? existing.refunded)} disputed=${String(patch.disputed ?? existing.disputed)}; ${access}`, verified: true };
}

/** subscription_ended: cut every purchase of that membership at the end date Gumroad reports, then recompute Plus. */
async function handleSubscriptionEnded(body: Obj): Promise<Outcome> {
  const subId = str(body.subscription_id);
  if (!subId) return { note: "ignored subscription_ended: no subscription_id", verified: false };
  if (!env("GUMROAD_ACCESS_TOKEN")) return { note: "ignored subscription_ended: no GUMROAD_ACCESS_TOKEN to check it, nothing changed", verified: false };
  const api = await gumroadGet(`subscribers/${encodeURIComponent(subId)}`);
  const sub = api && isObj(api.subscriber) ? api.subscriber : null;
  if (!api || api.success !== true || !sub) return { note: "ignored subscription_ended: Gumroad doesn't confirm this subscription", verified: false };
  // ended_at is only set for fixed-length memberships; a cancelled or failed one carries cancelled_at / failed_at. Other statuses
  // (e.g. pending_cancellation, whose cancelled_at is in the future) aren't over yet.
  const status = str(sub.status);
  if (!status || !["cancelled", "failed_payment", "fixed_subscription_period_ended"].includes(status)) {
    return { note: `subscription_ended: Gumroad's status is ${status ?? "unknown"}, not an ended membership, nothing changed`, verified: true };
  }
  const endedRaw = str(sub.ended_at) ?? str(sub.failed_at) ?? str(sub.cancelled_at);
  const ended = endedRaw ? Date.parse(endedRaw) : NaN;
  if (!Number.isFinite(ended)) return { note: `subscription_ended (${status}): Gumroad shows no end date, nothing changed`, verified: true };

  const rows: PurchaseRow[] = await (await pg(`purchases?subscription_id=eq.${encodeURIComponent(subId)}&select=*`)).json();
  const users = new Set<string>();
  let cut = 0;
  for (const r of rows) {
    if (r.access_until && Date.parse(r.sale_at) <= ended && Date.parse(r.access_until) > ended) {
      await patchPurchase(r.sale_id, { access_until: new Date(ended).toISOString() });
      cut++;
    }
    if (r.user_id) users.add(r.user_id);
  }
  const results: string[] = [];
  for (const u of users) results.push(await recomputeAccess(u));
  return { note: `subscription_ended at ${new Date(ended).toISOString().slice(0, 10)}: ${cut} purchase(s) cut; ${results.join(", ") || "no account"}`, verified: true };
}

// --- Entry point ----------------------------------------------------------------------------------------------------

const JSON_HEADERS = { "Cache-Control": "no-store" };

/** Answers a POST from Gumroad. 200 = handled or deliberately ignored, 401 = not from Gumroad, 503 = bad signature (Gumroad retries 3 times, after 1, 3 and 10 minutes), 500 = try again later. */
export async function handleGumroadRequest(request: Request): Promise<Response> {
  const raw = await request.text();
  const body = parseBody(raw, request.headers.get("content-type"));
  const sigHeader = request.headers.get("x-gumroad-signature");
  const key = new URL(request.url).searchParams.get("key");
  const webhookKey = env("GUMROAD_WEBHOOK_KEY");

  const signed = verifySignature(raw, sigHeader);
  const keyed = Boolean(webhookKey && key && safeEqual(key, webhookKey));
  const resource = str(body.resource_name) ?? (str(body.sale_id) ? "sale" : null);
  const ref = str(body.sale_id) ?? str(body.subscription_id) ?? null;
  const ERRORS = { 401: "Unauthorized.", 503: "Couldn't verify this request. Try again later.", 500: "Couldn't process this event." };
  const done = async (status: 200 | 401 | 500 | 503, note: string, verified: boolean) => {
    await logEvent({ resource, ref, verified, note, payload: body });
    return Response.json(status === 200 ? { ok: true } : { error: ERRORS[status] }, { status, headers: JSON_HEADERS });
  };
  // Rejected requests are unauthenticated, so they log no body (nobody can flood the table with payloads): only the note, event and a short ref.
  const reject = async (status: 401 | 503, note: string) => {
    await logEvent({ resource: resource?.slice(0, 40) ?? null, ref: ref?.slice(0, 40) ?? null, verified: false, note, payload: {} });
    return Response.json({ error: ERRORS[status] }, { status, headers: JSON_HEADERS });
  };

  if (!signed && !keyed) {
    // A signature was sent but doesn't check out (or there's no secret to check it with): 503 so Gumroad retries (3 times, after
    // 1, 3 and 10 minutes), which recovers the sale if the secret is fixed within about 15 minutes. 401 is never retried, so it's
    // only for requests that claim nothing. The "sig:" note prefix is what admin's rejected_7d counts.
    if (sigHeader) {
      const why = !env("GUMROAD_PING_SECRET") ? "signature sent but GUMROAD_PING_SECRET isn't set" : "bad or expired signature";
      console.error(`[payments] rejected a Gumroad request: ${why}`);
      return reject(503, `sig: ${why}`);
    }
    return reject(401, "rejected: no signature and no valid key");
  }
  const sellerId = env("GUMROAD_SELLER_ID");
  const bodySeller = str(body.seller_id);
  if (sellerId && bodySeller && bodySeller !== sellerId) return reject(401, "rejected: seller_id isn't ours");

  const auth = signed ? "signature" : "key";
  try {
    let out: Outcome;
    if (resource === "sale") out = await handleSale(body, signed);
    else if (resource === "refund" || resource === "dispute" || resource === "dispute_won") out = await handleSaleFlags(body, resource);
    else if (resource === "subscription_ended") out = await handleSubscriptionEnded(body);
    else if (resource === "cancellation" || resource === "subscription_restarted" || resource === "subscription_updated") {
      out = { note: `${resource}: logged only (access runs to the paid end; renewals arrive as sales)`, verified: true };
    } else out = { note: `ignored: unhandled event ${resource ?? "(none)"}`, verified: true };
    return done(200, `[${auth}] ${out.note}`, out.verified);
  } catch (e) {
    // verified = the request was authenticated (signature or key); only unconfirmed or rejected calls count as "rejected" in admin.
    if (e instanceof PaymentsSetupError) {
      console.error(`[payments] ${SETUP_MESSAGE}`);
      return done(500, `[${auth}] ${SETUP_MESSAGE}`, true);
    }
    const msg = e instanceof Error ? e.message : "unknown error";
    console.error(`[payments] ${resource ?? "event"} ${ref ?? ""} failed: ${msg}`);
    return done(500, `[${auth}] error: ${msg}`, true);
  }
}
