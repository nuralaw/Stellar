import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getQuestionsByIds, sampleQuestions } from "./bank";
import { isCorrect } from "./answers";
import {
  GRACE_MS,
  REOPEN_MS,
  ROUNDS,
  ROUND_MIX,
  computeScore,
  weekId,
  type CompetitionQuestion,
  type LeaderRow,
  type MyRound,
  type ReviewItem,
  type RoundId,
} from "./competition";
import { StoreUnavailable, store, storeKind, type Entry } from "./competition-store";
import type { Difficulty, Question } from "./types";

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export class BadRequest extends Error {}

/* ---------------- input checks ---------------- */

export function checkUser(userId: unknown): string {
  if (typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId)) throw new BadRequest("Invalid user id");
  return userId.toLowerCase();
}
export function checkRound(round: unknown): RoundId {
  if (round !== "rw" && round !== "math") throw new BadRequest("Invalid round");
  return round;
}
export function checkName(name: unknown): string {
  const n = typeof name === "string" ? name.replace(/\s+/g, " ").trim().slice(0, 24) : "";
  if (!n) throw new BadRequest("Pick a name for the leaderboard");
  return n;
}
/** Leaderboard avatar: a short emoji, or a small raster image as a data: URL (no SVG, ≤ 16 KB). */
export function checkAvatar(a: unknown): string {
  if (typeof a !== "string") return "";
  if (/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/]+=*$/.test(a)) return a.length <= 16_000 ? a : "";
  return a.startsWith("data:") ? "" : a.slice(0, 8);
}

export function checkResponses(r: unknown, ids: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  if (!r || typeof r !== "object") return out;
  for (const id of ids) {
    const v = (r as Record<string, unknown>)[id];
    if (typeof v === "string" && v.length <= 12) out[id] = v;
  }
  return out;
}

/* ---------------- questions ---------------- */

const deadline = (e: Entry) => e.startedAt + ROUNDS[e.round].minutes * 60_000;

function pick(round: RoundId): string[] {
  // Easy → medium → hard, random within each difficulty, from every bank.
  return DIFFS.flatMap((difficulty) =>
    sampleQuestions({ section: round, domain: "all", skill: "all", difficulty, limit: ROUND_MIX[difficulty] }).map((q) => q.id),
  );
}

function strip(q: Question): CompetitionQuestion {
  return {
    id: q.id,
    section: q.section,
    difficulty: q.difficulty,
    type: q.type,
    ...(q.passage ? { passage: q.passage } : {}),
    prompt: q.prompt,
    ...(q.table ? { table: q.table } : {}),
    ...(q.figure ? { figure: { src: q.figure.src } } : {}),
    ...(q.type === "mcq" ? { choices: q.choices } : {}),
    ...(q.type === "mcq" && q.choicesImage ? { choicesImage: q.choicesImage } : {}),
    ...(q.type === "mcq" && q.choiceImages ? { choiceImages: q.choiceImages } : {}),
  };
}

function review(qs: Question[], responses: Record<string, string>): ReviewItem[] {
  return qs.map((q) => ({ id: q.id, answer: q.answer, explanation: q.explanation, correct: Boolean(responses[q.id]) && isCorrect(q, responses[q.id]) }));
}

/* ---------------- actions ---------------- */

/**
 * Starts (or resumes / reopens) the caller's round for this week.
 * `admin`: a finished or left round is replaced by a fresh one, so the owner can test rounds any number of times.
 */
export async function startRound(round: RoundId, userId: string, name: string, avatar: string, now: number, admin = false) {
  const week = weekId(now);
  let e = await store.get(week, round, userId);
  if (e && admin && (e.submittedAt !== undefined || now - e.startedAt > REOPEN_MS)) {
    await removeEntry(week, round, userId);
    e = null;
  }
  if (!e) {
    e = await store.create({ week, round, userId, name, avatar, ids: pick(round), startedAt: now, responses: {} });
  }
  // Opened again after it started: the student left the round (full screen / page) → the attempt is annulled.
  if (e.submittedAt === undefined && now - e.startedAt > REOPEN_MS) e = await annul(e, now);
  const qs = getQuestionsByIds(e.ids);
  return {
    week,
    round,
    now,
    startedAt: e.startedAt,
    endsAt: deadline(e),
    questions: qs.map(strip),
    responses: e.responses,
    ...(e.submittedAt !== undefined ? { result: resultOf(e), review: review(qs, e.responses) } : {}),
  };
}

