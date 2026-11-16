import { NO_STORE } from "@/lib/admin";
import { getAccess } from "@/lib/access-server";

// GET → { plan: "free" | "plus" | "admin", expiresAt: ISO string | null } for the visitor (UI only; pages gate on the server).
export async function GET() {
  const a = await getAccess();
  return Response.json({ plan: a.plan, expiresAt: a.expiresAt }, { headers: NO_STORE });
}
