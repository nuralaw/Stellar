import { NextResponse, type NextRequest } from "next/server";
import { isPublicPath } from "@/lib/public-paths";
import { SUPABASE_ON, updateSession } from "@/lib/supabase/proxy";

// 1. Keeps the Supabase sign-in fresh on the routes that read it.
// 2. Registration is mandatory: a signed-out visitor on any non-public page (lib/public-paths.ts) goes to /register.
//    <AuthGate /> does the same in the browser (sign-out in another tab, client-cached pages).
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { response, signedIn } = await updateSession(request);

  const gated = SUPABASE_ON && !signedIn && !pathname.startsWith("/api/") && !isPublicPath(pathname);
  if (!gated) return response;

  const to = request.nextUrl.clone();
  const query = new URLSearchParams(searchParams);
  query.delete("_rsc"); // Next's own client-navigation marker, not part of the page address
  const back = pathname + (query.size ? `?${query}` : "");
  to.pathname = "/register";
  to.search = back === "/" ? "" : `?next=${encodeURIComponent(back)}`;
  // 307 keeps GET/HEAD as they are; anything else (POST, …) is answered with 303 so it can't be replayed against /register.
  const redirect = NextResponse.redirect(to, request.method === "GET" || request.method === "HEAD" ? 307 : 303);
  // Keep what the session refresh set: cookies, and the cache headers Supabase adds with them (so a CDN never stores this).
  response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  for (const h of ["cache-control", "expires", "pragma"]) {
    const v = response.headers.get(h);
    if (v) redirect.headers.set(h, v);
  }
  return redirect;
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
