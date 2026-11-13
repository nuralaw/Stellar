// Student data kept in the browser (localStorage). React components read it with useProfile() / useAttempts() etc.,
// which re-render on every change, including changes made in other tabs.
// Guests: the data lives only here. Signed-in students: lib/sync.ts copies it to their account (Supabase user_data).
// This file knows nothing about Supabase: it tells sync.ts about every write through onStoreWrite(), lets it write
// merged results back with applySynced() (which doesn't call the write hooks, so there is no push loop), and lets it
// wipe the account on resetAllData() through onResetAll().
// Sync bookkeeping kept next to the data: "stellar:bookmarks-at" ({ qid: [on 0|1, at] }, so a removed bookmark stays
// removed on other devices) and "stellar:profile-at" (Unix ms of the last profile edit).

import { useSyncExternalStore } from "react";
import type { Difficulty } from "./types";
import { CONTACTS_KEY } from "./contacts";
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
  /** Unix ms when the current module's time runs out (null while on a break / not started / paused). */
  endsAt: number | null;
  /** ms left on the current module when the student saved and left mid-module (the clock is paused). */
  paused?: number;
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
  profileAt: "stellar:profile-at",
  attempts: "stellar:attempts",
  bookmarks: "stellar:bookmarks",
  bookmarksAt: "stellar:bookmarks-at",
  tests: "stellar:tests",
  session: "stellar:test-session",
  lessons: "stellar:lessons",
  vocab: "stellar:vocab",
} as const;

/** Data that follows a signed-in student to their account (lib/sync.ts). */
export type SyncGroup = "profile" | "attempts" | "bookmarks" | "tests" | "lessons" | "vocab";
const GROUP_OF: Partial<Record<string, SyncGroup>> = {
  [KEYS.profile]: "profile",
  [KEYS.attempts]: "attempts",
  [KEYS.bookmarks]: "bookmarks",
  [KEYS.tests]: "tests",
  [KEYS.lessons]: "lessons",
  [KEYS.vocab]: "vocab",
};
/** Bookmark state per question id: [on 0|1, Unix ms of the last toggle] (0 = from before sync existed). */
export type BookmarkMap = Record<string, [0 | 1, number]>;
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

