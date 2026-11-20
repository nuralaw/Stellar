import "server-only";
import fs from "node:fs";
import path from "node:path";
import { sealBytesServer, sealConfigured, sealJsonServer } from "./seal-server";

// Support requests from the Home page's Support button: contacts, a screenshot, and what went wrong.
//  - Supabase (production): SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and supabase/support.sql (+ sealed.sql) run once.
//    The screenshot goes to the private storage bucket "support-screenshots", the row keeps its file name.
//  - Local files (development fallback): .data/support.json + .data/support/<file>. Doesn't work on Vercel.
// Personal data is never stored in the clear: contacts + message go into `sealed` (encrypted with the admin's public key,
// see seal-server.ts) and the screenshot is stored as an encrypted blob (*.enc). Without ADMIN_SEAL_PUBLIC_KEY requests are refused.

export interface SupportRequest {
  id: string;
  telegram: string;
  instagram: string;
  other: string;
  message: string;
  /** File name of the screenshot (in .data/support/ or the storage bucket), if one was attached. New ones end in .enc (sealed). */
  screenshot: string | null;
  /** Sealed {telegram, instagram, other, message, shotMime?}; the plain fields above are '' when this is set. The admin's browser opens it. */
  sealed?: string | null;
  /** Browser-only (set after decrypting in the admin panel): why a sealed request couldn't be opened here. */
  locked?: "no-key" | "wrong-key";
  /** Browser-only: the screenshot's real type, from the sealed data. */
  shotMime?: string;
  /** Anonymous browser id (same as the competition id), if sent. */
  userId: string | null;
  at: number;
  /** Admin marks (Support list): a real bug (→ 50% off a subscription), and handled. */
  bugConfirmed?: boolean;
  resolved?: boolean;
  /** Admin list only: the personal discount this request earned (supabase/discounts.sql). null = none recorded. */
  discount?: "open" | "used" | "revoked" | null;
}

export class SupportError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export const MAX_SCREENSHOT = 4 * 1024 * 1024;

/** The image type from the file's first bytes (the browser's claimed type isn't trusted). */
function imageType(b: Uint8Array): "jpg" | "png" | "webp" | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP") return "webp";
  return null;
}

const text = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function parseSupport(form: FormData, now: number): Promise<{ req: SupportRequest; image: { bytes: Uint8Array<ArrayBuffer>; ext: string } | null }> {
  const telegram = text(form.get("telegram"), 100);
  const instagram = text(form.get("instagram"), 100);
  const other = text(form.get("other"), 200);
  const message = text(form.get("message"), 3000);
  if (!telegram && !instagram && !other) throw new SupportError("Leave at least one contact so we can reply.");
  if (message.length < 10) throw new SupportError("Describe the problem in a few words.");

  let image: { bytes: Uint8Array<ArrayBuffer>; ext: string } | null = null;
  const file = form.get("screenshot");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_SCREENSHOT) throw new SupportError("The screenshot is too big (max 4 MB).");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = imageType(bytes);
    if (!ext) throw new SupportError("The screenshot has to be a JPG, PNG or WebP image.");
    image = { bytes, ext };
  }

  const raw = form.get("userId");
  const userId = typeof raw === "string" && /^[0-9a-f-]{36}$/i.test(raw) ? raw.toLowerCase() : null;
  const id = `${new Date(now).toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}`;
  return { req: { id, telegram, instagram, other, message, screenshot: image ? `${id}.enc` : null, userId, at: now }, image };
}

const DIR = path.join(process.cwd(), ".data");
const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as Record<string, string>;

export async function saveSupport(plain: SupportRequest, image: { bytes: Uint8Array<ArrayBuffer>; ext: string } | null) {
  if (!sealConfigured()) throw new SupportError("Support isn't set up yet.", 503);
  let sealed: string;
  let shot: Uint8Array<ArrayBuffer> | null = null;
  try {
    const { telegram, instagram, other, message } = plain;
    sealed = await sealJsonServer({ telegram, instagram, other, message, shotMime: image ? MIME[image.ext] : undefined });
    if (image) shot = await sealBytesServer(image.bytes);
  } catch (e) {
    console.error("[support] couldn't seal the request:", e instanceof Error ? e.message : e);
    throw new SupportError("Support isn't set up yet.", 503);
  }
  const req: SupportRequest = { ...plain, telegram: "", instagram: "", other: "", message: "", sealed };
  if (SB_URL && SB_KEY) {
    const auth = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };
    if (shot && req.screenshot) {
      const up = await fetch(`${SB_URL}/storage/v1/object/support-screenshots/${req.screenshot}`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/octet-stream" },
        body: shot,
        cache: "no-store",
      });
      if (!up.ok) throw new SupportError("Couldn't upload the screenshot. Try again later.", 503);
    }
    const res = await fetch(`${SB_URL}/rest/v1/support_requests`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        id: req.id,
        telegram: req.telegram,
        instagram: req.instagram,
        other: req.other,
        message: req.message,
        sealed: req.sealed,
        screenshot: req.screenshot,
        user_id: req.userId,
        created_at: new Date(req.at).toISOString(),
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new SupportError("Couldn't send your message. Try again later.", 503);
    return;
  }
  try {
    const file = path.join(DIR, "support.json");
    let all: SupportRequest[] = [];
    try {
      all = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {}
    if (shot && req.screenshot) {
      fs.mkdirSync(path.join(DIR, "support"), { recursive: true });
      fs.writeFileSync(path.join(DIR, "support", req.screenshot), shot);
    }
    all.push(req);
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(all, null, 1));
  } catch {
    throw new SupportError("Support isn't set up on this server yet.", 503);
  }
}

