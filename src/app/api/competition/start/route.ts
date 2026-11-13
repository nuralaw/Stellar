import { currentUser, isAdmin } from "@/lib/admin";
import { checkAvatar, checkName, checkRound, checkUser, startRound } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { round, userId, name, avatar } → this week's questions for the caller (new, resumed, or finished + review).
// Signed in as admin: a finished or left round starts over instead (testing).
export function POST(request: Request) {
  return handle(request, async (b, now) =>
    startRound(checkRound(b.round), checkUser(b.userId), checkName(b.name), checkAvatar(b.avatar), now, isAdmin(await currentUser())),
  );
}
