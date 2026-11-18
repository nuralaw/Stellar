"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

// Shared autoplay carousel logic of the sign-up screen (Features tab and Pricing tab). Every slide is rendered, stacked in
// one grid cell (so the box is as tall as the tallest one); the current one slides in from the right (next) or left (back).
// The CSS animation of <CarouselTimer> IS the autoplay timer: pausing = animation-play-state, and a hidden tab
// (display:none) has no running timer.

export interface CarouselSlide {
  id: string;
  label: string;
  content: ReactNode;
}

const REDUCED = "(prefers-reduced-motion: reduce)";

interface View {
  cur: number;
  prev: number | null;
  dir: 1 | -1;
}

export function useCarousel(n: number, { intervalMs, verticalKeys = false }: { intervalMs: number; verticalKeys?: boolean }) {
  const [view, setView] = useState<View>({ cur: 0, prev: null, dir: 1 });
  const [visits, setVisits] = useState<number[]>(() => Array.from({ length: n }, () => 0));
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const read = () => setReduced(mq.matches);
    const id = requestAnimationFrame(read);
    mq.addEventListener("change", read);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", read);
    };
  }, []);

  // Leaving the tab mid-slide cancels the CSS animation (display:none) and no animationend fires, so also clear `prev` by timer.
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(clearTimer.current), []);

  const { cur, prev, dir } = view;

  const go = (to: number, d: 1 | -1) => {
    if (to === cur) return;
    setView({ cur: to, prev: cur, dir: d });
    clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setView((v) => (v.cur === to ? { ...v, prev: null } : v)), 650);
    setVisits((v) => v.map((x, i) => (i === to ? x + 1 : x)));
  };
  const next = () => go((cur + 1) % n, 1);
  const back = () => go((cur - 1 + n) % n, -1);
  const pick = (i: number) => go(i, i > cur ? 1 : -1);

  const running = playing && !reduced && !hover;

  const root = {
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") setHover(true);
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") setHover(false);
    },
    // Keyboard focus moving INTO the carousel is a real pause: the Play/Pause button then shows "Play" and can resume.
    onFocus: (e: FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null) && (e.target as HTMLElement).matches(":focus-visible")) setPlaying(false);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowRight" || (verticalKeys && e.key === "ArrowDown")) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || (verticalKeys && e.key === "ArrowUp")) {
        e.preventDefault();
        back();
      }
    },
  };

  const swipe = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") setTouchX(e.clientX);
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      if (touchX === null) return;
      const dx = e.clientX - touchX;
      setTouchX(null);
      if (Math.abs(dx) > 48) (dx < 0 ? next : back)();
    },
    onPointerCancel: () => setTouchX(null),
  };

  return {
    n,
    cur,
    prev,
    dir,
    visits,
    playing,
    setPlaying,
    reduced,
    running,
    intervalMs,
    go,
    next,
    back,
    pick,
    root,
    swipe,
    clearPrev: () => setView((v) => ({ ...v, prev: null })),
  };
}

export type Carousel = ReturnType<typeof useCarousel>;

/** All slides stacked in one grid cell; only the current one is interactive. */
export function CarouselSlides({ c, slides, className = "" }: { c: Carousel; slides: CarouselSlide[]; className?: string }) {
  const { cur, prev, dir, n } = c;
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)] touch-pan-y overflow-x-clip ${className}`} aria-live={c.running ? "off" : "polite"} {...c.swipe}>
      {slides.map((s, i) => {
        const current = i === cur;
        const anim = current ? (prev === null ? "" : dir === 1 ? "feat-in-next" : "feat-in-prev") : i === prev ? (dir === 1 ? "feat-out-next" : "feat-out-prev") : "invisible";
        return (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}: ${s.label}`}
            aria-hidden={current ? undefined : true}
            inert={!current}
            className={`col-start-1 row-start-1 min-w-0 ${current ? "" : "pointer-events-none"} ${anim}`}
            // Clears the classes after the slide-in, so showing the tab again doesn't replay the old slide leaving.
            onAnimationEnd={current ? (e) => e.target === e.currentTarget && c.clearPrev() : undefined}
          >
            {/* Remounting on each visit replays the slide's own entrance animations. */}
            <div key={c.visits[i]}>{s.content}</div>
          </div>
        );
      })}
    </div>
  );
}

/** The fill of the current progress segment; when it ends, the carousel moves on. `className` sets position, shape and colour. */
export function CarouselTimer({ c, className }: { c: Carousel; className: string }) {
  if (c.reduced) return <span className={className} />;
  return (
    <span
      key={`${c.cur}-${c.visits[c.cur]}`}
      className={`feat-timer ${className}`}
      style={{ animationDuration: `${c.intervalMs}ms`, animationPlayState: c.running ? "running" : "paused" }}
      onAnimationEnd={(e) => e.target === e.currentTarget && c.next()}
    />
  );
}
