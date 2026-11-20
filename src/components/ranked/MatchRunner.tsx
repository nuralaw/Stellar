"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { CalculatorDock } from "@/components/CalculatorDock";
import { I, Icon } from "@/components/bank/icons";
import { WARN_ICON } from "@/components/compete/CompeteRound";
import { BTN_PRIMARY, BTN_SECONDARY, FOCUS } from "@/components/plus/styles";
import { TestQuestionView } from "@/components/test/TestQuestionView";
import type { AnswerResponse, NextResponse, PublicPlayer } from "@/lib/elo-api-types";
import { useFocusMode } from "@/lib/focus";
import { exitFullscreen, requestFullscreenNow } from "@/lib/fullscreen";
import type { ChoiceLetter, Difficulty } from "@/lib/types";
import { GO_KEY, RankedApiError, rankedBeacon, rankedPost } from "./api";
import { LevelBadge } from "./LevelBadge";
import { TimerRing } from "./TimerRing";
import { toView } from "./toView";

/** Away from the match (left full screen / hid the tab) for longer than this = gave up (docs/ELO.md 6.3). */
const AWAY_MS = 15_000;
/** How long the points toast stays before the next question comes by itself. */
const FEEDBACK_MS = 1600;

type Q = Extract<NextResponse, { done: false }>;
interface Feedback {
  res: AnswerResponse;
  kind: "answered" | "annulled";
  /** The timer had run out when the answer was sent. */
  expired?: boolean;
}

const DIFF_LABEL: Record<Difficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

function feedbackView(f: Feedback): { text: string; label: string; cls: string } {
  const { res } = f;
  if (f.kind === "annulled") return { text: "0", label: "You left the match", cls: "border-danger/40 bg-danger-soft text-danger" };
  if (res.correct && res.points > 0) return { text: res.bonus > 0 ? `+${res.base} · +${res.bonus} speed` : `+${res.points}`, label: "Correct", cls: "border-success/40 bg-success-soft text-success" };
  if (res.timedOut || f.expired) return { text: "0", label: "Time's up", cls: "border-danger/40 bg-danger-soft text-danger" };
  return { text: "0", label: "Incorrect", cls: "border-danger/40 bg-danger-soft text-danger" };
}

/**
 * The questions of one match, one at a time (docs/ELO.md 6.1-6.3). The server times every question: the ring only shows
 * limitS - (serverNow - issuedAt), counted down on the performance clock, so changing the device clock changes nothing.
 * Calls onFinished when this player's part is over (all answered, given up, or forfeited by being away > 15 s).
 */
