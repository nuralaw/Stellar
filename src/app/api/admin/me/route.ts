import { NO_STORE, currentUser, isAdmin } from "@/lib/admin";
import { authConfigured } from "@/lib/supabase/server";

// GET → who is signed in, and whether they may open the Support list.
export async function GET() {
  const user = await currentUser();
  return Response.json({ configured: authConfigured, signedIn: Boolean(user), admin: isAdmin(user), email: user?.email ?? null }, { headers: NO_STORE });
}
