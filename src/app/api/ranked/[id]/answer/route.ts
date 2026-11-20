import { ranked } from "@/lib/elo-server";
import { handle } from "../../handle";

// POST { idx, response } → AnswerResponse. Graded and timed on the server; a second answer to a question is 409.
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return handle(request, true, ({ userId, body, now }) => ranked.answer(userId, id, body.idx, body.response, now));
}