export async function saveResponses(week: string, round: RoundId, userId: string, raw: unknown, now: number) {
  const e = await store.get(week, round, userId);
  if (!e) throw new BadRequest("Round not started");
  if (e.submittedAt !== undefined || now > deadline(e) + GRACE_MS) return { saved: false };
  await store.update(week, round, userId, { responses: checkResponses(raw, e.ids), savedAt: now });
  return { saved: true };
}

export async function submitRound(week: string, round: RoundId, userId: string, raw: unknown, now: number) {
  let e = await store.get(week, round, userId);
  if (!e) throw new BadRequest("Round not started");
  if (e.submittedAt === undefined) {
    // Late submissions don't count; the last answers saved in time do.
    const responses = now <= deadline(e) + GRACE_MS ? checkResponses(raw, e.ids) : e.responses;
    e = await finish(e, responses, now);
  }
  const qs = getQuestionsByIds(e.ids);
  return { result: resultOf(e), review: review(qs, e.responses) };
}

/** Called by the round page when the student leaves full screen (or the page) before submitting. */
export async function annulRound(week: string, round: RoundId, userId: string, now: number) {
  let e = await store.get(week, round, userId);
  if (!e) throw new BadRequest("Round not started");
  if (e.submittedAt === undefined) e = await annul(e, now);
  const qs = getQuestionsByIds(e.ids);
  return { result: resultOf(e), review: review(qs, e.responses) };
}

async function annul(e: Entry, now: number): Promise<Entry> {
  const limit = ROUNDS[e.round].minutes * 60;
  const seconds = Math.min(limit, Math.max(1, Math.round((Math.min(now, deadline(e)) - e.startedAt) / 1000)));
  const patch = { submittedAt: now, correct: { easy: 0, medium: 0, hard: 0 }, base: 0, bonus: 0, score: 0, seconds, annulled: true };
  await store.update(e.week, e.round, e.userId, patch);
  return { ...e, ...patch };
}

async function finish(e: Entry, responses: Record<string, string>, now: number): Promise<Entry> {
  const qs = getQuestionsByIds(e.ids);
  const correct: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const q of qs) if (responses[q.id] && isCorrect(q, responses[q.id])) correct[q.difficulty]++;
  const limit = ROUNDS[e.round].minutes * 60;
  const seconds = Math.min(limit, Math.max(1, Math.round((Math.min(now, deadline(e)) - e.startedAt) / 1000)));
  const { base, bonus, score } = computeScore(correct, seconds, limit);
  const patch = { responses, submittedAt: now, correct, base, bonus, score, seconds };
  await store.update(e.week, e.round, e.userId, patch);
  return { ...e, ...patch };
}

function resultOf(e: Entry) {
  return { score: e.score!, base: e.base!, bonus: e.bonus!, correct: e.correct!, seconds: e.seconds!, ...(e.annulled ? { annulled: true } : {}) };
}

/** New name / avatar from Profile: updates the caller's entries this week, so the boards show the latest. */
export async function updatePlayer(userId: string, name: string, avatar: string, now: number) {
  const week = weekId(now);
  let updated = 0;
  for (const round of ["rw", "math"] as RoundId[]) {
    const e = await store.get(week, round, userId);
    if (e && (e.name !== name || e.avatar !== avatar)) {
      await store.update(week, round, userId, { name, avatar });
      updated++;
    }
  }
  return { updated };
}

/* ---------------- leaderboards ---------------- */

const totalCorrect = (c?: Record<Difficulty, number>) => (c ? c.easy + c.medium + c.hard : 0);
const order = (a: LeaderRow, b: LeaderRow) => b.score - a.score || a.seconds - b.seconds || a.name.localeCompare(b.name);

function rank(rows: Omit<LeaderRow, "rank">[]): LeaderRow[] {
  const sorted = (rows as LeaderRow[]).sort(order);
  return sorted.map((r, i) => ({ ...r, rank: i > 0 && order(sorted[i - 1], r) === 0 ? 0 : i + 1 })).map((r, i, all) => ({ ...r, rank: r.rank || all[i - 1].rank }));
}

