"use client";

import { useState } from "react";

const R = 70; // ring radius (center of the stroke)
const T = 22; // ring thickness
const GAP = 2; // surface gap between the two slices
const C = 2 * Math.PI * R;

type Key = "correct" | "wrong";

/** Correct vs incorrect answers. Hovering / focusing a slice shows it in the center; the legend carries the numbers. */
export function AccuracyDonut({ correct, wrong }: { correct: number; wrong: number }) {
  const [hover, setHover] = useState<Key | null>(null);
  const total = correct + wrong;
  const parts: { key: Key; label: string; value: number; color: string; icon: string }[] = [
    { key: "correct", label: "Correct", value: correct, color: "var(--chart-correct)", icon: "M5 12.5l4.5 4.5L19 7" },
    { key: "wrong", label: "Incorrect", value: wrong, color: "var(--chart-wrong)", icon: "M7 7l10 10M17 7 7 17" },
  ];
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);
  const both = correct > 0 && wrong > 0;

  let offset = 0;
  const slices = parts
    .filter((p) => p.value > 0)
    .map((p) => {
      const len = (p.value / total) * C;
      const s = { ...p, dash: Math.max(0.5, len - (both ? GAP : 0)), offset };
      offset += len;
      return s;
    });

  const center = hover ? parts.find((p) => p.key === hover)! : null;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" role="img" aria-label={`${correct} correct and ${wrong} incorrect answers`}>
          <circle cx={90} cy={90} r={R} fill="none" stroke="var(--surface-2)" strokeWidth={T} />
          {slices.map((s) => (
            <circle
              key={s.key}
              cx={90}
              cy={90}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={hover === s.key ? T + 4 : T}
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={-s.offset}
              tabIndex={0}
              aria-label={`${s.label}: ${s.value} (${pct(s.value)}%)`}
              className="cursor-pointer outline-none transition-[stroke-width]"
              onPointerEnter={() => setHover(s.key)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(s.key)}
              onBlur={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <p className="text-3xl font-bold tracking-tight tabular-nums">{center ? center.value : `${pct(correct)}%`}</p>
          <p className="text-xs text-muted">{center ? `${center.label.toLowerCase()} · ${pct(center.value)}%` : "accuracy"}</p>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-2.5">
        {parts.map((p) => (
          <li
            key={p.key}
            onPointerEnter={() => setHover(p.key)}
            onPointerLeave={() => setHover(null)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${hover === p.key ? "bg-surface-2" : ""}`}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white" style={{ background: p.color }} aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
                <path d={p.icon} />
              </svg>
            </span>
            <span className="flex-1 text-sm font-medium">{p.label}</span>
            <span className="text-sm font-semibold tabular-nums">{p.value.toLocaleString("en-US")}</span>
            <span className="w-10 text-right text-xs text-muted tabular-nums">{pct(p.value)}%</span>
          </li>
        ))}
        <li className="px-3 pt-1 text-xs text-muted">{total.toLocaleString("en-US")} answered in total</li>
      </ul>
    </div>
  );
}
