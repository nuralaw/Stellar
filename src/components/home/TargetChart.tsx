"use client";

import { useState } from "react";
import type { TestResult } from "@/lib/store";
import { fmtDay, useWidth } from "./ScoreChart";

// Dashboard "Target score" chart: total score of each full test on a real time axis (x = date, y = score), the target as a
// dashed line, the latest test labelled (score to its right, date under it). Same look and interaction as ScoreChart.

const H = 180;
const M = { top: 12, right: 52, bottom: 26, left: 40 };
const DAY = 86_400_000;
const CHAR_W = 5.8; // rough width of one 11px label character, to keep the date labels apart

/** "Nov 18", or "Nov 18, 2026" when asked for the year. */
const dayLabel = (at: number, withYear: boolean) => fmtDay(at) + (withYear ? `, ${new Date(at).getFullYear()}` : "");

export function TargetChart({ points, target }: { points: TestResult[]; target: number | null }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  if (!points.length) return null;

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

  const last = points[points.length - 1];
  const first = points[0];
  // Time scale. One test (or all on the same instant): pad 3 days each side so the point sits in the middle.
  let t0 = first.at;
  let t1 = last.at;
  if (t1 - t0 <= 0) {
    t0 -= 3 * DAY;
    t1 += 3 * DAY;
  }
  const iw = Math.max(0, width - M.left - M.right);
  const ih = H - M.top - M.bottom;
  const x = (at: number) => M.left + ((at - t0) / (t1 - t0)) * iw;
  const y = (v: number) => M.top + ((hi - v) / (hi - lo)) * ih;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.at).toFixed(1)},${y(p.total).toFixed(1)}`).join("");
  const area = points.length > 1 ? `${line}L${x(last.at).toFixed(1)},${M.top + ih}L${x(first.at).toFixed(1)},${M.top + ih}Z` : "";

  // The year is only written when the tests span two calendar years.
  const withYear = new Date(first.at).getFullYear() !== new Date(last.at).getFullYear();
  const lastText = dayLabel(last.at, withYear);
  const firstText = dayLabel(first.at, withYear);
  const lastX = x(last.at);
  const lastHalf = Math.max(20, (lastText.length * CHAR_W) / 2);
  const lastAnchor = lastX + lastHalf > width ? "end" : "middle";
  // The first date only when there's room beside the latest one.
  const showFirst = points.length > 1 && lastX - x(first.at) > Math.max(70, firstText.length * CHAR_W + lastHalf + 6);

  // The "Target N" label sits at the left above the line; a test plotted right there pushes it under the line instead.
  const near = (above: boolean) =>
    target !== null && points.some((p) => x(p.at) < M.left + 80 && (above ? y(target) - y(p.total) : y(p.total) - y(target)) >= 0 && Math.abs(y(p.total) - y(target)) < 18);
  const targetLabelY = target === null ? 0 : near(true) && !near(false) ? y(target) + 13 : y(target) - 5;

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
    <div ref={ref} className="relative" style={{ minHeight: H }}>
      {width > 0 && (
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={`Score over ${points.length} practice ${points.length === 1 ? "test" : "tests"}, latest ${last.total} on ${dayLabel(last.at, true)}${target !== null ? `, target ${target}` : ""}`}
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

          {/* target: dashed line, label at the left (the latest score is labelled on the right, so they never meet) */}
          {target !== null && (
            <g>
              <line x1={M.left} x2={M.left + iw} y1={y(target)} y2={y(target)} stroke="var(--muted)" strokeWidth={1} strokeDasharray="4 4" />
              <text x={M.left + 4} y={targetLabelY} className="fill-muted text-[11px] font-medium">
                Target {target}
              </text>
            </g>
          )}

          {/* series: the line draws in, the area fades in under it, each dot pops as the line reaches it */}
          {area && <path d={area} fill="var(--primary)" opacity={0.1} className="stat-fade" style={{ animationDelay: "500ms" }} />}
          {points.length > 1 && <path d={line} pathLength={1} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="stat-line" />}
          {points.slice(0, -1).map((p, i) => (
            <circle
              key={p.id}
              cx={x(p.at)}
              cy={y(p.total)}
              r={4}
              fill="var(--surface)"
              stroke="var(--primary)"
              strokeWidth={1.5}
              className="lesson-pop [transform-box:fill-box] [transform-origin:center]"
              style={{ animationDelay: `${Math.round((i / Math.max(1, points.length - 1)) * 1100) + 100}ms` }}
            />
          ))}

          {/* crosshair + the pointed-at test */}
          {active !== null && <line x1={x(a.at)} x2={x(a.at)} y1={M.top} y2={M.top + ih} stroke="var(--muted)" strokeWidth={1} opacity={0.6} />}
          {active !== null && shown !== points.length - 1 && <circle cx={x(a.at)} cy={y(a.total)} r={5} fill="var(--primary)" stroke="var(--surface)" strokeWidth={2} />}

          {/* latest test: dotted guide to the axis, its date under it, its score to its right */}
          <line x1={lastX} x2={lastX} y1={y(last.total)} y2={M.top + ih} stroke="var(--muted)" strokeWidth={1} opacity={0.5} strokeDasharray="2 3" />
          <circle
            cx={lastX}
            cy={y(last.total)}
            r={5}
            fill="var(--primary)"
            stroke="var(--surface)"
            strokeWidth={2}
            className="lesson-pop [transform-box:fill-box] [transform-origin:center]"
            style={{ animationDelay: "1250ms" }}
          />
          <text x={lastX + 10} y={y(last.total)} dy="0.32em" className="stat-fade fill-ink text-sm font-bold tabular-nums" style={{ animationDelay: "1300ms" }}>
            {last.total}
          </text>
          <text x={lastX} y={H - 8} textAnchor={lastAnchor} className="fill-ink text-[11px] font-medium">
            {lastText}
          </text>
          {showFirst && (
            <text x={x(first.at)} y={H - 8} textAnchor="start" className="fill-muted text-[11px]">
              {firstText}
            </text>
          )}
        </svg>
      )}

      {/* tooltip */}
      {active !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-10 w-44 rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg"
          style={{ left: Math.min(Math.max(0, x(a.at) - 88), Math.max(0, width - 176)) }}
        >
          <p className="text-lg leading-tight font-bold tabular-nums">{a.total}</p>
          <p className="text-muted">
            Practice test #{shown + 1} · {fmtDay(a.at, true)}
          </p>
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
              <td>{dayLabel(p.at, true)}</td>
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
