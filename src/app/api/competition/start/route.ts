import { checkName, checkRound, checkUser, startRound } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { round, userId, name, avatar } → this week's questions for the caller (new, resumed, or finished + review).
export function POST(request: Request) {
  return handle(request, (b, now) =>
    startRound(checkRound(b.round), checkUser(b.userId), checkName(b.name), typeof b.avatar === "string" ? b.avatar.slice(0, 8) : "", now),
  );
}
