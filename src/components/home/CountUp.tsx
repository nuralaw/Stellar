"use client";

import { useEffect, useRef, useState } from "react";

const calm = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A number that counts up from 0 to `value` (ease-out, ~1 s) once it scrolls into view.
 * Reduced motion: the final number right away.
 */
export function CountUp({ value, suffix = "", delay = 0, duration = 1000 }: { value: number; suffix?: string; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) {
      const id = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      const t0 = performance.now();
      const a = from.current;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const v = a + (value - a) * (1 - (1 - p) ** 3);
        setShown(p === 1 ? value : Math.round(v));
        from.current = p === 1 ? value : v;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(start, delay);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, delay, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
