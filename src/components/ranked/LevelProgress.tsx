"use client";

import { useEffect, useState } from "react";
import { LEVELS, PLACEMENT_MATCHES } from "@/lib/elo-config";
import type { LevelInfo } from "@/lib/elo";

/** Bar that fills with a transform (compositor only); starts empty and grows once mounted. Instant under prefers-reduced-motion. */
export function Bar({ value, label }: { value: number; label: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(r);
  }, []);
  const v = Math.min(1, Math.max(0, value));
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      <div
        className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${on ? v : 0})` }}
      />
    </div>
  );
}

/** Progress to the next level (or the placement progress while calibrating). `rating` is the number the bar is drawn for. */
export function LevelProgress({ level, rating }: { level: LevelInfo; rating: number }) {
  if (level.placement) {
    const done = PLACEMENT_MATCHES - level.left;
    return (
      <div>
        <Bar value={done / PLACEMENT_MATCHES} label="Placement progress" />
        <p className="mt-2 text-sm text-muted tabular-nums">
          Placement {done}/{PLACEMENT_MATCHES} · your level appears after {level.left} more {level.left === 1 ? "match" : "matches"}
        </p>
      </div>
    );
  }
  const next = LEVELS[level.level]; // levels are 1-based, so this is the one after the current
  return (
    <div>
      <Bar value={level.progress} label="Progress to the next level" />
      <div className="mt-2 flex justify-between gap-3 text-sm text-muted tabular-nums">
        <span>{level.name}</span>
        {level.next !== null && next ? (
          <span>
            {Math.max(0, level.next - rating)} to {next.name} · {level.next}
          </span>
        ) : (
          <span>Top level</span>
        )}
      </div>
    </div>
  );
}
