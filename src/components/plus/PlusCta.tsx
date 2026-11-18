"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { daysLeft, formatDate } from "@/components/PlanLabel";
import { useAccess } from "@/lib/access";
import { useAuth } from "@/lib/auth-client";
import { STATS_ICON } from "@/lib/nav";
import { paymentsLive } from "@/lib/plus-config";
import { reviewQueue } from "@/lib/review";
import { useAttempts, useNow } from "@/lib/store";
import { estMinutes } from "@/lib/ui";
import { PlusMark } from "./PlusMark";
import { BTN_GHOST_DARK, BTN_ON_DARK, FOCUS } from "./styles";

/** The buttons of the final band of /plus. They follow the visitor's plan. */
export function PlusCta() {
  const access = useAccess();
  const live = paymentsLive();
  const member = access.plan === "plus";

  if (!access.ready)
    return (
      <div className="mt-8" aria-hidden="true">
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <div className="h-11 w-full animate-pulse rounded-xl bg-white/10 sm:w-36" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-white/10 sm:w-44" />
        </div>
      </div>
    );

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
