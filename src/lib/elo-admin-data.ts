import "server-only";
import fs from "node:fs";
import path from "node:path";
import { flagsForMatch, type GainRow, type MatchFlag } from "./elo-flags.ts";
import {
  EloNotFoundError,
  EloSetupError,
  EloStoreUnavailable,
  store,
  type AnswerStatus,
  type EloAnswer,
  type EloMatch,
  type EloPlayerRecord,
  type LocalDb,
  type MatchOutcome,
  type MatchStatus,
} from "./elo-store.ts";
import type { Difficulty } from "./types";
import type { SectionId } from "./taxonomy";
import type { MatchResult } from "./elo";

// The data side of the ranked admin (no Next / auth imports, so node tests can run it; elo-admin-server.ts re-exports it).
// Admin side of ranked matches (docs/ELO.md stage 6): list / detail / flags, void a match, reset a rating, the admin log.
// Same two backends as elo-store.ts: Supabase (service role, REST + the RPC of supabase/elo-admin.sql) and the local .data/ files
// (development). Voiding goes through store.voidMatch in both. Every action is logged, and a missing log table stops it BEFORE it runs.

export class AdminBadRequest extends Error {}

export const MATCH_STATUSES: readonly MatchStatus[] = ["playing_a", "waiting", "playing_b", "finished", "expired", "void"];
/** With "flagged only", this many newest matches (after the other filters) are checked for flags, then paged. */
export const FLAG_SCAN = 300;
const PAGE_MAX = 50;
const PAGE_DEFAULT = 25;
const LOG_DEFAULT = 50;
const LOG_MAX = 200;
const DAY_MS = 24 * 3_600_000;
const PAIR_SPAN_MS = 7 * DAY_MS;
/** The nil uuid: a rating reset belongs to no match (elo_history.match_id is not null). */
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const START_RATING = 1000;
/** Matches per answers request: 45 x 20 answer rows = 900, under the PostgREST 1000-row cap even before paging. */
const SB_ANSWER_CHUNK = 45;
const SB_CHUNK = 80;
/** PostgREST answers at most this many rows per request (Max Rows): every list query pages by this size. */
const SB_PAGE = 1000;
const SB_MAX_PAGES = 50;

const SETUP_ADMIN =
  "The ranked admin tables aren't set up: run supabase/elo-admin.sql (npm run db:apply -- supabase/elo-admin.sql, or paste it into the Supabase SQL Editor).";
const SETUP_ELO = "Ranked tables aren't set up: run supabase/elo.sql first, then supabase/elo-admin.sql.";

/* ---------------- types (also used by the admin tab) ---------------- */

export interface AdminPlayer {
  userId: string;
  /** Public name from the profile; "" when the player has no row (account deleted). */
  name: string;
  avatar: string;
  rating: number | null;
  peak: number | null;
  matches: number | null;
}

export interface AdminMatchRow {
  match: EloMatch;
  a: AdminPlayer;
  b: AdminPlayer | null;
  flags: MatchFlag[];
}

export interface AdminList {
  rows: AdminMatchRow[];
  /** Matches that fit the filters (with "flagged only": flagged ones among the scanned). */
  total: number;
  page: number;
  size: number;
  /** "Flagged only": how many newest matches were checked (at most FLAG_SCAN), else undefined. */
  scanned?: number;
  scanCap?: number;
  storeKind: "supabase" | "file";
  now: number;
}

export interface AdminLogRow {
  id: number;
  at: number;
  adminEmail: string;
  action: string;
  matchId: string | null;
  userId: string | null;
  details: Record<string, unknown>;
}

export interface AdminMatchDetail {
  match: EloMatch;
  a: AdminPlayer;
  b: AdminPlayer | null;
  answersA: EloAnswer[];
  answersB: EloAnswer[];
  flags: MatchFlag[];
  log: AdminLogRow[];
  now: number;
}

export interface AdminVoidResult {
  match: EloMatch;
  outcome: MatchOutcome;
}

