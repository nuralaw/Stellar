import { NO_STORE, adminOnly } from "@/lib/admin";
import { membershipFor } from "@/lib/membership-server";

// Admin only. GET ?userId=<uuid> → { membership: Membership | null }: the student's Monthly Gumroad membership and its billing state
// (read from Gumroad's API; cancelling itself is done on Gumroad's pages, see docs/PAYMENTS.md).

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId || !UUID.test(userId)) return Response.json({ error: "Bad user id." }, { status: 400, headers: NO_STORE });
  try {
    return Response.json({ membership: await membershipFor(userId) }, { headers: NO_STORE });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Couldn't load." }, { status: 503, headers: NO_STORE });
  }
}
