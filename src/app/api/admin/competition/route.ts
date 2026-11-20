import type { NextRequest } from "next/server";
import { NO_STORE, adminOnly } from "@/lib/admin";
import { weekId } from "@/lib/competition";
import { BadRequest, adminEntries, adminReset, adminSetAnnulled, checkRound, checkUser, storeMessage } from "@/lib/competition-server";

// Admin only.
// GET ?week=YYYY-MM-DD (default: this week) → { week, current, now, rw: AdminEntry[], math: AdminEntry[] }
// PATCH { week, round, userId, annulled } → { entry: AdminEntry } (annul / restore)
// DELETE { week, round, userId } → { deleted: true } (that player can take the round again)

const checkWeek = (w: unknown) => {
  if (typeof w !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(w) || Number.isNaN(Date.parse(`${w}T12:00:00Z`))) throw new BadRequest("Invalid week");
  return weekId(Date.parse(`${w}T12:00:00Z`));
};

async function run(work: () => Promise<unknown>) {
  try {
    return Response.json(await work(), { headers: NO_STORE });
  } catch (e) {
    if (e instanceof BadRequest) return Response.json({ error: e.message }, { status: 400, headers: NO_STORE });
    const msg = storeMessage(e);
    if (msg) return Response.json({ error: msg }, { status: 503, headers: NO_STORE });
    throw e;
  }
}

async function body(request: Request): Promise<Record<string, unknown>> {
  try {
    const b = await request.json();
    if (b && typeof b === "object") return b;
  } catch {}
  throw new BadRequest("Invalid JSON");
}

export async function GET(request: NextRequest) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  return run(async () => {
    const now = Date.now();
    const current = weekId(now);
    const w = request.nextUrl.searchParams.get("week");
    const week = w ? checkWeek(w) : current;
    return { week, current, now, ...(await adminEntries(week, now)) };
  });
}

export async function PATCH(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  return run(async () => {
    const b = await body(request);
    if (typeof b.annulled !== "boolean") throw new BadRequest("Nothing to change");
    return { entry: await adminSetAnnulled(checkWeek(b.week), checkRound(b.round), checkUser(b.userId), b.annulled, Date.now()) };
  });
}

export async function DELETE(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  return run(async () => {
    const b = await body(request);
    return adminReset(checkWeek(b.week), checkRound(b.round), checkUser(b.userId));
  });
}
