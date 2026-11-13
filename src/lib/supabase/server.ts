import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Supabase Auth on the server, signed in as the visitor (session in the sb-…-auth-token cookies).
// Only used from Route Handlers, which may also write the refreshed session cookies back.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const authConfigured = Boolean(URL && KEY);

/** null when NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY aren't set. */
export async function supabaseServer() {
  if (!URL || !KEY) return null;
  const store = await cookies();
  return createServerClient(URL, KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called outside a Route Handler (read-only cookies): the browser client refreshes the session itself.
        }
      },
    },
  });
}
