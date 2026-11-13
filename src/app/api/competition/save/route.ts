import { checkRound, saveResponses } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { week, round, userId, responses } → autosave answers while the round runs.
// Signed in: the account is the participant (userId is only used by guests).
export function POST(request: Request) {
  return handle(request, (b, now, who) => saveResponses(String(b.week), checkRound(b.round), who.userId, b.responses, now));
}
