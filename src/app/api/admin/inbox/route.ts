import { NO_STORE, adminOnly } from "@/lib/admin";
import { ReportError, listReports, updateReport } from "@/lib/reports";
import { SupportError, getSupport, listSupport, updateSupport } from "@/lib/support";
import { bugCode, discountsBySupportIds, grantDiscount, isAccount, revokeForSupport } from "@/lib/discounts-server";
import { PLUS } from "@/lib/plus-config";

// Admin only.
// GET → { support: SupportRequest[] (each with discount: "open" | "used" | "revoked" | null), reports: ReportItem[], bugCode: boolean,
//         errors: { support?, reports? } } (newest first)
// PATCH { kind: "support" | "report", id, resolved?, bugConfirmed? } → { ok: true, discount?: "granted" | "already" | "revoked" | "no-account" | "off" | "error", bugCode }
//   Confirming a bug gives the reporter's account a discount; un-confirming takes back an unused one. It runs after the toggle is saved.

const message = (e: unknown) => (e instanceof SupportError || e instanceof ReportError ? e.message : "Couldn't load from the database.");

export async function GET() {
  const denied = await adminOnly();
  if (denied) return denied;
  const [support, reports] = await Promise.allSettled([listSupport(), listReports()]);
  let list = support.status === "fulfilled" ? support.value : [];
  try {
    // One query for the discount state of the confirmed requests; a failure just leaves it null.
    const states = await discountsBySupportIds(list.filter((r) => r.bugConfirmed).map((r) => r.id));
    list = list.map((r) => ({ ...r, discount: states.get(r.id) ?? null }));
  } catch {
    list = list.map((r) => ({ ...r, discount: null }));
  }
  return Response.json(
    {
      support: list,
      bugCode: bugCode() !== null,
      reports: reports.status === "fulfilled" ? reports.value : [],
      errors: {
        support: support.status === "rejected" ? message(support.reason) : undefined,
        reports: reports.status === "rejected" ? message(reports.reason) : undefined,
      },
    },
    { headers: NO_STORE },
  );
}

/** The discount side of "Bug confirmed". The toggle is already saved, so a failure here only reports "error". */
async function applyDiscount(id: string, confirmed: boolean): Promise<"granted" | "already" | "revoked" | "no-account" | "off" | "error" | undefined> {
  try {
    if (!PLUS.bugDiscountPercent) return "off";
    if (!confirmed) {
      return (await revokeForSupport(id)) ? "revoked" : undefined; // nothing to take back (never granted, or already used)
    }
    const userId = (await getSupport(id))?.userId;
    // user_id is an account id only when the reporter was signed in; otherwise it's an anonymous browser id.
    if (!userId || !(await isAccount(userId))) return "no-account";
    return await grantDiscount(userId, { source: "bug", supportId: id });
  } catch (e) {
    console.error("[admin/inbox] discount:", e);
    return "error";
  }
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
    let discount: string | undefined;
    if (b.kind === "support") {
      const bugConfirmed = flag(b.bugConfirmed);
      await updateSupport(id, { resolved: flag(b.resolved), bugConfirmed });
      if (bugConfirmed !== undefined) discount = await applyDiscount(id, bugConfirmed);
    } else if (b.kind === "report" && typeof b.resolved === "boolean") await updateReport(id, { resolved: b.resolved });
    else return Response.json({ error: "Nothing to change" }, { status: 400, headers: NO_STORE });
    return Response.json({ ok: true, discount, bugCode: bugCode() !== null }, { headers: NO_STORE });
  } catch (e) {
    if (e instanceof SupportError || e instanceof ReportError) return Response.json({ error: e.message }, { status: e.status, headers: NO_STORE });
    throw e;
  }
}
