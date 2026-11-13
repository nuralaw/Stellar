import { checkAvatar, checkName, updatePlayer } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { userId, name, avatar } → updates the caller's name / avatar on this week's entries (leaderboards).
// Signed in: the account is the participant (userId is only used by guests).
export function POST(request: Request) {
  return handle(request, (b, now, who) => updatePlayer(who.userId, checkName(b.name), checkAvatar(b.avatar), now));
}
