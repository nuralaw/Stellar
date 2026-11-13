import { after } from "next/server";
import { emailReport } from "@/lib/mail";
import { ReportError, parseReport, saveReport } from "@/lib/reports";

// POST { qid, reason, note?, telegram?, instagram?, userId? } → saves a problem report about a question
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
    await saveReport(report);
    const origin = new URL(request.url).origin;
    after(() => emailReport(report, origin));
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof ReportError) return Response.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
