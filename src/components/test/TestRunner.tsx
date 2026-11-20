"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorDock } from "@/components/CalculatorDock";
import { useFocusMode } from "@/lib/focus";
import { showToast } from "@/lib/toast";
import { I, Icon } from "@/components/bank/icons";
import { addAttempts, addTestResult, saveTestSession, useHydrated, useTestResults, useTestSession, type TestResult, type TestSession } from "@/lib/store";
import { MODULE_INFO, testName, type ModuleId, type PracticeTest, type TestQuestion } from "@/lib/test-types";
import { isTestCorrect, scaledScore } from "@/lib/test-score";
import type { ChoiceLetter } from "@/lib/types";
import type { SectionId } from "@/lib/taxonomy";
import { TestQuestionView } from "./TestQuestionView";
import { QuestionStrip } from "./QuestionStrip";
import { TestResults } from "./TestResults";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:opacity-40";
const btnGhost = "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent";
const iconBtn = "grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface transition-colors hover:bg-surface-2 disabled:opacity-40";

const fmtClock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

type Parts = "full" | SectionId;

/** Computes the scores for a finished (or abandoned) session. */
function scoreSession(test: PracticeTest, s: TestSession): Omit<TestResult, "id" | "at"> {
  const sections = [...new Set(s.modules.map((m) => MODULE_INFO[m as ModuleId].section))];
  const raw: { rw?: number; math?: number } = {};
  const scaled: { rw?: number; math?: number } = {};
  for (const sec of sections) {
    const qs = s.modules.filter((m) => MODULE_INFO[m as ModuleId].section === sec).flatMap((m) => test.modules[m as ModuleId] ?? []);
    raw[sec] = qs.filter((q) => isTestCorrect(q, s.responses[q.key])).length;
    scaled[sec] = scaledScore(sec, raw[sec]!, qs.length);
  }
  const kind = sections.length === 2 ? "full" : sections[0];
  return {
    testId: test.id,
    title: test.title,
    kind,
    rw: scaled.rw ?? 0,
    math: scaled.math ?? 0,
    total: (scaled.rw ?? 0) + (scaled.math ?? 0),
    raw,
    responses: s.responses,
  };
}

export function TestRunner({ test }: { test: PracticeTest }) {
  const hydrated = useHydrated();
  const session = useTestSession();
  const results = useTestResults();
  const router = useRouter();
  const params = useSearchParams();
  const resultId = params.get("result");
  const mine = session?.testId === test.id ? session : null;

  if (!hydrated) return <div className="mx-auto max-w-5xl px-4 py-10 text-muted md:px-8">Loading test…</div>;

  if (resultId) {
    const r = results.find((x) => x.id === resultId);
    if (r) return <TestResults test={test} result={r} />;
  }
  if (!mine) return <Intro test={test} other={session && session.testId !== test.id ? session : null} />;
  return (
    <Session
      key={`${mine.startedAt}-${mine.module}`}
      test={test}
      s={mine}
      onFinish={(s) => {
        const id = `${test.id}-${s.startedAt}`;
        const at = Date.now();
        addTestResult({ id, at, ...scoreSession(test, s) });
        // Answered questions also count toward the dashboard stats (accuracy, topics, streak).
        addAttempts(
          s.modules
            .flatMap((m) => test.modules[m as ModuleId] ?? [])
            .filter((q) => s.responses[q.key])
            .map((q) => ({
              qid: `${test.id}:${q.key}`,
              section: q.section,
              domain: q.domain,
              skill: q.skill,
              difficulty: q.difficulty ?? "medium",
              correct: isTestCorrect(q, s.responses[q.key]),
              at,
            })),
        );
        saveTestSession(null);
        router.replace(`/test/${test.id}?result=${id}`);
      }}
    />
  );
}

/* ---------------- intro ---------------- */

