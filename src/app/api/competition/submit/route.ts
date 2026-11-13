import { checkRound, submitRound } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { week, round, userId, responses } → grade the round; returns the score and the answer review.
// Signed in: the account is the participant (userId is only used by guests).
export function POST(request: Request) {
  return handle(request, (b, now, who) => submitRound(String(b.week), checkRound(b.round), who.userId, b.responses, now));
}
