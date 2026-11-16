"use client";

import { useEffect, useState } from "react";

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
  const res = await fetch("/api/admin/subscriptions", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
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
    fetch("/api/admin/subscriptions", { cache: "no-store" })
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

/** Badge + Grant / Extend / Remove for one student, with an inline editor and an inline remove confirmation. */
export function PlusRow({ userId, sub, onChanged }: { userId: string; sub: PlusSub | undefined; onChanged: () => void }) {
  const [mode, setMode] = useState<"idle" | "edit" | "remove">("idle");
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
              <button type="button" onClick={() => { setError(null); setMode("remove"); }} className={`${btn} text-danger`}>
                Remove
              </button>
            )}
          </span>
        )}
        {mode === "remove" && (
          <span className="ml-auto flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Remove Plus from this student?</span>
            <button type="button" onClick={remove} disabled={busy} className="inline-flex min-h-10 items-center rounded-xl bg-danger px-3.5 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? "Removing…" : "Yes, remove"}
            </button>
            <button type="button" onClick={() => setMode("idle")} disabled={busy} className={btn}>
              Cancel
            </button>
          </span>
        )}
      </div>

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
