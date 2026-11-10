"use client";

import { useEffect, useRef, useState } from "react";
import type { ScorePoint } from "@/lib/score";

const H = 240;
const M = { top: 16, right: 84, bottom: 28, left: 44 };

const dayMs = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
const fmtDay = (iso: string, long = false) =>
  new Date(dayMs(iso)).toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric", ...(long ? { weekday: "short" } : {}) });

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Estimated total score per study day: one series (line + area), target as a reference line, crosshair tooltip. */
export function ScoreChart({ points, target }: { points: ScorePoint[]; target: number | null }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const values = points.map((p) => p.total).concat(target ?? []);
  let lo = Math.max(400, Math.floor((Math.min(...values) - 60) / 100) * 100);
  let hi = Math.min(1600, Math.ceil((Math.max(...values) + 60) / 100) * 100);
  if (hi - lo < 300) {
    hi = Math.min(1600, lo + 300);
    lo = Math.max(400, hi - 300);
  }
  const step = hi - lo > 600 ? 200 : 100;
  const ticks: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) ticks.push(v);

  const iw = Math.max(0, width - M.left - M.right);
  const ih = H - M.top - M.bottom;
  const t0 = dayMs(points[0].day);
  const t1 = dayMs(points[points.length - 1].day);
  const x = (iso: string) => M.left + (t1 === t0 ? iw / 2 : ((dayMs(iso) - t0) / (t1 - t0)) * iw);
  const y = (v: number) => M.top + ((hi - v) / (hi - lo)) * ih;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.day).toFixed(1)},${y(p.total).toFixed(1)}`).join("");
  const area = points.length > 1 ? `${line}L${x(points[points.length - 1].day).toFixed(1)},${M.top + ih}L${x(points[0].day).toFixed(1)},${M.top + ih}Z` : "";
  const last = points[points.length - 1];

  // Up to 5 date labels, evenly picked from the study days.
  const xLabels = points.length <= 5 ? points.map((_, i) => i) : [0, 1, 2, 3, 4].map((k) => Math.round((k * (points.length - 1)) / 4));
  const shown = active ?? points.length - 1;
  const a = points[shown];

  const nearest = (clientX: number, rect: DOMRect) => {
    const px = clientX - rect.left;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(x(p.day) - px) < Math.abs(x(points[best].day) - px)) best = i;
    });
    return best;
  };

  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={`Estimated score over ${points.length} study ${points.length === 1 ? "day" : "days"}, latest ${last.total}`}
          tabIndex={0}
          className="block touch-pan-y outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-primary/40"
          onPointerMove={(e) => setActive(nearest(e.clientX, e.currentTarget.getBoundingClientRect()))}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setActive(Math.max(0, (active ?? points.length - 1) - 1));
            if (e.key === "ArrowRight") setActive(Math.min(points.length - 1, (active ?? points.length - 1) + 1));
          }}
        >
          {/* grid + y axis */}
          {ticks.map((v) => (
            <g key={v}>
              <line x1={M.left} x2={M.left + iw} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} />
              <text x={M.left - 8} y={y(v)} dy="0.32em" textAnchor="end" className="fill-muted text-[11px] tabular-nums">
                {v}
              </text>
            </g>
          ))}
          {/* x axis labels */}
          {xLabels.map((i) => (
            <text key={i} x={x(points[i].day)} y={H - 8} textAnchor={points.length === 1 ? "middle" : i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} className="fill-muted text-[11px]">
              {fmtDay(points[i].day)}
            </text>
          ))}

          {/* target reference */}
          {target !== null && target >= lo && target <= hi && (
            <g>
              <line x1={M.left} x2={M.left + iw} y1={y(target)} y2={y(target)} stroke="var(--muted)" strokeWidth={1} />
              <text x={M.left + iw + 8} y={y(target)} dy="0.32em" className="fill-muted text-[11px] font-medium">
                Target {target}
              </text>
            </g>
          )}

          {/* series */}
          {area && <path d={area} fill="var(--primary)" opacity={0.1} />}
          {points.length > 1 && <path d={line} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}

          {/* crosshair */}
          {active !== null && <line x1={x(a.day)} x2={x(a.day)} y1={M.top} y2={M.top + ih} stroke="var(--muted)" strokeWidth={1} opacity={0.6} />}

          {/* end / active dot with a surface ring */}
          <circle cx={x(a.day)} cy={y(a.total)} r={5} fill="var(--primary)" stroke="var(--surface)" strokeWidth={2} />

          {/* end label (latest value) */}
          {(!target || Math.abs(y(target) - y(last.total)) > 14) && (
            <text x={M.left + iw + 8} y={y(last.total)} dy="0.32em" className="fill-ink text-xs font-semibold tabular-nums">
              {last.total}
            </text>
          )}
        </svg>
      )}

      {/* tooltip */}
      {active !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-10 w-44 rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg"
          style={{ left: Math.min(Math.max(0, x(a.day) - 88), width - 176) }}
        >
          <p className="text-lg leading-tight font-bold tabular-nums">{a.total}</p>
          <p className="text-muted">{fmtDay(a.day, true)} · estimated</p>
          <div className="mt-1.5 space-y-0.5 border-t border-line pt-1.5 tabular-nums">
            <p className="flex justify-between">
              <span className="text-muted">Reading and Writing</span> {a.rw}
            </p>
            <p className="flex justify-between">
              <span className="text-muted">Math</span> {a.math}
            </p>
            <p className="flex justify-between">
              <span className="text-muted">Answered that day</span> {a.answered}
            </p>
          </div>
        </div>
      )}

      {/* table view for screen readers */}
      <table className="sr-only">
        <caption>Estimated score by study day</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Total</th>
            <th>Reading and Writing</th>
            <th>Math</th>
            <th>Answered</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.day}>
              <td>{fmtDay(p.day, true)}</td>
              <td>{p.total}</td>
              <td>{p.rw}</td>
              <td>{p.math}</td>
              <td>{p.answered}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
