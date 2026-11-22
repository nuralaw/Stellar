import { ranked } from "@/lib/elo-server";
import { handle } from "./handle";

// GET /api/ranked → RankedHub (rating, level, the active match, recent matches, the queue state, limits). Guests (no Supabase): ?userId=<anonymous id>.
export function GET(request: Request) {
  return handle(request, false, ({ userId, now }) => ranked.hub(userId, now));
}
