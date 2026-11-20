import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Difficulty } from "./types";
import type { SectionId } from "./taxonomy";
import { applyElo, matchResult, matchWindow, type MatchResult } from "./elo.ts";
import {
  LEADERBOARD_MIN_MATCHES,
  MATCH_SIZE,
  MAX_MATCHES_PER_DAY,
  MAX_WAITING_MATCHES,
  MS_PER_S,
  RATING_FLOOR,
  REMATCH_COOLDOWN_H,
  START_RATING,
  WAITING_EXPIRY_H,
} from "./elo-config.ts";

// Storage of ranked matches (docs/ELO.md section 8). One interface, two implementations:
//  - Supabase (production): SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and supabase/elo.sql applied. REST for rows, RPC for the atomic
//    parts (finish, void, claim, leaderboards, season close). The tables have RLS on with no policies.
//  - Local file (development fallback): .data/elo.json, the same rules in TypeScript (finish uses applyElo, claim uses matchWindow).
//    Doesn't work on Vercel (read-only file system).
// The store only stores and applies the rules of the database. Who may play, which questions a match gets, scoring an answer and the
// full-screen rule belong to elo-server.ts (stage 3).
// Times are Unix ms everywhere. Methods that take `now` use it as the clock in the local store (so tests can move time); the
// Supabase store uses the database clock for finish / void / leaderboards and `now` only where it sends a timestamp.

export type MatchStatus = "playing_a" | "waiting" | "playing_b" | "finished" | "expired" | "void";
export type MatchMode = "mixed" | "rw" | "math";
export type Forfeit = "a" | "b";
export type Board = "global" | "season" | "week";
export type AnswerStatus = "open" | "answered" | "timeout" | "annulled";

/** A player's rating row. `name` / `avatar` are the public leaderboard identity (set from the profile when a match starts). */
export interface EloPlayerRecord {
  userId: string;
  rating: number;
  peak: number;
  /** Finished matches only. */
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  name: string;
  avatar: string;
  /** Last rating change (leaderboard tie-break: who reached the rating first). */
  updatedAt: number;
}

export interface EloMatch {
  id: string;
  mode: MatchMode;
  status: MatchStatus;
  playerA: string;
  playerB: string | null;
  /** Exactly MATCH_SIZE question ids, in the order both players get them. */
  questionIds: string[];
  createdAt: number;
  aFinishedAt: number | null;
  bStartedAt: number | null;
  finishedAt: number | null;
  /** aFinishedAt + 48 h. */
  expiresAt: number | null;
  pointsA: number | null;
  pointsB: number | null;
  forfeit: Forfeit | null;
  result: MatchResult | null;
  ratingABefore: number | null;
  ratingBBefore: number | null;
  deltaA: number | null;
  deltaB: number | null;
}

/** What `updateMatch` may change. The status moves on through claimWaiting / finishMatch / voidMatch, never through a patch. */
export interface MatchPatch {
  /** playing_a -> waiting (A is done) or waiting -> expired. Moving to "waiting" sets expiresAt = aFinishedAt + 48 h unless given. */
  status?: "waiting" | "expired";
  aFinishedAt?: number;
  expiresAt?: number;
  pointsA?: number;
  pointsB?: number;
  forfeit?: Forfeit;
}

export interface EloAnswer {
  matchId: string;
  userId: string;
  idx: number;
  qid: string;
  section: SectionId;
  difficulty: Difficulty;
  limitS: number;
  issuedAt: number;
  answeredAt: number | null;
  response: string | null;
  elapsedMs: number | null;
  status: AnswerStatus;
  correct: boolean | null;
  base: number;
  bonus: number;
  points: number;
}

export interface NewAnswer {
  matchId: string;
  userId: string;
  idx: number;
  qid: string;
  section: SectionId;
  difficulty: Difficulty;
  limitS: number;
  issuedAt?: number;
}

/** How an open question row is closed (answered, timed out, or annulled). */
export interface AnswerClose {
  status: "answered" | "timeout" | "annulled";
  answeredAt: number | null;
  response: string | null;
  elapsedMs: number | null;
  correct: boolean | null;
  base: number;
  bonus: number;
  points: number;
}

/** The stored result of finishing or voiding a match. `changed` is false when the call found the match already done. */
export interface MatchOutcome {
  matchId: string;
  status: MatchStatus;
  result: MatchResult | null;
  forfeit: Forfeit | null;
  pointsA: number | null;
  pointsB: number | null;
  ratingABefore: number | null;
  ratingBBefore: number | null;
  deltaA: number | null;
  deltaB: number | null;
  ratingAAfter: number | null;
  ratingBAfter: number | null;
  finishedAt: number | null;
  changed: boolean;
}

/** A leaderboard row: public fields only (no ids, no emails). */
export interface LeaderRow {
  /** Null for "me" when the player is not on the board yet (too few matches). */
  rank: number | null;
  name: string;
  avatar: string;
  rating: number;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  /** Week board only. */
  points?: number;
}

export interface LeaderPage {
  /** Players on the board (not just this page). */
  total: number;
  rows: LeaderRow[];
  me: LeaderRow | null;
}

export interface MatchLists {
  /** The match this user is playing right now (A in playing_a, B in playing_b). */
  active: EloMatch | null;
  /** Matches this user created and finished their part of, still without a result: status waiting or playing_b. */
  waiting: EloMatch[];
  /** Finished / expired / void matches of either role, newest first. */
  recent: EloMatch[];
}

export class EloSetupError extends Error {}
export class EloStoreUnavailable extends Error {}
/** An id that can't be an id at all (not a UUID in the Supabase store). Reads return null / empty instead; writes throw this (API: 400). */
export class EloInvalidIdError extends Error {}
/** finishMatch / voidMatch of a match that doesn't exist (API: 404). */
export class EloNotFoundError extends Error {}
/** The player already has a match in progress (playing_a / playing_b) and can't claim another (API: 409). */
export class EloActiveMatchError extends Error {}
/** A per-player limit of docs/ELO.md 5.4 was hit: the API turns it into 429. */
export class EloLimitError extends Error {
  kind: "waiting" | "daily";
  constructor(kind: "waiting" | "daily", message: string) {
    super(message);
    this.kind = kind;
  }
}

