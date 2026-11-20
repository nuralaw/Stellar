import { ranked } from "@/lib/elo-server";
import { handle } from "../../handle";

// POST → { forfeit: true }: gives the match up (a loss whatever the points); the questions left are annulled.
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return handle(request, true, ({ userId, now }) => ranked.leave(userId, id, now));
}
