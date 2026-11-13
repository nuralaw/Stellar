"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { ReportReason } from "@/lib/report-reasons";
import type { ReportItem } from "@/lib/reports";
import type { SupportRequest } from "@/lib/support";
import { getSkill } from "@/lib/taxonomy";

// Admin Overview: the numbers at a glance + the most reported questions.
//
//   <OverviewTab />                 fetches /api/admin/inbox itself
//   <OverviewTab inbox={inbox} />   uses the Support list's already-loaded inbox (no second fetch)
//
// Also exports the bits ReportsByQuestion shares: useAdminInbox(), groupByQuestion(), questionTitle(), REASON_SHORT, Notice.

export type AdminInbox = { support: SupportRequest[]; reports: ReportItem[]; errors: { support?: string; reports?: string } };
type State = { inbox: AdminInbox | null; loading: boolean; error: string | null; denied: boolean };

const DAY = 24 * 60 * 60 * 1000;

/** Short reason names for chips. */
export const REASON_SHORT: Record<ReportReason, string> = {
  answer: "Answer key",
  explanation: "Explanation",
  typo: "Typo",
  display: "Display",
  other: "Other",
};

/** "Math #12 · Linear equations" (or the raw qid when the question is gone from the bank). */
export function questionTitle(r: ReportItem) {
  const q = r.question;
  if (!q) return r.qid;
  return `${q.section === "math" ? "Math" : "R&W"} #${q.n} · ${getSkill(q.skill)?.name ?? q.skill}`;
}

export const practiceHref = (q: NonNullable<ReportItem["question"]>) => `/practice?section=${q.section}&q=${q.n}`;

export type QuestionGroup = { qid: string; reports: ReportItem[]; latest: number; reasons: [ReportReason, number][] };

/** Reports grouped by question, most reports first (ties: most recent first). */
export function groupByQuestion(reports: ReportItem[]): QuestionGroup[] {
  const map = new Map<string, ReportItem[]>();
  for (const r of reports) map.set(r.qid, [...(map.get(r.qid) ?? []), r]);
  return [...map.entries()]
    .map(([qid, list]) => {
      const counts = new Map<ReportReason, number>();
      for (const r of list) counts.set(r.reason, (counts.get(r.reason) ?? 0) + 1);
      return {
        qid,
        reports: [...list].sort((a, b) => b.at - a.at),
        latest: Math.max(...list.map((r) => r.at)),
        reasons: [...counts.entries()].sort((a, b) => b[1] - a[1]),
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length || b.latest - a.latest);
}

/** Loads /api/admin/inbox. `skip` = the caller already has the data. */
export function useAdminInbox(skip = false) {
  const [state, setState] = useState<State>({ inbox: null, loading: !skip, error: null, denied: false });

  const fetchIt = useCallback(async (): Promise<Partial<State>> => {
    try {
      const res = await fetch("/api/admin/inbox", { cache: "no-store" });
      if (res.status === 401 || res.status === 403) return { denied: true, loading: false };
      return { inbox: await res.json(), loading: false, error: null, denied: false };
    } catch {
      return { loading: false, error: "Couldn't load the list. Check your connection." };
    }
  }, []);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    fetchIt().then((p) => setState((s) => ({ ...s, ...p })));
  }, [fetchIt]);

  useEffect(() => {
    if (skip) return;
    let live = true;
    fetchIt().then((p) => live && setState((s) => ({ ...s, ...p })));
    return () => {
      live = false;
    };
  }, [skip, fetchIt]);

  const setInbox = useCallback((f: (x: AdminInbox) => AdminInbox) => setState((s) => (s.inbox ? { ...s, inbox: f(s.inbox) } : s)), []);
  const setError = useCallback((error: string | null) => setState((s) => ({ ...s, error })), []);
  return { ...state, reload, setInbox, setError };
}

