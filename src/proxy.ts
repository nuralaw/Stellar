import { NextResponse, type NextRequest } from "next/server";
import { isPublicPath } from "@/lib/public-paths";
import { SUPABASE_ON, updateSession } from "@/lib/supabase/proxy";

// Keep what the session refresh set on `from`: cookies, and the cache headers Supabase adds with them (so a CDN never stores this).
function carryOver(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((c) => to.cookies.set(c));
  for (const h of ["cache-control", "expires", "pragma"]) {
    const v = from.headers.get(h);
    if (v) to.headers.set(h, v);
  }
  return to;
}

// 1. Keeps the Supabase sign-in fresh on the routes that read it.
// 2. Registration is mandatory: a signed-out visitor on any non-public page (lib/public-paths.ts) goes to /register.
//    <AuthGate /> does the same in the browser (sign-out in another tab, client-cached pages).
// 3. "/" for a signed-out visitor is answered with the public landing page (app/landing) under the same address, so the
//    address stays "/" for search engines. The page itself is static: the sign-in check lives here, not in a Server Component.
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { response, signedIn } = await updateSession(request);

  const asGet = request.method === "GET" || request.method === "HEAD";

  // The landing page has one address: "/". A direct visit to /landing goes there (the rewrite below doesn't re-enter the proxy).
  if (pathname === "/landing") {
    const to = request.nextUrl.clone();
    to.pathname = "/";
    to.search = "";
    return carryOver(response, NextResponse.redirect(to, 308));
  }

  if (SUPABASE_ON && !signedIn && pathname === "/" && asGet) {
    const to = request.nextUrl.clone();
    to.pathname = "/landing";
    to.search = "";
    return carryOver(response, NextResponse.rewrite(to));
  }

  // "/" is public only as the landing page (GET/HEAD, above); anything else sent there signed out still goes to /register.
  const open = isPublicPath(pathname) && (pathname !== "/" || asGet);
  const gated = SUPABASE_ON && !signedIn && !pathname.startsWith("/api/") && !open;
  if (!gated) return response;

  const to = request.nextUrl.clone();
  const query = new URLSearchParams(searchParams);
  query.delete("_rsc"); // Next's own client-navigation marker, not part of the page address
  const back = pathname + (query.size ? `?${query}` : "");
  to.pathname = "/register";
  to.search = back === "/" ? "" : `?next=${encodeURIComponent(back)}`;
  // 307 keeps GET/HEAD as they are; anything else (POST, …) is answered with 303 so it can't be replayed against /register.
  return carryOver(response, NextResponse.redirect(to, asGet ? 307 : 303));
}

export const config = {
  matcher: [
    // Every page. Not: /api/* (listed one by one below), _next/*, the analytics proxy path (/s1600, see lib/analytics.ts)
    // and anything with a file extension (public assets, icon.png, …).
    "/((?!api/|_next/|s1600/|.*\\..*).*)",
    "/api/admin/:path*",
    "/api/competition/:path*",
    "/api/account/:path*",
    "/api/report",
    "/api/support",
    "/api/access",
  ],
};
