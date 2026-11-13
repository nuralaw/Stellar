import "server-only";
import type { User } from "@supabase/supabase-js";
import { supabaseServer } from "./supabase/server";

// Who may open the admin pages: Supabase users whose confirmed email is listed in ADMIN_EMAIL (comma-separated).
// Email + password or Google both work, as long as it's the same address.

const ADMINS = (process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const NO_STORE = { "Cache-Control": "no-store" };

export function isAdmin(user: User | null): boolean {
  const email = user?.email?.toLowerCase();
  return Boolean(email && user?.email_confirmed_at && ADMINS.includes(email));
}

/** The signed-in visitor, checked with Supabase Auth (a cookie alone isn't trusted). */
export async function currentUser(): Promise<User | null> {
  const sb = await supabaseServer();
  if (!sb) return null;
  const { data, error } = await sb.auth.getUser();
  return error ? null : data.user;
}

/** null when the visitor is an admin, otherwise the response to send back. */
export async function adminOnly(): Promise<Response | null> {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401, headers: NO_STORE });
  if (!isAdmin(user)) return Response.json({ error: "This account isn't an admin." }, { status: 403, headers: NO_STORE });
  return null;
}
