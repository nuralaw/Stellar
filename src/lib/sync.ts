// Student accounts: copies the progress in localStorage (lib/store.ts) to the signed-in student's account
// (Supabase table user_data, supabase/user_data.sql) and back, so it survives a cleared browser and follows them to
// other devices. Guests are untouched: nothing runs until someone signs in. Browser only; started by <SyncProvider />.
//
// Cloud rows (one per user per key):
//   profile          { at, data: Profile }                     newer `at` wins (first sign-in: empty fields filled from the other side)
//   bookmarks        { qid: [on 0|1, at] }                     per question, newer toggle wins (so removals stay removed)
//   tests            TestResult[]                              union by id
//   lessons          { slug: LessonProgress }                  per lesson, newer `at` wins
//   vocab            { id: VocabState }                        per word, newer `at` wins
//   attempts:DAY     [qid, skill, "e"|"m"|"h", 0|1, at][]      answers of one UTC day, union by qid + at
//                    (+ section, domain at the end only when the skill isn't in lib/taxonomy.ts)
// Every merge is idempotent and order-free, so two tabs or devices doing the same merge can't fight.
//
// Flow: on sign-in → owner check (another account's data in this browser is wiped first, never merged) → pull, merge,
// write merged locally, push what the cloud lacks. Local writes → marked dirty (also in localStorage, so a closed tab
// is pushed on the next visit) → pushed after 2 s (fetch row, merge, upsert). Focus → pull rows changed since the last
// pull (at most once a minute). Status for the UI: lib/sync-status.ts.

import type { SupabaseClient } from "@supabase/supabase-js";
import { getAuth, onAuthChange, signOut, type AuthUser } from "./auth-client";
import {
  DEFAULT_PROFILE,
  applySynced,
  clearStudentData,
  getAttempts,
  getBookmarkMap,
  getLessonProgress,
  getProfile,
  getProfileAt,
  getTestResults,
  getVocab,
  onResetAll,
  onStoreWrite,
  type Attempt,
  type BookmarkMap,
  type LessonProgress,
  type Profile,
  type SyncGroup,
  type TestResult,
  type VocabState,
} from "./store";
import { supabaseBrowser } from "./supabase/client";
import { setSyncState, getSyncState } from "./sync-status";
import { DOMAINS, type SectionId } from "./taxonomy";
import type { Difficulty } from "./types";

// =====================================================================================================
// Pure merge helpers (exported for tests)
// =====================================================================================================

/** Cloud keys besides the attempts:DAY rows. */
export type DocKey = Exclude<SyncGroup, "attempts">;
export const DOC_KEYS: DocKey[] = ["profile", "bookmarks", "tests", "lessons", "vocab"];

type DiffLetter = "e" | "m" | "h";
export type AttemptTuple =
  | [qid: string, skill: string, difficulty: DiffLetter, correct: 0 | 1, at: number]
  | [qid: string, skill: string, difficulty: DiffLetter, correct: 0 | 1, at: number, section: SectionId, domain: string];

const LETTER: Record<Difficulty, DiffLetter> = { easy: "e", medium: "m", hard: "h" };
const DIFFICULTY: Record<DiffLetter, Difficulty> = { e: "easy", m: "medium", h: "hard" };
const SKILL_HOME = new Map<string, { section: SectionId; domain: string }>(
  DOMAINS.flatMap((d) => d.skills.map((s) => [s.id, { section: d.section, domain: d.id }] as const)),
);

/** "YYYY-MM-DD" of a Unix ms time, in UTC (the attempts row it belongs to). */
export function utcDay(at: number): string {
  return new Date(at).toISOString().slice(0, 10);
}

/** Identity of an attempt when merging. */
export function attemptId(a: Pick<Attempt, "qid" | "at">): string {
  return `${a.qid}@${a.at}`;
}

export function packAttempt(a: Attempt): AttemptTuple {
  const t: AttemptTuple = [a.qid, a.skill, LETTER[a.difficulty] ?? "m", a.correct ? 1 : 0, a.at];
  const home = SKILL_HOME.get(a.skill);
  return home && home.section === a.section && home.domain === a.domain ? t : [...t, a.section, a.domain];
}

