import { checkAvatar, checkName, checkUser, updatePlayer } from "@/lib/competition-server";
import { handle } from "../handle";

// POST { userId, name, avatar } → updates the caller's name / avatar on this week's entries (leaderboards).
export function POST(request: Request) {
  return handle(request, (b, now) => updatePlayer(checkUser(b.userId), checkName(b.name), checkAvatar(b.avatar), now));
}
