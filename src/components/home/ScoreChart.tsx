"use client";

import { useEffect, useRef, useState } from "react";
import type { TestResult } from "@/lib/store";

const H = 240;
const M = { top: 16, right: 84, bottom: 28, left: 44 };

export const fmtDay = (at: number, long = false) => new Date(at).toLocaleDateString("en-US", { month: "short", day: "numeric", ...(long ? { weekday: "short" } : {}) });

export function useWidth<T extends HTMLElement>() {
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

/** Total score of each practice test: one series (line + area), target as a reference line, crosshair tooltip. */
export function ScoreChart({ points, target }: { points: TestResult[]; target: number | null }) {
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
  // Tests are separate events: space them evenly, in order.
  const order = new Map(points.map((p, i) => [p.at, i]));
  const x = (at: number) => M.left + (points.length === 1 ? iw / 2 : ((order.get(at) ?? 0) / (points.length - 1)) * iw);
  const y = (v: number) => M.top + ((hi - v) / (hi - lo)) * ih;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.at).toFixed(1)},${y(p.total).toFixed(1)}`).join("");
  const area = points.length > 1 ? `${line}L${x(points[points.length - 1].at).toFixed(1)},${M.top + ih}L${x(points[0].at).toFixed(1)},${M.top + ih}Z` : "";
  const last = points[points.length - 1];

  // Up to 5 date labels, evenly picked from the study days.
  const xLabels = points.length <= 5 ? points.map((_, i) => i) : [0, 1, 2, 3, 4].map((k) => Math.round((k * (points.length - 1)) / 4));
  const shown = active ?? points.length - 1;
  const a = points[shown];

  const nearest = (clientX: number, rect: DOMRect) => {
    const px = clientX - rect.left;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(x(p.at) - px) < Math.abs(x(points[best].at) - px)) best = i;
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
          aria-label={`Score over ${points.length} practice ${points.length === 1 ? "test" : "tests"}, latest ${last.total}`}
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
            <text key={i} x={x(points[i].at)} y={H - 8} textAnchor={points.length === 1 ? "middle" : i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} className="fill-muted text-[11px]">
              {fmtDay(points[i].at)}
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
          {/* Draws in: the line from left to right, the area fades in under it, each test's dot pops as the line reaches it. */}
          {area && <path d={area} fill="var(--primary)" opacity={0.1} className="stat-fade" style={{ animationDelay: "500ms" }} />}
          {points.length > 1 && <path d={line} pathLength={1} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="stat-line" />}
          {points.length > 1 &&
            points.map((p, i) => (
              <circle
                key={p.id}
                cx={x(p.at)}
                cy={y(p.total)}
                r={3}
                fill="var(--surface)"
                stroke="var(--primary)"
                strokeWidth={1.5}
                className="lesson-pop [transform-box:fill-box] [transform-origin:center]"
                style={{ animationDelay: `${Math.round((i / (points.length - 1)) * 1100) + 100}ms` }}
              />
            ))}

          {/* crosshair */}
          {active !== null && <line x1={x(a.at)} x2={x(a.at)} y1={M.top} y2={M.top + ih} stroke="var(--muted)" strokeWidth={1} opacity={0.6} />}

          {/* end / active dot with a surface ring */}
          <circle
            cx={x(a.at)}
            cy={y(a.total)}
            r={5}
            fill="var(--primary)"
            stroke="var(--surface)"
            strokeWidth={2}
            className="lesson-pop [transform-box:fill-box] [transform-origin:center]"
            style={{ animationDelay: "1250ms" }}
          />

          {/* end label (latest value) */}
          {(!target || Math.abs(y(target) - y(last.total)) > 14) && (
            <text x={M.left + iw + 8} y={y(last.total)} dy="0.32em" className="stat-fade fill-ink text-xs font-semibold tabular-nums" style={{ animationDelay: "1300ms" }}>
              {last.total}
            </text>
          )}
        </svg>
      )}

      {/* tooltip */}
      {active !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-10 w-44 rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg"
          style={{ left: Math.min(Math.max(0, x(a.at) - 88), width - 176) }}
        >
          <p className="text-lg leading-tight font-bold tabular-nums">{a.total}</p>
          <p className="text-muted">Practice test #{shown + 1} · {fmtDay(a.at, true)}</p>
          <div className="mt-1.5 space-y-0.5 border-t border-line pt-1.5 tabular-nums">
            <p className="flex justify-between">
              <span className="text-muted">Reading and Writing</span> {a.rw}
            </p>
            <p className="flex justify-between">
              <span className="text-muted">Math</span> {a.math}
            </p>
          </div>
        </div>
      )}

      {/* table view for screen readers */}
      <table className="sr-only">
        <caption>Practice test scores</caption>
        <thead>
          <tr>
            <th>Test</th>
            <th>Date</th>
            <th>Total</th>
            <th>Reading and Writing</th>
            <th>Math</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={p.id}>
              <td>#{i + 1}</td>
              <td>{fmtDay(p.at, true)}</td>
              <td>{p.total}</td>
              <td>{p.rw}</td>
              <td>{p.math}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
