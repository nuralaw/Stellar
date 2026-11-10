"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toggleBookmark } from "@/lib/store";
import { SECTIONS, getDomain, type SectionId } from "@/lib/taxonomy";
import { BANKS, SOURCES, inBank, type BankId } from "@/lib/sources";
import type { Difficulty } from "@/lib/types";
import { RichText } from "@/components/RichText";
import { DifficultyBadge } from "./QuestionCard";
import { DIFF_STYLE, FilterPanel } from "./FilterPanel";
import { SORTS, STATUSES, applyFilters, emptyFilters, skillName, sortItems, statusOf, type BankItem, type Filters, type Sort, type Status } from "./data";
import { I, Icon } from "./icons";

const PAGE_SIZE = 20;
const SET_SIZES = [10, 20, 50, 0] as const; // 0 = all

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function StatusIcon({ result }: { result: boolean | undefined }) {
  if (result === undefined)
    return (
      <span className="grid h-6 w-6 place-items-center" title="Not attempted">
        <span className="h-3 w-3 rounded-full border-2 border-line" />
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
  const [sheet, setSheet] = useState(false);
  const [setSize, setSetSize] = useState<number>(10);
  const searchRef = useRef<HTMLInputElement>(null);
  const listTop = useRef<HTMLDivElement>(null);
  const ctx = { results, bookmarks };

  /* eslint-disable react-hooks/exhaustive-deps -- ctx is rebuilt from results/bookmarks */
  const filtered = useMemo(() => sortItems(applyFilters(items, filters, ctx), filters.sort), [items, filters, results, bookmarks]);
  const forSkills = useMemo(() => applyFilters(items, filters, ctx, "skills"), [items, filters, results, bookmarks]);
  const forDiffs = useMemo(() => applyFilters(items, filters, ctx, "difficulties"), [items, filters, results, bookmarks]);
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

  const activeCount = filters.skills.length + filters.difficulties.length + (filters.status !== "all" ? 1 : 0) + (filters.search.trim() ? 1 : 0);
  const resetAll = () => update({ ...emptyFilters(filters.bank, filters.section), sort: filters.sort });

  // "/" focuses search; Esc closes the mobile filter sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") setSheet(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the page behind the mobile filter sheet from scrolling.
  useEffect(() => {
    if (!sheet) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [sheet]);

  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  const doneHere = filtered.filter((it) => results.has(it.id)).length;
  const setCount = setSize ? Math.min(setSize, filtered.length) : filtered.length;

  // Chips for every active filter.
  const chips: { key: string; label: string; node: React.ReactNode; remove: () => void }[] = [];
  if (filters.search.trim()) chips.push({ key: "q", label: `“${filters.search.trim()}”`, node: <>“{filters.search.trim()}”</>, remove: () => set({ search: "" }) });
  for (const s of filters.skills) {
    const dom = getDomain(items.find((x) => x.skill === s)?.domain ?? "");
    const name = dom?.skills.find((k) => k.id === s)?.name ?? s;
    chips.push({ key: s, label: name, node: name, remove: () => set({ skills: filters.skills.filter((x) => x !== s) }) });
  }
  for (const d of filters.difficulties)
    chips.push({
      key: d,
      label: d,
      node: (
        <span className="inline-flex items-center gap-1.5 capitalize">
          <span className={`h-1.5 w-1.5 rounded-full ${DIFF_STYLE[d].dot}`} />
          {d}
        </span>
      ),
      remove: () => set({ difficulties: filters.difficulties.filter((x) => x !== d) }),
    });
  if (filters.status !== "all") {
    const label = STATUSES.find((s) => s.id === filters.status)!.label;
    chips.push({ key: "status", label, node: label, remove: () => set({ status: "all" }) });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-8 md:pt-10">
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
              onClick={() => update({ ...emptyFilters(b.id, filters.section), difficulties: filters.difficulties, status: filters.status, sort: filters.sort })}
              className={`group relative flex flex-col items-stretch justify-start rounded-2xl border p-4 text-left transition-colors sm:p-5 ${
                on ? "border-primary bg-primary-soft/50 ring-1 ring-primary" : "border-line bg-surface hover:border-muted"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${on ? "bg-primary text-primary-ink" : "bg-surface-2 text-muted group-hover:text-ink"}`}>
                  <Icon d={b.id === "cb" ? I.badge : I.layers} className="h-5 w-5" />
                </span>
                <span className={`text-sm font-semibold tabular-nums ${on ? "text-primary" : "text-muted"}`}>{fmt(bankTotals[b.id])}</span>
              </span>
              <span className="mt-3 block leading-snug font-semibold">{b.name}</span>
              <span className="mt-0.5 hidden text-xs leading-relaxed text-muted sm:block">{b.description}</span>
            </button>
          );
        })}
        <div className="col-span-2 rounded-2xl border border-line bg-surface p-4 sm:p-5 lg:col-span-1">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">{SECTIONS[filters.section].short} progress</p>
            <p className="text-xs text-muted">{sec.done ? `${pct(sec.correct, sec.done)}% correct` : "Not started"}</p>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {fmt(sec.done)}
            <span className="text-base font-medium text-muted"> / {fmt(sec.total)} done</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.max(sec.done ? 1.5 : 0, pct(sec.done, sec.total))}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">{filters.bank === "cb" ? "In the College Board bank" : "In the general bank"}</p>
        </div>
      </div>

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
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${on ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted"}`}>
                {fmt(progress.bySection[s].total)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
        {/* Filters: sticky card on desktop, bottom sheet on mobile */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${sheet ? "opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={() => setSheet(false)}
          aria-hidden="true"
        />
        <aside
          aria-label="Filters"
          className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl border border-line bg-surface shadow-2xl transition-transform duration-300 ease-out lg:visible lg:sticky lg:top-6 lg:z-auto lg:max-h-[calc(100vh-3rem)] lg:translate-y-0 lg:self-start lg:rounded-2xl lg:shadow-none ${
            sheet ? "translate-y-0" : "invisible translate-y-full"
          }`}
        >
          <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line lg:hidden" aria-hidden="true" />
          <div className="flex shrink-0 items-center justify-between px-5 pt-3 pb-3 lg:pt-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <Icon d={I.filter} className="h-4.5 w-4.5 text-muted" />
              Filters
            </h2>
            <div className="flex items-center gap-1">
              {activeCount > 0 && (
                <button type="button" onClick={resetAll} className="rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-surface-2 hover:text-ink">
                  Reset all
                </button>
              )}
              <button type="button" onClick={() => setSheet(false)} aria-label="Close filters" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink lg:hidden">
                <Icon d={I.x} className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-1">
            <FilterPanel
              key={filters.section}
              filters={filters}
              setFilters={update}
              forSkills={forSkills}
              forDiffs={forDiffs}
              statusCounts={statusCounts}
              doneBySkill={progress.doneBySkill}
              totalBySkill={progress.totalBySkill}
            />
            <div className="border-t border-line px-5 py-4 sm:hidden">
              <h3 className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Sort by</h3>
              <div className="flex rounded-xl bg-surface-2 p-1" role="radiogroup" aria-label="Sort by">
                {SORTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={filters.sort === s.id}
                    onClick={() => set({ sort: s.id })}
                    className={`flex-1 rounded-lg px-2 py-2 text-sm font-semibold transition-colors ${
                      filters.sort === s.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
                    }`}
                  >
                    {s.id === "number" ? "Number" : s.id === "easy-first" ? "Easiest" : "Hardest"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="shrink-0 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
            <button type="button" onClick={() => setSheet(false)} className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-ink">
              Show {fmt(filtered.length)} {filtered.length === 1 ? "question" : "questions"}
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0" ref={listTop}>
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
            <div className="relative hidden sm:block">
              <Icon d={I.sort} className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <label htmlFor="bank-sort" className="sr-only">
                Sort
              </label>
              <select
                id="bank-sort"
                value={filters.sort}
                onChange={(e) => set({ sort: e.target.value as Sort })}
                className="h-11 cursor-pointer appearance-none rounded-xl border border-line bg-surface pr-9 pl-9 text-sm font-medium outline-none focus:border-primary"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon d={I.chevronD} className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-sm font-semibold lg:hidden"
            >
              <Icon d={I.filter} className="h-4.5 w-4.5" />
              Filters
              {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-ink tabular-nums">{activeCount}</span>}
            </button>
          </div>

          {/* Active filters */}
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {chips.map((c) => (
                <Chip key={c.key} label={c.label} onRemove={c.remove}>
                  {c.node}
                </Chip>
              ))}
              <button type="button" onClick={resetAll} className="ml-1 text-xs font-semibold text-primary hover:underline">
                Clear all
              </button>
            </div>
          )}

          {/* Practice bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 sm:px-5">
            <div className="min-w-0">
              <p className="font-semibold">
                {fmt(filtered.length)} {filtered.length === 1 ? "question" : "questions"}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {doneHere ? `${fmt(doneHere)} attempted · ${fmt(filtered.length - doneHere)} new` : "None attempted yet"}
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="flex flex-1 rounded-xl bg-surface-2 p-1 sm:flex-none" role="radiogroup" aria-label="Practice set size">
                {SET_SIZES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={setSize === n}
                    onClick={() => setSetSize(n)}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors sm:flex-none ${
                      setSize === n ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
                    }`}
                  >
                    {n || "All"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onPractice(filtered, setSize)}
                disabled={!filtered.length}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                <Icon d={I.play} className="h-4 w-4" filled />
                <span>
                  Practice {setCount ? fmt(setCount) : ""}
                  <span className="hidden sm:inline"> random</span>
                </span>
              </button>
            </div>
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
      </div>
    </section>
  );
}
