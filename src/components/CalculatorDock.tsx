"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Calculator } from "@/components/Calculator";
import { I, Icon } from "@/components/bank/icons";

// Resizable Desmos panel, remembered in this browser.
//  Desktop: docked left. Drag the right edge (width), the bottom edge (height) or the corner (both);
//           − / + change both; maximize fills the area next to a narrow question column. Double-click a handle to reset.
//  Mobile:  bottom sheet. Drag the grab bar (height); − / + change the height.

const KEY = "stellar:calc-size";
const MIN_W = 300;
const MIN_DH = 320; // desktop height, px
const MIN_H = 25; // mobile sheet height, % of the viewport
const MAX_H = 90;
const STEP_W = 120;
const STEP_DH = 100;
const STEP_H = 15;

interface Size {
  /** Desktop width, px. */
  w: number;
  /** Desktop height, px; null = as tall as the page allows. */
  dh: number | null;
  /** Mobile sheet height, % of viewport. */
  h: number;
}
const DEFAULT: Size = { w: 440, dh: null, h: 50 };

function loadSize(): Size {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (s && typeof s.w === "number" && typeof s.h === "number") return { w: s.w, h: s.h, dh: typeof s.dh === "number" ? s.dh : null };
  } catch {}
  return DEFAULT;
}

const clampH = (h: number) => Math.min(MAX_H, Math.max(MIN_H, Math.round(h)));
const clampW = (w: number, max: number) => Math.min(max, Math.max(MIN_W, Math.round(w)));
/** Desktop height; dragging to (nearly) the limit means "full height" again (null). */
const clampDH = (h: number, max: number) => {
  const v = Math.min(max, Math.max(MIN_DH, Math.round(h)));
  return v >= max - 4 ? null : v;
};

type Axis = "x" | "y" | "xy";

/**
 * Wraps the question area. `used` mounts the calculator (kept mounted afterwards so expressions survive),
 * `open` shows it. Bottom action bars inside `children` should carry the `qc-actions` class so they sit above the
 * mobile sheet. `stickyClass` sets the desktop top offset (e.g. "lg:top-28"); `fullHeight` is the tallest the panel
 * can be on desktop (a CSS length, e.g. "calc(100vh - 8.5rem)").
 */
