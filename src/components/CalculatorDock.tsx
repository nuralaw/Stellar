"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Calculator } from "@/components/Calculator";
import { I, Icon } from "@/components/bank/icons";

// Resizable Desmos panel. Desktop: docked left, drag the right edge (or use − / +) to change its width,
// or maximize it to fill the content area. Mobile: bottom sheet, drag the grab bar to change its height.
// The size is remembered in this browser.

const KEY = "stellar:calc-size";
const MIN_W = 300;
const MIN_H = 25; // % of the viewport height (mobile)
const MAX_H = 90;
const STEP_W = 120;
const DEFAULT = { w: 440, h: 50 };

function loadSize(): { w: number; h: number } {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (s && typeof s.w === "number" && typeof s.h === "number") return s;
  } catch {}
  return DEFAULT;
}

const clampH = (h: number) => Math.min(MAX_H, Math.max(MIN_H, Math.round(h)));

/**
 * Wraps the question area. `used` mounts the calculator (kept mounted afterwards so expressions survive),
 * `open` shows it. Bottom action bars inside `children` should carry the `qc-actions` class so they sit above the
 * mobile sheet. `stickyClass` sets the desktop top offset / height to fit the page's toolbar.
 */
export function CalculatorDock({
  used,
  open,
  onClose,
  stickyClass,
  children,
}: {
  used: boolean;
  open: boolean;
  onClose: () => void;
  stickyClass: string;
  children: ReactNode;
}) {
  // The size only shows once the calculator is opened (never during SSR/hydration), so reading storage here is safe.
  const [size, setSize] = useState(() => (typeof window === "undefined" ? DEFAULT : loadSize()));
  const [max, setMax] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const aside = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(size));
    } catch {}
  }, [size]);

  const maxW = () => Math.max(MIN_W, (wrap.current?.clientWidth ?? 1200) - 320);
  const clampW = (w: number) => Math.min(maxW(), Math.max(MIN_W, Math.round(w)));

  // Desktop: drag the right edge.
  const startWidthDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    const left = aside.current?.getBoundingClientRect().left ?? 0;
    setMax(false);
    setDragging(true);
    const move = (ev: PointerEvent) => setSize((s) => ({ ...s, w: clampW(ev.clientX - left) }));
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // Mobile: drag the grab bar.
  const startHeightDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    const move = (ev: PointerEvent) => setSize((s) => ({ ...s, h: clampH(((window.innerHeight - ev.clientY) / window.innerHeight) * 100) }));
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const show = used && open;
  // Maximized: as wide as possible while leaving a readable column for the question.
  const w = max ? "calc(100% - 340px)" : `${size.w}px`;

  return (
    <div
      ref={wrap}
      style={show ? ({ "--calc-w": w, "--calc-h": `${size.h}dvh` } as React.CSSProperties) : undefined}
      className={show ? `lg:grid lg:items-start lg:gap-6 lg:grid-cols-[var(--calc-w)_minmax(0,1fr)] ${dragging ? "select-none" : ""}` : ""}
    >
      {used && (
        <aside
          ref={aside}
          aria-label="Desmos graphing calculator"
          className={
            show
              ? `fixed inset-x-0 bottom-0 z-40 flex h-[var(--calc-h)] flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-2xl lg:inset-auto lg:z-auto lg:mt-5 lg:rounded-2xl lg:shadow-none ${stickyClass} lg:sticky`
              : "hidden"
          }
        >
          {/* Mobile grab bar */}
          <div
            onPointerDown={startHeightDrag}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Drag to resize the calculator"
            className="flex h-4 shrink-0 cursor-ns-resize touch-none items-center justify-center lg:hidden"
          >
            <span className="h-1 w-10 rounded-full bg-line" />
          </div>
          <div className="flex shrink-0 items-center justify-between border-b border-line px-3 pb-2 lg:pt-2">
            <p className="flex items-center gap-2 pl-1 text-sm font-semibold">
              <Icon d={I.calculator} className="h-4 w-4 text-muted" /> Desmos Calculator
            </p>
            <div className="flex items-center gap-0.5">
              {/* − / + : width on desktop, height on mobile */}
              <button
                type="button"
                onClick={() => {
                  setMax(false);
                  setSize((s) => ({ w: clampW(s.w - STEP_W), h: clampH(s.h - 15) }));
                }}
                aria-label="Make calculator smaller"
                title="Smaller"
                className="grid h-8 w-8 place-items-center rounded-lg text-lg leading-none font-semibold text-muted hover:bg-surface-2 hover:text-ink"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => {
                  setMax(false);
                  setSize((s) => ({ w: clampW(s.w + STEP_W), h: clampH(s.h + 15) }));
                }}
                aria-label="Make calculator bigger"
                title="Bigger"
                className="grid h-8 w-8 place-items-center rounded-lg text-lg leading-none font-semibold text-muted hover:bg-surface-2 hover:text-ink"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setMax((v) => !v)}
                aria-pressed={max}
                aria-label={max ? "Restore calculator size" : "Maximize calculator"}
                title={max ? "Restore" : "Maximize"}
                className="hidden h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink lg:grid"
              >
                <Icon d={max ? I.shrink : I.expand} className="h-4 w-4" />
              </button>
              <button type="button" onClick={onClose} aria-label="Close calculator" title="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink">
                <Icon d={I.x} className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className={`min-h-0 flex-1 ${dragging ? "pointer-events-none" : ""}`}>
            <Calculator visible={show} />
          </div>
          {/* Desktop drag handle on the right edge */}
          {!max && (
            <div
              onPointerDown={startWidthDrag}
              onDoubleClick={() => setSize((s) => ({ ...s, w: DEFAULT.w }))}
              role="separator"
              aria-orientation="vertical"
              aria-label="Drag to resize the calculator"
              title="Drag to resize · double-click to reset"
              className="group absolute inset-y-0 right-0 hidden w-3 cursor-ew-resize touch-none items-center justify-center lg:flex"
            >
              <span className={`h-12 w-1 rounded-full transition-colors ${dragging ? "bg-primary" : "bg-line group-hover:bg-primary/60"}`} />
            </div>
          )}
        </aside>
      )}

      <div
        className={`min-w-0 ${
          show
            ? `pb-[var(--calc-h)] max-lg:[&_.qc-actions]:bottom-[var(--calc-h)] lg:pb-0 lg:[&_.qc-actions]:mx-0 lg:[&_.qc-actions]:px-0`
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
