import "server-only";
import { currentUser, isAdmin } from "./admin";
import { accessFor, type Access } from "./access";

/** Server-side access for the signed-in visitor (checked with Supabase Auth). Admin gets every feature. */
export async function getAccess(): Promise<Access> {
  const user = await currentUser();
  // Subscription not built yet: signed-in non-admins are "free" too. Later: look up their plan here.
  return accessFor(isAdmin(user) ? "admin" : "free");
}
