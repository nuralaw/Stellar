import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getQuestionsByIds } from "./bank";
import { REPORT_REASONS, type ReportReason } from "./report-reasons";
import { sealConfigured, sealJsonServer } from "./seal-server";

// Problem reports on questions ("the answer key is wrong", typos…).
//  - Supabase (production): SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and supabase/reports.sql (+ sealed.sql) run once.
//  - Local file (development fallback): .data/reports.json. Doesn't work on Vercel (read-only file system).
// The note and contacts are personal: they're stored sealed with the admin's public key (seal-server.ts), the plain fields stay ''.
// qid and reason aren't personal and stay readable. Without ADMIN_SEAL_PUBLIC_KEY reports are refused.

export interface Report {
  qid: string;
  reason: ReportReason;
  note: string;
  /** Optional usernames, so we can reply. */
  telegram: string;
  instagram: string;
  /** Anonymous browser id (same as the competition id), if sent. */
  userId: string | null;
  at: number;
  /** Sealed {note, telegram, instagram}; the plain fields above are '' when this is set. The admin's browser opens it. */
  sealed?: string | null;
  /** Browser-only (set after decrypting in the admin panel): why a sealed report couldn't be opened here. */
  locked?: "no-key" | "wrong-key";
}

export class ReportError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function parseReport(b: Record<string, unknown>, now: number): Report {
  const qid = typeof b.qid === "string" ? b.qid : "";
  if (!/^[a-z]+-\d{1,6}$/i.test(qid) || !getQuestionsByIds([qid]).length) throw new ReportError("Unknown question");
  const reason = b.reason as ReportReason;
  if (!(reason in REPORT_REASONS)) throw new ReportError("Pick what's wrong");
  const note = typeof b.note === "string" ? b.note.trim().slice(0, 1000) : "";
  if (reason === "other" && !note) throw new ReportError("Tell us what's wrong");
  const contact = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 100) : "");
  const userId = typeof b.userId === "string" && /^[0-9a-f-]{36}$/i.test(b.userId) ? b.userId.toLowerCase() : null;
  return { qid, reason, note, telegram: contact(b.telegram), instagram: contact(b.instagram), userId, at: now };
}

const FILE = path.join(process.cwd(), ".data", "reports.json");
const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function saveReport(plain: Report) {
  if (!sealConfigured()) throw new ReportError("Reports aren't set up yet.", 503);
  let sealed: string;
  try {
    sealed = await sealJsonServer({ note: plain.note, telegram: plain.telegram, instagram: plain.instagram });
  } catch (e) {
    console.error("[reports] couldn't seal the report:", e instanceof Error ? e.message : e);
    throw new ReportError("Reports aren't set up yet.", 503);
  }
  const r: Report = { ...plain, note: "", telegram: "", instagram: "", sealed };
  if (SB_URL && SB_KEY) {
    const res = await fetch(`${SB_URL}/rest/v1/question_reports`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ qid: r.qid, reason: r.reason, note: r.note, telegram: r.telegram, instagram: r.instagram, sealed: r.sealed, user_id: r.userId, created_at: new Date(r.at).toISOString() }),
      cache: "no-store",
    });
    if (!res.ok) throw new ReportError("Couldn't save the report. Try again later.", 503);
    return;
  }
  try {
    let all: Report[] = [];
    try {
      all = JSON.parse(fs.readFileSync(FILE, "utf8"));
    } catch {}
    all.push(r);
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(all, null, 1));
  } catch {
    throw new ReportError("Reports aren't set up on this server yet.", 503);
  }
}

// ── Admin (Support list) ──

export interface ReportItem extends Report {
  /** Supabase row id, or the index in .data/reports.json. */
  id: string;
  resolved: boolean;
  question: { n: number; section: string; skill: string; text: string; answer: string } | null;
}

function readFile(): (Report & { resolved?: boolean })[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function sbCheck(res: Response) {
  if (res.ok) return;
  const body = await res.text();
  if (res.status === 404 && body.includes("PGRST205")) throw new ReportError("The question_reports table doesn't exist yet: run supabase/setup.sql in the Supabase SQL Editor.", 503);
  throw new ReportError(`Supabase ${res.status}: ${body.slice(0, 200)}`, 503);
}

/** Newest first, with a short summary of each reported question. */
export async function listReports(): Promise<ReportItem[]> {
  let items: Omit<ReportItem, "question">[];
  if (SB_URL && SB_KEY) {
    const res = await fetch(`${SB_URL}/rest/v1/question_reports?select=*&order=created_at.desc&limit=500`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      cache: "no-store",
    });
    await sbCheck(res);
    const rows: Record<string, unknown>[] = await res.json();
    items = rows.map((r) => ({
      id: String(r.id),
      qid: String(r.qid),
      reason: r.reason as ReportReason,
      note: String(r.note ?? ""),
      telegram: String(r.telegram ?? ""),
      instagram: String(r.instagram ?? ""),
      sealed: typeof r.sealed === "string" ? r.sealed : null,
      userId: typeof r.user_id === "string" ? r.user_id : null,
      at: Date.parse(String(r.created_at)),
      resolved: r.resolved === true,
    }));
  } else {
    items = readFile()
      .map((r, i) => ({ ...r, id: String(i), resolved: r.resolved === true }))
      .reverse();
  }
  const byId = new Map(getQuestionsByIds([...new Set(items.map((r) => r.qid))]).map((q) => [q.id, q]));
  return items.map((r) => {
    const q = byId.get(r.qid);
    return {
      ...r,
      question: q
        ? {
            n: Number(q.id.split("-")[1]),
            section: q.section,
            skill: q.skill,
            text: q.prompt.replace(/<[^>]+>/g, "").slice(0, 220),
            answer: q.type === "mcq" ? q.answer : q.answer.join(" or "),
          }
        : null,
    };
  });
}

export async function updateReport(id: string, patch: { resolved: boolean }) {
  if (SB_URL && SB_KEY) {
    if (!/^\d+$/.test(id)) throw new ReportError("Unknown report", 404);
    const res = await fetch(`${SB_URL}/rest/v1/question_reports?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ resolved: patch.resolved }),
      cache: "no-store",
    });
    await sbCheck(res);
    return;
  }
  const all = readFile();
  const item = all[Number(id)];
  if (!item) throw new ReportError("Unknown report", 404);
  item.resolved = patch.resolved;
  fs.writeFileSync(FILE, JSON.stringify(all, null, 1));
}
