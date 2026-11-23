"use client";

import { Fragment, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { DataTable, DifficultyBadge, ChoiceRow, Figure, type ChoiceState } from "@/components/bank/QuestionCard";
import { I, Icon } from "@/components/bank/icons";
import { RichText } from "@/components/RichText";
import { isCorrect } from "@/lib/answers";
import { gradeTyped, parseEntry, type Task } from "@/lib/lesson-format";
import type { ChoiceLetter, Question } from "@/lib/types";
import { DesmosDemo } from "../DesmosDemo";
import { Lines } from "../Example";
import { inline, Markdown } from "../Markdown";
import { balanceUnderline, locate, paragraphs, pieces, type Piece } from "./highlight";
import { btnPrimary, btnSoft, LessonIsland, NavArrows, Pane, PopIsland, TIGHT } from "./Shell";

const LETTERS: ChoiceLetter[] = ["A", "B", "C", "D"];
const HINT_FIRST_MS = 350;
const HINT_GAP_MS = 1200;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** One text of the task (passage or prompt) with its key phrases marked; a mark lights up when its hint is shown. */
function Marked({ list, own, math, shown }: { list: Piece[]; own: boolean; math: boolean; shown: number }) {
  const paras = paragraphs(own ? list : balanceUnderline(list));
  const body = (para: Piece[]) =>
    para.map((p, i) => {
      const content = own ? <Lines text={p.text} /> : <RichText text={p.text} math={math} />;
      if (p.mark === undefined) return <Fragment key={i}>{content}</Fragment>;
      const on = p.mark < shown;
      // A plain span until its hint is lit, then a <mark> (screen readers don't announce unlit phrases as highlights).
      if (!on)
        return (
          <span key={i} className="v2-mark">
            {content}
          </span>
        );
      return (
        <mark key={i} className="v2-mark" data-on="" data-new={p.mark === shown - 1 ? "" : undefined}>
          {content}
          {!p.cont && (
            <span className="v2-mark-n" aria-hidden="true">
              {p.mark + 1}
            </span>
          )}
        </mark>
      );
    });
  if (paras.length <= 1) return <span>{paras[0] ? body(paras[0]) : null}</span>;
  return (
    <div className="space-y-3">
      {paras.map((para, i) => (
        <p key={i}>{body(para)}</p>
      ))}
    </div>
  );
}

/** A choice of an own question (the bank's choices use QuestionCard's ChoiceRow). */
function OwnChoice({ letter, state, shake, onSelect, children }: { letter: ChoiceLetter; state: ChoiceState; shake: boolean; onSelect: () => void; children: ReactNode }) {
  const box = {
    idle: "border-line bg-surface hover:border-primary/50 hover:bg-primary-soft/40",
    selected: "border-primary bg-primary-soft ring-1 ring-primary",
    correct: "border-success bg-success-soft ring-1 ring-success",
    wrong: "border-danger bg-danger-soft ring-1 ring-danger",
    dim: "border-line bg-surface opacity-60",
  }[state];
  const badge = {
    idle: "border-line text-muted group-hover:border-primary/60 group-hover:text-primary-strong",
    selected: "border-primary bg-primary text-primary-ink",
    correct: "border-success bg-success text-surface",
    wrong: "border-danger bg-danger text-surface",
    dim: "border-line text-muted",
  }[state];
  const locked = state === "correct" || state === "wrong" || state === "dim";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={state === "selected" || state === "correct"}
      disabled={locked}
      onClick={onSelect}
      className={`group flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-[background-color,border-color,opacity] sm:gap-3.5 sm:px-4 ${box} ${shake ? "lesson-shake" : ""}`}
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.5px] text-sm font-semibold transition-colors ${badge} ${state === "correct" ? "lesson-pop" : ""}`}>
        {state === "correct" ? <Icon d={I.check} className="h-4 w-4" strokeWidth={2.8} /> : state === "wrong" ? <Icon d={I.x} className="h-4 w-4" strokeWidth={2.8} /> : letter}
      </span>
      <span className="min-w-0 flex-1 text-[15px] leading-relaxed">{children}</span>
    </button>
  );
}

export interface TaskResult {
  /** The first answer was right (this is what counts as correct for the attempt log and the score). */
  ok: boolean;
  /** "right": solved. "shown": the explanation was opened with "Still confused?" before a right answer. */
  how: "right" | "shown";
}

/**
 * An Easy / Medium / Hard task screen. Wrong #1: that choice's feedback, try again. Wrong #2: the key phrases light up
 * in the prompt one after another (each with its note under it) while the student can still answer; after the last one
 * "Still confused?" opens the full explanation and marks the answer. A right answer ends the task; "See why" opens the
 * same explanation. Mount with a key per task (the state starts fresh).
 */
export function TaskScreen({
  task,
  question,
  resolved,
  tried,
  onTried,
  onResolved,
  onBack,
  onNext,
  nextLabel,
}: {
  task: Task;
  /** The bank question of a bank task (undefined when it is missing from the bank). */
  question?: Question;
  /** The saved result when the task was finished before. */
  resolved: TaskResult | null;
  /** Whether the first answer of this pass was right (undefined: not answered yet). Saved, so leaving and coming back can't redo it. */
  tried: boolean | undefined;
  /** The first check of the task in this pass: log the attempt. */
  onTried: (correct: boolean) => void;
  onResolved: (r: TaskResult) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  const own = task.kind === "own" ? task.question : null;
  const bank = task.kind === "bank" ? question : undefined;
  const math = bank ? bank.section === "math" : true;
  const typed = own ? own.answers.length > 0 : bank?.type === "spr";
  const choiceCount = own ? own.options.length : bank?.type === "mcq" ? 4 : 0;
  const id = useId();
  const field = useRef<HTMLInputElement>(null);
  const explainButton = useRef<HTMLButtonElement>(null);

  const [sel, setSel] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [missed, setMissed] = useState<number[]>([]);
  const [struck, setStruck] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<string | null>(null);
  const [shownHints, setShownHints] = useState(0);
  const [solved, setSolved] = useState(resolved?.how === "right");
  const [revealed, setRevealed] = useState(resolved?.how === "shown");
  const [explain, setExplain] = useState(resolved?.how === "shown");
  const [first, setFirst] = useState<boolean | undefined>(tried);
  const finished = solved || revealed;

  // The prompt (and the passage) as stored, and where the key phrases sit in them.
  const texts = useMemo(() => (own ? [own.prompt] : bank ? (bank.passage ? [bank.passage, bank.prompt] : [bank.prompt]) : []), [own, bank]);
  const located = useMemo(() => locate(texts, task.highlights), [texts, task.highlights]);
  const total = located.placements.length;
  useEffect(() => {
    if (located.problems.length) console.warn(`Lesson task (${task.kind === "bank" ? `bank ${task.id}` : "own"}, ${task.level}): ${located.problems.join("; ")}`);
  }, [located, task]);

  // A bank question missing at runtime must not block the lesson: the task counts as finished.
  const missing = !own && !bank;
  const gaveUp = useRef(false);
  useEffect(() => {
    if (missing && !resolved && !gaveUp.current) {
      gaveUp.current = true;
      onResolved({ ok: false, how: "shown" });
    }
  });

  // Hints start with the 2nd wrong answer and show one by one (all at once with reduced motion).
  const hintsOn = wrong >= 2 && !finished;
  useEffect(() => {
    if (!hintsOn || shownHints >= total) return;
    // Reduced motion: every hint at once (still from a timer, not synchronously in the effect).
    const all = reducedMotion();
    const t = setTimeout(() => setShownHints(all ? total : (n) => n + 1), all ? 0 : shownHints === 0 ? HINT_FIRST_MS : HINT_GAP_MS);
    return () => clearTimeout(t);
  }, [hintsOn, shownHints, total]);
  const allHints = shownHints >= total;

  // Typed answer: the cursor goes into the field (physical keyboards only), again after a miss empties it.
  useEffect(() => {
    if (typed && !finished && window.matchMedia("(pointer: fine)").matches) field.current?.focus({ preventScroll: true });
  }, [typed, finished, wrong]);

  const finish = (how: "right" | "shown", firstOk: boolean) => {
    if (how === "right") setSolved(true);
    else setRevealed(true);
    onResolved({ ok: firstOk && how === "right", how });
  };

  const check = () => {
    if (finished) return;
    let ok: boolean;
    let feedback: string | undefined;
    if (typed) {
      const entry = text.trim();
      if (!entry) return;
      if (own) {
        const g = gradeTyped(own, entry);
        if (g.kind === "invalid") return setInvalid(g.hint);
        ok = g.kind === "right";
        feedback = g.kind === "wrong" ? g.feedback : undefined;
      } else if (bank) {
        const e = parseEntry(entry);
        if (e.kind === "mixed") return setInvalid("The SAT doesn't take mixed numbers like 4 1/4. Enter an improper fraction (17/4) or a decimal (4.25).");
        if (e.kind === "bad") return setInvalid("Enter a number, a fraction like 3/4, or a decimal like 0.75.");
        ok = isCorrect(bank, entry);
      } else return;
    } else {
      if (sel === null) return;
      if (own) {
        ok = Boolean(own.options[sel]?.correct);
        feedback = own.options[sel]?.feedback;
      } else if (bank) ok = LETTERS[sel] === bank.answer;
      else return;
    }
    setInvalid(null);
    const firstOk = first ?? ok;
    if (first === undefined) {
      setFirst(ok);
      onTried(ok);
    }
    if (ok) {
      setNote(null);
      return finish("right", firstOk);
    }
    setWrong((n) => n + 1);
    setNote(feedback ?? "");
    if (typed) setText("");
    else {
      setMissed((m) => [...m, sel as number]);
      setSel(null);
    }
  };

  const pick = (i: number) => {
    if (finished || missed.includes(i)) return;
    setSel(i);
    setStruck((s) => s.filter((x) => x !== i));
  };
  const strike = (i: number) => {
    setStruck((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
    if (sel === i) setSel(null);
  };

  const confused = () => {
    setExplain(true);
    if (!finished) finish("shown", first === true);
  };

  // Keyboard: A–D / 1–4 choose, Enter checks (and, once finished, goes on).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as Element | null)?.closest?.("[data-calculator], [data-reference]")) return;
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;
      if (e.key === "Enter") {
        const t = e.target as HTMLElement | null;
        // After a click on a choice the focus is on that button: Enter still checks (not on the cross-out buttons).
        const onChoice = t instanceof HTMLButtonElement && !finished && Boolean(t.closest("[data-choices]")) && !t.hasAttribute("aria-label");
        if (!onChoice && (t instanceof HTMLButtonElement || t instanceof HTMLAnchorElement || (typing && !t?.dataset.answer))) return;
        e.preventDefault();
        if (finished) onNext();
        else check();
        return;
      }
      if (!typing && !finished && !typed && !e.shiftKey) {
        const k = e.key.toUpperCase();
        const i = "ABCD".indexOf(k) >= 0 ? "ABCD".indexOf(k) : "1234".indexOf(k);
        if (i >= 0 && i < choiceCount) pick(i);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!own && !bank) {
    return (
      <LessonIsland
        left={<p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">This question isn&apos;t available right now.</p>}
        main={<p className="text-muted">Continue to the next screen.</p>}
        nav={<NavArrows onBack={onBack} onNext={onNext} nextLabel={nextLabel} primary />}
        split="50"
      />
    );
  }

  /* ---------- the question (left) ---------- */
  const body = (i: number) => <Marked list={pieces(texts, i, located.placements)} own={Boolean(own)} math={math} shown={shownHints} />;
  const promptIndex = texts.length - 1;
  const left = (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <DifficultyBadge d={task.level} />
        {bank && <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary-strong">Real SAT question</span>}
      </div>
      <div className="mt-4 space-y-5">
        {bank?.passage &&
          (math ? (
            <div className="text-base leading-[1.75]">{body(0)}</div>
          ) : (
            <div className="rounded-xl bg-surface-2/60 px-4 py-3.5 text-base leading-[1.75]">{body(0)}</div>
          ))}
        {bank?.table && <DataTable table={bank.table} math={math} />}
        {bank?.figure && <Figure {...bank.figure} />}
        <div className={`leading-relaxed font-medium ${own ? "text-[17px]" : "text-base"}`}>{body(promptIndex)}</div>
      </div>

      {/* The notes of the hints shown so far, numbered like the marks. Always rendered (empty until the first hint) so screen readers announce them as they appear. */}
      <ol className={shownHints > 0 ? "mt-5 space-y-2" : undefined} aria-label="Hints" aria-live="polite">
          {located.placements.slice(0, shownHints).map((p, i) => (
              <li key={i} className="lesson-in flex items-start gap-2.5 rounded-xl bg-accent-soft/60 px-3 py-2 text-[15px] leading-snug">
                <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-bold text-primary-ink tabular-nums">{i + 1}</span>
                <span className="min-w-0">{inline(task.highlights[p.highlight].note)}</span>
              </li>
            ))}
      </ol>
    </div>
  );

  /* ---------- the answer (right) ---------- */
  const rightIndex = own ? own.options.findIndex((o) => o.correct) : bank?.type === "mcq" ? LETTERS.indexOf(bank.answer) : -1;
  const correctText = own ? (typed ? own.answers.map((a) => a.replace(/^-/, "−")).join(" or ") : LETTERS[rightIndex]) : bank ? (bank.type === "mcq" ? bank.answer : bank.answer.join(" or ")) : "";

  const choiceState = (i: number): ChoiceState => {
    if (finished) return i === rightIndex ? "correct" : "dim";
    if (missed.includes(i)) return "wrong";
    return i === sel ? "selected" : "idle";
  };

  const answerArea = typed ? (
    <div>
      <label htmlFor={`${id}-answer`} className="text-sm font-semibold">
        Your answer
      </label>
      <input
        id={`${id}-answer`}
        ref={field}
        data-answer="1"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        value={finished ? correctText : text}
        disabled={finished}
        maxLength={9}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={`${id}-note`}
        onChange={(e) => {
          setText(e.target.value);
          setInvalid(null);
        }}
        placeholder="e.g. 12, 3.5, -3/4"
        className={`mt-2 block w-full max-w-56 rounded-xl border-[1.5px] px-4 py-3 font-mono text-xl outline-none transition-shadow focus:border-primary focus:ring-3 focus:ring-primary/15 ${
          finished ? "border-success bg-success-soft" : "border-line bg-surface"
        }`}
      />
      {!finished && <p className="mt-2 text-xs text-muted">Number, decimal or fraction. Negative answers are allowed.</p>}
    </div>
  ) : (
    <div className="space-y-2.5" data-choices="" role={own ? "radiogroup" : undefined} aria-label="Answer choices">
      {bank?.type === "mcq" && bank.choicesImage && <Figure src={bank.choicesImage} caption="Answer choices" />}
      {Array.from({ length: choiceCount }, (_, i) =>
        bank?.type === "mcq" ? (
          <ChoiceRow key={i} letter={LETTERS[i]} text={bank.choices[LETTERS[i]]} image={bank.choiceImages?.[LETTERS[i]]} state={choiceState(i)} math={math} struck={struck.includes(i)} onSelect={() => pick(i)} onStrike={() => strike(i)} />
        ) : (
          <OwnChoice key={i} letter={LETTERS[i]} state={choiceState(i)} shake={missed.includes(i) && !finished} onSelect={() => pick(i)}>
            {inline(own!.options[i].text)}
          </OwnChoice>
        ),
      )}
    </div>
  );

  const hintLine = wrong >= 2 && !finished;
  const right = (
    <div>
      {answerArea}

      {!finished && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={check} disabled={typed ? !text.trim() : sel === null} className={`${btnPrimary} min-w-36`}>
            Check
          </button>
          <span className="hidden text-xs text-muted sm:inline">{typed ? "Enter to check" : "A–D to choose, Enter to check"}</span>
        </div>
      )}

      <div id={`${id}-note`} aria-live="polite">
        {!finished && wrong > 0 && (
          <div className="lesson-in mt-5 flex items-start gap-3 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3" key={wrong}>
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-danger text-surface">
              <Icon d={I.x} className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <div className="min-w-0 text-[15px] leading-relaxed">
              <p className="font-semibold text-danger">{wrong === 1 ? "Not quite. Try once more." : total > 0 ? "Not quite. Look at the highlighted words." : "Not quite."}</p>
              {note && <p className="mt-0.5 font-medium text-ink">{inline(note)}</p>}
            </div>
          </div>
        )}
        {!finished && invalid && (
          <div className="lesson-in mt-3 flex items-start gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-surface">
              <Icon d={I.undo} className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className="min-w-0 text-[15px] leading-relaxed font-medium text-ink">{invalid}</p>
          </div>
        )}
      </div>

      {/* After the 2nd wrong answer: more hints, then "Still confused?". */}
      {hintLine && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {shownHints < total && (
            <button type="button" onClick={() => setShownHints((n) => Math.min(total, n + 1))} className={btnSoft}>
              Next hint
              <span className="text-xs text-muted tabular-nums">
                {shownHints}/{total}
              </span>
            </button>
          )}
          {allHints && (
            <button type="button" ref={explainButton} onClick={confused} className={`${btnSoft} lesson-in`}>
              Still confused?
            </button>
          )}
        </div>
      )}

      {finished && (
        <div className={`lesson-in mt-5 overflow-hidden rounded-xl border ${solved ? "border-success/40" : "border-primary/30"}`} role="status">
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 ${solved ? "bg-success-soft" : "bg-primary-soft/60"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-surface ${solved ? "bg-success" : "bg-primary"}`}>
              <Icon d={solved ? I.check : I.eye} className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className={`font-semibold ${solved ? "text-success" : "text-primary-strong"}`}>{solved ? "Correct!" : `The answer is ${correctText}`}</p>
            <button
              type="button"
              ref={explainButton}
              onClick={() => setExplain((v) => !v)}
              aria-expanded={explain}
              aria-controls={`${id}-explain`}
              className={`${btnSoft} ml-auto`}
            >
              {solved ? "See why" : "Explanation"}
            </button>
          </div>
        </div>
      )}

      <PopIsland id={`${id}-explain`} open={explain} title="Explanation" tone="primary" onClose={() => setExplain(false)} returnTo={explainButton}>
        <p className="text-sm font-semibold text-ink">
          Correct answer: <span className="rounded-md bg-success-soft px-1.5 py-0.5 font-mono text-success">{correctText}</span>
        </p>
        <div className={`mt-3 text-[15px] ${TIGHT}`}>
          <Markdown source={task.explain} />
        </div>
        {explain && own && own.desmos.length > 0 && (
          <div className="mt-4">
            <DesmosDemo moves={own.desmos} label="Faster in Desmos" />
          </div>
        )}
      </PopIsland>
    </div>
  );

  return <LessonIsland left={<Pane label="Question">{left}</Pane>} main={<Pane label="Answer">{right}</Pane>} nav={<NavArrows onBack={onBack} onNext={onNext} nextLabel={nextLabel} primary={finished} />} split="50" />;
}
