"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Difficulty } from "@/lib/types";
import { DifficultyBadge } from "./QuestionCard";
import { skillName, type BankItem } from "./data";
import { I, Icon } from "./icons";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Colours of a question's square by answer state (shared with the Navigator grid). */
export function answerTone(correct: boolean | undefined): string {
  return correct === undefined ? "border-line bg-surface text-muted hover:border-muted hover:text-ink" : correct ? "border-success/60 bg-success-soft text-success" : "border-danger/60 bg-danger-soft text-danger";
}

/** Square 32px + gap 6px. */
const PITCH = 38;
/** Rows drawn beyond the visible ones, above and below. */
const OVERSCAN = 3 * PITCH;
// A mouse click doesn't take focus (QuestionCard ignores Enter while a button is focused). Keyboard users get a roving tab stop:
// one Tab stop for the whole grid, arrow keys / Home / End move between squares, Enter clicks.
const keepFocus = (e: React.MouseEvent) => e.preventDefault();

/**
 * Numbered squares (1, 2, 3 …) for a list of questions. The list can be thousands long, so only the rows in view are drawn.
 * Hovering a square shows a card with difficulty, id, topic and result; it is drawn outside the scroller (which would clip it),
 * so no ancestor of this component may clip overflow.
 * Keyboard: Tab stops on one square (the last focused, else `current`, else the first in view); ←/→ ±1, ↑/↓ the same column in the
 * previous / next row, Home / End first / last.
 */
