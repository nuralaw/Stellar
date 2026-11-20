"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Avatar } from "@/components/Avatar";
import { I, Icon } from "@/components/bank/icons";
import { adminFetch } from "@/lib/admin-keys";
import type { AdminList, AdminLogRow, AdminMatchDetail, AdminMatchRow, AdminPlayer, AdminResetResult, AdminVoidResult } from "@/lib/elo-admin-server";
import { FLAG_LABEL, type MatchFlag } from "@/lib/elo-flags";
import type { EloAnswer, MatchStatus } from "@/lib/elo-store";

// /admin → Ranked: ELO matches with filters (status, flags of docs/ELO.md 6.4, player, dates), a detail drawer with the timing of every
// question, "Void match" (reverts the rating of both players) and "Reset rating" (back to 1000), and the admin log. Every action is logged.

const REFRESH = "M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4";
const STATUSES: MatchStatus[] = ["playing_a", "waiting", "playing_b", "finished", "expired", "void"];
const STATUS: Record<MatchStatus, [string, string]> = {
  playing_a: ["A playing", "bg-accent-soft text-primary-strong"],
  waiting: ["Waiting", "bg-surface-2 text-muted"],
  playing_b: ["B playing", "bg-accent-soft text-primary-strong"],
  finished: ["Finished", "bg-success-soft text-success"],
  expired: ["Expired", "bg-surface-2 text-muted"],
  void: ["Void", "bg-danger-soft text-danger"],
};
const ACTION: Record<string, string> = { void_match: "Voided match", reset_rating: "Reset rating" };

interface Filters {
  status: MatchStatus | "all";
  flagged: boolean;
  q: string;
  from: string;
  to: string;
}
const NO_FILTERS: Filters = { status: "all", flagged: false, q: "", from: "", to: "" };

const when = (at: number) => new Date(at).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const sign = (n: number | null) => (n === null ? "–" : n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0");
const seconds = (ms: number | null) => (ms === null ? "–" : `${(ms / 1000).toFixed(1)} s`);
const shortId = (id: string) => id.slice(0, 8);
const nameOf = (p: AdminPlayer | null) => (p ? p.name || `Player ${shortId(p.userId)}` : "No opponent yet");

async function call<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await adminFetch(url, { cache: "no-store", ...init });
  const json = await res.json().catch(() => null);
  if (res.status === 401 || res.status === 403) throw new Error(json?.error ?? "Sign in with the admin account to see ranked matches.");
  if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
  return json as T;
}

function listUrl(f: Filters, page: number): string {
  const p = new URLSearchParams({ page: String(page) });
  if (f.status !== "all") p.set("status", f.status);
  if (f.flagged) p.set("flagged", "1");
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.from) p.set("from", f.from);
  if (f.to) p.set("to", f.to);
  return `/api/admin/ranked?${p}`;
}

const input = "min-h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-primary";
const btn = "inline-flex min-h-10 items-center rounded-xl border border-line px-3.5 text-sm font-semibold hover:bg-surface-2 disabled:opacity-40";
const dangerBtn = "inline-flex min-h-10 items-center rounded-xl bg-danger px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 dark:text-primary-ink";

