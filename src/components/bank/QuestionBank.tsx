"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAttempts, useBookmarks, useNow } from "@/lib/store";
import { localDay } from "@/lib/stats";
import { PAGE } from "@/lib/ui";
import { SECTIONS } from "@/lib/taxonomy";
import { ListView } from "./ListView";
import { SolveView, type Run } from "./SolveView";
import { applyFilters, filtersFromParams, filtersToQuery, lastResults, shuffle, skillName, useBankIndex, type BankItem, type Filters } from "./data";

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
    const prefix = f.bank === "cb" ? "College Board · " : "";
    if (f.skills.length === 1) {
      const it = items?.find((x) => x.skill === f.skills[0]);
      if (it) return prefix + skillName(it);
    }
    return prefix + SECTIONS[f.section].name;
  };

  const start = (r: Run) => {
    setRun(r);
    window.scrollTo({ top: 0 });
  };
  const open = (list: BankItem[], index: number) => start({ ids: list.map((x) => x.id), items: byId, title: `${describe(filters)} · ${list.length.toLocaleString("en-US")} questions`, start: index });
  const practice = (list: BankItem[], size: number) => {
    const picked = shuffle(list).slice(0, size || list.length);
    start({ ids: picked.map((x) => x.id), items: byId, title: `Practice set · ${describe(filters)}`, start: 0 });
  };

  // ?practice=10 (e.g. Home's "Next up" link): start a set from the URL's filters right away, once.
  const autoStarted = useRef(false);
  useEffect(() => {
    const size = Number(params.get("practice"));
    if (autoStarted.current || !items || !size) return;
    autoStarted.current = true;
    window.history.replaceState(null, "", `/practice?${filtersToQuery(filters)}`);
    let list = applyFilters(items, filters, { results, bookmarks });
    // Nothing new left with these filters: fall back to the same topics, any status.
    if (!list.length && filters.status !== "all") list = applyFilters(items, { ...filters, status: "all" }, { results, bookmarks });
    if (list.length) practice(list, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Questions answered today (for the daily goal in the list header).
  const now = useNow();
  const today = useMemo(() => {
    const k = localDay(now);
    return now ? attempts.filter((a) => localDay(a.at) === k).length : 0;
  }, [attempts, now]);

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
      <section className={PAGE} aria-label="Loading question bank">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-surface-2" />
        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-lg bg-surface-2" />
        <div className="mt-10 h-8 w-80 max-w-full animate-pulse rounded-lg bg-surface-2" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="hidden h-[32rem] animate-pulse rounded-2xl bg-surface-2 lg:block" />
          <div className="space-y-3">
            <div className="h-11 animate-pulse rounded-xl bg-surface-2" />
            <div className="h-20 animate-pulse rounded-2xl bg-surface-2" />
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-2" />
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
        onRestart={(ids, title) => start({ ids, items: byId, title, start: 0 })}
      />
    );

  return <ListView items={items} filters={filters} setFilters={setFilters} results={results} bookmarks={bookmarks} today={today} onOpen={open} onPractice={practice} />;
}
