"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "./supabase/client";

// The signed-in student in the browser (Supabase Auth, session in cookies).
// UI only: servers must check the session themselves (lib/admin.ts currentUser()).

/** False when the Supabase env vars aren't set: there are no accounts then (inlined at build time). */
export const AUTH_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export type AuthUser = { id: string; email: string | null };
export type AuthState = { ready: boolean; user: AuthUser | null };

const SERVER: AuthState = { ready: false, user: null };
let state: AuthState = SERVER;
let started = false;
const listeners = new Set<() => void>();

function set(user: User | null) {
  const next = user ? { id: user.id, email: user.email ?? null } : null;
  if (state.ready && state.user?.id === next?.id && state.user?.email === next?.email) return;
  state = { ready: true, user: next };
  listeners.forEach((l) => l());
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const sb = supabaseBrowser();
  if (!sb) {
    set(null);
    return;
  }
  sb.auth.getSession().then(({ data }) => set(data.session?.user ?? null), () => set(null));
  sb.auth.onAuthStateChange((_event, session) => set(session?.user ?? null));
}

function subscribe(cb: () => void) {
  start();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** { ready: false } until the session is known; then { ready: true, user }. */
export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

export function getAuth(): AuthState {
  start();
  return state;
}

/** Runs cb on every change of the signed-in user (and once with the current state when it's known). Returns unsubscribe. */
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  let last: string | null | undefined;
  const run = () => {
    if (!state.ready) return;
    const id = state.user?.id ?? null;
    if (id === last) return;
    last = id;
    cb(state.user);
  };
  const off = subscribe(run);
  run();
  return off;
}

/** Full page load of /register (after signing out: the rest of the site is behind registration, and no stale state is kept). */
export function goToRegister() {
  window.location.href = new URL("/register", window.location.origin).href;
}

/** Signs out in this browser (the cookie session). */
export async function signOut() {
  await supabaseBrowser()?.auth.signOut();
}