// ── Admin (Support list) ──

function readFile(): SupportRequest[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, "support.json"), "utf8"));
  } catch {
    return [];
  }
}

/** Throws with a hint when the Supabase table is missing. */
async function sbCheck(res: Response, what: string) {
  if (res.ok) return;
  const body = await res.text();
  if (res.status === 404 && body.includes("PGRST205")) throw new SupportError(`The ${what} table doesn't exist yet: run supabase/setup.sql in the Supabase SQL Editor.`, 503);
  throw new SupportError(`Supabase ${res.status}: ${body.slice(0, 200)}`, 503);
}

/** Newest first. */
export async function listSupport(): Promise<SupportRequest[]> {
  if (SB_URL && SB_KEY) {
    const res = await fetch(`${SB_URL}/rest/v1/support_requests?select=*&order=created_at.desc&limit=500`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      cache: "no-store",
    });
    await sbCheck(res, "support_requests");
    const rows: Record<string, unknown>[] = await res.json();
    return rows.map((r) => ({
      id: String(r.id),
      telegram: String(r.telegram ?? ""),
      instagram: String(r.instagram ?? ""),
      other: String(r.other ?? ""),
      message: String(r.message ?? ""),
      screenshot: typeof r.screenshot === "string" ? r.screenshot : null,
      sealed: typeof r.sealed === "string" ? r.sealed : null,
      userId: typeof r.user_id === "string" ? r.user_id : null,
      at: Date.parse(String(r.created_at)),
      bugConfirmed: r.bug_confirmed === true,
      resolved: r.resolved === true,
    }));
  }
  return readFile().reverse();
}

/** One request's id and user id (the account id only when the reporter was signed in), or null when it doesn't exist. */
export async function getSupport(id: string): Promise<{ id: string; userId: string | null } | null> {
  if (SB_URL && SB_KEY) {
    const res = await fetch(`${SB_URL}/rest/v1/support_requests?id=eq.${encodeURIComponent(id)}&select=id,user_id&limit=1`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      cache: "no-store",
    });
    await sbCheck(res, "support_requests");
    const rows: { id: string; user_id: string | null }[] = await res.json();
    return rows[0] ? { id: rows[0].id, userId: typeof rows[0].user_id === "string" ? rows[0].user_id : null } : null;
  }
  const r = readFile().find((x) => x.id === id);
  return r ? { id: r.id, userId: r.userId } : null;
}

export async function updateSupport(id: string, patch: { resolved?: boolean; bugConfirmed?: boolean }) {
  if (SB_URL && SB_KEY) {
    const body: Record<string, boolean> = {};
    if (patch.resolved !== undefined) body.resolved = patch.resolved;
    if (patch.bugConfirmed !== undefined) body.bug_confirmed = patch.bugConfirmed;
    const res = await fetch(`${SB_URL}/rest/v1/support_requests?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    await sbCheck(res, "support_requests");
    return;
  }
  const all = readFile();
  const item = all.find((r) => r.id === id);
  if (!item) throw new SupportError("Unknown request", 404);
  Object.assign(item, patch);
  fs.writeFileSync(path.join(DIR, "support.json"), JSON.stringify(all, null, 1));
}

/** A screenshot's bytes, by the file name saved with the request. `sealed` = a *.enc file: encrypted, returned as stored. */
export async function readScreenshot(file: string): Promise<{ body: BodyInit; type: string; sealed: boolean } | null> {
  const ext = /^[\w-]+\.(jpg|png|webp|enc)$/.exec(file)?.[1];
  if (!ext) return null;
  const sealed = ext === "enc";
  const type = sealed ? "application/octet-stream" : MIME[ext];
  if (SB_URL && SB_KEY) {
    const res = await fetch(`${SB_URL}/storage/v1/object/support-screenshots/${file}`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      cache: "no-store",
    });
    return res.ok ? { body: await res.arrayBuffer(), type, sealed } : null;
  }
  try {
    return { body: new Uint8Array(fs.readFileSync(path.join(DIR, "support", file))), type, sealed };
  } catch {
    return null;
  }
}
