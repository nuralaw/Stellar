import type { NextRequest } from "next/server";
import { NO_STORE, adminOnly } from "@/lib/admin";
import { readScreenshot } from "@/lib/support";

// GET /api/admin/screenshot/<file> → a support request's screenshot (admin only; the bucket is private).
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/admin/screenshot/[file]">) {
  const denied = await adminOnly();
  if (denied) return denied;
  const { file } = await ctx.params;
  const shot = await readScreenshot(file);
  if (!shot) return new Response("Not found", { status: 404, headers: NO_STORE });
  return new Response(shot.body, { headers: { "Content-Type": shot.type, "Cache-Control": "private, max-age=3600" } });
}
