"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toggleBookmark } from "@/lib/store";
import { SECTIONS, getDomain, type SectionId } from "@/lib/taxonomy";
import { BANKS, SOURCES, inBank, type BankId } from "@/lib/sources";
import type { Difficulty } from "@/lib/types";
import { PlusBadge, PlusLock } from "@/components/PlusLock";
import { SignInHint } from "@/components/plus/SignInHint";
import { LINK_ON_DARK } from "@/components/plus/styles";
import { RichText } from "@/components/RichText";
import { DifficultyBadge } from "./QuestionCard";
import { DIFF_STYLE, TopicsPanel } from "./FilterPanel";
import { DIFFS, SORTS, STATUSES, applyFilters, emptyFilters, skillName, sortItems, statusOf, type BankItem, type Filters, type Sort, type Status } from "./data";
import { I, Icon } from "./icons";
import { DAILY_GOAL, PAGE, estMinutes } from "@/lib/ui";

const PAGE_SIZE = 20;
/** Questions in a "Practice" set. */
const SET_SIZE = 10;

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function StatusIcon({ result }: { result: boolean | undefined }) {
  if (result === undefined)
    return (
      <span className="grid h-6 w-6 place-items-center" title="Unsolved">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-muted/60" />
      </span>
    );
  return result ? (
    <span className="grid h-6 w-6 place-items-center rounded-full bg-success-soft text-success" title="Answered correctly">
      <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={2.6} />
    </span>
  ) : (
    <span className="grid h-6 w-6 place-items-center rounded-full bg-danger-soft text-danger" title="Answered incorrectly">
      <Icon d={I.x} className="h-3.5 w-3.5" strokeWidth={2.6} />
    </span>
  );
}

/** Little icon in each status tab, matching the marks in the list rows. */
function StatusMark({ id, on }: { id: Status; on: boolean }) {
  const tone = (c: string) => (on ? "bg-white/35 text-primary-ink" : c);
  switch (id) {
    case "new":
      return <span className={`h-3 w-3 rounded-full border-2 ${on ? "border-primary-ink/80" : "border-muted"}`} aria-hidden="true" />;
    case "solved":
    case "correct":
      return (
        <span className={`grid h-4.5 w-4.5 place-items-center rounded-full ${tone("bg-success-soft text-success")}`} aria-hidden="true">
          <Icon d={I.check} className="h-3 w-3" strokeWidth={3} />
        </span>
      );
    case "incorrect":
      return (
        <span className={`grid h-4.5 w-4.5 place-items-center rounded-full ${tone("bg-danger-soft text-danger")}`} aria-hidden="true">
          <Icon d={I.x} className="h-3 w-3" strokeWidth={3} />
        </span>
      );
    case "bookmarked":
      return <Icon d={I.star} className={`h-4 w-4 ${on ? "" : "text-accent"}`} filled />;
    default:
      return null;
  }
}

function Chip({ children, onRemove, label }: { children: React.ReactNode; onRemove: () => void; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface py-1 pr-1 pl-3 text-xs font-medium">
      {children}
      <button type="button" onClick={onRemove} aria-label={`Remove filter: ${label}`} className="grid h-5 w-5 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink">
        <Icon d={I.x} className="h-3 w-3" strokeWidth={2.4} />
      </button>
    </span>
  );
}

