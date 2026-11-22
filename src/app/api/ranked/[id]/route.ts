import { ranked } from "@/lib/elo-server";
import { handle } from "../handle";

// GET /api/ranked/[id] → MatchState. The review (answers, explanations) only once the match is no longer playing; the opponent's
// points and forfeit only once it is finished. Only the two players of a match can open it (anyone else gets 404).
export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return handle(request, false, ({ userId, now }) => ranked.state(userId, id, now));
}
