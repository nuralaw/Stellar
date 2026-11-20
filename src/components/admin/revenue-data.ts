"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-keys";
import { PLUS } from "@/lib/plus-config";
import { openSealed } from "./inbox-data";
import { addDays, type Bucket, isoDay, periodQuery, startOfDay } from "./charts";

// Data side of the admin Revenue views: the types of /api/admin/revenue (SQL in supabase/payments.sql),
// the Day / Week / Month ranges, one fetch helper and a dev-only mock (?mock=1). Amounts are integer cents.

export type Money = { gross_cents: number; net_cents: number; sales: number };
export type Totals = Money & { refunds: number };
export type RevenuePoint = Totals & { t: string };
export type PlanKey = "monthly" | "pass" | "other";
export type PlanTotals = Record<PlanKey, { gross_cents: number; sales: number }>;
export type RevenueStats = { series: RevenuePoint[]; totals: Totals; previous: Totals; by_plan: PlanTotals };
export type RevenueKpis = {
  today: Money;
  yesterday: Money;
  week: Money;
  last_week: Money;
  month: Money;
  last_month: Money;
  all_time: Money;
  active_plus: number;
  active_monthly: number;
  active_pass: number;
  unlinked_sales: number;
  /** Webhook calls Gumroad made in the last 7 days that were rejected (bad signature or key). */
  rejected_7d: number;
  last_sale_at: string | null;
  currency: string;
};
export type Purchase = {
  sale_id: string;
  sale_at: string;
  email: string | null;
  /** Buyer email + ping, sealed for the admin (see openEmails). New rows only; old rows have `email`. */
  sealed?: string | null;
  /** Browser-only: the email is encrypted and this browser can't open it. */
  emailLocked?: boolean;
  user_id: string | null;
  plan: "monthly" | "pass" | null;
  product_name: string | null;
  price_cents: number;
  fee_cents: number;
  currency: string;
  is_recurring: boolean;
  test: boolean;
  refunded: boolean;
  disputed: boolean;
};
/** Which Gumroad env vars are present on the server (booleans only). */
export type Configured = { pingSecret: boolean; accessToken: boolean; webhookKey: boolean; monthlyUrl: boolean; passUrl: boolean };
export type RevenueData = { stats: RevenueStats; kpis: RevenueKpis; recent: Purchase[]; configured: Configured };

export type RevenueResult =
  | { kind: "ok"; data: RevenueData }
  | { kind: "setup"; error: string; configured?: Configured }
  | { kind: "error"; error: string; configured?: Configured }
  | { kind: "denied" };

// ── Ranges: each button picks its own span, all ending now in the browser's time zone ──
export type RangeId = "day" | "week" | "month";
export const RANGES: { id: RangeId; label: string; bucket: Bucket; span: string; prev: string }[] = [
  { id: "day", label: "Day", bucket: "day", span: "last 30 days", prev: "previous 30 days" },
  { id: "week", label: "Week", bucket: "week", span: "last 12 weeks", prev: "previous 12 weeks" },
  { id: "month", label: "Month", bucket: "month", span: "last 12 months", prev: "previous 12 months" },
];

export function rangeOf(id: RangeId): { from: Date; to: Date; bucket: Bucket } {
  const now = new Date();
  const today = startOfDay(now);
  if (id === "day") return { from: addDays(today, -29), to: now, bucket: "day" };
  if (id === "week") {
    const sinceMonday = (today.getDay() + 6) % 7; // weeks start on Monday (ISO)
    return { from: addDays(today, -sinceMonday - 11 * 7), to: now, bucket: "week" };
  }
  return { from: new Date(now.getFullYear(), now.getMonth() - 11, 1), to: now, bucket: "month" };
}

/** Same checks the Overview and Revenue tabs both need. */
export const allConfigured = (c?: Configured) => Boolean(c && c.pingSecret && c.accessToken && c.webhookKey && c.monthlyUrl && (PLUS.plans.pass.comingSoon || c.passUrl));

