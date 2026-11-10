"use client";

import { useEffect, useMemo, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { MAX_BASE, POINTS, ROUNDS, ROUND_MIX, ROUND_SIZE, SPEED_BONUS, shiftWeek, weekLabel, type Board, type MyRound, type RoundId } from "@/lib/competition";
import { getUserId, updateProfile, useHydrated, useProfile } from "@/lib/store";
import { CompeteRound, RoundReview, WARN_ICON, fmtDuration, type RoundData } from "./CompeteRound";
import { exitFullscreen, requestFullscreenNow, useCanFullscreen } from "@/lib/fullscreen";
import { PAGE } from "@/lib/ui";
import { isPhotoAvatar } from "@/components/Avatar";

interface Hub {
  week: string;
  current: string;
  endsAt: number;
  now: number;
  overall: Board;
  rw: Board;
  math: Board;
  mine: MyRound[];
}

type BoardId = "overall" | RoundId;

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40";

function timeLeft(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60_000));
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  return d > 0 ? `${d}d ${h}h` : `${h}h ${m % 60}m`;
}

const MEDAL = ["🥇", "🥈", "🥉"];

/** Shown before a round starts: one attempt, and leaving full screen annuls it. */
function StartWarning({ round, fullscreen, busy, onCancel, onStart }: { round: RoundId; fullscreen: boolean; busy: boolean; onCancel: () => void; onStart: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="start-warning-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
          <Icon d={WARN_ICON} className="h-6 w-6" strokeWidth={2} />
        </span>
        <h2 id="start-warning-title" className="mt-4 text-xl font-bold tracking-tight">
          Before you start the {ROUNDS[round].name} round
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            • <span className="font-semibold text-ink">One attempt.</span> Once you start, this week&apos;s attempt is used — even if it goes badly.
          </li>
          <li>
            •{" "}
            {fullscreen ? (
              <>
                <span className="font-semibold text-ink">The round opens in full screen.</span> If you leave full screen (Esc, switching tabs, reloading or closing the page),
                the attempt is <span className="font-semibold text-danger">annulled</span>: 0 points and off the leaderboard.
              </>
            ) : (
              <>
                <span className="font-semibold text-ink">Stay on this page.</span> If you switch apps or tabs, reload or close the page, the attempt is{" "}
                <span className="font-semibold text-danger">annulled</span>: 0 points and off the leaderboard.
              </>
            )}
          </li>
          <li>
            • The timer ({ROUNDS[round].minutes} min) starts right away and doesn&apos;t pause.
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={onStart} disabled={busy} className={`${btnPrimary} flex-1`}>
            {busy ? "Starting…" : fullscreen ? "Start in full screen" : "I understand, start"}
          </button>
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 font-semibold text-muted hover:bg-surface-2 hover:text-ink">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

async function fetchHub(userId: string, week: string | null): Promise<Hub> {
  const res = await fetch(`/api/competition?userId=${userId}${week ? `&week=${week}` : ""}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

export function Competition() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const [week, setWeek] = useState<string | null>(null);
  const [hub, setHub] = useState<Hub | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardId>("overall");
  const [round, setRound] = useState<RoundData | null>(null);
  const [starting, setStarting] = useState<RoundId | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  /** Round whose "before you start" warning is open. */
  const [gate, setGate] = useState<RoundId | null>(null);
  const canFullscreen = useCanFullscreen();

  const userId = useMemo(() => (hydrated ? getUserId() : null), [hydrated]);

  // Load, then refresh every 30 s while the hub is on screen.
  useEffect(() => {
    if (round || !userId) return;
    let alive = true;
    const run = () =>
      fetchHub(userId, week).then(
        (h) => {
          if (!alive) return;
          setHub(h);
          setError(null);
        },
        (e: Error) => alive && setError(e.message),
      );
    run();
    const t = setInterval(run, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [userId, week, round]);

  const open = async (r: RoundId) => {
    if (!userId) return;
    setStarting(r);
    setError(null);
    try {
      const res = await fetch("/api/competition/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round: r, userId, name: profile.name, avatar: isPhotoAvatar(profile.avatar) ? "🙂" : profile.avatar }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setRound(json);
      window.scrollTo({ top: 0 });
    } catch (e) {
      exitFullscreen();
      setError((e as Error).message);
    } finally {
      setStarting(null);
    }
  };

  /** "I understand": go full screen first (needs this click), then start the round. */
  const startGated = async (r: RoundId) => {
    if (canFullscreen && !(await requestFullscreenNow())) {
      setGate(null);
      setError("Your browser didn't allow full screen, so the round wasn't started. Try again, or use another browser.");
      return;
    }
    setGate(null);
    await open(r);
  };

  const back = () => {
    setRound(null);
    window.scrollTo({ top: 0 });
  };

  if (round && userId) {
    if (round.result) return <RoundReview data={round} rank={hub?.mine.find((m) => m.round === round.round)?.rank} onBack={back} />;
    return <CompeteRound key={`${round.week}-${round.round}`} data={round} userId={userId} onDone={(d) => setRound(d)} onExit={back} />;
  }

  const isCurrent = !hub || hub.week === hub.current;
  const b = hub?.[board];
  const needsName = hydrated && !profile.name.trim();

  return (
    <div className={PAGE}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Weekly tournament</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Two rounds every week. Everyone gets their own random questions: {ROUND_MIX.easy} easy, {ROUND_MIX.medium} medium and {ROUND_MIX.hard} hard. Answer fast and
            right to climb the leaderboard.
          </p>
        </div>
        {hub && isCurrent && (
          <div className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm">
            <p className="text-xs text-muted">This week · {weekLabel(hub.week)}</p>
            <p className="font-semibold tabular-nums">Ends in {timeLeft(hub.endsAt - hub.now)}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {/* Name for the leaderboard */}
      {needsName && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (nameDraft.trim()) updateProfile({ name: nameDraft.trim().slice(0, 24) });
          }}
          className="mt-8 rounded-2xl border border-primary/40 bg-primary-soft/40 p-5"
        >
          <label htmlFor="lb-name" className="font-semibold">
            Choose your leaderboard name
          </label>
          <p className="mt-1 text-sm text-muted">Everyone can see it. You can change it later in Profile.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              id="lb-name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              maxLength={24}
              placeholder="e.g. Aru"
              className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:max-w-xs"
            />
            <button type="submit" disabled={!nameDraft.trim()} className={btnPrimary}>
              Save
            </button>
          </div>
        </form>
      )}

      {/* This week's rounds */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {(["rw", "math"] as RoundId[]).map((r) => {
          const m = hub?.mine.find((x) => x.round === r);
          const total = m?.correct ? m.correct.easy + m.correct.medium + m.correct.hard : 0;
          return (
            <div key={r} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{ROUNDS[r].name}</h2>
                  <p className="mt-0.5 text-sm text-muted tabular-nums">
                    {ROUND_SIZE} questions · {ROUNDS[r].minutes} min
                  </p>
                </div>
                {m?.status === "done" && (
                  <span className="rounded-lg bg-success-soft px-2 py-1 text-xs font-semibold text-success">Done{m.rank ? ` · #${m.rank}` : ""}</span>
                )}
                {m?.status === "running" && <span className="rounded-lg bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">In progress</span>}
                {m?.status === "annulled" && <span className="rounded-lg bg-danger-soft px-2 py-1 text-xs font-semibold text-danger">Annulled</span>}
              </div>
              {m?.status === "done" ? (
                <div className="mt-4 flex items-end gap-6">
                  <div>
                    <p className="text-xs text-muted">Score</p>
                    <p className="text-3xl font-bold tabular-nums">{m.score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Correct</p>
                    <p className="text-lg font-semibold tabular-nums">
                      {total}/{ROUND_SIZE}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Time</p>
                    <p className="text-lg font-semibold tabular-nums">{fmtDuration(m.seconds ?? 0)}</p>
                  </div>
                </div>
              ) : m?.status === "annulled" ? (
                <p className="mt-4 text-sm text-muted">You left full screen during this round, so the attempt was annulled: 0 points and off the leaderboard. Next chance: Monday.</p>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  {m?.status === "running"
                    ? `Your timer is running — ${timeLeft((m.endsAt ?? 0) - (hub?.now ?? 0))} left.`
                    : hub && isCurrent
                      ? `Closes in ${timeLeft(hub.endsAt - hub.now)}. Skip it and you're off this week's ${ROUNDS[r].name} board. One attempt; the timer starts when you press Start.`
                      : "One attempt this week. The timer starts when you press Start."}
                </p>
              )}
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => (m?.status === "done" || m?.status === "annulled" || m?.status === "running" ? open(r) : setGate(r))}
                  disabled={!userId || needsName || starting !== null || !hub || !isCurrent}
                  className={m?.status === "done" || m?.status === "annulled" ? "rounded-xl border border-line px-5 py-2.5 font-semibold hover:bg-surface-2 disabled:opacity-40" : btnPrimary}
                >
                  {starting === r ? "Loading…" : m?.status === "done" || m?.status === "annulled" ? "Review answers" : m?.status === "running" ? "Continue" : "Start round"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules */}
      <details className="mt-4 rounded-2xl border border-line bg-surface px-5 py-4 text-sm">
        <summary className="cursor-pointer font-semibold">How scoring works</summary>
        <ul className="mt-3 space-y-1.5 text-muted">
          <li>
            • Each correct answer: easy {POINTS.easy}, medium {POINTS.medium}, hard {POINTS.hard} points (up to {MAX_BASE} per round). Wrong or blank answers score 0.
          </li>
          <li>• Speed bonus: up to +{SPEED_BONUS * 100}% of your answer points, shrinking the longer you take. Finish in half the time → +{(SPEED_BONUS * 50).toFixed(0)}%.</li>
          <li>• One attempt per round each week. Answers are saved as you go; when time runs out the round is submitted.</li>
          <li>• The round runs in full screen. Leaving full screen (Esc, switching tabs, reloading) annuls the attempt: 0 points, off the leaderboard, no retry that week.</li>
          <li>• Overall = R&amp;W + Math. Ties go to the faster time. A new week starts every Monday 00:00 UTC.</li>
        </ul>
      </details>

      {/* Leaderboard */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          {hub && (
            <div className="flex items-center gap-0.5 text-sm">
              <button
                type="button"
                onClick={() => setWeek(shiftWeek(hub.week, -1))}
                aria-label="Previous week"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
              >
                <Icon d={I.chevronL} className="h-4 w-4" />
              </button>
              <span className="min-w-28 text-center font-medium tabular-nums">{isCurrent ? "This week" : weekLabel(hub.week)}</span>
              <button
                type="button"
                onClick={() => setWeek(shiftWeek(hub.week, 1) >= hub.current ? null : shiftWeek(hub.week, 1))}
                disabled={isCurrent}
                aria-label="Next week"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30"
              >
                <Icon d={I.chevronR} className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex rounded-xl border border-line bg-surface-2/60 p-1" role="tablist" aria-label="Leaderboard">
          {(
            [
              ["overall", "Overall"],
              ["rw", "R&W"],
              ["math", "Math"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={board === id}
              onClick={() => setBoard(id)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${board === id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        {!b ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-lg bg-surface-2" />
            ))}
          </div>
        ) : b.total === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">No finished rounds {isCurrent ? "yet this week — be the first!" : "that week."}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                <th className="w-14 px-4 py-2.5 font-medium sm:px-5">#</th>
                <th className="px-2 py-2.5 font-medium">Student</th>
                <th className="px-2 py-2.5 text-right font-medium">Score</th>
                <th className="hidden px-2 py-2.5 text-right font-medium sm:table-cell">Correct</th>
                <th className="px-4 py-2.5 text-right font-medium sm:px-5">Time</th>
              </tr>
            </thead>
            <tbody>
              {b.top.map((r, i) => (
                <tr key={i} className={`border-b border-line last:border-b-0 ${r.me ? "bg-primary-soft/60" : ""}`}>
                  <td className="px-4 py-3 font-semibold tabular-nums sm:px-5">{r.rank <= 3 ? <span aria-label={`Rank ${r.rank}`}>{MEDAL[r.rank - 1]}</span> : r.rank}</td>
                  <td className="px-2 py-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-lg leading-none">{r.avatar}</span>
                      <span className="truncate font-medium">{r.name}</span>
                      {r.me && <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-ink uppercase">You</span>}
                      {board === "overall" && r.rounds < 2 && <span className="hidden shrink-0 text-xs text-muted sm:inline">1 round</span>}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right font-bold tabular-nums">{r.score}</td>
                  <td className="hidden px-2 py-3 text-right text-muted tabular-nums sm:table-cell">
                    {r.correct}/{ROUND_SIZE * (board === "overall" ? r.rounds : 1)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted tabular-nums sm:px-5">{fmtDuration(r.seconds)}</td>
                </tr>
              ))}
              {b.me && !b.top.some((r) => r.me) && (
                <tr className="border-t-2 border-line bg-primary-soft/60">
                  <td className="px-4 py-3 font-semibold tabular-nums sm:px-5">{b.me.rank}</td>
                  <td className="px-2 py-3">
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none">{b.me.avatar}</span>
                      <span className="truncate font-medium">{b.me.name}</span>
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-ink uppercase">You</span>
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right font-bold tabular-nums">{b.me.score}</td>
                  <td className="hidden px-2 py-3 text-right text-muted tabular-nums sm:table-cell">{b.me.correct}</td>
                  <td className="px-4 py-3 text-right text-muted tabular-nums sm:px-5">{fmtDuration(b.me.seconds)}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {gate && (
        <StartWarning round={gate} fullscreen={canFullscreen} busy={starting !== null} onCancel={() => setGate(null)} onStart={() => startGated(gate)} />
      )}

      {b && b.total > 0 && (
        <p className="mt-2 text-sm text-muted tabular-nums">
          {b.total} participant{b.total === 1 ? "" : "s"}
          {isCurrent && b.total < 5 && (b.me ? " · You're early — the board fills up as the week goes on." : " · The board fills up as the week goes on.")}
        </p>
      )}
    </div>
  );
}
