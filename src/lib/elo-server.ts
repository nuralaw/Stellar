import "server-only";
import { getQuestionsByIds, sampleQuestions } from "./bank.ts";
import { isCorrect } from "./answers.ts";
import { difficultyMix, levelOf, questionPoints, serverElapsedMs, timeLimitS } from "./elo.ts";
import {
  MATCH_SIZE,
  MAX_MATCHES_PER_DAY,
  MAX_WAITING_MATCHES,
  MIXED_LAYOUT,
  MS_PER_S,
  NETWORK_GRACE_MS,
  RECENT_QUESTIONS_DAYS,
  START_RATING,
} from "./elo-config.ts";
import {
  EloActiveMatchError,
  EloInvalidIdError,
  EloLimitError,
  EloNotFoundError,
  EloSetupError,
  EloStoreUnavailable,
  store as defaultStore,
  type EloAnswer,
  type EloMatch,
  type EloPlayerRecord,
  type EloStore,
} from "./elo-store.ts";
import type {
  AnswerResponse,
  MatchState,
  MatchSummary,
  NextResponse,
  PlayResponse,
  PublicPlayer,
  RankedErrorCode,
  RankedHub,
  RankedMe,
  RankedMode,
  RankedOutcome,
  RankedQuestion,
  RankedRole,
  ReviewItem,
} from "./elo-api-types.ts";
import type { Difficulty, Question } from "./types";
import type { SectionId } from "./taxonomy";

// Server side of ranked matches (docs/ELO.md sections 5, 6, 8.4): who plays which questions, server-only timing, grading,
// matchmaking and finishing a match. Storage is elo-store.ts (Supabase or a local file); the formulas are elo.ts.
// Everything here is independent of HTTP and of the login: the routes (src/app/api/ranked/**) authenticate and call `ranked`.
// Time is always passed in as `now` (the server clock of the route); the client's clock is never read.

