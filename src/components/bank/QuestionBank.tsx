"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { addAttempt, toggleBookmark, useAttempts, useBookmarks } from "@/lib/store";
import { SECTIONS, getDomain, type SectionId } from "@/lib/taxonomy";
import type { Difficulty } from "@/lib/types";
import { RichText } from "@/components/RichText";
import { DifficultyBadge, QuestionCard } from "./QuestionCard";
import { FilterPanel } from "./FilterPanel";
import {
  STATUSES,
  applyFilters,
  cachedQuestion,
  fetchQuestions,
  filtersFromParams,
  filtersToQuery,
  lastResults,
  shuffle,
  statusOf,
  useBankIndex,
  type BankItem,
  type Filters,
  type Status,
} from "./data";

const PAGE_SIZE = 20;
const SET_SIZES = [10, 20, 50] as const;

function skillName(it: { domain: string; skill: string }) {
  return getDomain(it.domain)?.skills.find((s) => s.id === it.skill)?.name ?? it.skill;
}

function Icon({ d, className = "h-5 w-5", filled }: { d: string; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const STAR = "m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z";
const CHEVRON_L = "M15 18l-6-6 6-6";
const CHEVRON_R = "M9 18l6-6-6-6";

function StatusDot({ result }: { result: boolean | undefined }) {
  if (result === undefined) return <span className="h-2.5 w-2.5 rounded-full border-2 border-line" title="Not attempted" />;
  return result ? (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-success-soft text-success" title="Answered correctly">
      <Icon d="M5 12.5l4.5 4.5L19 7" className="h-3.5 w-3.5" />
    </span>
  ) : (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-danger-soft text-danger" title="Answered incorrectly">
      <Icon d="M7 7l10 10M17 7 7 17" className="h-3.5 w-3.5" />
    </span>
  );
}

// ======================= list view =======================

function ListView({
  items,
  filters,
  setFilters,
  results,
  bookmarks,
  onOpen,
  onPractice,
}: {
  items: BankItem[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  results: Map<string, boolean>;
  bookmarks: Set<string>;
  onOpen: (list: BankItem[], index: number) => void;
  onPractice: (list: BankItem[], size: number) => void;
}) {
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [setSize, setSetSize] = useState<number>(10);
  const ctx = { results, bookmarks };

  const filtered = useMemo(() => applyFilters(items, filters, ctx), [items, filters, results, bookmarks]); // eslint-disable-line react-hooks/exhaustive-deps
  const forSkills = useMemo(() => applyFilters(items, filters, ctx, "skills"), [items, filters, results, bookmarks]); // eslint-disable-line react-hooks/exhaustive-deps
  const forDiffs = useMemo(() => applyFilters(items, filters, ctx, "difficulties"), [items, filters, results, bookmarks]); // eslint-disable-line react-hooks/exhaustive-deps
  const statusCounts = useMemo(() => {
    const base = applyFilters(items, filters, ctx, "status");
    return Object.fromEntries(STATUSES.map((s) => [s.id, base.filter((it) => statusOf(it.id, results, bookmarks, s.id)).length])) as Record<Status, number>;
  }, [items, filters, results, bookmarks]); // eslint-disable-line react-hooks/exhaustive-deps
  const sectionTotals = useMemo(
    () => ({ rw: items.filter((i) => i.section === "rw").length, math: items.filter((i) => i.section === "math").length }) as Record<SectionId, number>,
    [items],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const updateFilters = (f: Filters) => {
    setFilters(f);
    setPage(0);
  };

  const done = filtered.filter((it) => results.has(it.id)).length;
  const correct = filtered.filter((it) => results.get(it.id) === true).length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Question Bank</h1>
          <p className="mt-1.5 text-muted">Filter by topic, skill, difficulty, and status. Open any question, or practice a random set.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold lg:hidden"
        >
          {showFilters ? "Hide filters" : "Filters"}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Filters */}
        <aside className={`${showFilters ? "block" : "hidden"} rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto`}>
          <FilterPanel
            filters={filters}
            setFilters={updateFilters}
            forSkills={forSkills}
            forDiffs={forDiffs}
            statusCounts={statusCounts}
            sectionTotals={sectionTotals}
          />
        </aside>

        {/* Results */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
            <div>
              <p className="font-semibold">
                {filtered.length.toLocaleString("en-US")} {filtered.length === 1 ? "question" : "questions"}
              </p>
              <p className="text-xs text-muted">
                {done} attempted{done ? ` · ${Math.round((correct / done) * 100)}% correct` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="set-size" className="sr-only">
                Set size
              </label>
              <select
                id="set-size"
                value={setSize}
                onChange={(e) => setSetSize(Number(e.target.value))}
                className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm"
              >
                {SET_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n} questions
                  </option>
                ))}
                <option value={0}>All ({filtered.length})</option>
              </select>
              <button
                type="button"
                onClick={() => onPractice(filtered, setSize)}
                disabled={!filtered.length}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Practice random set
              </button>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="font-semibold">No questions match these filters.</p>
              <button
                type="button"
                onClick={() => updateFilters({ section: filters.section, skills: [], difficulties: [], status: "all", search: "" })}
                className="mt-3 text-sm font-semibold text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {rows.map((it, i) => {
                const marked = bookmarks.has(it.id);
                return (
                  <li key={it.id} className="group relative flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2/60 sm:gap-4">
                    <div className="mt-0.5 flex w-6 shrink-0 justify-center">
                      <StatusDot result={results.get(it.id)} />
                    </div>
                    <button type="button" onClick={() => onOpen(filtered, current * PAGE_SIZE + i)} className="min-w-0 flex-1 text-left after:absolute after:inset-0">
                      <span className="line-clamp-2 text-sm leading-relaxed">{it.preview ? <RichText text={it.preview} math={it.section === "math"} /> : "(figure question)"}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                        <span className="font-mono">#{it.n}</span>
                        <span aria-hidden="true">·</span>
                        <span>{skillName(it)}</span>
                        <DifficultyBadge d={it.difficulty} />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(it.id)}
                      aria-pressed={marked}
                      aria-label={marked ? "Remove bookmark" : "Bookmark"}
                      title={marked ? "Remove bookmark" : "Bookmark"}
                      className={`relative z-10 -mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors hover:bg-surface-2 ${marked ? "text-accent" : "text-line group-hover:text-muted"}`}
                    >
                      <Icon d={STAR} className="h-4.5 w-4.5" filled={marked} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {pages > 1 && (
            <nav className="mt-4 flex items-center justify-between gap-3 text-sm" aria-label="Pagination">
              <button
                type="button"
                onClick={() => setPage(current - 1)}
                disabled={current === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 font-medium disabled:opacity-40"
              >
                <Icon d={CHEVRON_L} className="h-4 w-4" /> Prev
              </button>
              <span className="text-muted tabular-nums">
                Page {current + 1} of {pages}
              </span>
              <button
                type="button"
                onClick={() => setPage(current + 1)}
                disabled={current >= pages - 1}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 font-medium disabled:opacity-40"
              >
                Next <Icon d={CHEVRON_R} className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

// ======================= solve view =======================

interface Run {
  ids: string[];
  items: Map<string, BankItem>;
  title: string;
  start: number;
}

function SolveView({ run, results, bookmarks, onExit, onRestart }: { run: Run; results: Map<string, boolean>; bookmarks: Set<string>; onExit: () => void; onRestart: (ids: string[], title: string) => void }) {
  const [pos, setPos] = useState(run.start);
  const [session, setSession] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [, setLoaded] = useState(0); // bump to re-render when questions arrive
  const [error, setError] = useState<string | null>(null);
  const total = run.ids.length;
  const id = run.ids[pos];
  const q = cachedQuestion(id);
  const meta = run.items.get(id);
  // Result from before this session (so "previously answered" doesn't change as you answer now).
  const [prior] = useState(() => new Map(results));

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
  }, [pos, run.ids]);

  const go = (i: number) => {
    if (i < 0 || i >= total) return;
    setPos(i);
    setError(null);
    window.scrollTo({ top: 0 });
  };
  const next = () => (pos + 1 < total ? go(pos + 1) : setFinished(true));

  // ← / → move between questions (when not typing).
  useEffect(() => {
    if (finished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "ArrowRight") go(pos + 1);
      if (e.key === "ArrowLeft") go(pos - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const answered = Object.keys(session).length;
  const correct = Object.values(session).filter(Boolean).length;

  if (finished) {
    const wrong = run.ids.filter((x) => session[x] === false);
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center md:px-8">
        <p className="text-sm font-semibold tracking-wider text-muted uppercase">{run.title}</p>
        <p className="mt-4 text-6xl font-bold tracking-tight tabular-nums">
          {correct}
          <span className="text-muted">/{answered}</span>
        </p>
        <p className="mt-2 text-muted">{answered ? `${Math.round((correct / answered) * 100)}% correct` : "No questions answered"}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {wrong.length > 0 && (
            <button
              type="button"
              onClick={() => onRestart(wrong, `Review mistakes · ${wrong.length}`)}
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
            >
              Review {wrong.length} {wrong.length === 1 ? "mistake" : "mistakes"}
            </button>
          )}
          <button type="button" onClick={onExit} className="rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2">
            Back to Question Bank
          </button>
          <Link href="/" className="rounded-xl px-5 py-3 font-semibold text-muted transition-colors hover:text-ink">
            View progress
          </Link>
        </div>
      </section>
    );
  }

  const marked = bookmarks.has(id);
  const was = prior.get(id);

  return (
    <section className={`mx-auto px-4 py-5 md:px-8 md:py-6 ${meta?.section === "math" ? "max-w-4xl" : "max-w-7xl"}`}>
      {/* Toolbar */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8 lg:top-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={onExit} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
              <Icon d={CHEVRON_L} className="h-4 w-4" /> Back
            </button>
            <span className="hidden truncate text-sm font-semibold sm:block">{run.title}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-sm text-muted tabular-nums">
              {pos + 1} / {total}
              {answered > 0 && <span className="ml-2 text-xs">· {correct}/{answered} correct</span>}
            </span>
            <button
              type="button"
              onClick={() => toggleBookmark(id)}
              aria-pressed={marked}
              aria-label={marked ? "Remove bookmark" : "Bookmark this question"}
              title={marked ? "Remove bookmark" : "Bookmark"}
              className={`grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface transition-colors hover:bg-surface-2 ${marked ? "text-accent" : "text-muted"}`}
            >
              <Icon d={STAR} className="h-4.5 w-4.5" filled={marked} />
            </button>
            <button type="button" onClick={() => go(pos - 1)} disabled={pos === 0} aria-label="Previous question (←)" title="Previous (←)" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface hover:bg-surface-2 disabled:opacity-40">
              <Icon d={CHEVRON_L} className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(pos + 1)} disabled={pos >= total - 1} aria-label="Next question (→)" title="Next (→)" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface hover:bg-surface-2 disabled:opacity-40">
              <Icon d={CHEVRON_R} className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setFinished(true)} className="ml-1 rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-ink">
              Finish
            </button>
          </div>
        </div>
        {/* Navigator for small sets */}
        {total <= 60 && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Question navigator">
            {run.ids.map((x, i) => {
              const r = session[x];
              return (
                <button
                  key={x}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === pos ? "step" : undefined}
                  aria-label={`Question ${i + 1}${r === undefined ? "" : r ? ", correct" : ", incorrect"}`}
                  className={`h-7 min-w-7 rounded-md border px-1 text-xs font-semibold tabular-nums transition-colors ${
                    i === pos ? "ring-2 ring-primary ring-offset-1 ring-offset-bg" : ""
                  } ${r === true ? "border-success bg-success-soft text-success" : r === false ? "border-danger bg-danger-soft text-danger" : "border-line bg-surface text-muted hover:text-ink"}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Meta */}
      {meta && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="font-mono">#{meta.n}</span>
          <span>·</span>
          <span className="font-semibold text-ink">{SECTIONS[meta.section].short}</span>
          <span>·</span>
          <span>{getDomain(meta.domain)?.name}</span>
          <span>·</span>
          <span>{skillName(meta)}</span>
          <DifficultyBadge d={meta.difficulty as Difficulty} />
          {was !== undefined && session[id] === undefined && (
            <span className={`rounded-full px-2 py-0.5 font-medium ${was ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}>
              Previously {was ? "correct" : "incorrect"}
            </span>
          )}
        </div>
      )}

      <div className="mt-4">
        {error ? (
          <div className="rounded-2xl border border-danger/40 bg-danger-soft p-6 text-sm">
            Couldn&apos;t load this question ({error}).{" "}
            <button type="button" onClick={() => go(pos)} className="font-semibold underline">
              Try again
            </button>
          </div>
        ) : !q ? (
          <div className="h-80 animate-pulse rounded-2xl bg-surface-2" aria-label="Loading question" />
        ) : (
          <QuestionCard
            key={q.id}
            q={q}
            nextLabel={pos + 1 < total ? "Next question →" : "Finish set"}
            onNext={next}
            onAnswered={(ok) => {
              setSession((s) => (q.id in s ? s : { ...s, [q.id]: ok }));
              addAttempt({ qid: q.id, section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty, correct: ok, at: Date.now() });
            }}
          />
        )}
      </div>
      <p className="mt-6 hidden text-xs text-muted md:block">Keys: A–D choose · Enter check / next · ← → move between questions</p>
    </section>
  );
}

// ======================= main =======================

export function QuestionBank() {
  const params = useSearchParams();
  const { items, error } = useBankIndex();
  const attempts = useAttempts();
  const bookmarkList = useBookmarks();
  const results = useMemo(() => lastResults(attempts), [attempts]);
  const bookmarks = useMemo(() => new Set(bookmarkList), [bookmarkList]);
  const [filters, setFiltersState] = useState<Filters>(() => filtersFromParams(params));
  const [run, setRun] = useState<Run | null>(null);

  const setFilters = (f: Filters) => {
    setFiltersState(f);
    // Keep filters in the URL (shareable, survives refresh) without a navigation.
    window.history.replaceState(null, "", `/practice?${filtersToQuery(f)}`);
  };

  const byId = useMemo(() => new Map((items ?? []).map((it) => [it.id, it])), [items]);

  const describe = (f: Filters) => {
    if (f.skills.length === 1) {
      const it = items?.find((x) => x.skill === f.skills[0]);
      return it ? skillName(it) : SECTIONS[f.section].name;
    }
    return SECTIONS[f.section].name;
  };

  const open = (list: BankItem[], index: number) => {
    setRun({ ids: list.map((x) => x.id), items: byId, title: `${describe(filters)} · ${list.length} questions`, start: index });
    window.scrollTo({ top: 0 });
  };
  const practice = (list: BankItem[], size: number) => {
    const picked = shuffle(list).slice(0, size || list.length);
    setRun({ ids: picked.map((x) => x.id), items: byId, title: `Practice set · ${describe(filters)}`, start: 0 });
    window.scrollTo({ top: 0 });
  };

  if (error)
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
        <p className="font-semibold">Couldn&apos;t load the question bank ({error}).</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-3 text-sm font-semibold text-primary hover:underline">
          Reload
        </button>
      </section>
    );

  if (!items)
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-surface-2" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden h-[32rem] animate-pulse rounded-2xl bg-surface-2 lg:block" />
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface-2" />
            ))}
          </div>
        </div>
      </section>
    );

  if (run)
    return (
      <SolveView
        key={run.ids.join() + run.start}
        run={run}
        results={results}
        bookmarks={bookmarks}
        onExit={() => setRun(null)}
        onRestart={(ids, title) => setRun({ ids, items: byId, title, start: 0 })}
      />
    );

  return (
    <ListView
      items={items}
      filters={filters}
      setFilters={setFilters}
      results={results}
      bookmarks={bookmarks}
      onOpen={open}
      onPractice={practice}
    />
  );
}
