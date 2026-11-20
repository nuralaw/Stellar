"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { I, Icon } from "@/components/bank/icons";
import { BTN_PRIMARY, BTN_SECONDARY, FOCUS } from "@/components/plus/styles";
import { TestQuestionView } from "@/components/test/TestQuestionView";
import { levelOf } from "@/lib/elo";
import type { MatchState, RankedHub, ReviewItem } from "@/lib/elo-api-types";
import { PAGE } from "@/lib/ui";
import { fmtDelta, fmtLeft, fmtSeconds, rankedGet } from "./api";
import { ErrorPanel } from "./ErrorPanel";
import { LevelBadge } from "./LevelBadge";
import { LevelProgress } from "./LevelProgress";
import { toView } from "./toView";
import { useStartRanked } from "./useStartRanked";

const nf = new Intl.NumberFormat("en-US");
const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts from `from` to `to` (ease-out). Jumps straight to `to` under prefers-reduced-motion. */
function useCountUp(from: number, to: number, ms = 1100): number {
  const [v, setV] = useState(() => (reduced() ? to : from));
  useEffect(() => {
    if (reduced() || from === to) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms]);
  return v;
}

/** Rating before -> after, with the change counting up and the level progress under it. */
function RatingChange({ before, after, delta, hub }: { before: number; after: number; delta: number; hub: RankedHub | null }) {
  const rating = useCountUp(before, after);
  const d = useCountUp(0, delta);
  const level = hub ? levelOf(after, hub.me.matches) : null;
  const was = hub ? levelOf(before, Math.max(0, hub.me.matches - 1)) : null;
  const moved = level && was && !level.placement && !was.placement && level.level !== was.level ? (level.level > was.level ? "up" : "down") : null;
  return (
    <div className="mt-6 rounded-2xl border border-line bg-bg p-5">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        <div>
          <p className="text-xs text-muted">ELO</p>
          <p className="text-5xl leading-none font-bold tracking-tight tabular-nums">{nf.format(rating)}</p>
        </div>
        <p className={`lesson-pop text-3xl font-bold tabular-nums ${delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-muted"}`} aria-label={`Rating change ${fmtDelta(delta)}`}>
          {fmtDelta(d)}
        </p>
        <p className="pb-1 text-sm text-muted tabular-nums">from {nf.format(before)}</p>
        {level && (
          <div className="ml-auto">
            <LevelBadge level={level} size="md" />
          </div>
        )}
      </div>
      {moved && level && was && (
        <p className={`mt-3 text-sm font-semibold ${moved === "up" ? "text-success" : "text-danger"}`} role="status">
          {moved === "up" ? "Level up" : "Level down"}: {was.name} → {level.name}
        </p>
      )}
      <div className="mt-4">{level ? <LevelProgress level={level} rating={after} /> : <div className="h-8 animate-pulse rounded-lg bg-surface-2" />}</div>
    </div>
  );
}

