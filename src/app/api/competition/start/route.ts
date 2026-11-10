import { checkAvatar, checkName, checkRound, checkUser, startRound } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { round, userId, name, avatar } → this week's questions for the caller (new, resumed, or finished + review).
export function POST(request: Request) {
  return handle(request, (b, now) =>
    startRound(checkRound(b.round), checkUser(b.userId), checkName(b.name), checkAvatar(b.avatar), now),
  );
}
