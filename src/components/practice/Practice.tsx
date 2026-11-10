"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { QUESTIONS } from "@/content/questions";
import { MathText } from "@/components/MathText";
import { isCorrect } from "@/lib/answers";
import { addAttempt } from "@/lib/store";
import { DOMAINS, SECTIONS, domainsFor, getDomain, type SectionId } from "@/lib/taxonomy";
import type { ChoiceLetter, Difficulty, Question } from "@/lib/types";

type DifficultyFilter = Difficulty | "all";
interface Filter {
  section: SectionId;
  domain: string; // domain id or "all"
  difficulty: DifficultyFilter;
}

const LETTERS: ChoiceLetter[] = ["A", "B", "C", "D"];
const DIFFICULTIES: DifficultyFilter[] = ["all", "easy", "medium", "hard"];

function matches(q: Question, f: Filter) {
  return q.section === f.section && (f.domain === "all" || q.domain === f.domain) && (f.difficulty === "all" || q.difficulty === f.difficulty);
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function skillName(q: Question) {
  return getDomain(q.domain)?.skills.find((s) => s.id === q.skill)?.name ?? q.skill;
}

function initialFilter(params: URLSearchParams): Filter {
  const section: SectionId = params.get("section") === "math" ? "math" : "rw";
  const d = params.get("domain");
  const domain = d && DOMAINS.some((x) => x.id === d && x.section === section) ? d : "all";
  const diff = params.get("difficulty") as DifficultyFilter | null;
  return { section, domain, difficulty: diff && DIFFICULTIES.includes(diff) ? diff : "all" };
}

// ---------- small UI pieces ----------

function Chip({ active, onClick, children, disabled }: { active: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-muted hover:border-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function DifficultyBadge({ d }: { d: Difficulty }) {
  const dots = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted capitalize">
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= dots ? "bg-accent" : "bg-line"}`} />
        ))}
      </span>
      {d}
    </span>
  );
}

// ---------- setup ----------

function Setup({ filter, setFilter, onStart }: { filter: Filter; setFilter: (f: Filter) => void; onStart: () => void }) {
  const count = (f: Filter) => QUESTIONS.filter((q) => matches(q, f)).length;
  const available = count(filter);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Practice</h1>
      <p className="mt-2 text-muted">Pick a section, a topic, and a difficulty. You&apos;ll get instant feedback and a full explanation for every question.</p>

      <h2 className="mt-10 text-sm font-semibold tracking-wider text-muted uppercase">Section</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {(["rw", "math"] as SectionId[]).map((s) => {
          const active = filter.section === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter({ section: s, domain: "all", difficulty: filter.difficulty })}
              aria-pressed={active}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                active ? "border-primary bg-primary-soft" : "border-line bg-surface hover:border-muted"
              }`}
            >
              <span className={`block font-semibold ${active ? "text-primary" : ""}`}>{SECTIONS[s].name}</span>
              <span className="mt-1 block text-sm text-muted">{count({ section: s, domain: "all", difficulty: "all" })} questions</span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-8 text-sm font-semibold tracking-wider text-muted uppercase">Topic</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={filter.domain === "all"} onClick={() => setFilter({ ...filter, domain: "all" })}>
          All topics
        </Chip>
        {domainsFor(filter.section).map((d) => (
          <Chip key={d.id} active={filter.domain === d.id} onClick={() => setFilter({ ...filter, domain: d.id })}>
            {d.name} <span className="opacity-60">· {count({ ...filter, domain: d.id, difficulty: "all" })}</span>
          </Chip>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold tracking-wider text-muted uppercase">Difficulty</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <Chip key={d} active={filter.difficulty === d} onClick={() => setFilter({ ...filter, difficulty: d })}>
            <span className="capitalize">{d === "all" ? "Any" : d}</span>
          </Chip>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onStart}
          disabled={available === 0}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start · {available} {available === 1 ? "question" : "questions"}
        </button>
        {available === 0 && <p className="text-sm text-muted">No questions for this combination yet — try another topic or difficulty.</p>}
      </div>
      <p className="mt-6 text-xs text-muted">New questions are added regularly. Tip: use keys A–D to choose and Enter to check.</p>
    </section>
  );
}

// ---------- question ----------

function DataTable({ table }: { table: NonNullable<Question["table"]> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {table.caption && <caption className="mb-2 text-left font-semibold">{table.caption}</caption>}
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="border border-line bg-surface-2 px-3 py-2 text-left font-semibold">
                <MathText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="border border-line px-3 py-2">
                  <MathText text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChoiceButton({
  letter,
  text,
  state,
  onSelect,
}: {
  letter: ChoiceLetter;
  text: string;
  state: "idle" | "selected" | "correct" | "wrong" | "dim";
  onSelect: () => void;
}) {
  const styles = {
    idle: "border-line bg-surface hover:border-muted",
    selected: "border-primary bg-primary-soft ring-1 ring-primary",
    correct: "border-success bg-success-soft",
    wrong: "border-danger bg-danger-soft",
    dim: "border-line bg-surface opacity-55",
  }[state];
  const badge = {
    idle: "border-line text-muted",
    selected: "border-primary bg-primary text-primary-ink",
    correct: "border-success bg-success text-surface",
    wrong: "border-danger bg-danger text-surface",
    dim: "border-line text-muted",
  }[state];
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={state === "correct" || state === "wrong" || state === "dim"}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${styles}`}
    >
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold ${badge}`}>{letter}</span>
      <span className="min-w-0 flex-1">
        <MathText text={text} />
      </span>
    </button>
  );
}

function QuestionView({
  q,
  position,
  total,
  session,
  response,
  setResponse,
  checked,
  onCheck,
  onNext,
  onExit,
}: {
  q: Question;
  position: number;
  total: number;
  session: { answered: number; correct: number };
  response: string;
  setResponse: (r: string) => void;
  checked: boolean;
  onCheck: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const correct = checked && isCorrect(q, response);
  const hasStimulus = Boolean(q.passage || q.table);

  const answerArea = (
    <div className="space-y-5">
      <div className="text-[15px] leading-relaxed font-medium">
        <MathText text={q.prompt} />
      </div>

      {q.type === "mcq" ? (
        <div className="space-y-2.5">
          {LETTERS.map((l) => {
            let state: "idle" | "selected" | "correct" | "wrong" | "dim" = response === l ? "selected" : "idle";
            if (checked) state = l === q.answer ? "correct" : response === l ? "wrong" : "dim";
            return <ChoiceButton key={l} letter={l} text={q.choices[l]} state={state} onSelect={() => setResponse(l)} />;
          })}
        </div>
      ) : (
        <div>
          <label htmlFor="spr" className="text-sm font-medium text-muted">
            Your answer
          </label>
          <input
            id="spr"
            inputMode="decimal"
            autoComplete="off"
            value={response}
            disabled={checked}
            onChange={(e) => setResponse(e.target.value.slice(0, 7))}
            placeholder="e.g. 12, 3.5, or 3/4"
            className={`mt-2 block w-48 rounded-xl border bg-surface px-4 py-3 font-mono text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
              checked ? (correct ? "border-success bg-success-soft" : "border-danger bg-danger-soft") : "border-line"
            }`}
          />
          <p className="mt-2 text-xs text-muted">Enter a number, decimal, or fraction. Negative answers are allowed.</p>
        </div>
      )}

      {!checked ? (
        <button
          type="button"
          onClick={onCheck}
          disabled={!response.trim()}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <div className="space-y-4">
          <div className={`rounded-2xl border p-5 ${correct ? "border-success/40 bg-success-soft" : "border-danger/40 bg-danger-soft"}`}>
            <p className={`font-semibold ${correct ? "text-success" : "text-danger"}`}>
              {correct
                ? "Correct!"
                : q.type === "mcq"
                  ? `Not quite — the correct answer is ${q.answer}.`
                  : `Not quite — the correct answer is ${q.answer[0]}.`}
            </p>
            <div className="mt-3 text-[15px] leading-relaxed">
              <MathText text={q.explanation} />
            </div>
          </div>
          <button
            type="button"
            onClick={onNext}
            autoFocus
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
          >
            {position === total ? "See results" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onExit} className="text-sm font-medium text-muted hover:text-ink">
          ← Change filters
        </button>
        <p className="text-sm text-muted tabular-nums">
          Question {position} of {total} · <span className="font-semibold text-ink">{session.correct}</span> correct
        </p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${((position - (checked ? 0 : 1)) / total) * 100}%` }} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="font-semibold text-ink">{SECTIONS[q.section].short}</span>
        <span>·</span>
        <span>{getDomain(q.domain)?.name}</span>
        <span>·</span>
        <span>{skillName(q)}</span>
        <DifficultyBadge d={q.difficulty} />
      </div>

      {hasStimulus ? (
        <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-0">
          <div className="space-y-5 rounded-2xl border border-line bg-surface p-6 text-[15px] leading-relaxed lg:rounded-r-none">
            {q.passage && <MathText text={q.passage} />}
            {q.passage2 && (
              <div className="border-t border-line pt-5">
                <MathText text={q.passage2} />
              </div>
            )}
            {q.table && <DataTable table={q.table} />}
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 lg:rounded-l-none lg:border-l-0">{answerArea}</div>
        </div>
      ) : (
        <div className="mt-5 max-w-3xl rounded-2xl border border-line bg-surface p-6">{answerArea}</div>
      )}
    </section>
  );
}

// ---------- results ----------

function Results({ session, onAgain, onExit }: { session: { answered: number; correct: number }; onAgain: () => void; onExit: () => void }) {
  const pct = session.answered ? Math.round((session.correct / session.answered) * 100) : 0;
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center md:px-8">
      <p className="text-sm font-semibold tracking-wider text-muted uppercase">Session complete</p>
      <p className="mt-4 text-6xl font-bold tracking-tight tabular-nums">
        {session.correct}
        <span className="text-muted">/{session.answered}</span>
      </p>
      <p className="mt-2 text-muted">{pct}% correct</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onAgain} className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
          Practice again
        </button>
        <button type="button" onClick={onExit} className="rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2">
          Change filters
        </button>
        <Link href="/" className="rounded-xl px-5 py-3 font-semibold text-muted transition-colors hover:text-ink">
          View progress
        </Link>
      </div>
    </section>
  );
}

// ---------- main ----------

export function Practice() {
  const params = useSearchParams();
  const [filter, setFilter] = useState<Filter>(() => initialFilter(params));
  const [phase, setPhase] = useState<"setup" | "question" | "done">("setup");
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [checked, setChecked] = useState(false);
  const [session, setSession] = useState({ answered: 0, correct: 0 });

  const pool = useMemo(() => QUESTIONS.filter((q) => matches(q, filter)), [filter]);
  const q = queue[index];

  const start = () => {
    setQueue(shuffle(pool));
    setIndex(0);
    setResponse("");
    setChecked(false);
    setSession({ answered: 0, correct: 0 });
    setPhase("question");
    window.scrollTo({ top: 0 });
  };

  const check = () => {
    if (!q || checked || !response.trim()) return;
    const ok = isCorrect(q, response);
    setChecked(true);
    setSession((s) => ({ answered: s.answered + 1, correct: s.correct + (ok ? 1 : 0) }));
    addAttempt({ qid: q.id, section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty, correct: ok, at: Date.now() });
  };

  const next = () => {
    if (index + 1 >= queue.length) {
      setPhase("done");
    } else {
      setIndex(index + 1);
      setResponse("");
      setChecked(false);
    }
    window.scrollTo({ top: 0 });
  };

  // Keyboard: A–D choose (multiple choice), Enter checks / goes next.
  useEffect(() => {
    if (phase !== "question" || !q) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === "Enter") {
        if (e.target instanceof HTMLButtonElement) return; // let the focused button handle it
        e.preventDefault();
        if (checked) next();
        else check();
        return;
      }
      if (!typing && !checked && q.type === "mcq") {
        const l = e.key.toUpperCase();
        if ((LETTERS as string[]).includes(l)) setResponse(l);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (phase === "setup") return <Setup filter={filter} setFilter={setFilter} onStart={start} />;
  if (phase === "done" || !q) return <Results session={session} onAgain={start} onExit={() => setPhase("setup")} />;
  return (
    <QuestionView
      q={q}
      position={index + 1}
      total={queue.length}
      session={session}
      response={response}
      setResponse={setResponse}
      checked={checked}
      onCheck={check}
      onNext={next}
      onExit={() => setPhase("setup")}
    />
  );
}
