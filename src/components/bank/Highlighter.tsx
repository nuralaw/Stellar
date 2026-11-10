"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { I, Icon } from "./icons";

// Bluebook-style highlighting for Reading & Writing: select text in the passage or question, pick a color
// (or underline) in the little toolbar; click a highlight to change or remove it.
//
// Painted with the CSS Custom Highlight API (::highlight in globals.css), so React's DOM is never touched.
// Marks are character offsets inside each highlightable block, kept in memory for this visit (per question).

export type MarkStyle = "yellow" | "blue" | "pink" | "underline";
export interface Mark {
  start: number;
  end: number;
  style: MarkStyle;
}

const STYLES: { id: MarkStyle; label: string; swatch: string }[] = [
  { id: "yellow", label: "Yellow highlight", swatch: "bg-[#fde047]" },
  { id: "blue", label: "Blue highlight", swatch: "bg-[#7dd3fc]" },
  { id: "pink", label: "Pink highlight", swatch: "bg-[#f9a8d4]" },
];

/* ---------------- mark store (in memory, keyed by block) ---------------- */

const marks = new Map<string, Mark[]>();
const listeners = new Set<() => void>();
const NONE: Mark[] = [];

function getMarks(key: string) {
  return marks.get(key) ?? NONE;
}
function setMarks(key: string, list: Mark[]) {
  if (list.length) marks.set(key, list);
  else marks.delete(key);
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Removes [start, end) from every mark, splitting marks that straddle it. */
function cut(list: Mark[], start: number, end: number): Mark[] {
  const out: Mark[] = [];
  for (const m of list) {
    if (m.end <= start || m.start >= end) out.push(m);
    else {
      if (m.start < start) out.push({ ...m, end: start });
      if (m.end > end) out.push({ ...m, start: end });
    }
  }
  return out;
}

/* ---------------- painting ---------------- */

const supported = () => typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined";
/** Ranges of every mounted block, so several blocks (passage + question) paint together. */
const painted = new Map<string, { style: MarkStyle; range: Range }[]>();

function repaint() {
  if (!supported()) return;
  for (const s of ["yellow", "blue", "pink", "underline"] as MarkStyle[]) {
    const ranges = [...painted.values()].flat().filter((p) => p.style === s).map((p) => p.range);
    if (ranges.length) CSS.highlights.set(`hl-${s}`, new Highlight(...ranges));
    else CSS.highlights.delete(`hl-${s}`);
  }
}

/** Character offset of (node, offset) from the start of root. */
function offsetIn(root: Node, node: Node, offset: number) {
  const r = document.createRange();
  r.setStart(root, 0);
  r.setEnd(node, offset);
  return r.toString().length;
}

/** A DOM Range for [start, end) characters of root's text. */
function rangeAt(root: Node, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const r = document.createRange();
  let pos = 0;
  let started = false;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const len = (n as Text).data.length;
    if (!started && start <= pos + len) {
      r.setStart(n, start - pos);
      started = true;
    }
    if (started && end <= pos + len) {
      r.setEnd(n, end - pos);
      return r;
    }
    pos += len;
  }
  return null;
}

/* ---------------- toolbar ---------------- */

interface Pending {
  start: number;
  end: number;
  /** Viewport rect to place the toolbar at. */
  x: number;
  top: number;
  bottom: number;
}

