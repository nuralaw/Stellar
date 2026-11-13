"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { I, Icon } from "@/components/bank/icons";

// /admin → Accounts: new accounts, sign-ins and active students over a chosen period (column chart),
// plus the latest accounts. Data: /api/admin/accounts (SQL in supabase/account_stats.sql).

type Metric = "signups" | "signins" | "active";
type Bucket = "day" | "week" | "month";
type Preset = "7d" | "30d" | "90d" | "12m" | "custom";
type Point = { t: string; signups: number; signins: number; active: number };
type Totals = Record<Metric, number>;
type Stats = { series: Point[]; totals: Totals; previous: Totals; users_total: number };
type AccountRow = { id: string; email: string | null; created_at: string; last_sign_in_at: string | null; provider: string; active_days_30: number };

const METRICS: { id: Metric; label: string; unit: [string, string]; hint: string }[] = [
  { id: "signups", label: "New accounts", unit: ["new account", "new accounts"], hint: "Registrations" },
  { id: "signins", label: "Sign-ins", unit: ["sign-in", "sign-ins"], hint: "Each time someone signs in" },
  { id: "active", label: "Active students", unit: ["active student", "active students"], hint: "Signed-in students who used the site" },
];
const PRESETS: { id: Preset; label: string; prev: string }[] = [
  { id: "7d", label: "7 days", prev: "previous 7 days" },
  { id: "30d", label: "30 days", prev: "previous 30 days" },
  { id: "90d", label: "90 days", prev: "previous 90 days" },
  { id: "12m", label: "12 months", prev: "previous 12 months" },
  { id: "custom", label: "Custom", prev: "previous period" },
];
/** Series color: validated (dataviz checks) against both the light and the dark surface. */
const BAR = "#ea580c";
const DAY = 86_400_000;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

function periodOf(preset: Preset, custom: { from: string; to: string }): { from: Date; to: Date; bucket: Bucket } | null {
  const now = new Date();
  const today = startOfDay(now);
  if (preset === "7d") return { from: addDays(today, -6), to: now, bucket: "day" };
  if (preset === "30d") return { from: addDays(today, -29), to: now, bucket: "day" };
  if (preset === "90d") return { from: addDays(today, -89), to: now, bucket: "day" };
  if (preset === "12m") return { from: new Date(now.getFullYear(), now.getMonth() - 11, 1), to: now, bucket: "month" };
  if (!custom.from || !custom.to) return null;
  const from = parseDay(custom.from);
  const to = addDays(parseDay(custom.to), 1);
  if (!(from < to)) return null;
  const days = (to.getTime() - from.getTime()) / DAY;
  if (days > 400) return null;
  return { from, to, bucket: days <= 92 ? "day" : days <= 200 ? "week" : "month" };
}

function bucketLabel(t: string, bucket: Bucket, long = false) {
  const d = parseDay(t);
  if (bucket === "month") return d.toLocaleDateString("en-US", { month: long ? "long" : "short", year: long ? "numeric" : undefined });
  const s = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return bucket === "week" ? (long ? `Week of ${s}` : s) : long ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : s;
}

const fmt = (n: number) => n.toLocaleString("en-US");
const plural = (n: number, [one, many]: [string, string]) => `${fmt(n)} ${n === 1 ? one : many}`;
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

