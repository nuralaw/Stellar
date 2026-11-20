"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { daysLeft, formatDate } from "@/components/PlanLabel";
import { Skeleton } from "@/components/home/parts";
import { PlusBadge } from "@/components/PlusLock";
import { PlusMark } from "@/components/plus/PlusMark";
import { BTN_QUIET, FOCUS, LINK_STRONG } from "@/components/plus/styles";
import { useAccess } from "@/lib/access";
import { useAuth } from "@/lib/auth-client";
import { useNow } from "@/lib/store";

const INCLUDED = [
  { href: "/test", label: "Practice tests" },
  { href: "/practice", label: "Question Bank" },
  { href: "/lessons", label: "Lessons" },
  { href: "/statistics", label: "Statistics" },
  { href: "/mistakes", label: "Mistakes review" },
];

type MembershipInfo = { status: "active" | "cancelling" | "unknown"; endsAt: string | null; manageUrl: string };

/** /profile "Plan": the current plan (Free / Plus until a date / Admin), its billing state and what it includes. */
export function PlanSection() {
  const access = useAccess();
  const now = useNow();
  const { expiresAt } = access;
  const left = expiresAt && now ? daysLeft(expiresAt, now) : null;
  const isPlus = access.ready && access.plan === "plus";
  const { user } = useAuth();
  const userId = user?.id ?? null;
  // The answer is stored with the user id it was fetched for, so another account (or a non-Plus plan) never shows it.
  const [answer, setAnswer] = useState<{ userId: string; membership: MembershipInfo | null } | null>(null);
  const membership = isPlus && userId && answer?.userId === userId ? answer.membership : null;

  // The Monthly membership's billing state (null for a one-off grant, an ended membership, or when it can't be read).
  useEffect(() => {
    if (!isPlus || !userId) return;
    let live = true;
    fetch("/api/account/membership", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const m = json?.membership;
        const ok = m && typeof m.manageUrl === "string" && (m.status === "active" || m.status === "cancelling" || m.status === "unknown");
        if (live) setAnswer({ userId, membership: ok ? { status: m.status, endsAt: typeof m.endsAt === "string" ? m.endsAt : null, manageUrl: m.manageUrl } : null });
      })
      .catch(() => {
        if (live) setAnswer({ userId, membership: null });
      });
    return () => {
      live = false;
    };
  }, [isPlus, userId]);
  const active = membership?.status === "active";
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Plan</h2>
        {access.ready && access.plan === "plus" && <PlusBadge />}
        {access.ready && access.plan === "admin" && <span className="text-sm font-semibold">Admin</span>}
        {access.ready && access.plan === "free" && <span className="text-sm font-semibold">Free</span>}
      </div>
      {!access.ready ? (
        <>
          <Skeleton className="mt-3 h-5 w-40" />
          <Skeleton className="mt-3 h-16 rounded-xl" />
        </>
      ) : access.plan === "free" ? (
        <div className="mt-3 flex gap-3 rounded-xl bg-primary-soft/50 p-4">
          <PlusMark size="md" />
          <div>
            <p className="text-sm">Stellar Plus adds every past-paper practice test, the full question bank, all lessons, your predicted score and spaced review of your mistakes.</p>
            <Link href="/plus" className={`mt-3 ${BTN_QUIET}`}>
              See Stellar Plus
            </Link>
          </div>
        </div>
      ) : access.plan === "admin" ? (
        <p className="mt-2 text-sm text-muted">Everything is unlocked for this account.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-ink">Stellar Plus</span> ·{" "}
            {expiresAt ? `until ${formatDate(expiresAt)}${left !== null ? ` · ${left} ${left === 1 ? "day" : "days"} left` : ""}` : "no end date"}
          </p>
          {left !== null && left > 0 && left <= 7 && !active && (
            <p className="mt-2 text-sm font-medium text-primary-strong">
              Ends in {left} {left === 1 ? "day" : "days"}. Your progress stays either way.
            </p>
          )}
          {membership?.status === "cancelling" && (
            <p className="mt-3 text-sm">
              Your subscription is cancelled. You won&apos;t be charged again, and Plus stays until {expiresAt ? formatDate(expiresAt) : "the end of the paid month"}.{" "}
              <a href={membership.manageUrl} target="_blank" rel="noopener noreferrer" className={LINK_STRONG}>
                Manage subscription
              </a>
            </p>
          )}
          {(membership?.status === "active" || membership?.status === "unknown") && (
            <div className="mt-3">
              <p className="text-sm">
                {membership.status === "active" ? "Monthly subscription. It renews every month until you cancel." : "You bought Plus as a monthly subscription."}{" "}
                <a href={membership.manageUrl} target="_blank" rel="noopener noreferrer" className={LINK_STRONG}>
                  Manage or cancel subscription
                </a>
              </p>
              <p className="mt-1 text-xs text-muted">
                Opens Gumroad, our payment provider. If it asks, confirm with the email you paid with. After you cancel, Plus stays until the end of the month you paid for.
              </p>
            </div>
          )}
          <p className="mt-4 text-xs font-semibold tracking-wide text-muted uppercase">Included</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {INCLUDED.map((x) => (
              <Link key={x.href} href={x.href} className={`inline-flex min-h-11 items-center rounded-full border border-line px-3.5 text-sm font-medium transition-colors hover:bg-surface-2 ${FOCUS}`}>
                {x.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link href="/plus" className={LINK_STRONG}>
              About Stellar Plus
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
