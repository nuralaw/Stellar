import { currentUser } from "@/lib/admin";
import { ReportError, parseReport, saveReport } from "@/lib/reports";

// POST { qid, reason, note?, telegram?, instagram?, userId? } → saves a problem report about a question (userId: the
// signed-in account when there is one, else the anonymous browser id from the body). The note and contacts are sealed with the
// admin's public key; 503 while ADMIN_SEAL_PUBLIC_KEY is missing.
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
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof ReportError) return Response.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