export function QuestionGrid({
  ids,
  items,
  tone,
  prior,
  bookmarks,
  current,
  onPick,
  maxHeight,
  label,
  align = "center",
  open = true,
  resetKey,
}: {
  ids: string[];
  items: Map<string, BankItem>;
  /** Answer state of a question: undefined = unanswered. */
  tone: (id: string) => boolean | undefined;
  /** Result from before this session, for the hover card ("Previously correct") and the labels. */
  prior?: (id: string) => boolean | undefined;
  bookmarks: Set<string>;
  /** Index in `ids` of the question to ring and scroll to the middle. */
  current?: number;
  /** Index in `ids`. */
  onPick: (index: number) => void;
  /** CSS length of the tallest the scroller gets. */
  maxHeight: string;
  label: string;
  /** Where the squares sit in a row that isn't full width. */
  align?: "start" | "center";
  /** Whether the grid is on screen; the current question is scrolled to the middle each time it turns true. */
  open?: boolean;
  /** A change scrolls back to the top (e.g. the filters behind `ids`). */
  resetKey?: string;
}) {
  const [cols, setCols] = useState(12);
  const [view, setView] = useState({ top: 0, h: 320 });
  const [tip, setTip] = useState<{ i: number; x: number; y: number; w: number } | null>(null);
  // A card left over from before the grid was hidden mustn't show up again on reopening.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setTip(null);
  }
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  // Roving tab stop (index in `ids`) and the square an arrow key is about to focus (it may only be drawn after the scroll).
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const pending = useRef<number | null>(null);

  // Squares per row: as many as fit in the scroller (32 = its horizontal padding).
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setCols(clamp(Math.floor((el.clientWidth - 32 + 6) / PITCH), 1, Math.max(1, ids.length)));
      setView((v) => (v.h === el.clientHeight ? v : { ...v, h: el.clientHeight }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ids.length]);

  const rows = Math.ceil(ids.length / cols);
  const height = Math.max(0, rows * PITCH - 6);

  useLayoutEffect(() => {
    if (resetKey !== undefined && scroller.current) scroller.current.scrollTop = 0;
  }, [resetKey]);

  // Opening (and moving on while open) puts the current question's row in the middle.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!open || !el || current === undefined) return;
    el.scrollTop = clamp(Math.floor(current / cols) * PITCH + 16 - el.clientHeight / 2, 0, Math.max(0, el.scrollHeight - el.clientHeight));
  }, [open, current, cols]);

  const firstRow = Math.max(0, Math.floor((view.top - OVERSCAN) / PITCH));
  const lastRow = Math.min(rows, Math.ceil((view.top + view.h + OVERSCAN) / PITCH));
  const tipId = tip ? ids[tip.i] : undefined;
  const tipItem = tipId === undefined ? undefined : items.get(tipId);
  const drawn = (i: number) => i >= firstRow * cols && i < lastRow * cols;
  const stop = focusIdx !== null && drawn(focusIdx) ? focusIdx : current !== undefined && drawn(current) ? current : Math.min(ids.length - 1, (view.top / PITCH) * cols);

  // Focus the square an arrow key moved to, as soon as it is drawn.
  useLayoutEffect(() => {
    if (pending.current === null) return;
    const sq = scroller.current?.querySelector<HTMLElement>(`[data-i="${pending.current}"]`);
    if (!sq) return;
    pending.current = null;
    sq.focus({ preventScroll: true });
  });

  const onKey = (e: React.KeyboardEvent) => {
    const sq = (e.target as Element).closest<HTMLElement>("[data-i]");
    const el = scroller.current;
    if (!sq || !el || e.ctrlKey || e.metaKey || e.altKey) return;
    const i = Number(sq.dataset.i);
    let to: number;
    if (e.key === "ArrowLeft") to = i - 1;
    else if (e.key === "ArrowRight") to = i + 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = ids.length - 1;
    else if (e.key === "ArrowUp") to = i >= cols ? i - cols : i;
    // The last row may be shorter: ↓ from the row above it lands on its last square.
    else if (e.key === "ArrowDown") to = Math.floor(i / cols) + 1 < rows ? Math.min(i + cols, ids.length - 1) : i;
    else return;
    // SolveView listens for the arrows on window.
    e.preventDefault();
    e.stopPropagation();
    to = clamp(to, 0, ids.length - 1);
    if (to === i) return;
    // Bring its row into view.
    const top = Math.floor(to / cols) * PITCH;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (top + 32 + 4 > el.scrollTop + el.clientHeight) el.scrollTop = top + 32 + 4 - el.clientHeight;
    pending.current = to;
    setFocusIdx(to);
  };

  const onOver = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const sq = (e.target as Element).closest<HTMLElement>("[data-i]");
    const rr = root.current?.getBoundingClientRect();
    if (!sq || !rr) return setTip(null);
    const i = Number(sq.dataset.i);
    const r = sq.getBoundingClientRect();
    setTip((t) => (t?.i === i ? t : { i, x: r.left + r.width / 2 - rr.left, y: r.top - rr.top, w: rr.width }));
  };

  return (
    <div ref={root} className="relative">
      <div
        ref={scroller}
        role="group"
        aria-label={label}
        className="relative overflow-y-auto overscroll-contain px-4 pt-1 pb-4 [scrollbar-width:thin]"
        style={{ maxHeight }}
        onScroll={(e) => {
          // Quantised, so a render happens once per row scrolled, not per pixel.
          const top = Math.floor(e.currentTarget.scrollTop / PITCH) * PITCH;
          setView((v) => (v.top === top ? v : { ...v, top }));
          setTip(null);
        }}
        onPointerOver={onOver}
        onPointerLeave={() => setTip(null)}
        onKeyDown={onKey}
        onFocus={(e) => {
          const sq = (e.target as Element).closest<HTMLElement>("[data-i]");
          if (sq) setFocusIdx(Number(sq.dataset.i));
        }}
      >
        <div className="relative" style={{ height }}>
          {Array.from({ length: lastRow - firstRow }, (_, r) => {
            const row = firstRow + r;
            return (
              <div key={row} className={`absolute inset-x-0 grid gap-1.5 ${align === "start" ? "justify-start" : "justify-center"}`} style={{ top: row * PITCH, gridTemplateColumns: `repeat(${cols}, 2rem)` }}>
                {ids.slice(row * cols, row * cols + cols).map((x, k) => {
                  const i = row * cols + k;
                  const correct = tone(x);
                  const it = items.get(x);
                  const isCurrent = i === current;
                  const text =
                    [`Question ${i + 1}`, it && `#${it.n}`, it?.difficulty, it && skillName(it)].filter(Boolean).join(", ") +
                    (correct === undefined ? (prior?.(x) === undefined ? "" : prior(x) ? ", previously correct" : ", previously incorrect") : correct ? ", correct" : ", incorrect") +
                    (bookmarks.has(x) ? ", bookmarked" : "");
                  return (
                    <button
                      key={x}
                      type="button"
                      data-i={i}
                      tabIndex={i === stop ? 0 : -1}
                      onMouseDown={keepFocus}
                      onClick={() => onPick(i)}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={text}
                      className={`relative h-8 w-8 rounded-lg border font-semibold tabular-nums transition-colors ${i >= 999 ? "text-[11px]" : "text-xs"} ${answerTone(correct)} ${
                        isCurrent ? `ring-2 ring-primary ring-offset-1 ring-offset-surface ${correct === undefined ? "text-ink!" : ""}` : ""
                      }`}
                    >
                      {i + 1}
                      {bookmarks.has(x) && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {tip && tipId !== undefined && tipItem && (
        <div
          className="pointer-events-none absolute z-50 flex -translate-x-1/2 -translate-y-full flex-col gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-left text-xs whitespace-nowrap shadow-lg transition-[opacity,scale] duration-150 starting:scale-95 starting:opacity-0"
          style={{ left: tip.w < 272 ? tip.w / 2 : clamp(tip.x, 136, tip.w - 136), top: tip.y - 8 }}
          aria-hidden="true"
        >
          <span className="flex items-center gap-2">
            <DifficultyBadge d={tipItem.difficulty as Difficulty} />
            <span className="font-mono text-ink">#{tipItem.n}</span>
          </span>
          <span className="font-medium text-ink">{skillName(tipItem)}</span>
          {(() => {
            const now = tone(tipId);
            const ok = now ?? prior?.(tipId);
            const text = ok === undefined ? "Not solved yet" : `${now === undefined ? "Previously " : ""}${ok ? (now === undefined ? "correct" : "Correct") : now === undefined ? "incorrect" : "Incorrect"}`;
            return (
              <span className={`inline-flex items-center gap-1.5 font-medium ${ok === undefined ? "text-muted" : ok ? "text-success" : "text-danger"}`}>
                {ok !== undefined && <Icon d={ok ? I.check : I.x} className="h-3.5 w-3.5" strokeWidth={2.6} />}
                {text}
              </span>
            );
          })()}
        </div>
      )}
    </div>
  );
}