export interface EloStore {
  readonly kind: "supabase" | "file";
  /** Gets the player's row, creating it at 1000 first. A given name / avatar replaces the stored one (the profile is the source). */
  ensurePlayer(userId: string, profile?: { name?: string; avatar?: string }, now?: number): Promise<EloPlayerRecord>;
  getPlayer(userId: string): Promise<EloPlayerRecord | null>;
  /** Several rows at once (opponent names), keyed by user id; unknown ids are absent. */
  getPlayers(userIds: string[]): Promise<Record<string, EloPlayerRecord>>;
  /** A new match in status playing_a. Throws EloLimitError at 3 waiting matches or 30 started matches in the last 24 h. */
  createMatch(input: { mode: MatchMode; playerA: string; questionIds: string[]; now?: number }): Promise<EloMatch>;
  /**
   * Takes the oldest waiting match this player may join (5.4) and makes them player B; null if none. Expires stale matches first.
   * Throws EloActiveMatchError if the player already has a match in progress, EloLimitError at the daily limit.
   */
  claimWaiting(input: { userId: string; rating: number; mode: MatchMode; now?: number }): Promise<EloMatch | null>;
  getMatch(id: string): Promise<EloMatch | null>;
  /** Applies the patch; with `onlyIfStatus` only while the match is in one of these statuses. Returns the updated match, or null when nothing was updated. */
  updateMatch(id: string, patch: MatchPatch, onlyIfStatus?: MatchStatus[]): Promise<EloMatch | null>;
  /** Active / waiting / recent matches of a user. Expires stale waiting matches first. */
  listMatches(userId: string, opts?: { now?: number; recentLimit?: number }): Promise<MatchLists>;
  /** Matches of this user (as A) in status waiting. */
  countWaiting(userId: string): Promise<number>;
  /** Matches this user started since the given time (created as A, or joined as B). */
  countStarted(userId: string, sinceMs: number): Promise<number>;
  /** Writes the open row of a question when it is issued. A repeated call returns the existing row untouched. */
  openAnswer(a: NewAnswer): Promise<EloAnswer>;
  /** The player's rows of a match, ordered by idx. */
  getAnswers(matchId: string, userId: string): Promise<EloAnswer[]>;
  /** Closes an OPEN row. Returns null when the row doesn't exist or is already closed (the API answers 409). */
  closeAnswer(matchId: string, userId: string, idx: number, close: AnswerClose): Promise<EloAnswer | null>;
  /** Question ids this player was issued since the given time (5.2: avoid repeats). */
  recentQuestionIds(userId: string, sinceMs: number): Promise<string[]>;
  /**
   * Atomically applies the rating change of a playing_b match whose points are already stored. Idempotent. A match whose second player
   * is gone (account deleted) becomes void with no rating change. Throws EloNotFoundError for an unknown match.
   */
  finishMatch(matchId: string, now?: number): Promise<MatchOutcome>;
  /** Voids a match, reverting its rating change if it was applied. Idempotent. Throws EloNotFoundError for an unknown match. */
  voidMatch(matchId: string, now?: number): Promise<MatchOutcome>;
  leaderboard(input: { board: Board; page?: number; size?: number; userId?: string | null; now?: number }): Promise<LeaderPage>;
  /** Saves the final table of a finished month 'YYYY-MM'. Returns the number of rows; calling again changes nothing. */
  closeSeason(season: string, now?: number): Promise<number>;
  /** Waiting matches older than 48 h become expired (no rating change). Returns how many. */
  expireStale(now?: number): Promise<number>;
}

/* ---------------- shared helpers ---------------- */

const HOUR_MS = 60 * 60 * MS_PER_S;
const DAY_MS = 24 * HOUR_MS;
const BOARD_PAGE_MAX = 50;
/** Keeps (page - 1) x size far from the int limit of the database function. */
const BOARD_PAGE_LIMIT = 1_000_000;
const RECENT_DEFAULT = 10;
const SETUP_MESSAGE =
  "Ranked tables aren't set up: run supabase/elo.sql (npm run db:apply -- supabase/elo.sql, or paste it into the Supabase SQL Editor).";

function expiryOf(aFinishedAt: number | null): number | null {
  return aFinishedAt === null ? null : aFinishedAt + WAITING_EXPIRY_H * HOUR_MS;
}

/** Fills expiresAt when a match moves to "waiting". */
function withExpiry(patch: MatchPatch, current: Pick<EloMatch, "aFinishedAt">): MatchPatch {
  if (patch.status !== "waiting" || patch.expiresAt !== undefined) return patch;
  const exp = expiryOf(patch.aFinishedAt ?? current.aFinishedAt);
  return exp === null ? patch : { ...patch, expiresAt: exp };
}

function checkQuestionIds(ids: string[]) {
  if (ids.length !== MATCH_SIZE || ids.some((q) => typeof q !== "string" || q === "")) {
    throw new Error(`A match needs exactly ${MATCH_SIZE} question ids`);
  }
}

function checkIdx(idx: number) {
  if (!Number.isInteger(idx) || idx < 0 || idx >= MATCH_SIZE) throw new Error(`Question slot must be 0-${MATCH_SIZE - 1}`);
}

function clampPage(page: number | undefined): number {
  return Math.min(BOARD_PAGE_LIMIT, Math.max(1, Math.floor(page ?? 1)));
}

function clampSize(size: number | undefined): number {
  return Math.min(BOARD_PAGE_MAX, Math.max(1, Math.floor(size ?? BOARD_PAGE_MAX)));
}

/** When this match last mattered to the user: created (as A) or joined (as B). Lists are newest first by this time. */
function activityAt(userId: string, m: EloMatch): number {
  return m.playerB === userId ? (m.bStartedAt ?? m.createdAt) : m.createdAt;
}

/** Splits one user's matches into the groups of MatchLists. */
function classify(userId: string, all: EloMatch[], recentLimit: number): MatchLists {
  const sorted = [...all].sort((x, y) => activityAt(userId, y) - activityAt(userId, x));
  const active = sorted.find((m) => (m.playerA === userId && m.status === "playing_a") || (m.playerB === userId && m.status === "playing_b")) ?? null;
  const waiting = sorted.filter((m) => m.playerA === userId && (m.status === "waiting" || m.status === "playing_b"));
  const recent = sorted.filter((m) => m.status === "finished" || m.status === "expired" || m.status === "void").slice(0, recentLimit);
  return { active, waiting, recent };
}

