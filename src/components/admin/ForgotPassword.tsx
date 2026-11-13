"use client";

import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AuthCard, ErrorNote, FIELD, PRIMARY } from "./ResetPassword";

// /auth/forgot: email → reset link → /auth/callback?next=/auth/reset → new password.

/** Small link for the sign-in form, under the password field. */
export function ForgotPasswordLink() {
  return (
    <Link href="/auth/forgot" className="text-sm font-medium text-muted hover:text-accent">
      Forgot password?
    </Link>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb) return setError("Sign-in isn't set up on this site.");
    setBusy(true);
    setError(null);
    const to = email.trim();
    const { error } = await sb.auth.resetPasswordForEmail(to, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset`,
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSentTo(to);
  };

  if (sentTo) {
    return (
      <AuthCard title="Check your email">
        <p className="text-sm text-muted">
          If <span className="font-medium text-ink">{sentTo}</span> has an account, a reset link is on its way. Open it in this browser.
        </p>
        <Link href="/admin" className="mt-6 block w-full rounded-xl border border-line px-5 py-3 text-center font-semibold hover:bg-surface-2">
          Back to sign in
        </Link>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Reset password">
      <p className="text-sm text-muted">We&apos;ll email you a link to set a new password.</p>
      <form onSubmit={send} className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} />
        </label>
        {error && <ErrorNote>{error}</ErrorNote>}
        <button type="submit" disabled={busy} className={PRIMARY}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <Link href="/admin" className="mt-4 block text-center text-sm font-medium text-muted hover:text-accent">
        Back to sign in
      </Link>
    </AuthCard>
  );
}
