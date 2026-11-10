import { ReportError, parseReport, saveReport } from "@/lib/reports";

// POST { qid, reason, note?, userId? } → saves a problem report about a question.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    await saveReport(parseReport(body, Date.now()));
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof ReportError) return Response.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
