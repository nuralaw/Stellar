"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { daysLeft, formatDate } from "@/components/PlanLabel";
import { loginHref } from "@/components/profile/sync-label";
import { useAccess } from "@/lib/access";
import { useAuth } from "@/lib/auth-client";
import { STATS_ICON } from "@/lib/nav";
import { paymentsLive } from "@/lib/plus-config";
import { reviewQueue } from "@/lib/review";
import { useAttempts, useNow } from "@/lib/store";
import { estMinutes } from "@/lib/ui";
import { PlusMark } from "./PlusMark";
import { LaunchSentence } from "./PlusPersonal";
import { ShareWithParent } from "./ShareWithParent";
import { BTN_GHOST_DARK, BTN_ON_DARK, BTN_PRIMARY, BTN_SECONDARY, FOCUS, LINK_STRONG } from "./styles";

/** The buttons of /plus: hero, plans row and final band. They follow the visitor's plan. */
export function PlusCta({ variant, tests, lessons }: { variant: "hero" | "plans" | "final"; tests: number; lessons: number }) {
  const access = useAccess();
  const auth = useAuth();
  const live = paymentsLive();
  const member = access.plan === "plus";
  const signedIn = Boolean(auth.user) || access.plan === "admin";
  const until = access.expiresAt ? ` until ${formatDate(access.expiresAt)}` : "";

  if (!access.ready) {
    const box = variant === "plans" ? "bg-surface-2" : "bg-white/10";
    const wrap = variant === "hero" ? "mt-8 min-h-[6.25rem] sm:min-h-11" : "mt-8";
    return (
      <div className={wrap} aria-hidden="true">
        <div className={`flex flex-col gap-3 sm:flex-row ${variant === "hero" ? "" : "sm:justify-center"}`}>
          <div className={`h-11 w-full animate-pulse rounded-xl sm:w-36 ${box}`} />
          <div className={`h-11 w-full animate-pulse rounded-xl sm:w-44 ${box}`} />
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="mt-8 min-h-[6.25rem] sm:min-h-11">
        {member ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-semibold text-side-ink ring-1 ring-white/15">
              <Icon d={I.check} className="h-4 w-4 text-accent" strokeWidth={3} />
              You have Stellar Plus
              <span className="font-normal text-side-ink/80">{until}</span>
            </p>
            <a href="#your-plus" className={BTN_GHOST_DARK}>
              Your Plus
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#plans" className={`${BTN_ON_DARK} w-full sm:w-auto`}>
              {live ? "Get Plus" : "See plans"}
            </a>
            <ShareWithParent tests={tests} lessons={lessons} className={`${BTN_GHOST_DARK} w-full sm:w-auto`} />
          </div>
        )}
      </div>
    );
  }

  if (variant === "final") {
    return (
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {member ? (
          <>
            <Link href="/test" className={BTN_ON_DARK}>
              Take a practice test
            </Link>
            <Link href="/lessons" className={BTN_GHOST_DARK}>
              Open a lesson
            </Link>
          </>
        ) : (
          <>
            <a href="#plans" className={BTN_ON_DARK}>
              {live ? "Get Plus" : "See plans"}
            </a>
            <Link href="/practice" className={BTN_GHOST_DARK}>
              Keep practicing free
            </Link>
          </>
        )}
      </div>
    );
  }

  // plans
  return (
    <div className="mt-8 flex flex-col items-center gap-3 text-center">
      {member ? (
        <p className="text-sm text-muted">
          You have Stellar Plus{until}.{" "}
          <a href="#your-plus" className={LINK_STRONG}>
            Your Plus
          </a>
        </p>
      ) : (
        <>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            {!live && !signedIn && (
              <>
                <Link href={loginHref("/plus#plans")} className={BTN_PRIMARY}>
                  Sign in
                </Link>
                <ShareWithParent tests={tests} lessons={lessons} className={BTN_SECONDARY} />
              </>
            )}
            {!live && signedIn && (
              <>
                <ShareWithParent tests={tests} lessons={lessons} className={BTN_PRIMARY} />
                <Link href="/practice" className={BTN_SECONDARY}>
                  Keep practicing free
                </Link>
              </>
            )}
            {live && !signedIn && (
              <>
                <Link href={loginHref("/plus#plans")} className={BTN_PRIMARY}>
                  Sign in to get Plus
                </Link>
                <ShareWithParent tests={tests} lessons={lessons} className={BTN_SECONDARY} />
              </>
            )}
            {live && signedIn && <ShareWithParent tests={tests} lessons={lessons} className={BTN_SECONDARY} />}
          </div>
          {!live && !signedIn && <p className="max-w-md text-sm text-muted">Plus is tied to your Stellar account. Sign in now and your progress is saved there, on every device.</p>}
          {!live && (
            <p className="text-sm text-muted">
              <LaunchSentence format="short" /> Nothing is charged before then.
            </p>
          )}
        </>
      )}
    </div>
  );
}