/** Page numbers with ellipses: 1 … 4 5 6 … 20 */
function pageList(current: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i);
  const set = new Set([0, pages - 1, current - 1, current, current + 1].filter((p) => p >= 0 && p < pages));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function ListView({
  items,
  canBank,
  filters,
  setFilters,
  results,
  bookmarks,
  today,
  onOpen,
  onPractice,
}: {
  items: BankItem[];
  /** Whether the visitor may use the General bank (Plus). */
  canBank: boolean;
  filters: Filters;
  setFilters: (f: Filters) => void;
  results: Map<string, boolean>;
  bookmarks: Set<string>;
  /** Questions answered today (all sections). */
  today: number;
  onOpen: (list: BankItem[], index: number) => void;
  onPractice: (list: BankItem[], size: number) => void;
}) {
  const [page, setPage] = useState(0);
  const [sheet, setSheet] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listTop = useRef<HTMLDivElement>(null);
  const ctx = { results, bookmarks };

  /* eslint-disable react-hooks/exhaustive-deps -- ctx is rebuilt from results/bookmarks */
  const filtered = useMemo(() => sortItems(applyFilters(items, filters, ctx), filters.sort), [items, filters, results, bookmarks]);
  const forSkills = useMemo(() => applyFilters(items, filters, ctx, "skills"), [items, filters, results, bookmarks]);
  const diffCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const it of applyFilters(items, filters, ctx, "difficulties")) out[it.difficulty] = (out[it.difficulty] ?? 0) + 1;
    return out;
  }, [items, filters, results, bookmarks]);
  const statusCounts = useMemo(() => {
    const base = applyFilters(items, filters, ctx, "status");
    return Object.fromEntries(STATUSES.map((s) => [s.id, base.filter((it) => statusOf(it.id, results, bookmarks, s.id)).length])) as Record<Status, number>;
  }, [items, filters, results, bookmarks]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const bankItems = useMemo(() => items.filter((it) => inBank(filters.bank, it.source)), [items, filters.bank]);
  const bankTotals = useMemo(
    () => Object.fromEntries(BANKS.map((b) => [b.id, items.filter((it) => inBank(b.id, it.source)).length])) as Record<BankId, number>,
    [items],
  );

  // Per-section progress in the current bank (ignores other filters).
  const progress = useMemo(() => {
    const out = {} as Record<SectionId, { total: number; done: number; correct: number }>;
    const doneBySkill: Record<string, number> = {};
    const totalBySkill: Record<string, number> = {};
    for (const s of ["rw", "math"] as SectionId[]) out[s] = { total: 0, done: 0, correct: 0 };
    for (const it of bankItems) {
      const p = out[it.section];
      p.total++;
      totalBySkill[it.skill] = (totalBySkill[it.skill] ?? 0) + 1;
      const r = results.get(it.id);
      if (r !== undefined) {
        p.done++;
        doneBySkill[it.skill] = (doneBySkill[it.skill] ?? 0) + 1;
        if (r) p.correct++;
      }
    }
    return { bySection: out, doneBySkill, totalBySkill };
  }, [bankItems, results]);
  const sec = progress.bySection[filters.section];

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  const update = (f: Filters) => {
    setFilters(f);
    setPage(0);
  };
  const set = (patch: Partial<Filters>) => update({ ...filters, ...patch });
  const goPage = (p: number) => {
    setPage(p);
    const top = listTop.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const locked = BANKS.find((b) => b.id === filters.bank)?.plus === true && !canBank;

  const activeCount = filters.skills.length + filters.difficulties.length + (filters.status !== "all" ? 1 : 0) + (filters.search.trim() ? 1 : 0);
  const resetAll = () => update({ ...emptyFilters(filters.bank, filters.section), sort: filters.sort });

  // "/" focuses search; Esc closes the mobile filter sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;
      // (No search box while a locked bank shows the Plus panel.)
      if (e.key === "/" && !typing && searchRef.current) {
        e.preventDefault();
        searchRef.current.focus();
      }
      if (e.key === "Escape") setSheet(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the page behind the mobile topics sheet from scrolling (the desktop dropdown doesn't need it).
  useEffect(() => {
    if (!sheet || window.matchMedia("(min-width: 1024px)").matches) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [sheet]);

  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  const doneHere = filtered.filter((it) => results.has(it.id)).length;
  const setCount = Math.min(SET_SIZE, filtered.length);

  // Chips for every active filter.
  const chips: { key: string; label: string; node: React.ReactNode; remove: () => void }[] = [];
  if (filters.search.trim()) chips.push({ key: "q", label: `“${filters.search.trim()}”`, node: <>“{filters.search.trim()}”</>, remove: () => set({ search: "" }) });
  for (const s of filters.skills) {
    const dom = getDomain(items.find((x) => x.skill === s)?.domain ?? "");
    const name = dom?.skills.find((k) => k.id === s)?.name ?? s;
    chips.push({ key: s, label: name, node: name, remove: () => set({ skills: filters.skills.filter((x) => x !== s) }) });
  }

  return (
    <section className={PAGE}>
      {/* Header */}
      <div className="lg:pr-14">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Question Bank</h1>
        <p className="mt-2 text-muted">Choose a bank, filter by topic and difficulty, then open any question or start a practice set.</p>
      </div>

      {/* Bank switcher + progress */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_minmax(17rem,0.85fr)]">
        {BANKS.map((b) => {
          const on = filters.bank === b.id;
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setSheet(false);
                update({ ...emptyFilters(b.id, filters.section), difficulties: filters.difficulties, status: filters.status, sort: filters.sort });
              }}
              className={`group relative flex flex-col items-stretch justify-start rounded-2xl border p-4 text-left transition-colors sm:p-5 ${
                on ? "border-primary bg-primary-soft/50 ring-1 ring-primary" : "border-line bg-surface hover:border-muted"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${on ? "bg-primary/15 text-primary-strong" : "bg-surface-2 text-muted group-hover:text-ink"}`}>
                  <Icon d={b.id === "cb" ? I.badge : I.layers} className="h-5 w-5" />
                </span>
                <span className="flex items-center gap-2">
                  {b.plus && !canBank && <PlusBadge />}
                  <span className={`text-sm font-semibold tabular-nums ${on ? "text-primary-strong" : "text-muted"}`}>{fmt(bankTotals[b.id])}</span>
                </span>
              </span>
              <span className="mt-3 block leading-snug font-semibold">{b.name}</span>
              <span className="mt-0.5 hidden text-xs leading-relaxed text-muted sm:block">{b.description}</span>
            </button>
          );
        })}
        {/* Daily goal: a small, reachable finish line instead of "2 / 3,701". */}
        <div className="col-span-2 rounded-2xl border border-line bg-surface p-4 sm:p-5 lg:col-span-1">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium text-muted">Today&apos;s goal</p>
            <p className="text-sm font-medium text-primary-strong">{today >= DAILY_GOAL ? "Done 🎉" : `${DAILY_GOAL - today} to go`}</p>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {fmt(Math.min(today, 999))}
            <span className="text-base font-medium text-muted"> / {DAILY_GOAL} questions</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.min(100, pct(today, DAILY_GOAL))}%` }} />
          </div>
          <p className="mt-2 text-[13px] text-muted tabular-nums">
            {SECTIONS[filters.section].short}: {fmt(sec.done)} done{sec.done ? ` · ${pct(sec.correct, sec.done)}% correct` : ""}
          </p>
        </div>
      </div>

      {locked ? (
        <PlusLock
          variant="panel"
          feature="bank"
          className="mt-8"
          title={`Practice all ${fmt(bankTotals.all)} past-paper questions with Plus`}
          points={[
            "Questions from past Digital SAT papers, sorted by topic and difficulty",
            "Filter by skill, then open any question or start a practice set",
            "Wrong answers go straight to your Mistakes list",
          ]}
          fact={`${fmt(bankTotals.cb)} College Board questions stay free`}
          footer={
            <>
              {/* A Link to this same URL wouldn't reset the state, so the free step is a button. */}
              <p className="mt-3 text-sm">
                <button type="button" onClick={() => update({ ...emptyFilters("cb", filters.section), sort: filters.sort })} className={LINK_ON_DARK}>
                  Or keep going free: College Board questions →
                </button>
              </p>
              <SignInHint />
            </>
          }
        />
      ) : (
        <>
      {/* Section tabs */}
      <div className="mt-8 flex gap-6 border-b border-line" role="tablist" aria-label="Section">
        {(["rw", "math"] as SectionId[]).map((s) => {
          const on = filters.section === s;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => update({ ...emptyFilters(filters.bank, s), difficulties: filters.difficulties, status: filters.status, sort: filters.sort })}
              className={`relative -mb-px flex items-center gap-2 border-b-2 pb-3 text-[15px] font-semibold transition-colors ${
                on ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {SECTIONS[s].name}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${on ? "bg-primary-soft text-primary-strong" : "bg-surface-2 text-muted"}`}>
                {fmt(progress.bySection[s].total)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-w-0" ref={listTop}>
        {/* Search + sort */}
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Icon d={I.search} className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
            <label htmlFor="bank-search" className="sr-only">
              Search questions
            </label>
            <input
              ref={searchRef}
              id="bank-search"
              type="search"
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Search text or #"
              className="h-11 w-full rounded-xl border border-line bg-surface pr-10 pl-10 text-sm outline-none transition-shadow placeholder:text-muted focus:border-primary focus:ring-3 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {filters.search ? (
              <button type="button" onClick={() => set({ search: "" })} aria-label="Clear search" className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-ink">
                <Icon d={I.x} className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-line px-1.5 font-mono text-[11px] text-muted sm:block">/</kbd>
            )}
          </div>
          <div className="relative shrink-0">
            <Icon d={I.sort} className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
            <label htmlFor="bank-sort" className="sr-only">
              Sort
            </label>
            <select
              id="bank-sort"
              value={filters.sort}
              onChange={(e) => set({ sort: e.target.value as Sort })}
              className="h-11 w-11 cursor-pointer appearance-none rounded-xl border border-line bg-surface text-sm font-medium text-transparent outline-none focus:border-primary sm:w-auto sm:pr-9 sm:pl-9 sm:text-ink"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id} className="text-ink">
                  {s.label}
                </option>
              ))}
            </select>
            <Icon d={I.chevronD} className="pointer-events-none absolute top-1/2 right-3 hidden h-4 w-4 -translate-y-1/2 text-muted sm:block" />
          </div>
        </div>

        {/* Status: tabs right above the list, so Unsolved / Solved is impossible to miss */}
        <div className="-mx-4 mt-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
          <div className="inline-flex gap-1 rounded-2xl border border-line bg-surface p-1" role="tablist" aria-label="Status">
            {STATUSES.map((s) => {
              const on = filters.status === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => set({ status: s.id })}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                    on ? "bg-primary text-primary-ink shadow-sm" : "text-muted hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <StatusMark id={s.id} on={on} />
                  {s.label}
                  <span className="text-xs font-medium tabular-nums opacity-75">{fmt(statusCounts[s.id])}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics dropdown + difficulty */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSheet((o) => !o)}
              aria-expanded={sheet}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-sm font-semibold transition-colors sm:gap-2 sm:px-3 ${
                filters.skills.length ? "border-primary bg-primary-soft text-primary-strong" : "border-line bg-surface hover:border-muted"
              }`}
            >
              <Icon d={I.filter} className="hidden h-4 w-4 sm:block" />
              Topics
              {filters.skills.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-ink tabular-nums">{filters.skills.length}</span>}
              <Icon d={I.chevronD} className={`h-4 w-4 transition-transform ${sheet ? "rotate-180" : ""}`} />
            </button>

            {/* Bottom sheet on phones, dropdown under the button on desktop */}
            <div
              className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:bg-transparent ${sheet ? "opacity-100" : "pointer-events-none opacity-0"}`}
              onClick={() => setSheet(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-label="Topics"
              className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl border border-line bg-surface shadow-2xl transition-[transform,opacity] duration-200 ease-out lg:absolute lg:inset-x-auto lg:top-full lg:bottom-auto lg:left-0 lg:mt-2 lg:max-h-[min(70vh,34rem)] lg:w-[380px] lg:rounded-2xl ${
                sheet ? "translate-y-0 opacity-100" : "invisible translate-y-full lg:translate-y-1 lg:opacity-0"
              }`}
            >
              <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line lg:hidden" aria-hidden="true" />
              <div className="flex shrink-0 items-center justify-between px-5 pt-3 pb-2">
                <h2 className="font-semibold">Topics</h2>
                <div className="flex items-center gap-1">
                  {filters.skills.length > 0 && (
                    <button type="button" onClick={() => set({ skills: [] })} className="rounded-lg px-2 py-1 text-xs font-semibold text-primary-strong hover:bg-surface-2">
                      Clear
                    </button>
                  )}
                  <button type="button" onClick={() => setSheet(false)} aria-label="Close topics" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink">
                    <Icon d={I.x} className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <TopicsPanel
                  key={filters.section}
                  filters={filters}
                  setFilters={update}
                  forSkills={forSkills}
                  doneBySkill={progress.doneBySkill}
                  totalBySkill={progress.totalBySkill}
                />
              </div>
              <div className="shrink-0 border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <button type="button" onClick={() => setSheet(false)} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-ink hover:bg-primary-hover">
                  Show {fmt(filtered.length)} {filtered.length === 1 ? "question" : "questions"}
                </button>
              </div>
            </div>
          </div>

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
          {DIFFS.map((d) => {
            const on = filters.difficulties.includes(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={on}
                onClick={() => set({ difficulties: on ? filters.difficulties.filter((x) => x !== d) : [...filters.difficulties, d] })}
                className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-sm font-semibold capitalize sm:px-3 transition-colors ${
                  on ? DIFF_STYLE[d].on : "border-line bg-surface text-muted hover:border-muted hover:text-ink"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${DIFF_STYLE[d].dot}`} aria-hidden="true" />
                {d}
                <span className="hidden text-xs font-medium tabular-nums opacity-70 sm:inline">{fmt(diffCounts[d] ?? 0)}</span>
              </button>
            );
          })}

          {chips.length > 0 && (
            <>
              <span className="mx-1 hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
              {chips.map((c) => (
                <Chip key={c.key} label={c.label} onRemove={c.remove}>
                  {c.node}
                </Chip>
              ))}
            </>
          )}
          {activeCount > 0 && (
            <button type="button" onClick={resetAll} className="ml-auto text-xs font-semibold text-primary-strong hover:underline">
              Reset all
            </button>
          )}
        </div>

        {/* Practice bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 sm:px-5">
          <div className="min-w-0">
            <p className="font-semibold">
              {fmt(filtered.length)} {filtered.length === 1 ? "question" : "questions"}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {doneHere ? `${fmt(doneHere)} attempted · ${fmt(filtered.length - doneHere)} new` : "None attempted yet"}
              {setCount > 0 && <> · a set of {fmt(setCount)} takes about {fmt(estMinutes(setCount, filters.section))} min</>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPractice(filtered, SET_SIZE)}
            disabled={!filtered.length}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <Icon d={I.play} className="h-4 w-4" filled />
            Practice
          </button>
        </div>

        {/* List */}
        {rows.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-muted">
              <Icon d={I.inbox} className="h-6 w-6" />
            </span>
            <p className="mt-4 font-semibold">No questions match these filters</p>
            <p className="mt-1 text-sm text-muted">Try removing a filter or searching for something else.</p>
            <button type="button" onClick={resetAll} className="mt-4 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-2">
              Reset filters
            </button>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {rows.map((it, i) => {
              const marked = bookmarks.has(it.id);
              const r = results.get(it.id);
              return (
                <li key={it.id} className="group relative flex items-start gap-3 px-4 py-4 transition-colors hover:bg-surface-2/50 sm:gap-4 sm:px-5">
                  <div className="mt-0.5 shrink-0">
                    <StatusIcon result={r} />
                  </div>
                  <button type="button" onClick={() => onOpen(filtered, current * PAGE_SIZE + i)} className="min-w-0 flex-1 text-left outline-none after:absolute after:inset-0 after:rounded-none focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:ring-inset">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span className="font-mono font-medium text-ink/70">#{it.n}</span>
                      <span aria-hidden="true" className="text-line">
                        |
                      </span>
                      <span className="font-medium">{skillName(it)}</span>
                      <span className="inline-flex items-center gap-1 capitalize sm:hidden">
                        <span className={`h-1.5 w-1.5 rounded-full ${DIFF_STYLE[it.difficulty as Difficulty].dot}`} aria-hidden="true" />
                        {it.difficulty}
                      </span>
                      {filters.bank === "all" && it.source === "cb" && (
                        <span className="inline-flex items-center gap-1 text-muted" title={`Source: ${SOURCES[it.source].name}`}>
                          <Icon d={I.badge} className="h-3.5 w-3.5" />
                          CB
                        </span>
                      )}
                    </span>
                    <span className={`mt-1 line-clamp-2 text-[15px] leading-relaxed ${r !== undefined ? "text-ink/75" : ""}`}>
                      {it.preview ? (
                        <RichText text={it.preview} math={it.section === "math"} />
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-muted italic">
                          <Icon d={I.image} className="h-4 w-4" /> Question with a figure
                        </span>
                      )}
                    </span>
                  </button>
                  <div className="relative z-10 flex shrink-0 items-center gap-1 self-center">
                    <span className="hidden sm:block">
                      <DifficultyBadge d={it.difficulty as Difficulty} />
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(it.id)}
                      aria-pressed={marked}
                      aria-label={marked ? `Remove bookmark from #${it.n}` : `Bookmark #${it.n}`}
                      title={marked ? "Remove bookmark" : "Bookmark"}
                      className={`grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-surface-2 ${marked ? "text-accent" : "text-muted/50 hover:text-muted"}`}
                    >
                      <Icon d={I.star} className="h-4.5 w-4.5" filled={marked} />
                    </button>
                    <Icon d={I.chevronR} className="hidden h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <nav className="mt-5 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
            <p className="text-sm text-muted tabular-nums">
              {fmt(current * PAGE_SIZE + 1)}–{fmt(Math.min((current + 1) * PAGE_SIZE, filtered.length))} of {fmt(filtered.length)}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => goPage(current - 1)} disabled={current === 0} aria-label="Previous page" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface hover:bg-surface-2 disabled:opacity-40">
                <Icon d={I.chevronL} className="h-4 w-4" />
              </button>
              {pageList(current, pages).map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className="hidden w-6 text-center text-sm text-muted sm:block">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goPage(p)}
                    aria-current={p === current ? "page" : undefined}
                    className={`hidden h-9 min-w-9 rounded-lg px-2 text-sm font-semibold tabular-nums transition-colors sm:block ${
                      p === current ? "bg-primary text-primary-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    {p + 1}
                  </button>
                ),
              )}
              <span className="px-2 text-sm text-muted tabular-nums sm:hidden">
                {current + 1} / {pages}
              </span>
              <button type="button" onClick={() => goPage(current + 1)} disabled={current >= pages - 1} aria-label="Next page" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface hover:bg-surface-2 disabled:opacity-40">
                <Icon d={I.chevronR} className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
        </>
      )}
    </section>
  );
}