function outcomeOf(m: EloMatch, changed: boolean): MatchOutcome {
  return {
    matchId: m.id,
    status: m.status,
    result: m.result,
    forfeit: m.forfeit,
    pointsA: m.pointsA,
    pointsB: m.pointsB,
    ratingABefore: m.ratingABefore,
    ratingBBefore: m.ratingBBefore,
    deltaA: m.deltaA,
    deltaB: m.deltaB,
    ratingAAfter: m.ratingABefore === null || m.deltaA === null ? null : m.ratingABefore + m.deltaA,
    ratingBAfter: m.ratingBBefore === null || m.deltaB === null ? null : m.ratingBBefore + m.deltaB,
    finishedAt: m.finishedAt,
    changed,
  };
}

/** UTC calendar month containing `now`: [start, end) in ms, and its 'YYYY-MM' key. */
function monthWindow(now: number): { from: number; to: number; key: string } {
  const d = new Date(now);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  return { from: Date.UTC(y, m, 1), to: Date.UTC(y, m + 1, 1), key: `${y}-${String(m + 1).padStart(2, "0")}` };
}

/** UTC week (Monday 00:00 -> next Monday) containing `now`: [start, end) in ms. */
function weekWindow(now: number): { from: number; to: number } {
  const d = new Date(now);
  const sinceMonday = (d.getUTCDay() + 6) % 7;
  const from = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - sinceMonday);
  return { from, to: from + 7 * DAY_MS };
}

/** [start, end) of a 'YYYY-MM' season, or null if the key is malformed. */
function seasonWindow(season: string): { from: number; to: number } | null {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(season);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  return { from: Date.UTC(y, mo - 1, 1), to: Date.UTC(y, mo, 1) };
}

/* ---------------- local file ---------------- */

interface HistoryRow {
  id: number;
  userId: string;
  matchId: string;
  at: number;
  ratingBefore: number;
  ratingAfter: number;
  /** "reset": an admin put the rating back to 1000 (supabase/elo-admin.sql). */
  reason: "match" | "void" | "reset";
}

interface SeasonRow {
  season: string;
  userId: string;
  place: number;
  rating: number;
}

export interface LocalDb {
  players: Record<string, EloPlayerRecord>;
  matches: Record<string, EloMatch>;
  /** Key: matchId|userId|idx. */
  answers: Record<string, EloAnswer>;
  history: HistoryRow[];
  seasons: SeasonRow[];
  nextHistoryId: number;
}

const emptyDb = (): LocalDb => ({ players: {}, matches: {}, answers: {}, history: [], seasons: [], nextHistoryId: 1 });
const answerKey = (matchId: string, userId: string, idx: number) => `${matchId}|${userId}|${idx}`;

