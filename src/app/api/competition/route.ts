import type { NextRequest } from "next/server";
import { currentUser, isAdmin } from "@/lib/admin";
import { boards } from "@/lib/competition-server";
import { StoreUnavailable } from "@/lib/competition-store";
import { weekEnd, weekId } from "@/lib/competition";

// GET /api/competition?week=YYYY-MM-DD&userId=… → leaderboards (overall / R&W / Math) + the caller's rounds.
// Signed in as admin: finished rounds show as not started, so they can be taken again (see startRound).
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const now = Date.now();
  const current = weekId(now);
  const w = p.get("week");
  const week = w && /^\d{4}-\d{2}-\d{2}$/.test(w) && w <= current ? weekId(Date.parse(`${w}T12:00:00Z`)) : current;
  const uid = p.get("userId");
  const userId = uid && /^[0-9a-f-]{36}$/i.test(uid) ? uid.toLowerCase() : null;
  try {
    const admin = userId !== null && week === current && isAdmin(await currentUser());
    const b = await boards(week, userId, now, 50, admin);
    return Response.json({ week, current, endsAt: weekEnd(week), now, ...b }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof StoreUnavailable) return Response.json({ error: "The leaderboard database isn't set up yet." }, { status: 503 });
    throw e;
  }
}
