import { checkAvatar, checkName } from "@/lib/competition-server";
import { ranked } from "@/lib/elo-server";
import { handle } from "../handle";

// The matchmaking queue (docs/ELO-live.md 2, 5.2). Every method answers a QueueState; guests (no Supabase): ?userId=<anonymous id>.
// POST { mode: "mixed", name, avatar }: joins (or refreshes) the search; the name / avatar are the public identity for the boards.
export function POST(request: Request) {
  return handle(request, true, ({ userId, body, now }) => {
    const raw = typeof body.name === "string" ? body.name.trim() : "";
    const name = raw ? checkName(raw) : undefined;
    const avatar = body.avatar === undefined ? undefined : checkAvatar(body.avatar);
    return ranked.queueJoin(userId, { mode: body.mode, name, avatar }, now);
  });
}

// GET: the poll and the sign of life (every ~2 s while the search screen is open; 15 s of silence drops the player from the queue).
export function GET(request: Request) {
  return handle(request, false, ({ userId, now }) => ranked.queuePoll(userId, now));
}

// DELETE: leaves the queue (the page sends it with keepalive when it goes away). Once a pair is made it answers "matched".
export function DELETE(request: Request) {
  return handle(request, false, ({ userId, now }) => ranked.queueCancel(userId, now));
}