/** File-backed store with the rules of supabase/elo.sql in TypeScript. Single process, synchronous read-modify-write per call. */
export function createLocalStore(file: string): EloStore {
  function load(): LocalDb {
    try {
      return { ...emptyDb(), ...JSON.parse(fs.readFileSync(/* turbopackIgnore: true */ file, "utf8")) };
    } catch {
      return emptyDb();
    }
  }
  function save(db: LocalDb) {
    try {
      fs.mkdirSync(/* turbopackIgnore: true */ path.dirname(file), { recursive: true });
      fs.writeFileSync(/* turbopackIgnore: true */ file, JSON.stringify(db));
    } catch (e) {
      throw new EloStoreUnavailable(`Can't write ${file}: ${(e as Error).message}. Configure Supabase for production.`);
    }
  }
  /** Runs a mutation on a fresh copy of the file and saves the result. */
  function write<T>(fn: (db: LocalDb) => T): T {
    const db = load();
    const out = fn(db);
    save(db);
    return out;
  }

  function newPlayer(userId: string, now: number): EloPlayerRecord {
    return { userId, rating: START_RATING, peak: START_RATING, matches: 0, wins: 0, losses: 0, draws: 0, name: "", avatar: "", updatedAt: now };
  }

  function expire(db: LocalDb, now: number): number {
    let n = 0;
    for (const m of Object.values(db.matches)) {
      const exp = m.expiresAt ?? expiryOf(m.aFinishedAt);
      if (m.status === "waiting" && exp !== null && exp <= now) {
        m.status = "expired";
        n++;
      }
    }
    return n;
  }

  const waitingOf = (db: LocalDb, userId: string) => Object.values(db.matches).filter((m) => m.playerA === userId && m.status === "waiting").length;
  const startedSince = (db: LocalDb, userId: string, since: number) =>
    Object.values(db.matches).filter((m) => (m.playerA === userId && m.createdAt >= since) || (m.playerB === userId && (m.bStartedAt ?? 0) >= since)).length;

  function applyFinish(db: LocalDb, m: EloMatch, now: number): MatchOutcome {
    if (m.status !== "playing_b") return outcomeOf(m, false);
    if (m.playerB === null) {
      // The second player's account is gone: nobody to rate against, so the match is void and no rating changes.
      m.status = "void";
      return outcomeOf(m, true);
    }
    if (m.pointsA === null || m.pointsB === null) throw new Error(`Match ${m.id} has no points yet`);
    const pa = (db.players[m.playerA] ??= newPlayer(m.playerA, now));
    const pb = (db.players[m.playerB] ??= newPlayer(m.playerB, now));
    const result = matchResult(m.pointsA, m.pointsB, m.forfeit ?? undefined);
    const out = applyElo({ a: { rating: pa.rating, matches: pa.matches }, b: { rating: pb.rating, matches: pb.matches }, result });
    const ratingABefore = pa.rating;
    const ratingBBefore = pb.rating;
    for (const [p, after, won, lost] of [
      [pa, out.ratingA, result === "a", result === "b"],
      [pb, out.ratingB, result === "b", result === "a"],
    ] as const) {
      db.history.push({ id: db.nextHistoryId++, userId: p.userId, matchId: m.id, at: now, ratingBefore: p.rating, ratingAfter: after, reason: "match" });
      p.rating = after;
      p.peak = Math.max(p.peak, after);
      p.matches += 1;
      if (won) p.wins += 1;
      else if (lost) p.losses += 1;
      else p.draws += 1;
      p.updatedAt = now;
    }
    m.status = "finished";
    m.result = result;
    m.ratingABefore = ratingABefore;
    m.ratingBBefore = ratingBBefore;
    m.deltaA = out.deltaA;
    m.deltaB = out.deltaB;
    m.finishedAt = now;
    return outcomeOf(m, true);
  }

  function applyVoid(db: LocalDb, m: EloMatch, now: number): MatchOutcome {
    if (m.status === "void") return outcomeOf(m, false);
    const wasFinished = m.status === "finished";
    m.status = "void";
    if (wasFinished) {
      for (const [id, delta, own] of [
        [m.playerA, m.deltaA, "a"],
        [m.playerB, m.deltaB, "b"],
      ] as const) {
        const p = id === null ? undefined : db.players[id];
        if (!p) continue;
        // A rating reset after this match already wiped its effect: taking the delta off again would punish the player twice.
        const resetAt = db.history.filter((h) => h.userId === p.userId && h.reason === "reset").reduce((t, h) => Math.max(t, h.at), -Infinity);
        const alreadyReset = m.finishedAt !== null && resetAt > m.finishedAt;
        const rating = alreadyReset ? p.rating : Math.max(RATING_FLOOR, p.rating - (delta ?? 0));
        db.history.push({ id: db.nextHistoryId++, userId: p.userId, matchId: m.id, at: now, ratingBefore: p.rating, ratingAfter: rating, reason: "void" });
        p.rating = rating;
        p.matches = Math.max(0, p.matches - 1);
        if (m.result === own) p.wins = Math.max(0, p.wins - 1);
        else if (m.result === "draw") p.draws = Math.max(0, p.draws - 1);
        else p.losses = Math.max(0, p.losses - 1);
        // The peak counts only matches after the player's latest reset (a reset puts it back to 1000).
        const kept = db.history.filter((h) => h.userId === p.userId && h.reason === "match" && h.at > resetAt && db.matches[h.matchId]?.status !== "void");
        p.peak = Math.max(rating, ...kept.map((h) => h.ratingAfter), START_RATING);
        p.updatedAt = now;
      }
    }
    return outcomeOf(m, wasFinished);
  }

  function toRow(p: EloPlayerRecord, rank: number | null, points?: number): LeaderRow {
    const row: LeaderRow = { rank, name: p.name, avatar: p.avatar, rating: p.rating, matches: p.matches, wins: p.wins, losses: p.losses, draws: p.draws };
    if (points !== undefined) row.points = points;
    return row;
  }

  function board(db: LocalDb, o: { board: Board; page?: number; size?: number; userId?: string | null; now: number }): LeaderPage {
    const size = clampSize(o.size);
    const page = clampPage(o.page);
    // Candidates with their sort keys: higher k1, then higher k2, then lower k3, then lower k4, then user id.
    const items: { u: string; k1: number; k2: number; k3: number; k4: number; points?: number }[] = [];
    if (o.board === "global") {
      for (const p of Object.values(db.players)) {
        if (p.matches >= LEADERBOARD_MIN_MATCHES.global) items.push({ u: p.userId, k1: p.rating, k2: p.matches, k3: 0, k4: p.updatedAt });
      }
    } else if (o.board === "season") {
      const w = monthWindow(o.now);
      const count: Record<string, number> = {};
      for (const m of Object.values(db.matches)) {
        if (m.status !== "finished" || m.finishedAt === null || m.finishedAt < w.from || m.finishedAt >= w.to) continue;
        count[m.playerA] = (count[m.playerA] ?? 0) + 1;
        if (m.playerB !== null) count[m.playerB] = (count[m.playerB] ?? 0) + 1;
      }
      for (const [u, c] of Object.entries(count)) {
        const p = db.players[u];
        if (p && c >= LEADERBOARD_MIN_MATCHES.season) items.push({ u, k1: p.rating, k2: p.matches, k3: 0, k4: p.updatedAt });
      }
    } else {
      const w = weekWindow(o.now);
      const parts: { u: string; mid: string; pts: number }[] = [];
      for (const m of Object.values(db.matches)) {
        if (m.status !== "void" && m.pointsA !== null && m.aFinishedAt !== null && m.aFinishedAt >= w.from && m.aFinishedAt < w.to) {
          parts.push({ u: m.playerA, mid: m.id, pts: m.pointsA });
        }
        if (m.status === "finished" && m.playerB !== null && m.pointsB !== null && m.finishedAt !== null && m.finishedAt >= w.from && m.finishedAt < w.to) {
          parts.push({ u: m.playerB, mid: m.id, pts: m.pointsB });
        }
      }
      const byUser: Record<string, { points: number; correct: number; ms: number }> = {};
      for (const pt of parts) {
        const acc = (byUser[pt.u] ??= { points: 0, correct: 0, ms: 0 });
        acc.points += pt.pts;
        for (let i = 0; i < MATCH_SIZE; i++) {
          const a = db.answers[answerKey(pt.mid, pt.u, i)];
          if (!a) continue;
          if (a.correct === true) acc.correct += 1;
          acc.ms += a.elapsedMs ?? 0;
        }
      }
      for (const [u, acc] of Object.entries(byUser)) {
        if (db.players[u]) items.push({ u, k1: acc.points, k2: acc.correct, k3: acc.ms, k4: 0, points: acc.points });
      }
    }
    items.sort((x, y) => y.k1 - x.k1 || y.k2 - x.k2 || x.k3 - y.k3 || x.k4 - y.k4 || (x.u < y.u ? -1 : x.u > y.u ? 1 : 0));
    const week = o.board === "week";
    const rowOf = (it: (typeof items)[number], i: number) => toRow(db.players[it.u], i + 1, week ? it.points : undefined);
    const rows = items.slice((page - 1) * size, page * size).map((it, i) => rowOf(it, (page - 1) * size + i));
    let me: LeaderRow | null = null;
    if (o.userId) {
      const at = items.findIndex((it) => it.u === o.userId);
      if (at >= 0) me = rowOf(items[at], at);
      else if (db.players[o.userId]) me = toRow(db.players[o.userId], null, week ? 0 : undefined);
    }
    return { total: items.length, rows, me };
  }

  return {
    kind: "file",

    async ensurePlayer(userId, profile, now = Date.now()) {
      return write((db) => {
        const p = (db.players[userId] ??= newPlayer(userId, now));
        if (profile?.name !== undefined) p.name = profile.name;
        if (profile?.avatar !== undefined) p.avatar = profile.avatar;
        return { ...p };
      });
    },
    async getPlayer(userId) {
      return load().players[userId] ?? null;
    },
    async getPlayers(userIds) {
      const db = load();
      const out: Record<string, EloPlayerRecord> = {};
      for (const id of userIds) if (db.players[id]) out[id] = db.players[id];
      return out;
    },

    async createMatch({ mode, playerA, questionIds, now = Date.now() }) {
      checkQuestionIds(questionIds);
      return write((db) => {
        expire(db, now);
        // The database has a unique index on (player_a) where status = playing_a; the same rule here.
        if (Object.values(db.matches).some((x) => x.playerA === playerA && x.status === "playing_a")) throw new EloActiveMatchError("The player already has a match in progress");
        if (waitingOf(db, playerA) >= MAX_WAITING_MATCHES) throw new EloLimitError("waiting", `At most ${MAX_WAITING_MATCHES} matches can wait for an opponent`);
        if (startedSince(db, playerA, now - DAY_MS) >= MAX_MATCHES_PER_DAY) throw new EloLimitError("daily", `At most ${MAX_MATCHES_PER_DAY} matches a day`);
        const m: EloMatch = {
          id: randomUUID(),
          mode,
          status: "playing_a",
          playerA,
          playerB: null,
          questionIds: [...questionIds],
          createdAt: now,
          aFinishedAt: null,
          bStartedAt: null,
          finishedAt: null,
          expiresAt: null,
          pointsA: null,
          pointsB: null,
          forfeit: null,
          result: null,
          ratingABefore: null,
          ratingBBefore: null,
          deltaA: null,
          deltaB: null,
        };
        db.matches[m.id] = m;
        return { ...m };
      });
    },

    async claimWaiting({ userId, rating, mode, now = Date.now() }) {
      return write((db) => {
        if (Object.values(db.matches).some((m) => (m.playerA === userId && m.status === "playing_a") || (m.playerB === userId && m.status === "playing_b"))) {
          throw new EloActiveMatchError("The player already has a match in progress");
        }
        expire(db, now);
        if (startedSince(db, userId, now - DAY_MS) >= MAX_MATCHES_PER_DAY) throw new EloLimitError("daily", `At most ${MAX_MATCHES_PER_DAY} matches a day`);
        const candidates = Object.values(db.matches)
          .filter((m) => m.status === "waiting" && m.mode === mode && m.playerA !== userId)
          .sort((x, y) => x.createdAt - y.createdAt);
        const hit = candidates.find((m) => {
          const ratingA = db.players[m.playerA]?.rating ?? START_RATING;
          const waited = (now - (m.aFinishedAt ?? m.createdAt)) / HOUR_MS;
          if (Math.abs(ratingA - rating) > matchWindow(waited)) return false;
          const rematch = Object.values(db.matches).some(
            (x) =>
              x.status !== "void" &&
              x.playerB !== null &&
              ((x.playerA === m.playerA && x.playerB === userId) || (x.playerA === userId && x.playerB === m.playerA)) &&
              (x.bStartedAt ?? x.createdAt) > now - REMATCH_COOLDOWN_H * HOUR_MS,
          );
          return !rematch;
        });
        if (!hit) return null;
        hit.status = "playing_b";
        hit.playerB = userId;
        hit.bStartedAt = now;
        return { ...hit };
      });
    },

    async getMatch(id) {
      return load().matches[id] ?? null;
    },
    async updateMatch(id, patch, onlyIfStatus) {
      return write((db) => {
        const m = db.matches[id];
        if (!m || (onlyIfStatus && !onlyIfStatus.includes(m.status))) return null;
        const p = withExpiry(patch, m);
        if (p.status !== undefined) m.status = p.status;
        if (p.aFinishedAt !== undefined) m.aFinishedAt = p.aFinishedAt;
        if (p.expiresAt !== undefined) m.expiresAt = p.expiresAt;
        if (p.pointsA !== undefined) m.pointsA = p.pointsA;
        if (p.pointsB !== undefined) m.pointsB = p.pointsB;
        if (p.forfeit !== undefined) m.forfeit = p.forfeit;
        return { ...m };
      });
    },
    async listMatches(userId, { now = Date.now(), recentLimit = RECENT_DEFAULT } = {}) {
      return classify(
        userId,
        write((db) => {
          expire(db, now);
          return Object.values(db.matches).filter((m) => m.playerA === userId || m.playerB === userId);
        }),
        recentLimit,
      );
    },
    async countWaiting(userId) {
      return waitingOf(load(), userId);
    },
    async countStarted(userId, sinceMs) {
      return startedSince(load(), userId, sinceMs);
    },

    async openAnswer(a) {
      checkIdx(a.idx);
      return write((db) => {
        const key = answerKey(a.matchId, a.userId, a.idx);
        db.answers[key] ??= {
          matchId: a.matchId,
          userId: a.userId,
          idx: a.idx,
          qid: a.qid,
          section: a.section,
          difficulty: a.difficulty,
          limitS: a.limitS,
          issuedAt: a.issuedAt ?? Date.now(),
          answeredAt: null,
          response: null,
          elapsedMs: null,
          status: "open",
          correct: null,
          base: 0,
          bonus: 0,
          points: 0,
        };
        return { ...db.answers[key] };
      });
    },
    async getAnswers(matchId, userId) {
      return Object.values(load().answers)
        .filter((a) => a.matchId === matchId && a.userId === userId)
        .sort((x, y) => x.idx - y.idx);
    },
    async closeAnswer(matchId, userId, idx, close) {
      return write((db) => {
        const a = db.answers[answerKey(matchId, userId, idx)];
        if (!a || a.status !== "open") return null;
        Object.assign(a, close);
        return { ...a };
      });
    },
    async recentQuestionIds(userId, sinceMs) {
      const ids = Object.values(load().answers)
        .filter((a) => a.userId === userId && a.issuedAt >= sinceMs)
        .map((a) => a.qid);
      return [...new Set(ids)];
    },

    async finishMatch(matchId, now = Date.now()) {
      return write((db) => {
        const m = db.matches[matchId];
        if (!m) throw new EloNotFoundError(`Match ${matchId} not found`);
        return applyFinish(db, m, now);
      });
    },
    async voidMatch(matchId, now = Date.now()) {
      return write((db) => {
        const m = db.matches[matchId];
        if (!m) throw new EloNotFoundError(`Match ${matchId} not found`);
        return applyVoid(db, m, now);
      });
    },

    async leaderboard({ board: b, page, size, userId, now = Date.now() }) {
      return board(load(), { board: b, page, size, userId, now });
    },
    async closeSeason(season, now = Date.now()) {
      const w = seasonWindow(season);
      if (!w) throw new Error(`Season must look like YYYY-MM, got ${season}`);
      if (w.to > now) throw new Error(`Season ${season} is not over yet`);
      return write((db) => {
        const existing = db.seasons.filter((s) => s.season === season).length;
        if (existing > 0) return existing;
        const count: Record<string, number> = {};
        for (const m of Object.values(db.matches)) {
          if (m.status !== "finished" || m.finishedAt === null || m.finishedAt < w.from || m.finishedAt >= w.to) continue;
          count[m.playerA] = (count[m.playerA] ?? 0) + 1;
          if (m.playerB !== null) count[m.playerB] = (count[m.playerB] ?? 0) + 1;
        }
        const rows = Object.entries(count)
          .filter(([, c]) => c >= LEADERBOARD_MIN_MATCHES.season)
          .map(([u, c]) => {
            const hist = db.history.filter((h) => h.userId === u && h.at < w.to);
            const last = hist.reduce<HistoryRow | null>((best, h) => (!best || h.at > best.at || (h.at === best.at && h.id > best.id) ? h : best), null);
            return { u, c, rating: last ? last.ratingAfter : START_RATING, lastAt: hist.length ? Math.max(...hist.map((h) => h.at)) : 0 };
          })
          .sort((x, y) => y.rating - x.rating || y.c - x.c || x.lastAt - y.lastAt || (x.u < y.u ? -1 : x.u > y.u ? 1 : 0));
        rows.forEach((r, i) => db.seasons.push({ season, userId: r.u, place: i + 1, rating: r.rating }));
        return rows.length;
      });
    },
    async expireStale(now = Date.now()) {
      return write((db) => expire(db, now));
    },
  };
}

