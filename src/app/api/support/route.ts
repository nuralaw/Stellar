import { currentUser } from "@/lib/admin";
import { accountLookup } from "@/lib/discounts-server";
import { SupportError, parseSupport, saveSupport } from "@/lib/support";

// POST multipart form { telegram?, instagram?, other?, message, screenshot? (image file), userId?, website (honeypot) }
// → saves a support request, sealed with the admin's public key (shown in /admin, nowhere else). At least one contact is required.
// 503 "Support isn't set up yet" while ADMIN_SEAL_PUBLIC_KEY is missing: nothing personal is ever stored in the clear.
// userId: the signed-in account when there is one, else the anonymous browser id from the form.
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form" }, { status: 400 });
  }
  const headers = { "Cache-Control": "no-store" };
  // Bots fill every field, people never see this one: pretend it worked.
  if (form.get("website")) return Response.json({ ok: true }, { headers });
  try {
    const { req, image } = await parseSupport(form, Date.now());
    // Signed in: the account id, not the anonymous browser id from the form.
    const user = await currentUser();
    if (user) req.userId = user.id.toLowerCase();
    else if (req.userId) {
      // Signed out: the form's id is untrusted, and a real account id here would let a visitor aim the bug discount at any account.
      // Fail closed: keep it only when Supabase Auth definitely says no such account (404).
      if ((await accountLookup(req.userId)) !== "none") req.userId = null;
    }
    await saveSupport(req, image);
    return Response.json({ ok: true }, { headers });
  } catch (e) {
    if (e instanceof SupportError) return Response.json({ error: e.message }, { status: e.status, headers });
    throw e;
  }
}
