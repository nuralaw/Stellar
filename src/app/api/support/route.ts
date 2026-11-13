import { after } from "next/server";
import { emailSupportRequest } from "@/lib/mail";
import { SupportError, parseSupport, saveSupport } from "@/lib/support";

// POST multipart form { telegram?, instagram?, other?, message, screenshot? (image file), userId?, website (honeypot) }
// → saves a support request (shown in /admin) and emails a copy to the admin. At least one contact is required.
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
    await saveSupport(req, image);
    const origin = new URL(request.url).origin;
    after(() => emailSupportRequest(req, image, origin));
    return Response.json({ ok: true }, { headers });
  } catch (e) {
    if (e instanceof SupportError) return Response.json({ error: e.message }, { status: e.status, headers });
    throw e;
  }
}
