// Student data kept in the browser (localStorage) until Supabase sync lands (Day 5).
// React components read it with useProfile() / useAttempts(), which re-render on every change,
// including changes made in other tabs.

import { useSyncExternalStore } from "react";
import type { Difficulty } from "./types";
import type { SectionId } from "./taxonomy";

export const AVATARS = ["🦊", "🐼", "🦉", "🐯", "🐙", "🚀", "⭐", "📚", "🎯", "🧠", "🌙", "🔥"] as const;

export interface Profile {
  name: string;
  avatar: string;
  /** 400–1600, multiple of 10. */
  targetScore: number | null;
  /** Local date "YYYY-MM-DD". */
  testDate: string | null;
}

export interface Attempt {
  qid: string;
  section: SectionId;
  domain: string;
  skill: string;
  difficulty: Difficulty;
  correct: boolean;
  /** Unix ms. */
  at: number;
}

export const DEFAULT_PROFILE: Profile = { name: "", avatar: AVATARS[0], targetScore: null, testDate: null };
const NO_ATTEMPTS: Attempt[] = [];

const KEYS = { profile: "stellar:profile", attempts: "stellar:attempts" } as const;

// ---- low-level read/write with a parse cache (useSyncExternalStore needs stable snapshots) ----
const cache = new Map<string, { raw: string | null; value: unknown }>();
const listeners = new Set<() => void>();

function read<T>(key: string, parse: (raw: string) => T, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {}
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value = fallback;
  if (raw) {
    try {
      value = parse(raw);
    } catch {}
  }
  cache.set(key, { raw, value });
  return value;
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key?.startsWith("stellar:") && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// ---- profile ----
export function getProfile(): Profile {
  return read(KEYS.profile, (raw) => ({ ...DEFAULT_PROFILE, ...JSON.parse(raw) }) as Profile, DEFAULT_PROFILE);
}

export function updateProfile(patch: Partial<Profile>) {
  write(KEYS.profile, { ...getProfile(), ...patch });
}

export function useProfile(): Profile {
  return useSyncExternalStore(subscribe, getProfile, () => DEFAULT_PROFILE);
}

// ---- attempts ----
export function getAttempts(): Attempt[] {
  return read(KEYS.attempts, (raw) => (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : NO_ATTEMPTS), NO_ATTEMPTS);
}

export function addAttempt(a: Attempt) {
  write(KEYS.attempts, [...getAttempts(), a]);
}

export function useAttempts(): Attempt[] {
  return useSyncExternalStore(subscribe, getAttempts, () => NO_ATTEMPTS);
}

// ---- clock ----
// Current time as an external store: 0 on the server, refreshed every minute in the browser.
let clockNow = 0;
const clockListeners = new Set<() => void>();
let clockTimer: ReturnType<typeof setInterval> | undefined;

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  clockTimer ??= setInterval(() => {
    clockNow = Date.now();
    clockListeners.forEach((l) => l());
  }, 60_000);
  return () => {
    clockListeners.delete(listener);
    if (!clockListeners.size && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = undefined;
    }
  };
}

/** Unix ms, updated each minute; 0 during server render. */
export function useNow(): number {
  return useSyncExternalStore(
    subscribeClock,
    () => (clockNow ||= Date.now()),
    () => 0,
  );
}

// ---- misc ----
/** false during server render / hydration, true once browser data can be read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function resetAllData() {
  try {
    localStorage.removeItem(KEYS.profile);
    localStorage.removeItem(KEYS.attempts);
  } catch {}
  listeners.forEach((l) => l());
}