/** Shown to Plus members and admins at the top of /plus. */
export function MemberPanel({ tests, lessons }: { tests: number; lessons: number }) {
  const access = useAccess();
  const auth = useAuth();
  if (!access.ready || access.plan === "free") return null;
  return (
    <section id="your-plus" aria-labelledby="your-plus-title" className="mt-6 scroll-mt-20 rounded-3xl border border-line bg-surface p-6 md:p-8 lg:scroll-mt-8">
      {access.plan === "admin" ? (
        <>
          <h2 id="your-plus-title" className="text-xl font-bold tracking-tight">
            Admin view
          </h2>
          <p className="mt-1 text-sm text-muted">Everything is unlocked for your account. The rest of this page shows what a signed-in free student sees.</p>
        </>
      ) : (
        <PlusBody key={auth.user?.id ?? ""} userId={auth.user?.id ?? ""} expiresAt={access.expiresAt} tests={tests} lessons={lessons} />
      )}
    </section>
  );
}

function PlusBody({ userId, expiresAt, tests, lessons }: { userId: string; expiresAt: string | null; tests: number; lessons: number }) {
  // Mounts only after the plan is known (a fresh client mount), so reading localStorage in the initializer can't mismatch the server HTML.
  const KEY = `stellar:plus-welcome:${userId}`;
  const [welcome] = useState(() => {
    try {
      return localStorage.getItem(KEY) === null;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  }, [KEY]);

  const now = useNow();
  const attempts = useAttempts();
  const due = now ? reviewQueue(attempts, now).due.length : 0;
  const left = expiresAt && now ? daysLeft(expiresAt, now) : null;
  const tiles = [
    { href: "/test", icon: I.clock, title: "Take a timed practice test", sub: `${tests} past papers` },
    { href: "/lessons", icon: I.play, title: "Open a lesson", sub: `${lessons} lessons` },
    due > 0
      ? { href: "/mistakes?review=1", icon: I.undo, title: `Clear today's ${due} ${due === 1 ? "review" : "reviews"}`, sub: `about ${estMinutes(due, "mixed")} min` }
      : { href: "/mistakes", icon: I.undo, title: "Review mistakes", sub: "Nothing due today" },
    { href: "/statistics", icon: STATS_ICON, title: "See your predicted score", sub: "and your weakest skills" },
  ];
  return (
    <>
      <div className="flex items-center gap-4">
        <PlusMark size="lg" className={welcome ? "lesson-pop" : ""} />
        <div>
          <h2 id="your-plus-title" className="text-xl font-bold tracking-tight">
            {welcome ? "Welcome to Stellar Plus" : "Your Plus"}
          </h2>
          <p className="text-sm text-muted">{expiresAt ? `Plus until ${formatDate(expiresAt)}${left !== null ? ` · ${left} ${left === 1 ? "day" : "days"} left` : ""}` : "No end date"}</p>
        </div>
      </div>
      {expiresAt && left !== null && left > 0 && left <= 7 && <p className="mt-3 text-sm font-medium">Your Plus ends on {formatDate(expiresAt)}. Your answers, scores and mistakes stay.</p>}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.title}>
            <Link href={t.href} className={`group flex h-full flex-col gap-1 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-primary-strong/50 ${FOCUS}`}>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-strong">
                <Icon d={t.icon} className="h-5 w-5" />
              </span>
              <span className="mt-2 font-semibold">{t.title}</span>
              <span className="text-sm text-muted">{t.sub}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
