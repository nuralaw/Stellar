import { ranked } from "@/lib/elo-server";
import { handle } from "../../handle";

// POST { idx } → AnswerResponse with 0 points: the client calls it when the tab / full screen is left during a question (6.3).
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return handle(request, true, ({ userId, body, now }) => ranked.annul(userId, id, body.idx, now));
}
