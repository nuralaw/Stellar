"use client";

import { useEffect, useRef, useState } from "react";
import { CalculatorDock } from "@/components/CalculatorDock";
import { useFocusMode } from "@/lib/focus";
import { exitFullscreen } from "@/lib/fullscreen";
import { I, Icon } from "@/components/bank/icons";
import { TestQuestionView } from "@/components/test/TestQuestionView";
import { QuestionStrip } from "@/components/test/QuestionStrip";
import { ROUNDS, ROUND_SIZE, type CompetitionQuestion, type ReviewItem, type RoundId } from "@/lib/competition";
import type { TestQuestion } from "@/lib/test-types";
import type { ChoiceLetter, Difficulty } from "@/lib/types";

export interface RoundData {
  week: string;
  round: RoundId;
  now: number;
  startedAt: number;
  endsAt: number;
  questions: CompetitionQuestion[];
  responses: Record<string, string>;
  result?: RoundResult;
  review?: ReviewItem[];
}

export interface RoundResult {
  score: number;
  base: number;
  bonus: number;
  correct: Record<Difficulty, number>;
  seconds: number;
  /** Left full screen mid-round: 0 points, off the leaderboard. */
  annulled?: boolean;
}

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:opacity-40";
const btnGhost = "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent";

const fmtClock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
export const fmtDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

const DIFF_LABEL: Record<Difficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

/** Bank question → the shape the test question view renders. */
function toView(q: CompetitionQuestion, i: number, r?: ReviewItem): TestQuestion {
  return {
    key: q.id,
    section: q.section,
    module: 1,
    n: i + 1,
    type: q.type,
    passage: q.passage,
    prompt: q.prompt,
    table: q.table,
    figure: q.figure ? { src: q.figure.src, w: 0, h: 0 } : undefined,
    choices: q.choices,
    choiceImages: q.choiceImages,
    choicesImage: q.choicesImage,
    answer: r ? (r.answer as TestQuestion["answer"]) : q.type === "mcq" ? ("" as ChoiceLetter) : [],
    domain: "",
    skill: "",
    difficulty: q.difficulty,
    explanation: r?.explanation,
  };
}

const draftKey = (d: RoundData) => `stellar:compete:${d.week}:${d.round}`;

async function post(path: string, body: unknown) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

export const WARN_ICON = "M12 3 2 20h20L12 3Zm0 6v5m0 3h.01";

/**
 * A round in progress: answer, autosave, submit. Calls onDone with the graded round.
 * One sitting, in full screen: leaving full screen (or, where full screen isn't available, leaving the page) annuls
 * the attempt. onExit runs if that annul can't reach the server (the hub annuls it on the next load anyway).
 */
