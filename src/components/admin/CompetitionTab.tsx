"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { I, Icon } from "@/components/bank/icons";
import { adminFetch } from "@/lib/admin-keys";
import { ROUNDS, ROUND_SIZE, shiftWeek, weekLabel, type RoundId } from "@/lib/competition";
import type { AdminEntry } from "@/lib/competition-server";

// /admin → Competition: every attempt of a week (incl. annulled and unfinished), with Annul / Restore and Reset.

type Data = { week: string; current: string; now: number; rw: AdminEntry[]; math: AdminEntry[] };
type Action = "annul" | "restore" | "reset";

const REFRESH = "M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4";
const STATUS: Record<AdminEntry["status"], [string, string]> = {
  running: ["In progress", "bg-accent-soft text-accent"],
  unsubmitted: ["Not submitted", "bg-surface-2 text-muted"],
  submitted: ["Submitted", "bg-success-soft text-success"],
  annulled: ["Annulled", "bg-danger-soft text-danger"],
};
const CONFIRM: Record<Action, [string, string]> = {
  annul: ["Annul this attempt? It leaves the leaderboard.", "Annul"],
  restore: ["Restore it? It's graded again from the last saved answers and goes back on the leaderboard.", "Restore"],
  reset: ["Delete this attempt? They can start the round again this week.", "Reset"],
};

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const when = (at: number) => new Date(at).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" });
const keyOf = (e: AdminEntry) => `${e.round}|${e.userId}`;

async function fetchWeek(week: string | null): Promise<Data> {
  const res = await adminFetch(`/api/admin/competition${week ? `?week=${week}` : ""}`, { cache: "no-store" });
  const json = await res.json().catch(() => null);
  if (res.status === 401 || res.status === 403) throw new Error("Sign in with the admin account to see the competition.");
  if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
  return json;
}

