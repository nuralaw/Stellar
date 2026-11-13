"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/bank/icons";

// Shared building blocks of the admin statistics tabs (Accounts, Traffic): period presets + filter row,
// stat tiles, and the column chart. Dataviz rules: thin columns (≤24px, 4px rounded tops), hairline grid,
// one direct label on the peak, hover/focus tooltip with the value first, a table view next to the chart.

export type Bucket = "day" | "week" | "month";
export type Preset = "7d" | "30d" | "90d" | "12m" | "custom";
export type CustomRange = { from: string; to: string };
export type Period = { from: Date; to: Date; bucket: Bucket };

export const PRESETS: { id: Preset; label: string; prev: string }[] = [
  { id: "7d", label: "7 days", prev: "previous 7 days" },
  { id: "30d", label: "30 days", prev: "previous 30 days" },
  { id: "90d", label: "90 days", prev: "previous 90 days" },
  { id: "12m", label: "12 months", prev: "previous 12 months" },
  { id: "custom", label: "Custom", prev: "previous period" },
];
/** Series color: validated (dataviz checks) against both the light and the dark surface. */
export const BAR = "#ea580c";
const DAY = 86_400_000;

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function periodOf(preset: Preset, custom: CustomRange): Period | null {
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

/** Default custom range: the last 14 days. */
export function defaultCustomRange(): CustomRange {
  const today = startOfDay(new Date());
  return { from: isoDay(addDays(today, -13)), to: isoDay(today) };
}

/** Query string the admin stats endpoints take: from, to (ISO instants), bucket, tz. */
export function periodQuery(fromMs: number, bucket: Bucket, customTo: string) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const to = customTo ? addDays(parseDay(customTo), 1) : new Date();
  return new URLSearchParams({ from: new Date(fromMs).toISOString(), to: to.toISOString(), bucket, tz });
}

export function bucketLabel(t: string, bucket: Bucket, long = false) {
  const d = parseDay(t);
  if (bucket === "month") return d.toLocaleDateString("en-US", { month: long ? "long" : "short", year: long ? "numeric" : undefined });
  const s = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return bucket === "week" ? (long ? `Week of ${s}` : s) : long ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : s;
}

export const fmt = (n: number) => n.toLocaleString("en-US");
export const plural = (n: number, [one, many]: [string, string]) => `${fmt(n)} ${n === 1 ? one : many}`;

/** 4 even steps of a clean number (1, 2, 5 × 10ⁿ), so ticks stay integers. */
export function niceStep(max: number) {
  const x = Math.max(1, max / 4);
  const p = 10 ** Math.floor(Math.log10(x));
  const m = x / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

/** Column with a 4px rounded top and a square baseline. */
export function columnPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/** Filter row: period presets, custom dates, refresh button; `extra` sits before the refresh button. */
export function PeriodFilters(props: {
  preset: Preset;
  onPreset: (p: Preset) => void;
  custom: CustomRange;
  onCustom: (c: CustomRange) => void;
  loading: boolean;
  onRefresh: () => void;
  extra?: ReactNode;
}) {
  const { custom, onCustom } = props;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex max-w-full overflow-x-auto rounded-xl bg-surface-2 p-1 text-sm" role="group" aria-label="Period">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => props.onPreset(p.id)}
            aria-pressed={props.preset === p.id}
            className={`min-h-10 shrink-0 rounded-lg px-3.5 font-medium ${props.preset === p.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {props.preset === "custom" && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted">From</span>
            <input
              type="date"
              value={custom.from}
              max={custom.to}
              onChange={(e) => onCustom({ ...custom, from: e.target.value })}
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
              onChange={(e) => onCustom({ ...custom, to: e.target.value })}
              className="min-h-10 rounded-xl border border-line bg-bg px-3"
            />
          </label>
        </div>
      )}
      {props.extra}
      <button
        type="button"
        onClick={props.onRefresh}
        disabled={props.loading}
        title="Refresh"
        aria-label="Refresh"
        className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-line text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-50"
      >
        <Icon d="M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4" className={`h-5 w-5 ${props.loading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}

/** Big number + change vs the previous period; the tile is also the chart's metric switch. */
export function StatTile(props: { label: string; hint: string; value: number; previous: number; prevLabel: string; selected: boolean; onSelect: () => void }) {
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

export function ColumnChart({ points, bucket, unit }: { points: { t: string; v: number }[]; bucket: Bucket; unit: [string, string] }) {
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

/** Table view of a series: one row per bucket (newest first), one numeric column per metric. */
export function SeriesTable<P extends { t: string }>({ series, bucket, columns }: { series: P[]; bucket: Bucket; columns: { label: string; value: (p: P) => number }[] }) {
  return (
    <div className="mt-4 max-h-80 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface text-left text-muted">
          <tr>
            <th className="py-2 pr-3 font-medium">{bucket === "month" ? "Month" : bucket === "week" ? "Week" : "Day"}</th>
            {columns.map((c) => (
              <th key={c.label} className="py-2 pl-3 text-right font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...series].reverse().map((p) => (
            <tr key={p.t} className="border-t border-line">
              <td className="py-2 pr-3">{bucketLabel(p.t, bucket, true)}</td>
              {columns.map((c) => (
                <td key={c.label} className="py-2 pl-3 text-right tabular-nums">
                  {fmt(c.value(p))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