export function CalculatorDock({
  used,
  open,
  onClose,
  stickyClass,
  fullHeight,
  children,
}: {
  used: boolean;
  open: boolean;
  onClose: () => void;
  stickyClass: string;
  fullHeight: string;
  children: ReactNode;
}) {
  // The size only shows once the calculator is opened (never during SSR/hydration), so reading storage here is safe.
  const [size, setSize] = useState<Size>(() => (typeof window === "undefined" ? DEFAULT : loadSize()));
  const [max, setMax] = useState(false);
  const [dragging, setDragging] = useState<Axis | "sheet" | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const aside = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(size));
    } catch {}
  }, [size]);

  /** Current limits and panel box, measured in event handlers. */
  const measure = () => {
    const rect = aside.current?.getBoundingClientRect();
    return {
      rect,
      maxW: Math.max(MIN_W, (wrap.current?.clientWidth ?? 1200) - 320),
      maxDH: Math.max(MIN_DH, window.innerHeight - Math.max(0, rect?.top ?? 0) - 16),
    };
  };

  const listen = (move: (ev: PointerEvent) => void) => {
    const up = () => {
      setDragging(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // Desktop: right edge (x), bottom edge (y), corner (xy).
  const startDrag = (axis: Axis, e: React.PointerEvent) => {
    e.preventDefault();
    const { rect, maxW, maxDH } = measure();
    if (!rect) return;
    setMax(false);
    setDragging(axis);
    listen((ev) => {
      const patch: Partial<Size> = {};
      if (axis !== "y") patch.w = clampW(ev.clientX - rect.left, maxW);
      if (axis !== "x") patch.dh = clampDH(ev.clientY - rect.top, maxDH);
      setSize((s) => ({ ...s, ...patch }));
    });
  };

  // Mobile: grab bar on top of the sheet.
  const startSheetDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging("sheet");
    listen((ev) => setSize((s) => ({ ...s, h: clampH(((window.innerHeight - ev.clientY) / window.innerHeight) * 100) })));
  };

  const resizeBy = (dir: 1 | -1) => {
    const { rect, maxW, maxDH } = measure();
    const dh = size.dh ?? Math.round(rect?.height ?? maxDH);
    setMax(false);
    setSize({ w: clampW(size.w + dir * STEP_W, maxW), dh: clampDH(dh + dir * STEP_DH, maxDH), h: clampH(size.h + dir * STEP_H) });
  };

  const show = used && open;
  // Maximized: as wide and tall as possible while leaving a readable column for the question.
  const w = max ? "calc(100% - 340px)" : `${size.w}px`;
  const dh = max || size.dh === null ? fullHeight : `min(${size.dh}px, ${fullHeight})`;
  const handle = (on: boolean) => `rounded-full transition-colors ${on ? "bg-primary" : "bg-line group-hover:bg-primary/60"}`;

  return (
    <div
      ref={wrap}
      style={show ? ({ "--calc-w": w, "--calc-h": `${size.h}dvh`, "--calc-dh": dh } as React.CSSProperties) : undefined}
      className={
        show
          ? `lg:grid lg:items-start lg:gap-6 lg:grid-cols-[var(--calc-w)_minmax(0,1fr)] ${dragging ? `select-none ${dragging === "x" ? "cursor-ew-resize" : dragging === "xy" ? "cursor-nwse-resize" : "cursor-ns-resize"}` : ""}`
          : ""
      }
    >
      {used && (
        <aside
          ref={aside}
          aria-label="Desmos graphing calculator"
          className={
            show
              ? `fixed inset-x-0 bottom-0 z-40 flex h-[var(--calc-h)] flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-2xl lg:sticky lg:inset-auto lg:z-auto lg:mt-5 lg:h-[var(--calc-dh)] lg:rounded-2xl lg:shadow-none ${stickyClass}`
              : "hidden"
          }
        >
          {/* Mobile grab bar */}
          <div
            onPointerDown={startSheetDrag}
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
              <button
                type="button"
                onClick={() => resizeBy(-1)}
                aria-label="Make calculator smaller"
                title="Smaller"
                className="grid h-8 w-8 place-items-center rounded-lg text-lg leading-none font-semibold text-muted hover:bg-surface-2 hover:text-ink"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => resizeBy(1)}
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

          {/* Desktop resize handles: right edge (width), bottom edge (height), corner (both) */}
          {!max && (
            <>
              <div
                onPointerDown={(e) => startDrag("x", e)}
                onDoubleClick={() => setSize((s) => ({ ...s, w: DEFAULT.w }))}
                role="separator"
                aria-orientation="vertical"
                aria-label="Drag to change the calculator width"
                title="Drag to change width · double-click to reset"
                className="group absolute top-12 right-0 bottom-4 hidden w-3 cursor-ew-resize touch-none items-center justify-center lg:flex"
              >
                <span className={`h-12 w-1 ${handle(dragging === "x")}`} />
              </div>
              <div
                onPointerDown={(e) => startDrag("y", e)}
                onDoubleClick={() => setSize((s) => ({ ...s, dh: null }))}
                role="separator"
                aria-orientation="horizontal"
                aria-label="Drag to change the calculator height"
                title="Drag to change height · double-click to reset"
                className="group absolute right-4 bottom-0 left-0 hidden h-3 cursor-ns-resize touch-none items-center justify-center lg:flex"
              >
                <span className={`h-1 w-12 ${handle(dragging === "y")}`} />
              </div>
              <div
                onPointerDown={(e) => startDrag("xy", e)}
                onDoubleClick={() => setSize((s) => ({ ...s, w: DEFAULT.w, dh: null }))}
                aria-hidden="true"
                title="Drag to resize · double-click to reset"
                className="group absolute right-0 bottom-0 hidden h-4 w-4 cursor-nwse-resize touch-none lg:block"
              >
                <svg viewBox="0 0 16 16" className={`h-4 w-4 transition-colors ${dragging === "xy" ? "text-primary" : "text-muted/60 group-hover:text-primary"}`}>
                  <path d="M14 6 6 14M14 10l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </>
          )}
        </aside>
      )}

      <div
        className={`min-w-0 ${
          show ? "pb-[var(--calc-h)] max-lg:[&_.qc-actions]:bottom-[var(--calc-h)] lg:pb-0 lg:[&_.qc-actions]:mx-0 lg:[&_.qc-actions]:px-0" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
