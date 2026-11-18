"use client";

import Link from "next/link";
import { Skeleton } from "@/components/home/parts";
import { useAccess } from "@/lib/access";
import { useAuth } from "@/lib/auth-client";
import { BTN_PRIMARY, BTN_SECONDARY } from "./styles";

/** The button under the Free card on /plus; it follows the visitor's account. */
export function FreeCardCta() {
  const access = useAccess();
  const auth = useAuth();
  if (!access.ready) return <Skeleton className="h-11 w-full rounded-xl" />;
  if (access.plan === "plus" || access.plan === "admin") return <p className="flex min-h-11 items-center justify-center text-sm text-muted">Included in your plan</p>;
  if (!auth.user)
    return (
      <Link href="/register" className={`${BTN_PRIMARY} w-full`}>
        Create a free account
      </Link>
    );
  return (
    <Link href="/practice" className={`${BTN_SECONDARY} w-full`}>
      Keep practicing free
    </Link>
  );
}