/** Error / setup-hint boxes, shared by the admin tabs. */
export function Notice({ kind, children }: { kind: "error" | "hint"; children: React.ReactNode }) {
  return (
    <p role={kind === "error" ? "alert" : undefined} className={`rounded-xl px-4 py-3 text-sm ${kind === "error" ? "bg-danger-soft text-danger" : "bg-accent-soft text-ink"}`}>
      {children}
    </p>
  );
}

function Tile({ label, value, sub }: { label: string; value: number | string; sub: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-[13px] leading-snug text-muted">{sub}</p>
    </div>
  );
}

export function OverviewTab({ inbox: given }: { inbox?: AdminInbox | null } = {}) {
  const own = useAdminInbox(given !== undefined);
  const inbox = given !== undefined ? given : own.inbox;
  // "Now" for the 7-day window: taken once on mount (good enough for an admin glance; keeps render pure).
  const [now] = useState(() => Date.now());

  if (own.denied) return <Notice kind="error">Your admin session ended. Reload the page and sign in again.</Notice>;
  if (!inbox) {
    if (own.error) return <Notice kind="error">{own.error}</Notice>;
    return <p className="text-muted">Loading…</p>;
  }

  const support = inbox.support;
  const reports = inbox.reports;
  const openSupport = support.filter((r) => !r.resolved).length;
  const bugs = support.filter((r) => r.bugConfirmed).length;
  const openReports = reports.filter((r) => !r.resolved);
  const lastWeek = reports.filter((r) => r.at >= now - 7 * DAY).length;
  const groups = groupByQuestion(openReports);
  const top = groups.slice(0, 10);
  const errors = [inbox.errors.support, inbox.errors.reports].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      {(errors.length > 0 || own.error) && (
        <div className="space-y-2">
          {own.error && <Notice kind="error">{own.error}</Notice>}
          {errors.map((e) => (
            <Notice key={e} kind="hint">
              {e}
            </Notice>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Open support requests" value={inbox.errors.support ? "–" : openSupport} sub={openSupport ? "Waiting for a reply" : "All answered"} />
        <Tile label="Confirmed bugs" value={inbox.errors.support ? "–" : bugs} sub={bugs === 1 ? "Owes one 50%-off subscription" : "Each owes a 50%-off subscription"} />
        <Tile label="Open question reports" value={inbox.errors.reports ? "–" : openReports.length} sub={`On ${groups.length} question${groups.length === 1 ? "" : "s"}`} />
        <Tile label="Reports, last 7 days" value={inbox.errors.reports ? "–" : lastWeek} sub="Open and resolved" />
      </div>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">Most reported questions</h2>
          <p className="text-[13px] text-muted">Top 10 by open reports</p>
        </div>
        {top.length === 0 ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl bg-surface-2 px-6 py-10 text-center">
            <Icon d={I.inbox} className="h-8 w-8 text-muted" />
            <p className="mt-3 text-sm text-muted">
              {inbox.errors.reports ? "Reports can't load until the table above is set up." : "No open question reports. New ones show up here when students flag a question."}
            </p>
          </div>
        ) : (
          <ol className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {top.map((g, i) => {
              const r = g.reports[0];
              return (
                <li key={g.qid} className="flex items-start gap-3 px-4 py-3.5">
                  <span className="mt-0.5 w-5 shrink-0 text-right text-sm text-muted tabular-nums">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    {r.question ? (
                      <Link href={practiceHref(r.question)} target="_blank" className="inline-flex max-w-full items-center gap-1 font-semibold hover:text-accent">
                        <span className="truncate">{questionTitle(r)}</span>
                        <Icon d={I.expand} className="h-3.5 w-3.5 shrink-0 text-muted" />
                      </Link>
                    ) : (
                      <span className="font-semibold">{r.qid}</span>
                    )}
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {g.reasons.map(([reason, n]) => (
                        <span key={reason} className="rounded-md bg-surface-2 px-2 py-0.5 text-[13px] text-muted">
                          {REASON_SHORT[reason] ?? reason}
                          {n > 1 && <span className="tabular-nums"> ×{n}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-semibold text-accent tabular-nums" title="Open reports">
                    {g.reports.length}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
