"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { ErrorNote } from "@/components/admin/ResetPassword";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AUTH_CONFIGURED, getAuth, goToRegister, signOut, useAuth } from "@/lib/auth-client";
import { NAME_MAX, setPendingName } from "@/lib/pending-name";
import { sameSitePath } from "@/lib/safe-next";
import { useAttempts } from "@/lib/store";
import { supabaseBrowser } from "@/lib/supabase/client";

// /login and /register: students sign in or sign up with an email link / 6-digit code (no passwords) or Google, so their
// progress follows them. Signing up is the same one-time code as signing in (shouldCreateUser), plus a name that waits
// in localStorage until the first sync is done (lib/pending-name.ts).
// Email and Google both come back through /auth/callback → /login?next=… (failures add ?auth=failed),
// and /login then sends a signed-in visitor on to `next`.
// Uses useSearchParams, so the pages wrap it in <Suspense>.

export type Mode = "signin" | "register";

const RESEND_SECONDS = 60;
const CODE_LENGTH = 6;

const PRIMARY = "min-h-11 w-full rounded-xl bg-primary px-5 py-2.5 xl:min-h-10 xl:py-2 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40";
const OUTLINE = "flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-line px-5 py-2.5 xl:min-h-10 xl:py-2 font-semibold transition-colors hover:bg-surface-2 disabled:opacity-60";
// 16px text: iOS zooms into smaller inputs.
const INPUT = "min-h-11 w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 xl:min-h-10 xl:py-2 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary";

const LINK_FAILED = "That sign-in link didn't work — it may have expired or been opened in another browser. Send a new one.";
const GOOGLE_OFF = "Google sign-in isn't turned on yet — use your email.";
const OFFLINE = "You seem to be offline. Check your connection and try again.";

/** Google's "G" (sign-in button mark). */
const GOOGLE_G: [string, string][] = [
  ["#EA4335", "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"],
  ["#4285F4", "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"],
  ["#FBBC05", "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"],
  ["#34A853", "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"],
];