export function ago(iso: string) {
  const min = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d} d ago` : new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Fills `email` of sealed purchases by decrypting in this browser; rows it can't open get emailLocked. */
async function openEmails(rows: Purchase[]): Promise<Purchase[]> {
  return Promise.all(
    rows.map(async (p) => {
      if (!p.sealed) return p;
      const o = await openSealed(p.sealed);
      if (!o.ok) return { ...p, emailLocked: true };
      const email = o.data && typeof o.data === "object" ? (o.data as { email?: unknown }).email : undefined;
      return { ...p, email: typeof email === "string" && email ? email : null };
    }),
  );
}

export async function fetchRevenue(from: Date, to: Date, bucket: Bucket): Promise<RevenueResult> {
  if (process.env.NODE_ENV !== "production") {
    const mock = new URLSearchParams(window.location.search).get("mock");
    if (mock === "1") return mockRevenue(from, to, bucket);
    if (mock === "setup") {
      return {
        kind: "setup",
        error: "Payments aren't set up yet: run supabase/payments.sql (npm run db:apply -- supabase/subscriptions.sql supabase/payments.sql) or paste it in the Supabase SQL Editor.",
        configured: { pingSecret: false, accessToken: false, webhookKey: false, monthlyUrl: true, passUrl: false },
      };
    }
  }
  try {
    const q = periodQuery(from.getTime(), bucket, "");
    q.set("to", to.toISOString());
    const res = await adminFetch(`/api/admin/revenue?${q}`, { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.status === 401 || res.status === 403) return { kind: "denied" };
    if (res.ok && json?.stats && json?.kpis) return { kind: "ok", data: { ...json, recent: await openEmails(json.recent ?? []) } };
    if (json?.setup) return { kind: "setup", error: json.error, configured: json.configured };
    return { kind: "error", error: json?.error ?? `HTTP ${res.status}`, configured: json?.configured };
  } catch {
    return { kind: "error", error: "Couldn't load. Check your connection." };
  }
}

/** Overview + header pill: the KPIs only (a short 7-day range, day bucket). `skip` = the caller already has them. */
export function useRevenueKpis(skip = false) {
  const [result, setResult] = useState<RevenueResult | null>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (skip) return;
    let live = true;
    const to = new Date();
    fetchRevenue(addDays(startOfDay(to), -6), to, "day").then((r) => live && setResult(r));
    return () => {
      live = false;
    };
  }, [skip, n]);
  return { result, reload: () => setN((x) => x + 1) };
}

// ── Dev-only sample data (?mock=1 while NODE_ENV !== "production") ──
function mockRevenue(from: Date, to: Date, bucket: Bucket): RevenueResult {
  let seed = 7;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const series: RevenuePoint[] = [];
  for (let d = new Date(from); d <= to; d = bucket === "day" ? addDays(d, 1) : bucket === "week" ? addDays(d, 7) : new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const mult = bucket === "day" ? 1 : bucket === "week" ? 7 : 30;
    const sales = Math.round(rand() * 3 * mult * (series.length / 20 + 0.4));
    const gross = sales * (rand() < 0.7 ? 1500 : 4900);
    series.push({ t: isoDay(d), gross_cents: gross, net_cents: Math.round(gross * 0.9 - sales * 30), sales, refunds: rand() < 0.15 ? 1 : 0 });
  }
  const sum = (list: RevenuePoint[]): Totals => ({
    gross_cents: list.reduce((a, p) => a + p.gross_cents, 0),
    net_cents: list.reduce((a, p) => a + p.net_cents, 0),
    sales: list.reduce((a, p) => a + p.sales, 0),
    refunds: list.reduce((a, p) => a + p.refunds, 0),
  });
  const totals = sum(series);
  const m = (g: number, s: number): Money => ({ gross_cents: g, net_cents: Math.round(g * 0.88), sales: s });
  const now = Date.now();
  const recent: Purchase[] = Array.from({ length: 24 }, (_, i) => ({
    sale_id: `mock-${i}`,
    sale_at: new Date(now - i * 3_700_000 * (1 + (i % 5))).toISOString(),
    email: i % 7 === 3 ? null : `student${i + 10}@example.com`,
    user_id: i % 5 === 2 ? null : `u-${i}`,
    plan: i % 3 === 0 ? "pass" : i % 8 === 7 ? null : "monthly",
    product_name: "Stellar Plus",
    price_cents: i % 3 === 0 ? 4900 : 1500,
    fee_cents: 170,
    currency: "usd",
    is_recurring: i % 4 === 1,
    test: i === 5,
    refunded: i === 9,
    disputed: i === 14,
  }));
  return {
    kind: "ok",
    data: {
      stats: {
        series,
        totals,
        previous: { ...totals, gross_cents: Math.round(totals.gross_cents * 0.8), net_cents: Math.round(totals.net_cents * 0.8), sales: Math.round(totals.sales * 0.85) },
        by_plan: { monthly: { gross_cents: Math.round(totals.gross_cents * 0.55), sales: Math.round(totals.sales * 0.7) }, pass: { gross_cents: Math.round(totals.gross_cents * 0.4), sales: Math.round(totals.sales * 0.25) }, other: { gross_cents: Math.round(totals.gross_cents * 0.05), sales: Math.round(totals.sales * 0.05) } },
      },
      kpis: {
        today: m(3000, 2),
        yesterday: m(4500, 3),
        week: m(23400, 14),
        last_week: m(18800, 11),
        month: m(81200, 49),
        last_month: m(90400, 55),
        all_time: m(312000, 190),
        active_plus: 63,
        active_monthly: 41,
        active_pass: 22,
        unlinked_sales: 2,
        rejected_7d: 0,
        last_sale_at: new Date(now - 7_200_000).toISOString(),
        currency: "usd",
      },
      recent,
      configured: { pingSecret: true, accessToken: true, webhookKey: true, monthlyUrl: true, passUrl: true },
    },
  };
}
