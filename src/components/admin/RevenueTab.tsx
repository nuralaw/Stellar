"use client";

import { useEffect, useState, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { Notice } from "./OverviewTab";
import { BAR, ColumnChart, plural, SeriesTable } from "./charts";
import { formatMoney, moneyDelta } from "./money";
import {
  ago,
  allConfigured,
  type Configured,
  fetchRevenue,
  type Money,
  type PlanKey,
  type Purchase,
  RANGES,
  rangeOf,
  type RangeId,
  type RevenueData,
} from "./revenue-data";

// /admin → Revenue: Gumroad sales as money per day / week / month, KPI tiles, the plan split and the latest sales.
// Data: /api/admin/revenue (SQL in supabase/payments.sql). Sales land in `purchases` via the Gumroad Ping.
// Amounts are integer cents. Revenue excludes test, refunded and disputed sales.

type Metric = "gross" | "net";
type Setup = { error: string; configured?: Configured };

const REFRESH = "M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4";
const PLANS: { id: PlanKey; label: string; color: string }[] = [
  { id: "monthly", label: "Monthly", color: BAR },
  { id: "pass", label: "Until test day", color: "#0ea5e9" },
  { id: "other", label: "Other", color: "var(--muted)" },
];
const PLAN_LABEL: Record<string, string> = { monthly: "Monthly", pass: "Until test day" };

const SALES: [string, string] = ["sale", "sales"];
const card = "rounded-2xl border border-line bg-surface";
const when = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function RevenueTab() {
  const [range, setRange] = useState<RangeId>("day");
  const [metric, setMetric] = useState<Metric>("gross");
  const [table, setTable] = useState(false);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState<(RevenueData & { range: RangeId }) | null>(null);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Key of the last finished request; loading = the current key hasn't finished yet. */
  const [doneKey, setDoneKey] = useState<string | null>(null);

  const requestKey = `${range}|${reload}`;
  const loading = requestKey !== doneKey;

  useEffect(() => {
    let live = true;
    const r = rangeOf(range);
    fetchRevenue(r.from, r.to, r.bucket)
      .then((res) => {
        if (!live) return;
        if (res.kind === "ok") {
          setData({ ...res.data, range });
          setSetup(null);
          setError(null);
        } else if (res.kind === "setup") {
          setSetup({ error: res.error, configured: res.configured });
          setData(null);
          setError(null);
        } else {
          setError(res.kind === "denied" ? "Sign in with the admin account to see revenue." : res.error);
        }
      })
      .finally(() => live && setDoneKey(requestKey));
    return () => {
      live = false;
    };
  }, [range, requestKey]);

  const refresh = (
    <button
      type="button"
      onClick={() => setReload((n) => n + 1)}
      disabled={loading}
      title="Refresh"
      aria-label="Refresh"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-50"
    >
      <Icon d={REFRESH} className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
    </button>
  );

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Gumroad sales. Test, refunded and disputed sales aren&apos;t counted.</p>
        {refresh}
      </div>

      {error && (
        <div className="mt-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {setup && (
        <div className="mt-4">
          <SetupCard message={setup.error} configured={setup.configured} databaseReady={false} />
        </div>
      )}

      {!data && !setup && loading && <RevenueSkeleton />}

      {data && (
        <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
          {!allConfigured(data.configured) && (
            <div className="mt-4">
              <SetupCard configured={data.configured} databaseReady />
            </div>
          )}
          <KpiRow data={data} />
          {data.kpis.all_time.sales === 0 && data.recent.length === 0 && allConfigured(data.configured) ? (
            <div className={`${card} mt-4 flex flex-col items-center px-6 py-12 text-center`}>
              <Icon d={I.inbox} className="h-8 w-8 text-muted" />
              <p className="mt-3 text-sm text-muted">No sales yet. Your first Gumroad sale shows up here within a minute.</p>
            </div>
          ) : (
            <>
              <ChartCard data={data} range={range} onRange={setRange} metric={metric} onMetric={setMetric} table={table} onTable={setTable} />
              <RecentSales rows={data.recent} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── KPI tiles ──

function KpiRow({ data }: { data: RevenueData }) {
  const k = data.kpis;
  const cur = k.currency;
  return (
    <>
      {k.rejected_7d > 0 && (
        <div className="mt-4">
          <Notice kind="error">
            {k.rejected_7d.toLocaleString("en-US")} webhook {k.rejected_7d === 1 ? "call" : "calls"} from Gumroad {k.rejected_7d === 1 ? "was" : "were"} rejected in the last 7 days. Check GUMROAD_PING_SECRET and the webhook key (see docs/PAYMENTS.md).
          </Notice>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Today" now={k.today} before={k.yesterday} prevLabel="yesterday" currency={cur} />
        <KpiTile label="This week" now={k.week} before={k.last_week} prevLabel="the same days last week" currency={cur} />
        <KpiTile label="This month" now={k.month} before={k.last_month} prevLabel="the same days last month" currency={cur} />
        <KpiTile label="All time" now={k.all_time} currency={cur} footer={k.last_sale_at ? `Last sale ${ago(k.last_sale_at)}` : "No sales yet"} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className={`${card} p-4`}>
          <p className="text-sm text-muted">Active Plus members</p>
          <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{k.active_plus.toLocaleString("en-US")}</p>
          <p className="mt-1 text-[13px] text-muted">
            monthly {k.active_monthly} · pass {k.active_pass}
          </p>
        </div>
        <div className={`rounded-2xl border p-4 ${k.unlinked_sales > 0 ? "border-primary bg-accent-soft" : "border-line bg-surface"}`}>
          <p className="text-sm text-muted">Unlinked sales</p>
          <p className={`mt-1 text-3xl font-bold tracking-tight tabular-nums ${k.unlinked_sales > 0 ? "text-primary-strong" : ""}`}>{k.unlinked_sales.toLocaleString("en-US")}</p>
          <p className="mt-1 text-[13px] text-muted">Paid, but no Stellar account matched. Grant Plus by hand in Accounts.</p>
        </div>
      </div>
    </>
  );
}

function KpiTile({ label, now, before, prevLabel, currency, footer }: { label: string; now: Money; before?: Money; prevLabel?: string; currency: string; footer?: string }) {
  const delta = before && prevLabel ? moneyDelta(now.gross_cents, before.gross_cents, currency, prevLabel) : null;
  return (
    <div className={`${card} p-4`}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{formatMoney(now.gross_cents, currency)}</p>
      <p className="mt-1 text-[13px] text-muted">
        net {formatMoney(now.net_cents, currency)} · {plural(now.sales, SALES)}
      </p>
      {delta ? (
        <p className={`mt-1 text-[13px] ${delta.cls}`}>
          {delta.arrow && <span aria-hidden="true">{delta.arrow} </span>}
          {delta.text}
        </p>
      ) : (
        <p className="mt-1 text-[13px] text-muted">{footer}</p>
      )}
    </div>
  );
}

// ── Chart card ──

function Segmented<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { id: T; label: string }[] }) {
  return (
    <div className="flex rounded-xl bg-surface-2 p-1 text-sm" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`min-h-10 rounded-lg px-3.5 font-medium ${value === o.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ChartCard(props: {
  data: RevenueData & { range: RangeId };
  range: RangeId;
  onRange: (r: RangeId) => void;
  metric: Metric;
  onMetric: (m: Metric) => void;
  table: boolean;
  onTable: (t: boolean) => void;
}) {
  const { data, metric } = props;
  const { stats, kpis } = data;
  const cur = kpis.currency;
  const r = RANGES.find((x) => x.id === data.range)!;
  const bucket = r.bucket;
  const key = metric === "gross" ? "gross_cents" : "net_cents";
  const points = stats.series.map((p) => ({ t: p.t, v: p[key] }));
  const empty = points.every((p) => p.v === 0);
  const money = (v: number, where?: "axis" | "label" | "tooltip") => formatMoney(v, cur, { short: where !== undefined && where !== "tooltip" });
  const total = stats.totals[key];
  const delta = moneyDelta(total, stats.previous[key], cur, `the ${r.prev}`);
  const columns = [
    { label: "Gross", value: (p: (typeof stats.series)[number]) => p.gross_cents, format: (v: number) => formatMoney(v, cur) },
    { label: "Net", value: (p: (typeof stats.series)[number]) => p.net_cents, format: (v: number) => formatMoney(v, cur) },
    { label: "Sales", value: (p: (typeof stats.series)[number]) => p.sales },
    { label: "Refunds", value: (p: (typeof stats.series)[number]) => p.refunds },
  ];

  return (
    <section className={`${card} mt-4 p-4 sm:p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Revenue</h2>
          <p className="mt-0.5 text-sm text-muted">
            {metric === "gross" ? "Gross" : "Net"} per {bucket} · {r.span}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented label="Period" value={props.range} onChange={props.onRange} options={RANGES.map(({ id, label }) => ({ id, label }))} />
          <Segmented<Metric>
            label="Amount"
            value={metric}
            onChange={props.onMetric}
            options={[
              { id: "gross", label: "Gross" },
              { id: "net", label: "Net" },
            ]}
          />
          <button
            type="button"
            onClick={() => props.onTable(!props.table)}
            aria-pressed={props.table}
            className="inline-flex min-h-10 items-center rounded-xl border border-line px-3.5 text-sm font-semibold hover:bg-surface-2"
          >
            {props.table ? "Show chart" : "Show table"}
          </button>
        </div>
      </div>

      {props.table ? (
        <SeriesTable series={stats.series} bucket={bucket} columns={columns} />
      ) : (
        <div className="relative mt-4">
          <ColumnChart
            points={points}
            bucket={bucket}
            unit={["revenue", "revenue"]}
            format={money}
            valueLabels
            tooltipExtra={(i) => {
              const p = stats.series[i];
              return (
                <>
                  <span className="block text-[13px] text-muted">{plural(p.sales, SALES)}</span>
                  {p.refunds > 0 && <span className="block text-[13px] text-muted">{p.refunds} refunded</span>}
                </>
              );
            }}
          />
          {empty && (
            <p className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm text-muted">
              No sales in this period yet.
              <br />
              Try a longer range.
            </p>
          )}
        </div>
      )}

      <div className="mt-5 grid gap-5 border-t border-line pt-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">
            Total · {r.span} · {metric}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{formatMoney(total, cur)}</p>
          <p className={`mt-1 text-[13px] ${delta.cls}`}>
            {delta.arrow && <span aria-hidden="true">{delta.arrow} </span>}
            {delta.text}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {plural(stats.totals.sales, SALES)}
            {stats.totals.refunds > 0 && ` · ${stats.totals.refunds} refunded`}
          </p>
        </div>
        <PlanSplit data={data} />
      </div>
    </section>
  );
}

function PlanSplit({ data }: { data: RevenueData }) {
  const { by_plan: plans } = data.stats;
  const cur = data.kpis.currency;
  const sum = PLANS.reduce((a, p) => a + plans[p.id].gross_cents, 0);
  return (
    <div>
      <p className="text-sm text-muted">By plan (gross)</p>
      <div
        className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-surface-2"
        role="img"
        aria-label={PLANS.map((p) => `${p.label} ${formatMoney(plans[p.id].gross_cents, cur)}`).join(", ")}
      >
        {sum > 0 &&
          PLANS.filter((p) => plans[p.id].gross_cents > 0).map((p) => (
            <span key={p.id} className="h-full" style={{ width: `${(plans[p.id].gross_cents / sum) * 100}%`, background: p.color }} />
          ))}
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {PLANS.map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} aria-hidden="true" />
            <span>{p.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{formatMoney(plans[p.id].gross_cents, cur)}</span>
            <span className="w-16 text-right text-[13px] text-muted tabular-nums">{plural(plans[p.id].sales, SALES)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Recent sales ──

const PILL = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[13px] font-medium whitespace-nowrap";

function StatusPills({ p }: { p: Purchase }) {
  const flags = [
    p.test && { label: "Test", cls: "border border-dashed border-line text-muted" },
    p.refunded && { label: "Refunded", cls: "bg-surface-2 text-muted" },
    p.disputed && { label: "Disputed", cls: "bg-danger-soft text-danger" },
  ].filter(Boolean) as { label: string; cls: string }[];
  if (!flags.length) flags.push(p.is_recurring ? { label: "Renewal", cls: "bg-primary-soft text-primary-strong" } : { label: "Paid", cls: "bg-success-soft text-success" });
  return (
    <span className="flex flex-wrap gap-1.5">
      {flags.map((f) => (
        <span key={f.label} className={`${PILL} ${f.cls}`}>
          {f.label}
        </span>
      ))}
    </span>
  );
}

/** Account link: a check when the sale is tied to a Stellar account, an "Unlinked" pill when not. */
function Linked({ p }: { p: Purchase }) {
  return p.user_id ? (
    <span className="inline-flex text-success" title="Linked to a Stellar account">
      <Icon d={I.check} className="h-4 w-4" strokeWidth={3} />
      <span className="sr-only">Linked to an account</span>
    </span>
  ) : (
    <span className={`${PILL} bg-accent-soft text-primary-strong`} title="Paid, but no Stellar account matched">
      Unlinked
    </span>
  );
}

const planName = (p: Purchase) => (p.plan ? PLAN_LABEL[p.plan] : "–");
const counted = (p: Purchase) => !p.test && !p.refunded && !p.disputed;

function RecentSales({ rows }: { rows: Purchase[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0, 10);
  return (
    <section className={`${card} mt-4 p-4 sm:p-5`}>
      <h2 className="font-semibold">Recent sales</h2>
      <p className="mt-0.5 text-sm text-muted">Newest first · latest {rows.length}</p>
      {!rows.length ? (
        <div className="mt-4 flex flex-col items-center rounded-xl bg-surface-2 px-6 py-10 text-center">
          <Icon d={I.inbox} className="h-7 w-7 text-muted" />
          <p className="mt-3 text-sm text-muted">No sales yet.</p>
        </div>
      ) : (
        <>
          {/* sm and up: table */}
          <div className="mt-3 hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead className="text-left text-muted">
                <tr>
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="py-2 pl-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p.sale_id} className="border-t border-line align-middle">
                    <td className="py-2.5 pr-3 whitespace-nowrap text-muted">{when(p.sale_at)}</td>
                    <td className="max-w-64 px-3 py-2.5">
                      <span className="flex items-center gap-2">
                        <span className="min-w-0 truncate" title={p.email ?? ""}>
                          {p.email ?? "(no email)"}
                        </span>
                        <Linked p={p} />
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap" title={p.product_name ?? ""}>
                      {planName(p)}
                    </td>
                    <td className={`px-3 py-2.5 text-right font-semibold whitespace-nowrap tabular-nums ${counted(p) ? "" : "text-muted line-through"}`}>{formatMoney(p.price_cents, p.currency)}</td>
                    <td className="py-2.5 pl-3">
                      <StatusPills p={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* below sm: cards */}
          <ul className="mt-3 divide-y divide-line sm:hidden">
            {shown.map((p) => (
              <li key={p.sale_id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 truncate font-medium" title={p.email ?? ""}>
                    {p.email ?? "(no email)"}
                  </span>
                  <span className={`shrink-0 font-semibold tabular-nums ${counted(p) ? "" : "text-muted line-through"}`}>{formatMoney(p.price_cents, p.currency)}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-muted">
                  {when(p.sale_at)} · {planName(p)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <StatusPills p={p} />
                  <Linked p={p} />
                </div>
              </li>
            ))}
          </ul>
          {rows.length > 10 && (
            <button type="button" onClick={() => setAll((a) => !a)} className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface-2">
              {all ? "Show fewer" : `Show all ${rows.length}`}
            </button>
          )}
        </>
      )}
    </section>
  );
}

// ── Setup checklist ──

function SetupCard({ message, configured, databaseReady }: { message?: string; configured?: Configured; databaseReady: boolean }) {
  const items: { ok: boolean; label: string; env?: string }[] = [
    { ok: databaseReady, label: "Database tables", env: "supabase/payments.sql" },
    { ok: Boolean(configured?.pingSecret), label: "Ping secret", env: "GUMROAD_PING_SECRET" },
    { ok: Boolean(configured?.accessToken), label: "API token", env: "GUMROAD_ACCESS_TOKEN" },
    { ok: Boolean(configured?.webhookKey), label: "Webhook key", env: "GUMROAD_WEBHOOK_KEY" },
    { ok: Boolean(configured?.monthlyUrl), label: "Monthly checkout URL", env: "NEXT_PUBLIC_GUMROAD_MONTHLY_URL" },
    { ok: Boolean(configured?.passUrl), label: "Pass checkout URL", env: "NEXT_PUBLIC_GUMROAD_PASS_URL" },
  ];
  const left = items.filter((i) => !i.ok).length;
  const pingUrl = `${window.location.origin}/api/gumroad/ping`;
  return (
    <section className={`${card} p-4 sm:p-5`}>
      <h2 className="font-semibold">{databaseReady ? `Payments setup: ${left} step${left === 1 ? "" : "s"} left` : "Set up payments"}</h2>
      {message && <p className="mt-2 rounded-xl bg-accent-soft px-4 py-3 text-sm">{message}</p>}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.label} className="flex items-start gap-2.5 text-sm">
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${i.ok ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}
              aria-hidden="true"
            >
              <Icon d={i.ok ? I.check : I.x} className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="min-w-0">
              <span className="font-medium">{i.label}</span>
              <span className="sr-only">{i.ok ? ": done" : ": missing"}</span>
              <code className="block text-[12px] break-all text-muted">{i.env}</code>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-line pt-4">
        <p className="text-sm text-muted">Paste this Ping URL in Gumroad (Settings, Advanced):</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 rounded-lg bg-surface-2 px-3 py-2.5 text-[13px] break-all">{pingUrl}</code>
          <CopyButton text={pingUrl} />
        </div>
        <p className="mt-3 text-[13px] text-muted">
          Full steps: <code>docs/PAYMENTS.md</code>
        </p>
      </div>
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button type="button" onClick={copy} className="inline-flex min-h-10 items-center rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface-2">
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
    </button>
  );
}

// ── Loading skeleton ──

function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-surface-2 ${className}`} />;
}

function RevenueSkeleton(): ReactNode {
  return (
    <div className="mt-4" aria-busy="true" aria-label="Loading revenue">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-28 border border-line" />
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Bone className="h-24" />
        <Bone className="h-24" />
      </div>
      <Bone className="mt-4 h-96" />
    </div>
  );
}
