"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DOMAINS, SECTIONS, type SectionId } from "@/lib/taxonomy";
import { BANKS, inBank, type BankId } from "@/lib/sources";
import { PlusBadge, PlusLock } from "@/components/PlusLock";
import { SignInHint } from "@/components/plus/SignInHint";
import { LINK_ON_DARK } from "@/components/plus/styles";
import { DIFF_STYLE, TopicsPanel } from "./FilterPanel";
import { QuestionGrid } from "./QuestionGrid";
import { DIFFS, SORTS, STATUSES, applyFilters, emptyFilters, filtersToQuery, sortItems, statusOf, type BankItem, type Filters, type Sort, type Status } from "./data";
import { I, Icon } from "./icons";
import { DAILY_GOAL, PAGE } from "@/lib/ui";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

/** Little icon in each status tab, matching the squares' colours. */
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

export function ListView({
  items,
  canBank,
  filters,
  setFilters,
  results,
  bookmarks,
  today,
  openTopic,
  setOpenTopic,
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
  /** The topic whose squares are shown (see QuestionBank). */
  openTopic: string | null | undefined;
  setOpenTopic: (id: string | null) => void;
  onOpen: (list: BankItem[], index: number) => void;
  onPractice: (list: BankItem[]) => void;
}) {
  const [sheet, setSheet] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const topicsBtn = useRef<HTMLButtonElement>(null);
  const squares = useRef<HTMLDivElement>(null);
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

  // An island per topic: the ticked ones (even without matches, so they can be removed), or with a search and nothing ticked every topic with matches. Taxonomy order.
  const byId = useMemo(() => new Map(items.map((it) => [it.id, it])), [items]);
  const topics = useMemo(() => {
    const ticked = filters.skills.length > 0;
    if (!ticked && !filters.search.trim()) return [];
    const bySkill = new Map<string, BankItem[]>();
    for (const it of filtered) {
      const list = bySkill.get(it.skill);
      if (list) list.push(it);
      else bySkill.set(it.skill, [it]);
    }
    return DOMAINS.filter((d) => d.section === filters.section)
      .flatMap((d) => d.skills)
      .filter((k) => (ticked ? filters.skills.includes(k.id) : bySkill.has(k.id)))
      .map((k) => ({ id: k.id, name: k.name, ticked, list: bySkill.get(k.id) ?? [] }));
  }, [filtered, filters.skills, filters.search, filters.section]);
  // Nothing opened (or the search has moved on from it): a search that matches a single topic opens that one.
  const shown = topics.find((t) => t.id === openTopic) ?? (openTopic !== null && topics.length === 1 && filters.search.trim() ? topics[0] : undefined);
  const active = shown?.list.length ? shown : undefined;
  const activeIds = useMemo(() => active?.list.map((it) => it.id) ?? [], [active]);

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

  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });

  const locked = BANKS.find((b) => b.id === filters.bank)?.plus === true && !canBank;

  const activeCount = filters.skills.length + filters.difficulties.length + (filters.status !== "all" ? 1 : 0) + (filters.search.trim() ? 1 : 0);
  const resetAll = () => setFilters({ ...emptyFilters(filters.bank, filters.section), sort: filters.sort });

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

  return (
    <section className={PAGE}>
      {/* Header */}
      <div className="lg:pr-14">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Question Bank</h1>
        <p className="mt-2 text-muted">Choose a bank and topics, then pick a question or start practicing.</p>
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
                setFilters({ ...emptyFilters(b.id, filters.section), difficulties: filters.difficulties, status: filters.status, sort: filters.sort });
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
            "Filter by skill, then pick any question or start practicing",
            "Wrong answers go straight to your Mistakes list",
          ]}
          fact={`${fmt(bankTotals.cb)} College Board questions stay free`}
          footer={
            <>
              {/* A Link to this same URL wouldn't reset the state, so the free step is a button. */}
              <p className="mt-3 text-sm">
                <button type="button" onClick={() => setFilters({ ...emptyFilters("cb", filters.section), sort: filters.sort })} className={LINK_ON_DARK}>
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
              onClick={() => setFilters({ ...emptyFilters(filters.bank, s), difficulties: filters.difficulties, status: filters.status, sort: filters.sort })}
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

      <div className="mt-6 min-w-0">
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

        {/* Status: tabs, so Unsolved / Solved is impossible to miss */}
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
              ref={topicsBtn}
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
                  setFilters={setFilters}
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

          {filters.search.trim() && (
            <>
              <span className="mx-1 hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
              <Chip label={`“${filters.search.trim()}”`} onRemove={() => set({ search: "" })}>
                “{filters.search.trim()}”
              </Chip>
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
              {filtered.length > 0 && <> · no limit, finish whenever you want</>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPractice(filtered)}
            disabled={!filtered.length}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <Icon d={I.play} className="h-4 w-4" filled />
            Practice
          </button>
        </div>

        {/* One island per topic; the open one shows its squares below */}
        {topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((t) => {
              const on = active?.id === t.id;
              const done = t.list.filter((it) => results.has(it.id)).length;
              return (
                <div
                  key={t.id}
                  className={`inline-flex max-w-full items-center rounded-full border shadow-sm transition-[opacity,scale,background-color,border-color] duration-200 starting:scale-95 starting:opacity-0 ${
                    on ? "border-primary bg-primary-soft text-primary-strong" : "border-line bg-surface"
                  } ${t.list.length ? "" : "text-muted"}`}
                >
                  <button
                    type="button"
                    disabled={!t.list.length}
                    aria-expanded={on}
                    aria-controls={on ? "topic-squares" : undefined}
                    onClick={() => {
                      setOpenTopic(on ? null : t.id);
                      // Bring the squares fully into view (once they are laid out).
                      if (!on) setTimeout(() => squares.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 60);
                    }}
                    className={`inline-flex h-9 min-w-0 items-center gap-2 rounded-full pl-3.5 ${t.ticked ? "pr-2" : "pr-3.5"} ${t.list.length ? "" : "cursor-default"}`}
                  >
                    <span className="min-w-0 truncate text-sm font-semibold">{t.name}</span>
                    <span className="shrink-0 text-xs text-muted tabular-nums">
                      {done}/{t.list.length}
                    </span>
                    <Icon d={I.chevronD} className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform ${on ? "rotate-180" : ""}`} />
                  </button>
                  {t.ticked && (
                    <button
                      type="button"
                      onClick={() => set({ skills: filters.skills.filter((x) => x !== t.id) })}
                      aria-label={`Remove topic: ${t.name}`}
                      className="mr-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                    >
                      <Icon d={I.x} className="h-3 w-3" strokeWidth={2.4} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {active && (
          <div
            key={active.id}
            id="topic-squares"
            ref={squares}
            className="mt-3 scroll-mb-4 rounded-2xl border border-line bg-surface transition-[opacity,translate] duration-200 starting:-translate-y-2 starting:opacity-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 px-4 pt-3 pb-1">
              <p className="min-w-0 truncate font-semibold">{active.name}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
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
            <QuestionGrid
              ids={activeIds}
              items={byId}
              tone={(id) => results.get(id)}
              bookmarks={bookmarks}
              align="start"
              onPick={(i) => onOpen(active.list, i)}
              maxHeight="18rem"
              label={`${active.name} questions`}
              resetKey={`${active.id}|${filtersToQuery(filters)}`}
            />
          </div>
        )}

        {filtered.length === 0 ? (
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
          // No topic or search yet.
          topics.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-line px-6 py-8 text-center">
              <p className="font-semibold">Choose a topic to see its questions</p>
              <p className="mt-1 text-sm text-muted">Or press Practice to start with everything here.</p>
              <button
                type="button"
                onClick={() => {
                  setSheet(true);
                  // On desktop the dropdown hangs under the Topics button.
                  topicsBtn.current?.scrollIntoView({ block: "nearest" });
                  topicsBtn.current?.focus({ preventScroll: true }); // the dropdown comes right after it in Tab order
                }}
                className="mt-4 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-2"
              >
                Choose topics
              </button>
            </div>
          )
        )}
      </div>
        </>
      )}
    </section>
  );
}
