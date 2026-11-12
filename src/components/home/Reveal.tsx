"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Holds the entrance animations inside (bars, columns, cards) until the block scrolls into view, then plays them
 * once. CSS in globals.css ([data-reveal]).
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-reveal="" data-seen={seen ? "" : undefined} className={className}>
      {children}
    </div>
  );
}
