"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { FOCUS_ON_DARK, PLUS_SURFACE } from "@/components/plus/styles";
import { CarouselSlides, CarouselTimer, useCarousel } from "./carousel";

// Landing page Pricing section and /plus: what Plus adds. Left: a list of benefits (the active one expands and carries the
// autoplay timer); right: a dark preview of it with a Free -> Plus comparison. State machine: ./carousel.

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  adds: string;
  free: string;
  plus: string;
  visual: ReactNode;
}

const INTERVAL_MS = 6000;
/** How long the mouse rests on a list item before it is selected. */
const HOVER_INTENT_MS = 150;

export function PlusShowcase({ benefits }: { benefits: Benefit[] }) {
  const c = useCarousel(benefits.length, { intervalMs: INTERVAL_MS });
  const { cur } = c;

  // Hover intent: the timeout calls the latest `pick`, so it never works from a stale slide index.
  const dwell = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const pickRef = useRef(c.pick);
  useEffect(() => {
    pickRef.current = c.pick;
  });
  useEffect(() => () => clearTimeout(dwell.current), []);

  // Arrow keys on a list button move the selection AND focus (so a screen reader announces the new item).
  const onListKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = benefits.length;
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    e.stopPropagation();
    c.pick(to);
    buttons.current[to]?.focus();
  };

  const slides = benefits.map((b) => ({
    id: b.id,
    label: b.title,
    content: (
      <>
        {/* text-ink: the visuals are light cards, and plus-surface sets a light text colour they'd otherwise inherit. */}
        <div className="mx-auto w-full max-w-md text-ink">{b.visual}</div>
        <div className="mt-3 flex flex-col items-center gap-0.5 text-xs">
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-side-ink/80">Free: {b.free}</span>
          <span aria-hidden="true" className="leading-none text-side-ink/60">
            ↓
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 font-semibold text-primary-ink">
            <Icon d={I.star} filled className="h-3 w-3" />
            Plus: {b.plus}
          </span>
        </div>
      </>
    ),
  }));

  return (
    // `contents`: this wrapper only carries the shared hover / focus / arrow-key handlers; its two children are the parent's grid columns.
    <div className="contents" {...c.root}>
      <ol className="space-y-0.5">
        {benefits.map((b, i) => {
          const active = i === cur;
          return (
            <li key={b.id} className="lesson-in" style={{ animationDelay: `${260 + i * 60}ms` }}>
              <button
                type="button"
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                aria-current={active ? "true" : undefined}
                onClick={() => c.pick(i)}
                onKeyDown={(e) => onListKey(e, i)}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  clearTimeout(dwell.current);
                  dwell.current = setTimeout(() => pickRef.current(i), HOVER_INTENT_MS);
                }}
                onPointerLeave={() => clearTimeout(dwell.current)}
                className={`group relative w-full overflow-hidden rounded-2xl px-3 py-2 text-left transition-colors ${active ? "bg-surface shadow-sm ring-1 ring-line" : "hover:bg-surface/60"}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${active ? "bg-primary text-primary-ink" : "bg-primary/10 text-primary-strong"}`}
                  >
                    <Icon d={b.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-semibold">{b.title}</span>
                </span>
                <span className={`grid transition-[grid-template-rows] duration-300 ease-out ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} aria-hidden={!active}>
                  <span className="block overflow-hidden">
                    <span className="block pt-1 pb-2 pl-10 text-[13px] leading-5 text-muted">{b.adds}</span>
                  </span>
                </span>
                {active && (
                  <span className="absolute inset-x-3 bottom-1 h-0.5 overflow-hidden rounded-full bg-line">
                    <CarouselTimer c={c} className="absolute inset-0 rounded-full bg-primary" />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className={`lesson-cover relative mt-4 rounded-3xl p-4 [animation-delay:250ms] lg:mt-0 ${PLUS_SURFACE}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.14em] text-side-ink/80 uppercase">Plus preview</p>
          {!c.reduced && (
            <button
              type="button"
              onClick={() => c.setPlaying((p) => !p)}
              aria-label={c.playing ? "Pause slideshow" : "Play slideshow"}
              className={`grid h-8 w-8 place-items-center rounded-full border border-white/20 text-side-ink hover:bg-white/10 ${FOCUS_ON_DARK}`}
            >
              {c.playing ? <Icon d="M9 6v12M15 6v12" className="h-4 w-4" /> : <Icon d={I.play} className="h-4 w-4" />}
            </button>
          )}
        </div>
        <CarouselSlides c={c} slides={slides} className="mt-3" />
      </div>
    </div>
  );
}
