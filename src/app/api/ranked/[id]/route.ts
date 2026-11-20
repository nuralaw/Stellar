import { ranked } from "@/lib/elo-server";
import { handle } from "../handle";

// GET /api/ranked/[id] → MatchState. The review (answers, explanations) only after the caller's own part is done; the opponent's
// points only once the match is finished. Only the two players of a match can open it (anyone else gets 404).
export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return handle(request, false, ({ userId, now }) => ranked.state(userId, id, now));
}
