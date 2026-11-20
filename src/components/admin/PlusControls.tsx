"use client";

import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-keys";
import { PLUS } from "@/lib/plus-config";

// Admin → Accounts: Stellar Plus status and hand-granted access per student. Data: /api/admin/subscriptions.

export type PlusSub = { userId: string; email: string | null; expiresAt: string | null; source: string; note: string | null; createdAt: string; updatedAt: string };

const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const isLive = (s: PlusSub) => s.expiresAt === null || Date.parse(s.expiresAt) > Date.now();
const isPast = (d: Date) => d.getTime() <= Date.now();

function localDay(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function call(method: "POST" | "DELETE", payload: object) {
  const res = await adminFetch("/api/admin/subscriptions", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
  const json = await res.json().catch(() => null);
  if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account first.");
  if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
}

/** All Plus rows. `reload` refetches; `error` is shown inline (including the "run subscriptions.sql" hint). */
export function usePlusSubs() {
  const [subs, setSubs] = useState<PlusSub[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [n, setN] = useState(0);
  const [doneN, setDoneN] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    adminFetch("/api/admin/subscriptions", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account first.");
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (live) {
          setSubs(json.subscriptions);
          setError(null);
        }
      })
      .catch((e: Error) => live && setError(e.message === "Failed to fetch" ? "Couldn't load Plus. Check your connection." : e.message))
      .finally(() => live && setDoneN(n));
    return () => {
      live = false;
    };
  }, [n]);

  return { subs, error, loading: doneN !== n, reload: () => setN((x) => x + 1) };
}

export function PlusBadge({ sub }: { sub: PlusSub | undefined }) {
  if (!sub) return <span className="w-fit rounded-full bg-surface-2 px-2.5 py-0.5 text-[13px] text-muted">No Plus</span>;
  if (!isLive(sub)) return <span className="w-fit rounded-full bg-danger-soft px-2.5 py-0.5 text-[13px] text-danger">Plus expired {day(sub.expiresAt!)}</span>;
  return (
    <span className="w-fit rounded-full bg-success-soft px-2.5 py-0.5 text-[13px] font-medium text-success">
      {sub.expiresAt ? `Plus until ${day(sub.expiresAt)}` : "Plus · no end"}
    </span>
  );
}

type Choice = "1" | "3" | "12" | "none" | "custom";
const CHOICES: { id: Choice; label: string }[] = [
  { id: "1", label: "1 month" },
  { id: "3", label: "3 months" },
  { id: "12", label: "12 months" },
  { id: "none", label: "No end date" },
  { id: "custom", label: "Custom date" },
];

const btn = "inline-flex min-h-10 items-center rounded-xl border border-line px-3.5 text-sm font-semibold hover:bg-surface-2 disabled:opacity-50";

/** Mirrors lib/membership-server.ts (that file is server-only). */
type Membership = { status: "active" | "cancelling" | "ended" | "unknown"; endsAt: string | null; lastChargeAt: string; sellerUrl: string };

