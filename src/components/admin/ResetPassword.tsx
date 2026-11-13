"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { PAGE } from "@/lib/ui";

// /auth/reset: the email link signed the visitor in (via /auth/callback), now they pick a new password.

export const FIELD = "w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
export const PRIMARY = "mt-2 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40";

/** Same card as the admin sign-in. */
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={PAGE}>
      <div className="mx-auto max-w-sm rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="mt-2">{children}</div>
      </div>
    </section>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
      {children}
    </p>
  );
}

type State = "checking" | "ready" | "expired" | "off";

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<State>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const sb = supabaseBrowser();
    const check = sb ? sb.auth.getUser().then(({ data }) => data.user) : Promise.resolve(undefined);
    check.then((user) => {
      if (!live) return;
      setEmail(user?.email ?? "");
      setState(user === undefined ? "off" : user ? "ready" : "expired");
    });
    return () => {
      live = false;
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== again) return setError("The passwords don't match.");
    const sb = supabaseBrowser();
    if (!sb) return;
    setBusy(true);
    setError(null);
    const { error } = await sb.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else router.replace("/admin");
  };

  if (state === "checking") {
    return (
      <AuthCard title="Set a new password">
        <p className="text-sm text-muted">Loading…</p>
      </AuthCard>
    );
  }
  if (state === "off") {
    return (
      <AuthCard title="Sign-in isn't set up">
        <p className="text-sm text-muted">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the environment, then reload.</p>
      </AuthCard>
    );
  }
  if (state === "expired") {
    return (
      <AuthCard title="Link expired">
        <p className="text-sm text-muted">This reset link is invalid or was already used. Ask for a new one.</p>
        <Link href="/auth/forgot" className={`${PRIMARY} mt-6 block text-center`}>
          Send a new link
        </Link>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Set a new password">
      <p className="text-sm text-muted">
        For <span className="font-medium text-ink">{email}</span>
      </p>
      <form onSubmit={save} className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">New password</span>
          <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={FIELD} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Repeat it</span>
          <input type="password" required minLength={8} autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} className={FIELD} />
        </label>
        {error && <ErrorNote>{error}</ErrorNote>}
        <button type="submit" disabled={busy} className={PRIMARY}>
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
    </AuthCard>
  );
}
