"use client";

import Link from "next/link";
import { useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { CONTACT_ICONS } from "@/lib/contacts";
import { REPORT_REASONS } from "@/lib/report-reasons";
import type { ReportItem } from "@/lib/reports";
import { Notice, REASON_SHORT, groupByQuestion, practiceHref, questionTitle, useAdminInbox } from "./OverviewTab";

// Open question reports, one card per question, with "Resolve all".
//
//   <ReportsByQuestion />    self-fetching: loads /api/admin/inbox, PATCHes each report itself (optimistic, reverts on failure)
//   <ReportsByQuestion reports={reports} onChange={(id, patch) => update("report", id, patch)} />
//                            controlled: uses the Support list's data; onChange does the optimistic update + PATCH
//                            (AdminPanel's update() already does both). Pass all reports; resolved ones are filtered out here.

type Change = (id: string, patch: { resolved: boolean }) => unknown;

const handle = (v: string) => v.trim().replace(/^https?:\/\/(www\.)?(t\.me|instagram\.com)\//i, "").replace(/^@/, "").replace(/\/$/, "");
const when = (at: number) => new Date(at).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function ReportsByQuestion({ reports: given, onChange }: { reports?: ReportItem[]; onChange?: Change } = {}) {
  const controlled = given !== undefined;
  const own = useAdminInbox(controlled);
  const [busy, setBusy] = useState<Set<string>>(new Set());

  /** Self-fetching mode: flip now, PATCH, put back the ones that failed. */
  const patchOwn: Change = async (id, patch) => {
    const flip = (resolved: boolean) => own.setInbox((x) => ({ ...x, reports: x.reports.map((r) => (r.id === id ? { ...r, resolved } : r)) }));
    flip(patch.resolved);
    try {
      const res = await fetch("/api/admin/inbox", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "report", id, ...patch }) });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Couldn't save");
    } catch (e) {
      flip(!patch.resolved);
      own.setError(e instanceof Error ? e.message : "Couldn't save");
    }
  };
  const change = controlled ? onChange : patchOwn;

  const resolveAll = async (qid: string, ids: string[]) => {
    if (!change) return;
    setBusy((s) => new Set(s).add(qid));
    await Promise.allSettled(ids.map((id) => change(id, { resolved: true })));
    setBusy((s) => {
      const n = new Set(s);
      n.delete(qid);
      return n;
    });
  };

  if (!controlled) {
    if (own.denied) return <Notice kind="error">Your admin session ended. Reload the page and sign in again.</Notice>;
    if (!own.inbox) return own.error ? <Notice kind="error">{own.error}</Notice> : <p className="text-muted">Loading…</p>;
  }
  const all = (controlled ? given : own.inbox?.reports) ?? [];
  const setupError = controlled ? undefined : own.inbox?.errors.reports;
  const groups = groupByQuestion(all.filter((r) => !r.resolved));

  return (
    <div className="space-y-4">
      {!controlled && own.error && <Notice kind="error">{own.error}</Notice>}
      {setupError && <Notice kind="hint">{setupError}</Notice>}

      {groups.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-surface-2 px-6 py-12 text-center">
          <Icon d={I.inbox} className="h-8 w-8 text-muted" />
          <p className="mt-3 text-sm text-muted">
            {setupError ? "Reports can't load until the table above is set up." : "No open question reports. When students flag a question, its reports gather here on one card."}
          </p>
        </div>
      ) : (
        groups.map((g) => {
          const q = g.reports[0].question;
          const working = busy.has(g.qid);
          return (
            <article key={g.qid} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div className="min-w-0">
                  {q ? (
                    <Link href={practiceHref(q)} target="_blank" className="font-semibold break-words hover:text-accent">
                      {questionTitle(g.reports[0])}
                    </Link>
                  ) : (
                    <span className="font-semibold">{g.qid}</span>
                  )}
                  <p className="mt-0.5 text-[13px] text-muted">
                    {g.reports.length} open report{g.reports.length === 1 ? "" : "s"} · {g.reasons.map(([r, n]) => `${REASON_SHORT[r] ?? r}${n > 1 ? ` ×${n}` : ""}`).join(", ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => resolveAll(g.qid, g.reports.map((r) => r.id))}
                  disabled={working || !change}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold hover:bg-surface-2 disabled:opacity-50"
                >
                  <Icon d={I.check} className="h-4 w-4" strokeWidth={2.4} />
                  {working ? "Resolving…" : g.reports.length > 1 ? "Resolve all" : "Resolve"}
                </button>
              </div>

              {q && (
                <div className="mt-3 rounded-xl bg-surface-2 px-3.5 py-3 text-sm">
                  <p className="line-clamp-2 text-muted">{q.text}</p>
                  <p className="mt-1.5">
                    Answer key: <span className="font-semibold">{q.answer}</span>
                  </p>
                </div>
              )}

              <ul className="mt-3 divide-y divide-line">
                {g.reports.map((r) => (
                  <li key={r.id} className="py-3 first:pt-1 last:pb-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-medium text-accent">{REPORT_REASONS[r.reason] ?? r.reason}</span>
                      <time className="text-[13px] text-muted">{when(r.at)}</time>
                    </div>
                    {r.note ? <p className="mt-1 text-sm whitespace-pre-wrap break-words">{r.note}</p> : <p className="mt-1 text-[13px] text-muted">No note.</p>}
                    {(r.telegram || r.instagram) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {r.telegram && <ContactChip href={`https://t.me/${handle(r.telegram)}`} icon={CONTACT_ICONS.telegram} name={handle(r.telegram)} />}
                        {r.instagram && <ContactChip href={`https://instagram.com/${handle(r.instagram)}`} icon={CONTACT_ICONS.instagram} name={handle(r.instagram)} />}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          );
        })
      )}
    </div>
  );
}

function ContactChip({ href, icon, name }: { href: string; icon: string; name: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1 text-[13px] hover:text-accent">
      <Icon d={icon} className="h-3.5 w-3.5 shrink-0 text-muted" />
      <span className="truncate">@{name}</span>
    </a>
  );
}
