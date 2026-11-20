import type { NextRequest } from "next/server";
import { adminOnly } from "@/lib/admin";
import { adminLog, adminRun, parseLogLimit } from "@/lib/elo-admin-server";

// Admin only. GET ?limit=50 → { log: AdminLogRow[] } newest first.
export async function GET(request: NextRequest) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  return adminRun(async () => ({ log: await adminLog(parseLogLimit(request.nextUrl.searchParams)) }));
}
