"use client";

import Link from "next/link";
import { useAppPathname } from "@/lib/use-app-pathname";
import { loginHref } from "@/components/profile/sync-label";
import { useAuth } from "@/lib/auth-client";
import { LINK_ON_DARK } from "./styles";

/** For signed-out visitors on a lock page: someone who already has Plus can sign in. */
export function SignInHint() {
  const auth = useAuth();
  const pathname = useAppPathname();
  if (!auth.ready || auth.user) return null;
  return (
    <p className="mt-4 text-sm text-side-ink/80">
      Already have Plus?{" "}
      <Link href={loginHref(pathname)} className={LINK_ON_DARK}>
        Sign in
      </Link>
    </p>
  );
}