/** null for anything malformed. */
export function unpackAttempt(t: unknown): Attempt | null {
  if (!Array.isArray(t) || t.length < 5) return null;
  const [qid, skill, d, c, at, section, domain] = t as unknown[];
  if (typeof qid !== "string" || typeof skill !== "string" || typeof at !== "number" || !(d === "e" || d === "m" || d === "h")) return null;
  const home =
    section === "rw" || section === "math"
      ? { section: section as SectionId, domain: typeof domain === "string" ? domain : "" }
      : (SKILL_HOME.get(skill) ?? { section: (qid.startsWith("rw") ? "rw" : "math") as SectionId, domain: "" });
  return { qid, section: home.section, domain: home.domain, skill, difficulty: DIFFICULTY[d], correct: c === 1, at };
}

function byTime(a: Attempt, b: Attempt) {
  return a.at - b.at || (a.qid < b.qid ? -1 : a.qid > b.qid ? 1 : 0);
}

/** Union by qid + at (the first copy wins), sorted by time. */
export function mergeAttempts(local: Attempt[], remote: Attempt[]): Attempt[] {
  const seen = new Set<string>();
  const out: Attempt[] = [];
  for (const a of [...local, ...remote]) {
    const id = attemptId(a);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(a);
  }
  return out.sort(byTime);
}

export function splitByDay(list: Attempt[]): Map<string, Attempt[]> {
  const days = new Map<string, Attempt[]>();
  for (const a of list) {
    const d = utcDay(a.at);
    const arr = days.get(d);
    if (arr) arr.push(a);
    else days.set(d, [a]);
  }
  return days;
}

/** Cloud value of one day row. */
export function packDay(list: Attempt[]): AttemptTuple[] {
  return mergeAttempts(list, []).map(packAttempt);
}

