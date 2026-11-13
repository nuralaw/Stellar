"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useAuth } from "@/lib/auth-client";
import { useSyncState } from "@/lib/sync-status";
import { clearLocalStudentData, signOutAndClear } from "@/lib/sync";
import { loginHref, syncLabel } from "./sync-label";

const outlineBtn =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50";

/** /profile "Account": sign in, or who is signed in + sync status, sign out and delete account. */
export function AccountSection() {
  const auth = useAuth();
  const sync = syncLabel(useSyncState());
  const router = useRouter();
  const [busy, setBusy] = useState<"signout" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignOut = async () => {
    setBusy("signout");
    setError(null);
    try {
      await signOutAndClear();
      router.push("/");
    } catch {
      setError("Couldn't sign out. Check your connection and try again.");
      setBusy(null);
    }
  };

  const onDelete = async () => {
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't delete the account. Please try again.");
      clearLocalStudentData();
      await signOut().catch(() => {});
      router.push("/");
    } catch (e) {
      setError(e instanceof TypeError ? "No connection. Please try again." : (e as Error).message);
      setBusy(null);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-semibold">Account</h2>

      {!auth.ready ? (
        <div className="mt-2 h-5 w-56 max-w-full animate-pulse rounded bg-surface-2" aria-hidden="true" />
      ) : !auth.user ? (
        <>
          <p className="mt-1 text-sm text-muted">Your progress is saved only in this browser.</p>
          <Link href={loginHref("/profile")} className={`mt-4 ${outlineBtn}`}>
            Sign in to keep it
          </Link>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">
            Signed in as <span className="font-medium break-all text-ink">{auth.user.email ?? "your account"}</span>
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted" title={sync.title} role="status">
            <span className={`h-2 w-2 shrink-0 rounded-full ${sync.dot}`} aria-hidden="true" />
            <span className="min-w-0">
              {sync.text}
              {sync.detail && ` · ${sync.detail}`}
            </span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" onClick={onSignOut} disabled={busy !== null} className={outlineBtn}>
              {busy === "signout" ? "Signing out…" : "Sign out"}
            </button>
            {!confirmDelete && (
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(true);
                  setError(null);
                }}
                disabled={busy !== null}
                className="inline-flex min-h-10 items-center text-sm font-semibold text-danger hover:underline disabled:opacity-50"
              >
                Delete account…
              </button>
            )}
          </div>

          {confirmDelete && (
            <div className="mt-4 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm" role="alertdialog" aria-labelledby="delete-account-title">
              <p id="delete-account-title" className="font-medium">
                This deletes your account and all synced progress. It can&apos;t be undone.
              </p>
              {/* Safe choice first, so a double click on "Delete account…" can't delete anything. */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={busy === "delete"}
                  className="min-h-10 rounded-lg bg-surface px-4 py-2 font-semibold ring-1 ring-line hover:bg-surface-2 disabled:opacity-50"
                >
                  Keep my account
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={busy !== null}
                  className="min-h-10 rounded-lg bg-danger px-4 py-2 font-semibold text-surface disabled:opacity-60"
                >
                  {busy === "delete" ? "Deleting…" : "Delete account"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
