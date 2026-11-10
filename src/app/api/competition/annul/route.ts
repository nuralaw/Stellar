import { annulRound, checkRound, checkUser } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { week, round, userId } → the student left full screen (or the page) mid-round: the attempt is annulled
// (score 0, off the leaderboards, no retry this week). Also sent with navigator.sendBeacon when the page closes.
export function POST(request: Request) {
  return handle(request, (b, now) => annulRound(String(b.week), checkRound(b.round), checkUser(b.userId), now));
}
