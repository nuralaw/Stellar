"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccess } from "@/lib/access";
import { FREE_BANK, getBank, sourceOpen } from "@/lib/sources";
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
  const access = useAccess();
  const attempts = useAttempts();
  const bookmarkList = useBookmarks();
  const results = useMemo(() => lastResults(attempts), [attempts]);
  const bookmarks = useMemo(() => new Set(bookmarkList), [bookmarkList]);

  // The run and the filters live here, so a change of plan (which restarts the list below) doesn't drop them.
  const [run, setRun] = useState<Run | null>(null);
  const [filters, setFiltersState] = useState<Filters | null>(null);
  // The last list the server gave, with the plan it was made for. It's kept while the plan is looked up again
  // (sign-in, refresh), so only the first load shows the skeleton.
  const [kept, setKept] = useState<{ items: BankItem[]; canBank: boolean } | null>(null);
  if (items && kept?.items !== items) {
    const canBank = access.can("question-bank");
    setKept({ items, canBank });
    if (!filters) {
      const f = filtersFromParams(params);
      // Links without a bank (Home, lessons, test results) open the free bank for visitors without Plus.
      setFiltersState(!canBank && !params.has("bank") ? { ...f, bank: FREE_BANK } : f);
    }
  }
  const canBank = kept?.canBank ?? false;

  const setFilters = (f: Filters) => {
    setFiltersState(f);
    // Keep filters in the URL (shareable, survives refresh) without a navigation.
    window.history.replaceState(null, "", `/practice?${filtersToQuery(f)}`);
  };

  const byId = useMemo(() => new Map((kept?.items ?? []).map((it) => [it.id, it])), [kept]);

  const describe = (f: Filters) => {
    const prefix = f.bank === "cb" ? "College Board · " : "";
    if (f.skills.length === 1) {
      const it = kept?.items.find((x) => x.skill === f.skills[0]);
      if (it) return prefix + skillName(it);
    }
    return prefix + SECTIONS[f.section].name;
  };

  const start = (r: Run) => {
    // Never start a run with questions this visitor can't open.
    if (!r.ids.every((id) => sourceOpen(byId.get(id)?.source ?? "cb", canBank))) return;
    setRun(r);
    window.scrollTo({ top: 0 });
  };
  const open = (list: BankItem[], index: number) => start({ ids: list.map((x) => x.id), items: byId, title: `${describe(filters!)} · ${list.length.toLocaleString("en-US")} questions`, start: index });
  const practice = (list: BankItem[], size: number) => {
    const picked = shuffle(list).slice(0, size || list.length);
    start({ ids: picked.map((x) => x.id), items: byId, title: `Practice set · ${describe(filters!)}`, start: 0 });
  };

  // ?practice=10 (e.g. Home's "Next up" link): start a set from the URL's filters right away, once.
  const autoStarted = useRef(false);
  useEffect(() => {
    const size = Number(params.get("practice"));
    if (autoStarted.current || !kept || !filters || !size) return;
    autoStarted.current = true;
    window.history.replaceState(null, "", `/practice?${filtersToQuery(filters)}`);
    if (getBank(filters.bank).plus && !kept.canBank) return;
    let list = applyFilters(kept.items, filters, { results, bookmarks });
    // Nothing new left with these filters: fall back to the same topics, any status.
    if (!list.length && filters.status !== "all") list = applyFilters(kept.items, { ...filters, status: "all" }, { results, bookmarks });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time start from a link
    if (list.length) practice(list, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kept, filters]);

  // Questions answered today (for the daily goal in the list header).
  const now = useNow();
  const today = useMemo(() => {
    const k = localDay(now);
    return now ? attempts.filter((a) => localDay(a.at) === k).length : 0;
  }, [attempts, now]);

  // An open run stays open whatever happens to the list or the plan (a question that has become locked shows SolveView's error).
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

  if (error && !kept)
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
        <p className="font-semibold">Couldn&apos;t load the question bank ({error}).</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-3 text-sm font-semibold text-primary-strong hover:underline">
          Reload
        </button>
      </section>
    );

  if (!kept || !filters)
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

  return (
    <>
      {/* The list for the new plan didn't load (e.g. right after signing in): the old list stays, and says so. */}
      {error && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-8">
          <p role="alert" className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger">
            <span>Couldn&apos;t refresh the question bank ({error}).</span>
            <button type="button" onClick={() => window.location.reload()} className="font-semibold underline">
              Reload
            </button>
          </p>
        </div>
      )}
      <ListView
        key={canBank ? "bank" : "free"}
        items={kept.items}
        canBank={canBank}
        filters={filters}
        setFilters={setFilters}
        results={results}
        bookmarks={bookmarks}
        today={today}
        onOpen={open}
        onPractice={practice}
      />
    </>
  );
}
