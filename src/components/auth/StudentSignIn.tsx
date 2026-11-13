"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { AuthCard, ErrorNote } from "@/components/admin/ResetPassword";
import { signOut, useAuth } from "@/lib/auth-client";
import { useAttempts } from "@/lib/store";
import { supabaseBrowser } from "@/lib/supabase/client";

// /login: students sign in with an email link / 6-digit code (no passwords) or Google, so their progress follows them.
// Email and Google both come back through /auth/callback → /login?next=… (failures add ?auth=failed),
// and this page then sends a signed-in visitor on to `next`.
// Uses useSearchParams, so app/login/page.tsx wraps it in <Suspense>.

const CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const RESEND_SECONDS = 60;
const CODE_LENGTH = 6;

const PRIMARY = "min-h-12 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40";
const OUTLINE = "flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-line px-5 py-3 font-semibold transition-colors hover:bg-surface-2 disabled:opacity-60";
// 16px text: iOS zooms into smaller inputs.
const INPUT = "min-h-12 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary";

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

/** Only paths on this site: blocks //evil.com and /\evil.com (and /login itself, which would loop). */
function safeNext(want: string | null) {
  if (!want || !want.startsWith("/") || want.startsWith("//") || want.startsWith("/\\")) return "/";
  return /^\/login(?:[/?#]|$)/.test(want) ? "/" : want;
}

/** Where email links and Google send the browser back to: the callback, then /login?next=… (which forwards to next). */
function callbackUrl(next: string) {
  const back = `/login?next=${encodeURIComponent(next)}`;
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(back)}`;
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

export function StudentSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const hasNext = params.has("next");
  const next = safeNext(params.get("next"));
  const auth = useAuth();
  // Back from a failed email link / Google (?auth=failed): keep the message, drop the param from the URL.
  const [linkFailed] = useState(() => params.get("auth") === "failed");
  const [step, setStep] = useState<"email" | "sent">("email");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("auth")) return;
    url.searchParams.delete("auth");
    window.history.replaceState(null, "", url.pathname + url.search);
  }, []);

  // Signed in and on the way somewhere (back from the email link / Google, a ?next= link, or the code just worked
  // or the link was opened in another tab of this browser): go on to `next`.
  const goOn = Boolean(auth.user) && (leaving || step === "sent" || (hasNext && !linkFailed));
  useEffect(() => {
    if (goOn) router.replace(next);
  }, [goOn, next, router]);

  if (!CONFIGURED) {
    return (
      <AuthCard title="Sign-in isn't set up yet">
        <p className="text-sm text-muted">Your progress is saved in this browser for now.</p>
      </AuthCard>
    );
  }
  if (!auth.ready || goOn) {
    return (
      <AuthCard title="Sign in">
        <p className="text-sm text-muted">{goOn ? "Signing you in…" : "Loading…"}</p>
      </AuthCard>
    );
  }
  if (auth.user) return <SignedIn email={auth.user.email} onContinue={() => setLeaving(true)} />;
  return <SignInForm next={next} linkFailed={linkFailed} step={step} setStep={setStep} onVerified={() => setLeaving(true)} />;
}

function SignedIn({ email, onContinue }: { email: string | null; onContinue: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <AuthCard title="You're signed in">
      <p className="text-sm text-muted">
        You&apos;re signed in as <span className="font-medium break-all text-ink">{email ?? "your account"}</span>. Your progress is saved to your account.
      </p>
      <div className="mt-6 space-y-3">
        <button type="button" onClick={onContinue} className={PRIMARY}>
          Continue
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await signOut().catch(() => {});
            setBusy(false);
          }}
          className={OUTLINE}
        >
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </AuthCard>
  );
}

type FormProps = {
  next: string;
  linkFailed: boolean;
  step: "email" | "sent";
  setStep: (s: "email" | "sent") => void;
  onVerified: () => void;
};

function SignInForm({ next, linkFailed, step, setStep, onVerified }: FormProps) {
  const answers = useAttempts().length;
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<null | "send" | "verify" | "google">(null);
  const [error, setError] = useState<string | null>(linkFailed ? LINK_FAILED : null);
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

  const send = async () => {
    const sb = supabaseBrowser();
    const address = email.trim();
    if (!sb || !address) return;
    if (offline()) return setError(OFFLINE);
    setBusy("send");
    setError(null);
    const { error } = await sb.auth
      .signInWithOtp({ email: address, options: { shouldCreateUser: true, emailRedirectTo: callbackUrl(next) } })
      .catch((e: Error) => ({ error: e }));
    setBusy(null);
    if (error) return setError(explain(error, "send"));
    const t = Date.now();
    setSentAt(t);
    setNow(t);
    setCode("");
    setStep("sent");
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
      <AuthCard title="Check your email">
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
          className="mt-6 space-y-3"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">6-digit code</span>
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
          <button type="button" onClick={send} disabled={busy !== null || left > 0} className={OUTLINE}>
            {busy === "send" ? "Sending…" : left > 0 ? `Resend in ${left} s` : "Resend email"}
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setCode("");
              setStep("email");
            }}
            disabled={busy !== null}
            className={OUTLINE}
          >
            Different email
          </button>
        </div>
        <p className="mt-4 text-[13px] text-muted">Nothing there? Check spam. The email can take a minute to arrive.</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Sign in">
      <p className="text-sm text-muted">
        {answers > 0 ? `Keep your ${answers.toLocaleString("en-US")} answers on every device.` : "Save your progress on every device."}
      </p>
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          send();
        }}
        className="mt-6 space-y-3"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
          />
        </label>
        {error && <ErrorNote>{error}</ErrorNote>}
        <button type="submit" disabled={busy !== null} className={PRIMARY}>
          {busy === "send" ? "Sending…" : "Continue"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-[13px] text-muted" aria-hidden="true">
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
      <p className="mt-6 text-[13px] text-muted">We&apos;ll only email you sign-in codes. Your progress in this browser moves into your account.</p>
    </AuthCard>
  );
}