/* ---------------- Supabase (PostgREST) ---------------- */

type Row = Record<string, unknown>;

const num = (v: unknown): number => Number(v);
const numOrNull = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));
const tsOrNull = (v: unknown): number | null => (typeof v === "string" ? Date.parse(v) : null);
const iso = (ms: number) => new Date(ms).toISOString();
const enc = encodeURIComponent;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);
/** The id itself, or EloInvalidIdError (for writes). Reads check isUuid and answer null / empty instead. */
function uuid(v: string): string {
  if (!isUuid(v)) throw new EloInvalidIdError("Not a valid id");
  return v;
}

const toPlayer = (r: Row): EloPlayerRecord => ({
  userId: String(r.user_id),
  rating: num(r.rating),
  peak: num(r.peak),
  matches: num(r.matches),
  wins: num(r.wins),
  losses: num(r.losses),
  draws: num(r.draws),
  name: String(r.name ?? ""),
  avatar: String(r.avatar ?? ""),
  updatedAt: tsOrNull(r.updated_at) ?? 0,
});

const toMatch = (r: Row): EloMatch => ({
  id: String(r.id),
  mode: r.mode as MatchMode,
  status: r.status as MatchStatus,
  playerA: String(r.player_a),
  playerB: r.player_b === null || r.player_b === undefined ? null : String(r.player_b),
  questionIds: (r.question_ids as string[]) ?? [],
  createdAt: tsOrNull(r.created_at) ?? 0,
  aFinishedAt: tsOrNull(r.a_finished_at),
  bStartedAt: tsOrNull(r.b_started_at),
  finishedAt: tsOrNull(r.finished_at),
  expiresAt: tsOrNull(r.expires_at),
  pointsA: numOrNull(r.points_a),
  pointsB: numOrNull(r.points_b),
  forfeit: (r.forfeit as Forfeit | null) ?? null,
  result: (r.result as MatchResult | null) ?? null,
  ratingABefore: numOrNull(r.rating_a_before),
  ratingBBefore: numOrNull(r.rating_b_before),
  deltaA: numOrNull(r.delta_a),
  deltaB: numOrNull(r.delta_b),
});

