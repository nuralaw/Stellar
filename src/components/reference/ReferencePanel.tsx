"use client";

import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { I, Icon } from "@/components/bank/icons";
import { Tex } from "@/components/lessons/Markdown";

// The formulas the Digital SAT gives you on every math question, with our own small drawings.
// Desktop (>= 640px): a floating, non-modal window that can be dragged by its header. Phone: a bottom sheet.

/** Viewport width from which the panel is a floating window instead of a bottom sheet. */
const WIDE_QUERY = "(min-width: 640px)";
const PANEL_W = 600;
const MARGIN = 16;
/** Dragging never leaves less than this much of the window above the bottom edge of the viewport. */
const MIN_VISIBLE = 200;

function clampPos(x: number, y: number, w: number) {
  return {
    x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - w)),
    y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - MIN_VISIBLE)),
  };
}

export function ReferencePanel({ id, top, focusFirst, onClose }: { id: string; top: number; focusFirst: boolean; onClose: (keyboard: boolean) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const [sheet, setSheet] = useState(() => !window.matchMedia(WIDE_QUERY).matches);
  const [dragging, setDragging] = useState(false);
  // Opens at the top right, under the header; a new opening starts here again (the panel is mounted per opening).
  const [pos, setPos] = useState(() => {
    const w = Math.min(PANEL_W, window.innerWidth - MARGIN);
    return clampPos(window.innerWidth - w - MARGIN, top, w);
  });

  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const onMq = () => setSheet(!mq.matches);
    const onResize = () => setPos((p) => clampPos(p.x, p.y, root.current?.offsetWidth ?? PANEL_W));
    mq.addEventListener("change", onMq);
    window.addEventListener("resize", onResize);
    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Opened from the keyboard: move into the panel (the close button). A mouse/touch opening leaves the focus where it was.
  useEffect(() => {
    if (focusFirst) closeBtn.current?.focus();
  }, [focusFirst]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (sheet || e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d) setPos(clampPos(e.clientX - d.dx, e.clientY - d.dy, root.current?.offsetWidth ?? PANEL_W));
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  // Esc with the focus in the panel closes it and gives the focus back to the button.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Escape") return;
    e.stopPropagation();
    onClose(true);
  };
  // Esc anywhere else (after a mouse opening, after a drag): closes it without moving the focus.
  const onDocKey = useEffectEvent((e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape" && !e.defaultPrevented) onClose(false);
  });
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => onDocKey(e);
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return createPortal(
    <div
      ref={root}
      id={id}
      data-reference
      role="dialog"
      aria-label="Reference Sheet"
      onKeyDown={onKey}
      style={
        sheet
          ? undefined
          : { left: pos.x, top: pos.y, width: `min(${PANEL_W}px, calc(100vw - ${MARGIN}px))`, maxHeight: `calc(100dvh - ${pos.y}px - 0.5rem)` }
      }
      className={`fixed z-[42] lg:z-[18] flex flex-col overflow-hidden border border-line bg-surface text-ink shadow-2xl ${
        sheet ? "inset-x-0 bottom-0 max-h-[75dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]" : "rounded-2xl"
      }`}
    >
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`flex shrink-0 touch-none items-center justify-between border-b border-line px-3 py-2 select-none ${sheet ? "" : dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <p className="flex items-center gap-2 pl-1 text-sm font-semibold">
          <Icon d={I.formula} className="h-4 w-4 text-muted" />
          Reference Sheet
        </p>
        <button ref={closeBtn} type="button" onClick={(e) => onClose(e.detail === 0)} onMouseDown={(e) => e.preventDefault()} aria-label="Close reference sheet" title="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink">
          <Icon d={I.x} className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] sm:p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <Tile title="Circle" label="Circle with radius r" figure={<CircleFig />} formulas={["A = \\pi r^2", "C = 2\\pi r"]} />
          <Tile title="Rectangle" label="Rectangle with length ℓ and width w" figure={<RectangleFig />} formulas={["A = \\ell w"]} />
          <Tile title="Triangle" label="Triangle with base b and height h" figure={<TriangleFig />} formulas={["A = \\frac{1}{2}bh"]} />
          <Tile title="Right triangle" label="Right triangle with legs a and b and hypotenuse c" figure={<RightTriangleFig />} formulas={["c^2 = a^2 + b^2"]} />
          <Tile
            title="30°-60°-90° triangle"
            label="Right triangle with angles 30, 60 and 90 degrees. The side opposite the 30 degree angle is x, the other leg is x times the square root of 3, the hypotenuse is 2x."
            figure={<Special3060Fig />}
          />
          <Tile
            title="45°-45°-90° triangle"
            label="Right triangle with angles 45, 45 and 90 degrees. The legs are both s, the hypotenuse is s times the square root of 2."
            figure={<Special4545Fig />}
          />
          <Tile title="Box" label="Rectangular box with length ℓ, width w and height h" figure={<BoxFig />} formulas={["V = \\ell w h"]} />
          <Tile title="Cylinder" label="Cylinder with radius r and height h" figure={<CylinderFig />} formulas={["V = \\pi r^2 h"]} />
          <Tile title="Sphere" label="Sphere with radius r" figure={<SphereFig />} formulas={["V = \\frac{4}{3}\\pi r^3"]} />
          <Tile title="Cone" label="Cone with radius r and height h" figure={<ConeFig />} formulas={["V = \\frac{1}{3}\\pi r^2 h"]} />
          <Tile title="Pyramid" label="Pyramid with a rectangular base of length ℓ and width w, and height h" figure={<PyramidFig />} formulas={["V = \\frac{1}{3}\\ell w h"]} />
        </div>
        <ul className="mt-3 list-disc space-y-1 rounded-xl border border-line bg-surface-2 py-3 pr-4 pl-8 text-sm">
          <li>A full circle has 360° of arc.</li>
          <li>
            A full circle has <Tex tex="2\pi" /> radians of arc.
          </li>
          <li>The angles of a triangle add up to 180°.</li>
        </ul>
      </div>
    </div>,
    document.body,
  );
}

function Tile({ title, label, figure, formulas = [] }: { title: string; label: string; figure: ReactNode; formulas?: string[] }) {
  return (
    <figure className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-surface-2 p-2.5 text-center">
      <figcaption className="text-xs font-semibold text-muted">{title}</figcaption>
      <svg viewBox="0 0 120 80" role="img" aria-label={label} className="h-20 w-full max-w-36 text-ink">
        {figure}
      </svg>
      {formulas.map((f) => (
        <div key={f} className="text-[0.95rem]">
          <Tex tex={f} />
        </div>
      ))}
    </figure>
  );
}

/* ---------------- figures (viewBox 0 0 120 80) ---------------- */

const SOLID = "fill-primary-soft stroke-ink";
const LINE = "fill-none stroke-ink";
const HIDDEN = "fill-none stroke-muted";
const DASH = "3 2.5";

function L({ x, y, anchor = "middle", children }: { x: number; y: number; anchor?: "start" | "middle" | "end"; children: ReactNode }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="10.5" fontStyle="italic" className="fill-ink">
      {children}
    </text>
  );
}
function Angle({ x, y, anchor = "start", children }: { x: number; y: number; anchor?: "start" | "middle" | "end"; children: ReactNode }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="8" className="fill-muted">
      {children}
    </text>
  );
}

function CircleFig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="40" r="30" className={SOLID} />
      <path d="M60 40H90" className={LINE} />
      <circle cx="60" cy="40" r="1.8" className="fill-ink" />
      <L x={75} y={35}>r</L>
    </g>
  );
}

function RectangleFig() {
  return (
    <g strokeWidth="1.6" strokeLinejoin="round">
      <rect x="18" y="14" width="84" height="48" className={SOLID} />
      <L x={60} y={76}>ℓ</L>
      <L x={110} y={42}>w</L>
    </g>
  );
}

function TriangleFig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 66H98L68 12Z" className={SOLID} />
      <path d="M68 12V66" className={HIDDEN} strokeDasharray={DASH} />
      <path d="M62 66V60H68" className={LINE} strokeWidth="1.2" />
      <L x={56} y={77}>b</L>
      <L x={73} y={42} anchor="start">h</L>
    </g>
  );
}

function RightTriangleFig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 66H100L24 14Z" className={SOLID} />
      <path d="M31 66V59H24" className={LINE} strokeWidth="1.2" />
      <L x={14} y={43}>a</L>
      <L x={62} y={77}>b</L>
      <L x={68} y={34}>c</L>
    </g>
  );
}

function Special3060Fig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 66H96V19Z" className={SOLID} />
      <path d="M89 66V59H96" className={LINE} strokeWidth="1.2" />
      <L x={55} y={77}>x√3</L>
      <L x={104} y={46} anchor="start">x</L>
      <L x={47} y={36}>2x</L>
      <Angle x={34} y={63}>30°</Angle>
      <Angle x={92} y={40} anchor="end">60°</Angle>
    </g>
  );
}

function Special4545Fig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 66H80L24 10Z" className={SOLID} />
      <path d="M31 66V59H24" className={LINE} strokeWidth="1.2" />
      <L x={14} y={41}>s</L>
      <L x={52} y={77}>s</L>
      <L x={58} y={33} anchor="start">s√2</L>
      <Angle x={66} y={64} anchor="end">45°</Angle>
      <Angle x={30} y={40}>45°</Angle>
    </g>
  );
}

function BoxFig() {
  return (
    <g strokeWidth="1.6" strokeLinejoin="round">
      <path d="M14 32L32 16H94L76 32Z" className={SOLID} />
      <path d="M76 32L94 16V52L76 68Z" className={SOLID} />
      <rect x="14" y="32" width="62" height="36" className={SOLID} />
      <L x={45} y={77}>ℓ</L>
      <L x={7} y={53}>h</L>
      <L x={19} y={19} anchor="end">w</L>
    </g>
  );
}

function CylinderFig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 16V62A30 8 0 0 0 90 62V16" className={SOLID} />
      <ellipse cx="60" cy="16" rx="30" ry="8" className={SOLID} />
      <path d="M30 62A30 8 0 0 1 90 62" className={HIDDEN} strokeDasharray={DASH} />
      <path d="M60 16V62H90" className={HIDDEN} strokeDasharray={DASH} />
      <L x={65} y={38} anchor="start">h</L>
      <L x={76} y={51}>r</L>
    </g>
  );
}

function SphereFig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="40" r="30" className={SOLID} />
      <path d="M30 40A30 9 0 0 0 90 40" className={LINE} strokeWidth="1.2" />
      <path d="M30 40A30 9 0 0 1 90 40" className={HIDDEN} strokeWidth="1.2" strokeDasharray={DASH} />
      <path d="M60 40V10" className={LINE} />
      <circle cx="60" cy="40" r="1.8" className="fill-ink" />
      <L x={65} y={26} anchor="start">r</L>
    </g>
  );
}

function ConeFig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 8L30 62A30 8 0 0 0 90 62Z" className={SOLID} />
      <path d="M30 62A30 8 0 0 1 90 62" className={HIDDEN} strokeDasharray={DASH} />
      <path d="M60 8V62H90" className={HIDDEN} strokeDasharray={DASH} />
      <L x={65} y={38} anchor="start">h</L>
      <L x={76} y={51}>r</L>
    </g>
  );
}

function PyramidFig() {
  return (
    <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M59 6L6 62H86L112 44Z" className={SOLID} />
      <path d="M59 6L86 62" className={LINE} />
      <path d="M59 6L32 44M32 44L6 62M32 44H112" className={HIDDEN} strokeDasharray={DASH} />
      <path d="M59 6V53" className={LINE} strokeWidth="1.3" strokeDasharray={DASH} />
      <circle cx="59" cy="53" r="1.6" className="fill-ink" />
      <L x={54} y={32} anchor="end">h</L>
      <L x={46} y={74}>ℓ</L>
      <L x={106} y={65} anchor="start">w</L>
    </g>
  );
}