export function Highlightable({ hkey, children, className = "" }: { hkey: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const list = useSyncExternalStore(
    subscribe,
    () => getMarks(hkey),
    () => NONE,
  );
  const [pending, setPending] = useState<Pending | null>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const pressed = useRef(false);

  /** Opens the toolbar for the current selection if it lies inside this block. */
  const fromSelection = () => {
    const root = ref.current;
    const sel = window.getSelection();
    if (!root || !sel || sel.isCollapsed || !sel.rangeCount) return false;
    const r = sel.getRangeAt(0);
    if (!root.contains(r.startContainer) || !root.contains(r.endContainer)) return false;
    const start = offsetIn(root, r.startContainer, r.startOffset);
    const end = offsetIn(root, r.endContainer, r.endOffset);
    if (end <= start) return false;
    const rect = r.getBoundingClientRect();
    setPending({ start, end, x: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom });
    return true;
  };

  // Touch / keyboard selections don't end with a pointerup here: catch them when the selection settles.
  useEffect(() => {
    if (!supported()) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const onChange = () => {
      clearTimeout(t);
      t = setTimeout(() => !pressed.current && fromSelection(), 350);
    };
    const release = () => (pressed.current = false);
    document.addEventListener("selectionchange", onChange);
    document.addEventListener("pointercancel", release);
    return () => {
      clearTimeout(t);
      document.removeEventListener("selectionchange", onChange);
      document.removeEventListener("pointercancel", release);
    };
  }, []);

  // Paint after every render (text may re-render) and when marks change.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    painted.set(
      hkey,
      list.flatMap((m) => {
        const range = rangeAt(root, m.start, m.end);
        return range ? [{ style: m.style, range }] : [];
      }),
    );
    repaint();
  });
  useEffect(
    () => () => {
      painted.delete(hkey);
      repaint();
    },
    [hkey],
  );

  // Close the toolbar on scroll / Escape / a press anywhere outside it.
  useEffect(() => {
    if (!pending) return;
    const close = () => setPending(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => !toolbar.current?.contains(e.target as Node) && close();
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [pending]);

  const onPointerUp = (e: React.PointerEvent) => {
    pressed.current = false;
    const root = ref.current;
    if (!root || !supported()) return;
    // Let the browser finish updating the selection first.
    const { clientX, clientY } = e;
    requestAnimationFrame(() => {
      if (fromSelection()) return;
      // Plain click: on a highlight? Offer to change / remove it.
      const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
      const caret = doc.caretPositionFromPoint?.(clientX, clientY);
      const legacy = !caret ? document.caretRangeFromPoint?.(clientX, clientY) : null;
      const node = caret?.offsetNode ?? legacy?.startContainer;
      const off = caret?.offset ?? legacy?.startOffset ?? 0;
      if (!node || !root.contains(node)) return setPending(null);
      const at = offsetIn(root, node, off);
      const hit = list.find((m) => at >= m.start && at < m.end);
      if (!hit) return setPending(null);
      setPending({ start: hit.start, end: hit.end, x: clientX, top: clientY - 10, bottom: clientY + 10 });
    });
  };

  const apply = (style: MarkStyle | null) => {
    if (!pending) return;
    const rest = cut(list, pending.start, pending.end);
    setMarks(hkey, style ? [...rest, { start: pending.start, end: pending.end, style }].sort((a, b) => a.start - b.start) : rest);
    window.getSelection()?.removeAllRanges();
    setPending(null);
  };

  const overlaps = pending && list.some((m) => m.start < pending.end && m.end > pending.start);
  const above = pending ? pending.top > 70 : true;

  return (
    <>
      <div ref={ref} onPointerDown={() => (pressed.current = true)} onPointerUp={onPointerUp} className={className}>
        {children}
      </div>
      {pending && (
          <div
            ref={toolbar}
            role="toolbar"
            aria-label="Highlight"
            onMouseDown={(e) => e.preventDefault()}
            className="fixed z-50 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-line bg-surface p-1.5 shadow-xl"
            style={{
              left: Math.min(Math.max(pending.x, 110), (typeof window !== "undefined" ? window.innerWidth : 1000) - 110),
              top: above ? pending.top - 52 : pending.bottom + 8,
            }}
          >
            {STYLES.map((s) => (
              <button key={s.id} type="button" onClick={() => apply(s.id)} title={s.label} aria-label={s.label} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-2">
                <span className={`h-5 w-5 rounded-full border border-black/10 ${s.swatch}`} />
              </button>
            ))}
            <button type="button" onClick={() => apply("underline")} title="Underline" aria-label="Underline" className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold underline decoration-2 underline-offset-2 hover:bg-surface-2">
              U
            </button>
            {overlaps && (
              <>
                <span className="mx-0.5 h-5 w-px bg-line" aria-hidden="true" />
                <button type="button" onClick={() => apply(null)} title="Remove highlight" aria-label="Remove highlight" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-danger">
                  <Icon d={I.x} className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </>
            )}
          </div>
      )}
    </>
  );
}

/** Whether highlighting works in this browser (for showing the hint). */
export function useHighlightSupported() {
  return useSyncExternalStore(
    () => () => {},
    supported,
    () => false,
  );
}
