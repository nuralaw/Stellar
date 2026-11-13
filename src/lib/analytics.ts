// Custom analytics events (goals), provider-agnostic. Today the only provider is Plausible
// (src/components/analytics/PlausibleScript.tsx); with NEXT_PUBLIC_PLAUSIBLE_DOMAIN empty every call is a no-op.
// Safe to import from server code too: nothing touches `window` until trackEvent() runs in a browser.
// Each name below must also be added as a custom-event goal in Plausible (Site settings → Goals) to show up.
//
// Where to call trackEvent (not wired yet — these files belong to other features):
// - "Sign in" / "Sign up": src/lib/auth-client.ts, the sb.auth.onAuthStateChange callback in start(), on
//     event === "SIGNED_IN" when the previous state was signed out (covers the email code and the Google
//     redirect). "Sign up" when Date.parse(user.created_at) is within ~2 min of Date.parse(user.last_sign_in_at),
//     else "Sign in". Props: { method: user.app_metadata.provider } ("email" | "google").
// - "Practice session": src/components/bank/SolveView.tsx, finish() inside SolveView
//     (props: { questions: total, answered: Object.keys(session).length }).
// - "Test finished": src/components/test/TestRunner.tsx, the onFinish handler passed to <Session>, after
//     addTestResult() (props: { test: test.id, full: isFullTest(result) }).
// - "Lesson finished": src/components/lessons/LessonPlayer.tsx, go(), when `finished && !(same && saved?.done)`
//     (first finish only; props: { lesson: slug }).
// - "Competition round": src/components/compete/CompeteRound.tsx, submit(), after the /api/competition/submit
//     post succeeds (props: { week: data.week, round: data.round }).
// - "Support request": src/components/SupportButton.tsx, send(), after the response is ok (before setState("sent")).
// - "Question report": src/components/bank/ReportButton.tsx, send(), after the response is ok (props: { reason }).
// Props: no personal data (no emails, names, user ids) — Plausible shows them to anyone with dashboard access.

export type AnalyticsEvent =
  | "Sign up"
  | "Sign in"
  | "Practice session"
  | "Test finished"
  | "Lesson finished"
  | "Competition round"
  | "Support request"
  | "Question report";

export type AnalyticsProps = Record<string, string | number | boolean>;

/** Same-site paths the Plausible script and event API are proxied through (next.config.ts rewrites).
 *  Plausible advises against "stats", "analytics" or "plausible" in these paths: ad blockers match them. */
export const PLAUSIBLE_SCRIPT_PATH = "/s1600/js/script.js";
export const PLAUSIBLE_EVENT_PATH = "/s1600/api/event";

/** Inlined at build time; empty → analytics off. */
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? "";

type PlausibleFn = ((event: string, options?: { props?: AnalyticsProps }) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/** Sends a custom event. Calls made before the script has loaded are queued (Plausible's documented stub). */
export function trackEvent(name: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!PLAUSIBLE_DOMAIN || typeof window === "undefined") return;
  try {
    if (!window.plausible) {
      const stub: PlausibleFn = (...args: unknown[]) => {
        (stub.q = stub.q || []).push(args);
      };
      window.plausible = stub;
    }
    window.plausible(name, props ? { props } : undefined);
  } catch {
    // Analytics must never break the page.
  }
}
