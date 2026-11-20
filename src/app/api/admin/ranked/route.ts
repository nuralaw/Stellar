import type { NextRequest } from "next/server";
import { adminOnly } from "@/lib/admin";
import { adminListMatches, adminRun, parseListFilter } from "@/lib/elo-admin-server";

// Admin only (device-signed). Ranked matches, newest first.
// GET ?status=&flagged=1&q=<user id or name>&from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&size=25 → AdminList
export async function GET(request: NextRequest) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  return adminRun(() => adminListMatches(parseListFilter(request.nextUrl.searchParams)));
}