export function CompetitionTab() {
  const [week, setWeek] = useState<string | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ key: string; action: Action } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const show = useCallback((p: Promise<Data>, live: () => boolean = () => true) => {
    p.then(
      (d) => {
        if (!live()) return;
        setData(d);
        setError(null);
      },
      (e: Error) => live() && setError(e.message),
    ).finally(() => live() && setLoading(false));
  }, []);

  useEffect(() => {
    let live = true;
    show(fetchWeek(week), () => live);
    return () => {
      live = false;
    };
  }, [week, show]);

  const act = async (e: AdminEntry, action: Action) => {
    if (!data) return;
    const key = keyOf(e);
    setBusy(key);
    setError(null);
    try {
      const body = { week: data.week, round: e.round, userId: e.userId, ...(action === "reset" ? {} : { annulled: action === "annul" }) };
      const res = await adminFetch("/api/admin/competition", {
        method: action === "reset" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Couldn't save");
      setData((d) => {
        if (!d) return d;
        const list = d[e.round].flatMap((x) => (keyOf(x) !== key ? [x] : action === "reset" ? [] : [json.entry as AdminEntry]));
        return { ...d, [e.round]: list };
      });
      setConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save");
    } finally {
      setBusy(null);
    }
  };

  const shown = week ?? data?.week ?? null;
  const isCurrent = Boolean(data && shown === data.current);
  const total = data ? data.rw.length + data.math.length : 0;
  const go = (n: number) => {
    if (!shown) return;
    setLoading(true);
    setWeek(shiftWeek(shown, n));
  };
  const navBtn = "grid h-10 w-10 place-items-center rounded-xl border border-line text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => go(-1)} disabled={!shown || loading} aria-label="Previous week" className={navBtn}>
            <Icon d={I.chevronL} className="h-5 w-5" />
          </button>
          <div className="min-w-32 text-center">
            <p className="font-semibold tabular-nums">{shown ? weekLabel(shown) : "…"}</p>
            <p className="text-xs text-muted">{isCurrent ? "This week" : shown ? "Past week" : ""}</p>
          </div>
          <button type="button" onClick={() => go(1)} disabled={!shown || isCurrent || loading} aria-label="Next week" className={navBtn}>
            <Icon d={I.chevronR} className="h-5 w-5" />
          </button>
        </div>
        <button type="button" onClick={() => {
            setLoading(true);
            show(fetchWeek(shown));
          }} disabled={loading} title="Refresh" aria-label="Refresh" className={navBtn}>
          <Icon d={REFRESH} className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {!data && loading && <p className="mt-5 text-muted">Loading…</p>}

      {data && total === 0 && (
        <div className="mt-5 flex flex-col items-center rounded-2xl bg-surface-2 px-6 py-12 text-center">
          <Icon d={I.flag} className="h-8 w-8 text-muted" />
          <p className="mt-3 font-semibold">No attempts {isCurrent ? "yet this week" : "that week"}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            An attempt shows up here as soon as someone presses Start round on the Weekly tournament page, including ones that were annulled or never submitted.
          </p>
        </div>
      )}

      {data && total > 0 && (
        <div className="mt-5 space-y-6">
          {(["rw", "math"] as RoundId[]).map((round) => (
            <section key={round}>
              <h2 className="flex items-baseline gap-2 text-lg font-semibold">
                {ROUNDS[round].name}
                <span className="text-sm font-normal text-muted tabular-nums">{data[round].length}</span>
              </h2>
              {data[round].length === 0 ? (
                <p className="mt-2 rounded-2xl bg-surface-2 px-4 py-4 text-sm text-muted">No one has taken this round {isCurrent ? "yet" : "that week"}.</p>
              ) : (
                <div className="mt-2 space-y-3">
                  {data[round].map((e) => (
                    <Row
                      key={keyOf(e)}
                      e={e}
                      busy={busy === keyOf(e)}
                      confirming={confirm?.key === keyOf(e) ? confirm.action : null}
                      onAsk={(action) => setConfirm(action ? { key: keyOf(e), action } : null)}
                      onDo={(action) => act(e, action)}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({
  e,
  busy,
  confirming,
  onAsk,
  onDo,
}: {
  e: AdminEntry;
  busy: boolean;
  confirming: Action | null;
  onAsk: (a: Action | null) => void;
  onDo: (a: Action) => void;
}) {
  const [label, chip] = STATUS[e.status];
  const c = e.correct;
  const right = c ? c.easy + c.medium + c.hard : 0;
  const finished = e.status === "submitted" || e.status === "annulled";
  const btn = "inline-flex min-h-10 items-center rounded-xl border border-line px-3.5 text-sm font-semibold hover:bg-surface-2 disabled:opacity-40";

  return (
    <article className={`rounded-2xl border border-line bg-surface p-4 ${e.status === "annulled" ? "opacity-80" : ""}`}>
      <div className="flex items-start gap-3">
        <Avatar value={e.avatar || "🙂"} className="h-10 w-10 text-xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate font-semibold">{e.name}</p>
            <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${chip}`}>{label}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Started {when(e.startedAt)} · <span className="font-mono">{e.userId.slice(0, 8)}</span>
          </p>
        </div>
        {finished && e.score !== undefined && (
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums">{e.score}</p>
            <p className="text-xs text-muted">points</p>
          </div>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-sm">
        <div>
          <dt className="text-xs text-muted">Correct</dt>
          <dd className="font-semibold tabular-nums">{finished ? `${right}/${ROUND_SIZE}` : `${e.answered} answered`}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Easy · Med · Hard</dt>
          <dd className="font-semibold tabular-nums">{c && finished ? `${c.easy} · ${c.medium} · ${c.hard}` : "–"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Time</dt>
          <dd className="font-semibold tabular-nums">{e.seconds !== undefined ? clock(e.seconds) : "–"}</dd>
        </div>
      </dl>

      {confirming ? (
        <div className="mt-3 rounded-xl border border-line px-3.5 py-3">
          <p className="text-sm">{CONFIRM[confirming][0]}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onDo(confirming)}
              disabled={busy}
              className={`inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold disabled:opacity-40 ${
                confirming === "restore" ? "bg-primary text-primary-ink hover:bg-primary-hover" : "bg-danger text-white hover:opacity-90"
              }`}
            >
              {busy ? "Saving…" : CONFIRM[confirming][1]}
            </button>
            <button type="button" onClick={() => onAsk(null)} disabled={busy} className="inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {e.status === "annulled" ? (
            <button type="button" onClick={() => onAsk("restore")} className={btn}>
              Restore
            </button>
          ) : (
            <button type="button" onClick={() => onAsk("annul")} className={btn}>
              Annul
            </button>
          )}
          <button type="button" onClick={() => onAsk("reset")} className={btn}>
            Reset (let them retry)
          </button>
        </div>
      )}
    </article>
  );
}