export function MatchRunner({ matchId, opponent, onFinished }: { matchId: string; opponent: PublicPlayer | null; onFinished: () => void }) {
  useFocusMode();
  // Where the browser has no full screen (iPhone Safari), the rule is "don't leave the page" instead.
  const [fsRule] = useState(() => typeof document !== "undefined" && document.fullscreenEnabled);
  const [q, setQ] = useState<Q | null>(null);
  const [left, setLeft] = useState(0);
  const [response, setResponse] = useState("");
  const [struck, setStruck] = useState<ChoiceLetter[]>([]);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [error, setError] = useState<RankedApiError | null>(null);
  const [sending, setSending] = useState(false);
  /** ms of grace left while away; null = in the match. */
  const [away, setAway] = useState<number | null>(null);
  const [giveUp, setGiveUp] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);

  const booted = useRef(false);
  /** No question is open for answering (answered, annulled or not loaded yet). */
  const submitted = useRef(true);
  const cur = useRef<number | null>(null);
  const deadline = useRef(0);
  const awayAt = useRef<number | null>(null);
  const annulP = useRef<Promise<AnswerResponse | null> | null>(null);
  const lastDone = useRef(false);
  const advancing = useRef(false);
  const finishing = useRef(false);
  const forfeiting = useRef(false);

  const finish = () => {
    if (finishing.current) return;
    finishing.current = true;
    exitFullscreen(); // finishing.current is set, so this doesn't count as leaving
    onFinished();
  };

  /** Leaving mid-question: it scores 0. */
  const annulCurrent = () => {
    if (cur.current === null || submitted.current) return;
    submitted.current = true;
    annulP.current = rankedPost<AnswerResponse>(`/api/ranked/${matchId}/annul`, { idx: cur.current }).then(
      (r) => {
        lastDone.current = r.done;
        setTotalPoints(r.totalPoints);
        setFb({ res: r, kind: "annulled" });
        return r;
      },
      () => null,
    );
  };

  /** `next`; a "busy" conflict (the server is momentarily handling this match) is retried once, shortly. */
  const fetchNext = async () => {
    try {
      return await rankedPost<NextResponse>(`/api/ranked/${matchId}/next`);
    } catch (e) {
      const err = e as RankedApiError;
      if (err.code !== "conflict" || !/busy/i.test(err.message)) throw e;
      await new Promise((res) => setTimeout(res, 400));
      return rankedPost<NextResponse>(`/api/ranked/${matchId}/next`);
    }
  };

  const loadNext = async () => {
    advancing.current = true;
    setError(null);
    try {
      const r = await fetchNext();
      if (r.done) {
        setTotalPoints(r.totalPoints);
        finish();
        return;
      }
      deadline.current = performance.now() + r.limitS * 1000 - (r.serverNow - r.issuedAt);
      cur.current = r.idx;
      submitted.current = false;
      lastDone.current = false;
      setQ(r);
      setTotalPoints(r.totalPoints);
      setResponse("");
      setStruck([]);
      setFb(null);
      setLeft(Math.max(0, deadline.current - performance.now()));
      advancing.current = false;
      if (awayAt.current !== null) annulCurrent(); // it arrived while the player was away
    } catch (e) {
      const err = e as RankedApiError;
      advancing.current = false;
      if (err.code === "conflict" || err.code === "not_found") finish(); // not playable any more: the match page shows why
      else setError(err);
    }
  };

  /** After the toast: the next question, or the end of this player's part. */
  const advance = async () => {
    if (advancing.current || finishing.current) return;
    advancing.current = true;
    const p = annulP.current;
    annulP.current = null;
    if (p) await p;
    if (lastDone.current) {
      finish();
      return;
    }
    await loadNext();
  };

  const submit = async () => {
    if (!q || submitted.current) return;
    submitted.current = true;
    const expired = deadline.current - performance.now() <= 0;
    setSending(true);
    setError(null);
    try {
      const r = await rankedPost<AnswerResponse>(`/api/ranked/${matchId}/answer`, { idx: q.idx, response });
      lastDone.current = r.done;
      setTotalPoints(r.totalPoints);
      setFb({ res: r, kind: "answered", expired });
    } catch (e) {
      const err = e as RankedApiError;
      if (err.code === "conflict") {
        // The server already closed this question (answered or timed out): move on.
        lastDone.current = false;
        void advance();
      } else {
        submitted.current = false;
        setError(err);
      }
    } finally {
      setSending(false);
    }
  };

  const forfeit = async () => {
    if (finishing.current || forfeiting.current) return;
    forfeiting.current = true;
    const p = annulP.current;
    if (p) await p;
    try {
      await rankedPost(`/api/ranked/${matchId}/leave`, { forfeit: true });
    } catch {}
    finish();
  };

  const strike = (l: ChoiceLetter) => {
    setStruck((s) => (s.includes(l) ? s.filter((x) => x !== l) : [...s, l]));
    if (response === l) setResponse("");
  };

  const onAway = useEffectEvent(() => {
    if (finishing.current || forfeiting.current || awayAt.current !== null) return;
    awayAt.current = performance.now();
    setAway(AWAY_MS);
    annulCurrent();
  });
  /** `resume`: the player is back and pressed the button (or re-entered full screen). Without it only the 15 s check runs. */
  const back = (resume: boolean) => {
    const at = awayAt.current;
    if (at === null) return;
    if (performance.now() - at > AWAY_MS) {
      void forfeit();
      return;
    }
    if (!resume || document.visibilityState === "hidden") return;
    awayAt.current = null;
    setAway(null);
    void advance();
  };
  const onBack = useEffectEvent((resume: boolean) => back(resume));
  const onBoot = useEffectEvent(() => void loadNext());
  const onTimeUp = useEffectEvent(() => void submit());
  const onAdvance = useEffectEvent(() => void advance());
  const onForfeit = useEffectEvent(() => void forfeit());
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (!q || fb || giveUp || away !== null || sending || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement | null;
    if (t?.closest?.("[data-calculator]")) return;
    if (e.key === "Enter") {
      if (t instanceof HTMLButtonElement || t instanceof HTMLAnchorElement) return;
      if (response.trim()) void submit();
      return;
    }
    if (q.question.type !== "mcq" || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
    const l = e.key.toUpperCase() as ChoiceLetter;
    if (!["A", "B", "C", "D"].includes(l)) return;
    if (e.shiftKey) strike(l);
    else setResponse(l);
  });

  // First question.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    onBoot();
  }, []);

  // Countdown from the server's deadline (performance clock: independent of the device's date and time).
  const ticking = q !== null && fb === null && away === null;
  useEffect(() => {
    if (!ticking) return;
    const t = setInterval(() => setLeft(Math.max(0, deadline.current - performance.now())), 100);
    return () => clearInterval(t);
  }, [ticking]);

  // Time's up: send what's there; the server decides (late = 0 points).
  useEffect(() => {
    if (q && !fb && left <= 0 && !submitted.current) onTimeUp();
  }, [q, fb, left]);

  // The points toast, then the next question.
  const advanceByTimer = fb !== null && fb.kind === "answered" && away === null && !giveUp;
  useEffect(() => {
    if (!advanceByTimer) return;
    const t = setTimeout(() => onAdvance(), FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [advanceByTimer, fb]);

  // Grace countdown while away.
  const isAway = away !== null;
  useEffect(() => {
    if (!isAway) return;
    const t = setInterval(() => {
      const at = awayAt.current;
      if (at === null) return;
      const rest = AWAY_MS - (performance.now() - at);
      if (rest <= 0) onForfeit();
      else setAway(rest);
    }, 250);
    return () => clearInterval(t);
  }, [isAway]);

  // Leaving: full screen exited (or tab hidden), page closed.
  useEffect(() => {
    const onFullscreen = () => {
      if (document.fullscreenElement) onBack(true);
      else if (fsRule) onAway();
    };
    const onVisibility = () => (document.visibilityState === "hidden" ? onAway() : onBack(false));
    // Reload / close: the open question scores 0; the request has to survive the page going away.
    const onPageHide = () => {
      if (finishing.current || cur.current === null || submitted.current) return;
      rankedBeacon(`/api/ranked/${matchId}/annul`, { idx: cur.current });
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [fsRule, matchId]);

  // Leaving the page by a client-side navigation (browser Back, a link) fires no pagehide: the open question still scores 0,
  // and returning must never jump straight back into a question.
  useEffect(() => {
    const flags = { finishing, submitted, cur };
    return () => {
      const f = flags;
      if (!f.finishing.current && !f.submitted.current && f.cur.current !== null) rankedBeacon(`/api/ranked/${matchId}/annul`, { idx: f.cur.current });
      try {
        sessionStorage.removeItem(GO_KEY);
      } catch {}
    };
  }, [matchId]);

  // Keyboard: A–D choose, Shift+A–D cross out, Enter locks in.
  useEffect(() => {
    const h = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const comeBack = async () => {
    if (fsRule) await requestFullscreenNow();
    back(true);
  };

  const retry = () => {
    if (q && !fb && !submitted.current) void submit();
    else void advance();
  };

  const total = q?.total ?? 10;
  const limitMs = (q?.limitS ?? 0) * 1000;
  const isMath = q?.section === "math";
  const fv = fb ? feedbackView(fb) : null;
  const lastQuestion = fb?.res.done ?? false;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-bg/90 px-4 py-2.5 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            {opponent ? (
              <div className="flex min-w-0 items-center gap-2">
                <Avatar value={opponent.avatar} className="h-8 w-8 text-base" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">vs {opponent.name}</p>
                  <div className="mt-0.5">
                    <LevelBadge level={opponent.level} size="sm" />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="truncate text-sm font-semibold">You play first</p>
                <p className="text-xs text-muted">Your result will be matched with an opponent</p>
              </div>
            )}
          </div>
          {isMath && (
            <button
              type="button"
              onClick={() => {
                setCalcUsed(true);
                setCalcOpen((v) => !v);
              }}
              aria-pressed={calcOpen}
              title="Desmos calculator"
              className={`grid h-9 w-9 place-items-center rounded-lg border bg-surface transition-colors hover:bg-surface-2 ${FOCUS} ${calcOpen ? "border-primary text-primary-strong" : "border-line text-muted"}`}
            >
              <Icon d={I.calculator} className="h-4.5 w-4.5" />
              <span className="sr-only">Calculator</span>
            </button>
          )}
          {q && <TimerRing leftMs={left} limitMs={limitMs} />}
          <button type="button" onClick={() => setGiveUp(true)} className={`h-9 rounded-lg px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink ${FOCUS}`}>
            Give up
          </button>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${q && (i < q.idx || (i === q.idx && fb)) ? "bg-primary" : q && i === q.idx ? "bg-primary/40" : "bg-surface-2"}`} />
            ))}
          </div>
          <p className="text-sm font-semibold tabular-nums" aria-label={q ? `Question ${q.idx + 1} of ${total}` : undefined}>
            {q ? q.idx + 1 : 0} / {total}
          </p>
          <p className="min-w-16 text-right text-sm font-semibold tabular-nums">
            {totalPoints} <span className="font-normal text-muted">pts</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
          <span className="min-w-0 flex-1">{error.message}</span>
          <button type="button" onClick={retry} className="rounded-lg border border-danger/40 px-3 py-1.5 font-semibold hover:bg-danger/10">
            Try again
          </button>
        </div>
      )}

      <CalculatorDock used={Boolean(isMath) && calcUsed} open={Boolean(isMath) && calcOpen} onClose={() => setCalcOpen(false)} stickyClass="lg:top-28" fullHeight="calc(100vh - 8.5rem)">
        <div>
          {q ? (
            <>
              <div className="mt-5 mb-3 flex items-center gap-3">
                <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-ink px-2 text-sm font-bold text-bg tabular-nums">{q.idx + 1}</span>
                <span className="text-sm text-muted">
                  {q.section === "math" ? "Math" : "Reading & Writing"} · {DIFF_LABEL[q.difficulty]}
                </span>
              </div>
              <div inert={fb !== null} className={fb ? "opacity-70 transition-opacity" : ""}>
                <TestQuestionView
                  key={`${matchId}-${q.idx}`}
                  q={toView(q.question, `${matchId}-${q.idx}`, q.idx + 1, q.difficulty)}
                  response={response}
                  struck={struck}
                  onRespond={(r) => {
                    setResponse(r);
                    if (r) setStruck((s) => s.filter((x) => x !== r));
                  }}
                  onStrike={strike}
                />
              </div>
            </>
          ) : (
            !error && <div className="mt-8 h-64 animate-pulse rounded-2xl bg-surface-2" aria-label="Loading the question" />
          )}

          <div className="qc-actions sticky bottom-0 z-10 -mx-4 mt-6 border-t border-line bg-bg/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
            <div className="flex items-center gap-3 pb-[env(safe-area-inset-bottom)]">
              {fv ? (
                <div role="status" className={`lesson-pop inline-flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 ${fv.cls}`}>
                  <span className="text-lg font-bold tabular-nums">{fv.text}</span>
                  <span className="truncate text-sm font-semibold">{fv.label}</span>
                </div>
              ) : (
                <p className="hidden text-xs text-muted sm:block">One answer per question · {fsRule ? "leaving full screen" : "leaving this page"} scores it 0</p>
              )}
              <div className="flex-1" />
              {fb ? (
                fb.kind === "answered" && (
                  <button type="button" onClick={() => void advance()} className={`${BTN_PRIMARY} min-w-32`}>
                    {lastQuestion ? "See result" : "Next"}
                    <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                )
              ) : (
                <button type="button" onClick={() => void submit()} disabled={!q || !response.trim() || sending} className={`${BTN_PRIMARY} min-w-36 disabled:opacity-40`}>
                  {sending ? "Sending…" : "Lock in answer"}
                </button>
              )}
            </div>
          </div>
        </div>
      </CalculatorDock>

      {giveUp && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4" role="presentation" onClick={() => setGiveUp(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="give-up-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && setGiveUp(false)}
            className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl"
          >
            <h2 id="give-up-title" className="text-xl font-bold tracking-tight">
              Give up this match?
            </h2>
            <p className="mt-2 text-sm text-muted">It counts as a loss and your rating drops. You can&apos;t come back to it.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setGiveUp(false);
                  void forfeit();
                }}
                className={`${BTN_SECONDARY} border-danger/50 text-danger`}
              >
                Give up
              </button>
              <button type="button" autoFocus onClick={() => setGiveUp(false)} className={BTN_PRIMARY}>
                Keep playing
              </button>
            </div>
          </div>
        </div>
      )}

      {away !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg/85 px-4 backdrop-blur" role="alertdialog" aria-modal="true" aria-labelledby="away-title">
          <div className="w-full max-w-sm rounded-2xl border border-danger/40 bg-surface p-6 text-center shadow-2xl">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
              <Icon d={WARN_ICON} className="h-6 w-6" strokeWidth={2} />
            </span>
            <h2 id="away-title" className="mt-3 font-semibold">
              {fsRule ? "You left full screen" : "You left the page"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {fb?.kind === "annulled" ? "The question you were on scores 0. " : ""}
              Come back within <span className="font-semibold text-danger tabular-nums">{Math.max(0, Math.ceil(away / 1000))} s</span> or the match counts as a loss.
            </p>
            <button type="button" autoFocus onClick={() => void comeBack()} className={`${BTN_PRIMARY} mt-5 w-full`}>
              {fsRule ? "Return to full screen" : "Continue the match"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
