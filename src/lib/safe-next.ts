// ?next= values: only paths on this site. Shared by /auth/callback (server) and the sign-in page (browser).

const BASE = "https://stellar.invalid";

/**
 * The same-site path (+ query + hash) `want` points to, or null for anything else.
 * Parsed like a browser does, so tricks the URL parser undoes ("/\t/evil.com", "/\\evil.com", "//evil.com") are caught
 * by comparing origins instead of by string checks.
 */
export function sameSitePath(want: string | null | undefined): string | null {
  if (!want || !want.startsWith("/")) return null;
  try {
    const u = new URL(want, BASE);
    if (u.origin !== BASE) return null;
    return u.pathname + u.search + u.hash;
  } catch {
    return null;
  }
}