function Intro({ test, other }: { test: PracticeTest; other: TestSession | null }) {
  const full = test.sections.length === 2;
  const [parts, setParts] = useState<Parts>(full ? "full" : test.sections[0]);
  const results = useTestResults().filter((r) => r.testId === test.id);
  const modules = (Object.keys(MODULE_INFO) as ModuleId[]).filter((m) => test.modules[m]?.length && (parts === "full" || MODULE_INFO[m].section === parts));
  const minutes = modules.reduce((n, m) => n + MODULE_INFO[m].minutes, 0);
  const questions = modules.reduce((n, m) => n + (test.modules[m]?.length ?? 0), 0);

  const start = () =>
    saveTestSession({ testId: test.id, modules, module: 0, endsAt: null, responses: {}, marked: [], startedAt: Date.now() });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/test" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <Icon d={I.chevronL} className="h-4 w-4" /> All practice tests
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{testName(test)}</h1>
      <p className="mt-2 text-muted">
        Past-paper practice test{full ? "" : " (Reading and Writing only)"}. Timed like the real Digital SAT, with a scaled score at the end.
      </p>

      {full && (
        <fieldset className="mt-8">
          <legend className="text-sm font-semibold">What do you want to take?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(
              [
                ["full", "Full test", "R&W + Math"],
                ["rw", "Reading and Writing", "2 modules"],
                ["math", "Math", "2 modules"],
              ] as const
            ).map(([v, label, sub]) => (
              <label
                key={v}
                className={`cursor-pointer rounded-xl border px-4 py-3 transition-colors ${parts === v ? "border-primary bg-primary-soft ring-1 ring-primary" : "border-line bg-surface hover:bg-surface-2"}`}
              >
                <input type="radio" name="parts" value={v} checked={parts === v} onChange={() => setParts(v)} className="sr-only" />
                <span className="block font-semibold">{label}</span>
                <span className="text-sm text-muted">{sub}</span>
              </label>
            ))}
          </div>
          {parts !== "full" && <p className="mt-2 text-xs text-muted">Only full tests count toward the score trend on your dashboard.</p>}
        </fieldset>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        {modules.map((m) => (
          <div key={m} className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 last:border-b-0">
            <span className="font-medium">{MODULE_INFO[m].label}</span>
            <span className="text-sm text-muted tabular-nums">
              {test.modules[m]?.length} questions · {MODULE_INFO[m].minutes} min
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 bg-surface-2/60 px-5 py-3.5 text-sm">
          <span className="font-semibold">Total</span>
          <span className="tabular-nums">
            {questions} questions · {Math.floor(minutes / 60)} h {minutes % 60} min
          </span>
        </div>
      </div>

      <ul className="mt-6 space-y-1.5 text-sm text-muted">
        <li>• Each module has its own timer; when time runs out the module is submitted.</li>
        <li>• You can move between questions and mark them for review within a module, but not go back to a finished module.</li>
        {(parts === "full" || parts === "math") && <li>• Math modules have the Desmos graphing calculator, like the real test.</li>}
        <li>• Your progress is saved in this browser, so you can reload the page without losing answers.</li>
      </ul>

      {other && (
        <p className="mt-6 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
          You have another test in progress ({other.testId}). Starting this one will discard it.
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={start} className={`${btnPrimary} min-w-44`}>
          <Icon d={I.play} className="h-4 w-4" filled />
          Start {parts === "full" ? "test" : parts === "rw" ? "Reading and Writing" : "Math"}
        </button>
        {results.length > 0 && (
          <Link href={`/test/${test.id}?result=${results[results.length - 1].id}`} className={btnGhost}>
            Review your last attempt ({results[results.length - 1].total})
          </Link>
        )}
      </div>
    </div>
  );
}

/* ---------------- a module in progress ---------------- */

function Session({ test, s, onFinish }: { test: PracticeTest; s: TestSession; onFinish: (s: TestSession) => void }) {
  useFocusMode();
  const router = useRouter();
  const moduleId = s.modules[s.module] as ModuleId;
  const info = MODULE_INFO[moduleId];
  const qs = useMemo(() => test.modules[moduleId] ?? [], [test, moduleId]);
  const [pos, setPos] = useState(0);
  const [checking, setChecking] = useState(false);
  const [struck, setStruck] = useState<Record<string, ChoiceLetter[]>>({});
  const [showTimer, setShowTimer] = useState(true);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const submitted = useRef(false);

  const isLast = s.module === s.modules.length - 1;
  const nextSection = !isLast && MODULE_INFO[s.modules[s.module + 1] as ModuleId].section !== info.section;
  const left = s.endsAt === null ? (s.paused ?? info.minutes * 60_000) : s.endsAt - now;

  const update = (patch: Partial<TestSession>) => saveTestSession({ ...s, ...patch });

  /** Save and go Home: answers are already saved; a running module's clock pauses with the time left. */
  const saveAndExit = () => {
    if (s.endsAt !== null) update({ endsAt: null, paused: Math.max(1000, s.endsAt - Date.now()) });
    showToast("Progress saved", "Continue your test any time from Practice Test.");
    router.push("/");
  };

  const submit = () => {
    if (submitted.current) return;
    submitted.current = true;
    if (isLast) onFinish(s);
    else update({ module: s.module + 1, endsAt: null });
  };

  const respond = (key: string, r: string) => {
    const responses = { ...s.responses };
    if (r) responses[key] = r;
    else delete responses[key];
    update({ responses });
    setStruck((m) => (m[key]?.includes(r as ChoiceLetter) ? { ...m, [key]: m[key].filter((x) => x !== r) } : m));
  };
  const strike = (key: string, l: ChoiceLetter) => {
    setStruck((m) => {
      const cur = m[key] ?? [];
      return { ...m, [key]: cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l] };
    });
    if (s.responses[key] === l) respond(key, "");
  };
  const toggleMark = (key: string) => update({ marked: s.marked.includes(key) ? s.marked.filter((k) => k !== key) : [...s.marked, key] });

  // Timer.
  useEffect(() => {
    if (s.endsAt === null) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [s.endsAt]);
  useEffect(() => {
    if (s.endsAt !== null && left <= 0) submit();
  });

  // Keyboard: A–D choose, Shift+A–D cross out, ← → move.
  useEffect(() => {
    if (s.endsAt === null || checking) return;
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
        if (e.shiftKey) strike(q.key, l);
        else respond(q.key, l);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });


  // Ready screen before each module (and the break between sections).
  if (s.endsAt === null) {
    const afterBreak = s.module > 0 && MODULE_INFO[s.modules[s.module - 1] as ModuleId].section !== info.section;
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-content-center px-4 py-10 text-center">
        <p className="text-sm font-semibold text-primary-strong">
          {testName(test, true)} · Module {s.module + 1} of {s.modules.length}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{info.label}</h1>
        <p className="mt-3 text-muted">
          {s.paused !== undefined ? (
            <>
              Paused with <span className="font-semibold text-ink tabular-nums">{fmtClock(s.paused)}</span> left. Your answers are saved; the timer runs again when you continue.
            </>
          ) : (
            <>
              {qs.length} questions · {info.minutes} minutes. The timer starts when you press Start.
            </>
          )}
        </p>
        {afterBreak && s.paused === undefined && <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm">On the real test you&apos;d get a 10-minute break here. Take one if you like — the clock is paused.</p>}
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={() => update({ endsAt: Date.now() + (s.paused ?? info.minutes * 60_000), paused: undefined })} className={`${btnPrimary} min-w-40`} autoFocus>
            {s.paused !== undefined ? "Continue" : "Start"}
          </button>
          <button type="button" onClick={saveAndExit} className={btnGhost}>
            <Icon d={I.home} className="h-4 w-4" />
            Save &amp; exit
          </button>
        </div>
        <QuitButton />
      </div>
    );
  }

  const answered = qs.filter((q) => s.responses[q.key]).length;
  const q = qs[pos];
  const isMath = info.section === "math";
  const showCalc = isMath && calcOpen;
  const lowTime = left < 5 * 60_000;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-bg/90 px-4 py-2.5 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" onClick={saveAndExit} title="Pause the timer, save and go to Home" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink">
            <Icon d={I.home} className="h-4 w-4" />
            <span className="hidden sm:inline">Save &amp; exit</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{info.label}</p>
            <p className="truncate text-xs text-muted">{testName(test, true)}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowTimer((v) => !v)}
            title={showTimer ? "Hide timer" : "Show timer"}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-sm font-semibold tabular-nums transition-colors ${
              lowTime ? "border-danger/50 bg-danger-soft text-danger" : "border-line bg-surface hover:bg-surface-2"
            }`}
          >
            <Icon d={I.clock} className="h-4 w-4" />
            {showTimer || lowTime ? fmtClock(left) : <span className="font-sans text-muted">Show</span>}
          </button>
          {isMath && (
            <button
              type="button"
              onClick={() => {
                setCalcUsed(true);
                setCalcOpen((v) => !v);
              }}
              aria-pressed={calcOpen}
              title="Desmos calculator"
              className={`${iconBtn} ${calcOpen ? "border-primary text-primary-strong" : "text-muted"}`}
            >
              <Icon d={I.calculator} className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
        {/* Question switcher: hover a segment for its number and difficulty */}
        <QuestionStrip
          items={qs.map((x) => ({ key: x.key, difficulty: x.difficulty, answered: Boolean(s.responses[x.key]), marked: s.marked.includes(x.key) }))}
          pos={checking ? null : pos}
          onPick={(i) => {
            setPos(i);
            setChecking(false);
          }}
        />
      </div>

      <CalculatorDock used={isMath && calcUsed} open={showCalc} onClose={() => setCalcOpen(false)} stickyClass="lg:top-20" fullHeight="calc(100vh - 7rem)">
        <div>
          {checking ? (
            <CheckYourWork
              qs={qs}
              s={s}
              onPick={(i) => {
                setPos(i);
                setChecking(false);
              }}
              onSubmit={submit}
              submitLabel={isLast ? "Finish test" : nextSection ? "Submit and go to Math" : "Submit module"}
            />
          ) : (
            q && (
              <>
                <div className="mt-5 mb-3 flex items-center gap-3">
                  <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-ink px-2 text-sm font-bold text-bg tabular-nums">{pos + 1}</span>
                  <button
                    type="button"
                    onClick={() => toggleMark(q.key)}
                    aria-pressed={s.marked.includes(q.key)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition-colors ${s.marked.includes(q.key) ? "text-primary-strong" : "text-muted hover:text-ink"}`}
                  >
                    <Icon d={I.flag} className="h-4 w-4" filled={s.marked.includes(q.key)} />
                    {s.marked.includes(q.key) ? "Marked for review" : "Mark for review"}
                  </button>
                </div>
                <TestQuestionView
                  key={q.key}
                  q={q}
                  response={s.responses[q.key]}
                  struck={struck[q.key]}
                  onRespond={(r) => respond(q.key, r)}
                  onStrike={(l) => strike(q.key, l)}
                />
              </>
            )
          )}

          {/* Bottom bar */}
          <div className="qc-actions sticky bottom-0 z-10 -mx-4 mt-6 border-t border-line bg-bg/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
            <div className="flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
              <Navigator qs={qs} s={s} pos={checking ? -1 : pos} answered={answered} onPick={(i) => { setPos(i); setChecking(false); }} onCheck={() => setChecking(true)} />
              <div className="flex-1" />
              {!checking && (
                <>
                  <button type="button" onClick={() => setPos((p) => p - 1)} disabled={pos === 0} className={btnGhost}>
                    <Icon d={I.chevronL} className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => (pos < qs.length - 1 ? setPos(pos + 1) : setChecking(true))}
                    className={`${btnPrimary} min-w-28 px-5`}
                  >
                    {pos < qs.length - 1 ? "Next" : "Review"}
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

/** Two-step "quit" (no browser dialog). */
function QuitButton() {
  const [sure, setSure] = useState(false);
  return sure ? (
    <p className="mt-6 text-xs text-muted">
      Discard your answers and quit?{" "}
      <button type="button" onClick={() => saveTestSession(null)} className="font-semibold text-danger hover:underline">
        Yes, quit
      </button>{" "}
      ·{" "}
      <button type="button" onClick={() => setSure(false)} className="font-semibold hover:underline">
        Keep going
      </button>
    </p>
  ) : (
    <button type="button" onClick={() => setSure(true)} className="mx-auto mt-6 text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
      Quit this test
    </button>
  );
}

function cell(answered: boolean, marked: boolean, current: boolean) {
  return `relative grid h-10 place-items-center rounded-lg border text-sm font-semibold tabular-nums transition-colors ${
    answered ? "border-primary/50 bg-primary-soft text-primary-strong" : "border-dashed border-muted/50 bg-surface text-muted hover:border-muted hover:text-ink"
  } ${current ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : ""} ${marked ? "after:absolute after:-top-1 after:-right-1 after:h-2.5 after:w-2.5 after:rounded-full after:bg-accent" : ""}`;
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-primary/50 bg-primary-soft" /> Answered</span>
      <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-dashed border-muted/50" /> Unanswered</span>
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> For review</span>
    </div>
  );
}

/** "Question 5 of 27" button → popover grid of the module. */
function Navigator({ qs, s, pos, answered, onPick, onCheck }: { qs: TestQuestion[]; s: TestSession; pos: number; answered: number; onPick: (i: number) => void; onCheck: () => void }) {
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
        className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-sm font-semibold tabular-nums transition-colors hover:bg-surface-2"
      >
        {pos >= 0 ? `Question ${pos + 1} of ${qs.length}` : `${answered} of ${qs.length} answered`}
        <Icon d={I.chevronD} className={`h-4 w-4 text-muted transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open && (
        <div role="dialog" aria-label="Questions" className="absolute bottom-full left-0 z-40 mb-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Questions</p>
            <p className="text-xs text-muted tabular-nums">{answered}/{qs.length} answered</p>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-7">
            {qs.map((q, i) => (
              <button
                key={q.key}
                type="button"
                onClick={() => {
                  onPick(i);
                  setOpen(false);
                }}
                aria-label={`Question ${i + 1}${s.responses[q.key] ? ", answered" : ""}${s.marked.includes(q.key) ? ", marked for review" : ""}`}
                className={cell(Boolean(s.responses[q.key]), s.marked.includes(q.key), i === pos)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <Legend />
          </div>
          <button
            type="button"
            onClick={() => {
              onCheck();
              setOpen(false);
            }}
            className="mt-4 w-full rounded-xl border border-line py-2.5 text-sm font-semibold hover:bg-surface-2"
          >
            Go to review page
          </button>
        </div>
      )}
    </div>
  );
}

function CheckYourWork({ qs, s, onPick, onSubmit, submitLabel }: { qs: TestQuestion[]; s: TestSession; onPick: (i: number) => void; onSubmit: () => void; submitLabel: string }) {
  const unanswered = qs.filter((q) => !s.responses[q.key]).length;
  const marked = qs.filter((q) => s.marked.includes(q.key)).length;
  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-line bg-surface p-5 sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight">Check your work</h2>
      <p className="mt-2 text-sm text-muted">
        Pick a question to go back to it. Once you submit, you can&apos;t return to this module.
        {unanswered > 0 && <span className="font-medium text-ink"> {unanswered} unanswered.</span>}
        {marked > 0 && <span className="font-medium text-ink"> {marked} marked for review.</span>}
      </p>
      <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-9">
        {qs.map((q, i) => (
          <button key={q.key} type="button" onClick={() => onPick(i)} className={cell(Boolean(s.responses[q.key]), s.marked.includes(q.key), false)}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Legend />
      </div>
      <button type="button" onClick={onSubmit} className={`${btnPrimary} mt-8 w-full sm:w-auto`}>
        {submitLabel}
      </button>
    </div>
  );
}