export function unpackDay(v: unknown): Attempt[] {
  if (!Array.isArray(v)) return [];
  return v.map(unpackAttempt).filter((a): a is Attempt => a !== null);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Per question, the newer toggle wins; on a tie, "on" wins. */
export function mergeBookmarks(local: BookmarkMap, remote: unknown): BookmarkMap {
  const out: BookmarkMap = { ...local };
  if (!isRecord(remote)) return out;
  for (const [id, e] of Object.entries(remote)) {
    if (!Array.isArray(e) || (e[0] !== 0 && e[0] !== 1)) continue;
    const r: [0 | 1, number] = [e[0], Number(e[1]) || 0];
    const l = out[id];
    if (!l || r[1] > l[1] || (r[1] === l[1] && r[0] > l[0])) out[id] = r;
  }
  return out;
}

export type ProfileDoc = { at: number; data: Profile };

function emptyField(v: unknown) {
  return v === null || v === undefined || v === "";
}

/**
 * Newer `at` wins (a tie keeps the cloud copy). On the first merge for an account, the winner's empty fields are
 * filled from the other side, and `at` moves to now so every device takes the filled profile.
 */
export function mergeProfile(local: ProfileDoc, remote: unknown, first: boolean, now = Date.now()): ProfileDoc {
  if (!isRecord(remote) || !isRecord(remote.data)) return local;
  const cloud: ProfileDoc = { at: Number(remote.at) || 0, data: { ...DEFAULT_PROFILE, ...(remote.data as Partial<Profile>) } };
  const [win, lose] = local.at > cloud.at ? [local, cloud] : [cloud, local];
  if (!first) return win;
  const data = { ...win.data } as Record<string, unknown>;
  let filled = false;
  for (const [k, v] of Object.entries(lose.data)) {
    if (emptyField(data[k]) && !emptyField(v)) {
      data[k] = v;
      filled = true;
    }
  }
  return filled ? { at: Math.max(now, win.at + 1), data: data as unknown as Profile } : win;
}

/** Union by id (the local copy wins), sorted by time. */
export function mergeTests(local: TestResult[], remote: unknown): TestResult[] {
  const ids = new Set(local.map((r) => r.id));
  const extra = Array.isArray(remote) ? (remote as TestResult[]).filter((r) => isRecord(r) && typeof r.id === "string" && !ids.has(r.id)) : [];
  if (!extra.length) return local;
  return [...local, ...extra].sort((a, b) => (a.at ?? 0) - (b.at ?? 0));
}

/** Per entry, the newer `at` wins (a tie keeps the remote copy). */
export function mergeByAt<T extends { at?: number }>(local: Record<string, T>, remote: unknown): Record<string, T> {
  const out: Record<string, T> = { ...local };
  if (!isRecord(remote)) return out;
  for (const [k, v] of Object.entries(remote)) {
    if (!isRecord(v)) continue;
    const l = out[k];
    if (!l || (Number(v.at) || 0) >= (Number(l.at) || 0)) out[k] = v as T;
  }
  return out;
}

/** JSON with sorted object keys (Postgres jsonb reorders keys), for "did anything change?" checks. */
export function canon(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map((x) => (x === undefined ? "null" : canon(x))).join(",")}]`;
  if (isRecord(v)) {
    return `{${Object.keys(v)
      .filter((k) => v[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canon(v[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

// =====================================================================================================
// Sync engine (browser)
// =====================================================================================================

const OWNER_KEY = "stellar:sync-owner"; // account whose progress this browser holds
const SINCE_KEY = "stellar:sync-since"; // max updated_at (server clock) pulled so far
const DIRTY_KEY = "stellar:sync-dirty"; // { k: DocKey[], d: day[] } changed here, not pushed yet
const RESET_KEY = "stellar:sync-reset"; // user id whose cloud rows still have to be deleted
const PUSH_DELAY = 2_000;
const PULL_EVERY = 60_000;
const PAGE = 1000;
const UPSERT_CHUNK = 50;
/** Pulls overlap by this much: a row committed late can carry a slightly older updated_at. Re-merging is harmless. */
const PULL_OVERLAP = 10_000;

type Row = { key: string; value: unknown; updated_at: string };

let started = false;
let user: AuthUser | null = null;
/** User whose first pull finished in this tab (until then, pushes wait and a retry redoes the first pull). */
let readyFor: string | null = null;
/** Bumped on every user change / wipe: work begun before it must not write anything locally. */
let generation = 0;
let pushTimer: ReturnType<typeof setTimeout> | undefined;
let lastPull = 0;
let chain: Promise<void> = Promise.resolve();
let pendingFlush: Promise<void> | null = null;
const dirtyKeys = new Set<DocKey>();
const dirtyDays = new Set<string>();

function ls(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function lsGet(key: string): string | null {
  try {
    return ls()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function lsSet(key: string, v: string | null) {
  try {
    if (v === null) ls()?.removeItem(key);
    else ls()?.setItem(key, v);
  } catch {}
}

function client(): SupabaseClient | null {
  return supabaseBrowser() as SupabaseClient | null; // @supabase/ssr keeps one instance per browser
}

// ---- dirty bookkeeping (memory + localStorage, so pushes survive a closed tab) ----
function loadDirty() {
  try {
    const v = JSON.parse(lsGet(DIRTY_KEY) ?? "{}");
    for (const k of Array.isArray(v.k) ? v.k : []) if (DOC_KEYS.includes(k)) dirtyKeys.add(k);
    for (const d of Array.isArray(v.d) ? v.d : []) if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) dirtyDays.add(d);
  } catch {}
}

function saveDirty() {
  lsSet(DIRTY_KEY, dirtyKeys.size || dirtyDays.size ? JSON.stringify({ k: [...dirtyKeys], d: [...dirtyDays] }) : null);
}

function takeDirty() {
  loadDirty(); // other tabs' marks too (pushing the same key twice is harmless)
  const out = { keys: new Set(dirtyKeys), days: new Set(dirtyDays) };
  dirtyKeys.clear();
  dirtyDays.clear();
  saveDirty();
  return out;
}

function putBackDirty(keys: Iterable<DocKey>, days: Iterable<string>, gen: number) {
  if (gen !== generation) return;
  loadDirty();
  for (const k of keys) dirtyKeys.add(k);
  for (const d of days) dirtyDays.add(d);
  saveDirty();
}

function onLocalWrite(group: SyncGroup, added?: Attempt[]) {
  // Track changes once this browser belongs to an account or someone is signing in (a guest's data is all pushed on
  // the first sign-in anyway). Kept while signed out, so answers given after a session expired are pushed later.
  if (!user && !lsGet(OWNER_KEY)) return;
  loadDirty();
  if (group !== "attempts") dirtyKeys.add(group);
  else for (const d of new Set((added ?? getAttempts()).map((a) => utcDay(a.at)))) dirtyDays.add(d);
  saveDirty();
  if (user && readyFor === user.id) schedulePush(PUSH_DELAY);
}

function schedulePush(ms: number) {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void flush(), ms);
}

// ---- status ----
function isNetworkError(e: unknown) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  const msg = e instanceof Error ? e.message : String((e as { message?: unknown })?.message ?? e);
  return /fetch|network|load failed|timed? ?out|abort/i.test(msg);
}

function fail(e: unknown) {
  if (isNetworkError(e)) setSyncState({ status: "offline", error: undefined });
  else {
    const msg = e instanceof Error ? e.message : String((e as { message?: unknown })?.message ?? "Sync failed");
    setSyncState({ status: "error", error: msg.slice(0, 120) });
  }
}

/** Runs sync work one at a time. */
function enqueue(fn: () => Promise<void>): Promise<void> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
}

// ---- cloud I/O ----
async function fetchRows(sb: SupabaseClient, uid: string, filter: { keys?: string[]; since?: string }): Promise<Row[]> {
  const rows: Row[] = [];
  if (filter.keys && !filter.keys.length) return rows;
  for (let from = 0; ; from += PAGE) {
    let q = sb.from("user_data").select("key,value,updated_at").eq("user_id", uid);
    if (filter.keys) q = q.in("key", filter.keys);
    if (filter.since) q = q.gt("updated_at", filter.since);
    const { data, error } = await q.order("key").range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as Row[]));
    if (!data || data.length < PAGE) return rows;
  }
}

async function upsertRows(sb: SupabaseClient, uid: string, rows: { key: string; value: unknown }[]) {
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK).map((r) => ({ user_id: uid, key: r.key, value: r.value }));
    const { error } = await sb.from("user_data").upsert(chunk, { onConflict: "user_id,key" });
    if (error) throw error;
  }
}

async function deleteAllRows(sb: SupabaseClient, uid: string) {
  const { error } = await sb.from("user_data").delete().eq("user_id", uid);
  if (error) throw error;
}

function noteSeen(rows: Row[]) {
  let max = Date.parse(lsGet(SINCE_KEY) ?? "") || 0;
  for (const r of rows) max = Math.max(max, Date.parse(r.updated_at) || 0);
  if (max) lsSet(SINCE_KEY, new Date(max).toISOString());
}

/**
 * Merges cloud rows into local data for the given keys / days, writes merged values locally (without a push loop),
 * and upserts every row the cloud lacks something in. Keys / days without a cloud row are pushed if local has data.
 */
async function reconcile(sb: SupabaseClient, uid: string, gen: number, rows: Row[], keys: Set<DocKey>, days: Set<string>, first: boolean) {
  const cloud = new Map(rows.map((r) => [r.key, r.value]));
  const push: { key: string; value: unknown }[] = [];
  const stale = () => gen !== generation;
  if (stale()) return;

  for (const key of keys) {
    const remote = cloud.get(key);
    let local: unknown, merged: unknown, out: unknown;
    if (key === "profile") {
      local = { at: getProfileAt(), data: getProfile() };
      merged = out = mergeProfile(local as ProfileDoc, remote, first);
    } else if (key === "bookmarks") {
      local = getBookmarkMap();
      merged = out = mergeBookmarks(local as BookmarkMap, remote);
    } else if (key === "tests") {
      local = getTestResults();
      merged = out = mergeTests(local as TestResult[], remote);
    } else if (key === "lessons") {
      local = getLessonProgress();
      merged = out = mergeByAt<LessonProgress>(local as Record<string, LessonProgress>, remote);
    } else {
      local = getVocab();
      merged = out = mergeByAt<VocabState>(local as Record<string, VocabState>, remote);
    }
    if (canon(merged) !== canon(local)) applySynced(key, merged as never);
    // Nothing to store for a student who never touched this (no row, empty value).
    const empty = key === "profile" ? (local as ProfileDoc).at === 0 && canon((merged as ProfileDoc).data) === canon(DEFAULT_PROFILE) : canon(out) === "[]" || canon(out) === "{}";
    if (remote === undefined ? !empty : canon(out) !== canon(remote)) push.push({ key, value: out });
  }

  if (days.size) {
    const local = getAttempts();
    const byDay = splitByDay(local);
    let all = local;
    for (const day of days) {
      const remote = cloud.get(`attempts:${day}`);
      const remoteList = unpackDay(remote);
      const mergedDay = mergeAttempts(byDay.get(day) ?? [], remoteList);
      if (remoteList.length) all = mergeAttempts(all, remoteList);
      const packed = packDay(mergedDay);
      if (packed.length && (remote === undefined || canon(packed) !== canon(remote))) push.push({ key: `attempts:${day}`, value: packed });
    }
    if (all !== local && canon(all) !== canon(local)) applySynced("attempts", all);
  }

  if (push.length) await upsertRows(sb, uid, push);
}

/** First pull for this user in this tab: everything on a new account / browser, else what changed + our dirty keys. */
async function initialSync(sb: SupabaseClient, u: AuthUser, gen: number) {
  const owner = lsGet(OWNER_KEY);
  const first = owner !== u.id;
  await runPendingReset(sb, u.id);
  if (first) {
    const { keys: dk, days: dd } = takeDirty();
    try {
      const rows = await fetchRows(sb, u.id, {});
      if (gen !== generation) return;
      const days = new Set([...splitByDay(getAttempts()).keys(), ...rows.filter((r) => r.key.startsWith("attempts:")).map((r) => r.key.slice(9))]);
      await reconcile(sb, u.id, gen, rows, new Set(DOC_KEYS), days, true);
      noteSeen(rows);
    } catch (e) {
      putBackDirty(dk, dd, gen);
      throw e;
    }
  } else {
    await pullChanges(sb, u.id, gen);
    await pushDirty(sb, u.id, gen);
  }
  if (gen !== generation) return;
  lsSet(OWNER_KEY, u.id);
  readyFor = u.id;
}

async function pullChanges(sb: SupabaseClient, uid: string, gen: number) {
  const sinceMs = Date.parse(lsGet(SINCE_KEY) ?? "") || 0;
  const rows = await fetchRows(sb, uid, sinceMs ? { since: new Date(sinceMs - PULL_OVERLAP).toISOString() } : {});
  if (gen !== generation) return;
  const keys = new Set(rows.map((r) => r.key).filter((k): k is DocKey => (DOC_KEYS as string[]).includes(k)));
  const days = new Set(rows.filter((r) => r.key.startsWith("attempts:")).map((r) => r.key.slice(9)));
  await reconcile(sb, uid, gen, rows, keys, days, false);
  noteSeen(rows);
  lastPull = Date.now();
}

async function pushDirty(sb: SupabaseClient, uid: string, gen: number) {
  const { keys, days } = takeDirty();
  if (!keys.size && !days.size) return;
  try {
    const rows = await fetchRows(sb, uid, { keys: [...keys, ...[...days].map((d) => `attempts:${d}`)] });
    await reconcile(sb, uid, gen, rows, keys, days, false);
  } catch (e) {
    putBackDirty(keys, days, gen);
    throw e;
  }
}

async function runPendingReset(sb: SupabaseClient, uid: string) {
  if (lsGet(RESET_KEY) !== uid) return;
  await deleteAllRows(sb, uid);
  if (lsGet(RESET_KEY) === uid) lsSet(RESET_KEY, null);
}

/** One sync step for the signed-in user, with status updates. "pull" = pull + push, "push" = push only. Run via enqueue. */
async function runStep(kind: "pull" | "push") {
  const u = user;
  const sb = client();
  if (!u || !sb) return;
  const gen = generation;
  setSyncState({ status: "syncing" });
  try {
    if (readyFor !== u.id) await initialSync(sb, u, gen);
    else {
      await runPendingReset(sb, u.id);
      if (kind === "pull") await pullChanges(sb, u.id, gen);
      await pushDirty(sb, u.id, gen);
    }
    if (gen !== generation || user?.id !== u.id) return;
    setSyncState({ status: "synced", at: Date.now(), error: undefined });
    // Changes made while this step ran.
    if (dirtyKeys.size || dirtyDays.size) schedulePush(PUSH_DELAY);
  } catch (e) {
    if (gen === generation && user?.id === u.id) fail(e);
    throw e;
  }
}

function step(kind: "pull" | "push"): Promise<void> {
  return enqueue(() => runStep(kind));
}

/** Pushes pending changes now (one queued flush at a time). */
function flush(): Promise<void> {
  clearTimeout(pushTimer);
  if (!user) return Promise.resolve();
  pendingFlush ??= enqueue(() => {
    pendingFlush = null;
    return runStep("push");
  });
  return pendingFlush;
}

function handleUser(next: AuthUser | null) {
  generation++;
  clearTimeout(pushTimer);
  readyFor = null;
  user = next;
  lastPull = 0;
  if (!next) {
    // Signed out or session expired: keep local data (unsynced answers must survive), just stop.
    setSyncState({ status: "off", at: null, error: undefined });
    return;
  }
  const owner = lsGet(OWNER_KEY);
  if (owner && owner !== next.id) clearLocalStudentData(); // never merge another account's progress into this one
  setSyncState({ status: "syncing", at: null, error: undefined });
  step("pull").catch(() => {});
}

function onFocus() {
  if (!user || document.visibilityState === "hidden") return;
  const failed = getSyncState().status === "offline" || getSyncState().status === "error";
  if (!failed && readyFor === user.id && Date.now() - lastPull < PULL_EVERY) return;
  lastPull = Date.now();
  step("pull").catch(() => {});
}

function onVisibility() {
  if (document.visibilityState === "hidden") {
    if (user && (dirtyKeys.size || dirtyDays.size)) flush().catch(() => {});
  } else onFocus();
}

function onOnline() {
  if (user) step("pull").catch(() => {});
}

function onReset() {
  // resetAllData() already wiped this browser. Forget pending pushes; wipe the account too.
  generation++;
  clearTimeout(pushTimer);
  dirtyKeys.clear();
  dirtyDays.clear();
  saveDirty();
  resetAccountData().catch(() => {});
}

// =====================================================================================================
// Public API
// =====================================================================================================

/** Starts the sync (idempotent). Called once by <SyncProvider />. */
export function startSync(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  loadDirty();
  onStoreWrite(onLocalWrite);
  onResetAll(onReset);
  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("online", onOnline);
  onAuthChange(handleUser);
}

/** Pulls what changed and pushes pending changes now. Rejects if the sync failed (status says why). */
export function syncNow(): Promise<void> {
  if (!user) return Promise.resolve();
  lastPull = Date.now();
  return step("pull");
}

/** Removes the student's data from this browser: progress, bookkeeping, owner, test in progress, contacts. */
export function clearLocalStudentData(): void {
  generation++;
  clearTimeout(pushTimer);
  dirtyKeys.clear();
  dirtyDays.clear();
  clearStudentData();
  for (const k of [OWNER_KEY, SINCE_KEY, DIRTY_KEY, RESET_KEY]) lsSet(k, null);
  readyFor = null;
}

/** Pushes what's pending (up to ~5 s), signs out, and clears this browser so the next person starts fresh. */
export async function signOutAndClear(): Promise<void> {
  if (user) await Promise.race([flush().catch(() => {}), new Promise((r) => setTimeout(r, 5_000))]);
  generation++;
  user = null;
  readyFor = null;
  clearTimeout(pushTimer);
  try {
    await signOut();
  } catch {}
  clearLocalStudentData();
  setSyncState({ status: "off", at: null, error: undefined });
}

/** Deletes all of the signed-in student's cloud rows (retried on the next sync if it can't reach the server now). */
export async function resetAccountData(): Promise<void> {
  const uid = user?.id ?? getAuth().user?.id ?? lsGet(OWNER_KEY);
  if (!uid) return;
  lsSet(RESET_KEY, uid);
  const sb = client();
  if (!sb || !user) return; // signed out: done on the next sign-in
  await enqueue(async () => {
    setSyncState({ status: "syncing" });
    try {
      await runPendingReset(sb, uid);
      setSyncState({ status: "synced", at: Date.now(), error: undefined });
    } catch (e) {
      fail(e);
      throw e;
    }
  });
}
