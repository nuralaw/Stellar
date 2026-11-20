"use client";

import { useEffect, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { adminFetch } from "@/lib/admin-keys";
import { DiscountRow, isLive, PlusRow, usePlusSubs } from "./PlusControls";
import { type Bucket, ColumnChart, defaultCustomRange, periodOf, periodQuery, PeriodFilters, plural, type Preset, PRESETS, SeriesTable, StatTile } from "./charts";

// /admin → Accounts: new accounts, sign-ins and active students over a chosen period (column chart),
// plus the latest accounts. Data: /api/admin/accounts (SQL in supabase/account_stats.sql).

type Metric = "signups" | "signins" | "active";
type Point = { t: string; signups: number; signins: number; active: number };
type Totals = Record<Metric, number>;
type Stats = { series: Point[]; totals: Totals; previous: Totals; users_total: number };
type AccountRow = { id: string; email: string | null; created_at: string; last_sign_in_at: string | null; provider: string; active_days_30: number; discountOpen?: boolean };

const METRICS: { id: Metric; label: string; unit: [string, string]; hint: string }[] = [
  { id: "signups", label: "New accounts", unit: ["new account", "new accounts"], hint: "Registrations" },
  { id: "signins", label: "Sign-ins", unit: ["sign-in", "sign-ins"], hint: "Each time someone signs in" },
  { id: "active", label: "Active students", unit: ["active student", "active students"], hint: "Signed-in students who used the site" },
];
const COLUMNS = METRICS.map((m) => ({ label: m.label, value: (p: Point) => p[m.id] }));

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
function ago(iso: string | null) {
  if (!iso) return "Never";
  const min = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d} d ago` : shortDate(iso);
}

export function AccountsTab() {
  const [preset, setPreset] = useState<Preset>("30d");
  const [custom, setCustom] = useState(defaultCustomRange);
  const [metric, setMetric] = useState<Metric>("signups");
  const [data, setData] = useState<{ stats: Stats; users: AccountRow[]; bucket: Bucket; bugCode: boolean } | null>(null);
  /** Key of the last finished request; loading = the current key hasn't finished yet. */
  const [doneKey, setDoneKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState(false);
  const [reload, setReload] = useState(0);

  const period = periodOf(preset, custom);
  const fromMs = period?.from.getTime();
  const bucket = period?.bucket;
  const customTo = preset === "custom" ? custom.to : "";
  const requestKey = `${fromMs}|${bucket}|${customTo}|${reload}`;
  const loading = fromMs !== undefined && requestKey !== doneKey;

  useEffect(() => {
    if (fromMs === undefined || !bucket) return;
    let live = true;
    const q = periodQuery(fromMs, bucket, customTo);
    adminFetch(`/api/admin/accounts?${q}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account to see account statistics.");
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (live) {
          setData({ stats: json.stats, users: json.users, bucket, bugCode: json.bugCode !== false });
          setError(null);
        }
      })
      .catch((e: Error) => live && setError(e.message === "Failed to fetch" ? "Couldn't load. Check your connection." : e.message))
      .finally(() => live && setDoneKey(requestKey));
    return () => {
      live = false;
    };
  }, [fromMs, bucket, customTo, requestKey]);

  const stats = data?.stats;
  const prevLabel = PRESETS.find((p) => p.id === preset)!.prev;
  const m = METRICS.find((x) => x.id === metric)!;
  const points = stats?.series.map((p) => ({ t: p.t, v: p[metric] })) ?? [];
  const empty = Boolean(stats) && points.every((p) => p.v === 0);

  return (
    <div className="mt-5">
      {/* Filters: one row above everything they scope. */}
      <PeriodFilters preset={preset} onPreset={setPreset} custom={custom} onCustom={setCustom} loading={loading} onRefresh={() => setReload((n) => n + 1)} />

      {preset === "custom" && !period && <p className="mt-4 text-sm text-danger">Pick a start date before the end date, at most 400 days apart.</p>}
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {!data && loading && <p className="mt-6 text-muted">Loading…</p>}

      {stats && (
        <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
          {/* Stat tiles double as the chart's metric switch. */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {METRICS.map((x) => (
              <StatTile
                key={x.id}
                label={x.label}
                hint={x.hint}
                value={stats.totals[x.id]}
                previous={stats.previous[x.id]}
                prevLabel={prevLabel}
                selected={metric === x.id}
                onSelect={() => setMetric(x.id)}
              />
            ))}
          </div>

          <section className="mt-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{m.label}</h2>
                <p className="mt-0.5 text-sm text-muted">
                  Per {data.bucket} · {plural(stats.users_total, ["account", "accounts"])} in total
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTable((t) => !t)}
                aria-pressed={table}
                className="inline-flex min-h-10 items-center rounded-xl border border-line px-3.5 text-sm font-semibold hover:bg-surface-2"
              >
                {table ? "Show chart" : "Show table"}
              </button>
            </div>

            {table ? (
              <SeriesTable series={stats.series} bucket={data.bucket} columns={COLUMNS} />
            ) : (
              <div className="relative mt-4">
                <ColumnChart points={points} bucket={data.bucket} unit={m.unit} />
                {empty && (
                  <p className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm text-muted">
                    No {m.unit[1]} in this period yet.
                    <br />
                    {metric === "signups" ? "New students appear here as soon as they sign up." : "Try a longer period."}
                  </p>
                )}
              </div>
            )}
          </section>

          <AccountList users={data.users} total={stats.users_total} bugCode={data.bugCode} />
        </div>
      )}
    </div>
  );
}

