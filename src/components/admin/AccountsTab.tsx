"use client";

import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-keys";
import { DiscountRow, isLive, PlusRow, usePlusSubs } from "./PlusControls";
import { SearchBox } from "./SearchBox";
import { type Bucket, ColumnChart, defaultCustomRange, periodOf, periodQuery, PeriodFilters, plural, type Preset, PRESETS, SeriesTable, StatTile } from "./charts";

// /admin → Accounts: new accounts, sign-ins and active students over a chosen period (column chart),
// and a keyword search for accounts (nothing is listed until the admin types). Data: /api/admin/accounts (statistics)
// and /api/admin/accounts/search (SQL in supabase/account_stats.sql).

type Metric = "signups" | "signins" | "active";
type Point = { t: string; signups: number; signins: number; active: number };
type Totals = Record<Metric, number>;
type Stats = { series: Point[]; totals: Totals; previous: Totals; users_total: number };
type AccountRow = { id: string; email: string | null; name: string | null; created_at: string; last_sign_in_at: string | null; provider: string; active_days_30: number; discountOpen?: boolean };

const METRICS: { id: Metric; label: string; unit: [string, string]; hint: string }[] = [
  { id: "signups", label: "New accounts", unit: ["new account", "new accounts"], hint: "Registrations" },
  { id: "signins", label: "Sign-ins", unit: ["sign-in", "sign-ins"], hint: "Each time someone signs in" },
  { id: "active", label: "Active students", unit: ["active student", "active students"], hint: "Signed-in students who used the site" },
];
const MIN_QUERY = 2;
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
  const [data, setData] = useState<{ stats: Stats; bucket: Bucket } | null>(null);
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
          setData({ stats: json.stats, bucket });
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
      <AccountSearch />

      {/* Filters: one row above everything they scope. */}
      <div className="mt-5">
        <PeriodFilters preset={preset} onPreset={setPreset} custom={custom} onCustom={setCustom} loading={loading} onRefresh={() => setReload((n) => n + 1)} />
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
        </div>
      )}
    </div>
  );
}

type SearchAnswer = { id: number; error: string | null; users: AccountRow[]; more: boolean; bugCode: boolean };

/** Find accounts by keyword: every word must appear in the email, name or id. Nothing is listed until the admin types. */
function AccountSearch() {
  const [text, setText] = useState("");
  /** The query the debounce has caught up with; `id` tells the answers of different requests apart. */
  const [requested, setRequested] = useState<{ q: string; id: number } | null>(null);
  const [answer, setAnswer] = useState<SearchAnswer | null>(null);
  const seq = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const plus = usePlusSubs();
  const bySub = new Map((plus.subs ?? []).map((s) => [s.userId, s]));
  const activePlus = (plus.subs ?? []).filter(isLive).length;
  const expiredPlus = (plus.subs?.length ?? 0) - activePlus;

  const query = text.trim();
  const active = query.length >= MIN_QUERY;
  /** The answer on screen belongs to what is typed now. Otherwise it is old (dimmed) or missing. */
  const settled = active && requested?.q === query && answer?.id === requested.id;
  const shown = active ? answer : null;

  useEffect(() => {
    if (query.length < MIN_QUERY) return;
    const t = setTimeout(() => setRequested({ q: query, id: ++seq.current }), 300);
    timer.current = t;
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!requested) return;
    let live = true;
    const { q, id } = requested;
    adminFetch(`/api/admin/accounts/search?q=${encodeURIComponent(q)}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account to search accounts.");
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (!json || !Array.isArray(json.users)) throw new Error("The server sent an unexpected answer. Try again.");
        if (live) setAnswer({ id, error: null, users: json.users, more: json.more === true, bugCode: json.bugCode !== false });
      })
      .catch((e: Error) => live && setAnswer({ id, error: e.message === "Failed to fetch" ? "Couldn't load. Check your connection." : e.message, users: [], more: false, bugCode: true }));
    return () => {
      live = false;
    };
  }, [requested]);

  /** Dropping below the minimum forgets everything: rows from an older query must not come back, and an in-flight request is abandoned. */
  function change(v: string) {
    setText(v);
    if (v.trim().length < MIN_QUERY) {
      setAnswer(null);
      setRequested(null);
    }
  }

  /** Send the current query again right now (Enter, or Retry after an error). */
  function rerun() {
    if (!active) return;
    clearTimeout(timer.current);
    setRequested({ q: query, id: ++seq.current });
  }

  const users = shown?.users ?? [];
  const error = settled ? shown?.error : null;
  let status = "Type at least 2 characters.";
  if (active) {
    if (!settled) status = "Searching…";
    else if (error) status = "";
    else if (!users.length) status = `No accounts match “${query}”.`;
    else status = shown?.more ? "First 50 accounts" : `${plural(users.length, ["account", "accounts"])} found`;
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <h2 className="font-semibold">Find an account</h2>
      {plus.subs && (
        <p className="mt-0.5 text-sm text-muted">
          Stellar Plus: {activePlus} active{expiredPlus > 0 ? ` · ${expiredPlus} expired` : ""}
        </p>
      )}
      <div className="mt-3">
        <SearchBox value={text} onChange={change} onSubmit={rerun} placeholder="Search by email, name or ID" maxLength={100} />
      </div>
      {plus.error && (
        <p role="alert" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          <span>{plus.error}</span>
          <button type="button" onClick={plus.reload} className="font-semibold underline">
            Retry
          </button>
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button type="button" onClick={rerun} className="font-semibold underline">
            Retry
          </button>
        </p>
      )}
      <p role="status" className="mt-3 text-sm text-muted">
        {status}
      </p>
      {active && users.length > 0 && (
        <div className={`transition-opacity ${settled ? "" : "opacity-50"}`}>
          <ul className="mt-1 divide-y divide-line">
            {users.map((u) => (
              <li key={u.id} className="py-3">
                <div className="grid gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center">
                  <div className="min-w-0">
                    {/* The email is the real identity; the name is chosen by the student, so it only goes underneath. */}
                    <span className="block truncate font-medium" title={u.email ?? ""}>
                      {u.email ?? "(no email)"}
                    </span>
                    {u.name && (
                      <span className="block truncate text-[13px] text-muted" title={u.name}>
                        {u.name}
                      </span>
                    )}
                  </div>
                  <span className="w-fit rounded-full bg-surface-2 px-2.5 py-0.5 text-[13px] capitalize text-muted">{u.provider || "–"}</span>
                  <span className="text-[13px] text-muted sm:w-36">Joined {shortDate(u.created_at)}</span>
                  <span className="text-[13px] text-muted sm:w-44 sm:text-right">
                    {ago(u.last_sign_in_at)} · {u.active_days_30} active {u.active_days_30 === 1 ? "day" : "days"}
                  </span>
                </div>
                {plus.subs && <PlusRow userId={u.id} sub={bySub.get(u.id)} onChanged={plus.reload} />}
                <DiscountRow userId={u.id} open={Boolean(u.discountOpen)} bugCode={shown?.bugCode ?? true} />
              </li>
            ))}
          </ul>
          {shown?.more && <p className="mt-3 text-sm text-muted">Add another word to narrow it down.</p>}
        </div>
      )}
    </section>
  );
}
