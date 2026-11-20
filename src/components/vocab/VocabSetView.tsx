"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { getVocab, setVocab, useHydrated, useVocab, type VocabState } from "@/lib/store";

export interface SetWord {
  id: string;
  word: string;
  pos: string;
  def: string;
  example: string;
  form: string;
  syn: string[];
  with?: string;
}

type Mode = "words" | "cards" | "quiz";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40";
const btnOutline = "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2";
const btnGhost = "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink";

const STATUS = [
  { label: "New", cls: "bg-surface-2 text-muted" },
  { label: "Learning", cls: "bg-accent-soft text-primary-strong" },
  { label: "Known", cls: "bg-success-soft text-success" },
] as const;

/** The example with the word's form highlighted. */
function Example({ w, blank = false }: { w: SetWord; blank?: boolean }) {
  const i = w.example.toLowerCase().indexOf(w.form.toLowerCase());
  if (i < 0) return <>{w.example}</>;
  return (
    <>
      {w.example.slice(0, i)}
      {blank ? (
        <span className="mx-0.5 inline-block w-20 border-b-2 border-primary align-baseline" aria-label="blank" />
      ) : (
        <strong className="font-semibold text-primary-strong">{w.example.slice(i, i + w.form.length)}</strong>
      )}
      {w.example.slice(i + w.form.length)}
    </>
  );
}

