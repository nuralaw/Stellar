"use client";

import { useEffect, useRef } from "react";
import { SECTIONS, domainsFor, type SectionId } from "@/lib/taxonomy";
import type { Difficulty } from "@/lib/types";
import { DIFFS, STATUSES, type BankItem, type Filters, type Status } from "./data";

const DIFF_DOT: Record<Difficulty, string> = { easy: "bg-success", medium: "bg-accent", hard: "bg-danger" };

function countBy<K extends string>(items: BankItem[], key: (it: BankItem) => K): Record<string, number> {
  const out: Record<string, number> = {};
  for (const it of items) out[key(it)] = (out[key(it)] ?? 0) + 1;
  return out;
}

/** Checkbox that supports the "indeterminate" (some children selected) state. */
function Check({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return <input ref={ref} type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="h-4 w-4 shrink-0 accent-[var(--primary)]" />;
}

function Group({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function FilterPanel({
  filters,
  setFilters,
  forSkills,
  forDiffs,
  statusCounts,
  sectionTotals,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  /** Items matching every filter except skills (for skill counts). */
  forSkills: BankItem[];
  /** Items matching every filter except difficulty. */
  forDiffs: BankItem[];
  /** Count per status, with every other filter applied. */
  statusCounts: Record<Status, number>;
  sectionTotals: Record<SectionId, number>;
}) {
  const skillCounts = countBy(forSkills, (it) => it.skill);
  const diffCounts = countBy(forDiffs, (it) => it.difficulty);
  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });

  const toggleSkill = (id: string) =>
    set({ skills: filters.skills.includes(id) ? filters.skills.filter((s) => s !== id) : [...filters.skills, id] });
  const toggleDomain = (skillIds: string[]) => {
    const allOn = skillIds.every((s) => filters.skills.includes(s));
    set({ skills: allOn ? filters.skills.filter((s) => !skillIds.includes(s)) : [...new Set([...filters.skills, ...skillIds])] });
  };
  const toggleDiff = (d: Difficulty) =>
    set({ difficulties: filters.difficulties.includes(d) ? filters.difficulties.filter((x) => x !== d) : [...filters.difficulties, d] });

  const statusCount = (s: Status) => statusCounts[s];

  const activeCount = filters.skills.length + filters.difficulties.length + (filters.status !== "all" ? 1 : 0) + (filters.search.trim() ? 1 : 0);

  return (
    <div className="space-y-0">
      {/* Section */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1" role="tablist" aria-label="Section">
        {(["rw", "math"] as SectionId[]).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={filters.section === s}
            onClick={() => setFilters({ section: s, skills: [], difficulties: filters.difficulties, status: filters.status, search: "" })}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${filters.section === s ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
          >
            {SECTIONS[s].short}
            <span className="ml-1.5 text-xs font-medium text-muted tabular-nums">{sectionTotals[s].toLocaleString("en-US")}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <label htmlFor="bank-search" className="sr-only">
          Search questions
        </label>
        <input
          id="bank-search"
          type="search"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search text or question #"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <Group
        title="Topics"
        action={
          filters.skills.length > 0 && (
            <button type="button" onClick={() => set({ skills: [] })} className="text-xs font-medium text-primary hover:underline">
              Clear
            </button>
          )
        }
      >
        <ul className="space-y-3">
          {domainsFor(filters.section).map((d) => {
            const ids = d.skills.map((s) => s.id);
            const on = ids.filter((s) => filters.skills.includes(s)).length;
            const total = ids.reduce((n, s) => n + (skillCounts[s] ?? 0), 0);
            return (
              <li key={d.id}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
                  <Check checked={on === ids.length} indeterminate={on > 0 && on < ids.length} onChange={() => toggleDomain(ids)} label={d.name} />
                  <span className="flex-1">{d.name}</span>
                  <span className="text-xs font-medium text-muted tabular-nums">{total}</span>
                </label>
                <ul className="mt-1.5 space-y-1 border-l border-line pl-3.5 ml-2">
                  {d.skills.map((s) => (
                    <li key={s.id}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-md py-0.5 text-sm text-muted hover:text-ink">
                        <Check checked={filters.skills.includes(s.id)} onChange={() => toggleSkill(s.id)} label={s.name} />
                        <span className="flex-1">{s.name}</span>
                        <span className="text-xs tabular-nums">{skillCounts[s.id] ?? 0}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Difficulty">
        <div className="flex flex-wrap gap-2">
          {DIFFS.map((d) => {
            const on = filters.difficulties.includes(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={on}
                onClick={() => toggleDiff(d)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  on ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${DIFF_DOT[d]}`} aria-hidden="true" />
                {d}
                <span className="text-xs tabular-nums opacity-70">{diffCounts[d] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Status">
        <div className="space-y-1">
          {STATUSES.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2.5 rounded-md py-0.5 text-sm text-muted hover:text-ink">
              <input
                type="radio"
                name="status"
                checked={filters.status === s.id}
                onChange={() => set({ status: s.id })}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className={`flex-1 ${filters.status === s.id ? "font-medium text-ink" : ""}`}>{s.label}</span>
              <span className="text-xs tabular-nums">{statusCount(s.id)}</span>
            </label>
          ))}
        </div>
      </Group>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => setFilters({ section: filters.section, skills: [], difficulties: [], status: "all", search: "" })}
          className="mt-2 w-full rounded-xl border border-line px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          Reset filters ({activeCount})
        </button>
      )}
    </div>
  );
}
