import { checkAvatar, checkName } from "@/lib/competition-server";
import { ranked } from "@/lib/elo-server";
import { handle } from "../handle";

// POST { mode: "mixed", name, avatar } → PlayResponse: continues the player's match in progress, else joins the oldest suitable
// waiting match as B, else creates a new one as A. The name / avatar are the public identity for the boards (saved with the player).
export function POST(request: Request) {
  return handle(request, true, ({ userId, body, now }) => {
    const raw = typeof body.name === "string" ? body.name.trim() : "";
    const name = raw ? checkName(raw) : undefined;
    const avatar = body.avatar === undefined ? undefined : checkAvatar(body.avatar);
    return ranked.play(userId, { mode: body.mode, name, avatar }, now);
  });
}
