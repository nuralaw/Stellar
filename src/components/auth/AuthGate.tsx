"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AUTH_CONFIGURED, useAuth } from "@/lib/auth-client";
import { isPublicPath, registerHref } from "@/lib/public-paths";

/**
 * Browser fallback of the registration gate (src/proxy.ts does the real redirect): catches a sign-out in another tab
 * and pages served from the client cache. Renders nothing.
 */
export function AuthGate() {
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const block = AUTH_CONFIGURED && auth.ready && !auth.user && !isPublicPath(pathname);

  useEffect(() => {
    if (block) router.replace(registerHref(pathname + window.location.search));
  }, [block, pathname, router]);

  return null;
}
