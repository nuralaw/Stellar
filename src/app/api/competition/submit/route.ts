import { checkRound, checkUser, submitRound } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { week, round, userId, responses } → grade the round; returns the score and the answer review.
export function POST(request: Request) {
  return handle(request, (b, now) => submitRound(String(b.week), checkRound(b.round), checkUser(b.userId), b.responses, now));
}
