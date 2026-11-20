import { adminFetch, openJsonAny } from "@/lib/admin-keys";
import type { ReportItem } from "@/lib/reports";
import type { SupportRequest } from "@/lib/support";

// Loads /api/admin/inbox and decrypts the sealed rows in this browser (private key in IndexedDB, see lib/admin-keys.ts).
// Rows without `sealed` are old plaintext rows and pass through as they are. A sealed row this browser can't open keeps
// empty text fields and gets `locked` ("no-key": nothing restored here yet, "wrong-key": a different key), so the UI shows a placeholder.

export type Inbox = { support: SupportRequest[]; reports: ReportItem[]; bugCode?: boolean; errors: { support?: string; reports?: string } };

/** Shown instead of the text of a row that can't be decrypted (here, in Overview and in the reports list). */
export const LOCKED_TEXT: Record<"no-key" | "wrong-key", string> = {
  "no-key": "Encrypted. Restore your key in Admin → Security.",
  "wrong-key": "Encrypted for a different key than the one in this browser. See Admin → Security.",
};

const s = (v: unknown) => (typeof v === "string" ? v : "");

type Opened = { telegram?: unknown; instagram?: unknown; other?: unknown; message?: unknown; note?: unknown; shotMime?: unknown };

/** Opens one sealed value with this browser's current key, then its archived ones; or says why not. */
export const openSealed = (sealed: string) => openJsonAny<Opened>(sealed);

export async function openInbox(inbox: Inbox): Promise<Inbox> {
  const support = await Promise.all(
    inbox.support.map(async (r): Promise<SupportRequest> => {
      if (!r.sealed) return r;
      const o = await openSealed(r.sealed);
      if (!o.ok) return { ...r, locked: o.why };
      const d: Record<string, unknown> = o.data && typeof o.data === "object" ? o.data : {};
      return { ...r, telegram: s(d.telegram), instagram: s(d.instagram), other: s(d.other), message: s(d.message), shotMime: s(d.shotMime) || undefined };
    }),
  );
  const reports = await Promise.all(
    inbox.reports.map(async (r): Promise<ReportItem> => {
      if (!r.sealed) return r;
      const o = await openSealed(r.sealed);
      if (!o.ok) return { ...r, locked: o.why };
      const d: Record<string, unknown> = o.data && typeof o.data === "object" ? o.data : {};
      return { ...r, note: s(d.note), telegram: s(d.telegram), instagram: s(d.instagram) };
    }),
  );
  return { ...inbox, support, reports };
}

/** "denied" = signed out, not an admin, or this device isn't allowed (the panel re-reads /api/admin/me and shows why). */
export async function loadInbox(): Promise<Inbox | "denied" | "offline"> {
  try {
    const res = await adminFetch("/api/admin/inbox", { cache: "no-store" });
    if (res.status === 401 || res.status === 403) return "denied";
    return await openInbox(await res.json());
  } catch {
    return "offline";
  }
}