export interface AdminResetResult {
  userId: string;
  ratingBefore: number;
  peakBefore: number;
  ratingAfter: number;
  /** False when the player was already at 1000 / 1000: nothing was changed (still logged). */
  changed: boolean;
}

export interface ListFilter {
  status: MatchStatus | null;
  flagged: boolean;
  /** A user id, or part of a public name. */
  q: string;
  /** created_at >= from (Unix ms), < to. */
  from: number | null;
  to: number | null;
  page: number;
  size: number;
}

/* ---------------- ids and input ---------------- */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): boolean => typeof v === "string" && UUID.test(v);
const enc = encodeURIComponent;
const iso = (ms: number) => new Date(ms).toISOString();

export function checkId(v: unknown): string {
  if (typeof v !== "string" || !isUuid(v)) throw new AdminBadRequest("Not a valid id");
  return v.toLowerCase();
}

function dateParam(v: string | null, name: string): number | null {
  if (!v) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new AdminBadRequest(`${name} must look like YYYY-MM-DD`);
  const ms = Date.parse(`${v}T00:00:00Z`);
  // Round trip: only a date that comes back unchanged is real (2026-02-31 would roll over to March in lenient parsers).
  if (Number.isNaN(ms) || new Date(ms).toISOString().slice(0, 10) !== v) throw new AdminBadRequest(`${name} isn't a real date`);
  return ms;
}

function intParam(v: string | null, def: number, min: number, max: number): number {
  if (v === null || v === "") return def;
  const n = Number(v);
  if (!Number.isInteger(n)) throw new AdminBadRequest("Page and size must be whole numbers");
  return Math.min(max, Math.max(min, n));
}

/** Query string -> filter. `to` is a calendar day and includes that whole day. */
export function parseListFilter(p: URLSearchParams): ListFilter {
  const status = p.get("status");
  if (status && status !== "all" && !MATCH_STATUSES.includes(status as MatchStatus)) throw new AdminBadRequest("Unknown status");
  const to = dateParam(p.get("to"), "to");
  const from = dateParam(p.get("from"), "from");
  if (from !== null && to !== null && to < from) throw new AdminBadRequest("The end date is before the start date");
  return {
    status: status && status !== "all" ? (status as MatchStatus) : null,
    flagged: p.get("flagged") === "1",
    q: (p.get("q") ?? "").trim().slice(0, 60),
    from,
    to: to === null ? null : to + DAY_MS,
    page: intParam(p.get("page"), 1, 1, 10_000),
    size: intParam(p.get("size"), PAGE_DEFAULT, 1, PAGE_MAX),
  };
}

export const parseLogLimit = (p: URLSearchParams) => intParam(p.get("limit"), LOG_DEFAULT, 1, LOG_MAX);

/* ---------------- data access ---------------- */

type Row = Record<string, unknown>;

interface MatchQuery {
  status: MatchStatus | null;
  /** Restrict to matches of these users (either side). null = everyone. */
  users: string[] | null;
  from: number | null;
  to: number | null;
}

export interface AdminData {
  matches(q: MatchQuery, offset: number, limit: number): Promise<{ rows: EloMatch[]; total: number }>;
  /** User ids by user id or public-name search (at most 100). */
  findUsers(q: string): Promise<string[]>;
  answers(matchIds: string[]): Promise<EloAnswer[]>;
  /** Matches of these users (either side) that got their second player (b_started_at) in [since, until]. */
  pairedBetween(users: string[], since: number, until: number): Promise<EloMatch[]>;
  /** Finished matches of these users with finished_at in [since, until]. */
  finishedBetween(users: string[], since: number, until: number): Promise<EloMatch[]>;
  log(limit: number, matchId?: string): Promise<AdminLogRow[]>;
  addLog(e: { adminEmail: string; action: string; matchId?: string; userId?: string; details: Record<string, unknown> }): Promise<void>;
  /** Throws EloSetupError when logging isn't possible. */
  checkLog(): Promise<void>;
  /** Voids the match and logs it (Supabase: one transaction, elo_admin_void; local: store.voidMatch + a log line). */
  voidMatch(before: EloMatch, adminEmail: string): Promise<MatchOutcome>;
  reset(userId: string, adminEmail: string): Promise<AdminResetResult>;
}

