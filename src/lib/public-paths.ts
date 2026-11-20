// Which pages a signed-out visitor may open. Used by src/proxy.ts (server redirect) and <AuthGate /> (browser fallback).
// Everything else sends them to /register first. "/" is public too (exact match only): for a signed-out visitor the proxy
// shows the public landing page there (app/landing, see src/proxy.ts). The generated share images must be public for crawlers.

const PUBLIC = ["/register", "/login", "/auth", "/admin", "/plus", "/opengraph-image", "/twitter-image"];
/** Full-screen sign-up / sign-in pages: no sidebar, footer or support button. */
const BARE = ["/register", "/login"];

const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(base + "/");

export function isPublicPath(pathname: string): boolean {
  return pathname === "/" || PUBLIC.some((p) => under(pathname, p));
}

export function isBarePath(pathname: string): boolean {
  return BARE.some((p) => under(pathname, p));
}

/** /register link that comes back to `pathAndSearch` afterwards ("/" needs no ?next=). */
export function registerHref(pathAndSearch: string | null): string {
  if (!pathAndSearch || pathAndSearch === "/") return "/register";
  return `/register?next=${encodeURIComponent(pathAndSearch)}`;
}
