"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { I, Icon } from "@/components/bank/icons";
import { BTN_PRIMARY, BTN_SECONDARY, FOCUS } from "@/components/plus/styles";
import { ABANDON_AFTER_S, QUEUE, QUEUE_WINDOW, START_DEADLINE_S, START_RATING } from "@/lib/elo-config";
import type { MatchSummary, QueueState, RankedHub as HubData } from "@/lib/elo-api-types";
import { useHydrated, useProfile } from "@/lib/store";
import { PAGE } from "@/lib/ui";
import { RankedApiError, fmtClock, fmtCountdown, fmtDelta, rankedDelete, rankedDeleteKeepalive, rankedGet } from "./api";
import { serverNowAt, stampServer, useTicker, type ServerStamp } from "./clock";
import { ErrorPanel } from "./ErrorPanel";
import { LevelBadge } from "./LevelBadge";
import { LevelProgress } from "./LevelProgress";
import { NameGate } from "./NameGate";
import { useStartRanked } from "./useStartRanked";
import { useWorkerInterval } from "./useWorkerInterval";

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

/** One finished or void match in the recent list: opponent, score, ±ELO. Opens the match page. */
function MatchRow({ m }: { m: MatchSummary }) {
  const o = m.outcome ? OUTCOME[m.outcome] : null;
  const status = m.status === "void" ? "Didn't happen · no rating change" : m.status === "playing" ? "In progress" : null;
  const date = new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Link href={`/ranked/${m.id}`} className={`flex items-center gap-3 border-b border-line px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-2 sm:px-5 ${FOCUS}`}>
      {m.opponent ? <Avatar value={m.opponent.avatar} className="h-9 w-9 text-lg" /> : <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">?</span>}
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium">{m.opponent ? m.opponent.name : "Opponent"}</span>
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

/** Shown in the Play card's place while the player is in the queue: elapsed time, rating window, how many are searching, Cancel. */
function SearchPanel({ queue, elapsedMs, cancelling, onCancel }: { queue: QueueState; elapsedMs: number; cancelling: boolean; onCancel: () => void }) {
  const others = queue.searching;
  return (
    <div className="rounded-2xl border border-line bg-bg p-4" role="status" aria-live="polite">
      <p className="flex items-center gap-2.5 text-lg font-semibold">
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <span>
          Searching… <span className="tabular-nums">{fmtClock(elapsedMs)}</span>
        </span>
      </p>
      <p className="mt-2 text-sm font-medium tabular-nums">{queue.window === null ? "Any rating" : `±${queue.window} ELO`}</p>
      <p className="mt-0.5 text-sm text-muted">{others === 0 ? "No one else is searching right now" : `${others} ${others === 1 ? "player" : "players"} searching`}</p>
      <p className="mt-0.5 text-xs text-muted">You can switch tabs; keep this one open.</p>
      <button type="button" onClick={onCancel} disabled={cancelling} className={`${BTN_SECONDARY} mt-4 w-full disabled:opacity-40`}>
        Cancel
      </button>
    </div>
  );
}

/** Set when the page is closed or reloaded during a search: a fresh flag on the next load means "put me back in the queue". */
const SEARCH_FLAG = "ranked-search-left-at";

type EndReason = "timeout" | "lost" | "dropped";
/** Where a queue answer came from: an idle answer means "dropped" only for a poll. */
type QueueSource = "join" | "poll" | "cancel" | "hub";

export function RankedHub() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const router = useRouter();
  const [hub, setHub] = useState<HubData | null>(null);
  const [error, setError] = useState<RankedApiError | null>(null);
  const [reload, setReload] = useState(0);
  /** The queue as the server last said it, and the server clock at that moment (for the elapsed time and the start countdown). */
  const [queue, setQueue] = useState<QueueState | null>(null);
  const [stamp, setStamp] = useState<ServerStamp | null>(null);
  /** An opponent was found while this page was searching: the match is opening. */
  const [opening, setOpening] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [pollError, setPollError] = useState<RankedApiError | null>(null);
  const seq = useRef({ sent: 0, applied: 0 });
  const queueLoaded = useRef(false);
  /** The latest queue state, readable from callbacks and timers. */
  const queueRef = useRef<QueueState | null>(null);
  /** The player is in the queue and this page is the one searching (read by the leave handlers). */
  const inSearch = useRef(false);
  /** A Cancel request is in flight: polls stop and their answers are ignored. */
  const cancelPending = useRef(false);
  /** performance.now() of the last queue / hub answer that arrived: a search whose polls keep failing is ended. */
  const lastOk = useRef(0);
  /** Why the search ended on the "search over" card: the 5 minutes ran out, polls stopped getting through, or the server dropped the player. */
  const [reason, setReason] = useState<EndReason>("timeout");
  /** The match this page already opened: it is opened at most once. */
  const opened = useRef<string | null>(null);
  const searchRef = useRef<() => Promise<void>>(async () => {});

  const searching = queue?.status === "searching";

  const putQueue = useCallback((q: QueueState) => {
    queueRef.current = q;
    setQueue(q);
  }, []);

  /** A queue answer from join / poll / cancel. `matched` opens the match; a `timeout` stays until the player acts on it. */
  const applyQueue = useCallback(
    (q: QueueState, source: QueueSource) => {
      const cur = queueRef.current;
      let why: EndReason = "timeout";
      if (q.status === "idle" && cur?.status === "searching") {
        if (source !== "cancel" && cur.since !== null && q.serverNow >= cur.since + QUEUE.searchMaxS * 1000) {
          // The one-time `timeout` may have gone to another request (the hub's refresh): an idle answer after the search's time is up is that timeout.
          q = { ...q, status: "timeout" };
        } else if (source === "poll") {
          // Searching here, not in the queue any more, and not because we cancelled: the server dropped us (no poll for 15 s).
          q = { ...q, status: "timeout" };
          why = "dropped";
        }
      }
      if (q.status === "idle" && cur?.status === "timeout" && source !== "cancel") return;
      setReason(why);
      putQueue(q);
      setStamp(stampServer(q.serverNow));
      setPollError(null);
      if (q.status === "matched" && q.matchId && opened.current !== q.matchId) {
        opened.current = q.matchId;
        inSearch.current = false;
        setOpening(true);
        router.push(`/ranked/${q.matchId}`);
      }
    },
    [router, putQueue],
  );

  /** Applies an answer to request number `n`, unless a later request has already been answered. */
  const applyAt = useCallback(
    (n: number, q: QueueState, source: QueueSource) => {
      if (n < seq.current.applied) return;
      seq.current.applied = n;
      applyQueue(q, source);
    },
    [applyQueue],
  );

  /** Runs a queue request (join / poll / cancel); the number is taken when it is sent, so a late answer can't overwrite a newer one. */
  const sendQueue = useCallback(
    (req: Promise<QueueState>, source: QueueSource = "join", skip?: () => boolean) => {
      const n = ++seq.current.sent;
      return req.then((q) => {
        lastOk.current = performance.now();
        if (!skip?.()) applyAt(n, q, source);
      });
    },
    [applyAt],
  );

  const { openGate, search, starting, error: playError, clearError, dialog } = useStartRanked(sendQueue);
  useEffect(() => {
    searchRef.current = search;
  });

  // Load, then refresh every 30 s while the hub is on screen. The first answer also says whether a search is running (a reload
  // during a search shows the search panel again). Later ones only matter when they carry something the 2 s poll missed: the
  // one-time `timeout`, or a match found by the hub's own queue check.
  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    const run = () => {
      const n = ++seq.current.sent;
      return rankedGet<HubData>("/api/ranked").then(
        (h) => {
          if (!alive) return;
          lastOk.current = performance.now();
          setHub(h);
          setError(null);
          setStamp(stampServer(h.queue.serverNow));
          if (!queueLoaded.current) {
            queueLoaded.current = true;
            putQueue(h.queue);
            // The page was reloaded or reopened a moment ago during a search (its pagehide cancel removed the player): search again.
            let leftAt = 0;
            try {
              leftAt = Number(sessionStorage.getItem(SEARCH_FLAG)) || 0;
              sessionStorage.removeItem(SEARCH_FLAG);
            } catch {}
            if (leftAt && Date.now() - leftAt < QUEUE.dropAfterS * 1000 && h.queue.status === "idle" && !h.active && !h.me.needsName && h.limits.dailyLeft > 0) void searchRef.current();
          } else if (queueRef.current?.status === "searching" && !cancelPending.current && (h.queue.status === "timeout" || h.queue.status === "matched")) {
            // News the 2 s poll may have missed: a match or the one-time timeout. Not `idle`: a refresh that raced a join can say it, and
            // the poll notices a real drop within 2 s.
            applyAt(n, h.queue, "hub");
          }
        },
        (e: RankedApiError) => alive && setError(e),
      );
    };
    void run();
    const t = setInterval(run, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [hydrated, reload, putQueue, applyAt]);

  // While the search panel is shown: poll every QUEUE.pollMs. This is also the heartbeat that keeps the player in the queue, so it
  // must keep going in a background tab: the ticks come from a Worker, a tab timer would be throttled to once a minute. A failed
  // poll (network, 5xx, a gateway page) is skipped; auth / verify / name / setup errors end the search screen.
  const polling = searching && !cancelling;
  useEffect(() => {
    if (polling) lastOk.current = performance.now();
  }, [polling]);
  const poll = () => {
    if (cancelPending.current) return;
    return sendQueue(rankedGet<QueueState>("/api/ranked/queue"), "poll", () => cancelPending.current).catch((e: RankedApiError) => {
      const fatal = e.code === "auth" || e.code === "verify" || e.code === "name" || e.code === "setup";
      if (fatal) {
        setPollError(e);
        if (queueRef.current) putQueue({ ...queueRef.current, status: "idle", since: null, window: null, until: null });
      } else if (performance.now() - lastOk.current > QUEUE.dropAfterS * 1000 && queueRef.current) {
        // No poll got through for as long as the server waits before dropping the player: the search is over, whatever the screen says.
        setReason("lost");
        putQueue({ ...queueRef.current, status: "timeout", since: null, window: null, until: null });
      }
    });
  };
  useWorkerInterval(poll, QUEUE.pollMs, polling);

  // Leaving the page while searching cancels the search; the server also drops a player who stops polling. A reload or close fires
  // pagehide: it leaves a timestamp so the next load puts the player back in the queue. Leaving by a link doesn't.
  useEffect(() => {
    inSearch.current = searching;
  }, [searching]);
  useEffect(() => {
    const leave = () => {
      if (!inSearch.current) return;
      inSearch.current = false;
      rankedDeleteKeepalive("/api/ranked/queue");
    };
    const onPageHide = () => {
      if (inSearch.current && !cancelPending.current) {
        try {
          sessionStorage.setItem(SEARCH_FLAG, String(Date.now()));
        } catch {}
      }
      leave();
    };
    // Back from the back/forward cache: no new load will read the flag, so drop it. The pagehide already cancelled the search on the
    // server, so a player who was searching is put back in the queue.
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      try {
        sessionStorage.removeItem(SEARCH_FLAG);
      } catch {}
      if (queueRef.current?.status === "searching") {
        inSearch.current = true;
        void searchRef.current();
      }
    };
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      leave();
    };
  }, []);

  // A 409 (already in a match) means the hub is out of date: load it again, its Back to your match card shows the match.
  const alreadyIn = playError?.code === "in_match";
  useEffect(() => {
    if (alreadyIn) queueMicrotask(() => setReload((n) => n + 1));
  }, [alreadyIn]);

  const cancel = () => {
    cancelPending.current = true;
    setCancelling(true);
    sendQueue(rankedDelete<QueueState>("/api/ranked/queue"), "cancel")
      .catch((e: RankedApiError) => setPollError(e))
      .finally(() => {
        cancelPending.current = false;
        setCancelling(false);
      });
  };
  const dismissTimeout = () => {
    setReason("timeout");
    if (queueRef.current) putQueue({ ...queueRef.current, status: "idle" });
  };

  const active = hub?.active ?? null;
  const showCountdown = Boolean(active && active.startBy !== null && !active.myPartDone);
  const perf = useTicker(searching || showCountdown);
  const nowMs = stamp ? serverNowAt(stamp, perf) : 0;
  const elapsedMs = searching && queue?.since != null ? nowMs - queue.since : 0;

  const forceName = playError?.code === "name";
  const needsName = forceName || (hydrated && Boolean(hub?.me.needsName) && !profile.name.trim());
  const noSlots = hub ? hub.limits.dailyLeft <= 0 : false;
  const shownError = pollError ?? (alreadyIn || forceName ? null : playError);

  if (error && !hub) {
    return (
      <div className={PAGE}>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Ranked</h1>
        <ErrorPanel error={error} next="/ranked" onRetry={() => setReload((n) => n + 1)} />
      </div>
    );
  }

  const me = hub?.me;
  const left = hub ? hub.limits.dailyLeft : null;

  return (
    <div className={PAGE}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Ranked</h1>
          <p className="mt-2 max-w-2xl text-muted">Find an opponent and play the same ten questions at the same time, each at your own pace. More points wins.</p>
        </div>
        <Link href="/leaderboard" className={`${BTN_SECONDARY} text-sm`}>
          Leaderboard <Icon d={I.chevronR} className="h-4 w-4" />
        </Link>
      </div>

      {shownError && (
        <div className="mt-6">
          <ErrorPanel error={shownError} next="/ranked" compact onRetry={() => (pollError ? setPollError(null) : clearError())} />
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
              {opening ? (
                <div className="rounded-2xl border border-line bg-bg p-4" role="status">
                  <p className="text-lg font-semibold">Opponent found!</p>
                  <p className="mt-1 text-sm text-muted">Opening your match…</p>
                </div>
              ) : searching && queue ? (
                <SearchPanel queue={queue} elapsedMs={elapsedMs} cancelling={cancelling} onCancel={cancel} />
              ) : queue?.status === "timeout" ? (
                <div className="rounded-2xl border border-line bg-bg p-4" role="status">
                  <p className="font-semibold">{reason === "lost" ? "Lost connection to the queue." : reason === "dropped" ? "Your search stopped." : "No opponent found in 5 minutes."}</p>
                  {reason === "dropped" && <p className="mt-1 text-xs text-muted">This tab lost touch with the queue. Keep it open while you search.</p>}
                  <button type="button" onClick={() => void search()} disabled={starting || needsName || noSlots} className={`${BTN_PRIMARY} mt-3 w-full disabled:opacity-40`}>
                    {starting ? "Joining the queue…" : "Search again"}
                  </button>
                  <button type="button" onClick={dismissTimeout} className={`${BTN_SECONDARY} mt-2 w-full border-transparent bg-transparent`}>
                    Not now
                  </button>
                </div>
              ) : active ? (
                <>
                  <Link href={`/ranked/${active.id}`} className={`${BTN_PRIMARY} text-lg`}>
                    Back to your match
                  </Link>
                  <p className="text-xs text-muted tabular-nums">
                    {active.myPartDone
                      ? "Your opponent is still playing"
                      : active.startBy !== null
                        ? `Opponent found · start within ${fmtCountdown(active.startBy - nowMs)}`
                        : `In progress · ${active.answered}/${active.total} answered`}
                  </p>
                </>
              ) : (
                <button type="button" onClick={openGate} disabled={needsName || noSlots || starting} className={`${BTN_PRIMARY} text-lg disabled:opacity-40`}>
                  Play ranked
                </button>
              )}
              <p className="text-xs text-muted tabular-nums">
                {left === null ? "" : left <= 0 ? "Daily limit reached. Come back tomorrow." : `${left} ${left === 1 ? "match" : "matches"} left today`}
              </p>
            </div>
          </div>
        )}
      </section>

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
            hub.recent.map((m) => <MatchRow key={m.id} m={m} />)
          )}
        </div>
      </section>

      <details className="mt-6 rounded-2xl border border-line bg-surface px-5 py-4 text-sm">
        <summary className="cursor-pointer font-semibold">How ranked works</summary>
        <ul className="mt-3 space-y-1.5 text-muted">
          <li>• Everyone starts at {START_RATING} ELO. Beat a higher-rated opponent and you gain more; lose to a lower-rated one and you lose more.</li>
          <li>• You get the same 10 questions as your opponent, played at the same time, each at your own pace. The player with more points wins.</li>
          <li>
            • We look for an opponent near your rating (±{QUEUE_WINDOW.base} to start, wider the longer you wait, any rating after {QUEUE_WINDOW.openAfterS / 60} minutes).
          </li>
          <li>• After an opponent is found you have {START_DEADLINE_S} seconds to start, and not starting loses the match.</li>
          <li>• Giving up, leaving for more than 15 seconds, or {ABANDON_AFTER_S / 60} minutes with no activity is a loss.</li>
          <li>• Answers and explanations appear when the match ends.</li>
          <li>• The first 10 matches are placement: your level shows after them.</li>
        </ul>
      </details>

      {dialog}
    </div>
  );
}