/** `admin`: the caller's finished / left rounds show as "none", so the hub offers Start (→ a fresh round) again. */
export async function boards(week: string, userId: string | null, now: number, top = 50, admin = false) {
  // Annulled attempts don't appear on the boards.
  const done = (await store.finished(week)).filter((e) => !e.annulled);
  const byRound = (round: RoundId) =>
    rank(
      done
        .filter((e) => e.round === round)
        .map((e) => ({ userId: e.userId, name: e.name, avatar: e.avatar, score: e.score ?? 0, correct: totalCorrect(e.correct), seconds: e.seconds ?? 0, rounds: 1 })),
    );
  const users = new Map<string, Omit<LeaderRow, "rank">>();
  for (const e of done) {
    const u = users.get(e.userId) ?? { userId: e.userId, name: e.name, avatar: e.avatar, score: 0, correct: 0, seconds: 0, rounds: 0 };
    u.score += e.score ?? 0;
    u.correct += totalCorrect(e.correct);
    u.seconds += e.seconds ?? 0;
    u.rounds++;
    users.set(e.userId, u);
  }
  const all = { overall: rank([...users.values()]), rw: byRound("rw"), math: byRound("math") };
  // User ids act as the participant's key, so they never leave the server; rows carry a `me` flag instead.
  const pub = ({ userId: id, ...r }: LeaderRow) => ({ ...r, me: id === userId });
  const cut = (rows: LeaderRow[]) => {
    const me = rows.find((r) => r.userId === userId);
    return { total: rows.length, top: rows.slice(0, top).map(pub), me: me ? pub(me) : null };
  };

  // The caller's own rounds this week.
  let mine: MyRound[] = [];
  if (userId && week === weekId(now)) {
    mine = await Promise.all(
      (["rw", "math"] as RoundId[]).map(async (round): Promise<MyRound> => {
        const e = await store.get(week, round, userId);
        if (!e || (admin && (e.submittedAt !== undefined || now - e.startedAt > REOPEN_MS))) return { round, status: "none" };
        if (e.submittedAt === undefined && now - e.startedAt <= REOPEN_MS) return { round, status: "running", startedAt: e.startedAt, endsAt: deadline(e) };
        // Started but left without submitting → annulled.
        const f = e.submittedAt === undefined ? await annul(e, now) : e;
        if (f.annulled) return { round, status: "annulled", ...resultOf(f) };
        return { round, status: "done", ...resultOf(f), rank: all[round].find((r) => r.userId === userId)?.rank };
      }),
    );
  }
  return { overall: cut(all.overall), rw: cut(all.rw), math: cut(all.math), mine };
}

/* ---------------- admin tools (/admin → Competition) ---------------- */

/** An entry as the admin list shows it (no question ids or responses). */
export interface AdminEntry {
  round: RoundId;
  userId: string;
  name: string;
  avatar: string;
  startedAt: number;
  endsAt: number;
  submittedAt?: number;
  /** Questions with a saved answer. */
  answered: number;
  correct?: Record<Difficulty, number>;
  score?: number;
  seconds?: number;
  /** running: timer still going · unsubmitted: time ran out, never submitted (annulled once seen) · submitted · annulled */
  status: "running" | "unsubmitted" | "submitted" | "annulled";
}

/** A readable message for a store error (missing table, file not writable…), or null for other errors. */
export function storeMessage(e: unknown): string | null {
  if (!(e instanceof StoreUnavailable)) return null;
  if (e.message.includes("PGRST205")) return "The competition_entries table doesn't exist yet: run supabase/setup.sql in the Supabase SQL Editor.";
  return e.message.slice(0, 300);
}

// List and delete aren't part of the store: same two paths as competition-store.ts.
const FILE = path.join(process.cwd(), ".data", "competition.json");
const fileKey = (week: string, round: string, userId: string) => `${week}|${round}|${userId}`;

function readAll(): Record<string, Entry> {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}
function writeAll(all: Record<string, Entry>) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(all));
  } catch (e) {
    throw new StoreUnavailable(`Can't write ${FILE}: ${(e as Error).message}`);
  }
}