const num = (v: unknown) => Number(v);
const numOrNull = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));
const tsOrNull = (v: unknown): number | null => (typeof v === "string" ? Date.parse(v) : null);

const toMatch = (r: Row): EloMatch => ({
  id: String(r.id),
  mode: r.mode as EloMatch["mode"],
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
  forfeit: (r.forfeit as EloMatch["forfeit"]) ?? null,
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
  forfeit: (j.forfeit as EloMatch["forfeit"]) ?? null,
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

const toLog = (r: Row): AdminLogRow => ({
  id: num(r.id),
  at: tsOrNull(r.at) ?? 0,
  adminEmail: String(r.admin_email ?? ""),
  action: String(r.action ?? ""),
  matchId: r.match_id === null || r.match_id === undefined ? null : String(r.match_id),
  userId: r.user_id === null || r.user_id === undefined ? null : String(r.user_id),
  details: r.details && typeof r.details === "object" ? (r.details as Record<string, unknown>) : {},
});

const chunks = <T,>(xs: T[], n: number): T[][] => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, (i + 1) * n));

/* ---- Supabase ---- */

/** The Supabase side. Takes explicit credentials so tests can run it against a mocked fetch. */
export function createSupabaseAdminData(baseUrl: string, key: string): AdminData {
  const url = baseUrl.trim().replace(/\/$/, "");

  async function pg(pathAndQuery: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(`${url}/rest/v1/${pathAndQuery}`, {
      ...init,
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      if (body.includes("ELO_NOT_FOUND")) throw new EloNotFoundError("Not found");
      // PGRST205 = unknown table, PGRST202 = unknown function, PGRST204 = unknown column, 42P01 / 42883 = Postgres' own versions.
      if (["PGRST205", "PGRST202", "PGRST204", "42P01", "42883"].some((c) => body.includes(c))) {
        throw new EloSetupError(/admin_log|reset_player|admin_void/.test(pathAndQuery) ? SETUP_ADMIN : SETUP_ELO);
      }
      console.error(`[elo-admin] ${init.method ?? "GET"} ${pathAndQuery.split("?")[0]}: ${res.status} ${body.slice(0, 300)}`);
      throw new EloStoreUnavailable("Couldn't reach the ranked tables.");
    }
    return res;
  }
  async function rows(pathAndQuery: string, init?: RequestInit): Promise<Row[]> {
    const text = await (await pg(pathAndQuery, init)).text();
    return text ? (JSON.parse(text) as Row[]) : [];
  }
  /**
   * Reads EVERY row of a query, page by page: PostgREST caps one response at Max Rows (1000), whatever `limit` says. `query` needs a
   * stable, unique `order` so pages don't overlap. Stops by the total in Content-Range, or by an empty / short page when it is unknown.
   */
  async function allRows(query: string): Promise<Row[]> {
    const out: Row[] = [];
    for (let page = 0; page < SB_MAX_PAGES; page++) {
      const res = await pg(`${query}&offset=${out.length}&limit=${SB_PAGE}`, { headers: { Prefer: "count=exact" } });
      const text = await res.text();
      const got = text ? (JSON.parse(text) as Row[]) : [];
      out.push(...got);
      const total = Number(/\/(\d+)$/.exec(res.headers.get("content-range") ?? "")?.[1]);
      if (got.length === 0 || (Number.isFinite(total) ? out.length >= total : got.length < SB_PAGE)) break;
    }
    return out;
  }
  const usersOr = (ids: string[]) => {
    const list = ids.join(",");
    return `or=(player_a.in.(${list}),player_b.in.(${list}))`;
  };

  return {
    async matches(q, offset, limit) {
      const parts = ["select=*", "order=created_at.desc,id.desc", `offset=${offset}`, `limit=${limit}`];
      if (q.status) parts.push(`status=eq.${q.status}`);
      if (q.from !== null) parts.push(`created_at=gte.${enc(iso(q.from))}`);
      if (q.to !== null) parts.push(`created_at=lt.${enc(iso(q.to))}`);
      if (q.users) parts.push(usersOr(q.users));
      const res = await pg(`elo_matches?${parts.join("&")}`, { headers: { Prefer: "count=exact" } });
      const text = await res.text();
      const list = (text ? (JSON.parse(text) as Row[]) : []).map(toMatch);
      const total = Number(/\/(\d+)$/.exec(res.headers.get("content-range") ?? "")?.[1]);
      return { rows: list, total: Number.isFinite(total) ? total : offset + list.length };
    },
    async findUsers(q) {
      if (isUuid(q)) return [q.toLowerCase()];
      const term = q.replace(/[*%\\]/g, "");
      if (!term) return [];
      const r = await rows(`elo_players?name=ilike.${enc(`*${term}*`)}&select=user_id&limit=100`);
      return r.map((x) => String(x.user_id));
    },
    async answers(matchIds) {
      const out: EloAnswer[] = [];
      for (const part of chunks(matchIds, SB_ANSWER_CHUNK)) {
        const r = await allRows(`elo_answers?match_id=in.(${part.join(",")})&order=match_id.asc,user_id.asc,idx.asc&select=*`);
        out.push(...r.map(toAnswer));
      }
      return out;
    },
    async pairedBetween(users, since, until) {
      const byId = new Map<string, EloMatch>();
      for (const part of chunks(users, SB_CHUNK)) {
        const r = await allRows(`elo_matches?${usersOr(part)}&b_started_at=gte.${enc(iso(since))}&b_started_at=lte.${enc(iso(until))}&select=*&order=id.asc`);
        for (const x of r) byId.set(String(x.id), toMatch(x));
      }
      return [...byId.values()];
    },
    async finishedBetween(users, since, until) {
      const byId = new Map<string, EloMatch>();
      for (const part of chunks(users, SB_CHUNK)) {
        const r = await allRows(
          `elo_matches?${usersOr(part)}&status=eq.finished&finished_at=gte.${enc(iso(since))}&finished_at=lte.${enc(iso(until))}&select=*&order=id.asc`,
        );
        for (const x of r) byId.set(String(x.id), toMatch(x));
      }
      return [...byId.values()];
    },
    async log(limit, matchId) {
      const filter = matchId ? `&match_id=eq.${enc(matchId)}` : "";
      return (await rows(`elo_admin_log?select=*&order=at.desc,id.desc&limit=${limit}${filter}`)).map(toLog);
    },
    async addLog(e) {
      const body = { admin_email: e.adminEmail, action: e.action, match_id: e.matchId ?? null, user_id: e.userId ?? null, details: e.details };
      await pg("elo_admin_log", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(body) });
    },
    async checkLog() {
      await rows("elo_admin_log?select=id&limit=1");
    },
    async voidMatch(before, adminEmail) {
      // elo_admin_void voids and writes the log row in one transaction.
      const text = await (await pg("rpc/elo_admin_void", { method: "POST", body: JSON.stringify({ p_match: before.id, p_admin: adminEmail }) })).text();
      return toOutcome((text ? JSON.parse(text) : {}) as Row);
    },
    async reset(userId, adminEmail) {
      // The function logs the reset itself, in the same transaction.
      const text = await (await pg("rpc/elo_reset_player", { method: "POST", body: JSON.stringify({ p_user: userId, p_admin: adminEmail }) })).text();
      const j = (text ? JSON.parse(text) : {}) as Row;
      return { userId, ratingBefore: num(j.rating_before), peakBefore: num(j.peak_before), ratingAfter: num(j.rating_after), changed: j.changed === true };
    },
  };
}

