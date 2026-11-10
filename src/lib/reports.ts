import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getQuestionsByIds } from "./bank";
import { REPORT_REASONS, type ReportReason } from "./report-reasons";

// Problem reports on questions ("the answer key is wrong", typos…).
//  - Supabase (production): SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and supabase/reports.sql run once.
//  - Local file (development fallback): .data/reports.json. Doesn't work on Vercel (read-only file system).

export interface Report {
  qid: string;
  reason: ReportReason;
  note: string;
  /** Anonymous browser id (same as the competition id), if sent. */
  userId: string | null;
  at: number;
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
  const userId = typeof b.userId === "string" && /^[0-9a-f-]{36}$/i.test(b.userId) ? b.userId.toLowerCase() : null;
  return { qid, reason, note, userId, at: now };
}

const FILE = path.join(process.cwd(), ".data", "reports.json");
const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function saveReport(r: Report) {
  if (SB_URL && SB_KEY) {
    const res = await fetch(`${SB_URL}/rest/v1/question_reports`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ qid: r.qid, reason: r.reason, note: r.note, user_id: r.userId, created_at: new Date(r.at).toISOString() }),
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
