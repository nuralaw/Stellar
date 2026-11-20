"use client";

import Link from "next/link";
import { useAppPathname } from "@/lib/use-app-pathname";
import { useState } from "react";
import { useAttempts, useHydrated } from "@/lib/store";
import { useAuth } from "@/lib/auth-client";
import { loginHref } from "./profile/sync-label";

const DISMISS_KEY = "stellar:sync-nudge-dismissed";
/** Ask to sign in only after the student has something worth keeping. */
const MIN_ANSWERS = 20;

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/** "Your answers live only in this browser" — shown once there is real progress to lose. */
export function SyncNudge({ variant = "card" }: { variant?: "card" | "inline" }) {
  const hydrated = useHydrated();
  const attempts = useAttempts();
  const auth = useAuth();
  const pathname = useAppPathname();
  const [hidden, setHidden] = useState(false);
  const n = attempts.length;
  // Wait for the session too: a signed-in student's progress is already synced, so never flash this at them.
  if (!hydrated || !auth.ready || auth.user || n < MIN_ANSWERS || hidden) return null;
  const href = loginHref(pathname);

  if (variant === "inline")
    return (
      <p className="mt-6 text-sm text-muted">
        Your {n.toLocaleString("en-US")} answers are saved only in this browser.{" "}
        <Link href={href} className="font-semibold text-primary hover:underline">
          Sign in to keep them
        </Link>
      </p>
    );

  if (wasDismissed()) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-line bg-surface px-5 py-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 9.5H7zM12 11v5M9.5 13.5 12 11l2.5 2.5" />
        </svg>
      </span>
      <div className="min-w-[12rem] flex-1">
        <p className="font-semibold">Don&apos;t lose your {n.toLocaleString("en-US")} answers</p>
        <p className="mt-0.5 text-sm text-muted">They&apos;re saved only in this browser. Sign in to keep your progress on every device.</p>
      </div>
      <div className="flex items-center gap-1">
        <Link href={href} className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-2">
          Sign in
        </Link>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(DISMISS_KEY, "1");
            } catch {}
            setHidden(true);
          }}
          className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-ink"
        >
          Later
        </button>
      </div>
    </div>
  );
}