/** The admin log "details" of a void (the same keys elo_admin_void writes). */
function voidDetails(before: EloMatch, changed: boolean): Record<string, unknown> {
  return {
    status_before: before.status,
    result_before: before.result,
    delta_a: before.deltaA,
    delta_b: before.deltaB,
    player_a: before.playerA,
    player_b: before.playerB,
    changed,
  };
}

/* ---- local files (development) ---- */

const LOCAL_DB = path.join(/* turbopackIgnore: true */ process.cwd(), ".data", "elo.json");
const LOCAL_LOG = path.join(/* turbopackIgnore: true */ process.cwd(), ".data", "elo-admin-log.json");

function localData(): AdminData {
  /** A fresh read of the store's file (read-only here, except the rating reset below). */
  const load = (): LocalDb => {
    try {
      return { players: {}, matches: {}, answers: {}, history: [], seasons: [], nextHistoryId: 1, ...JSON.parse(fs.readFileSync(/* turbopackIgnore: true */ LOCAL_DB, "utf8")) };
    } catch {
      return { players: {}, matches: {}, answers: {}, history: [], seasons: [], nextHistoryId: 1 };
    }
  };
  const readLog = (): AdminLogRow[] => {
    try {
      const j = JSON.parse(fs.readFileSync(/* turbopackIgnore: true */ LOCAL_LOG, "utf8"));
      return Array.isArray(j) ? j : [];
    } catch {
      return [];
    }
  };
  const ofUsers = (m: EloMatch, users: Set<string>) => users.has(m.playerA) || (m.playerB !== null && users.has(m.playerB));

  const local: AdminData = {
    async matches(q, offset, limit) {
      const users = q.users ? new Set(q.users) : null;
      const all = Object.values(load().matches)
        .filter((m) => (!q.status || m.status === q.status) && (q.from === null || m.createdAt >= q.from) && (q.to === null || m.createdAt < q.to) && (!users || ofUsers(m, users)))
        .sort((x, y) => y.createdAt - x.createdAt || (x.id < y.id ? 1 : -1));
      return { rows: all.slice(offset, offset + limit), total: all.length };
    },
    async findUsers(q) {
      if (isUuid(q)) return [q.toLowerCase()];
      const term = q.toLowerCase();
      if (!term) return [];
      return Object.values(load().players)
        .filter((p) => p.name.toLowerCase().includes(term))
        .slice(0, 100)
        .map((p) => p.userId);
    },
    async answers(matchIds) {
      const ids = new Set(matchIds);
      return Object.values(load().answers)
        .filter((a) => ids.has(a.matchId))
        .sort((x, y) => (x.matchId < y.matchId ? -1 : x.matchId > y.matchId ? 1 : x.idx - y.idx));
    },
    async pairedBetween(users, since, until) {
      const set = new Set(users);
      return Object.values(load().matches).filter((m) => m.bStartedAt !== null && m.bStartedAt >= since && m.bStartedAt <= until && ofUsers(m, set));
    },
    async finishedBetween(users, since, until) {
      const set = new Set(users);
      return Object.values(load().matches).filter((m) => m.status === "finished" && m.finishedAt !== null && m.finishedAt >= since && m.finishedAt <= until && ofUsers(m, set));
    },
    async log(limit, matchId) {
      return readLog()
        .filter((r) => !matchId || r.matchId === matchId)
        .sort((x, y) => y.at - x.at || y.id - x.id)
        .slice(0, limit);
    },
    async addLog(e) {
      const all = readLog();
      all.push({ id: (all.at(-1)?.id ?? 0) + 1, at: Date.now(), adminEmail: e.adminEmail, action: e.action, matchId: e.matchId ?? null, userId: e.userId ?? null, details: e.details });
      try {
        fs.mkdirSync(/* turbopackIgnore: true */ path.dirname(LOCAL_LOG), { recursive: true });
        fs.writeFileSync(/* turbopackIgnore: true */ LOCAL_LOG, JSON.stringify(all));
      } catch (err) {
        throw new EloStoreUnavailable(`Can't write ${LOCAL_LOG}: ${(err as Error).message}`);
      }
    },
    async checkLog() {},
    async voidMatch(before, adminEmail) {
      const outcome = await store.voidMatch(before.id);
      await local.addLog({ adminEmail, action: "void_match", matchId: before.id, details: voidDetails(before, outcome.changed) });
      return outcome;
    },
    async reset(userId, adminEmail) {
      // Development only: the one write this module does to the store's own file (a single synchronous read-modify-write, like the store).
      const db = load();
      const p: EloPlayerRecord | undefined = db.players[userId];
      if (!p) throw new EloNotFoundError("Player not found");
      const out: AdminResetResult = { userId, ratingBefore: p.rating, peakBefore: p.peak, ratingAfter: START_RATING, changed: p.rating !== START_RATING || p.peak !== START_RATING };
      if (out.changed) {
        // Same as elo_reset_player: a 'reset' history row whenever something changes; updatedAt only when the rating moves.
        const now = Date.now();
        db.history.push({ id: db.nextHistoryId++, userId, matchId: NIL_UUID, at: now, ratingBefore: p.rating, ratingAfter: START_RATING, reason: "reset" });
        if (p.rating !== START_RATING) p.updatedAt = now;
        p.rating = START_RATING;
        p.peak = START_RATING;
        try {
          fs.writeFileSync(/* turbopackIgnore: true */ LOCAL_DB, JSON.stringify(db));
        } catch (err) {
          throw new EloStoreUnavailable(`Can't write ${LOCAL_DB}: ${(err as Error).message}`);
        }
      }
      await local.addLog({
        adminEmail,
        action: "reset_rating",
        userId,
        details: { rating_before: out.ratingBefore, peak_before: out.peakBefore, rating_after: START_RATING, changed: out.changed },
      });
      return out;
    },
  };
  return local;
}

