import { NO_STORE, adminOnly } from "@/lib/admin";
import { bugCode, openDiscountUserIds } from "@/lib/discounts-server";
import { rpc } from "../rpc";

// Admin only. GET ?q=<keywords> → { users: [... each with discountOpen], more, bugCode } from admin_account_search in supabase/account_stats.sql.
// Every space-separated word must appear in the email, name or id. At most 50 users; more = there were further matches.
// discountOpen = the account has an open "first month" discount (supabase/discounts.sql); false when that can't be read. bugCode = GUMROAD_BUG_CODE is set.

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHOWN = 50;

export async function GET(request: Request) {
  const denied = await adminOnly(request);
  if (denied) return denied;
  if (!SB_URL || !SB_KEY) return Response.json({ error: "Supabase isn't configured on this server." }, { status: 503, headers: NO_STORE });

  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2 || q.length > 100) {
    return Response.json({ error: "Type between 2 and 100 characters to search." }, { status: 400, headers: NO_STORE });
  }

  try {
    const found = await rpc("admin_account_search", { p_q: q, p_limit: SHOWN + 1 });
    const all: { id: string }[] = Array.isArray(found) ? found : [];
    const users = all.slice(0, SHOWN);
    let open = new Set<string>();
    try {
      open = await openDiscountUserIds(users.map((u) => u.id));
    } catch {} // the discounts table may not exist yet: the results still load
    return Response.json(
      { users: users.map((u) => ({ ...u, discountOpen: open.has(u.id) })), more: all.length > SHOWN, bugCode: bugCode() !== null },
      { headers: NO_STORE },
    );
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Couldn't load." }, { status: 503, headers: NO_STORE });
  }
}
