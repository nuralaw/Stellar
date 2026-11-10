"use client";

import { useEffect, useRef, useState } from "react";
import { REPORT_REASONS, type ReportReason } from "@/lib/report-reasons";
import { getUserId } from "@/lib/store";
import { I, Icon } from "./icons";

const REASONS = Object.entries(REPORT_REASONS) as [ReportReason, string][];

/** "Report a problem" with this question: small popover with a reason and an optional note. */
export function ReportButton({ qid }: { qid: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  // Remember which questions were reported in this visit, so the button says "Reported".
  const [sentFor, setSentFor] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      e.stopPropagation(); // keep A–D / Enter from answering while typing a report
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const reset = () => {
    setReason(null);
    setNote("");
    setState("idle");
    setError(null);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || state === "sending") return;
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qid, reason, note, userId: getUserId() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setState("sent");
      setSentFor(qid);
    } catch (err) {
      setState("idle");
      setError((err as Error).message);
    }
  };

  const reported = sentFor === qid;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          if (!open && state === "sent") reset();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium transition-colors hover:bg-surface-2 hover:text-ink ${reported ? "text-success" : ""}`}
        title="Report a problem with this question"
      >
        <Icon d={reported ? I.check : I.flag} className="h-3.5 w-3.5" />
        {reported ? "Reported" : "Report"}
      </button>

      {open && (
        <div role="dialog" aria-label="Report a problem" className="absolute top-full right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-4 text-sm text-ink shadow-xl">
          {state === "sent" ? (
            <div className="py-2 text-center">
              <p className="font-semibold">Thanks — we&apos;ll check it.</p>
              <p className="mt-1 text-muted">Reports help fix the bank for everyone.</p>
              <button type="button" onClick={() => setOpen(false)} className="mt-3 rounded-xl border border-line px-4 py-2 font-semibold hover:bg-surface-2">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={send}>
              <p className="font-semibold">What&apos;s wrong with this question?</p>
              <div className="mt-3 space-y-1.5" role="radiogroup" aria-label="Problem">
                {REASONS.map(([id, label]) => (
                  <label key={id} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors ${reason === id ? "border-primary bg-primary-soft" : "border-line hover:bg-surface-2"}`}>
                    <input type="radio" name="reason" value={id} checked={reason === id} onChange={() => setReason(id)} className="accent-[var(--primary)]" />
                    {label}
                  </label>
                ))}
              </div>
              <label htmlFor="report-note" className="sr-only">
                Details
              </label>
              <textarea
                id="report-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder={reason === "other" ? "Tell us what's wrong (required)" : "Details (optional), e.g. the right answer is C because…"}
                className="mt-3 block w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {error && <p className="mt-2 text-danger">{error}</p>}
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 font-semibold text-muted hover:text-ink">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason || (reason === "other" && !note.trim()) || state === "sending"}
                  className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40"
                >
                  {state === "sending" ? "Sending…" : "Send report"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