function AccountList({ users, total, bugCode }: { users: AccountRow[]; total: number; bugCode: boolean }) {
  const [all, setAll] = useState(false);
  const [plusOnly, setPlusOnly] = useState(false);
  const plus = usePlusSubs();
  const bySub = new Map((plus.subs ?? []).map((s) => [s.userId, s]));
  const activePlus = (plus.subs ?? []).filter(isLive).length;
  const expiredPlus = (plus.subs?.length ?? 0) - activePlus;

  // "Plus only" also lists Plus students who fall outside the latest-accounts window.
  const known = new Set(users.map((u) => u.id));
  const extra: AccountRow[] = (plus.subs ?? [])
    .filter((s) => !known.has(s.userId))
    .map((s) => ({ id: s.userId, email: s.email, created_at: "", last_sign_in_at: null, provider: "", active_days_30: 0 }));
  const rows = plusOnly ? [...users.filter((u) => bySub.has(u.id)), ...extra] : users;
  const shown = all ? rows : rows.slice(0, 10);

  return (
    <section className="mt-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Latest accounts</h2>
          <p className="mt-0.5 text-sm text-muted">By last sign-in · {plural(total, ["account", "accounts"])} in total</p>
          {plus.subs && (
            <p className="mt-0.5 text-sm text-muted">
              Stellar Plus: {activePlus} active{expiredPlus > 0 ? ` · ${expiredPlus} expired` : ""}
            </p>
          )}
        </div>
        {plus.subs && (
          <button
            type="button"
            onClick={() => { setPlusOnly((p) => !p); setAll(false); }}
            aria-pressed={plusOnly}
            className={`inline-flex min-h-10 items-center rounded-xl border px-3.5 text-sm font-semibold ${plusOnly ? "border-primary bg-primary-soft" : "border-line hover:bg-surface-2"}`}
          >
            Plus only
          </button>
        )}
      </div>
      {plus.error && (
        <p role="alert" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          <span>{plus.error}</span>
          <button type="button" onClick={plus.reload} className="font-semibold underline">
            Retry
          </button>
        </p>
      )}
      {!rows.length ? (
        <div className="mt-4 flex flex-col items-center rounded-xl bg-surface-2 px-6 py-10 text-center">
          <Icon d={I.inbox} className="h-7 w-7 text-muted" />
          <p className="mt-3 text-sm text-muted">{plusOnly ? "Nobody has Stellar Plus yet." : "No accounts yet. Students appear here after their first sign-in."}</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {shown.map((u) => (
            <li key={u.id} className="py-3">
              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center">
                <span className="min-w-0 truncate font-medium" title={u.email ?? ""}>
                  {u.email ?? "(no email)"}
                </span>
                <span className="w-fit rounded-full bg-surface-2 px-2.5 py-0.5 text-[13px] capitalize text-muted">{u.provider || "–"}</span>
                <span className="text-[13px] text-muted sm:w-36">{u.created_at ? `Joined ${shortDate(u.created_at)}` : ""}</span>
                <span className="text-[13px] text-muted sm:w-44 sm:text-right">
                  {u.created_at ? `${ago(u.last_sign_in_at)} · ${u.active_days_30} active ${u.active_days_30 === 1 ? "day" : "days"}` : ""}
                </span>
              </div>
              {plus.subs && <PlusRow userId={u.id} sub={bySub.get(u.id)} onChanged={plus.reload} />}
              <DiscountRow userId={u.id} open={Boolean(u.discountOpen)} bugCode={bugCode} />
            </li>
          ))}
        </ul>
      )}
      {rows.length > 10 && (
        <button type="button" onClick={() => setAll((a) => !a)} className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface-2">
          {all ? "Show fewer" : `Show all ${rows.length}`}
        </button>
      )}
    </section>
  );
}
