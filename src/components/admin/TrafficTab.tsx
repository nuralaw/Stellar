"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { adminFetch } from "@/lib/admin-keys";
import type { TrafficPoint, TrafficRow, TrafficSource, TrafficStats } from "@/lib/traffic-types";
import { BAR, ColumnChart, defaultCustomRange, fmt, periodOf, periodQuery, PeriodFilters, plural, type Preset, PRESETS, SeriesTable, StatTile } from "./charts";

// /admin → Traffic: unique visitors and page views over a chosen period (column chart) plus top pages,
// sources and countries. Data: our own counter (/api/admin/traffic, fed by PageTracker → /api/track) or,
// once configured, Plausible (/api/admin/traffic/plausible). Both return TrafficStats.

type Metric = "visitors" | "pageviews";

const METRICS: { id: Metric; label: string; unit: [string, string]; hint: string }[] = [
  { id: "visitors", label: "Visitors", unit: ["visitor", "visitors"], hint: "Unique browsers" },
  { id: "pageviews", label: "Page views", unit: ["page view", "page views"], hint: "Every page opened, including repeats" },
];
const COLUMNS = METRICS.map((m) => ({ label: m.label, value: (p: TrafficPoint) => p[m.id] }));
const SOURCES: { id: TrafficSource; label: string }[] = [
  { id: "supabase", label: "Stellar counter" },
  { id: "plausible", label: "Plausible" },
];
const ENDPOINT: Record<TrafficSource, string> = { supabase: "/api/admin/traffic", plausible: "/api/admin/traffic/plausible" };

