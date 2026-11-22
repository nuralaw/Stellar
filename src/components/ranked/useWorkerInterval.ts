"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `callback` every `ms` while `enabled`, with the ticks coming from a dedicated Worker. A background tab's setInterval is throttled
 * (after a minute or so Chrome stretches a 2 s timer to 16-60 s), which would let the matchmaking queue drop a player who is only
 * waiting in another tab; a Worker's timer is not throttled that way. The callback itself still runs on the main thread, and it is always
 * the latest one passed in. Falls back to a plain setInterval when Workers are missing, blocked, or fail to start.
 */
export function useWorkerInterval(callback: () => void, ms: number, enabled: boolean) {
  const latest = useRef(callback);
  useEffect(() => {
    latest.current = callback;
  });

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const tick = () => latest.current();
    let worker: Worker | null = null;
    let url: string | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const fallback = () => {
      if (!alive) return;
      worker?.terminate();
      worker = null;
      if (timer === null) timer = setInterval(tick, ms);
    };

    try {
      url = URL.createObjectURL(new Blob([`setInterval(() => postMessage(0), ${Math.round(ms)});`], { type: "text/javascript" }));
      worker = new Worker(url);
      worker.onmessage = tick;
      worker.onerror = fallback;
    } catch {
      fallback();
    }

    return () => {
      alive = false;
      worker?.terminate();
      if (url) URL.revokeObjectURL(url);
      if (timer !== null) clearInterval(timer);
    };
  }, [enabled, ms]);
}
