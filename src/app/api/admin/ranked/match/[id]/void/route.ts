import type { NextRequest } from "next/server";
import { adminOnly } from "@/lib/admin";
import { adminEmail, adminRun, adminVoidMatch } from "@/lib/elo-admin-server";

// Admin only. POST (no body) → AdminVoidResult. Voids the match and reverts its rating change (elo_void_match); logged. Idempotent.
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  return adminRun(async () => adminVoidMatch(id, await adminEmail()));
}
