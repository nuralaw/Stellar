import { NO_STORE, currentUser } from "@/lib/admin";
import { getAccess } from "@/lib/access-server";
import { bugCode, openDiscount } from "@/lib/discounts-server";

// GET → { plan: "free" | "plus" | "admin", expiresAt: ISO string | null, discount: { percent, code } | null } for the visitor
// (UI only; pages gate on the server). discount = the signed-in visitor's open "first month" discount, only while GUMROAD_BUG_CODE is set.

/** Never throws: any problem (no table, no code, Supabase down) just means no discount. */
async function discountFor() {
  try {
    const code = bugCode();
    if (!code) return null;
    const user = await currentUser();
    if (!user) return null;
    const d = await openDiscount(user.id);
    return d ? { percent: d.percent, code } : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const [a, discount] = await Promise.all([getAccess(), discountFor()]);
  return Response.json({ plan: a.plan, expiresAt: a.expiresAt, discount }, { headers: NO_STORE });
}
