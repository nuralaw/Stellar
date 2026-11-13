import { isAdmin } from "@/lib/admin";
import { checkAvatar, checkName, checkRound, claimGuest, startRound } from "@/lib/competition-server";
import { anonIdOf, handle } from "../handle";

// POST { round, userId, anonId?, name, avatar } → this week's questions for the caller (new, resumed, or finished + review).
// Signed in: the account is the participant; a round this browser played as a guest (anonId) moves to the account first.
// Signed in as admin: a finished or left round starts over instead (testing).
export function POST(request: Request) {
  return handle(request, async (b, now, who) => {
    const round = checkRound(b.round);
    const name = checkName(b.name);
    const anonId = anonIdOf(b.anonId);
    if (who.user && anonId) await claimGuest(anonId, who.userId, now);
    return startRound(round, who.userId, name, checkAvatar(b.avatar), now, isAdmin(who.user));
  });
}
