"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addAttempt, toggleBookmark } from "@/lib/store";
import { SECTIONS, getDomain } from "@/lib/taxonomy";
import { SOURCES } from "@/lib/sources";
import type { Difficulty } from "@/lib/types";
import { DifficultyBadge, QuestionCard } from "./QuestionCard";
import { cachedQuestion, fetchQuestions, skillName, type BankItem } from "./data";
import { I, Icon } from "./icons";

export interface Run {
  ids: string[];
  items: Map<string, BankItem>;
  title: string;
  start: number;
}

interface Answer {
  response: string;
  correct: boolean;
  /** Seconds spent before checking. */
  secs: number;
}

const fmtTime = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);

const iconBtn = "grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface transition-colors hover:bg-surface-2 disabled:opacity-40";

function cellStyle(r: Answer | undefined, current: boolean) {
  const base = r === undefined ? "border-line bg-surface text-muted hover:border-muted hover:text-ink" : r.correct ? "border-success/60 bg-success-soft text-success" : "border-danger/60 bg-danger-soft text-danger";
  return `${base} ${current ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : ""}`;
}

/** Popover grid of every question in the set. */
function Navigator({ ids, session, bookmarks, pos, go }: { ids: string[]; session: Record<string, Answer>; bookmarks: Set<string>; pos: number; go: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-semibold tabular-nums transition-colors hover:bg-surface-2"
      >
        <Icon d={I.grid} className="h-4 w-4 text-muted" />
        {pos + 1}
        <span className="font-medium text-muted">/ {ids.length}</span>
        <Icon d={I.chevronD} className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="dialog" aria-label="All questions" className="absolute top-full right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Questions</p>
            <p className="text-xs text-muted tabular-nums">
              {Object.keys(session).length} of {ids.length} answered
            </p>
          </div>
          <div className="mt-3 grid max-h-72 grid-cols-7 gap-1.5 overflow-y-auto p-1">
            {ids.map((x, i) => (
              <button
                key={x}
                type="button"
                onClick={() => {
                  go(i);
                  setOpen(false);
                }}
                aria-current={i === pos ? "step" : undefined}
                aria-label={`Question ${i + 1}${session[x] ? (session[x].correct ? ", correct" : ", incorrect") : ""}${bookmarks.has(x) ? ", bookmarked" : ""}`}
                className={`relative h-9 rounded-lg border text-xs font-semibold tabular-nums transition-colors ${cellStyle(session[x], i === pos)}`}
              >
                {i + 1}
                {bookmarks.has(x) && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-success" /> Correct
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-danger" /> Incorrect
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border border-line" /> Unanswered
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Bookmarked
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90" aria-hidden="true">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--primary)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)} className="transition-[stroke-dashoffset] duration-700" />
    </svg>
  );
}

function Summary({
  run,
  session,
  onReview,
  onRestart,
  onExit,
}: {
  run: Run;
  session: Record<string, Answer>;
  onReview: (i: number) => void;
  onRestart: (ids: string[], title: string) => void;
  onExit: () => void;
}) {
  const answers = Object.values(session);
  const answered = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const wrong = run.ids.filter((x) => session[x]?.correct === false);
  const skipped = run.ids.length - answered;
  const secs = answers.reduce((n, a) => n + a.secs, 0);
  const acc = answered ? correct / answered : 0;
  const all = run.ids.map((id, i) => ({ id, i }));
  const listed = run.ids.length <= 60 ? all : all.filter(({ id }) => session[id]);
  const headline = !answered ? "No questions answered" : acc >= 0.85 ? "Excellent work!" : acc >= 0.6 ? "Nice progress" : "Keep practicing";

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <button type="button" onClick={onExit} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
        <Icon d={I.chevronL} className="h-4 w-4" /> Question Bank
      </button>

      <div className="mt-4 rounded-3xl border border-line bg-surface p-6 text-center md:p-10">
        <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">{run.title}</p>
        <div className="relative mx-auto mt-5 h-40 w-40">
          <ScoreRing value={acc} />
          <div className="absolute inset-0 grid place-content-center">
            <p className="text-4xl font-bold tracking-tight tabular-nums">{answered ? `${Math.round(acc * 100)}%` : "—"}</p>
            <p className="text-xs text-muted">accuracy</p>
          </div>
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">{headline}</h2>
        <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Correct", value: correct, cls: "text-success" },
            { label: "Incorrect", value: wrong.length, cls: "text-danger" },
            { label: "Unanswered", value: skipped, cls: "text-muted" },
            { label: "Time", value: fmtTime(secs), cls: "" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-surface-2/60 px-3 py-3">
              <p className={`text-xl font-bold tabular-nums ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {wrong.length > 0 && (
            <button
              type="button"
              onClick={() => onRestart(wrong, `Review mistakes · ${wrong.length}`)}
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
            >
              Retry {wrong.length} {wrong.length === 1 ? "mistake" : "mistakes"}
            </button>
          )}
          <button type="button" onClick={onExit} className="rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2">
            Back to Question Bank
          </button>
          <Link href="/" className="rounded-xl px-5 py-3 font-semibold text-muted transition-colors hover:text-ink">
            View progress
          </Link>
        </div>
      </div>

      {/* Per-question review (big browse sets: only the questions you answered) */}
      {listed.length > 0 && (
        <>
          <h3 className="mt-10 text-sm font-semibold">{listed.length === run.ids.length ? "Questions in this set" : "Questions you answered"}</h3>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {listed.map(({ id, i }) => {
              const a = session[id];
              const it = run.items.get(id);
              return (
                <li key={id}>
                  <button type="button" onClick={() => onReview(i)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2/50 sm:px-5">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums ${
                        !a ? "border border-line text-muted" : a.correct ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                      }`}
                    >
                      {!a ? i + 1 : <Icon d={a.correct ? I.check : I.x} className="h-3.5 w-3.5" strokeWidth={2.6} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{it ? skillName(it) : id}</span>
                      <span className="text-xs text-muted">
                        #{it?.n} · {a ? (a.correct ? "Correct" : `Your answer: ${a.response}`) : "Skipped"}
                      </span>
                    </span>
                    {it && (
                      <span className="hidden sm:block">
                        <DifficultyBadge d={it.difficulty as Difficulty} />
                      </span>
                    )}
                    {a && <span className="w-12 text-right text-xs text-muted tabular-nums">{fmtTime(a.secs)}</span>}
                    <Icon d={I.chevronR} className="h-4 w-4 shrink-0 text-muted" />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

export function SolveView({
  run,
  results,
  bookmarks,
  onExit,
  onRestart,
}: {
  run: Run;
  results: Map<string, boolean>;
  bookmarks: Set<string>;
  onExit: () => void;
  onRestart: (ids: string[], title: string) => void;
}) {
  const [pos, setPos] = useState(run.start);
  const [session, setSession] = useState<Record<string, Answer>>({});
  const [finished, setFinished] = useState(false);
  const [, setLoaded] = useState(0); // bump to re-render when questions arrive
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  // Timing: ms spent per question before it was answered, plus when the current one was opened.
  const [spent, setSpent] = useState<Record<string, number>>({});
  const [enteredAt, setEnteredAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  // Results from before this session, so "previously answered" doesn't change as you answer now.
  const [prior] = useState(() => new Map(results));

  const total = run.ids.length;
  const id = run.ids[pos];
  const q = cachedQuestion(id);
  const meta = run.items.get(id);
  const answer = session[id];

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load the current question and prefetch the next few.
  useEffect(() => {
    let alive = true;
    fetchQuestions(run.ids.slice(pos, pos + 5)).then(
      () => alive && setLoaded((n) => n + 1),
      (e: Error) => alive && setError(e.message),
    );
    return () => {
      alive = false;
    };
  }, [pos, run.ids, retry]);

  /** Adds the time on the current question (if still unanswered) and restarts the clock. */
  const flushTime = () => {
    const t = Date.now();
    if (!session[id]) setSpent((s) => ({ ...s, [id]: (s[id] ?? 0) + (t - enteredAt) }));
    setEnteredAt(t);
    setNow(t);
  };

  const go = (i: number) => {
    if (i < 0 || i >= total) return;
    flushTime();
    setPos(i);
    setError(null);
    setFinished(false);
    window.scrollTo({ top: 0 });
  };
  const finish = () => {
    flushTime();
    setFinished(true);
    window.scrollTo({ top: 0 });
  };
  const next = () => (pos + 1 < total ? go(pos + 1) : finish());

  // ← / → move between questions (when not typing).
  useEffect(() => {
    if (finished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "ArrowRight") go(pos + 1);
      if (e.key === "ArrowLeft") go(pos - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (finished) return <Summary run={run} session={session} onReview={go} onRestart={onRestart} onExit={onExit} />;

  const answeredCount = Object.keys(session).length;
  const correctCount = Object.values(session).filter((a) => a.correct).length;
  const marked = bookmarks.has(id);
  const was = prior.get(id);
  const secs = answer ? answer.secs : Math.floor(((spent[id] ?? 0) + Math.max(0, now - enteredAt)) / 1000);
  const wide = meta?.section !== "math";

  return (
    <section className={`mx-auto px-4 md:px-8 ${wide ? "max-w-7xl" : "max-w-4xl"}`}>
      {/* Toolbar */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-bg/90 px-4 pt-3 backdrop-blur md:-mx-8 md:px-8 lg:top-0 lg:pr-20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" onClick={onExit} className="inline-flex shrink-0 items-center gap-1 rounded-lg py-1.5 pr-2 pl-1 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
              <Icon d={I.chevronL} className="h-4 w-4" />
              <span className="hidden sm:inline">Question Bank</span>
            </button>
            <span className="hidden h-5 w-px bg-line md:block" aria-hidden="true" />
            <span className="hidden truncate text-sm font-semibold md:block">{run.title}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowTimer((v) => !v)}
              title={showTimer ? "Hide timer" : "Show timer"}
              aria-label={showTimer ? `Time on this question ${fmtTime(secs)}. Hide timer` : "Show timer"}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium tabular-nums transition-colors hover:bg-surface-2 ${answer ? "text-muted" : "text-ink"}`}
            >
              <Icon d={I.clock} className="h-4 w-4 text-muted" />
              {showTimer ? fmtTime(secs) : <span className="text-muted">Show</span>}
            </button>
            <button
              type="button"
              onClick={() => toggleBookmark(id)}
              aria-pressed={marked}
              aria-label={marked ? "Remove bookmark" : "Bookmark this question"}
              title={marked ? "Remove bookmark" : "Bookmark"}
              className={`${iconBtn} ${marked ? "text-accent" : "text-muted"}`}
            >
              <Icon d={I.star} className="h-4.5 w-4.5" filled={marked} />
            </button>
            <Navigator ids={run.ids} session={session} bookmarks={bookmarks} pos={pos} go={go} />
            <button type="button" onClick={finish} className="ml-0.5 h-9 rounded-lg bg-ink px-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85">
              Finish
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 pb-3">
          {total <= 60 ? (
            <div className="flex gap-1" aria-hidden="true">
              {run.ids.map((x, i) => {
                const a = session[x];
                return (
                  <button
                    key={x}
                    type="button"
                    tabIndex={-1}
                    onClick={() => go(i)}
                    title={`Question ${i + 1}`}
                    className="group flex h-3 flex-1 items-center"
                  >
                    <span
                      className={`block w-full rounded-full transition-all ${i === pos ? "h-2" : "h-1 group-hover:h-1.5"} ${
                        a ? (a.correct ? "bg-success" : "bg-danger") : i === pos ? "bg-primary" : "bg-line"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${((pos + 1) / total) * 100}%` }} />
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      {meta && (
        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-muted">
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-semibold text-ink">{SECTIONS[meta.section].short}</span>
          <span className="rounded-md border border-line px-2 py-0.5 font-medium">{SOURCES[meta.source].name}</span>
          <span>{getDomain(meta.domain)?.name}</span>
          <Icon d={I.chevronR} className="h-3 w-3" />
          <span className="font-medium text-ink">{skillName(meta)}</span>
          <DifficultyBadge d={meta.difficulty as Difficulty} />
          <span className="font-mono">#{meta.n}</span>
          {was !== undefined && !answer && (
            <span className={`rounded-full px-2 py-0.5 font-medium ${was ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}>
              Previously {was ? "correct" : "incorrect"}
            </span>
          )}
          {answeredCount > 0 && (
            <span className="ml-auto tabular-nums">
              Score: <span className="font-semibold text-ink">{correctCount}</span>/{answeredCount}
            </span>
          )}
        </div>
      )}

      <div className="mt-4">
        {error ? (
          <div className="rounded-2xl border border-danger/40 bg-danger-soft p-6 text-sm">
            Couldn&apos;t load this question ({error}).{" "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setRetry((n) => n + 1);
              }}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : !q ? (
          <div className={`grid gap-0 overflow-hidden rounded-2xl border border-line bg-surface ${wide ? "lg:grid-cols-2" : ""}`} aria-label="Loading question">
            {[0, 1].slice(0, wide ? 2 : 1).map((k) => (
              <div key={k} className="space-y-3 p-8">
                {[92, 100, 85, 96, 60].map((w, i) => (
                  <div key={i} className="h-3.5 animate-pulse rounded bg-surface-2" style={{ width: `${w}%` }} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <QuestionCard
            key={q.id}
            q={q}
            saved={answer}
            timeSpent={answer?.secs}
            nextLabel={pos + 1 < total ? "Next" : "See results"}
            onNext={next}
            onPrev={pos > 0 ? () => go(pos - 1) : undefined}
            onAnswered={(ok, response) => {
              const t = Date.now();
              const s = Math.round(((spent[q.id] ?? 0) + (t - enteredAt)) / 1000);
              setSession((m) => (q.id in m ? m : { ...m, [q.id]: { response, correct: ok, secs: s } }));
              addAttempt({ qid: q.id, section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty, correct: ok, at: t });
            }}
          />
        )}
      </div>
      <p className="mt-2 mb-6 hidden text-center text-xs text-muted md:block">
        <Kbd>A</Kbd>–<Kbd>D</Kbd> choose · <Kbd>Shift</Kbd>+<Kbd>A</Kbd> cross out · <Kbd>Enter</Kbd> check / next · <Kbd>←</Kbd> <Kbd>→</Kbd> move
      </p>
    </section>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="mx-0.5 rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px]">{children}</kbd>;
}