export function RankedTab() {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [draft, setDraft] = useState<Filters>(NO_FILTERS);
  const [page, setPage] = useState(1);
  const [list, setList] = useState<AdminList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [log, setLog] = useState<AdminLogRow[] | null>(null);
  const [logError, setLogError] = useState<string | null>(null);

  const loadList = useCallback((f: Filters, p: number, live: () => boolean = () => true) => {
    call<AdminList>(listUrl(f, p))
      .then(
        (d) => {
          if (!live()) return;
          setList(d);
          setError(null);
        },
        (e: Error) => live() && setError(e.message),
      )
      .finally(() => live() && setLoading(false));
  }, []);

  const loadLog = useCallback((live: () => boolean = () => true) => {
    call<{ log: AdminLogRow[] }>("/api/admin/ranked/log?limit=30").then(
      (d) => {
        if (!live()) return;
        setLog(d.log);
        setLogError(null);
      },
      (e: Error) => live() && setLogError(e.message),
    );
  }, []);

  useEffect(() => {
    let live = true;
    loadList(filters, page, () => live);
    return () => {
      live = false;
    };
  }, [filters, page, loadList]);

  useEffect(() => {
    let live = true;
    loadLog(() => live);
    return () => {
      live = false;
    };
  }, [loadLog]);

  const apply = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPage(1);
    setFilters(draft);
  };
  const clear = () => {
    setLoading(true);
    setDraft(NO_FILTERS);
    setPage(1);
    setFilters(NO_FILTERS);
  };
  const refresh = () => {
    setLoading(true);
    loadList(filters, page);
    loadLog();
  };
  const goTo = (n: number) => {
    setLoading(true);
    setPage(n);
  };

  const pages = list ? Math.max(1, Math.ceil(list.total / list.size)) : 1;

  return (
    <div>
      <form onSubmit={apply} className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-muted">
          Status
          <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Filters["status"] })} className={`${input} mt-1 block`}>
            <option value="all">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS[s][0]}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-48 flex-1 text-xs text-muted">
          Player (name or user id)
          <input value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} maxLength={60} placeholder="Search" className={`${input} mt-1 block w-full`} />
        </label>
        <label className="text-xs text-muted">
          From
          <input type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} className={`${input} mt-1 block`} />
        </label>
        <label className="text-xs text-muted">
          To
          <input type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} className={`${input} mt-1 block`} />
        </label>
        <label className="flex min-h-10 items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.flagged} onChange={(e) => setDraft({ ...draft, flagged: e.target.checked })} className="h-4 w-4 accent-primary" />
          Flagged only
        </label>
        <button type="submit" className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-ink hover:bg-primary-hover">
          Apply
        </button>
        <button type="button" onClick={clear} className={btn}>
          Clear
        </button>
        <button type="button" onClick={refresh} disabled={loading} title="Refresh" aria-label="Refresh" className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40">
          <Icon d={REFRESH} className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      {!list && loading && <p className="mt-5 text-muted">Loading…</p>}

      {list && (
        <>
          <p className="mt-4 text-sm text-muted">
            {list.total} {list.total === 1 ? "match" : "matches"}
            {list.scanned !== undefined && ` flagged among the newest ${list.scanned} (checks at most ${list.scanCap})`} · {list.storeKind === "supabase" ? "Supabase" : "local file"}
          </p>
          {list.rows.length === 0 ? (
            <div className="mt-3 flex flex-col items-center rounded-2xl bg-surface-2 px-6 py-12 text-center">
              <Icon d={I.flag} className="h-8 w-8 text-muted" />
              <p className="mt-3 font-semibold">No matches here</p>
              <p className="mt-1 max-w-sm text-sm text-muted">Change the filters, or wait for someone to press Play ranked.</p>
            </div>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-surface">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead className="bg-surface-2 text-xs text-muted">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Players</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Points</th>
                    <th className="px-3 py-2.5 font-medium">Rating</th>
                    <th className="px-3 py-2.5 font-medium">Created</th>
                    <th className="px-3 py-2.5 font-medium">Finished</th>
                    <th className="px-3 py-2.5 font-medium">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {list.rows.map((r) => (
                    <MatchTr key={r.match.id} r={r} onOpen={() => setOpenId(r.match.id)} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pages > 1 && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <button type="button" onClick={() => goTo(page - 1)} disabled={page <= 1 || loading} className={btn}>
                Previous
              </button>
              <p className="text-sm text-muted tabular-nums">
                Page {page} of {pages}
              </p>
              <button type="button" onClick={() => goTo(page + 1)} disabled={page >= pages || loading} className={btn}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Admin log</h2>
        {logError && (
          <p role="alert" className="mt-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {logError}
          </p>
        )}
        {log && log.length === 0 && <p className="mt-2 rounded-2xl bg-surface-2 px-4 py-4 text-sm text-muted">Nothing yet. Voids and rating resets show up here.</p>}
        {log && log.length > 0 && <LogList rows={log} onOpenMatch={setOpenId} />}
      </section>

      {openId && <Drawer id={openId} onClose={() => setOpenId(null)} onChanged={refresh} />}
    </div>
  );
}

function FlagChips({ flags }: { flags: MatchFlag[] }) {
  if (flags.length === 0) return <span className="text-muted">–</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {flags.map((f, i) => (
        <span key={`${f.kind}${f.side}${i}`} title={f.detail} className="rounded-lg bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">
          {FLAG_LABEL[f.kind]}
          {f.side !== "both" && ` ${f.side.toUpperCase()}`}
        </span>
      ))}
    </span>
  );
}

function PlayerCell({ p, tag }: { p: AdminPlayer | null; tag: string }) {
  return (
    <span className="flex items-center gap-2">
      <Avatar value={p?.avatar || "🙂"} className="h-6 w-6 text-sm" />
      <span className="min-w-0">
        <span className="block max-w-40 truncate font-medium">
          <span className="text-muted">{tag} </span>
          {nameOf(p)}
        </span>
      </span>
    </span>
  );
}

function MatchTr({ r, onOpen }: { r: AdminMatchRow; onOpen: () => void }) {
  const m = r.match;
  const [label, chip] = STATUS[m.status];
  return (
    <tr className={`cursor-pointer border-t border-line hover:bg-surface-2 ${m.status === "void" ? "opacity-70" : ""}`} onClick={onOpen}>
      <td className="px-3 py-2.5">
        <button type="button" onClick={onOpen} className="block text-left" aria-label={`Open match ${shortId(m.id)}`}>
          <PlayerCell p={r.a} tag="A" />
          <PlayerCell p={r.b} tag="B" />
        </button>
      </td>
      <td className="px-3 py-2.5">
        <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${chip}`}>{label}</span>
        {m.forfeit && <span className="ml-1 text-xs text-muted">forfeit {m.forfeit.toUpperCase()}</span>}
      </td>
      <td className="px-3 py-2.5 tabular-nums">
        {m.pointsA ?? "–"} : {m.pointsB ?? "–"}
        {m.result && <span className="ml-1 text-xs text-muted">{m.result === "draw" ? "draw" : `${m.result.toUpperCase()} won`}</span>}
      </td>
      <td className="px-3 py-2.5 tabular-nums">
        {sign(m.deltaA)} / {sign(m.deltaB)}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-muted">{when(m.createdAt)}</td>
      <td className="px-3 py-2.5 whitespace-nowrap text-muted">{m.finishedAt ? when(m.finishedAt) : "–"}</td>
      <td className="px-3 py-2.5">
        <FlagChips flags={r.flags} />
      </td>
    </tr>
  );
}

function logText(r: AdminLogRow): string {
  const d = r.details;
  if (r.action === "reset_rating") {
    return d.changed === false ? "already at 1000, nothing changed" : `rating ${String(d.rating_before)} → ${String(d.rating_after)}, peak ${String(d.peak_before)} → ${String(d.rating_after)}`;
  }
  if (r.action === "void_match") {
    const before = String(d.status_before ?? "");
    return d.changed === false ? "already void, nothing changed" : `was ${before}${before === "finished" ? `, deltas ${sign(typeof d.delta_a === "number" ? d.delta_a : null)} / ${sign(typeof d.delta_b === "number" ? d.delta_b : null)} reverted` : ""}`;
  }
  return "";
}

function LogList({ rows, onOpenMatch }: { rows: AdminLogRow[]; onOpenMatch: (id: string) => void }) {
  return (
    <ul className="mt-2 divide-y divide-line rounded-2xl border border-line bg-surface text-sm">
      {rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5">
          <span className="font-semibold">{ACTION[r.action] ?? r.action}</span>
          <span className="text-muted">{logText(r)}</span>
          {r.matchId && (
            <button type="button" onClick={() => onOpenMatch(r.matchId as string)} className="font-mono text-xs text-primary-strong underline">
              {shortId(r.matchId)}
            </button>
          )}
          {r.userId && <span className="font-mono text-xs text-muted">player {shortId(r.userId)}</span>}
          <span className="ml-auto text-xs text-muted">
            {r.adminEmail || "admin"} · {when(r.at)}
          </span>
        </li>
      ))}
    </ul>
  );
}

type Confirm = { kind: "void" } | { kind: "reset"; player: AdminPlayer };

function Drawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [detail, setDetail] = useState<AdminMatchDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    (live: () => boolean = () => true) =>
      call<AdminMatchDetail>(`/api/admin/ranked/match/${id}`).then(
        (d) => {
          if (live()) setDetail(d);
        },
        (e: Error) => {
          if (live()) setError(e.message);
        },
      ),
    [id],
  );

  useEffect(() => {
    let live = true;
    load(() => live);
    return () => {
      live = false;
    };
  }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const run = async (url: string, done: (json: unknown) => string) => {
    setBusy(true);
    setError(null);
    try {
      const json = await call<unknown>(url, { method: "POST" });
      setNotice(done(json));
      setConfirm(null);
      await load();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save");
    } finally {
      setBusy(false);
    }
  };

  const doVoid = () =>
    run(`/api/admin/ranked/match/${id}/void`, (j) => {
      const r = j as AdminVoidResult;
      return r.outcome.changed ? "Match voided. Ratings reverted." : "That match was already void. Nothing changed.";
    });
  const doReset = (p: AdminPlayer) =>
    run(`/api/admin/ranked/player/${p.userId}/reset`, (j) => {
      const r = j as AdminResetResult;
      return r.changed ? `Rating reset: ${r.ratingBefore} → ${r.ratingAfter}.` : "That player was already at 1000. Nothing changed.";
    });

  const m = detail?.match;
  const canVoid = m && m.status !== "void";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Match details">
      <button type="button" aria-label="Close" onClick={() => !busy && onClose()} className="absolute inset-0 bg-ink/40" />
      <aside className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-bg p-4 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Match</h2>
            <p className="font-mono text-xs break-all text-muted">{id}</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40">
            <Icon d={I.x} className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 rounded-xl bg-success-soft px-4 py-3 text-sm text-success">
            {notice}
          </p>
        )}
        {!detail && !error && <p className="mt-5 text-muted">Loading…</p>}

        {detail && m && (
          <div className="mt-4 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${STATUS[m.status][1]}`}>{STATUS[m.status][0]}</span>
              <span className="text-muted">
                created {when(m.createdAt)}
                {m.finishedAt ? ` · finished ${when(m.finishedAt)}` : ""}
              </span>
            </div>

            {detail.flags.length > 0 && (
              <section aria-label="Flags" className="rounded-2xl border border-line bg-surface p-4">
                <h3 className="font-semibold">Flags for review</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {detail.flags.map((f, i) => (
                    <li key={`${f.kind}${f.side}${i}`}>
                      <span className="mr-2 rounded-lg bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">
                        {FLAG_LABEL[f.kind]}
                        {f.side !== "both" && ` ${f.side.toUpperCase()}`}
                      </span>
                      <span className="text-muted">{f.detail}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <PlayerCard tag="A" p={detail.a} points={m.pointsA} delta={m.deltaA} before={m.ratingABefore} won={m.result === "a"} onReset={() => setConfirm({ kind: "reset", player: detail.a })} disabled={busy} />
              <PlayerCard tag="B" p={detail.b} points={m.pointsB} delta={m.deltaB} before={m.ratingBBefore} won={m.result === "b"} onReset={() => detail.b && setConfirm({ kind: "reset", player: detail.b })} disabled={busy} />
            </div>

            {confirm?.kind === "reset" && (
              <ConfirmBox
                text={`Reset ${nameOf(confirm.player)} to rating 1000? Their peak goes back to 1000 too; match counts stay. This is logged and can't be undone from here.`}
                note="Void the suspicious matches first, then reset."
                action="Reset rating"
                busy={busy}
                onDo={() => doReset(confirm.player)}
                onCancel={() => setConfirm(null)}
              />
            )}

            {confirm?.kind === "void" ? (
              <ConfirmBox
                text={
                  m.status === "finished"
                    ? "Void this match? It leaves the leaderboards and the rating change of both players is taken back (each player's own change, so later matches stay). This is logged."
                    : "Void this match? It leaves the leaderboards. No rating was applied yet. This is logged."
                }
                action="Void match"
                busy={busy}
                onDo={doVoid}
                onCancel={() => setConfirm(null)}
              />
            ) : (
              canVoid && (
                <button type="button" onClick={() => setConfirm({ kind: "void" })} disabled={busy} className={btn}>
                  Void match
                </button>
              )
            )}
            {m.status === "void" && <p className="text-sm text-muted">This match is void.</p>}

            <Answers title={`A: ${nameOf(detail.a)}`} rows={detail.answersA} />
            {detail.b && <Answers title={`B: ${nameOf(detail.b)}`} rows={detail.answersB} />}

            {detail.log.length > 0 && (
              <section>
                <h3 className="font-semibold">Admin log for this match</h3>
                <LogList rows={detail.log} onOpenMatch={() => {}} />
              </section>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

function ConfirmBox({
  text,
  note,
  action,
  busy,
  onDo,
  onCancel,
}: {
  text: string;
  note?: string;
  action: string;
  busy: boolean;
  onDo: () => void;
  onCancel: () => void;
}): ReactNode {
  return (
    <div role="alertdialog" aria-label={action} className="rounded-xl border border-danger px-3.5 py-3">
      <p className="text-sm">{text}</p>
      {note && <p className="mt-1.5 text-sm text-muted">{note}</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button type="button" onClick={onDo} disabled={busy} className={dangerBtn}>
          {busy ? "Saving…" : action}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className="inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-ink">
          Cancel
        </button>
      </div>
    </div>
  );
}

function PlayerCard({
  tag,
  p,
  points,
  delta,
  before,
  won,
  onReset,
  disabled,
}: {
  tag: string;
  p: AdminPlayer | null;
  points: number | null;
  delta: number | null;
  before: number | null;
  won: boolean;
  onReset: () => void;
  disabled: boolean;
}) {
  return (
    <article className={`rounded-2xl border bg-surface p-4 ${won ? "border-success" : "border-line"}`}>
      <div className="flex items-center gap-2">
        <Avatar value={p?.avatar || "🙂"} className="h-9 w-9 text-lg" />
        <div className="min-w-0">
          <p className="truncate font-semibold">
            <span className="text-muted">{tag} </span>
            {nameOf(p)}
          </p>
          {p && <p className="font-mono text-xs text-muted">{shortId(p.userId)}</p>}
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-sm">
        <div>
          <dt className="text-xs text-muted">Points</dt>
          <dd className="font-semibold tabular-nums">{points ?? "–"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Change</dt>
          <dd className="font-semibold tabular-nums">{before !== null ? `${before} ${sign(delta)}` : sign(delta)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Now</dt>
          <dd className="font-semibold tabular-nums">{p?.rating ?? "–"}</dd>
        </div>
      </dl>
      {p && (
        <button type="button" onClick={onReset} disabled={disabled || p.rating === null} className={`${btn} mt-3`}>
          Reset rating
        </button>
      )}
    </article>
  );
}

const ANSWER_STATUS: Record<EloAnswer["status"], string> = { open: "open", answered: "answered", timeout: "timeout", annulled: "annulled" };

function Answers({ title, rows }: { title: string; rows: EloAnswer[] }) {
  const total = rows.reduce((s, a) => s + a.points, 0);
  const right = rows.filter((a) => a.correct === true).length;
  return (
    <section>
      <h3 className="font-semibold">
        {title} <span className="text-sm font-normal text-muted tabular-nums">{right}/{rows.length} correct · {total} points</span>
      </h3>
      {rows.length === 0 ? (
        <p className="mt-2 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted">No questions issued yet.</p>
      ) : (
        <div className="mt-2 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-surface-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Question</th>
                <th className="px-3 py-2 font-medium">Issued</th>
                <th className="px-3 py-2 font-medium">Time</th>
                <th className="px-3 py-2 font-medium">% of limit</th>
                <th className="px-3 py-2 font-medium">Result</th>
                <th className="px-3 py-2 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const share = a.elapsedMs === null ? null : Math.round((a.elapsedMs / (a.limitS * 1000)) * 100);
                return (
                  <tr key={a.idx} className="border-t border-line">
                    <td className="px-3 py-2 tabular-nums">{a.idx + 1}</td>
                    <td className="px-3 py-2">
                      <span className="font-mono text-xs">{a.qid}</span>
                      <span className="block text-xs text-muted">
                        {a.section === "rw" ? "RW" : "Math"} · {a.difficulty}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted">
                      {new Date(a.issuedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                      {seconds(a.elapsedMs)}
                      <span className="text-xs text-muted"> / {a.limitS} s</span>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{share === null ? "–" : `${share}%`}</td>
                    <td className="px-3 py-2">
                      <span className={a.correct === true ? "text-success" : a.correct === false ? "text-danger" : "text-muted"}>
                        {a.status === "answered" ? (a.correct ? "correct" : "wrong") : ANSWER_STATUS[a.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {a.points}
                      {a.bonus > 0 && <span className="text-xs text-muted"> ({a.base}+{a.bonus})</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
