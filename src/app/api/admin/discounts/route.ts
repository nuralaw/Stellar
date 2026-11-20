import { NO_STORE, adminOnly } from "@/lib/admin";
import { grantDiscount, isAccount, revokeOpen } from "@/lib/discounts-server";
import { PLUS } from "@/lib/plus-config";

// Admin only. A personal "first month of Monthly" discount, given or taken back by hand (/admin → Accounts).
// POST   { userId } → { result: "granted" | "already" }  (already = the account has an open one)
// DELETE { userId } → { revoked: boolean }                (false = it had none open)
// The Gumroad code that makes it apply is GUMROAD_BUG_CODE (see docs/PAYMENTS.md → Bug-report discounts).

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(e: unknown, fallback: string, status = 503) {
  return Response.json({ error: e instanceof Error ? e.message : fallback }, { status, headers: NO_STORE });
}

async function body(request: Request): Promise<Record<string, unknown> | null> {
  const json = await request.json().catch(() => null);
  return json && typeof json === "object" ? (json as Record<string, unknown>) : null;
}

const bad = (error: string) => Response.json({ error }, { status: 400, headers: NO_STORE });

export async function POST(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const b = await body(request);
  if (!b) return bad("Bad request.");
  if (typeof b.userId !== "string" || !UUID.test(b.userId)) return bad("Bad user id.");
  if (!PLUS.bugDiscountPercent) return bad("Discounts are turned off (bugDiscountPercent in plus-config.ts).");
  if (!(await isAccount(b.userId))) return bad("There's no such account.");
  try {
    const result = await grantDiscount(b.userId, { source: "admin" });
    return Response.json({ result }, { headers: NO_STORE });
  } catch (e) {
    return fail(e, "Couldn't save.");
  }
}

export async function DELETE(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const b = await body(request);
  if (!b) return bad("Bad request.");
  if (typeof b.userId !== "string" || !UUID.test(b.userId)) return bad("Bad user id.");
  try {
    const revoked = await revokeOpen(b.userId);
    return Response.json({ revoked }, { headers: NO_STORE });
  } catch (e) {
    return fail(e, "Couldn't remove.");
  }
}
