import fs from "node:fs/promises";
import path from "node:path";
import { NO_STORE } from "@/lib/admin";
import { ranked } from "@/lib/elo-server";
import { errorResponse, rankedUser } from "../../handle";

// GET /api/ranked/[id]/img?idx=N&k=figure|choices|A|B|C|D → one image of a question this player has been issued in this match.
// The questions' bank paths (/bank/img/rw/eng_0006.webp) name the question, so the match JSON carries these URLs instead.
// Local guests (no Supabase) add &userId=<anonymous id>. Participant only; never cached.
const TYPES: Record<string, string> = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml" };

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const p = new URL(request.url).searchParams;
    const userId = await rankedUser(p.get("userId"));
    const idx = p.get("idx");
    const file = await ranked.image(userId, id, idx !== null && idx.trim() !== "" ? Number(idx) : null, p.get("k"));
    const type = TYPES[path.extname(file).toLowerCase()];
    if (!type) return Response.json({ error: "Image not found", code: "not_found" }, { status: 404, headers: NO_STORE });
    let bytes: Buffer;
    try {
      bytes = await fs.readFile(path.join(/* turbopackIgnore: true */ process.cwd(), "public", file));
    } catch {
      return Response.json({ error: "Image not found", code: "not_found" }, { status: 404, headers: NO_STORE });
    }
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": type, ...NO_STORE } });
  } catch (e) {
    return errorResponse(e);
  }
}
