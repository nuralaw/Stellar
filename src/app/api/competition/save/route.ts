import { checkRound, checkUser, saveResponses } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { week, round, userId, responses } → autosave answers while the round runs.
export function POST(request: Request) {
  return handle(request, (b, now) => saveResponses(String(b.week), checkRound(b.round), checkUser(b.userId), b.responses, now));
}