/** An error with the HTTP status and code of docs/ELO.md 8.4; the routes answer `{ error, code }` with it. */
export class RankedError extends Error {
  status: number;
  code: RankedErrorCode;
  constructor(status: number, code: RankedErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const notFound = () => new RankedError(404, "not_found", "Match not found");
const conflict = (message: string) => new RankedError(409, "conflict", message);
const badRequest = (message: string) => new RankedError(400, "bad_request", message);

/** Store errors -> RankedError (anything else is returned as is, and becomes a 500). */
export function translateError(e: unknown): unknown {
  if (e instanceof RankedError) return e;
  if (e instanceof EloLimitError) {
    return new RankedError(429, e.kind === "waiting" ? "limit_waiting" : "limit_daily", e.message);
  }
  if (e instanceof EloSetupError || e instanceof EloStoreUnavailable) return new RankedError(503, "setup", e.message);
  if (e instanceof EloInvalidIdError) return badRequest("Invalid id");
  if (e instanceof EloNotFoundError) return notFound();
  if (e instanceof EloActiveMatchError) return conflict(e.message);
  return e;
}

/* ---------------- question bank ---------------- */

/** What the server needs from the question bank (a seam, so the tests can use a small fake one). */
export interface QuestionBank {
  /** Up to `limit` random questions of a section and difficulty, ones not in `exclude` first. */
  sample(q: { section: SectionId; difficulty: Difficulty; limit: number; exclude: Set<string> }): Question[];
  byIds(ids: string[]): Question[];
}

/** The live bank. Like the tournament, it draws from every source (General and College Board). */
export const liveBank: QuestionBank = {
  sample: ({ section, difficulty, limit, exclude }) => sampleQuestions({ section, domain: "all", skill: "all", difficulty, limit, exclude }),
  byIds: getQuestionsByIds,
};

const DIFFS: readonly Difficulty[] = ["easy", "medium", "hard"];
const SECTIONS: readonly SectionId[] = ["rw", "math"];
const HOUR_MS = 60 * 60 * MS_PER_S;
const DAY_MS = 24 * HOUR_MS;
/**
 * A part nobody has touched for this long (counted from the last thing that happened: the match start, an answer, or the end of
 * the last issued question's time limit) is abandoned. It is resolved lazily on the next read of the hub / the match / play / next:
 * a B part is forfeited (annulled, loss, match finished); an A part that answered something is forfeited too (the match goes on to
 * waiting, so B can still play it and win); an A part that answered nothing just expires (no rating change).
 */
export const STALE_PART_MS = 30 * 60 * MS_PER_S;

/**
 * Splits the creator's difficulty mix (10 questions) between the two sections, 5 + 5: every difficulty is halved, and the odd
 * leftover question of a difficulty goes to the section that has fewer so far (ties: RW). Example {easy 3, medium 5, hard 2}:
 * RW 2 easy + 2 medium + 1 hard, Math 1 easy + 3 medium + 1 hard... each section ends with exactly 5 (the leftovers always even out).
 */
export function splitMix(mix: Record<Difficulty, number>): Record<SectionId, Record<Difficulty, number>> {
  const out: Record<SectionId, Record<Difficulty, number>> = {
    rw: { easy: 0, medium: 0, hard: 0 },
    math: { easy: 0, medium: 0, hard: 0 },
  };
  const total: Record<SectionId, number> = { rw: 0, math: 0 };
  for (const d of DIFFS) {
    const half = Math.floor(mix[d] / 2);
    for (const s of SECTIONS) {
      out[s][d] = half;
      total[s] += half;
    }
    if (mix[d] % 2 === 1) {
      const s: SectionId = total.rw <= total.math ? "rw" : "math";
      out[s][d] += 1;
      total[s] += 1;
    }
  }
  return out;
}

/** The difficulties to try for a slot: the wanted one, then the nearest others. */
function difficultyOrder(want: Difficulty): Difficulty[] {
  const i = DIFFS.indexOf(want);
  return [...DIFFS].sort((a, b) => Math.abs(DIFFS.indexOf(a) - i) - Math.abs(DIFFS.indexOf(b) - i) || DIFFS.indexOf(a) - DIFFS.indexOf(b));
}

/** `n` new questions of one section: the wanted difficulty first (fresh ones before seen ones), other difficulties only if it runs short. */
function draw(bank: QuestionBank, section: SectionId, want: Difficulty, n: number, chosen: Set<string>, recent: Set<string>): Question[] {
  const got: Question[] = [];
  for (const d of difficultyOrder(want)) {
    if (got.length >= n) break;
    // Ask for enough extra to skip what is already chosen.
    const pool = bank.sample({ section, difficulty: d, limit: n + chosen.size + got.length, exclude: recent });
    for (const q of pool) {
      if (got.length >= n) break;
      if ((q.type !== "mcq" && q.type !== "spr") || chosen.has(q.id) || got.some((g) => g.id === q.id)) continue;
      got.push(q);
    }
  }
  if (got.length < n) throw new Error(`The question bank has too few ${section} questions for a ranked match`);
  return got;
}

/**
 * The 10 question ids of a new match (5.2): Mixed = RW and Math alternating (MIXED_LAYOUT), difficulty counts from the creator's
 * rating split between sections by splitMix. Inside a section the questions run easy -> hard, so both players get the same order.
 * Questions in `recent` (the creator's last 30 days) are avoided when the bank has enough others.
 */
export function buildQuestionSet(rating: number, recent: Set<string>, bank: QuestionBank): string[] {
  const split = splitMix(difficultyMix(rating));
  const chosen = new Set<string>();
  const lists: Record<SectionId, Question[]> = { rw: [], math: [] };
  for (const section of SECTIONS) {
    for (const d of DIFFS) {
      for (const q of draw(bank, section, d, split[section][d], chosen, recent)) {
        chosen.add(q.id);
        lists[section].push(q);
      }
    }
    lists[section].sort((a, b) => DIFFS.indexOf(a.difficulty) - DIFFS.indexOf(b.difficulty));
  }
  const next: Record<SectionId, number> = { rw: 0, math: 0 };
  return MIXED_LAYOUT.map((section) => lists[section][next[section]++].id);
}

/** Which image of a question: the figure, the single image with all choices, or one choice's image. */
export type ImageKey = "figure" | "choices" | "A" | "B" | "C" | "D";
export const IMAGE_KEYS: readonly ImageKey[] = ["figure", "choices", "A", "B", "C", "D"];

/** The bank path of one image of a question, or null when it has none. */
export function imageSrcOf(q: Question, key: ImageKey): string | null {
  if (key === "figure") return q.figure?.src ?? null;
  if (q.type !== "mcq") return null;
  if (key === "choices") return q.choicesImage ?? null;
  return q.choiceImages?.[key] ?? null;
}

/**
 * A question as the player sees it: no id, answer or explanation. With `imgUrl` the image paths (/bank/img/rw/eng_0006.webp, which
 * name the question and are public) are replaced by match-scoped URLs; without it (the review, after the player's part) they stay.
 */
export function toRankedQuestion(q: Question, imgUrl?: (key: ImageKey) => string): RankedQuestion {
  const src = (key: ImageKey, real: string) => (imgUrl ? imgUrl(key) : real);
  return {
    section: q.section,
    difficulty: q.difficulty,
    type: q.type,
    ...(q.passage ? { passage: q.passage } : {}),
    prompt: q.prompt,
    ...(q.table ? { table: q.table } : {}),
    ...(q.figure ? { figure: { src: src("figure", q.figure.src) } } : {}),
    ...(q.type === "mcq" ? { choices: q.choices } : {}),
    ...(q.type === "mcq" && q.choicesImage ? { choicesImage: src("choices", q.choicesImage) } : {}),
    ...(q.type === "mcq" && q.choiceImages
      ? { choiceImages: Object.fromEntries(Object.entries(q.choiceImages).map(([k, v]) => [k, src(k as ImageKey, v)])) as typeof q.choiceImages }
      : {}),
  };
}

/** The file of a bank image path for `public/`: only /bank/... and /tests/... paths without tricks, else null. */
export function publicImagePath(src: string): string | null {
  if (!/^\/(bank|tests)\/[A-Za-z0-9_\-./]+$/.test(src) || src.includes("..") || src.includes("//")) return null;
  return src.slice(1);
}

/* ---------------- helpers ---------------- */

const pointsOf = (rows: EloAnswer[]) => rows.reduce((sum, r) => sum + r.points, 0);
const closedCount = (rows: EloAnswer[]) => rows.filter((r) => r.status !== "open").length;
/** All questions of the match issued and closed. */
const partDone = (rows: EloAnswer[]) => rows.length >= MATCH_SIZE && closedCount(rows) >= MATCH_SIZE;
/** The match is waiting for this very player to play (A in playing_a, B in playing_b). */
const isActive = (m: EloMatch, role: RankedRole) => (role === "a" ? m.status === "playing_a" : m.status === "playing_b");
/** How long a question has been open, capped at its limit (for timeouts / annulments). */
const heldMs = (row: EloAnswer, now: number) => Math.min(row.limitS * MS_PER_S, Math.max(0, now - row.issuedAt));
const roleOf = (m: EloMatch, userId: string): RankedRole | null => (m.playerA === userId ? "a" : m.playerB === userId ? "b" : null);

function publicPlayer(p: EloPlayerRecord | undefined): PublicPlayer {
  const rating = p?.rating ?? START_RATING;
  return { name: p?.name ?? "", avatar: p?.avatar ?? "", rating, level: levelOf(rating, p?.matches ?? 0) };
}

function outcomeOf(m: EloMatch, role: RankedRole): RankedOutcome | null {
  if (m.status !== "finished" || m.result === null) return null;
  return m.result === "draw" ? "draw" : m.result === role ? "win" : "loss";
}

/** One match as the hub lists it. `answered` and `myPoints` are the caller's own figures. */
function summarize(userId: string, m: EloMatch, players: Record<string, EloPlayerRecord>, answered: number, myPoints: number | null): MatchSummary {
  const role = m.playerA === userId ? "a" : "b";
  const oppId = role === "a" ? m.playerB : m.playerA;
  const finished = m.status === "finished";
  return {
    id: m.id,
    mode: m.mode as RankedMode,
    status: m.status,
    role,
    createdAt: m.createdAt,
    answered,
    total: MATCH_SIZE,
    myPoints,
    opponentPoints: finished ? (role === "a" ? m.pointsB : m.pointsA) : null,
    opponent: oppId ? publicPlayer(players[oppId]) : null,
    outcome: outcomeOf(m, role),
    delta: finished ? (role === "a" ? m.deltaA : m.deltaB) : null,
    expiresAt: m.status === "waiting" ? m.expiresAt : null,
  };
}

/* ---------------- the service ---------------- */

/**
 * The ranked-match logic on top of a store and a bank. `ranked` (below) is the real one; tests build their own on a temp file.
 * Every method may throw RankedError (status + code for the route).
 */
export function createRankedService(store: EloStore, bank: QuestionBank = liveBank, opts: { guestImageUrls?: boolean } = {}) {
  /** Match-scoped image URLs of one question (no question id in them). Local guests (no Supabase) have no cookie: userId goes along. */
  const imageUrls = (userId: string, matchId: string, idx: number) => (key: ImageKey) =>
    `/api/ranked/${matchId}/img?idx=${idx}&k=${key}${opts.guestImageUrls ? `&userId=${encodeURIComponent(userId)}` : ""}`;

  const guard =
    <A extends unknown[], R>(fn: (...args: A) => Promise<R>) =>
    async (...args: A): Promise<R> => {
      try {
        return await fn(...args);
      } catch (e) {
        throw translateError(e);
      }
    };

  /** The match and the caller's role in it; strangers get the same 404 as a missing match. */
  async function load(userId: string, matchId: string): Promise<{ match: EloMatch; role: RankedRole }> {
    const match = await store.getMatch(matchId);
    const role = match ? roleOf(match, userId) : null;
    if (!match || !role) throw notFound();
    return { match, role };
  }

  /**
   * If the caller's part is fully played, moves the match on: A -> waiting (points and aFinishedAt stored), B -> points stored and the
   * match finished (ELO applied, atomic and idempotent in the store). Safe to call again after a failure half-way.
   */
  async function settle(matchId: string, userId: string, role: RankedRole, now: number, forfeit?: RankedRole): Promise<EloMatch | null> {
    const m = await store.getMatch(matchId);
    if (!m || !isActive(m, role)) return m;
    const rows = await store.getAnswers(matchId, userId);
    if (!partDone(rows)) return m;
    const points = pointsOf(rows);
    // The first forfeit stands: a match already marked as forfeited by the other player keeps that loser.
    const fo = m.forfeit === null ? forfeit : undefined;
    if (role === "a") {
      const patch = { status: "waiting" as const, aFinishedAt: now, pointsA: points, ...(fo ? { forfeit: fo } : {}) };
      return (await store.updateMatch(matchId, patch, ["playing_a"])) ?? (await store.getMatch(matchId));
    }
    await store.updateMatch(matchId, { pointsB: points, ...(fo ? { forfeit: fo } : {}) }, ["playing_b"]);
    await store.finishMatch(matchId, now);
    return store.getMatch(matchId);
  }

  const closeZero = (status: "timeout" | "annulled", row: EloAnswer, now: number) =>
    store.closeAnswer(row.matchId, row.userId, row.idx, {
      status,
      answeredAt: now,
      response: null,
      elapsedMs: heldMs(row, now),
      correct: false,
      base: 0,
      bonus: 0,
      points: 0,
    });

  /** Gives the part up: every open and unplayed question is annulled, then the match moves on with the forfeit (loss) recorded. */
  async function forfeitPart(match: EloMatch, userId: string, role: RankedRole, rows: EloAnswer[], now: number) {
    for (let idx = 0; idx < MATCH_SIZE; idx++) {
      let row = rows.find((r) => r.idx === idx);
      if (row && row.status !== "open") continue;
      if (!row) {
        const q = bank.byIds([match.questionIds[idx]])[0];
        const section = q?.section ?? MIXED_LAYOUT[idx];
        const difficulty = q?.difficulty ?? "medium";
        row = await store.openAnswer({ matchId: match.id, userId, idx, qid: match.questionIds[idx], section, difficulty, limitS: timeLimitS(section, difficulty), issuedAt: now });
      }
      await closeZero("annulled", row, now);
    }
    await settle(match.id, userId, role, now, role);
  }

  /**
   * Lazily ends an abandoned part (STALE_PART_MS without activity): see STALE_PART_MS for the rules. Only a match in playing_a /
   * playing_b is touched. Returns the match as it is afterwards.
   */
  async function resolveStale(m: EloMatch, now: number): Promise<EloMatch> {
    const role: RankedRole | null = m.status === "playing_a" ? "a" : m.status === "playing_b" ? "b" : null;
    const userId = role === "a" ? m.playerA : role === "b" ? m.playerB : null;
    if (!role || !userId) return m;
    const rows = await store.getAnswers(m.id, userId);
    if (partDone(rows)) return (await settle(m.id, userId, role, now)) ?? m;
    // Last sign of life: the part started, a question's time limit ended, or an answer arrived.
    const start = role === "a" ? m.createdAt : (m.bStartedAt ?? m.createdAt);
    const lastAt = rows.reduce(
      (t, r) => Math.max(t, r.status === "open" ? r.issuedAt + r.limitS * MS_PER_S : (r.answeredAt ?? r.issuedAt)),
      start,
    );
    if (now - lastAt <= STALE_PART_MS) return m;
    if (role === "a" && !rows.some((r) => r.status === "answered")) {
      return (await store.updateMatch(m.id, { status: "expired" }, ["playing_a"])) ?? (await store.getMatch(m.id)) ?? m;
    }
    await forfeitPart(m, userId, role, rows, now);
    return (await store.getMatch(m.id)) ?? m;
  }

  /* ----- GET /api/ranked ----- */

  async function hub(userId: string, now: number): Promise<RankedHub> {
    const rec = await store.getPlayer(userId);
    let lists = await store.listMatches(userId, { now });
    // Abandoned parts (the player's own match in progress, or an opponent's part the player's waiting match is stuck on) end here.
    const inProgress = [lists.active, ...lists.waiting.filter((m) => m.status === "playing_b")];
    let changed = false;
    for (const m of inProgress) if (m && (await resolveStale(m, now)).status !== m.status) changed = true;
    if (changed) lists = await store.listMatches(userId, { now });
    const matches = [...(lists.active ? [lists.active] : []), ...lists.waiting, ...lists.recent];
    const oppIds = new Set<string>();
    for (const m of matches) {
      const opp = m.playerA === userId ? m.playerB : m.playerA;
      if (opp) oppIds.add(opp);
    }
    const players = await store.getPlayers([...oppIds]);
    const summaries = new Map<string, MatchSummary>();
    for (const m of matches) {
      if (summaries.has(m.id)) continue;
      const role = m.playerA === userId ? "a" : "b";
      // Only a match in progress (or a voided one) can have an unfinished part; the others are fully played.
      const partial = lists.active?.id === m.id || m.status === "void" || (m.status === "expired" && m.aFinishedAt === null);
      const rows = partial ? await store.getAnswers(m.id, userId) : [];
      const answered = partial ? closedCount(rows) : MATCH_SIZE;
      const stored = role === "a" ? m.pointsA : m.pointsB;
      summaries.set(m.id, summarize(userId, m, players, answered, partial && rows.length ? pointsOf(rows) : stored));
    }
    const sum = (m: EloMatch) => summaries.get(m.id)!;
    const me: RankedMe = {
      ...publicPlayer(rec ?? undefined),
      peak: rec?.peak ?? START_RATING,
      matches: rec?.matches ?? 0,
      wins: rec?.wins ?? 0,
      losses: rec?.losses ?? 0,
      draws: rec?.draws ?? 0,
      needsName: !rec?.name,
    };
    return {
      me,
      active: lists.active ? sum(lists.active) : null,
      waiting: lists.waiting.map(sum),
      recent: lists.recent.map(sum),
      limits: {
        waitingLeft: Math.max(0, MAX_WAITING_MATCHES - (await store.countWaiting(userId))),
        dailyLeft: Math.max(0, MAX_MATCHES_PER_DAY - (await store.countStarted(userId, now - DAY_MS))),
      },
    };
  }

  /* ----- POST /api/ranked/play ----- */

  async function play(userId: string, input: { mode?: unknown; name?: string; avatar?: string }, now: number): Promise<PlayResponse> {
    const mode = input.mode ?? "mixed";
    if (mode !== "mixed") throw badRequest("Only the Mixed mode exists for now");
    const existing = await store.getPlayer(userId);
    const name = input.name ?? existing?.name ?? "";
    if (!name) throw new RankedError(403, "name", "Pick a public name before playing ranked matches.");
    const me = await store.ensurePlayer(userId, { name, avatar: input.avatar ?? existing?.avatar ?? "" }, now);

    const resume = async (m: EloMatch): Promise<PlayResponse> => {
      const role = roleOf(m, userId)!;
      const oppId = role === "b" ? m.playerA : m.playerB;
      const opp = oppId ? (await store.getPlayers([oppId]))[oppId] : undefined;
      return { matchId: m.id, role, opponent: role === "b" ? publicPlayer(opp) : null, resumed: true };
    };

    // 5.4.1: a match in progress is continued, never duplicated.
    const lists = await store.listMatches(userId, { now });
    if (lists.active) {
      // An abandoned one (STALE_PART_MS) is ended first and doesn't count as "in progress".
      const m = await resolveStale(lists.active, now);
      if (m.status === lists.active.status) return resume(m);
    }

    // 5.4.2: the oldest suitable waiting match.
    let claimed: EloMatch | null = null;
    try {
      claimed = await store.claimWaiting({ userId, rating: me.rating, mode: "mixed", now });
    } catch (e) {
      if (!(e instanceof EloActiveMatchError)) throw e;
      // Raced with another request of the same player that already started a match.
      const again = (await store.listMatches(userId, { now })).active;
      if (again) return resume(again);
      throw e;
    }
    if (claimed) {
      const opp = (await store.getPlayers([claimed.playerA]))[claimed.playerA];
      return { matchId: claimed.id, role: "b", opponent: publicPlayer(opp), resumed: false };
    }

    // 5.4.3: nobody to play with: a new match, this player is A.
    const recent = new Set(await store.recentQuestionIds(userId, now - RECENT_QUESTIONS_DAYS * DAY_MS));
    try {
      const created = await store.createMatch({ mode: "mixed", playerA: userId, questionIds: buildQuestionSet(me.rating, recent, bank), now });
      return { matchId: created.id, role: "a", opponent: null, resumed: false };
    } catch (e) {
      if (!(e instanceof EloActiveMatchError)) throw e;
      // A parallel /play of the same player created their match first: continue that one.
      const again = (await store.listMatches(userId, { now })).active;
      if (again) return resume(again);
      throw e;
    }
  }

  /* ----- POST /api/ranked/[id]/next ----- */

  async function next(userId: string, matchId: string, now: number): Promise<NextResponse> {
    const loaded = await load(userId, matchId);
    const role = loaded.role;
    const match = await resolveStale(loaded.match, now);
    const serve = (row: EloAnswer, rows: EloAnswer[]): NextResponse => {
      const q = bank.byIds([row.qid])[0];
      if (!q) throw new Error(`Question ${row.qid} of match ${matchId} is not in the bank`);
      return {
        done: false,
        idx: row.idx,
        total: MATCH_SIZE,
        section: row.section,
        difficulty: row.difficulty,
        question: toRankedQuestion(q, imageUrls(userId, matchId, row.idx)),
        limitS: row.limitS,
        issuedAt: row.issuedAt,
        serverNow: now,
        totalPoints: pointsOf(rows),
      };
    };
    if (!isActive(match, role)) {
      const rows = await store.getAnswers(matchId, userId);
      if (partDone(rows)) return { done: true, totalPoints: pointsOf(rows) };
      throw conflict("This match isn't open for you");
    }
    // Parallel calls (double clicks, StrictMode) may close / open questions under our feet, so each pass starts from fresh rows.
    for (let attempt = 0; attempt < 4; attempt++) {
      const rows = await store.getAnswers(matchId, userId);
      // The open question is handed out again (same idx and issuedAt, the current serverNow) while its time isn't up, so a reload,
      // a double click or a double effect neither burns a question nor lets the player skip one. Once its time is up (the same
      // limit + network grace that `answer` uses) it is closed as a timeout and the next question is issued.
      const open = rows.find((r) => r.status === "open");
      if (open) {
        if (now - open.issuedAt <= open.limitS * MS_PER_S + NETWORK_GRACE_MS) return serve(open, rows);
        await closeZero("timeout", open, now); // null = another request closed it first; either way look again
        continue;
      }
      if (rows.length >= MATCH_SIZE) {
        await settle(matchId, userId, role, now);
        return { done: true, totalPoints: pointsOf(rows) };
      }
      const idx = rows.length;
      const q = bank.byIds([match.questionIds[idx]])[0];
      if (!q) throw new Error(`Question ${match.questionIds[idx]} of match ${matchId} is not in the bank`);
      // The server's clock stamps the moment the question is handed out; a row opened meanwhile by a parallel request is kept as is.
      const row = await store.openAnswer({ matchId, userId, idx, qid: q.id, section: q.section, difficulty: q.difficulty, limitS: timeLimitS(q.section, q.difficulty), issuedAt: now });
      if (row.status === "open") return serve(row, rows);
    }
    throw conflict("busy"); // rare: parallel requests kept changing the rows; the client may simply retry
  }

  /** The row the caller may close now: the match must be theirs and open for them, and the question issued and still open. */
  async function openRow(userId: string, matchId: string, idx: unknown): Promise<{ match: EloMatch; role: RankedRole; row: EloAnswer; rows: EloAnswer[]; idx: number }> {
    if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0 || idx >= MATCH_SIZE) throw badRequest("Invalid question number");
    const { match, role } = await load(userId, matchId);
    const rows = await store.getAnswers(matchId, userId);
    const row = rows.find((r) => r.idx === idx);
    if (!isActive(match, role) || !row) throw conflict("That question isn't open");
    return { match, role, row, rows, idx };
  }

  /* ----- POST /api/ranked/[id]/answer ----- */

  async function answer(userId: string, matchId: string, idx: unknown, response: unknown, now: number): Promise<AnswerResponse> {
    if (typeof response !== "string" || response.length > 12) throw badRequest("Invalid response");
    const { role, row, rows, idx: i } = await openRow(userId, matchId, idx);
    if (row.status !== "open") throw conflict("That question was already answered");
    // 6.1: the time is the server's, minus the network grace; the client sends nothing about time.
    const elapsedMs = Math.floor(serverElapsedMs(row.issuedAt, now));
    const q = bank.byIds([row.qid])[0];
    if (!q) throw new Error(`Question ${row.qid} is not in the bank`);
    const correct = response !== "" && isCorrect(q, response);
    const pts = questionPoints({ section: row.section, difficulty: row.difficulty, correct, elapsedMs });
    const closed = await store.closeAnswer(matchId, userId, i, {
      status: pts.timedOut ? "timeout" : "answered",
      answeredAt: now,
      response: response === "" ? null : response,
      elapsedMs,
      correct: correct && !pts.timedOut,
      base: pts.base,
      bonus: pts.bonus,
      points: pts.points,
    });
    if (!closed) throw conflict("That question was already answered");
    const others = rows.filter((r) => r.idx !== i);
    const done = rows.length >= MATCH_SIZE && closedCount(others) >= MATCH_SIZE - 1;
    if (done) await settle(matchId, userId, role, now);
    return {
      idx: i,
      correct: closed.correct === true,
      timedOut: pts.timedOut,
      base: pts.base,
      bonus: pts.bonus,
      points: pts.points,
      elapsedMs,
      totalPoints: pointsOf(others) + pts.points,
      done,
    };
  }

  /* ----- POST /api/ranked/[id]/annul ----- */

  /** The player left the tab during a question (6.3): that question is worth 0. Repeating it is harmless. */
  async function annul(userId: string, matchId: string, idx: unknown, now: number): Promise<AnswerResponse> {
    const { role, row, rows, idx: i } = await openRow(userId, matchId, idx);
    if (row.status !== "open" && row.status !== "annulled") throw conflict("That question was already answered");
    const others = rows.filter((r) => r.idx !== i);
    if (row.status === "open") {
      const closed = await closeZero("annulled", row, now);
      if (!closed) throw conflict("That question was already answered");
    }
    const done = rows.length >= MATCH_SIZE && closedCount(others) >= MATCH_SIZE - 1;
    if (done) await settle(matchId, userId, role, now);
    return {
      idx: i,
      correct: false,
      timedOut: false,
      base: 0,
      bonus: 0,
      points: 0,
      elapsedMs: row.elapsedMs ?? heldMs(row, now),
      totalPoints: pointsOf(others),
      done,
    };
  }

  /* ----- POST /api/ranked/[id]/leave ----- */

  /** Forfeit (4.2): the match is lost whatever the points; open and unplayed questions are annulled. */
  async function leave(userId: string, matchId: string, now: number): Promise<{ forfeit: true }> {
    const { match, role } = await load(userId, matchId);
    if (match.forfeit === role) return { forfeit: true };
    if (!isActive(match, role)) throw conflict("There is nothing to leave: your part of this match is done");
    await forfeitPart(match, userId, role, await store.getAnswers(matchId, userId), now);
    return { forfeit: true };
  }

  /* ----- GET /api/ranked/[id] ----- */

  async function state(userId: string, matchId: string, now: number): Promise<MatchState> {
    const loaded = await load(userId, matchId);
    const role = loaded.role;
    // An abandoned part (either player's) ends here; self-heal: the last answer was stored but moving the match on failed.
    await resolveStale(loaded.match, now);
    const match = (await settle(matchId, userId, role, now)) ?? (await load(userId, matchId)).match;
    const rows = await store.getAnswers(matchId, userId);
    const done = partDone(rows);
    const oppId = role === "a" ? match.playerB : match.playerA;
    const players = oppId ? await store.getPlayers([oppId]) : {};
    const stored = role === "a" ? match.pointsA : match.pointsB;
    const summary = summarize(userId, match, players, closedCount(rows), done ? (stored ?? pointsOf(rows)) : null);

    let review: ReviewItem[] | null = null;
    if (done) {
      const byId = new Map(bank.byIds(rows.map((r) => r.qid)).map((q) => [q.id, q]));
      review = rows.flatMap((r): ReviewItem[] => {
        const q = byId.get(r.qid);
        if (!q || r.status === "open") return [];
        return [
          {
            idx: r.idx,
            section: r.section,
            difficulty: r.difficulty,
            question: toRankedQuestion(q),
            answer: q.answer,
            explanation: q.explanation,
            response: r.response,
            correct: r.correct === true,
            status: r.status,
            elapsedMs: r.elapsedMs,
            limitS: r.limitS,
            base: r.base,
            bonus: r.bonus,
            points: r.points,
          },
        ];
      });
    }
    const finished = match.status === "finished";
    const before = role === "a" ? match.ratingABefore : match.ratingBBefore;
    return {
      ...summary,
      myPartDone: done,
      ratingBefore: finished ? before : null,
      ratingAfter: finished && before !== null && summary.delta !== null ? before + summary.delta : null,
      // The opponent's forfeit stays hidden until the match is finished.
      forfeit: match.status === "finished" || match.forfeit === role ? match.forfeit : null,
      review,
    };
  }

  /* ----- GET /api/ranked/[id]/img ----- */

  /**
   * The public/ path of one image of a question the caller has been issued in this match (404 otherwise). The questions' own
   * paths name the question and are public, so the player's JSON only carries URLs of this route (see imageUrls).
   */
  async function image(userId: string, matchId: string, idx: unknown, key: unknown): Promise<string> {
    if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0 || idx >= MATCH_SIZE) throw badRequest("Invalid question number");
    if (typeof key !== "string" || !IMAGE_KEYS.includes(key as ImageKey)) throw badRequest("Invalid image");
    await load(userId, matchId);
    const row = (await store.getAnswers(matchId, userId)).find((r) => r.idx === idx);
    const q = row ? bank.byIds([row.qid])[0] : undefined;
    const src = q ? imageSrcOf(q, key as ImageKey) : null;
    const file = src ? publicImagePath(src) : null;
    if (!file) throw notFound();
    return file;
  }

  return {
    image: guard(image),
    hub: guard(hub),
    play: guard(play),
    next: guard(next),
    answer: guard(answer),
    annul: guard(annul),
    leave: guard(leave),
    state: guard(state),
  };
}

/** The real service: live bank, default store (Supabase when configured, else .data/elo.json). */
export const ranked = createRankedService(defaultStore, liveBank, {
  // Same condition as `authConfigured` (lib/supabase/server.ts): without Supabase Auth there is no cookie, guests are told apart by id.
  guestImageUrls: !(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
});