const toAnswer = (r: Row): EloAnswer => ({
  matchId: String(r.match_id),
  userId: String(r.user_id),
  idx: num(r.idx),
  qid: String(r.qid),
  section: r.section as SectionId,
  difficulty: r.difficulty as Difficulty,
  limitS: num(r.limit_s),
  issuedAt: tsOrNull(r.issued_at) ?? 0,
  answeredAt: tsOrNull(r.answered_at),
  response: r.response === null || r.response === undefined ? null : String(r.response),
  elapsedMs: numOrNull(r.elapsed_ms),
  status: r.status as AnswerStatus,
  correct: typeof r.correct === "boolean" ? r.correct : null,
  base: num(r.base),
  bonus: num(r.bonus),
  points: num(r.points),
});

const toOutcome = (j: Row): MatchOutcome => ({
  matchId: String(j.match_id),
  status: j.status as MatchStatus,
  result: (j.result as MatchResult | null) ?? null,
  forfeit: (j.forfeit as Forfeit | null) ?? null,
  pointsA: numOrNull(j.points_a),
  pointsB: numOrNull(j.points_b),
  ratingABefore: numOrNull(j.rating_a_before),
  ratingBBefore: numOrNull(j.rating_b_before),
  deltaA: numOrNull(j.delta_a),
  deltaB: numOrNull(j.delta_b),
  ratingAAfter: numOrNull(j.rating_a_after),
  ratingBAfter: numOrNull(j.rating_b_after),
  finishedAt: tsOrNull(j.finished_at),
  changed: j.changed === true,
});

