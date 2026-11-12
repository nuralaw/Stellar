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
  /** IANA time zone of the test location (picked by country in Profile); null = this device's zone. */
  testTimeZone: string | null;
  /** Section the student wants to work on first (set in "Build your plan"); null = not sure. */
  focusSection: SectionId | null;
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

/** A finished practice (mock) test. Scores: sections 200–800, total 400–1600. */
export interface TestResult {
  id: string;
  /** Unix ms when the test was finished. */
  at: number;
  total: number;
  rw: number;
  math: number;
  /** Which past paper (content/tests); absent on results from before tests existed. */
  testId?: string;
  title?: string;
  /** "full" = both sections (counts toward the score trend); "rw"/"math" = one section only (total = that section). */
  kind?: "full" | "rw" | "math";
  /** Student's response per question key ("rw1-01" → "B"), for reviewing the test later. */
  responses?: Record<string, string>;
  /** Correct answers per section. */
  raw?: { rw?: number; math?: number };
}

/** A practice test in progress (one at a time), so a reload doesn't lose it. */
export interface TestSession {
  testId: string;
  /** Module order, e.g. ["rw1", "rw2", "math1", "math2"]. */
  modules: string[];
  /** Index into modules. */
  module: number;
  /** Unix ms when the current module's time runs out (null while on a break / not started). */
  endsAt: number | null;
  responses: Record<string, string>;
  marked: string[];
  startedAt: number;
}

export const DEFAULT_PROFILE: Profile = { name: "", avatar: AVATARS[0], targetScore: null, testDate: null, testTimeZone: null, focusSection: null };
const NO_ATTEMPTS: Attempt[] = [];

/** Where a student is in one lesson (/lessons/[slug]). */
export interface LessonProgress {
  /** Step to resume at (0-based; === steps on the "lesson complete" screen). */
  step: number;
  /** Furthest step reached. */
  max: number;
  /** Step count when last saved (the lesson file can change). */
  steps: number;
  /** The lesson version's fingerprint when last saved (lib/lessons.ts). */
  sig?: string;
  /** Answer per step index: the response ("2" = option index for quizzes, the choice/number for checks) and whether it was right. */
  picks: Record<number, { r: string; ok: boolean }>;
  /** Unix ms when first finished. */
  done?: number;
  /** Parts (subtopics) finished: part index → Unix ms. */
  parts?: Record<number, number>;
  /** Unix ms of the last change. */
  at: number;
}

const KEYS = {
  profile: "stellar:profile",
  attempts: "stellar:attempts",
  bookmarks: "stellar:bookmarks",
  tests: "stellar:tests",
  session: "stellar:test-session",
  lessons: "stellar:lessons",
} as const;
const NO_LESSONS: Record<string, LessonProgress> = {};
const NO_BOOKMARKS: string[] = [];
const NO_TESTS: TestResult[] = [];

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

// ---- anonymous participant id (competition leaderboards) ----
/** A random id for this browser, created on first use. It identifies the student on leaderboards until sign-in exists. */
export function getUserId(): string {
  let id: string | null = null;
  try {
    id = localStorage.getItem("stellar:uid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("stellar:uid", id);
    }
  } catch {}
  return id ?? "00000000-0000-0000-0000-000000000000";
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

export function addAttempts(list: Attempt[]) {
  if (list.length) write(KEYS.attempts, [...getAttempts(), ...list]);
}

export function useAttempts(): Attempt[] {
  return useSyncExternalStore(subscribe, getAttempts, () => NO_ATTEMPTS);
}

// ---- bookmarks (question ids) ----
export function getBookmarks(): string[] {
  return read(KEYS.bookmarks, (raw) => (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : NO_BOOKMARKS), NO_BOOKMARKS);
}

export function toggleBookmark(id: string) {
  const list = getBookmarks();
  write(KEYS.bookmarks, list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
}

export function useBookmarks(): string[] {
  return useSyncExternalStore(subscribe, getBookmarks, () => NO_BOOKMARKS);
}

// ---- practice test results (written by the practice test when it lands) ----
export function getTestResults(): TestResult[] {
  return read(KEYS.tests, (raw) => (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : NO_TESTS), NO_TESTS);
}

export function addTestResult(r: TestResult) {
  write(KEYS.tests, [...getTestResults(), r]);
}

export function useTestResults(): TestResult[] {
  return useSyncExternalStore(subscribe, getTestResults, () => NO_TESTS);
}

/** Full tests only (both sections): the ones with a 400–1600 total for the score trend. */
export function isFullTest(r: TestResult) {
  return !r.kind || r.kind === "full";
}

export function getTestSession(): TestSession | null {
  return read<TestSession | null>(KEYS.session, (raw) => JSON.parse(raw), null);
}

export function saveTestSession(s: TestSession | null) {
  if (s) write(KEYS.session, s);
  else {
    try {
      localStorage.removeItem(KEYS.session);
    } catch {}
    listeners.forEach((l) => l());
  }
}

export function useTestSession(): TestSession | null {
  return useSyncExternalStore(subscribe, getTestSession, () => null);
}

// ---- lesson progress (slug → progress) ----
export function getLessonProgress(): Record<string, LessonProgress> {
  return read(KEYS.lessons, (raw) => {
    const v = JSON.parse(raw);
    return v && typeof v === "object" && !Array.isArray(v) ? v : NO_LESSONS;
  }, NO_LESSONS);
}

export function saveLessonProgress(slug: string, p: LessonProgress) {
  write(KEYS.lessons, { ...getLessonProgress(), [slug]: p });
}

export function useLessonProgress(): Record<string, LessonProgress> {
  return useSyncExternalStore(subscribe, getLessonProgress, () => NO_LESSONS);
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
    localStorage.removeItem(KEYS.bookmarks);
    localStorage.removeItem(KEYS.tests);
    localStorage.removeItem(KEYS.session);
    localStorage.removeItem(KEYS.lessons);
  } catch {}
  listeners.forEach((l) => l());
}
