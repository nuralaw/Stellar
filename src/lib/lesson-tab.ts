"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { LessonTab } from "./lesson-order";

// The tab /lessons opens on, remembered in localStorage. A tiny external store, so a /lessons page kept alive in the
// background (Activity) re-renders when a domain or lesson page changes it.

const KEY = "stellar:lessons-tab";
const listeners = new Set<() => void>();

function read(): LessonTab | null {
  try {
    const t = localStorage.getItem(KEY);
    return t === "strategy" || t === "rw" || t === "math" ? t : null;
  } catch {
    return null;
  }
}

/** Remember the tab /lessons opens on. */
export function rememberTab(t: LessonTab) {
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Renders nothing; remembers `tab` while it is mounted (for server components that can't use effects). */
export function RememberTab({ tab }: { tab: LessonTab }) {
  useEffect(() => rememberTab(tab), [tab]);
  return null;
}

/** The remembered tab (null on the server, before hydration, or when nothing is stored). */
export function useRememberedTab(): LessonTab | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
