import "server-only";
import { getQuestionsByIds, sampleQuestions } from "./bank";
import { isCorrect } from "./answers";
import {
  GRACE_MS,
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
import { store, type Entry } from "./competition-store";
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

/** Starts (or resumes / reopens) the caller's round for this week. */
export async function startRound(round: RoundId, userId: string, name: string, avatar: string, now: number) {
  const week = weekId(now);
  let e = await store.get(week, round, userId);
  if (!e) {
    e = await store.create({ week, round, userId, name, avatar, ids: pick(round), startedAt: now, responses: {} });
  }
  // Running past the deadline without a submit: grade what was saved.
  if (e.submittedAt === undefined && now > deadline(e) + GRACE_MS) e = await finish(e, e.responses, now);
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
  return { score: e.score!, base: e.base!, bonus: e.bonus!, correct: e.correct!, seconds: e.seconds! };
}

/* ---------------- leaderboards ---------------- */

const totalCorrect = (c?: Record<Difficulty, number>) => (c ? c.easy + c.medium + c.hard : 0);
const order = (a: LeaderRow, b: LeaderRow) => b.score - a.score || a.seconds - b.seconds || a.name.localeCompare(b.name);

function rank(rows: Omit<LeaderRow, "rank">[]): LeaderRow[] {
  const sorted = (rows as LeaderRow[]).sort(order);
  return sorted.map((r, i) => ({ ...r, rank: i > 0 && order(sorted[i - 1], r) === 0 ? 0 : i + 1 })).map((r, i, all) => ({ ...r, rank: r.rank || all[i - 1].rank }));
}

export async function boards(week: string, userId: string | null, now: number, top = 50) {
  const done = await store.finished(week);
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
        if (!e) return { round, status: "none" };
        if (e.submittedAt === undefined && now <= deadline(e) + GRACE_MS) return { round, status: "running", startedAt: e.startedAt, endsAt: deadline(e) };
        const f = e.submittedAt === undefined ? await finish(e, e.responses, now) : e;
        return { round, status: "done", ...resultOf(f), rank: all[round].find((r) => r.userId === userId)?.rank };
      }),
    );
  }
  return { overall: cut(all.overall), rw: cut(all.rw), math: cut(all.math), mine };
}