export function CompeteRound({ data, userId, onDone, onExit }: { data: RoundData; userId: string; onDone: (d: RoundData) => void; onExit: () => void }) {
  useFocusMode();
  // Where the browser has no full screen (iPhone Safari), the rule is "don't leave the page" instead.
  const [fsRule] = useState(() => typeof document !== "undefined" && document.fullscreenEnabled);
  const qs = data.questions;
  // Server clock offset so the timer matches the server's deadline.
  const [skew] = useState(() => data.now - Date.now());
  const [responses, setResponses] = useState<Record<string, string>>(() => {
    try {
      return { ...data.responses, ...JSON.parse(localStorage.getItem(draftKey(data)) ?? "{}") };
    } catch {
      return data.responses;
    }
  });
  const [pos, setPos] = useState(0);
  const [checking, setChecking] = useState(false);
  const [struck, setStruck] = useState<Record<string, ChoiceLetter[]>>({});
  const [now, setNow] = useState(() => Date.now() + skew);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const submitted = useRef(false);
  const left = data.endsAt - now;
  const isMath = data.round === "math";

  // Timer.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() + skew), 500);
    return () => clearInterval(t);
  }, [skew]);

  // Keep a local draft and autosave to the server (debounced).
  useEffect(() => {
    try {
      localStorage.setItem(draftKey(data), JSON.stringify(responses));
    } catch {}
    const t = setTimeout(() => {
      post("/api/competition/save", { week: data.week, round: data.round, userId, responses }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [responses, data, userId]);

  const submit = async () => {
    if (submitted.current) return;
    submitted.current = true;
    setSending(true);
    setError(null);
    try {
      const r = await post("/api/competition/submit", { week: data.week, round: data.round, userId, responses });
      try {
        localStorage.removeItem(draftKey(data));
      } catch {}
      exitFullscreen(); // submitted.current is set, so this doesn't count as leaving
      onDone({ ...data, responses, result: r.result, review: r.review });
    } catch (e) {
      submitted.current = false;
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  // Leaving full screen (or the page) before submitting annuls the attempt.
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const body = JSON.stringify({ week: data.week, round: data.round, userId });
    const leave = async () => {
      if (submitted.current) return;
      submitted.current = true;
      setLeaving(true);
      try {
        localStorage.removeItem(draftKey(data));
      } catch {}
      try {
        const r = await post("/api/competition/annul", JSON.parse(body));
        onDone({ ...data, responses, result: r.result, review: r.review });
      } catch {
        onExit();
      }
    };
    const onFullscreen = () => !document.fullscreenElement && leave();
    const onVisibility = () => document.visibilityState === "hidden" && leave();
    // Reload / close / navigate away: the request has to survive the page going away.
    const onPageHide = () => {
      if (submitted.current) return;
      submitted.current = true;
      navigator.sendBeacon?.("/api/competition/annul", new Blob([body], { type: "application/json" }));
    };
    if (fsRule) document.addEventListener("fullscreenchange", onFullscreen);
    else document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  });

  // Time's up → submit.
  useEffect(() => {
    if (left <= 0 && !submitted.current) submit();
  });

  const respond = (id: string, r: string) => {
    setResponses((m) => {
      const n = { ...m };
      if (r) n[id] = r;
      else delete n[id];
      return n;
    });
    setStruck((m) => (m[id]?.includes(r as ChoiceLetter) ? { ...m, [id]: m[id].filter((x) => x !== r) } : m));
  };
  const strike = (id: string, l: ChoiceLetter) => {
    setStruck((m) => {
      const cur = m[id] ?? [];
      return { ...m, [id]: cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l] };
    });
    if (responses[id] === l) respond(id, "");
  };

  // Keyboard: A–D choose, Shift+A–D cross out, ← → move.
  useEffect(() => {
    if (checking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-calculator]") || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
      const q = qs[pos];
      if (e.key === "ArrowRight") setPos((p) => Math.min(qs.length - 1, p + 1));
      else if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 1));
      else if (q?.type === "mcq") {
        const l = e.key.toUpperCase() as ChoiceLetter;
        if (!["A", "B", "C", "D"].includes(l)) return;
        if (e.shiftKey) strike(q.id, l);
        else respond(q.id, l);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const answered = qs.filter((q) => responses[q.id]).length;
  const q = qs[pos];
  const lowTime = left < 5 * 60_000;
  const cell = (i: number) => {
    const done = Boolean(responses[qs[i].id]);
    return `grid h-10 place-items-center rounded-lg border text-sm font-semibold tabular-nums transition-colors ${
      done ? "border-primary/50 bg-primary-soft text-primary" : "border-dashed border-muted/50 bg-surface text-muted hover:text-ink"
    } ${i === pos && !checking ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : ""}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-bg/90 px-4 py-2.5 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{ROUNDS[data.round].name} round</p>
            <p className="truncate text-xs text-muted tabular-nums">
              {answered}/{qs.length} answered · {q ? DIFF_LABEL[q.difficulty] : ""}
            </p>
          </div>
          <span
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-danger/40 bg-danger-soft px-2.5 text-xs font-semibold text-danger"
            title={fsRule ? "Leaving full screen annuls this attempt" : "Leaving this page annuls this attempt"}
          >
            <Icon d={WARN_ICON} className="h-4 w-4" strokeWidth={2} />
            <span className="hidden md:inline">{fsRule ? "Stay in full screen" : "Stay on this page"}</span>
          </span>
          <span
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-sm font-semibold tabular-nums ${lowTime ? "border-danger/50 bg-danger-soft text-danger" : "border-line bg-surface"}`}
            aria-label="Time left"
          >
            <Icon d={I.clock} className="h-4 w-4" />
            {fmtClock(left)}
          </span>
          {isMath && (
            <button
              type="button"
              onClick={() => {
                setCalcUsed(true);
                setCalcOpen((v) => !v);
              }}
              aria-pressed={calcOpen}
              title="Desmos calculator"
              className={`grid h-9 w-9 place-items-center rounded-lg border bg-surface transition-colors hover:bg-surface-2 ${calcOpen ? "border-primary text-primary" : "border-line text-muted"}`}
            >
              <Icon d={I.calculator} className="h-4.5 w-4.5" />
            </button>
          )}
          <button type="button" onClick={() => setChecking(true)} className="h-9 rounded-lg bg-ink px-3 text-sm font-semibold text-bg hover:opacity-85">
            Submit
          </button>
        </div>
        {/* Question switcher: hover a segment for its number and difficulty */}
        <QuestionStrip
          items={qs.map((x) => ({ key: x.id, difficulty: x.difficulty, answered: Boolean(responses[x.id]) }))}
          pos={checking ? null : pos}
          onPick={(i) => {
            setPos(i);
            setChecking(false);
          }}
        />
      </div>

      {leaving && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg/80 px-4 backdrop-blur" role="alertdialog" aria-live="assertive">
          <div className="max-w-sm rounded-2xl border border-danger/40 bg-surface p-6 text-center shadow-2xl">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
              <Icon d={WARN_ICON} className="h-6 w-6" strokeWidth={2} />
            </span>
            <p className="mt-3 font-semibold">{fsRule ? "You left full screen" : "You left the page"}</p>
            <p className="mt-1 text-sm text-muted">This attempt is being annulled…</p>
          </div>
        </div>
      )}

      <CalculatorDock used={isMath && calcUsed} open={isMath && calcOpen} onClose={() => setCalcOpen(false)} stickyClass="lg:top-24" fullHeight="calc(100vh - 7.5rem)">
        <div>
          {checking ? (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-line bg-surface p-5 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight">Submit your round?</h2>
              <p className="mt-2 text-sm text-muted">
                {qs.length - answered > 0 ? (
                  <>
                    <span className="font-semibold text-ink">{qs.length - answered} unanswered.</span> Unanswered questions score 0.{" "}
                  </>
                ) : (
                  "Everything is answered. "
                )}
                Finishing earlier gives a bigger speed bonus. You can&apos;t change answers after submitting.
              </p>
              <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-10">
                {qs.map((x, i) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => {
                      setPos(i);
                      setChecking(false);
                    }}
                    className={cell(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {error && <p className="mt-4 text-sm text-danger">Couldn&apos;t submit: {error}. Your answers are saved — try again.</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={submit} disabled={sending} className={btnPrimary}>
                  {sending ? "Submitting…" : "Submit round"}
                </button>
                <button type="button" onClick={() => setChecking(false)} className={btnGhost}>
                  Keep working
                </button>
              </div>
            </div>
          ) : (
            q && (
              <>
                <div className="mt-5 mb-3 flex items-center gap-3">
                  <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-ink px-2 text-sm font-bold text-bg tabular-nums">{pos + 1}</span>
                  <span className="text-sm text-muted">{DIFF_LABEL[q.difficulty]}</span>
                </div>
                <TestQuestionView key={q.id} q={toView(q, pos)} response={responses[q.id]} struck={struck[q.id]} onRespond={(r) => respond(q.id, r)} onStrike={(l) => strike(q.id, l)} />
              </>
            )
          )}

          <div className="qc-actions sticky bottom-0 z-10 -mx-4 mt-6 border-t border-line bg-bg/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
            <div className="flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
              <p className="hidden text-xs text-muted sm:block">One attempt · {fsRule ? "leaving full screen" : "leaving this page"} annuls it</p>
              <div className="flex-1" />
              {!checking && (
                <>
                  <button type="button" onClick={() => setPos((p) => p - 1)} disabled={pos === 0} className={btnGhost}>
                    Back
                  </button>
                  <button type="button" onClick={() => (pos < qs.length - 1 ? setPos(pos + 1) : setChecking(true))} className={`${btnPrimary} min-w-28 px-5`}>
                    {pos < qs.length - 1 ? "Next" : "Finish"}
                    <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </CalculatorDock>
    </section>
  );
}

/** Score card + answer review of a finished round. */
export function RoundReview({ data, rank, onBack }: { data: RoundData; rank?: number; onBack: () => void }) {
  const r = data.result!;
  const byId = new Map((data.review ?? []).map((x) => [x.id, x]));
  const [open, setOpen] = useState<string | null>(null);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const total = r.correct.easy + r.correct.medium + r.correct.hard;
  const shown = data.questions.filter((q) => !onlyWrong || !byId.get(q.id)?.correct);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <Icon d={I.chevronL} className="h-4 w-4" /> Leaderboard
      </button>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{ROUNDS[data.round].name} round</h1>
      {r.annulled && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-danger/40 bg-danger-soft px-5 py-4" role="alert">
          <Icon d={WARN_ICON} className="mt-0.5 h-5 w-5 shrink-0 text-danger" strokeWidth={2} />
          <div>
            <p className="font-semibold text-danger">Attempt annulled</p>
            <p className="mt-0.5 text-sm text-ink/80">
              You left full screen during the round, so it scores 0 and isn&apos;t on the leaderboard. Your one attempt for this week is used — the next round opens on
              Monday.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-muted">Score</p>
          <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums">{r.score}</p>
          <p className="mt-1 text-xs text-muted tabular-nums">
            {r.base} for answers + {r.bonus} speed bonus{rank ? ` · #${rank} this week` : ""}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-muted">Correct</p>
          <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">
            {total}
            <span className="text-lg font-medium text-muted">/{ROUND_SIZE}</span>
          </p>
          <p className="mt-1 text-xs text-muted tabular-nums">
            Easy {r.correct.easy} · Medium {r.correct.medium} · Hard {r.correct.hard}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-muted">Time</p>
          <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">{fmtDuration(r.seconds)}</p>
          <p className="mt-1 text-xs text-muted">of {ROUNDS[data.round].minutes}:00</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Review</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          Only incorrect and unanswered
        </label>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
        {shown.length === 0 && <p className="px-5 py-4 text-sm text-muted">All correct 🎉</p>}
        {shown.map((q) => {
          const i = data.questions.indexOf(q);
          const rv = byId.get(q.id);
          const resp = data.responses[q.id];
          const isOpen = open === q.id;
          return (
            <div key={q.id} className="border-b border-line last:border-b-0">
              <button type="button" onClick={() => setOpen(isOpen ? null : q.id)} aria-expanded={isOpen} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 sm:px-5">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${rv?.correct ? "bg-[var(--chart-correct)]" : resp ? "bg-[var(--chart-wrong)]" : "bg-muted/60"}`}
                  aria-label={rv?.correct ? "Correct" : resp ? "Incorrect" : "Not answered"}
                >
                  <Icon d={rv?.correct ? I.check : I.x} className="h-3.5 w-3.5" strokeWidth={2.8} />
                </span>
                <span className="w-8 shrink-0 font-semibold tabular-nums">{i + 1}</span>
                <span className="w-16 shrink-0 text-sm text-muted">{DIFF_LABEL[q.difficulty]}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-muted">{(q.passage || q.prompt).replace(/<\/?u>/g, "")}</span>
                <Icon d={I.chevronD} className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="border-t border-line bg-bg p-3 sm:p-5">
                  <TestQuestionView q={toView(q, i, rv)} response={resp} review />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