const toLeaderRow = (j: Row): LeaderRow => {
  const row: LeaderRow = {
    rank: numOrNull(j.rank),
    name: String(j.name ?? ""),
    avatar: String(j.avatar ?? ""),
    rating: num(j.rating),
    matches: num(j.matches),
    wins: num(j.wins),
    losses: num(j.losses),
    draws: num(j.draws),
  };
  if (j.points !== undefined && j.points !== null) row.points = num(j.points);
  return row;
};

function patchBody(patch: MatchPatch): Row {
  const r: Row = {};
  if (patch.status !== undefined) r.status = patch.status;
  if (patch.aFinishedAt !== undefined) r.a_finished_at = iso(patch.aFinishedAt);
  if (patch.expiresAt !== undefined) r.expires_at = iso(patch.expiresAt);
  if (patch.pointsA !== undefined) r.points_a = patch.pointsA;
  if (patch.pointsB !== undefined) r.points_b = patch.pointsB;
  if (patch.forfeit !== undefined) r.forfeit = patch.forfeit;
  return r;
}

export function createSupabaseStore(baseUrl: string, serviceKey: string): EloStore {
  const url = baseUrl.replace(/\/$/, "");

  /** Service-role REST call. A missing table / function / column is a setup problem, reported as such. */
  async function pg(pathAndQuery: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(`${url}/rest/v1/${pathAndQuery}`, {
      ...init,
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", ...init.headers },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      // PGRST205 = unknown table, PGRST202 = unknown function, PGRST204 = unknown column, 42P01 / 42883 = Postgres' own versions.
      if (body.includes("ELO_NOT_FOUND")) throw new EloNotFoundError("Match not found");
      if (body.includes("ELO_ACTIVE_MATCH")) throw new EloActiveMatchError("The player already has a match in progress");
      // 23505 on elo_matches_one_playing_a: a second playing_a match for the same player (two concurrent /play calls).
      if (body.includes("23505") && body.includes("elo_matches_one_playing_a")) throw new EloActiveMatchError("The player already has a match in progress");
      if (["PGRST205", "PGRST202", "PGRST204", "42P01", "42883"].some((c) => body.includes(c))) throw new EloSetupError(SETUP_MESSAGE);
      console.error(`[elo] ${init.method ?? "GET"} ${pathAndQuery.split("?")[0]}: ${res.status} ${body.slice(0, 300)}`);
      throw new EloStoreUnavailable("Couldn't reach the ranked tables.");
    }
    return res;
  }
  async function rows(pathAndQuery: string, init?: RequestInit): Promise<Row[]> {
    const text = await (await pg(pathAndQuery, init)).text();
    return text ? (JSON.parse(text) as Row[]) : [];
  }
  async function rpc(fn: string, args: Row): Promise<unknown> {
    const text = await (await pg(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) })).text();
    return text ? JSON.parse(text) : null;
  }
  const ret = { Prefer: "return=representation" };

  async function countWaiting(userId: string) {
    if (!isUuid(userId)) return 0;
    return (await rows(`elo_matches?player_a=eq.${enc(uuid(userId))}&status=eq.waiting&select=id&limit=50`)).length;
  }
  async function countStarted(userId: string, sinceMs: number) {
    if (!isUuid(userId)) return 0;
    const u = enc(uuid(userId));
    const since = enc(iso(sinceMs));
    const asA = await rows(`elo_matches?player_a=eq.${u}&created_at=gte.${since}&select=id&limit=200`);
    const asB = await rows(`elo_matches?player_b=eq.${u}&b_started_at=gte.${since}&select=id&limit=200`);
    return asA.length + asB.length;
  }
  async function getMatch(id: string): Promise<EloMatch | null> {
    if (!isUuid(id)) return null;
    const r = await rows(`elo_matches?id=eq.${enc(uuid(id))}&select=*`);
    return r[0] ? toMatch(r[0]) : null;
  }
  async function getPlayer(userId: string): Promise<EloPlayerRecord | null> {
    if (!isUuid(userId)) return null;
    const r = await rows(`elo_players?user_id=eq.${enc(uuid(userId))}&select=*`);
    return r[0] ? toPlayer(r[0]) : null;
  }
  async function expireStale(now = Date.now()): Promise<number> {
    const r = await rows(`elo_matches?status=eq.waiting&expires_at=lte.${enc(iso(now))}&select=id`, {
      method: "PATCH",
      headers: ret,
      body: JSON.stringify({ status: "expired" }),
    });
    return r.length;
  }

  return {
    kind: "supabase",

    async ensurePlayer(userId, profile) {
      const id = uuid(userId);
      const insert: Row = { user_id: id };
      if (profile?.name !== undefined) insert.name = profile.name;
      if (profile?.avatar !== undefined) insert.avatar = profile.avatar;
      await pg("elo_players", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify(insert) });
      let p = (await getPlayer(id))!;
      const patch: Row = {};
      if (profile?.name !== undefined && profile.name !== p.name) patch.name = profile.name;
      if (profile?.avatar !== undefined && profile.avatar !== p.avatar) patch.avatar = profile.avatar;
      if (Object.keys(patch).length > 0) {
        // updated_at stays: it is the leaderboard tie-break "who reached the rating first", not "last edited".
        const updated = await rows(`elo_players?user_id=eq.${enc(id)}`, { method: "PATCH", headers: ret, body: JSON.stringify(patch) });
        if (updated[0]) p = toPlayer(updated[0]);
      }
      return p;
    },
    getPlayer,
    async getPlayers(userIds) {
      const out: Record<string, EloPlayerRecord> = {};
      const valid = userIds.filter(isUuid);
      if (valid.length === 0) return out;
      const list = valid.map(enc).join(",");
      for (const r of await rows(`elo_players?user_id=in.(${list})&select=*`)) {
        const p = toPlayer(r);
        out[p.userId] = p;
      }
      return out;
    },

    async createMatch({ mode, playerA, questionIds, now = Date.now() }) {
      checkQuestionIds(questionIds);
      if ((await countWaiting(playerA)) >= MAX_WAITING_MATCHES) throw new EloLimitError("waiting", `At most ${MAX_WAITING_MATCHES} matches can wait for an opponent`);
      if ((await countStarted(playerA, now - DAY_MS)) >= MAX_MATCHES_PER_DAY) throw new EloLimitError("daily", `At most ${MAX_MATCHES_PER_DAY} matches a day`);
      const body = { mode, status: "playing_a", player_a: uuid(playerA), question_ids: questionIds, created_at: iso(now) };
      const created = await rows("elo_matches", { method: "POST", headers: ret, body: JSON.stringify(body) });
      return toMatch(created[0]);
    },
    async claimWaiting({ userId, rating, mode, now = Date.now() }) {
      if ((await countStarted(userId, now - DAY_MS)) >= MAX_MATCHES_PER_DAY) throw new EloLimitError("daily", `At most ${MAX_MATCHES_PER_DAY} matches a day`);
      const id = await rpc("elo_claim_waiting", { p_user: uuid(userId), p_rating: rating, p_mode: mode, p_now: iso(now) });
      return typeof id === "string" ? getMatch(id) : null;
    },

    getMatch,
    async updateMatch(id, patch, onlyIfStatus) {
      if (!isUuid(id)) return null;
      const needsCurrent = patch.status === "waiting" && patch.expiresAt === undefined && patch.aFinishedAt === undefined;
      const cur = needsCurrent ? await getMatch(id) : null;
      const p = withExpiry(patch, { aFinishedAt: cur?.aFinishedAt ?? null });
      const filter = onlyIfStatus ? `&status=in.(${onlyIfStatus.join(",")})` : "";
      const updated = await rows(`elo_matches?id=eq.${enc(uuid(id))}${filter}`, { method: "PATCH", headers: ret, body: JSON.stringify(patchBody(p)) });
      return updated[0] ? toMatch(updated[0]) : null;
    },
    async listMatches(userId, { now = Date.now(), recentLimit = RECENT_DEFAULT } = {}) {
      if (!isUuid(userId)) return { active: null, waiting: [], recent: [] };
      await expireStale(now);
      const u = enc(userId);
      // Two newest-first queries, one per role, each ordered by its own "activity" time (created as A, joined as B), so a match the
      // user just joined as B is never cut off by the limit however old its created_at is.
      const asA = await rows(`elo_matches?player_a=eq.${u}&order=created_at.desc&limit=100&select=*`);
      const asB = await rows(`elo_matches?player_b=eq.${u}&order=b_started_at.desc.nullslast&limit=100&select=*`);
      const byId = new Map<string, EloMatch>();
      for (const r of [...asA, ...asB]) byId.set(String(r.id), toMatch(r));
      return classify(userId, [...byId.values()], recentLimit);
    },
    countWaiting,
    countStarted,

    async openAnswer(a) {
      checkIdx(a.idx);
      const body = {
        match_id: uuid(a.matchId),
        user_id: uuid(a.userId),
        idx: a.idx,
        qid: a.qid,
        section: a.section,
        difficulty: a.difficulty,
        limit_s: a.limitS,
        issued_at: iso(a.issuedAt ?? Date.now()),
      };
      await pg("elo_answers", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify(body) });
      const r = await rows(`elo_answers?match_id=eq.${enc(body.match_id)}&user_id=eq.${enc(body.user_id)}&idx=eq.${a.idx}&select=*`);
      return toAnswer(r[0]);
    },
    async getAnswers(matchId, userId) {
      if (!isUuid(matchId) || !isUuid(userId)) return [];
      const r = await rows(`elo_answers?match_id=eq.${enc(uuid(matchId))}&user_id=eq.${enc(uuid(userId))}&order=idx.asc&select=*`);
      return r.map(toAnswer);
    },
    async closeAnswer(matchId, userId, idx, close) {
      checkIdx(idx);
      if (!isUuid(matchId) || !isUuid(userId)) return null;
      const body = {
        status: close.status,
        answered_at: close.answeredAt === null ? null : iso(close.answeredAt),
        response: close.response,
        elapsed_ms: close.elapsedMs,
        correct: close.correct,
        base: close.base,
        bonus: close.bonus,
        points: close.points,
      };
      // The status filter makes "close once" atomic: a second close finds no open row and updates nothing.
      const r = await rows(`elo_answers?match_id=eq.${enc(uuid(matchId))}&user_id=eq.${enc(uuid(userId))}&idx=eq.${idx}&status=eq.open`, {
        method: "PATCH",
        headers: ret,
        body: JSON.stringify(body),
      });
      return r[0] ? toAnswer(r[0]) : null;
    },
    async recentQuestionIds(userId, sinceMs) {
      if (!isUuid(userId)) return [];
      const r = await rows(`elo_answers?user_id=eq.${enc(uuid(userId))}&issued_at=gte.${enc(iso(sinceMs))}&select=qid&limit=2000`);
      return [...new Set(r.map((x) => String(x.qid)))];
    },

    async finishMatch(matchId) {
      if (!isUuid(matchId)) throw new EloNotFoundError("Match not found");
      return toOutcome((await rpc("elo_finish_match", { p_match: uuid(matchId) })) as Row);
    },
    async voidMatch(matchId) {
      if (!isUuid(matchId)) throw new EloNotFoundError("Match not found");
      return toOutcome((await rpc("elo_void_match", { p_match: uuid(matchId) })) as Row);
    },

    async leaderboard({ board: b, page, size, userId }) {
      const j = (await rpc("elo_leaderboard", {
        p_board: b,
        p_page: clampPage(page),
        p_size: clampSize(size),
        p_user: isUuid(userId) ? userId : null,
      })) as { total: number; rows: Row[]; me: Row | null };
      return { total: num(j.total), rows: (j.rows ?? []).map(toLeaderRow), me: j.me ? toLeaderRow(j.me) : null };
    },
    async closeSeason(season) {
      if (!seasonWindow(season)) throw new Error(`Season must look like YYYY-MM, got ${season}`);
      return num(await rpc("elo_close_season", { p_season: season }));
    },
    expireStale,
  };
}

/* ---------------- default store ---------------- */

const SB_URL = process.env.SUPABASE_URL?.trim();
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const store: EloStore =
  SB_URL && SB_KEY ? createSupabaseStore(SB_URL, SB_KEY) : createLocalStore(path.join(/* turbopackIgnore: true */ process.cwd(), ".data", "elo.json"));
export const storeKind = store.kind;
