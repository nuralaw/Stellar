"use client";

import { useSyncExternalStore } from "react";

// Browser full screen for practice (like the real test app). requestFullscreen only works inside a click /
// key handler, so call enterFullscreen() from the handler that opens the practice set. Errors (iOS Safari,
// iframes, no gesture) are ignored: the page still fills the window without the browser's own chrome hidden.

export function enterFullscreen() {
  try {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
  } catch {}
}

export function exitFullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  } catch {}
}

export function toggleFullscreen() {
  if (typeof document !== "undefined" && document.fullscreenElement) exitFullscreen();
  else enterFullscreen();
}

function subscribe(cb: () => void) {
  document.addEventListener("fullscreenchange", cb);
  return () => document.removeEventListener("fullscreenchange", cb);
}

export function useIsFullscreen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(document.fullscreenElement),
    () => false,
  );
}

/** Whether this browser can go full screen at all (hides the button where it can't, e.g. iPhone Safari). */
export function useCanFullscreen(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => Boolean(document.fullscreenEnabled),
    () => false,
  );
}
