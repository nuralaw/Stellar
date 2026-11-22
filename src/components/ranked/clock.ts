"use client";

import { useEffect, useState } from "react";

// Countdowns that follow the server's clock, not the device's (docs/ELO-live.md 6): a response carries `serverNow`; the time that
// passes after it is measured with performance.now(), which keeps running at the same speed whatever the device clock is set to.

export interface ServerStamp {
  /** The server's clock (epoch ms) when the response was made. */
  server: number;
  /** performance.now() when the response arrived. */
  perf: number;
}

/** Call when a response arrives (in a handler, not while rendering). */
export const stampServer = (serverNow: number): ServerStamp => ({ server: serverNow, perf: performance.now() });

/** The server's current time, estimated from a stamp and the value `useTicker` returned. */
export const serverNowAt = (s: ServerStamp, perfNow: number): number => s.server + Math.max(0, perfNow - s.perf);

/** performance.now(), refreshed every `ms` while `enabled`: re-renders the component so the countdown moves. */
export function useTicker(enabled: boolean, ms = 1000): number {
  const [t, setT] = useState(() => performance.now());
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setT(performance.now()), ms);
    return () => clearInterval(id);
  }, [enabled, ms]);
  return t;
}
