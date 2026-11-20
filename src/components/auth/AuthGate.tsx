"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AUTH_CONFIGURED, useAuth } from "@/lib/auth-client";
import { isPublicPath, registerHref } from "@/lib/public-paths";
import { useAppPathname } from "@/lib/use-app-pathname";

/**
 * Browser fallback of the registration gate (src/proxy.ts does the real redirect): catches a sign-out in another tab
 * and pages served from the client cache. Renders nothing.
 */
export function AuthGate() {
  const auth = useAuth();
  const pathname = useAppPathname();
  const router = useRouter();
  const block = AUTH_CONFIGURED && auth.ready && !auth.user && !isPublicPath(pathname);

  useEffect(() => {
    if (block) router.replace(registerHref(pathname + window.location.search));
  }, [block, pathname, router]);

  // "/" is public: signed out, the server answers it with the landing page, signed in with the Dashboard, and the client router
  // caches both. When the signed-in state changes without this tab doing it (sign-out or sign-in in another tab), ask the server
  // again (router.refresh() also clears the client router cache) so no page, Home included, shows the stale side. The first
  // ready render only records the state, otherwise every signed-in page load would refresh.
  const lastSignedIn = useRef<boolean | null>(null);
  const signedIn = Boolean(auth.user);
  useEffect(() => {
    if (!auth.ready) return;
    if (lastSignedIn.current !== null && lastSignedIn.current !== signedIn) router.refresh();
    lastSignedIn.current = signedIn;
  }, [auth.ready, signedIn, router]);

  return null;
}
