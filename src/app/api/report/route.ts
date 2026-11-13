import { after } from "next/server";
import { currentUser } from "@/lib/admin";
import { emailReport } from "@/lib/mail";
import { ReportError, parseReport, saveReport } from "@/lib/reports";

// POST { qid, reason, note?, telegram?, instagram?, userId? } → saves a problem report about a question (userId: the
// signed-in account when there is one, else the anonymous browser id from the body)
// and emails a copy to the admin (after the response; an email failure never affects saving).
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const report = parseReport(body, Date.now());
    // Signed in: the account id, not the anonymous browser id from the body.
    const user = await currentUser();
    if (user) report.userId = user.id.toLowerCase();
    await saveReport(report);
    const origin = new URL(request.url).origin;
    after(() => emailReport(report, origin));
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof ReportError) return Response.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
