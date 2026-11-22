import "server-only";
import { getQuestionsByIds, sampleQuestions } from "./bank.ts";
import { isCorrect } from "./answers.ts";
import { difficultyMix, levelOf, queueWindow, questionPoints, serverElapsedMs, timeLimitS } from "./elo.ts";
import {
  ABANDON_AFTER_S,
  MATCH_SIZE,
  MAX_MATCHES_PER_DAY,
  MIXED_LAYOUT,
  MS_PER_S,
  NETWORK_GRACE_MS,
  QUEUE,
  RECENT_QUESTIONS_DAYS,
  START_DEADLINE_S,
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
  type QueueRecord,
} from "./elo-store.ts";
import type {
  AnswerResponse,
  MatchState,
  MatchSummary,
  NextResponse,
  PublicPlayer,
  RankedErrorCode,
  RankedHub,
  RankedMe,
  RankedMode,
  RankedOutcome,
  RankedQuestion,
  QueueState,
  RankedRole,
  ReviewItem,
} from "./elo-api-types.ts";
import type { Difficulty, Question } from "./types";
import type { SectionId } from "./taxonomy";

// Server side of ranked matches (docs/ELO.md sections 5, 6, 8.4; live matchmaking: docs/ELO-live.md): who plays which questions,
// server-only timing, grading, the matchmaking queue and finishing a match. Storage is elo-store.ts (Supabase or a local file); the formulas are elo.ts.
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
    return new RankedError(429, "limit_daily", e.message);
  }
  if (e instanceof EloSetupError || e instanceof EloStoreUnavailable) return new RankedError(503, "setup", e.message);
  if (e instanceof EloInvalidIdError) return badRequest("Invalid id");
  if (e instanceof EloNotFoundError) return notFound();
  if (e instanceof EloActiveMatchError) return new RankedError(409, "in_match", e.message);
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
/** The match is still being played and this side's part is not closed yet (its points are written when the part closes). */
const isActive = (m: EloMatch, role: RankedRole) => m.status === "playing" && (role === "a" ? m.pointsA : m.pointsB) === null;
/** How long a question has been open, capped at its limit (for timeouts / annulments). */
const heldMs = (row: EloAnswer, now: number) => Math.min(row.limitS * MS_PER_S, Math.max(0, now - row.issuedAt));
const roleOf = (m: EloMatch, userId: string): RankedRole | null => (m.playerA === userId ? "a" : m.playerB === userId ? "b" : null);
const ownPoints = (m: EloMatch, role: RankedRole) => (role === "a" ? m.pointsA : m.pointsB);
const startedAtOf = (m: EloMatch, role: RankedRole) => (role === "a" ? m.aStartedAt : m.bStartedAt);
/** When a side that hasn't opened its first question loses the match (3.2). Old rows without `startBy` fall back to the rule. */
const startDeadline = (m: EloMatch) => m.startBy ?? m.createdAt + START_DEADLINE_S * MS_PER_S;

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
  const mine = ownPoints(m, role);
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
    myPartDone: mine !== null,
    // Only whether the other part is closed: their points stay hidden until the match is finished.
    opponentDone: (role === "a" ? m.pointsB : m.pointsA) !== null,
    startBy: m.status === "playing" && mine === null && startedAtOf(m, role) === null ? startDeadline(m) : null,
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
   * Closes the caller's side of the match once its part is fully played: this side's points and finish time are stored, then, when
   * both sides have points, the match is finished (ELO applied, atomic and idempotent in the store). The forfeit is not written
   * here: forfeitPart records it BEFORE the rows are closed, so a concurrent settle can't close the part without it.
   * Safe to call again after a failure half-way.
   */
  async function settle(matchId: string, userId: string, role: RankedRole, now: number): Promise<EloMatch | null> {
    const m = await store.getMatch(matchId);
    if (!m || m.status !== "playing") return m;
    let cur = m;
    if (ownPoints(m, role) === null) {
      const rows = await store.getAnswers(matchId, userId);
      if (partDone(rows)) {
        const points = pointsOf(rows);
        const patch = role === "a" ? { pointsA: points, aFinishedAt: now } : { pointsB: points, bFinishedAt: now };
        cur = (await store.updateMatch(matchId, patch, ["playing"])) ?? (await store.getMatch(matchId)) ?? m;
      }
    }
    if (cur.status === "playing" && cur.pointsA !== null && cur.pointsB !== null) {
      await store.finishMatch(matchId, now);
      return store.getMatch(matchId);
    }
    return cur;
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

  /**
   * Gives the part up. The forfeit is recorded FIRST (atomically, only if nobody has forfeited yet: the first forfeit stands), then
   * every open and unplayed question is annulled and the part is settled. Recording it first matters: as soon as the last row is
   * closed another request (the opponent's poll, a hub read) may settle this part, and it must not do so without the forfeit.
   */
  async function forfeitPart(match: EloMatch, userId: string, role: RankedRole, rows: EloAnswer[], now: number) {
    await store.setForfeit(match.id, role);
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
    await settle(match.id, userId, role, now);
  }

  /**
   * Lazily moves a match on (docs/ELO-live.md 3.2-3.3), for BOTH sides; does nothing unless the status is "playing":
   *  0. both parts are closed but the match isn't finished (finishMatch failed once): it is finished now;
   *  1. self-heal: a side whose rows are all closed but whose points are missing is settled (the match is finished when both are in);
   *  2. start deadline: past `startBy` nobody started -> void;
   *  3. every side still open has a moment when it gives up: the start deadline if it never started, else its last sign of life +
   *     ABANDON_AFTER_S (the last sign is the latest of the part's start, an answer, and the end of the open question's time limit).
   *     The sides whose moment has passed forfeit in the order of those moments (tie: A), so whoever gave up first is the first
   *     forfeit, and that one stands.
   * A side that forfeited before its first question (leave) counts as started on purpose: it loses even if the other never shows.
   * Returns the match as it is afterwards.
   */
  async function resolveMatch(m: EloMatch, now: number): Promise<EloMatch> {
    if (m.status !== "playing") return m;
    const fresh = async () => (await store.getMatch(m.id)) ?? m;
    if (m.playerB === null) {
      // The other player's account is gone: nobody to play against, no rating change.
      await store.voidMatch(m.id, now);
      return fresh();
    }
    if (m.pointsA !== null && m.pointsB !== null) {
      await store.finishMatch(m.id, now);
      return fresh();
    }
    const playerB = m.playerB;
    const sides = (x: EloMatch) => [
      { role: "a" as RankedRole, userId: x.playerA, points: x.pointsA, startedAt: x.aStartedAt },
      { role: "b" as RankedRole, userId: playerB, points: x.pointsB, startedAt: x.bStartedAt },
    ];
    let cur = m;

    // 1. Self-heal.
    for (const s of sides(cur)) {
      if (s.points !== null) continue;
      if (partDone(await store.getAnswers(m.id, s.userId))) cur = (await settle(m.id, s.userId, s.role, now)) ?? cur;
      if (cur.status !== "playing") return cur;
    }

    // 2 + 3. Who gives up when.
    const deadline = startDeadline(cur);
    const open: { role: RankedRole; userId: string; rows: EloAnswer[]; started: boolean; giveUpAt: number }[] = [];
    for (const s of sides(cur)) {
      if (s.points !== null) continue;
      const rows = await store.getAnswers(m.id, s.userId);
      const started = rows.length > 0 || s.startedAt !== null;
      const lastAt = rows.reduce(
        (t, r) => Math.max(t, r.status === "open" ? r.issuedAt + r.limitS * MS_PER_S : (r.answeredAt ?? r.issuedAt)),
        s.startedAt ?? 0,
      );
      open.push({ role: s.role, userId: s.userId, rows, started, giveUpAt: started ? lastAt + ABANDON_AFTER_S * MS_PER_S : deadline });
    }
    if (open.length === 2 && open.every((s) => !s.started) && now > deadline) {
      await store.voidMatch(m.id, now);
      return fresh();
    }
    const due = open.filter((s) => now > s.giveUpAt).sort((x, y) => x.giveUpAt - y.giveUpAt || (x.role < y.role ? -1 : 1));
    for (const s of due) {
      await forfeitPart(cur, s.userId, s.role, s.rows, now);
      cur = await fresh();
      if (cur.status !== "playing") return cur;
    }
    return cur;
  }

  /** The queue row as the API shows it (docs/ELO-live.md 2): the window and the end of the search are worked out from the clock. */
  async function queueState(userId: string, rec: QueueRecord, now: number): Promise<QueueState> {
    const since = rec.status === "searching" ? rec.since : null;
    let opponent: PublicPlayer | null = null;
    if (rec.status === "matched" && rec.matchId) {
      const m = await store.getMatch(rec.matchId);
      const oppId = m ? (m.playerA === userId ? m.playerB : m.playerA) : null;
      if (oppId) opponent = publicPlayer((await store.getPlayers([oppId]))[oppId]);
    }
    return {
      status: rec.status,
      since: rec.since,
      // null = not searching, or no limit any more (queueWindow returns null from QUEUE_WINDOW.openAfterS on)
      window: since === null ? null : queueWindow(now - since),
      until: since === null ? null : since + QUEUE.searchMaxS * MS_PER_S,
      matchId: rec.matchId,
      opponent,
      searching: rec.searching,
      serverNow: now,
    };
  }

  /* ----- /api/ranked/queue ----- */

  /** Joins (or refreshes) the search. Pairing happens in the store, at once if someone suitable is already searching. */
  async function queueJoin(userId: string, input: { mode?: unknown; name?: string; avatar?: string }, now: number): Promise<QueueState> {
    const mode = input.mode ?? "mixed";
    if (mode !== "mixed") throw badRequest("Only the Mixed mode exists for now");
    const existing = await store.getPlayer(userId);
    const name = input.name ?? existing?.name ?? "";
    if (!name) throw new RankedError(403, "name", "Pick a public name before playing ranked matches.");
    const me = await store.ensurePlayer(userId, { name, avatar: input.avatar ?? existing?.avatar ?? "" }, now);
    // A no-show or abandoned match must not block the queue: it is ended first (the store itself refuses a player still in a match).
    const active = (await store.listMatches(userId)).active;
    if (active) await resolveMatch(active, now);
    const recent = new Set(await store.recentQuestionIds(userId, now - RECENT_QUESTIONS_DAYS * DAY_MS));
    const rec = await store.queueJoin({ userId, mode: "mixed", rating: me.rating, questionIds: buildQuestionSet(me.rating, recent, bank), now });
    return queueState(userId, rec, now);
  }

  /** The heartbeat + poll. Matches are not resolved here (it runs every 2 s): the hub, the match page and `next` do that. */
  async function queuePoll(userId: string, now: number): Promise<QueueState> {
    return queueState(userId, await store.queuePoll({ userId, now }), now);
  }

  async function queueCancel(userId: string, now: number): Promise<QueueState> {
    return queueState(userId, await store.queueCancel({ userId, now }), now);
  }

  /* ----- GET /api/ranked ----- */

  async function hub(userId: string, now: number): Promise<RankedHub> {
    const rec = await store.getPlayer(userId);
    // An abandoned or no-show match ends here (either player's part); reading the hub is also a sign of life in the queue and may pair the player.
    const before = (await store.listMatches(userId)).active;
    if (before) await resolveMatch(before, now);
    const queue = await queueState(userId, await store.queuePoll({ userId, now }), now);
    const lists = await store.listMatches(userId);
    const matches = [...(lists.active ? [lists.active] : []), ...lists.recent];
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
      // A finished match has both parts fully played; a playing or void one may have an unfinished part.
      const partial = m.status !== "finished";
      const rows = partial ? await store.getAnswers(m.id, userId) : [];
      const answered = partial ? closedCount(rows) : MATCH_SIZE;
      summaries.set(m.id, summarize(userId, m, players, answered, partial && rows.length ? pointsOf(rows) : ownPoints(m, role)));
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
      recent: lists.recent.map(sum),
      queue,
      limits: { dailyLeft: Math.max(0, MAX_MATCHES_PER_DAY - (await store.countStarted(userId, now - DAY_MS))) },
    };
  }

  /* ----- POST /api/ranked/[id]/next ----- */

  async function next(userId: string, matchId: string, now: number): Promise<NextResponse> {
    const loaded = await load(userId, matchId);
    const role = loaded.role;
    const match = await resolveMatch(loaded.match, now);
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
      if (row.status === "open") {
        // The part starts with its first question: the server's clock stamps it (once; a parallel request may have done it already).
        if (idx === 0 && startedAtOf((await store.getMatch(matchId)) ?? match, role) === null) {
          await store.updateMatch(matchId, role === "a" ? { aStartedAt: now } : { bStartedAt: now }, ["playing"]);
        }
        return serve(row, rows);
      }
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
    const loaded = await load(userId, matchId);
    const role = loaded.role;
    // An opponent who has been silent for long enough gave up first: that has to be settled before this player's own forfeit.
    const match = await resolveMatch(loaded.match, now);
    if (!isActive(match, role)) {
      if (match.forfeit === role) return { forfeit: true };
      throw conflict("There is nothing to leave: your part of this match is done");
    }
    await forfeitPart(match, userId, role, await store.getAnswers(matchId, userId), now);
    return { forfeit: true };
  }

  /* ----- GET /api/ranked/[id] ----- */

  async function state(userId: string, matchId: string, now: number): Promise<MatchState> {
    const loaded = await load(userId, matchId);
    const role = loaded.role;
    // Either side's no-show / abandoned part ends here; then self-heal: the last answer was stored but moving the match on failed.
    await resolveMatch(loaded.match, now);
    const match = (await settle(matchId, userId, role, now)) ?? (await load(userId, matchId)).match;
    const rows = await store.getAnswers(matchId, userId);
    const oppId = role === "a" ? match.playerB : match.playerA;
    const players = oppId ? await store.getPlayers([oppId]) : {};
    const summary = summarize(userId, match, players, closedCount(rows), ownPoints(match, role) ?? (partDone(rows) ? pointsOf(rows) : null));

    // 3.4: the review (answers, explanations) only once the whole match is over; before that the opponent is playing the same set.
    let review: ReviewItem[] | null = null;
    if (match.status !== "playing") {
      const byId = new Map(bank.byIds(rows.map((r) => r.qid)).map((q) => [q.id, q]));
      const items = rows.flatMap((r): ReviewItem[] => {
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
      review = items.length ? items : null; // a match nobody started (void) has nothing to review
    }
    const finished = match.status === "finished";
    const before = role === "a" ? match.ratingABefore : match.ratingBBefore;
    return {
      ...summary,
      serverNow: now,
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
    queueJoin: guard(queueJoin),
    queuePoll: guard(queuePoll),
    queueCancel: guard(queueCancel),
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