function Side({ name, avatar, points, label }: { name: string; avatar: string | null; points: number | null; label: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-bg p-4">
      <div className="flex min-w-0 items-center gap-2">
        {avatar !== null ? <Avatar value={avatar} className="h-8 w-8 text-base" /> : <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">?</span>}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs whitespace-nowrap text-muted">{label}</p>
        </div>
      </div>
      <p className="mt-3 text-4xl leading-none font-bold tracking-tight tabular-nums">{points === null ? "–" : nf.format(points)}</p>
      <p className="mt-1 text-xs text-muted">points</p>
    </div>
  );
}

function ReviewList({ items, matchId }: { items: ReviewItem[]; matchId: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const shown = items.filter((r) => !onlyWrong || !r.correct);
  return (
    <section className="mt-10" aria-label="Question review">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Questions</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          Only incorrect and unanswered
        </label>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="hidden grid-cols-[2rem_2rem_1fr_6rem_5rem_1rem] items-center gap-3 border-b border-line px-4 py-2.5 text-xs text-muted sm:grid sm:px-5">
          <span />
          <span>#</span>
          <span>Difficulty</span>
          <span className="text-right">Time</span>
          <span className="text-right">Points</span>
          <span />
        </div>
        {shown.length === 0 && <p className="px-5 py-4 text-sm text-muted">All correct.</p>}
        {shown.map((r) => {
          const isOpen = open === r.idx;
          const note = r.status === "annulled" ? "Left the match" : r.status === "timeout" ? "Timed out" : null;
          return (
            <div key={r.idx} className="border-b border-line last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : r.idx)}
                aria-expanded={isOpen}
                className={`grid w-full grid-cols-[2rem_2rem_1fr_auto_1rem] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 sm:grid-cols-[2rem_2rem_1fr_6rem_5rem_1rem] sm:px-5 ${FOCUS}`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-bg ${r.correct ? "bg-[var(--chart-correct)]" : r.response ? "bg-[var(--chart-wrong)]" : "bg-muted"}`}
                  aria-label={r.correct ? "Correct" : r.response ? "Incorrect" : "Not answered"}
                >
                  <Icon d={r.correct ? I.check : I.x} className="h-3.5 w-3.5" strokeWidth={2.8} />
                </span>
                <span className="font-semibold tabular-nums">{r.idx + 1}</span>
                <span className="min-w-0 truncate text-sm">
                  {DIFF_LABEL[r.difficulty]} <span className="text-muted">· {r.section === "math" ? "Math" : "R&W"}</span>
                  {note && <span className="ml-2 text-xs text-muted">{note}</span>}
                </span>
                <span className="text-right text-sm text-muted tabular-nums">
                  {fmtSeconds(r.elapsedMs)}
                  <span className="hidden sm:inline"> / {r.limitS} s</span>
                </span>
                <span className="hidden text-right text-sm font-semibold tabular-nums sm:block">{r.points > 0 ? `+${r.points}` : "0"}</span>
                <Icon d={I.chevronD} className={`h-4 w-4 text-muted transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="border-t border-line bg-bg p-3 sm:p-5">
                  <p className="mb-3 text-sm text-muted tabular-nums sm:hidden">Points: {r.points > 0 ? `+${r.points}` : "0"}</p>
                  <TestQuestionView q={toView(r.question, `${matchId}-review-${r.idx}`, r.idx + 1, r.difficulty, r)} response={r.response ?? undefined} review />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** The result of a match, from this player's side (docs/ELO.md 8.5): outcome, both scores, rating change, per-question table and review. */
export function MatchResult({ state: initial }: { state: MatchState }) {
  const [state, setState] = useState(initial);
  const [hub, setHub] = useState<RankedHub | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const { openGate, starting, error, clearError, dialog } = useStartRanked();
  const finished = state.status === "finished" && state.outcome !== null;

  // The player's current level (placement state) for the level progress.
  useEffect(() => {
    if (!finished) return;
    let alive = true;
    rankedGet<RankedHub>("/api/ranked").then(
      (h) => alive && setHub(h),
      () => {},
    );
    return () => {
      alive = false;
    };
  }, [finished]);

  // Waiting for the opponent: look again every ~20 s while the tab is visible, so the result appears by itself.
  const pending = state.status === "waiting" || state.status === "playing_b";
  const matchId = state.id;
  useEffect(() => {
    if (!pending) return;
    let alive = true;
    const poll = () => {
      if (document.visibilityState !== "visible") return;
      rankedGet<MatchState>(`/api/ranked/${matchId}`).then(
        (s) => alive && setState(s),
        () => {},
      );
    };
    const t = setInterval(poll, 20_000);
    document.addEventListener("visibilitychange", poll);
    return () => {
      alive = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [pending, matchId]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const gaveUp = state.forfeit === state.role;
  const theyGaveUp = state.forfeit !== null && !gaveUp;
  let title: string;
  let tone = "text-ink";
  let text: string;
  if (finished) {
    title = state.outcome === "win" ? "Win" : state.outcome === "loss" ? "Loss" : "Draw";
    tone = state.outcome === "win" ? "text-success" : state.outcome === "loss" ? "text-danger" : "text-ink";
    text = gaveUp ? "You gave up this match." : theyGaveUp ? "Your opponent gave up." : state.outcome === "win" ? "More points than your opponent on the same ten questions." : state.outcome === "loss" ? "Your opponent scored more on the same ten questions." : "Same points on the same ten questions.";
  } else if (state.status === "waiting") {
    title = "Waiting for an opponent";
    text = `Your result is locked in. When someone plays the same ten questions the winner is decided and your rating updates.${state.expiresAt ? ` The match waits ${fmtLeft(state.expiresAt - now)} more.` : ""}`;
  } else if (state.status === "playing_b") {
    title = "Your opponent is playing";
    text = "They are answering your ten questions right now. The result appears here as soon as they finish.";
  } else if (state.status === "expired") {
    const abandoned = state.answered < state.total;
    title = abandoned ? "Match expired" : "No opponent came";
    text = abandoned ? "You left this match before finishing, so it expired. No rating change." : "Nobody played this set in time, so the match expired. Your rating didn't change.";
  } else if (state.status === "void") {
    title = "Match voided";
    text = "This match was cancelled. Your rating didn't change.";
  } else {
    title = "In progress";
    text = "This match isn't finished yet.";
  }

  return (
    <div className={PAGE}>
      <Link href="/ranked" className={`inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink ${FOCUS}`}>
        <Icon d={I.chevronL} className="h-4 w-4" /> Ranked
      </Link>

      <section className="mt-4 rounded-2xl border border-line bg-surface p-5 sm:p-8" aria-label="Match result">
        <p className="text-sm font-semibold text-muted">Ranked · Mixed</p>
        <h1 className={`lesson-in mt-1 text-4xl font-bold tracking-tight md:text-5xl ${tone}`}>{title}</h1>
        <p className="mt-2 max-w-2xl text-muted">{text}</p>
        {gaveUp && (
          <p className="mt-3 max-w-2xl rounded-xl border border-danger/40 bg-danger-soft px-4 py-2.5 text-sm font-medium text-danger" role="status">
            {state.status === "finished"
              ? "You left this match, so it counts as a loss."
              : "You left this match, so the questions you hadn't answered scored 0. Your opponent will play it and win."}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          <Side name="You" avatar={hub?.me.avatar ?? null} label={state.myPoints === null ? "No points yet" : "Your score"} points={state.myPoints} />
          <Side name={state.opponent?.name ?? "Opponent"} avatar={state.opponent?.avatar ?? null} label={state.opponent ? `${state.opponent.rating} · ${state.opponent.level.placement ? "Placing" : state.opponent.level.name}` : "Not found yet"} points={state.opponentPoints} />
        </div>

        {finished && state.ratingBefore !== null && state.ratingAfter !== null && state.delta !== null && (
          <RatingChange before={state.ratingBefore} after={state.ratingAfter} delta={state.delta} hub={hub} />
        )}

        {error && (
          <div className="mt-6">
            <ErrorPanel error={error} compact onRetry={clearError} />
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={openGate} disabled={starting} className={`${BTN_PRIMARY} disabled:opacity-40`}>
            Play again
          </button>
          <Link href="/leaderboard" className={BTN_SECONDARY}>
            Leaderboard
          </Link>
        </div>
      </section>

      {state.review && state.review.length > 0 && <ReviewList items={state.review} matchId={state.id} />}
      {dialog}
    </div>
  );
}
