import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Session refresh for src/proxy.ts: reads the sb-…-auth-token cookies, refreshes an expired access token
// and writes the new cookies to both the request (for the route about to run) and the response (for the browser).

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** False when the Supabase env vars aren't set (local dev without Supabase): the proxy then gates nothing. */
export const SUPABASE_ON = Boolean(URL && KEY);

/** `signedIn`: getClaims() found a user. A visitor with no sb- cookies counts as signed out without any network call. */
export async function updateSession(request: NextRequest): Promise<{ response: NextResponse; signedIn: boolean }> {
  let response = NextResponse.next({ request });
  // Not set up, or a visitor with no Supabase cookies at all: nothing to refresh.
  if (!URL || !KEY || !request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) return { response, signedIn: false };

  const sb = createServerClient(URL, KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list, headers) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });
  // Don't put code between createServerClient and this call: it's what triggers the refresh.
  const result = await sb.auth.getClaims().catch(() => null);
  // If Supabase can't be reached (null = it threw), don't lock signed-in students out: treat them as signed in.
  const signedIn = result === null || result.error?.name === "AuthRetryableFetchError" || Boolean(result.data?.claims?.sub);
  return { response, signedIn };
}
