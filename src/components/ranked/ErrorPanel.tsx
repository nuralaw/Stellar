import Link from "next/link";
import { I, Icon } from "@/components/bank/icons";
import { WARN_ICON } from "@/components/compete/CompeteRound";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/components/plus/styles";
import { RankedApiError } from "./api";

interface Copy {
  title: string;
  text: string;
  action?: "signin" | "profile" | "hub" | "retry";
}

function copyFor(e: RankedApiError): Copy {
  switch (e.code) {
    case "auth":
      return { title: "Sign in to play ranked", text: "Ranked matches are for registered students, so your rating can't be farmed from throwaway accounts.", action: "signin" };
    case "verify":
      return { title: "Confirm your email first", text: "Open the confirmation link we sent you, then come back. Ranked matches need a confirmed email.", action: "retry" };
    case "name":
      return { title: "Choose a public name", text: "Other players see your name and photo on the leaderboard and in matches. Pick one in Profile.", action: "profile" };
    case "in_match":
      return { title: "You're already in a match.", text: "Finish it before you look for another opponent. You'll find it on the Ranked page.", action: "hub" };
    case "limit_daily":
      return { title: "Daily limit reached", text: "You've played the most ranked matches allowed per day. Come back tomorrow, or keep practicing in the Question Bank.", action: "hub" };
    case "not_found":
      return { title: "Match not found", text: "This match doesn't exist or isn't yours.", action: "hub" };
    case "conflict":
      return { title: "That doesn't fit this match right now", text: e.message, action: "hub" };
    case "setup":
      return { title: "Ranked isn't set up yet", text: "Ranked matches aren't available on this server yet. Check back soon.", action: "hub" };
    case "fullscreen":
      return { title: "Full screen needed", text: e.message, action: "retry" };
    default:
      return { title: "Something went wrong", text: e.message, action: "retry" };
  }
}

/** A friendly state for each API error code. `next` is where sign-in comes back to. */
export function ErrorPanel({ error, next = "/ranked", onRetry, compact = false }: { error: RankedApiError; next?: string; onRetry?: () => void; compact?: boolean }) {
  const c = copyFor(error);
  const body = (
    <>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
        <Icon d={WARN_ICON} className="h-6 w-6" strokeWidth={2} />
      </span>
      <h2 className="mt-4 text-xl font-bold tracking-tight">{c.title}</h2>
      <p className="mt-1.5 max-w-md text-sm text-muted">{c.text}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {c.action === "signin" && (
          <>
            <Link href={`/login?next=${encodeURIComponent(next)}`} className={BTN_PRIMARY}>
              Sign in
            </Link>
            <Link href={`/register?next=${encodeURIComponent(next)}`} className={BTN_SECONDARY}>
              Create an account
            </Link>
          </>
        )}
        {c.action === "profile" && (
          <Link href="/profile" className={BTN_PRIMARY}>
            Open Profile
          </Link>
        )}
        {c.action === "retry" && onRetry && (
          <button type="button" onClick={onRetry} className={BTN_PRIMARY}>
            Try again
          </button>
        )}
        {c.action === "hub" && (!compact || error.code === "in_match") && (
          <Link href="/ranked" className={BTN_SECONDARY}>
            <Icon d={I.chevronL} className="h-4 w-4" /> Back to Ranked
          </Link>
        )}
      </div>
    </>
  );
  if (compact)
    return (
      <div className="rounded-2xl border border-danger/40 bg-danger-soft/40 p-5" role="alert">
        {body}
      </div>
    );
  return (
    <div className="mx-auto mt-6 flex max-w-xl flex-col items-start rounded-2xl border border-line bg-surface p-6 sm:p-8" role="alert">
      {body}
    </div>
  );
}
