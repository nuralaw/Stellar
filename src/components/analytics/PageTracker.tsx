"use client";

import { useAppPathname } from "@/lib/use-app-pathname";
import { useEffect } from "react";
import { getUserId } from "@/lib/store";

// Free page-view counter: one beacon to /api/track on the first load and on every client-side navigation.
// Mounted once in the root layout. Renders nothing. Read in /admin → Traffic.
// Not counted: the owner (admin flag in this browser), /admin pages, automated browsers, Do Not Track.

/** Same key as src/lib/admin-flag.ts. Read directly so the very first effect already sees it
 *  (useAdminFlag reports false during hydration). */
const ADMIN_KEY = "stellar:admin";

/** Module-level: survives React strict mode's double effects and re-mounts within the tab. */
let lastPath: string | null = null;
let firstView = true;

function skip(path: string) {
  if (path.startsWith("/admin")) return true;
  if (navigator.webdriver) return true;
  const nav = navigator as Navigator & { msDoNotTrack?: string };
  const w = window as Window & { doNotTrack?: string };
  if ([nav.doNotTrack, nav.msDoNotTrack, w.doNotTrack].some((v) => v === "1" || v === "yes")) return true;
  try {
    if (localStorage.getItem(ADMIN_KEY) === "1") return true;
  } catch {}
  return false;
}

function send(path: string, referrer: string | undefined) {
  const body = JSON.stringify({ visitor: getUserId(), path, referrer });
  try {
    if (navigator.sendBeacon?.("/api/track", body)) return;
  } catch {}
  fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
}

export function PageTracker() {
  const pathname = useAppPathname();

  useEffect(() => {
    if (!pathname || pathname === lastPath) return;
    lastPath = pathname;
    // Only the tab's first page view has an outside referrer; later navigations are internal.
    const referrer = firstView ? document.referrer || undefined : undefined;
    firstView = false;
    if (skip(pathname)) return;
    send(pathname, referrer);
  }, [pathname]);

  return null;
}
