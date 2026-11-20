import { ranked } from "@/lib/elo-server";
import { handle } from "./handle";

// GET /api/ranked → RankedHub (rating, level, active / waiting / recent matches, limits). Guests (no Supabase): ?userId=<anonymous id>.
export function GET(request: Request) {
  return handle(request, false, ({ userId, now }) => ranked.hub(userId, now));
}
