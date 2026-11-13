import type { NextRequest } from "next/server";
import { currentUser, isAdmin } from "@/lib/admin";
import { boards, claimGuest } from "@/lib/competition-server";
import { StoreUnavailable } from "@/lib/competition-store";
import { weekEnd, weekId } from "@/lib/competition";
import { anonIdOf } from "./handle";

// GET /api/competition?week=YYYY-MM-DD&userId=…&anonId=… → leaderboards (overall / R&W / Math) + the caller's rounds.
// Signed in: the account is the caller (userId is ignored), and this week's rounds the browser played as a guest
// (anonId) move to the account if it has none for that round. Guests: userId is their anonymous browser id.
// Signed in as admin: finished rounds show as not started, so they can be taken again (see startRound).
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const now = Date.now();
  const current = weekId(now);
  const w = p.get("week");
  const week = w && /^\d{4}-\d{2}-\d{2}$/.test(w) && w <= current ? weekId(Date.parse(`${w}T12:00:00Z`)) : current;
  try {
    const user = await currentUser();
    const userId = user ? user.id.toLowerCase() : anonIdOf(p.get("userId"));
    let claimed = 0;
    if (user) {
      const anonId = anonIdOf(p.get("anonId"));
      if (anonId) claimed = (await claimGuest(anonId, user.id.toLowerCase(), now)).moved;
    }
    const admin = user !== null && week === current && isAdmin(user);
    const b = await boards(week, userId, now, 50, admin);
    return Response.json(
      { week, current, endsAt: weekEnd(week), now, signedIn: user !== null, ...(claimed ? { claimed } : {}), ...b },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    if (e instanceof StoreUnavailable) return Response.json({ error: "The leaderboard database isn't set up yet." }, { status: 503 });
    throw e;
  }
}