/** 4 even steps of a clean number (1, 2, 5 × 10ⁿ), so ticks stay integers. */
function niceStep(max: number) {
  const x = Math.max(1, max / 4);
  const p = 10 ** Math.floor(Math.log10(x));
  const m = x / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

/** Column with a 4px rounded top and a square baseline. */
function columnPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

export function AccountsTab() {
  const [preset, setPreset] = useState<Preset>("30d");
  const [custom, setCustom] = useState(() => {
    const today = startOfDay(new Date());
    return { from: isoDay(addDays(today, -13)), to: isoDay(today) };
  });
  const [metric, setMetric] = useState<Metric>("signups");
  const [data, setData] = useState<{ stats: Stats; users: AccountRow[]; bucket: Bucket } | null>(null);
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
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const to = customTo ? addDays(parseDay(customTo), 1) : new Date();
    const q = new URLSearchParams({ from: new Date(fromMs).toISOString(), to: to.toISOString(), bucket, tz });
    fetch(`/api/admin/accounts?${q}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account to see account statistics.");
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (live) {
          setData({ stats: json.stats, users: json.users, bucket });
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
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex max-w-full overflow-x-auto rounded-xl bg-surface-2 p-1 text-sm" role="group" aria-label="Period">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              aria-pressed={preset === p.id}
              className={`min-h-10 shrink-0 rounded-lg px-3.5 font-medium ${preset === p.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {preset === "custom" && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label className="flex items-center gap-2">
              <span className="text-muted">From</span>
              <input
                type="date"
                value={custom.from}
                max={custom.to}
                onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))}
                className="min-h-10 rounded-xl border border-line bg-bg px-3"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted">to</span>
              <input
                type="date"
                value={custom.to}
                min={custom.from}
                max={isoDay(new Date())}
                onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))}
                className="min-h-10 rounded-xl border border-line bg-bg px-3"
              />
            </label>
          </div>
        )}
        <button
          type="button"
          onClick={() => setReload((n) => n + 1)}
          disabled={loading}
          title="Refresh"
          aria-label="Refresh"
          className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-line text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-50"
        >
          <Icon d="M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4" className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

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
              <SeriesTable series={stats.series} bucket={data.bucket} />
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

          <AccountList users={data.users} total={stats.users_total} />
        </div>
      )}
    </div>
  );
}

function StatTile(props: { label: string; hint: string; value: number; previous: number; prevLabel: string; selected: boolean; onSelect: () => void }) {
  const diff = props.value - props.previous;
  const delta =
    diff === 0
      ? { text: `Same as the ${props.prevLabel}`, cls: "text-muted", arrow: "" }
      : diff > 0
        ? { text: `${fmt(diff)} more than the ${props.prevLabel}`, cls: "text-success", arrow: "↑" }
        : { text: `${fmt(-diff)} fewer than the ${props.prevLabel}`, cls: "text-muted", arrow: "↓" };
  return (
    <button
      type="button"
      onClick={props.onSelect}
      aria-pressed={props.selected}
      title={props.hint}
      className={`rounded-2xl bg-surface-2 p-4 text-left transition-shadow hover:ring-1 hover:ring-line ${props.selected ? "ring-2 ring-primary hover:ring-2 hover:ring-primary" : ""}`}
    >
      <span className="block text-sm text-muted">{props.label}</span>
      <span className="mt-1 block text-3xl font-semibold tracking-tight">{fmt(props.value)}</span>
      <span className={`mt-1 block text-[13px] ${delta.cls}`}>
        {delta.arrow && <span aria-hidden="true">{delta.arrow} </span>}
        {delta.text}
      </span>
    </button>
  );
}

