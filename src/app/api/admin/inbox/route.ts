import { NO_STORE, adminOnly } from "@/lib/admin";
import { ReportError, listReports, updateReport } from "@/lib/reports";
import { SupportError, listSupport, updateSupport } from "@/lib/support";

// Admin only.
// GET → { support: SupportRequest[], reports: ReportItem[], errors: { support?, reports? } } (newest first)
// PATCH { kind: "support" | "report", id, resolved?, bugConfirmed? } → { ok: true }

const message = (e: unknown) => (e instanceof SupportError || e instanceof ReportError ? e.message : "Couldn't load from the database.");

export async function GET() {
  const denied = await adminOnly();
  if (denied) return denied;
  const [support, reports] = await Promise.allSettled([listSupport(), listReports()]);
  return Response.json(
    {
      support: support.status === "fulfilled" ? support.value : [],
      reports: reports.status === "fulfilled" ? reports.value : [],
      errors: {
        support: support.status === "rejected" ? message(support.reason) : undefined,
        reports: reports.status === "rejected" ? message(reports.reason) : undefined,
      },
    },
    { headers: NO_STORE },
  );
}

export async function PATCH(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;
  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400, headers: NO_STORE });
  }
  const id = typeof b.id === "string" ? b.id : "";
  const flag = (v: unknown) => (typeof v === "boolean" ? v : undefined);
  try {
    if (b.kind === "support") await updateSupport(id, { resolved: flag(b.resolved), bugConfirmed: flag(b.bugConfirmed) });
    else if (b.kind === "report" && typeof b.resolved === "boolean") await updateReport(id, { resolved: b.resolved });
    else return Response.json({ error: "Nothing to change" }, { status: 400, headers: NO_STORE });
    return Response.json({ ok: true }, { headers: NO_STORE });
  } catch (e) {
    if (e instanceof SupportError || e instanceof ReportError) return Response.json({ error: e.message }, { status: e.status, headers: NO_STORE });
    throw e;
  }
}
