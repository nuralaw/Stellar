import type { NextRequest } from "next/server";
import { adminOnly } from "@/lib/admin";
import { adminEmail, adminResetPlayer, adminRun } from "@/lib/elo-admin-server";

// Admin only. POST (no body) → AdminResetResult. Sets the player's rating (and peak) back to 1000, keeps match counters; logged.
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  return adminRun(async () => adminResetPlayer(id, await adminEmail()));
}
