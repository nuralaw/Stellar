"use client";

import Link from "next/link";
import { useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { useHydrated, useVocab, type VocabState } from "@/lib/store";

export interface HomeSet {
  id: string;
  list: "core" | "power" | "math";
  title: string;
  subtitle: string;
  ids: string[];
}
export interface HomeWord {
  id: string;
  word: string;
  pos: string;
  def: string;
  set: string;
}

type Tab = HomeSet["list"];
const TAB_KEY = "stellar:vocab-tab";

export const known = (v: Record<string, VocabState>, ids: string[]) => ids.filter((id) => v[id]?.s === 2).length;
const touched = (v: Record<string, VocabState>, ids: string[]) => ids.some((id) => v[id]);

function Progress({ have, total }: { have: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <div className="stat-grow h-full rounded-full bg-primary" style={{ width: `${(have / total) * 100}%` }} />
      </div>
      <span className="shrink-0 text-xs font-medium text-muted tabular-nums">
        {have}/{total}
      </span>
    </div>
  );
}

export function VocabHome({ sets, words, lists }: { sets: HomeSet[]; words: HomeWord[]; lists: { id: Tab; label: string; blurb: string }[] }) {
  const hydrated = useHydrated();
  const v = useVocab();
  const [q, setQ] = useState("");
  const [chosen, setChosen] = useState<Tab | null>(null);
  let remembered: Tab | null = null;
  if (hydrated)
    try {
      const t = localStorage.getItem(TAB_KEY);
      remembered = t === "core" || t === "power" || t === "math" ? t : null;
    } catch {}
  const tab: Tab = chosen ?? remembered ?? "core";
  const pick = (t: Tab) => {
    setChosen(t);
    try {
      localStorage.setItem(TAB_KEY, t);
    } catch {}
  };

  // One suggestion: the set started most recently and not finished, else the first set not done.
  const last = (s: HomeSet) => Math.max(0, ...s.ids.map((id) => v[id]?.at ?? 0));
  const open = sets.filter((s) => touched(v, s.ids) && known(v, s.ids) < s.ids.length).sort((a, b) => last(b) - last(a))[0];
  const next = open ?? sets.find((s) => known(v, s.ids) < s.ids.length);
  const totalKnown = hydrated ? words.filter((w) => v[w.id]?.s === 2).length : 0;

  const query = q.trim().toLowerCase();
  const hits = query ? words.filter((w) => w.word.includes(query) || w.def.toLowerCase().includes(query)).slice(0, 40) : [];
  const setTitle = new Map(sets.map((s) => [s.id, s.title]));

  return (
    <>
      {/* One suggested set */}
      <div className="mt-8 min-h-[120px]">
        {hydrated && next && (
          <div className="lesson-in flex flex-col gap-4 rounded-2xl bg-primary-soft/50 p-5 ring-1 ring-primary/25 sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-primary">{open ? "Pick up where you left off" : totalKnown ? "Next set" : "Start here"}</p>
              <p className="mt-1 text-xl font-bold tracking-tight">
                {next.title} <span className="text-base font-medium text-muted">· {lists.find((l) => l.id === next.list)?.label}</span>
              </p>
              <div className="mt-2 max-w-sm">
                <Progress have={known(v, next.ids)} total={next.ids.length} />
              </div>
            </div>
            <Link
              href={`/vocabulary/${next.id}/cards`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
            >
              {open ? "Continue" : "Start flashcards"}
              <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        )}
      </div>

      {/* Search every word */}
      <div className="relative mt-8">
        <Icon d={I.search} className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${words.length} words and definitions`}
          className="w-full rounded-xl border border-line bg-surface py-3 pr-4 pl-10 text-[15px] outline-none placeholder:text-muted focus:border-primary/60 focus:ring-3 focus:ring-primary/15"
        />
      </div>

      {query ? (
        <div className="mt-4">
          {hits.length ? (
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {hits.map((w, i) => (
                <li key={w.id} className="lesson-in" style={{ animationDelay: `${Math.min(i, 10) * 25}ms` }}>
                  <Link href={`/vocabulary/${w.set}#${w.id}`} className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-surface-2/60">
                    <span className="font-semibold">{w.word}</span>
                    <span className="text-xs text-muted">{w.pos}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-muted">{w.def}</span>
                    <span className="hidden shrink-0 text-xs text-muted sm:inline">{setTitle.get(w.set)}</span>
                    {hydrated && v[w.id]?.s === 2 && <Icon d={I.check} className="h-4 w-4 shrink-0 text-success" strokeWidth={2.6} />}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-line px-6 py-8 text-center text-sm text-muted">No word matches “{q.trim()}”.</p>
          )}
        </div>
      ) : (
        <>
          {/* Lists */}
          <div className="mt-8 flex gap-1 overflow-x-auto shadow-[inset_0_-1px_0_var(--color-line)] [scrollbar-width:none]" role="tablist">
            {lists.map((l) => {
              const ids = sets.filter((s) => s.list === l.id).flatMap((s) => s.ids);
              const uniq = [...new Set(ids)];
              const k = hydrated ? known(v, uniq) : 0;
              const on = tab === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(l.id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                    on ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${on ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted"}`}>
                    {k ? `${k}/${uniq.length}` : uniq.length}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">{lists.find((l) => l.id === tab)?.blurb}</p>
          <div key={tab} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sets
              .filter((s) => s.list === tab)
              .map((s, i) => {
                const k = hydrated ? known(v, s.ids) : 0;
                const done = k === s.ids.length;
                return (
                  <Link
                    key={s.id}
                    href={`/vocabulary/${s.id}`}
                    style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                    className="lesson-in group flex min-h-28 flex-col rounded-2xl bg-surface p-4 ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-16px_rgb(0_0_0/0.35)] hover:ring-muted/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="leading-snug font-semibold group-hover:text-primary">{s.title}</span>
                      {done ? (
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success" title="All known">
                          <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-xs text-muted tabular-nums">{s.ids.length} words</span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{s.subtitle}</p>
                    <div className="mt-auto pt-3">{k > 0 ? <Progress have={k} total={s.ids.length} /> : <span className="text-xs font-medium text-primary">Not started</span>}</div>
                  </Link>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}
