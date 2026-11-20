import type { NextRequest } from "next/server";
import { NO_STORE, adminOnly } from "@/lib/admin";
import { readScreenshot } from "@/lib/support";

// GET /api/admin/screenshot/<file> → a support request's screenshot (admin only; the bucket is private).
// New files (*.enc) are sealed with the admin's public key: the bytes go out as stored and the admin's browser decrypts them.
export async function GET(request: NextRequest, ctx: RouteContext<"/api/admin/screenshot/[file]">) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const { file } = await ctx.params;
  const shot = await readScreenshot(file);
  if (!shot) return new Response("Not found", { status: 404, headers: NO_STORE });
  const headers = shot.sealed ? { "Content-Type": shot.type, ...NO_STORE } : { "Content-Type": shot.type, "Cache-Control": "private, max-age=3600" };
  return new Response(shot.body, { headers });
}