/** Only paths on this site: blocks //evil.com and /\evil.com (and /login and /register themselves, which would loop). */
function safeNext(want: string | null) {
  const path = sameSitePath(want);
  return !path || /^\/(?:login|register)(?:[/?#]|$)/.test(path) ? "/" : path;
}

/** Where email links and Google send the browser back to: the callback, then /login?next=… (which forwards to next). */
function callbackUrl(next: string) {
  const back = `/login?next=${encodeURIComponent(next)}`;
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(back)}`;
}

// Backstop against a redirect loop (see StudentSignIn): times of the latest automatic forwards, per tab.
// A loop = FORWARD_LOOP_COUNT of them within FORWARD_LOOP_MS (one or two are normal, e.g. after the Back button).
const FORWARD_KEY = "stellar:auto-forwards";
const FORWARD_LOOP_MS = 15_000;
const FORWARD_LOOP_COUNT = 3;
const NOT_CONFIRMED = "We couldn't confirm your session. Please sign in again.";
const NOT_OPENED = "We couldn't open the site automatically.";

function recentForwards(): number[] {
  try {
    const v: unknown = JSON.parse(sessionStorage.getItem(FORWARD_KEY) ?? "[]");
    const now = Date.now();
    return Array.isArray(v) ? v.filter((t): t is number => typeof t === "number" && now - t < FORWARD_LOOP_MS) : [];
  } catch {
    return [];
  }
}
function noteForward() {
  try {
    sessionStorage.setItem(FORWARD_KEY, JSON.stringify([...recentForwards(), Date.now()].slice(-FORWARD_LOOP_COUNT)));
  } catch {}
}
function resetForwards() {
  try {
    sessionStorage.removeItem(FORWARD_KEY);
  } catch {}
}

const offline = () => typeof navigator !== "undefined" && navigator.onLine === false;

/** Supabase errors in plain words. */
function explain(error: AuthError | Error, during: "send" | "verify" | "google"): string {
  const e = error as AuthError;
  const msg = e.message ?? "";
  if (offline() || e.name === "AuthRetryableFetchError" || /failed to fetch|network/i.test(msg)) return OFFLINE;
  // Per-address cooldown: "For security purposes, you can only request this after 42 seconds."
  const wait = msg.match(/after (\d+) seconds?/i);
  if (wait) return `Please wait ${wait[1]} seconds, then try again.`;
  if (e.status === 429 || e.code === "over_email_send_rate_limit" || /rate limit/i.test(msg)) {
    return during === "verify" ? "Too many tries. Wait a few minutes, then try again." : "Too many sign-in emails were sent. Try again in about an hour.";
  }
  if (during === "verify" && (e.code === "otp_expired" || /expired|invalid|token/i.test(msg))) {
    return "That code is wrong or has expired. Check it, or send a new email.";
  }
  if (e.code === "email_address_invalid" || /invalid.*email|email.*invalid/i.test(msg)) return "That email address doesn't look right. Check it and try again.";
  if (during === "google" && /provider is not enabled|unsupported provider/i.test(msg)) return GOOGLE_OFF;
  return msg || "Something went wrong. Try again.";
}

/** Does an account with this email exist? (POST /api/auth/email-exists.) null = couldn't tell: just carry on with registration. */
async function emailExists(email: string): Promise<boolean | null> {
  try {
    const res = await fetch("/api/auth/email-exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data: { exists?: unknown } = await res.json();
    return typeof data.exists === "boolean" ? data.exists : null;
  } catch {
    return null;
  }
}

/** Is the Google provider on in Supabase? (Public /auth/v1/settings.) null = couldn't tell, try anyway. */
async function googleEnabled(): Promise<boolean | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    if (!res.ok) return null;
    const s: { external?: Record<string, boolean> } = await res.json();
    return Boolean(s.external?.google);
  } catch {
    return null;
  }
}

export function StudentSignIn({ mode = "signin" }: { mode?: Mode }) {
  const params = useSearchParams();
  const register = mode === "register";
  const hasNext = params.has("next");
  const next = safeNext(params.get("next"));
  const auth = useAuth();
  // Back from a failed email link / Google (?auth=failed): keep the message, drop the param from the URL.
  const [linkFailed] = useState(() => params.get("auth") === "failed");
  const [step, setStep] = useState<"email" | "sent">("email");
  const [leaving, setLeaving] = useState(false);
  // An automatic forward (not right after a fresh verify) first checks that the server still accepts the session.
  const [check, setCheck] = useState<"unchecked" | "ok" | "loop" | "bad">("unchecked");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("auth")) return;
    url.searchParams.delete("auth");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  // Signed in and on the way somewhere (back from the email link / Google, a ?next= link, or the code just worked
  // or the link was opened in another tab of this browser): go on to `next`. Someone who is already signed in
  // and opens /register has nothing to do there, so they go on too.
  const want = Boolean(auth.user) && (register || leaving || step === "sent" || (hasNext && !linkFailed));
  const checking = want && !leaving && check === "unchecked";
  const goOn = want && (leaving || check === "ok");

  // If the server rejects a session the browser still trusts (deleted user, rotated secret, …), forwarding would bounce
  // /register → next → /register forever. So: after several forwards in a row, stop and show the signed-in screen
  // (Continue is the visitor's call); and ask the server first (getUser): if it rejects the session, drop it and show the form.
  const proceed = () => {
    resetForwards();
    setLeaving(true);
  };
  useEffect(() => {
    if (!checking) return;
    const sb = supabaseBrowser();
    if (!sb) return;
    let live = true;
    (async () => {
      if (recentForwards().length >= FORWARD_LOOP_COUNT) return setCheck("loop");
      const { error } = await sb.auth.getUser().catch((e: Error) => ({ error: e }));
      if (!live) return;
      // Only a clear rejection of the session (missing / 401 / 403 / 404) drops it. A network failure, 5xx or 429
      // (rate limit) says nothing about the session: let them through.
      const status = (error as { status?: number } | null)?.status;
      const rejected = Boolean(error) && (error!.name === "AuthSessionMissingError" || status === 401 || status === 403 || status === 404);
      if (!rejected) return setCheck("ok");
      setNotice(NOT_CONFIRMED);
      await sb.auth.signOut({ scope: "local" }).catch(() => {});
      if (live) setCheck(getAuth().user ? "bad" : "unchecked"); // "bad": couldn't sign out locally either, show the form anyway
    })();
    return () => {
      live = false;
    };
  }, [checking]);

  // A full page load, not router.replace: while signed out, Next may have prefetched pages that the proxy answered with a
  // redirect to /register, and the client router would reuse that cached redirect.
  useEffect(() => {
    if (!goOn) return;
    if (!leaving) noteForward();
    window.location.replace(next);
  }, [goOn, leaving, next]);

  if (!AUTH_CONFIGURED) {
    return (
      <AuthPanel title={register ? "Accounts aren't set up yet" : "Sign-in isn't set up yet"}>
        <p className="text-sm text-muted">Your progress is saved in this browser for now.</p>
        {register && (
          <Link href="/" className={`${PRIMARY} mt-6 grid place-items-center`}>
            Continue to Stellar
          </Link>
        )}
      </AuthPanel>
    );
  }
  if (!auth.ready || goOn || checking) {
    return (
      <AuthPanel title={register ? "Create your account" : "Sign in"}>
        <p className="text-sm text-muted">{goOn || checking ? "Signing you in…" : "Loading…"}</p>
      </AuthPanel>
    );
  }
  if (auth.user && check !== "bad") return <SignedIn email={auth.user.email} note={check === "loop" ? NOT_OPENED : null} onContinue={proceed} />;
  return (
    <SignInForm
      mode={mode}
      next={next}
      switchHref={`${register ? "/login" : "/register"}${hasNext ? `?next=${encodeURIComponent(next)}` : ""}`}
      linkFailed={linkFailed}
      notice={notice}
      step={step}
      setStep={setStep}
      onVerified={proceed}
    />
  );
}

function SignedIn({ email, note, onContinue }: { email: string | null; note: string | null; onContinue: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <AuthPanel title="You're signed in">
      <p className="text-sm text-muted">
        You&apos;re signed in as <span className="font-medium break-all text-ink">{email ?? "your account"}</span>. Your progress is saved to your account.
      </p>
      {note && <p className="mt-2 text-sm text-muted">{note}</p>}
      <div className="mt-5 space-y-2.5">
        <button type="button" onClick={onContinue} className={PRIMARY}>
          Continue
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await signOut().catch(() => {});
            goToRegister();
          }}
          className={OUTLINE}
        >
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </AuthPanel>
  );
}

type FormProps = {
  mode: Mode;
  next: string;
  /** The other page (/register from /login and back), with ?next= kept. */
  switchHref: string;
  linkFailed: boolean;
  /** Shown above the form from the start (e.g. the session wasn't confirmed). */
  notice: string | null;
  step: "email" | "sent";
  setStep: (s: "email" | "sent") => void;
  onVerified: () => void;
};

function SignInForm({ mode, next, switchHref, linkFailed, notice, step, setStep, onVerified }: FormProps) {
  const register = mode === "register";
  const answers = useAttempts().length;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<null | "check" | "send" | "verify" | "google">(null);
  // /register: the email was found to have an account already (message under the field, with a "Sign in" button).
  const [taken, setTaken] = useState(false);
  // The code being sent is for an existing account: never creates one, never stores a pending name (also for "Resend").
  const [existing, setExisting] = useState(false);
  const [error, setError] = useState<string | null>(linkFailed ? LINK_FAILED : notice);
  const [google, setGoogle] = useState<boolean | null>(null);
  const [sentAt, setSentAt] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let live = true;
    googleEnabled().then((on) => live && setGoogle(on));
    return () => {
      live = false;
    };
  }, []);

  // Tick once a second while the resend cooldown runs.
  const left = sentAt ? Math.max(0, RESEND_SECONDS - Math.floor((now - sentAt) / 1000)) : 0;
  useEffect(() => {
    if (!sentAt) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t - sentAt >= RESEND_SECONDS * 1000) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [sentAt]);

  const send = async (forExisting = existing) => {
    const sb = supabaseBrowser();
    const address = email.trim();
    if (!sb || !address) return;
    const who = name.trim();
    if (register && !forExisting && (!who || who.length > NAME_MAX)) return setError(`Enter your name (1 to ${NAME_MAX} characters).`);
    if (offline()) return setError(OFFLINE);
    setBusy("send");
    setError(null);
    const { error } = await sb.auth
      .signInWithOtp({ email: address, options: { shouldCreateUser: !forExisting, emailRedirectTo: callbackUrl(next) } })
      .catch((e: Error) => ({ error: e }));
    setBusy(null);
    if (error) return setError(explain(error, "send"));
    if (register && !forExisting) setPendingName({ name: who, email: address });
    // Resend in the code step follows the path that actually sent (existing account or new one).
    setExisting(forExisting);
    setTaken(false);
    const t = Date.now();
    setSentAt(t);
    setNow(t);
    setCode("");
    setStep("sent");
  };

  /** Form submit. On /register, first ask whether the email already has an account. */
  const submit = async () => {
    if (!register) return send();
    const address = email.trim();
    const who = name.trim();
    if (!address) return;
    if (!who || who.length > NAME_MAX) return setError(`Enter your name (1 to ${NAME_MAX} characters).`);
    if (offline()) return setError(OFFLINE);
    setBusy("check");
    setError(null);
    const found = await emailExists(address);
    if (found) {
      setBusy(null);
      setExisting(false);
      return setTaken(true);
    }
    return send(false);
  };

  const verify = async (token: string) => {
    const sb = supabaseBrowser();
    if (!sb || token.length !== CODE_LENGTH || busy) return;
    if (offline()) return setError(OFFLINE);
    setBusy("verify");
    setError(null);
    const { error } = await sb.auth.verifyOtp({ email: email.trim(), token, type: "email" }).catch((e: Error) => ({ error: e }));
    setBusy(null);
    if (error) return setError(explain(error, "verify"));
    onVerified();
  };

  const withGoogle = async () => {
    const sb = supabaseBrowser();
    if (!sb) return;
    if (google === false) return setError(GOOGLE_OFF);
    if (offline()) return setError(OFFLINE);
    setError(null);
    setBusy("google");
    // The typed name if there is one; otherwise the name Google gives is used after sign-in.
    if (register) setPendingName({ name: name.trim(), email: null, google: true });
    // A disabled provider would land on a raw Supabase JSON error page, so check again right before leaving.
    if ((await googleEnabled()) === false) {
      setGoogle(false);
      setBusy(null);
      return setError(GOOGLE_OFF);
    }
    const { error } = await sb.auth
      .signInWithOAuth({ provider: "google", options: { redirectTo: callbackUrl(next) } })
      .catch((e: Error) => ({ error: e }));
    if (error) {
      setBusy(null);
      setError(explain(error, "google"));
    }
  };

  if (step === "sent") {
    return (
      <AuthPanel title="Check your email">
        <p className="text-sm text-muted">
          We sent a sign-in email to <span className="font-medium break-all text-ink">{email.trim()}</span>. Open the link in the email, or type the
          code if your email shows one.
        </p>
        <p className="mt-2 text-[13px] text-muted">Open the link on this device, in this browser — otherwise it can&apos;t sign you in here.</p>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            verify(code);
          }}
          className="mt-5 space-y-2.5"
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium">6-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={CODE_LENGTH + 6}
              placeholder="123456"
              value={code}
              onChange={(e) => {
                // Paste-friendly: keep digits only ("123 456", "Code: 123456"), verify as soon as all 6 are in.
                const digits = e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH);
                setCode(digits);
                if (digits.length === CODE_LENGTH && digits !== code) verify(digits);
              }}
              className={`${INPUT} text-center font-mono tracking-[0.4em]`}
            />
          </label>
          {error && <ErrorNote>{error}</ErrorNote>}
          <button type="submit" disabled={busy !== null || code.length !== CODE_LENGTH} className={PRIMARY}>
            {busy === "verify" ? "Checking…" : "Sign in"}
          </button>
        </form>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => send()} disabled={busy !== null || left > 0} className={OUTLINE}>
            {busy === "send" ? "Sending…" : left > 0 ? `Resend in ${left} s` : "Resend email"}
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setCode("");
              setExisting(false);
              setStep("email");
            }}
            disabled={busy !== null}
            className={OUTLINE}
          >
            Different email
          </button>
        </div>
        <p className="mt-3 text-[13px] text-muted">Nothing there? Check spam. The email can take a minute to arrive.</p>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel title={register ? "Create your account" : "Sign in"}>
      <p className="text-sm text-muted">
        {register
          ? `Free to start. Your progress is saved to your account on every device.${answers > 0 ? ` Your ${answers.toLocaleString("en-US")} ${answers === 1 ? "answer" : "answers"} in this browser will move into it.` : ""}`
          : answers > 0
            ? `Keep your ${answers.toLocaleString("en-US")} answers on every device.`
            : "Save your progress on every device."}
      </p>
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          submit();
        }}
        className="mt-5 space-y-2.5"
      >
        {register && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Your name</span>
            <input type="text" required maxLength={NAME_MAX} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
          </label>
        )}
        <div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setTaken(false);
              }}
              aria-invalid={taken || undefined}
              aria-describedby={taken ? "email-taken" : undefined}
              className={INPUT}
            />
          </label>
          {taken && (
            <span id="email-taken" role="alert" className="mt-1.5 block text-sm text-danger">
              An account with this email already exists.
            </span>
          )}
        </div>
        {error && <ErrorNote>{error}</ErrorNote>}
        <button type="submit" disabled={busy !== null} className={PRIMARY}>
          {busy === "check" ? "Checking…" : busy === "send" ? "Sending…" : register ? "Create account" : "Continue"}
        </button>
      </form>
      <div className="my-4 flex items-center xl:my-3 gap-3 text-[13px] text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <button type="button" onClick={withGoogle} disabled={busy !== null || google === false} className={OUTLINE}>
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
          {GOOGLE_G.map(([fill, d]) => (
            <path key={fill} d={d} fill={fill} />
          ))}
        </svg>
        {busy === "google" ? "Opening Google…" : "Continue with Google"}
      </button>
      {google === false && <p className="mt-2 text-[13px] text-muted">{GOOGLE_OFF}</p>}
      <p className="mt-4 text-[13px] text-muted">
        We&apos;ll only email you sign-in codes.{register ? "" : " Your progress in this browser moves into your account."}
      </p>
      <p className="mt-2 text-sm text-muted">
        {register ? "Already have an account? " : "New to Stellar? "}
        <Link href={switchHref} className="font-semibold text-primary-strong hover:underline">
          {register ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </AuthPanel>
  );
}