async function sbAdmin(query: string, init: RequestInit = {}) {
  const url = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${url}/rest/v1/competition_entries${query}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new StoreUnavailable(`Supabase ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}
const eqv = (v: string) => `eq.${encodeURIComponent(v)}`;
const num = (v: unknown) => (v == null ? undefined : Number(v));

/** Removes one entry (that player can start the round again). True when something was deleted. */
async function removeEntry(week: string, round: RoundId, userId: string): Promise<boolean> {
  if (storeKind === "supabase") {
    const rows = (await sbAdmin(`?week=${eqv(week)}&round=${eqv(round)}&user_id=${eqv(userId)}`, {
      method: "DELETE",
      headers: { Prefer: "return=representation" },
    })) as unknown[];
    return rows.length > 0;
  }
  const all = readAll();
  const key = fileKey(week, round, userId);
  if (!all[key]) return false;
  delete all[key];
  writeAll(all);
  return true;
}

type Summary = Pick<Entry, "round" | "userId" | "name" | "avatar" | "startedAt" | "submittedAt" | "correct" | "score" | "seconds" | "annulled"> & { answered: number };

function adminRow(e: Summary, now: number): AdminEntry {
  const endsAt = e.startedAt + ROUNDS[e.round].minutes * 60_000;
  const status = e.annulled ? "annulled" : e.submittedAt !== undefined ? "submitted" : now <= endsAt + GRACE_MS ? "running" : "unsubmitted";
  return {
    round: e.round,
    userId: e.userId,
    name: e.name,
    avatar: e.avatar,
    startedAt: e.startedAt,
    endsAt,
    ...(e.submittedAt !== undefined ? { submittedAt: e.submittedAt } : {}),
    answered: e.answered,
    ...(e.correct ? { correct: e.correct } : {}),
    ...(e.score !== undefined ? { score: e.score } : {}),
    ...(e.seconds !== undefined ? { seconds: e.seconds } : {}),
    status,
  };
}
const summary = (e: Entry): Summary => ({ ...e, answered: Object.keys(e.responses ?? {}).length });

/** Every entry of a week (finished, annulled and unfinished), per round: submitted by score first, then the rest by start time. */
export async function adminEntries(week: string, now: number): Promise<Record<RoundId, AdminEntry[]>> {
  let rows: AdminEntry[];
  if (storeKind === "supabase") {
    const raw = (await sbAdmin(`?week=${eqv(week)}&select=round,user_id,name,avatar,started_at,submitted_at,correct,score,seconds,annulled,responses`)) as Record<string, unknown>[];
    rows = raw.map((r) =>
      adminRow(
        {
          round: r.round as RoundId,
          userId: r.user_id as string,
          name: r.name as string,
          avatar: (r.avatar as string) ?? "",
          startedAt: Number(r.started_at),
          submittedAt: num(r.submitted_at),
          correct: (r.correct as Record<Difficulty, number>) ?? undefined,
          score: num(r.score),
          seconds: num(r.seconds),
          annulled: r.annulled === true,
          answered: Object.keys((r.responses as object) ?? {}).length,
        },
        now,
      ),
    );
  } else {
    rows = Object.values(readAll())
      .filter((e) => e.week === week)
      .map((e) => adminRow(summary(e), now));
  }
  const group = (r: AdminEntry) => (r.status === "submitted" ? 0 : 1);
  rows.sort((a, b) => group(a) - group(b) || (b.score ?? 0) - (a.score ?? 0) || (a.seconds ?? 0) - (b.seconds ?? 0) || a.startedAt - b.startedAt);
  return { rw: rows.filter((r) => r.round === "rw"), math: rows.filter((r) => r.round === "math") };
}

/** Deletes an entry so that player can take the round again this week. */
export async function adminReset(week: string, round: RoundId, userId: string) {
  if (!(await removeEntry(week, round, userId))) throw new BadRequest("No such entry");
  return { deleted: true };
}

/**
 * Annul: off the boards (a round still open is closed with 0 points; a submitted one keeps its score for Restore).
 * Restore: back on the boards, graded from the last answers saved (time as recorded).
 */
export async function adminSetAnnulled(week: string, round: RoundId, userId: string, annulled: boolean, now: number): Promise<AdminEntry> {
  let e = await store.get(week, round, userId);
  if (!e) throw new BadRequest("No such entry");
  if (annulled && !e.annulled) {
    if (e.submittedAt === undefined) e = await annul(e, now);
    else {
      await store.update(week, round, userId, { annulled: true });
      e = { ...e, annulled: true };
    }
  } else if (!annulled && e.annulled) {
    const correct: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
    for (const q of getQuestionsByIds(e.ids)) if (e.responses[q.id] && isCorrect(q, e.responses[q.id])) correct[q.difficulty]++;
    const limit = ROUNDS[e.round].minutes * 60;
    const seconds = e.seconds ?? limit;
    const patch = { correct, ...computeScore(correct, seconds, limit), seconds, annulled: false };
    await store.update(week, round, userId, patch);
    e = { ...e, ...patch, annulled: undefined };
  }
  return adminRow(summary(e), now);
}
