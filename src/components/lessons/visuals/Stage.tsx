"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Frame for a lesson visual: plays it only while it's on screen and restarts it from the beginning each time it
 * comes back into view (so a student scrolling to a card sees the whole story). CSS in globals.css (.lv).
 */
export function Stage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let visible = true; // server HTML starts playing
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) setRun((r) => r + 1);
        visible = e.isIntersecting;
        setOn(e.isIntersecting);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-play={on ? "on" : "off"} className={`lv ${className}`}>
      <div key={run} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