/** `onDenied`: a 401/403 (signed out, or this browser isn't an allowed admin device) re-reads /api/admin/me, like the inbox does. */
export function TrafficTab({ onDenied }: { onDenied: () => unknown }) {
  const [preset, setPreset] = useState<Preset>("30d");
  const [custom, setCustom] = useState(defaultCustomRange);
  const [metric, setMetric] = useState<Metric>("visitors");
  const [source, setSource] = useState<TrafficSource>("supabase");
  /** Plausible endpoint exists and is set up → show the source switch. */
  const [plausible, setPlausible] = useState(false);
  const [data, setData] = useState<TrafficStats | null>(null);
  /** Key of the last finished request; loading = the current key hasn't finished yet. */
  const [doneKey, setDoneKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState(false);
  const [reload, setReload] = useState(0);
  const localhost = useSyncExternalStore(noSubscribe, isLocalhost, () => false);

  const period = periodOf(preset, custom);
  const fromMs = period?.from.getTime();
  const bucket = period?.bucket;
  const customTo = preset === "custom" ? custom.to : "";
  const requestKey = `${source}|${fromMs}|${bucket}|${customTo}|${reload}`;
  const loading = fromMs !== undefined && requestKey !== doneKey;

  // Once on mount: is Plausible configured? (404 = endpoint not deployed yet → same as not configured.)
  useEffect(() => {
    let live = true;
    const q = periodQuery(startOfToday(), "day", "");
    adminFetch(`${ENDPOINT.plausible}?${q}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: (TrafficStats & { configured?: boolean }) | null) => {
        if (live && json && json.configured !== false && json.source === "plausible") setPlausible(true);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (fromMs === undefined || !bucket) return;
    let live = true;
    const q = periodQuery(fromMs, bucket, customTo);
    adminFetch(`${ENDPOINT[source]}?${q}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (res.status === 401 || res.status === 403) {
          if (live) {
            setError("Access denied. Sign in again or check this browser in the Security tab.");
            onDenied();
          }
          return;
        }
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (json?.configured === false) throw new Error("Plausible isn't set up yet.");
        if (live) {
          setData(json as TrafficStats);
          setError(null);
        }
      })
      .catch((e: Error) => live && setError(e.message === "Failed to fetch" ? "Couldn't load. Check your connection." : e.message))
      .finally(() => live && setDoneKey(requestKey));
    return () => {
      live = false;
    };
  }, [source, fromMs, bucket, customTo, requestKey, onDenied]);

  const prevLabel = PRESETS.find((p) => p.id === preset)!.prev;
  const m = METRICS.find((x) => x.id === metric)!;
  const points = data?.series.map((p) => ({ t: p.t, v: p[metric] })) ?? [];
  const empty = data ? data.totals.pageviews === 0 && points.every((p) => p.v === 0) : false;

  const sourceSwitch = plausible && (
    <div className="flex max-w-full overflow-x-auto rounded-xl bg-surface-2 p-1 text-sm" role="group" aria-label="Data source">
      {SOURCES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setSource(s.id)}
          aria-pressed={source === s.id}
          className={`min-h-10 shrink-0 rounded-lg px-3.5 font-medium ${source === s.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-5">
      {/* Filters: one row above everything they scope. */}
      <PeriodFilters
        preset={preset}
        onPreset={setPreset}
        custom={custom}
        onCustom={setCustom}
        loading={loading}
        onRefresh={() => setReload((n) => n + 1)}
        extra={sourceSwitch}
      />

      {preset === "custom" && !period && <p className="mt-4 text-sm text-danger">Pick a start date before the end date, at most 400 days apart.</p>}
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {!data && loading && <p className="mt-6 text-muted">Loading…</p>}

      {data && (
        <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
          {/* Stat tiles double as the chart's metric switch. */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {METRICS.map((x) => (
              <StatTile
                key={x.id}
                label={x.label}
                hint={x.hint}
                value={data.totals[x.id]}
                previous={data.previous[x.id]}
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
                  Per {data.bucket} · {data.source === "plausible" ? "from Plausible" : "Stellar counter"}
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
              <SeriesTable series={data.series} bucket={data.bucket} columns={COLUMNS} />
            ) : (
              <div className="relative mt-4">
                <ColumnChart points={points} bucket={data.bucket} unit={m.unit} />
                {empty && (
                  <p className="pointer-events-none absolute inset-x-4 top-1/4 text-center text-sm text-muted">
                    No visits recorded in this period yet.
                    <br />
                    Visits are counted on the live site; your own visits as admin aren&apos;t counted.
                    {localhost && data.source === "supabase" && (
                      <>
                        <br />
                        Visits to localhost aren&apos;t counted either.
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <TopList title="Top pages" rows={data.pages} name={(r) => <span className="font-mono text-[13px]">{r.name}</span>} label={(r) => r.name} />
            <TopList title="Sources" rows={data.referrers} name={(r) => sourceName(r.name)} label={(r) => sourceName(r.name)} />
            <TopList title="Countries" rows={data.countries} name={(r) => <CountryName code={r.name} />} label={(r) => countryLabel(r.name)} />
          </div>
        </div>
      )}
    </div>
  );
}

const noSubscribe = () => () => {};
const isLocalhost = () => ["localhost", "127.0.0.1", "[::1]", "::1"].includes(location.hostname);

function startOfToday() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

const sourceName = (s: string) => (!s || s.toLowerCase() === "direct" ? "Direct" : s);

let regionNames: Intl.DisplayNames | null | undefined;
function countryLabel(code: string) {
  if (!/^[A-Za-z]{2}$/.test(code)) return code || "Unknown";
  if (regionNames === undefined) {
    try {
      regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      regionNames = null;
    }
  }
  try {
    return regionNames?.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

/** Flag emoji from an ISO 3166-1 alpha-2 code: each letter → its regional indicator symbol. */
function flag(code: string) {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

function CountryName({ code }: { code: string }) {
  const f = flag(code);
  return (
    <>
      {f && (
        <span aria-hidden="true" className="mr-1.5">
          {f}
        </span>
      )}
      {countryLabel(code)}
    </>
  );
}

/** Ranked list: name, a thin share bar under it (share of the list's max), visitors right-aligned. */
function TopList({ title, rows, name, label }: { title: string; rows: TrafficRow[]; name: (r: TrafficRow) => ReactNode; label: (r: TrafficRow) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  return (
    <section className="min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-[13px] text-muted">Visitors</span>
      </div>
      {!rows.length ? (
        <div className="mt-4 flex flex-col items-center rounded-xl bg-surface-2 px-6 py-8 text-center">
          <Icon d={I.inbox} className="h-6 w-6 text-muted" />
          <p className="mt-2 text-sm text-muted">Nothing yet.</p>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {rows.map((r) => (
            <li key={r.name} title={`${label(r)}: ${plural(r.visitors, ["visitor", "visitors"])}, ${plural(r.pageviews, ["page view", "page views"])}`}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">{name(r)}</span>
                <span className="shrink-0 font-medium tabular-nums">{fmt(r.visitors)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                <div className="h-full rounded-full" style={{ width: `${(r.visitors / max) * 100}%`, background: BAR, opacity: 0.55 }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