const name = (w: SetWord) => (w.with ? `${w.word} (${w.with})` : w.word);
const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export function VocabSetView({
  set,
  next,
  startMode,
}: {
  set: { id: string; title: string; list: string; words: SetWord[] };
  next: { id: string; title: string } | null;
  startMode: Mode;
}) {
  const hydrated = useHydrated();
  const v = useVocab();
  const [mode, setMode] = useState<Mode>(startMode);
  const [quizRun, setQuizRun] = useState(0);
  const [quizWords, setQuizWords] = useState<SetWord[] | null>(null);
  const words = set.words;
  const st = (id: string): VocabState["s"] => (hydrated ? (v[id]?.s ?? 0) : 0);
  const knownCount = words.filter((w) => st(w.id) === 2).length;

  const startQuiz = (only?: SetWord[]) => {
    setQuizWords(shuffle(only?.length ? only : words).slice(0, Math.min(10, (only?.length ? only : words).length)));
    setQuizRun((n) => n + 1);
    setMode("quiz");
  };

  return (
    <>
      {/* Header */}
      <Link href="/vocabulary" className="inline-flex items-center gap-1 rounded-lg py-1 pr-2 text-sm font-medium text-muted hover:text-ink">
        <Icon d={I.chevronL} className="h-4 w-4" />
        Vocabulary
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary-strong">{set.list}</p>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight md:text-4xl">{set.title}</h1>
          <div className="mt-3 flex w-72 max-w-full items-center gap-2.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(knownCount / words.length) * 100}%` }} />
            </div>
            <span className="text-xs font-medium text-muted tabular-nums">
              {knownCount} of {words.length} known
            </span>
          </div>
        </div>
        <div className="flex rounded-xl border border-line bg-surface-2/60 p-1" role="tablist" aria-label="Study mode">
          {(
            [
              ["words", "Words"],
              ["cards", "Flashcards"],
              ["quiz", "Quiz"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => (m === "quiz" ? startQuiz() : setMode(m))}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${mode === m ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {mode === "words" && <WordList words={words} st={st} onCards={() => setMode("cards")} onQuiz={() => startQuiz()} />}
        {mode === "cards" &&
          (hydrated ? (
            <Flashcards words={words} st={st} onQuiz={() => startQuiz()} onList={() => setMode("words")} />
          ) : (
            <div className="mx-auto h-80 max-w-xl animate-pulse rounded-3xl bg-surface-2" />
          ))}
        {mode === "quiz" && quizWords && <Quiz key={quizRun} words={quizWords} pool={words} onRetry={(missed) => startQuiz(missed)} onList={() => setMode("words")} next={next} />}
      </div>
    </>
  );
}

/* ---------------- Words ---------------- */

function WordList({ words, st, onCards, onQuiz }: { words: SetWord[]; st: (id: string) => VocabState["s"]; onCards: () => void; onQuiz: () => void }) {
  const allKnown = words.every((w) => st(w.id) === 2);
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={allKnown ? onQuiz : onCards} className={btnPrimary}>
          {allKnown ? "Quiz yourself" : "Study with flashcards"}
          <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <p className="text-sm text-muted">Tap a word&apos;s status to change it.</p>
      </div>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {words.map((w, i) => {
          const s = st(w.id);
          return (
            <li key={w.id} id={w.id} className="lesson-in scroll-mt-24 rounded-2xl bg-surface p-4 ring-1 ring-line target:ring-2 target:ring-primary sm:p-5" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <p>
                  <span className="text-lg font-bold">{name(w)}</span> <span className="text-sm text-muted">{w.pos}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setVocab(w.id, { s: ((s + 1) % 3) as VocabState["s"] })}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${STATUS[s].cls}`}
                  title="Change status"
                >
                  {STATUS[s].label}
                </button>
              </div>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{w.def}</p>
              <p className="mt-2 border-l-2 border-line pl-3 text-sm leading-relaxed text-muted italic">
                <Example w={w} />
              </p>
              {w.syn.length > 0 && <p className="mt-2 text-xs text-muted">≈ {w.syn.join(", ")}</p>}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ---------------- Flashcards ---------------- */

function Flashcards({ words, st, onQuiz, onList }: { words: SetWord[]; st: (id: string) => VocabState["s"]; onQuiz: () => void; onList: () => void }) {
  // Deck: words not known yet (learning first), or the whole set once everything is known.
  const [deck, setDeck] = useState<SetWord[]>(() => {
    const todo = words.filter((w) => st(w.id) !== 2).sort((a, b) => st(b.id) - st(a.id));
    return todo.length ? todo : words;
  });
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dir, setDir] = useState<"know" | "learn" | null>(null);
  const w = deck[i];

  const answer = (know: boolean) => {
    if (!w) return;
    setVocab(w.id, { s: know ? 2 : 1 });
    setDir(know ? "know" : "learn");
    setFlipped(false);
    setI((n) => n + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target instanceof HTMLInputElement) return;
      // preventDefault: a focused button (a mode tab, the card) must not also act on the key.
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        answer(true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        answer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!w) {
    const k = words.filter((x) => st(x.id) === 2).length;
    const learning = words.filter((x) => st(x.id) !== 2);
    return (
      <div className="lesson-in mx-auto max-w-md py-8 text-center">
        <span className="lesson-pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
          <Icon d={I.check} className="h-8 w-8" strokeWidth={2.6} />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">Deck done</h2>
        <p className="mt-2 text-muted tabular-nums">
          You know {k} of {words.length} words in this set.
        </p>
        <div className="mt-6 flex flex-col items-center gap-2">
          <button type="button" onClick={onQuiz} className={`${btnPrimary} w-full max-w-xs`}>
            Quiz yourself
          </button>
          {learning.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setDeck(learning);
                setI(0);
                setDir(null);
              }}
              className={btnGhost}
            >
              Go again: {learning.length} still learning
            </button>
          )}
          <button type="button" onClick={onList} className={btnGhost}>
            See all words
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(i / deck.length) * 100}%` }} />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">
          {i + 1} / {deck.length}
        </span>
      </div>

      {/* The card: tap or Space flips it */}
      <div key={w.id} className={`mt-6 perspective-[1400px] ${dir === "know" ? "cal-next" : dir === "learn" ? "cal-prev" : "lesson-in"}`}>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Show the word" : "Show the meaning"}
          className={`relative block h-80 w-full rounded-3xl text-left transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform-3d ${flipped ? "rotate-y-180" : ""}`}
        >
          <span className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-surface p-8 text-center shadow-[0_18px_50px_-24px_rgb(0_0_0/0.35)] ring-1 ring-line backface-hidden">
            <span className="text-4xl font-bold tracking-tight">{name(w)}</span>
            <span className="mt-2 text-sm text-muted">{w.pos}</span>
            <span className="absolute bottom-5 text-xs text-muted">Tap or press Space to flip</span>
          </span>
          <span className="absolute inset-0 flex rotate-y-180 flex-col justify-center rounded-3xl bg-surface p-7 shadow-[0_18px_50px_-24px_rgb(0_0_0/0.35)] ring-1 ring-primary/30 backface-hidden">
            <span className="text-xs font-semibold tracking-wide text-primary-strong uppercase">{name(w)}</span>
            <span className="mt-2 text-xl leading-snug font-semibold">{w.def}</span>
            <span className="mt-4 text-[15px] leading-relaxed text-muted">
              <Example w={w} />
            </span>
            {w.syn.length > 0 && <span className="mt-3 text-sm text-muted">≈ {w.syn.join(", ")}</span>}
          </span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => answer(false)} className={btnOutline}>
          <Icon d={I.chevronL} className="h-4 w-4" />
          Still learning
        </button>
        <button type="button" onClick={() => answer(true)} className={btnPrimary}>
          I know it
          <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Keys: Space flips · ← still learning · → I know it</p>
    </div>
  );
}

/* ---------------- Quiz ---------------- */

interface Q {
  w: SetWord;
  kind: "meaning" | "context";
  options: SetWord[];
}

function buildQuiz(words: SetWord[], pool: SetWord[]): Q[] {
  return words.map((w, n) => {
    const kind: Q["kind"] = n % 2 ? "context" : "meaning";
    const same = pool.filter((x) => x.id !== w.id && (kind === "meaning" || x.pos.split("/")[0] === w.pos.split("/")[0]));
    const others = shuffle(same.length >= 3 ? same : pool.filter((x) => x.id !== w.id)).slice(0, 3);
    return { w, kind, options: shuffle([w, ...others]) };
  });
}

function Quiz({ words, pool, onRetry, onList, next }: { words: SetWord[]; pool: SetWord[]; onRetry: (missed: SetWord[]) => void; onList: () => void; next: { id: string; title: string } | null }) {
  const [qs] = useState(() => buildQuiz(words, pool));
  const [n, setN] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [missed, setMissed] = useState<SetWord[]>([]);
  const q = qs[n];

  const choose = (k: number) => {
    if (pick !== null || !q) return;
    setPick(k);
    const ok = q.options[k].id === q.w.id;
    const cur = getVocab()[q.w.id];
    setVocab(q.w.id, ok ? { s: 2, r: (cur?.r ?? 0) + 1 } : { s: 1, w: (cur?.w ?? 0) + 1 });
    if (!ok) setMissed((m) => [...m, q.w]);
  };
  const go = () => {
    setPick(null);
    setN((x) => x + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "ABCD".indexOf(e.key.toUpperCase());
      if (k >= 0 && q && k < q.options.length && e.key.length === 1) choose(k);
      else if (e.key === "Enter" && pick !== null) {
        // preventDefault: a focused button (the Quiz tab, Next) must not also act on Enter.
        e.preventDefault();
        go();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!q) {
    const right = qs.length - missed.length;
    return (
      <div className="lesson-in mx-auto max-w-lg py-6 text-center">
        <p className="text-5xl font-bold tracking-tight tabular-nums">
          {right}
          <span className="text-2xl text-muted">/{qs.length}</span>
        </p>
        <p className="mt-2 text-muted">{missed.length ? "Review the ones you missed, then try them again." : "Perfect round."}</p>
        {missed.length > 0 && (
          <ul className="mt-6 space-y-2 text-left">
            {missed.map((w) => (
              <li key={w.id} className="rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
                <span className="font-semibold">{name(w)}</span> <span className="text-sm text-muted">{w.def}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-col items-center gap-2">
          {missed.length > 0 ? (
            <button type="button" onClick={() => onRetry(missed)} className={`${btnPrimary} w-full max-w-xs`}>
              Retry the {missed.length} missed
            </button>
          ) : next ? (
            <Link href={`/vocabulary/${next.id}`} className={`${btnPrimary} w-full max-w-xs`}>
              Next: {next.title}
            </Link>
          ) : null}
          <button type="button" onClick={() => onRetry([])} className={btnGhost}>
            New quiz
          </button>
          <button type="button" onClick={onList} className={btnGhost}>
            See all words
          </button>
        </div>
      </div>
    );
  }

  const right = q.options.findIndex((o) => o.id === q.w.id);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(n / qs.length) * 100}%` }} />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">
          {n + 1} / {qs.length}
        </span>
      </div>
      <div key={n} className="lesson-in mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        {q.kind === "meaning" ? (
          <>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">What does it mean?</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{name(q.w)}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Which word fits the blank?</p>
            <p className="mt-2 text-[17px] leading-relaxed font-medium">
              <Example w={q.w} blank={pick === null} />
            </p>
          </>
        )}
        <div className="mt-5 space-y-2.5">
          {q.options.map((o, k) => {
            const state = pick === null ? "idle" : k === right ? "correct" : k === pick ? "wrong" : "dim";
            const box = {
              idle: "border-line bg-surface hover:border-primary/50 hover:bg-primary-soft/40",
              correct: "border-success bg-success-soft ring-1 ring-success",
              wrong: "lesson-shake border-danger bg-danger-soft ring-1 ring-danger",
              dim: "border-line bg-surface opacity-60",
            }[state];
            return (
              <button
                key={o.id}
                type="button"
                disabled={pick !== null}
                onClick={() => choose(k)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-[background-color,border-color,opacity] sm:px-4 ${box}`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-[1.5px] text-xs font-semibold ${state === "correct" ? "lesson-pop border-success bg-success text-surface" : state === "wrong" ? "border-danger bg-danger text-surface" : "border-line text-muted"}`}>
                  {state === "correct" ? <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} /> : state === "wrong" ? <Icon d={I.x} className="h-3.5 w-3.5" strokeWidth={3} /> : "ABCD"[k]}
                </span>
                <span className="min-w-0 flex-1 text-[15px] leading-relaxed">{q.kind === "meaning" ? o.def : name(o)}</span>
              </button>
            );
          })}
        </div>
        {pick !== null && (
          <div className={`lesson-in mt-5 rounded-xl px-4 py-3 text-[15px] leading-relaxed ${pick === right ? "bg-success-soft" : "bg-danger-soft"}`} role="status">
            <p className={`font-semibold ${pick === right ? "text-success" : "text-danger"}`}>{pick === right ? "Correct!" : `It's “${name(q.w)}”`}</p>
            <p className="mt-1 text-ink">
              <span className="font-semibold">{name(q.w)}</span>: {q.w.def}
            </p>
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-end">
        <button type="button" onClick={go} disabled={pick === null} className={`${btnPrimary} min-w-36`}>
          {n === qs.length - 1 ? "See results" : "Next"}
          <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
