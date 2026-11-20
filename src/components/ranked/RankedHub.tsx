"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { I, Icon } from "@/components/bank/icons";
import { BTN_PRIMARY, BTN_SECONDARY, FOCUS } from "@/components/plus/styles";
import type { MatchSummary, RankedHub as HubData } from "@/lib/elo-api-types";
import { useHydrated, useProfile } from "@/lib/store";
import { PAGE } from "@/lib/ui";
import { RankedApiError, fmtDelta, fmtLeft, rankedGet } from "./api";
import { ErrorPanel } from "./ErrorPanel";
import { LevelBadge } from "./LevelBadge";
import { LevelProgress } from "./LevelProgress";
import { NameGate } from "./NameGate";
import { useStartRanked } from "./useStartRanked";

const nf = new Intl.NumberFormat("en-US");

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-bold tabular-nums">{nf.format(value)}</p>
    </div>
  );
}

const OUTCOME = {
  win: { label: "Win", cls: "bg-success-soft text-success" },
  loss: { label: "Loss", cls: "bg-danger-soft text-danger" },
  draw: { label: "Draw", cls: "bg-surface-2 text-muted" },
} as const;

/** One match in a list: opponent, score, ±ELO. Opens the match page. */
function MatchRow({ m, now }: { m: MatchSummary; now: number }) {
  const o = m.outcome ? OUTCOME[m.outcome] : null;
  let status: string | null = null;
  if (m.status === "waiting") status = m.expiresAt ? `Expires in ${fmtLeft(m.expiresAt - now)}` : "Waiting for an opponent";
  else if (m.status === "playing_b" && m.role === "a") status = "Opponent is playing";
  else if (m.status === "playing_a" || m.status === "playing_b") status = "In progress";
  else if (m.status === "expired") status = "Expired · no opponent";
  else if (m.status === "void") status = "Void";
  const date = new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Link href={`/ranked/${m.id}`} className={`flex items-center gap-3 border-b border-line px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-2 sm:px-5 ${FOCUS}`}>
      {m.opponent ? <Avatar value={m.opponent.avatar} className="h-9 w-9 text-lg" /> : <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">?</span>}
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium">{m.opponent ? m.opponent.name : "Opponent not found yet"}</span>
          {m.opponent && (
            <span className="hidden sm:inline">
              <LevelBadge level={m.opponent.level} size="sm" />
            </span>
          )}
        </span>
        <span className="block truncate text-xs text-muted tabular-nums">
          {date} · {m.answered}/{m.total} answered
          {m.myPoints !== null && !o ? ` · ${nf.format(m.myPoints)} pts` : ""}
        </span>
      </span>
      {o && m.myPoints !== null && m.opponentPoints !== null ? (
        <>
          <span className="hidden text-sm font-semibold tabular-nums sm:block">
            {nf.format(m.myPoints)} <span className="text-muted">:</span> {nf.format(m.opponentPoints)}
          </span>
          <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${o.cls}`}>{o.label}</span>
          <span className={`w-12 text-right font-bold tabular-nums ${m.delta === null || m.delta === 0 ? "text-muted" : m.delta > 0 ? "text-success" : "text-danger"}`}>
            {m.delta === null ? "" : fmtDelta(m.delta)}
          </span>
        </>
      ) : (
        <span className="max-w-40 text-right text-xs font-semibold text-primary-strong">{status}</span>
      )}
      <Icon d={I.chevronR} className="h-4 w-4 shrink-0 text-muted" />
    </Link>
  );
}

export function RankedHub() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const [hub, setHub] = useState<HubData | null>(null);
  const [error, setError] = useState<RankedApiError | null>(null);
  const { openGate, starting, error: playError, clearError, dialog } = useStartRanked();
  const [now, setNow] = useState(0); // set when the hub loads (Date.now() can't run during prerender)
  const [reload, setReload] = useState(0);

  // Load, then refresh every 30 s while the hub is on screen.
  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    const run = () =>
      rankedGet<HubData>("/api/ranked").then(
        (h) => {
          if (!alive) return;
          setHub(h);
          setError(null);
          setNow(Date.now());
        },
        (e: RankedApiError) => alive && setError(e),
      );
    run();
    const t = setInterval(run, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [hydrated, reload]);

  // Keep the "expires in" labels moving between refreshes.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const forceName = playError?.code === "name";
  const needsName = forceName || (hydrated && Boolean(hub?.me.needsName) && !profile.name.trim());
  const noSlots = hub ? hub.limits.dailyLeft <= 0 : false;

  if (error && !hub) {
    return (
      <div className={PAGE}>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Ranked</h1>
        <ErrorPanel error={error} next="/ranked" onRetry={() => setReload((n) => n + 1)} />
      </div>
    );
  }

  const me = hub?.me;

  return (
    <div className={PAGE}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Ranked</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Ten questions, the same set for you and your opponent. They don&apos;t have to play at the same time: finish yours and the match waits for them for up to 48 hours.
          </p>
        </div>
        <Link href="/leaderboard" className={`${BTN_SECONDARY} text-sm`}>
          Leaderboard <Icon d={I.chevronR} className="h-4 w-4" />
        </Link>
      </div>

      {playError && !forceName && (
        <div className="mt-6">
          <ErrorPanel error={playError} next="/ranked" compact onRetry={clearError} />
        </div>
      )}

      {needsName && (
        <div className="mt-6">
          <NameGate
            hint={forceName ? playError?.message : null}
            onSaved={clearError}
          />
        </div>
      )}

      {/* Rating */}
      <section className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-label="Your rating">
        {!me ? (
          <div className="space-y-3">
            <div className="h-5 w-24 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-14 w-48 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-3 animate-pulse rounded-full bg-surface-2" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Avatar value={me.name ? me.avatar : profile.avatar} className="h-10 w-10 text-xl" />
                <p className="truncate font-semibold">{me.name || profile.name || "You"}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-6xl leading-none font-bold tracking-tight tabular-nums">{nf.format(me.rating)}</p>
                <div>
                  <p className="mb-1 text-xs text-muted">ELO</p>
                  <LevelBadge level={me.level} size="lg" />
                </div>
              </div>
              <div className="mt-5 max-w-xl">
                <LevelProgress level={me.level} rating={me.rating} />
              </div>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                <Stat label="Wins" value={me.wins} />
                <Stat label="Losses" value={me.losses} />
                <Stat label="Draws" value={me.draws} />
                <Stat label="Peak" value={me.peak} />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:w-60">
              {hub?.active ? (
                <Link href={`/ranked/${hub.active.id}`} className={`${BTN_PRIMARY} text-lg`}>
                  Continue match
                </Link>
              ) : (
                <button type="button" onClick={openGate} disabled={needsName || noSlots || starting} className={`${BTN_PRIMARY} text-lg disabled:opacity-40`}>
                  Play ranked
                </button>
              )}
              {hub?.active && (
                <p className="text-xs text-muted tabular-nums">
                  In progress · {hub.active.answered}/{hub.active.total} answered
                </p>
              )}
              <p className="text-xs text-muted tabular-nums">
                {hub && hub.limits.dailyLeft <= 0
                  ? "Daily limit reached. Come back tomorrow."
                  : hub && hub.limits.waitingLeft <= 0
                    ? "No free waiting slots, but you can still join an opponent's waiting match."
                    : hub
                      ? `${hub.limits.dailyLeft} ${hub.limits.dailyLeft === 1 ? "match" : "matches"} left today · ${hub.limits.waitingLeft} waiting ${hub.limits.waitingLeft === 1 ? "slot" : "slots"} free`
                      : ""}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Waiting for an opponent */}
      {hub && hub.waiting.length > 0 && (
        <section className="mt-8" aria-label="Waiting for an opponent">
          <h2 className="text-lg font-semibold">Waiting for an opponent</h2>
          <p className="mt-0.5 text-sm text-muted">You finished these. They settle when an opponent plays the same set.</p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
            {hub.waiting.map((m) => (
              <MatchRow key={m.id} m={m} now={now} />
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      <section className="mt-8" aria-label="Recent matches">
        <h2 className="text-lg font-semibold">Recent matches</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
          {!hub ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-2" />
              ))}
            </div>
          ) : hub.recent.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">No matches yet. Your first ten are placement matches: your rating moves faster while the game learns your level.</p>
          ) : (
            hub.recent.map((m) => <MatchRow key={m.id} m={m} now={now} />)
          )}
        </div>
      </section>

      <details className="mt-6 rounded-2xl border border-line bg-surface px-5 py-4 text-sm">
        <summary className="cursor-pointer font-semibold">How ranked works</summary>
        <ul className="mt-3 space-y-1.5 text-muted">
          <li>• Everyone starts at 1000 ELO. Beat a higher-rated opponent and you gain more; lose to a lower-rated one and you lose more.</li>
          <li>• The player with more points wins. Giving up or leaving for more than 15 seconds is a loss.</li>
          <li>• The first 10 matches are placement: your level shows after them.</li>
          <li>• If nobody plays your set within 48 hours, the match expires and your rating doesn&apos;t change.</li>
        </ul>
      </details>

      {dialog}
    </div>
  );
}
