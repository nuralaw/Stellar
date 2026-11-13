import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Difficulty } from "./types";
import type { RoundId } from "./competition";

// Where competition entries live.
//  - Supabase (production): set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and run supabase/competition.sql once.
//    The service key stays on the server; the table has RLS on with no policies, so browsers can't touch it directly.
//  - Local file (development fallback): .data/competition.json. Doesn't work on Vercel (read-only file system).

export interface Entry {
  week: string;
  round: RoundId;
  userId: string;
  name: string;
  avatar: string;
  /** Question ids, in the order shown. */
  ids: string[];
  startedAt: number;
  /** Latest responses saved before the deadline (question id → response). */
  responses: Record<string, string>;
  savedAt?: number;
  submittedAt?: number;
  correct?: Record<Difficulty, number>;
  base?: number;
  bonus?: number;
  score?: number;
  seconds?: number;
  /** Left full screen (or the page) mid-round: scored 0, kept off the leaderboards. */
  annulled?: boolean;
}

export class StoreUnavailable extends Error {}

interface Store {
  get(week: string, round: RoundId, userId: string): Promise<Entry | null>;
  /** Inserts unless an entry already exists; returns the stored entry. */
  create(e: Entry): Promise<Entry>;
  update(week: string, round: RoundId, userId: string, patch: Partial<Entry>): Promise<void>;
  /** Finished entries of a week. */
  finished(week: string): Promise<Entry[]>;
  /** Re-keys an entry to another participant id, unless that id already has one. True when moved. */
  move(week: string, round: RoundId, from: string, to: string): Promise<boolean>;
}

/* ---------------- local file ---------------- */

const FILE = path.join(process.cwd(), ".data", "competition.json");
const k = (week: string, round: string, userId: string) => `${week}|${round}|${userId}`;

function readFile(): Record<string, Entry> {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}
function writeFile(all: Record<string, Entry>) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(all));
  } catch (e) {
    throw new StoreUnavailable(`Can't write ${FILE}: ${(e as Error).message}. Configure Supabase for production.`);
  }
}

const fileStore: Store = {
  async get(week, round, userId) {
    return readFile()[k(week, round, userId)] ?? null;
  },
  async create(e) {
    const all = readFile();
    const key = k(e.week, e.round, e.userId);
    if (!all[key]) {
      all[key] = e;
      writeFile(all);
    }
    return all[key];
  },
  async update(week, round, userId, patch) {
    const all = readFile();
    const key = k(week, round, userId);
    if (!all[key]) return;
    all[key] = { ...all[key], ...patch };
    writeFile(all);
  },
  async finished(week) {
    return Object.values(readFile()).filter((e) => e.week === week && e.submittedAt !== undefined);
  },
  async move(week, round, from, to) {
    const all = readFile();
    const src = all[k(week, round, from)];
    if (!src || all[k(week, round, to)]) return false;
    all[k(week, round, to)] = { ...src, userId: to };
    delete all[k(week, round, from)];
    writeFile(all);
    return true;
  },
};

/* ---------------- Supabase (PostgREST) ---------------- */

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Row = Record<string, unknown>;
const toRow = (e: Partial<Entry>): Row => {
  const r: Row = {};
  const map: Record<string, string> = {
    week: "week",
    round: "round",
    userId: "user_id",
    name: "name",
    avatar: "avatar",
    ids: "ids",
    startedAt: "started_at",
    responses: "responses",
    savedAt: "saved_at",
    submittedAt: "submitted_at",
    correct: "correct",
    base: "base",
    bonus: "bonus",
    score: "score",
    seconds: "seconds",
    annulled: "annulled",
  };
  for (const [key, v] of Object.entries(e)) if (map[key] && v !== undefined) r[map[key]] = v;
  return r;
};
const fromRow = (r: Row): Entry => ({
  week: r.week as string,
  round: r.round as RoundId,
  userId: r.user_id as string,
  name: r.name as string,
  avatar: r.avatar as string,
  ids: r.ids as string[],
  startedAt: Number(r.started_at),
  responses: (r.responses as Record<string, string>) ?? {},
  savedAt: r.saved_at == null ? undefined : Number(r.saved_at),
  submittedAt: r.submitted_at == null ? undefined : Number(r.submitted_at),
  correct: (r.correct as Record<Difficulty, number>) ?? undefined,
  base: r.base == null ? undefined : Number(r.base),
  bonus: r.bonus == null ? undefined : Number(r.bonus),
  score: r.score == null ? undefined : Number(r.score),
  seconds: r.seconds == null ? undefined : Number(r.seconds),
  annulled: r.annulled === true ? true : undefined,
});

async function sb(query: string, init: RequestInit = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/competition_entries${query}`, {
    ...init,
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new StoreUnavailable(`Supabase ${res.status}: ${await res.text()}`);
  // return=minimal answers 201/204 with an empty body.
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
const eq = (v: string) => `eq.${encodeURIComponent(v)}`;

const supabaseStore: Store = {
  async get(week, round, userId) {
    const rows = (await sb(`?week=${eq(week)}&round=${eq(round)}&user_id=${eq(userId)}&select=*`)) as Row[];
    return rows[0] ? fromRow(rows[0]) : null;
  },
  async create(e) {
    await sb("", { method: "POST", body: JSON.stringify(toRow(e)), headers: { Prefer: "resolution=ignore-duplicates,return=minimal" } });
    return (await this.get(e.week, e.round, e.userId))!;
  },
  async update(week, round, userId, patch) {
    await sb(`?week=${eq(week)}&round=${eq(round)}&user_id=${eq(userId)}`, {
      method: "PATCH",
      body: JSON.stringify(toRow(patch)),
      headers: { Prefer: "return=minimal" },
    });
  },
  async finished(week) {
    const rows = (await sb(`?week=${eq(week)}&submitted_at=not.is.null&select=*`)) as Row[];
    return rows.map(fromRow);
  },
  async move(week, round, from, to) {
    // The primary key (week, round, user_id) makes this fail if `to` already has an entry: nothing moves then.
    try {
      const rows = (await sb(`?week=${eq(week)}&round=${eq(round)}&user_id=${eq(from)}`, {
        method: "PATCH",
        body: JSON.stringify({ user_id: to }),
        headers: { Prefer: "return=representation" },
      })) as Row[];
      return rows.length > 0;
    } catch (e) {
      if (e instanceof StoreUnavailable && e.message.startsWith("Supabase 409")) return false;
      throw e;
    }
  },
};

export const store: Store = SB_URL && SB_KEY ? supabaseStore : fileStore;
export const storeKind = SB_URL && SB_KEY ? "supabase" : "file";
