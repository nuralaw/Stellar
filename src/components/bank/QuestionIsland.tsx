"use client";

import { useEffect, useRef, useState } from "react";
import type { BankItem } from "./data";
import { QuestionGrid } from "./QuestionGrid";
import { I, Icon } from "./icons";

export { answerTone } from "./QuestionGrid";

const fmt = (n: number) => n.toLocaleString("en-US");

// Buttons here keep focus where it is (QuestionCard ignores Enter while a button is focused) but stay reachable with Tab.
const keepFocus = (e: React.MouseEvent) => e.preventDefault();

/**
 * Bottom "island": a small pill ("Question 5") that slides up a panel with every question of the run on hover (click / tap
 * on touch screens). Place it inside an `@container` (the panel's width is capped to the container).
 */
export function QuestionIsland({
  ids,
  items,
  session,
  prior,
  bookmarks,
  pos,
  go,
}: {
  ids: string[];
  items: Map<string, BankItem>;
  session: Record<string, { correct: boolean }>;
  /** Results from before this session. */
  prior: Map<string, boolean>;
  bookmarks: Set<string>;
  pos: number;
  go: (i: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const close = () => setOpen(false);
  /** Hover opens after a short delay and closes after a longer one, so crossing the gap to the panel doesn't flicker. */
  const later = (to: boolean, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(to), ms);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Outside press and Escape close it (only listened for while open).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && later(true, 80)}
      onPointerLeave={(e) => e.pointerType === "mouse" && later(false, 180)}
    >
      <button
        type="button"
        onMouseDown={keepFocus}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onClick={() => {
          // A mouse click only opens (hover manages closing); touch and keyboard toggle.
          const mouse = pointer.current === "mouse";
          pointer.current = "";
          clearTimeout(timer.current);
          setOpen((o) => mouse || !o);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Question ${pos + 1}, show all questions`}
        className="inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-semibold whitespace-nowrap tabular-nums shadow-lg transition-colors hover:border-muted @2xl:h-9 @2xl:px-4 @2xl:text-sm"
      >
        <Icon d={I.grid} className="h-4 w-4 text-muted" />
        Question {pos + 1}
        <Icon d={I.chevronD} className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {/* The padding is a transparent bridge, so the pointer can go from the pill to the panel without leaving the island. */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 pb-3 transition-[opacity,translate,visibility] duration-200 ease-out motion-reduce:transition-none ${
          open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-4 opacity-0"
        }`}
        style={{ width: `min(36rem, 100cqw, ${Math.max(256, ids.length * 38 + 34)}px)` }}
      >
        <div role="dialog" aria-label="All questions" className="rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-baseline justify-between gap-3 px-4 pt-3 pb-2">
            <p className="text-sm font-semibold">All questions</p>
            <p className="text-xs text-muted tabular-nums">
              {fmt(ids.length)} available · {fmt(Object.keys(session).length)} answered
            </p>
          </div>
          <QuestionGrid
            ids={ids}
            items={items}
            tone={(x) => session[x]?.correct}
            prior={(x) => prior.get(x)}
            bookmarks={bookmarks}
            current={pos}
            onPick={(i) => {
              go(i);
              close();
            }}
            maxHeight="min(18rem, 45dvh)"
            label="Questions"
            open={open}
          />
        </div>
      </div>
    </div>
  );
}