const data: AdminData =
  store.kind === "supabase" ? createSupabaseAdminData(process.env.SUPABASE_URL ?? "", (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim()) : localData();

/* ---------------- flags ---------------- */

/** The pair is dated by when B joined (bStartedAt), not when A created the match: a match can wait up to 48 h for its opponent. */
export const pairTime = (m: Pick<EloMatch, "bStartedAt" | "createdAt">) => m.bStartedAt ?? m.createdAt;

export const flagMatch = (m: EloMatch) => ({ id: m.id, playerA: m.playerA, playerB: m.playerB, status: m.status, createdAt: pairTime(m), finishedAt: m.finishedAt, deltaA: m.deltaA, deltaB: m.deltaB });

function gainRows(userId: string, finished: EloMatch[]): GainRow[] {
  const out: GainRow[] = [];
  for (const m of finished) {
    if (m.status !== "finished" || m.finishedAt === null) continue;
    const delta = m.playerA === userId ? m.deltaA : m.playerB === userId ? m.deltaB : null;
    if (delta !== null) out.push({ matchId: m.id, at: m.finishedAt, delta });
  }
  return out;
}

/** Flags of several matches with a fixed number of queries. */
async function flagsOf(ms: EloMatch[]): Promise<Map<string, MatchFlag[]>> {
  const out = new Map<string, MatchFlag[]>();
  if (ms.length === 0) return out;
  const users = [...new Set(ms.flatMap((m) => (m.playerB ? [m.playerA, m.playerB] : [m.playerA])))];
  const created = ms.map(pairTime);
  const finished = ms.flatMap((m) => (m.finishedAt === null ? [] : [m.finishedAt]));
  const [answers, around, recent] = await Promise.all([
    data.answers(ms.map((m) => m.id)),
    data.pairedBetween(users, Math.min(...created) - PAIR_SPAN_MS, Math.max(...created) + PAIR_SPAN_MS),
    finished.length > 0 ? data.finishedBetween(users, Math.min(...finished) - DAY_MS, Math.max(...finished)) : Promise.resolve([] as EloMatch[]),
  ]);
  const byMatchUser = new Map<string, EloAnswer[]>();
  for (const a of answers) {
    const k = `${a.matchId}|${a.userId}`;
    const list = byMatchUser.get(k);
    if (list) list.push(a);
    else byMatchUser.set(k, [a]);
  }
  const pairMatches = around.map(flagMatch);
  for (const m of ms) {
    out.set(
      m.id,
      flagsForMatch(flagMatch(m), {
        answersA: byMatchUser.get(`${m.id}|${m.playerA}`) ?? [],
        answersB: m.playerB ? (byMatchUser.get(`${m.id}|${m.playerB}`) ?? []) : [],
        pairMatches,
        gainsA: gainRows(m.playerA, recent),
        gainsB: m.playerB ? gainRows(m.playerB, recent) : [],
      }),
    );
  }
  return out;
}

/* ---------------- public API ---------------- */

const player = (id: string, known: Record<string, EloPlayerRecord>): AdminPlayer => {
  const p = known[id];
  return { userId: id, name: p?.name ?? "", avatar: p?.avatar ?? "", rating: p?.rating ?? null, peak: p?.peak ?? null, matches: p?.matches ?? null };
};

async function present(ms: EloMatch[], flags: Map<string, MatchFlag[]>): Promise<AdminMatchRow[]> {
  const ids = [...new Set(ms.flatMap((m) => (m.playerB ? [m.playerA, m.playerB] : [m.playerA])))];
  const known = await store.getPlayers(ids);
  return ms.map((m) => ({ match: m, a: player(m.playerA, known), b: m.playerB ? player(m.playerB, known) : null, flags: flags.get(m.id) ?? [] }));
}

export async function adminListMatches(f: ListFilter): Promise<AdminList> {
  let users: string[] | null = null;
  if (f.q) {
    users = await data.findUsers(f.q);
    if (users.length === 0) return { rows: [], total: 0, page: f.page, size: f.size, storeKind: store.kind, now: Date.now() };
  }
  const q: MatchQuery = { status: f.status, users, from: f.from, to: f.to };
  const now = Date.now();
  if (!f.flagged) {
    const { rows, total } = await data.matches(q, (f.page - 1) * f.size, f.size);
    return { rows: await present(rows, await flagsOf(rows)), total, page: f.page, size: f.size, storeKind: store.kind, now };
  }
  const { rows: scanned } = await data.matches(q, 0, FLAG_SCAN);
  const flags = await flagsOf(scanned);
  const flagged = scanned.filter((m) => (flags.get(m.id) ?? []).length > 0);
  const pageRows = flagged.slice((f.page - 1) * f.size, f.page * f.size);
  return { rows: await present(pageRows, flags), total: flagged.length, page: f.page, size: f.size, scanned: scanned.length, scanCap: FLAG_SCAN, storeKind: store.kind, now };
}

export async function adminMatchDetail(id: string): Promise<AdminMatchDetail> {
  const match = await store.getMatch(checkId(id));
  if (!match) throw new EloNotFoundError("Match not found");
  const [flags, answersA, answersB, log, known] = await Promise.all([
    flagsOf([match]),
    store.getAnswers(match.id, match.playerA),
    match.playerB ? store.getAnswers(match.id, match.playerB) : Promise.resolve([] as EloAnswer[]),
    data.log(LOG_DEFAULT, match.id),
    store.getPlayers(match.playerB ? [match.playerA, match.playerB] : [match.playerA]),
  ]);
  return {
    match,
    a: player(match.playerA, known),
    b: match.playerB ? player(match.playerB, known) : null,
    answersA,
    answersB,
    flags: flags.get(match.id) ?? [],
    log,
    now: Date.now(),
  };
}

/** Voids the match (rating reverted by elo_void_match / the local store) and logs it (Supabase: atomically, via elo_admin_void). Idempotent: a second call changes nothing. */
export async function adminVoidMatch(id: string, adminEmail: string): Promise<AdminVoidResult> {
  const before = await store.getMatch(checkId(id));
  if (!before) throw new EloNotFoundError("Match not found");
  await data.checkLog(); // no log table, no action
  const outcome = await data.voidMatch(before, adminEmail);
  const match = (await store.getMatch(before.id)) ?? before;
  return { match, outcome };
}

/** Rating back to 1000 (peak too), counters kept; written to elo_history (reason 'reset') and the admin log. */
export async function adminResetPlayer(userId: string, adminEmail: string): Promise<AdminResetResult> {
  const id = checkId(userId);
  if (!(await store.getPlayer(id))) throw new EloNotFoundError("Player not found");
  await data.checkLog();
  return data.reset(id, adminEmail);
}

export const adminLog = (limit: number) => data.log(limit);