function ColumnChart({ points, bucket, unit }: { points: { t: string; v: number }[]; bucket: Bucket; unit: [string, string] }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 220;
  const pad = { l: 36, r: 4, t: 20, b: 26 };
  const plotW = Math.max(0, width - pad.l - pad.r);
  const plotH = H - pad.t - pad.b;
  const n = points.length;
  const peak = Math.max(0, ...points.map((p) => p.v));
  const step = niceStep(peak);
  const top = step * 4;
  const band = n ? plotW / n : 0;
  const barW = Math.max(1, Math.min(24, band * 0.7, band - 2));
  const y = (v: number) => pad.t + plotH - (v / top) * plotH;
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(plotW / 64))));
  const peakIndex = peak > 0 ? points.findIndex((p) => p.v === peak) : -1;
  const hovered = hover !== null ? points[hover] : null;

  return (
    <div ref={box} className="relative w-full" onPointerLeave={() => setHover(null)}>
      {width > 0 && (
        <svg width={width} height={H} role="img" aria-label={`${unit[1]} per ${bucket}`} className="block">
          {/* Recessive hairline grid + y ticks. */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line x1={pad.l} x2={width - pad.r} y1={y(step * i)} y2={y(step * i)} stroke="var(--line)" strokeWidth={1} />
              <text x={pad.l - 8} y={y(step * i)} dy="0.32em" textAnchor="end" fontSize={12} fill="var(--muted)" className="tabular-nums">
                {fmt(step * i)}
              </text>
            </g>
          ))}
          {points.map((p, i) => {
            const cx = pad.l + band * i + band / 2;
            const h = y(0) - y(p.v);
            return (
              <g key={p.t}>
                {p.v > 0 && <path d={columnPath(cx - barW / 2, y(p.v), barW, h)} fill={BAR} opacity={hover === null || hover === i ? 1 : 0.55} />}
                {i === peakIndex && hover === null && (
                  <text x={cx} y={y(p.v) - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--ink)" className="tabular-nums">
                    {fmt(p.v)}
                  </text>
                )}
                {i % labelEvery === 0 && (
                  <text x={cx} y={H - 8} textAnchor="middle" fontSize={12} fill="var(--muted)">
                    {bucketLabel(p.t, bucket)}
                  </text>
                )}
                {/* Hit target: the whole band, taller than the bar. */}
                <rect
                  x={pad.l + band * i}
                  y={pad.t}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${bucketLabel(p.t, bucket, true)}: ${plural(p.v, unit)}`}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="outline-none"
                />
              </g>
            );
          })}
        </svg>
      )}
      {hovered && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-md"
          style={{
            left: Math.min(Math.max(pad.l + band * hover + band / 2, 70), width - 70),
            top: Math.max(y(hovered.v) - 8, 44),
          }}
        >
          <span className="block font-semibold tabular-nums">{plural(hovered.v, unit)}</span>
          <span className="block text-[13px] text-muted">{bucketLabel(hovered.t, bucket, true)}</span>
        </div>
      )}
    </div>
  );
}

function SeriesTable({ series, bucket }: { series: Point[]; bucket: Bucket }) {
  return (
    <div className="mt-4 max-h-80 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface text-left text-muted">
          <tr>
            <th className="py-2 pr-3 font-medium">{bucket === "month" ? "Month" : bucket === "week" ? "Week" : "Day"}</th>
            {METRICS.map((m) => (
              <th key={m.id} className="py-2 pl-3 text-right font-medium">
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...series].reverse().map((p) => (
            <tr key={p.t} className="border-t border-line">
              <td className="py-2 pr-3">{bucketLabel(p.t, bucket, true)}</td>
              {METRICS.map((m) => (
                <td key={m.id} className="py-2 pl-3 text-right tabular-nums">
                  {fmt(p[m.id])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccountList({ users, total }: { users: AccountRow[]; total: number }) {
  const [all, setAll] = useState(false);
  const shown = all ? users : users.slice(0, 10);
  return (
    <section className="mt-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <h2 className="font-semibold">Latest accounts</h2>
      <p className="mt-0.5 text-sm text-muted">By last sign-in · {plural(total, ["account", "accounts"])} in total</p>
      {!users.length ? (
        <div className="mt-4 flex flex-col items-center rounded-xl bg-surface-2 px-6 py-10 text-center">
          <Icon d={I.inbox} className="h-7 w-7 text-muted" />
          <p className="mt-3 text-sm text-muted">No accounts yet. Students appear here after their first sign-in.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {shown.map((u) => (
            <li key={u.id} className="grid gap-x-4 gap-y-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center">
              <span className="min-w-0 truncate font-medium" title={u.email ?? ""}>
                {u.email ?? "(no email)"}
              </span>
              <span className="w-fit rounded-full bg-surface-2 px-2.5 py-0.5 text-[13px] capitalize text-muted">{u.provider}</span>
              <span className="text-[13px] text-muted sm:w-36">Joined {shortDate(u.created_at)}</span>
              <span className="text-[13px] text-muted sm:w-44 sm:text-right">
                {ago(u.last_sign_in_at)} · {u.active_days_30} active {u.active_days_30 === 1 ? "day" : "days"}
              </span>
            </li>
          ))}
        </ul>
      )}
      {users.length > 10 && (
        <button type="button" onClick={() => setAll((a) => !a)} className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface-2">
          {all ? "Show fewer" : `Show all ${users.length}`}
        </button>
      )}
    </section>
  );
}
