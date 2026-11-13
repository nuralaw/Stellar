"use client";

import { createBrowserClient } from "@supabase/ssr";

// Supabase Auth in the browser (sign in / sign out). The session lives in cookies, so Route Handlers see it too.

/** null when NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY aren't set. */
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
