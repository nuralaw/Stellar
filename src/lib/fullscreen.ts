"use client";

import { useSyncExternalStore } from "react";

// Optional browser full screen for practice: the toggle in the solve toolbar. requestFullscreen only works inside a
// click / key handler. Errors (iOS Safari, iframes, no gesture) are ignored.

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

/** Asks for full screen and reports whether the page is now full screen (call from a click handler). */
export async function requestFullscreenNow(): Promise<boolean> {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    return Boolean(document.fullscreenElement);
  } catch {
    return false;
  }
}