function put(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** A student's own change: saved, shown, and reported to the sync (added = the new attempts, for attempts). */
function write(key: string, value: unknown, added?: Attempt[]) {
  put(key, value);
  listeners.forEach((l) => l());
  const group = GROUP_OF[key];
  if (group) writeHooks.forEach((h) => h(group, added));
}

// ---- hooks for lib/sync.ts (plain callbacks, so this file never imports Supabase) ----
type WriteHook = (group: SyncGroup, added?: Attempt[]) => void;
const writeHooks = new Set<WriteHook>();
const resetHooks = new Set<() => void>();

/** cb runs after every local change of synced data (not for applySynced). Returns unsubscribe. */
export function onStoreWrite(cb: WriteHook): () => void {
  writeHooks.add(cb);
  return () => writeHooks.delete(cb);
}

/** cb runs when the student resets all data (after the local wipe). Returns unsubscribe. */
export function onResetAll(cb: () => void): () => void {
  resetHooks.add(cb);
  return () => resetHooks.delete(cb);
}

/** Values applySynced() takes per group. */
export interface SyncedValues {
  profile: { at: number; data: Profile };
  attempts: Attempt[];
  bookmarks: BookmarkMap;
  tests: TestResult[];
  lessons: Record<string, LessonProgress>;
  vocab: Record<string, VocabState>;
}

/** Writes a merged value from the account (lib/sync.ts): re-renders, but doesn't report a change back to the sync. */
export function applySynced<G extends SyncGroup>(group: G, value: SyncedValues[G]) {
  if (group === "profile") {
    const v = value as SyncedValues["profile"];
    put(KEYS.profile, v.data);
    put(KEYS.profileAt, v.at);
  } else if (group === "bookmarks") {
    const map = value as BookmarkMap;
    // Keep the local order; newly bookmarked ids go last, oldest first.
    const kept = getBookmarks().filter((id) => map[id]?.[0] !== 0);
    const added = Object.keys(map)
      .filter((id) => map[id][0] === 1 && !kept.includes(id))
      .sort((a, b) => map[a][1] - map[b][1]);
    put(KEYS.bookmarksAt, map);
    put(KEYS.bookmarks, [...kept, ...added]);
  } else {
    put(KEYS[group as "attempts" | "tests" | "lessons" | "vocab"], value);
  }
  listeners.forEach((l) => l());
}

/** Removes everything a student made in this browser (progress, sync bookkeeping, test in progress, contacts). Not the competition uid. */
export function clearStudentData() {
  try {
    for (const k of Object.values(KEYS)) localStorage.removeItem(k);
    localStorage.removeItem(CONTACTS_KEY);
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
  put(KEYS.profileAt, Date.now());
  write(KEYS.profile, { ...getProfile(), ...patch });
}

/** Unix ms of the last profile edit in this browser (0 = never / before sync existed). */
export function getProfileAt(): number {
  return read(KEYS.profileAt, (raw) => Number(JSON.parse(raw)) || 0, 0);
}

export function useProfile(): Profile {
  return useSyncExternalStore(subscribe, getProfile, () => DEFAULT_PROFILE);
}

// ---- attempts ----
export function getAttempts(): Attempt[] {
  return read(KEYS.attempts, (raw) => (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : NO_ATTEMPTS), NO_ATTEMPTS);
}

export function addAttempt(a: Attempt) {
  write(KEYS.attempts, [...getAttempts(), a], [a]);
}

export function addAttempts(list: Attempt[]) {
  if (list.length) write(KEYS.attempts, [...getAttempts(), ...list], list);
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
  const on = !list.includes(id);
  put(KEYS.bookmarksAt, { ...readBookmarkMeta(), [id]: [on ? 1 : 0, Date.now()] });
  write(KEYS.bookmarks, on ? [...list, id] : list.filter((x) => x !== id));
}

function readBookmarkMeta(): BookmarkMap {
  return read(KEYS.bookmarksAt, (raw) => {
    const v = JSON.parse(raw);
    return v && typeof v === "object" && !Array.isArray(v) ? v : NO_BOOKMARK_META;
  }, NO_BOOKMARK_META);
}
const NO_BOOKMARK_META: BookmarkMap = {};

/** Every bookmark toggled here, on or off, with when. The list decides on/off; entries without a matching toggle time get at = 0. */
export function getBookmarkMap(): BookmarkMap {
  const list = getBookmarks();
  const out: BookmarkMap = {};
  for (const [id, e] of Object.entries(readBookmarkMeta())) {
    if (!Array.isArray(e)) continue;
    const on = list.includes(id);
    out[id] = [on ? 1 : 0, (e[0] === 1) === on ? Number(e[1]) || 0 : 0];
  }
  for (const id of list) out[id] ??= [1, 0];
  return out;
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

// ---- vocabulary ----
/** One word's progress: s = 0 new, 1 learning, 2 known; r / w = right / wrong quiz answers; at = last change. */
export interface VocabState {
  s: 0 | 1 | 2;
  r: number;
  w: number;
  at: number;
}
const NO_VOCAB: Record<string, VocabState> = {};

export function getVocab(): Record<string, VocabState> {
  return read(KEYS.vocab, (raw) => {
    const v = JSON.parse(raw);
    return v && typeof v === "object" && !Array.isArray(v) ? v : NO_VOCAB;
  }, NO_VOCAB);
}

/** Update one word (by vocabulary id). */
export function setVocab(id: string, patch: Partial<VocabState>) {
  const all = getVocab();
  const cur = all[id] ?? { s: 0, r: 0, w: 0, at: 0 };
  write(KEYS.vocab, { ...all, [id]: { ...cur, ...patch, at: Date.now() } });
}

export function useVocab(): Record<string, VocabState> {
  return useSyncExternalStore(subscribe, getVocab, () => NO_VOCAB);
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

/** "Reset all progress": wipes this browser; when signed in, lib/sync.ts also wipes the account (onResetAll). */
export function resetAllData() {
  clearStudentData();
  resetHooks.forEach((h) => h());
}
