import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Keeps the Supabase sign-in fresh, only on the routes that read it (the rest of the site never runs this).
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin", "/api/admin/:path*", "/auth/:path*", "/api/competition/:path*"],
};
