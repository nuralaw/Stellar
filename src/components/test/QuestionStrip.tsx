"use client";

import type { Difficulty } from "@/lib/types";

export interface StripItem {
  key: string;
  difficulty?: Difficulty;
  answered: boolean;
  marked?: boolean;
}

const DIFF: Record<Difficulty, { label: string; dot: string; bar: string; chip: string }> = {
  easy: { label: "Easy", dot: "bg-success", bar: "group-hover:bg-success/70", chip: "bg-success-soft text-success" },
  medium: { label: "Medium", dot: "bg-accent", bar: "group-hover:bg-accent/75", chip: "bg-accent-soft text-accent" },
  hard: { label: "Hard", dot: "bg-danger", bar: "group-hover:bg-danger/70", chip: "bg-danger-soft text-danger" },
};

/**
 * The thin question switcher under a test / round toolbar. Hovering a segment turns it into a square-cornered block, tints it with the
 * question's difficulty and pops up a small card (number, difficulty, answered / marked); click to jump there.
 */
export function QuestionStrip({ items, pos, onPick }: { items: StripItem[]; pos: number | null; onPick: (i: number) => void }) {
  const n = items.length;
  return (
    <div className="mt-2.5 flex gap-1" role="navigation" aria-label="Questions">
      {items.map((it, i) => {
        const d = it.difficulty ? DIFF[it.difficulty] : null;
        const current = i === pos;
        // Keep the popup on screen at both ends of the strip.
        const align = i < 3 ? "left-0" : i > n - 4 ? "right-0" : "left-1/2 -translate-x-1/2";
        return (
          <button
            key={it.key}
            type="button"
            tabIndex={-1}
            onClick={() => onPick(i)}
            aria-label={`Question ${i + 1}${d ? `, ${d.label}` : ""}${it.answered ? ", answered" : ""}${it.marked ? ", marked for review" : ""}`}
            className="group relative flex h-5 flex-1 items-center"
          >
            <span
              className={`block w-full rounded-[4px] transition-all duration-150 group-hover:h-3 group-hover:rounded-[2px] ${current ? "h-2 bg-primary" : it.answered ? "h-1 bg-primary/60" : "h-1 bg-line"} ${
                d && !current ? d.bar : ""
              }`}
            />
            {it.marked && <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" aria-hidden="true" />}
            <span
              className={`pointer-events-none absolute top-full z-40 mt-1.5 flex origin-top scale-90 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs whitespace-nowrap opacity-0 shadow-lg transition-[opacity,scale] duration-150 group-hover:scale-100 group-hover:opacity-100 ${align}`}
              aria-hidden="true"
            >
              <span className="font-semibold tabular-nums">Q{i + 1}</span>
              {d && (
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold ${d.chip}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${d.dot}`} />
                  {d.label}
                </span>
              )}
              <span className="text-muted">{it.marked ? "Marked" : it.answered ? "Answered" : "Not answered"}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
