"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import "./v2.css";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40";
export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors outline-none hover:bg-surface-2 hover:text-ink focus-visible:ring-3 focus-visible:ring-primary/30 disabled:opacity-40 disabled:hover:bg-transparent";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors outline-none hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-primary/30";
/** A small secondary button (Not sure?, Next hint, Still confused?, See why). */
export const btnSoft =
  "inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink transition-colors outline-none hover:border-primary/50 hover:bg-primary-soft/40 focus-visible:ring-3 focus-visible:ring-primary/30 aria-expanded:border-primary aria-expanded:bg-primary-soft aria-expanded:text-primary-strong";

/**
 * The island every Learn and Task screen sits in. Wide (the island itself ≥ 56rem, a container query, so a docked
 * calculator makes it stack sooner): a fixed height that fits the window under the top bar, so the page doesn't scroll;
 * two columns (`left`, `main`) that scroll inside (see Pane), and the arrows in a footer row at the bottom-right.
 * Stacked: ordinary page scrolling, arrows at the bottom-right of the card.
 */
export function LessonIsland({ left, main, nav, split = "40" }: { left: ReactNode; main: ReactNode; nav: ReactNode; split?: "40" | "50" }) {
  return (
    <div className="@container">
      <div className="lesson-cover flex flex-col gap-6 rounded-3xl bg-surface p-4 shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)] ring-1 ring-line sm:p-6 md:p-8 @[56rem]:h-[calc(100dvh-11.5rem)] @[56rem]:min-h-[28rem]">
        <div className={`grid gap-x-8 gap-y-6 @[56rem]:min-h-0 @[56rem]:flex-1 @[56rem]:grid-rows-1 ${split === "40" ? "@[56rem]:grid-cols-[2fr_3fr]" : "@[56rem]:grid-cols-2"}`}>
          <div className="flex min-h-0 min-w-0 flex-col">{left}</div>
          <div className="flex min-h-0 min-w-0 flex-col">{main}</div>
        </div>
        <div className="flex shrink-0 justify-end">{nav}</div>
      </div>
    </div>
  );
}

/**
 * A column of the island. Wide: its own inner island that scrolls inside (thin scrollbar, a soft fade at the bottom edge
 * while more is below; focusable with a label while it really scrolls, so the arrow/Page keys scroll it and ← / →
 * still reach the lesson). Stacked: plain content in the page flow.
 */
export function Pane({ label, children }: { label: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      setScrollable(el.scrollHeight > el.clientHeight + 1);
      setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    };
    // Starts with a first call; fires again when the pane or its content changes size (a theory island opens, hints appear).
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, []);

  return (
    <div
      ref={box}
      data-pane=""
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? "region" : undefined}
      aria-label={scrollable ? label : undefined}
      className={`v2-scroll relative min-h-0 outline-none@[56rem]:flex-1 @[56rem]:overflow-y-auto @[56rem]:rounded-2xl @[56rem]:bg-surface-2/40 @[56rem]:p-5 @[56rem]:ring-1 @[56rem]:ring-line @[56rem]:focus-visible:ring-2 @[56rem]:focus-visible:ring-primary ${more ? "v2-fade" : ""}`}
    >
      <div>{children}</div>
    </div>
  );
}

/** ‹ Back and Next › at the bottom-left of the island. */
export function NavArrows({ onBack, onNext, nextLabel = "Next", primary = false, backLabel = "Back" }: { onBack: () => void; onNext: () => void; nextLabel?: string; primary?: boolean; backLabel?: string }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onBack} className={`${btnOutline} px-4 py-2.5 text-sm`} aria-label={`${backLabel} (left arrow key)`}>
        <Icon d={I.chevronL} className="h-4 w-4" strokeWidth={2.2} />
        {backLabel}
      </button>
      <button type="button" onClick={onNext} className={`${primary ? btnPrimary : btnOutline} px-4 py-2.5 text-sm`} aria-label={`${nextLabel} (right arrow key)`}>
        {nextLabel}
        <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}

/**
 * A pop-in island inside a screen (Theory, Explanation): rendered all the time and `hidden` while closed, so showing it
 * replays the pop animation. Opening moves focus into it; the close button hands it back to `returnTo`.
 */
export function PopIsland({
  id,
  open,
  title,
  onClose,
  children,
  tone = "neutral",
  returnTo,
}: {
  id: string;
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  tone?: "neutral" | "primary";
  returnTo?: React.RefObject<HTMLElement | null>;
}) {
  const box = useRef<HTMLElement>(null);
  const was = useRef(open);
  useEffect(() => {
    if (open && !was.current) {
      box.current?.focus({ preventScroll: true });
      // Inside a scrolling pane: bring it into view there ("start" when it is taller than the pane, so its top is what shows).
      const pane = box.current?.closest<HTMLElement>("[data-pane]");
      const tall = Boolean(pane && box.current && box.current.offsetHeight > pane.clientHeight * 0.85);
      box.current?.scrollIntoView({ block: tall ? "start" : "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    was.current = open;
  }, [open]);

  const close = () => {
    onClose();
    returnTo?.current?.focus();
  };
  return (
    <section
      ref={box}
      id={id}
      hidden={!open}
      tabIndex={-1}
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
        }
      }}
      className={`${open ? "v2-pop" : ""} mt-4 scroll-mb-24 rounded-2xl p-4 ring-1 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-5 ${
        tone === "primary" ? "bg-primary-soft/50 ring-primary/30" : "bg-surface-2/70 ring-line"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold tracking-wide text-primary-strong uppercase">{title}</h2>
        <button type="button" onClick={close} aria-label={`Close ${title.toLowerCase()}`} className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors outline-none hover:bg-surface hover:text-ink focus-visible:ring-3 focus-visible:ring-primary/30">
          <Icon d={I.x} className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/** Keeps a Markdown block's own margins from adding to the island's padding. */
export const TIGHT = "[&>div]:text-[15px] [&>div]:leading-relaxed [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0";
