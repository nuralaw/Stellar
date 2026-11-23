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
  // The topic whose squares are open in the list (also kept through a run). null = closed by hand, undefined = the default
  // (closed, except a search that matches a single topic).
  const [openTopic, setOpenTopic] = useState<string | null | undefined>(undefined);
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
    // A topic that is gone closes for good (it doesn't pop open if it's ticked again); a new search starts from the default.
    const gone = (id: string) => f.section !== filters?.section || f.bank !== filters?.bank || (f.skills.length ? !f.skills.includes(id) : !f.search.trim());
    setOpenTopic((o) => ((o ? gone(o) : f.search !== filters?.search) ? undefined : o));
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
  const open = (list: BankItem[], index: number) => {
    // A run over one topic (e.g. from a topic's squares) is named after it.
    const one = list.length && list.every((x) => x.skill === list[0].skill) ? skillName(list[0]) : null;
    const title = one ? `${filters!.bank === "cb" ? "College Board · " : ""}${one}` : describe(filters!);
    start({ ids: list.map((x) => x.id), items: byId, title: `${title} · ${list.length.toLocaleString("en-US")} ${list.length === 1 ? "question" : "questions"}`, start: index });
  };
  // No set size: questions keep coming until the student finishes (or the filtered pool runs out).
  const practice = (list: BankItem[]) => {
    start({ ids: shuffle(list).map((x) => x.id), items: byId, title: `Practice · ${describe(filters!)}`, start: 0, endless: true });
  };

  // ?practice=1 (e.g. Home's "Next up" link; any non-zero number works, so old ?practice=10 links too): start practicing with the URL's filters right away, once.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStarted.current || !kept || !filters || !Number(params.get("practice"))) return;
    autoStarted.current = true;
    window.history.replaceState(null, "", `/practice?${filtersToQuery(filters)}`);
    if (getBank(filters.bank).plus && !kept.canBank) return;
    let list = applyFilters(kept.items, filters, { results, bookmarks });
    // Nothing new left with these filters: fall back to the same topics, any status.
    if (!list.length && filters.status !== "all") list = applyFilters(kept.items, { ...filters, status: "all" }, { results, bookmarks });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time start from a link
    if (list.length) practice(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kept, filters]);

  // Questions answered today (for the daily goal in the header).
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
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-36 animate-pulse rounded-2xl bg-surface-2 ${i === 2 ? "col-span-2 lg:col-span-1" : ""}`} />
          ))}
        </div>
        <div className="mt-8 h-8 w-80 max-w-full animate-pulse rounded-lg bg-surface-2" />
        <div className="mt-6 h-11 animate-pulse rounded-xl bg-surface-2" />
        <div className="mt-4 h-11 w-[36rem] max-w-full animate-pulse rounded-xl bg-surface-2" />
        <div className="mt-4 h-20 animate-pulse rounded-2xl bg-surface-2" />
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
        openTopic={openTopic}
        setOpenTopic={setOpenTopic}
        onOpen={open}
        onPractice={practice}
      />
    </>
  );
}