/** Badge + Grant / Extend / Stop billing / Remove for one student, with an inline editor, billing panel and remove confirmation. */
export function PlusRow({ userId, sub, onChanged }: { userId: string; sub: PlusSub | undefined; onChanged: () => void }) {
  const [mode, setMode] = useState<"idle" | "edit" | "remove" | "billing">("idle");
  const [membership, setMembership] = useState<Membership | null>(null);
  const [checking, setChecking] = useState(false);
  const alive = useRef(true);
  const reqId = useRef(0);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const [choice, setChoice] = useState<Choice>("1");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const live = sub ? isLive(sub) : false;
  // Extending an active plan with an end date continues from that end; otherwise count from now.
  const base = live && sub?.expiresAt ? new Date(sub.expiresAt) : new Date();

  function endFor(): Date | null | undefined {
    if (choice === "none") return null;
    if (choice === "custom") {
      if (!date) return undefined;
      const d = new Date(`${date}T23:59:59`);
      return Number.isFinite(d.getTime()) ? d : undefined;
    }
    const d = new Date(base);
    d.setMonth(d.getMonth() + Number(choice));
    return d;
  }
  const end = endFor();
  const tooEarly = end instanceof Date && isPast(end);

  function open() {
    setError(null);
    setNote(sub?.note ?? "");
    setChoice("1");
    setDate("");
    setMode("edit");
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setMode("idle");
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? (e.message === "Failed to fetch" ? "Couldn't reach the server." : e.message) : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  /** Reads the student's Monthly membership from Gumroad (through the admin API). Stale answers are dropped. */
  async function checkBilling() {
    const id = ++reqId.current;
    setChecking(true);
    setMembership(null);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/subscriptions/membership?userId=${userId}`, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account first.");
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      if (!alive.current || id !== reqId.current) return;
      setMembership(json?.membership ?? null);
    } catch (e) {
      if (!alive.current || id !== reqId.current) return;
      setError(e instanceof Error ? (e.message === "Failed to fetch" ? "Couldn't reach the server." : e.message) : "Something went wrong.");
    } finally {
      if (alive.current && id === reqId.current) setChecking(false);
    }
  }

  function openBilling() {
    setMode("billing");
    void checkBilling();
  }

  function closeBilling() {
    reqId.current++; // drop an answer still on its way
    setChecking(false);
    setError(null);
    setMode("idle");
  }

  const save = () => run(() => call("POST", { userId, expiresAt: end ? end.toISOString() : null, note: note.trim() || null }));
  const remove = () => run(() => call("DELETE", { userId }));

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <PlusBadge sub={sub} />
        {sub?.note && mode === "idle" && (
          <span className="min-w-0 max-w-full truncate text-[13px] text-muted" title={sub.note}>
            {sub.note}
          </span>
        )}
        {mode === "idle" && (
          <span className="ml-auto flex flex-wrap gap-2">
            <button type="button" onClick={open} className={btn}>
              {!sub ? "Grant Plus" : live ? "Extend" : "Renew"}
            </button>
            {sub && (
              <button type="button" onClick={openBilling} className={btn}>
                Stop billing
              </button>
            )}
            {sub && (
              <button type="button" onClick={() => { setError(null); setMode("remove"); }} className={`${btn} text-danger`}>
                Remove
              </button>
            )}
          </span>
        )}
        {mode === "remove" && (
          <span className="ml-auto flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Remove Plus from this student?</span>
            <button type="button" onClick={remove} disabled={busy} className="inline-flex min-h-10 items-center rounded-xl bg-danger px-3.5 text-sm font-semibold text-white dark:text-primary-ink disabled:opacity-50">
              {busy ? "Removing…" : "Yes, remove"}
            </button>
            <button type="button" onClick={() => setMode("idle")} disabled={busy} className={btn}>
              Cancel
            </button>
          </span>
        )}
        {mode === "remove" && sub && (
          <p className="w-full text-[13px] text-danger">
            This only removes Plus on the site. If the student pays monthly, Gumroad keeps charging until the membership is cancelled: check Stop billing first.
          </p>
        )}
      </div>

      {mode === "billing" && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3 sm:p-4">
          {checking ? (
            <p className="text-sm text-muted">Checking Gumroad…</p>
          ) : error ? null : !membership ? (
            <p className="text-sm">No monthly Gumroad membership found for this student, so nothing renews.</p>
          ) : membership.status === "cancelling" ? (
            <p className="text-sm">
              Cancelled. No more charges.{membership.endsAt ? ` The paid period ends ${day(membership.endsAt)}.` : ""} Plus stays until its end date above.
            </p>
          ) : membership.status === "ended" ? (
            <p className="text-sm">Membership ended{membership.endsAt ? ` ${day(membership.endsAt)}` : ""}. Nothing renews.</p>
          ) : (
            <>
              <p className="text-sm">
                {membership.status === "active"
                  ? `Monthly membership is active. Last charge ${day(membership.lastChargeAt)}; Gumroad charges again about a month after that.`
                  : "Couldn't read the membership's status from Gumroad."}
              </p>
              <p className="mt-3 text-sm">Gumroad only lets the seller cancel from its own dashboard:</p>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
                <li>
                  <a
                    href={membership.sellerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-ink hover:bg-primary-hover"
                  >
                    Open in Gumroad
                  </a>
                </li>
                <li>Click “Cancel subscription” there. The student keeps Plus until the end of the paid month and is never charged again.</li>
                <li>Come back and press Check again.</li>
              </ol>
              <p className="mt-3 text-[13px] text-muted">If the link doesn&apos;t open the sale, find it in Gumroad → Sales by the student&apos;s email.</p>
            </>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => void checkBilling()} disabled={checking} className={btn}>
              Check again
            </button>
            <button type="button" onClick={closeBilling} className={btn}>
              Close
            </button>
          </div>
        </div>
      )}

      {mode === "edit" && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3 sm:p-4">
          <p className="text-sm font-semibold">{!sub ? "Grant Plus for" : live && sub.expiresAt ? `Extend from ${day(sub.expiresAt)} by` : "Plus for"}</p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Duration">
            {CHOICES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setChoice(c.id)}
                aria-pressed={choice === c.id}
                className={`min-h-10 rounded-xl border px-3.5 text-sm font-medium ${choice === c.id ? "border-primary bg-primary-soft text-ink" : "border-line bg-surface text-muted hover:text-ink"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {choice === "custom" && (
            <label className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-muted">Ends on</span>
              <input type="date" value={date} min={localDay(new Date())} onChange={(e) => setDate(e.target.value)} className="min-h-10 rounded-xl border border-line bg-bg px-3" />
            </label>
          )}
          <label className="mt-3 block text-sm">
            <span className="text-muted">Note (optional, for you)</span>
            <input
              type="text"
              value={note}
              maxLength={200}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Tester, reported the timer bug"
              className="mt-1 min-h-10 w-full rounded-xl border border-line bg-bg px-3"
            />
          </label>
          <p className="mt-3 text-sm text-muted">{end === undefined ? "Pick an end date." : end === null ? "Plus will have no end date." : `Plus will end on ${day(end.toISOString())}.`}</p>
          {tooEarly && <p className="mt-1 text-sm text-danger">That date has already passed.</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy || end === undefined || tooEarly}
              className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-ink hover:bg-primary-hover disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setMode("idle")} disabled={busy} className={btn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Hand-made "first month" discount for one student (/api/admin/discounts): a button to give it, or "Discount open · Remove". */
export function DiscountRow({ userId, open, bugCode }: { userId: string; open: boolean; bugCode: boolean }) {
  const [isOpen, setIsOpen] = useState(open);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(method: "POST" | "DELETE") {
    setBusy(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/discounts", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }), cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account first.");
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setIsOpen(method === "POST");
    } catch (e) {
      setError(e instanceof Error ? (e.message === "Failed to fetch" ? "Couldn't reach the server." : e.message) : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => run(isOpen ? "DELETE" : "POST")} disabled={busy} className={btn}>
        {busy ? "Saving…" : isOpen ? "Discount open · Remove" : `${PLUS.bugDiscountPercent ?? 50}% off 1st month`}
      </button>
      {isOpen && !bugCode && <span className="text-[13px] text-muted">Set GUMROAD_BUG_CODE to apply discounts</span>}
      {error && (
        <p role="alert" className="w-full rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
