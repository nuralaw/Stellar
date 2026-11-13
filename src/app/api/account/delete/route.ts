import { NO_STORE, currentUser, isAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";

// POST → deletes the signed-in student's account (Supabase Auth user; their user_data rows cascade)
// and signs out the cookie session. Admins are refused so nobody removes the admin login by accident.
export async function POST(request: Request) {
  // Only from our own pages (the session cookie is SameSite=Lax anyway; this is a second guard).
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Wrong origin." }, { status: 403, headers: NO_STORE });

  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401, headers: NO_STORE });
  if (isAdmin(user)) return Response.json({ error: "Admin accounts can't be deleted here." }, { status: 403, headers: NO_STORE });

  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return Response.json({ error: "Account deletion isn't set up on this server." }, { status: 503, headers: NO_STORE });

  const res = await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(user.id)}`, {
    method: "DELETE",
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok && res.status !== 404) {
    console.error("account delete failed", res.status, await res.text().catch(() => ""));
    return Response.json({ error: "Couldn't delete the account. Please try again." }, { status: 502, headers: NO_STORE });
  }

  // Clear the session cookies (the user no longer exists, so the server-side revoke may fail; local scope just drops them).
  const sb = await supabaseServer();
  await sb?.auth.signOut({ scope: "local" }).catch(() => {});

  return Response.json({ ok: true }, { headers: NO_STORE });
}
