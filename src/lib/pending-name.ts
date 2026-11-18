"use client";

import type { AuthUser } from "./auth-client";
import { supabaseBrowser } from "./supabase/client";
import { getProfile, updateProfile } from "./store";

// The name typed on /register waits here until the first sync after sign-in has finished, then it's put into the
// profile, but only if the profile has no name yet (so signing in to an existing account never overwrites it).
// Applied by <SyncProvider />, so it works whichever way the visitor comes back: code, email link in a new tab, Google.
// The entry belongs to one sign-up attempt: it carries the email that was typed and a time, so a leftover one can't
// land on some other account later.

const KEY = "stellar:pending-name";
const MAX_AGE = 24 * 60 * 60 * 1000;
export const NAME_MAX = 40;

type Pending = {
  /** Typed name; "" = none (Google sign-up without one). */
  name: string;
  /** Email typed on /register (the account must be this one); null for Google, where the address isn't known yet. */
  email: string | null;
  at: number;
  /** Signed up with Google: if there is no typed name, use the first word of Google's name. */
  google?: boolean;
};

export function setPendingName(p: { name: string; email: string | null; google?: boolean }) {
  const entry: Pending = { name: p.name.trim().slice(0, NAME_MAX), email: p.email?.trim().toLowerCase() ?? null, at: Date.now() };
  if (p.google) entry.google = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(entry));
  } catch {}
}

function readPending(): Pending | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Pending> | null;
    if (!v || typeof v.name !== "string" || typeof v.at !== "number" || (v.email !== null && typeof v.email !== "string")) return null;
    return { name: v.name, email: v.email, at: v.at, google: v.google === true };
  } catch {
    return null;
  }
}

function clearPending() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

/** First word of the name Google gave (user_metadata.full_name / name), if any. */
async function googleFirstName(): Promise<string | null> {
  const { data } = (await supabaseBrowser()?.auth.getSession().catch(() => null)) ?? { data: null };
  const meta = data?.session?.user.user_metadata as { full_name?: unknown; name?: unknown } | undefined;
  const full = typeof meta?.full_name === "string" ? meta.full_name : typeof meta?.name === "string" ? meta.name : "";
  return full.trim().split(/\s+/)[0]?.slice(0, NAME_MAX) || null;
}

/** Call once the first sync of `user` has finished. One attempt: the entry is removed whatever happens. */
export async function applyPendingName(user: AuthUser) {
  const pending = readPending();
  if (!pending) {
    clearPending(); // unreadable or old-format leftover
    return;
  }
  clearPending();
  if (Date.now() - pending.at > MAX_AGE) return;
  if (pending.email !== null && pending.email !== (user.email ?? "").toLowerCase()) return;
  if (getProfile().name.trim()) return;
  const name = pending.name || (pending.google ? await googleFirstName() : null);
  if (!name) return;
  if (!getProfile().name.trim()) updateProfile({ name });
}
