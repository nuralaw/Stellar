"use client";

import { usePathname } from "next/navigation";

// The landing page lives at app/landing but is served at "/" by the rewrite in src/proxy.ts. It is prerendered for "/landing"
// while the browser reads "/", so usePathname() would differ between server HTML and first client render (hydration error).
// Use this instead of usePathname() everywhere: it reports the address the visitor actually sees.
export function useAppPathname(): string {
  const pathname = usePathname();
  return pathname === "/landing" ? "/" : pathname;
}
