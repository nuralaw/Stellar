import { ranked } from "@/lib/elo-server";
import { handle } from "../../handle";

// POST /api/ranked/[id]/next → NextResponse: the next question (no id / answer / explanation) with the server's clock. Idempotent while
// a question is open and within its limit (+ grace): the same question comes back with its original issuedAt. Once its time is up it
// is closed as a timeout and the next one is issued. { done: true } once all 10 are played.
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return handle(request, true, ({ userId, now }) => ranked.next(userId, id, now));
}
