import type { NextRequest } from "next/server";
import { adminOnly } from "@/lib/admin";
import { adminMatchDetail, adminRun } from "@/lib/elo-admin-server";

// Admin only. GET → AdminMatchDetail (both players' answers with timings, flags, the match's admin log).
export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  return adminRun(() => adminMatchDetail(id));
}
