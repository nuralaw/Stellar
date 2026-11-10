"use client";

import { useEffect, useRef, useState } from "react";
import { domainsFor } from "@/lib/taxonomy";
import type { Difficulty } from "@/lib/types";
import type { BankItem, Filters } from "./data";
import { I, Icon } from "./icons";

export const DIFF_STYLE: Record<Difficulty, { dot: string; text: string; on: string }> = {
  easy: { dot: "bg-success", text: "text-success", on: "border-success bg-success-soft text-success" },
  medium: { dot: "bg-accent", text: "text-accent", on: "border-accent bg-accent-soft text-accent" },
  hard: { dot: "bg-danger", text: "text-danger", on: "border-danger bg-danger-soft text-danger" },
};

function countBy(items: BankItem[], key: (it: BankItem) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const it of items) out[key(it)] = (out[key(it)] ?? 0) + 1;
  return out;
}

/** Checkbox with an "indeterminate" (some children selected) state, styled to match the palette. */
function Check({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return (
    <span className="relative grid h-4.5 w-4.5 shrink-0 place-items-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="peer h-4.5 w-4.5 cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-line bg-surface transition-colors checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
      />
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute hidden h-3.5 w-3.5 text-primary-ink peer-checked:block" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={I.check} />
      </svg>
      <span className="pointer-events-none absolute hidden h-[2.5px] w-2 rounded-full bg-primary-ink peer-indeterminate:block" aria-hidden="true" />
    </span>
  );
}

function MiniBar({ value }: { value: number }) {
  return (
    <span className="block h-1 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
      <span className="block h-full rounded-full bg-primary/70" style={{ width: `${Math.min(100, value * 100)}%` }} />
    </span>
  );
}

/** Topic picker (domains → skills) shown in the Topics dropdown / bottom sheet. */
export function TopicsPanel({
  filters,
  setFilters,
  forSkills,
  doneBySkill,
  totalBySkill,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  /** Items matching every filter except skills (for skill counts). */
  forSkills: BankItem[];
  /** Attempted questions per skill (ignores filters) — drives the progress bars. */
  doneBySkill: Record<string, number>;
  totalBySkill: Record<string, number>;
}) {
  const skillCounts = countBy(forSkills, (it) => it.skill);
  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });
  const domains = domainsFor(filters.section);

  // Domains with a selected skill start open; the rest are collapsed to keep the panel short.
  const [open, setOpen] = useState<Set<string>>(() => new Set(domains.filter((d) => d.skills.some((s) => filters.skills.includes(s.id))).map((d) => d.id)));
  const toggleOpen = (id: string) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const toggleSkill = (id: string) => set({ skills: filters.skills.includes(id) ? filters.skills.filter((s) => s !== id) : [...filters.skills, id] });
  const toggleDomain = (skillIds: string[]) => {
    const allOn = skillIds.every((s) => filters.skills.includes(s));
    set({ skills: allOn ? filters.skills.filter((s) => !skillIds.includes(s)) : [...new Set([...filters.skills, ...skillIds])] });
  };

  return (
    <ul className="space-y-0.5 px-3 pb-3">
      {domains.map((d) => {
        const ids = d.skills.map((s) => s.id);
        const on = ids.filter((s) => filters.skills.includes(s)).length;
        const count = ids.reduce((n, s) => n + (skillCounts[s] ?? 0), 0);
        const done = ids.reduce((n, s) => n + (doneBySkill[s] ?? 0), 0);
        const total = ids.reduce((n, s) => n + (totalBySkill[s] ?? 0), 0);
        const isOpen = open.has(d.id);
        return (
          <li key={d.id} className={`rounded-xl transition-colors ${isOpen ? "bg-surface-2/50" : ""}`}>
            <div className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-surface-2/70">
              <Check checked={on === ids.length} indeterminate={on > 0 && on < ids.length} onChange={() => toggleDomain(ids)} label={`All of ${d.name}`} />
              <button type="button" onClick={() => toggleOpen(d.id)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug font-semibold">{d.name}</span>
                  {done > 0 && (
                    <span className="mt-1.5 flex items-center gap-2">
                      <MiniBar value={done / total} />
                      <span className="shrink-0 text-[10px] text-muted tabular-nums">
                        {done}/{total}
                      </span>
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted tabular-nums">{count}</span>
                <Icon d={I.chevronD} className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {isOpen && (
              <ul className="pb-2">
                {d.skills.map((s) => {
                  const sel = filters.skills.includes(s.id);
                  return (
                    <li key={s.id}>
                      <label className={`flex cursor-pointer items-center gap-2.5 rounded-lg py-1.5 pr-8 pl-6 text-sm transition-colors hover:bg-surface-2 ${sel ? "text-ink" : "text-muted hover:text-ink"}`}>
                        <Check checked={sel} onChange={() => toggleSkill(s.id)} label={s.name} />
                        <span className={`flex-1 leading-snug ${sel ? "font-medium" : ""}`}>{s.name}</span>
                        <span className="text-xs tabular-nums">{skillCounts[s.id] ?? 0}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
