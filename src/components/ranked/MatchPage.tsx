"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { I, Icon } from "@/components/bank/icons";
import { BTN_PRIMARY, BTN_SECONDARY, FOCUS } from "@/components/plus/styles";
import type { MatchState } from "@/lib/elo-api-types";
import { requestFullscreenNow, useCanFullscreen } from "@/lib/fullscreen";
import { useHydrated } from "@/lib/store";
import { PAGE } from "@/lib/ui";
import { RankedApiError, fmtCountdown, rankedGet } from "./api";
import { serverNowAt, stampServer, useTicker, type ServerStamp } from "./clock";
import { ErrorPanel } from "./ErrorPanel";
import { LevelBadge } from "./LevelBadge";
import { MatchResult } from "./MatchResult";
import { MatchRunner } from "./MatchRunner";
import { Rules, RulesIcon } from "./Rules";

type Phase = "load" | "ready" | "run" | "result";

/** This player still has questions to play in this match. */
const playable = (s: MatchState) => s.status === "playing" && !s.myPartDone;

/** /ranked/[id]: ready screen -> the questions -> the result. Which one is decided by the match state from the server. */
export function MatchPage({ id }: { id: string }) {
  const hydrated = useHydrated();
  const canFullscreen = useCanFullscreen();
  const [state, setState] = useState<MatchState | null>(null);
  const [error, setError] = useState<RankedApiError | null>(null);
  const [phase, setPhase] = useState<Phase>("load");
  const [fsError, setFsError] = useState(false);
  const [reload, setReload] = useState(0);
  /** The server's clock when `state` arrived: the start countdown runs from it, not from the device clock. */
  const [stamp, setStamp] = useState<ServerStamp | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    rankedGet<MatchState>(`/api/ranked/${id}`).then(
      (s) => {
        if (!alive) return;
        setState(s);
        setStamp(stampServer(s.serverNow));
        setError(null);
        // First load: the ready screen or the result. A reload (the start deadline ran out, the match was resolved) can only move on to the result.
        setPhase((p) => (p === "run" ? p : !playable(s) ? "result" : p === "load" ? "ready" : p));
      },
      (e: RankedApiError) => alive && setError(e),
    );
    return () => {
      alive = false;
    };
  }, [hydrated, id, reload]);

  const begin = async () => {
    setFsError(false);
    if (canFullscreen && !(await requestFullscreenNow())) {
      setFsError(true);
      return;
    }
    setPhase("run");
  };

  // The runner reports the end of this player's part: load the final state and show it.
  const onFinished = () => {
    setPhase("load");
    setReload((n) => n + 1);
  };

  // The ready screen counts down to the start deadline on the server's clock. At 0 the server decides (a loss for the one who
  // didn't start, a void if nobody did): load the state again and the page shows the result.
  const startBy = phase === "ready" ? (state?.startBy ?? null) : null;
  const perf = useTicker(startBy !== null);
  const msLeft = startBy !== null && stamp ? startBy - serverNowAt(stamp, perf) : null;
  const overdue = msLeft !== null && msLeft <= 0;
  // If that load fails (the connection is down), try again every ~3 s.
  useEffect(() => {
    if (!overdue) return;
    const t = setTimeout(() => setReload((n) => n + 1), error ? 3000 : 800);
    return () => clearTimeout(t);
  }, [overdue, state, error]);

  // Found while the tab was in the background: say so in the tab title (the hub can't, the page title is replaced when this page opens).
  const onReady = phase === "ready";
  useEffect(() => {
    if (!onReady) return;
    const title = document.title;
    const sync = () => {
      if (document.hidden) document.title = "Opponent found!";
      else document.title = title;
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      document.title = title;
    };
  }, [onReady]);

  if (error && (!state || phase === "load")) {
    return (
      <div className={PAGE}>
        <ErrorPanel error={error} next={`/ranked/${id}`} onRetry={() => setReload((n) => n + 1)} />
      </div>
    );
  }
  if (!state || phase === "load") {
    return (
      <div className={PAGE}>
        <div className="space-y-4">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-2" />
          <div className="h-56 animate-pulse rounded-2xl bg-surface-2" />
        </div>
      </div>
    );
  }

  if (phase === "run") return <MatchRunner matchId={id} opponent={state.opponent} onFinished={onFinished} />;
  if (phase === "result") return <MatchResult state={state} />;

  // ready
  return (
    <div className={PAGE}>
      <Link href="/ranked" className={`inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink ${FOCUS}`}>
        <Icon d={I.chevronL} className="h-4 w-4" /> Ranked
      </Link>
      <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <RulesIcon />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">{state.answered > 0 ? "Continue your match" : "Ready to play?"}</h1>
        {state.opponent ? (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-bg p-3">
            <Avatar value={state.opponent.avatar} className="h-10 w-10 text-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{state.opponent.name}</p>
              <p className="text-xs text-muted tabular-nums">{state.opponent.rating} ELO</p>
            </div>
            <LevelBadge level={state.opponent.level} size="sm" />
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">Your opponent&apos;s account is no longer available.</p>
        )}
        {msLeft !== null && (
          <p className={`mt-3 text-sm font-semibold tabular-nums ${msLeft <= 15_000 ? "text-danger" : "text-ink"}`} role="timer">
            Start within {fmtCountdown(msLeft)}
            <span className="font-normal text-muted"> · if you don&apos;t, the match is lost</span>
          </p>
        )}
        {state.answered > 0 && (
          <p className="mt-3 text-sm text-muted tabular-nums">
            {state.answered} of {state.total} questions are done. Any question you left open scored 0; the rest continue from here.
          </p>
        )}
        <div className="mt-4">
          <Rules fullscreen={canFullscreen} />
        </div>
        {overdue && error && (
          <p className="mt-4 text-sm text-danger" role="alert">
            Couldn&apos;t reach the server. Trying again…
          </p>
        )}
        {fsError && (
          <p className="mt-4 text-sm text-danger" role="alert">
            Your browser didn&apos;t allow full screen, so the match wasn&apos;t started. Try again, or use another browser.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" autoFocus onClick={() => void begin()} disabled={overdue} className={`${BTN_PRIMARY} flex-1 disabled:opacity-40`}>
            {canFullscreen ? "Start in full screen" : "I understand, start"}
          </button>
          <Link href="/ranked" className={`${BTN_SECONDARY} border-transparent bg-transparent`}>
            Not now
          </Link>
        </div>
      </div>
    </div>
  );
}
