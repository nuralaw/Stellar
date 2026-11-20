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
import { GO_KEY, RankedApiError, rankedGet } from "./api";
import { ErrorPanel } from "./ErrorPanel";
import { LevelBadge } from "./LevelBadge";
import { MatchResult } from "./MatchResult";
import { MatchRunner } from "./MatchRunner";
import { Rules, RulesIcon } from "./Rules";

type Phase = "load" | "ready" | "run" | "result";

/** This player still has questions to play in this match. */
const playable = (s: MatchState) => !s.myPartDone && ((s.status === "playing_a" && s.role === "a") || (s.status === "playing_b" && s.role === "b"));

/** /ranked/[id]: ready screen -> the questions -> the result. Which one is decided by the match state from the server. */
export function MatchPage({ id }: { id: string }) {
  const hydrated = useHydrated();
  const canFullscreen = useCanFullscreen();
  const [state, setState] = useState<MatchState | null>(null);
  const [error, setError] = useState<RankedApiError | null>(null);
  const [phase, setPhase] = useState<Phase>("load");
  const [fsError, setFsError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    rankedGet<MatchState>(`/api/ranked/${id}`).then(
      (s) => {
        if (!alive) return;
        setState(s);
        setError(null);
        // The hub just started this match from a click that already went full screen (or the browser has none): no second "Start".
        let go = false;
        try {
          go = sessionStorage.getItem(GO_KEY) === id && (!document.fullscreenEnabled || Boolean(document.fullscreenElement));
        } catch {}
        setPhase((p) => (p !== "load" ? p : !playable(s) ? "result" : go ? "run" : "ready"));
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
    try {
      sessionStorage.removeItem(GO_KEY);
    } catch {}
    setPhase("load");
    setReload((n) => n + 1);
  };

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
          <p className="mt-2 text-sm text-muted">You play first: your result waits for an opponent for up to 48 hours, then the two are compared.</p>
        )}
        {state.answered > 0 && (
          <p className="mt-3 text-sm text-muted tabular-nums">
            {state.answered} of {state.total} questions are done. Any question you left open scored 0; the rest continue from here.
          </p>
        )}
        <div className="mt-4">
          <Rules fullscreen={canFullscreen} />
        </div>
        {fsError && (
          <p className="mt-4 text-sm text-danger" role="alert">
            Your browser didn&apos;t allow full screen, so the match wasn&apos;t started. Try again, or use another browser.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" autoFocus onClick={() => void begin()} className={`${BTN_PRIMARY} flex-1`}>
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
