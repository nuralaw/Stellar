"use client";

import { useEffect, useState } from "react";
import { DOMAINS, type SectionId } from "@/lib/taxonomy";
import type { Attempt } from "@/lib/store";
import type { BankIndexRow, Difficulty, Question } from "@/lib/types";

export interface BankItem {
  id: string;
  /** Number shown to students, e.g. 41 for "m-0041". */
  n: number;
  section: SectionId;
  domain: string;
  skill: string;
  difficulty: Difficulty;
  preview: string;
}

export type Status = "all" | "new" | "incorrect" | "correct" | "bookmarked";
export const STATUSES: { id: Status; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "Not attempted" },
  { id: "incorrect", label: "Incorrect" },
  { id: "correct", label: "Correct" },
  { id: "bookmarked", label: "Bookmarked" },
];
export const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export interface Filters {
  section: SectionId;
  /** Selected skill ids; empty = all skills in the section. */
  skills: string[];
  /** Selected difficulties; empty = all. */
  difficulties: Difficulty[];
  status: Status;
  search: string;
}

const DIFF_CODE = { e: "easy", m: "medium", h: "hard" } as const;

// ---------- index loading ----------

let indexPromise: Promise<BankItem[]> | null = null;
function loadIndex(): Promise<BankItem[]> {
  indexPromise ??= fetch("/api/bank/index")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<BankIndexRow[]>;
    })
    .then((rows) =>
      rows.map(
        ([id, domain, skill, d, preview]): BankItem => ({
          id,
          n: Number(id.split("-")[1]),
          section: id.startsWith("rw-") ? "rw" : "math",
          domain,
          skill,
          difficulty: DIFF_CODE[d],
          preview,
        }),
      ),
    )
    .catch((e) => {
      indexPromise = null; // allow retry
      throw e;
    });
  return indexPromise!;
}

export function useBankIndex(): { items: BankItem[] | null; error: string | null } {
  const [items, setItems] = useState<BankItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    loadIndex().then(
      (x) => alive && setItems(x),
      (e: Error) => alive && setError(e.message),
    );
    return () => {
      alive = false;
    };
  }, []);
  return { items, error };
}

// ---------- full questions (fetched on demand, cached) ----------

const questionCache = new Map<string, Question>();

export function cachedQuestion(id: string): Question | undefined {
  return questionCache.get(id);
}

export async function fetchQuestions(ids: string[]): Promise<void> {
  const missing = ids.filter((id) => !questionCache.has(id));
  if (!missing.length) return;
  const res = await fetch(`/api/questions?ids=${missing.join(",")}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  for (const q of (await res.json()).questions as Question[]) questionCache.set(q.id, q);
}

// ---------- status ----------

/** Latest result per question id. */
export function lastResults(attempts: Attempt[]): Map<string, boolean> {
  const m = new Map<string, boolean>();
  for (const a of attempts) m.set(a.qid, a.correct);
  return m;
}

export function statusOf(id: string, results: Map<string, boolean>, bookmarks: Set<string>, status: Status): boolean {
  switch (status) {
    case "all":
      return true;
    case "new":
      return !results.has(id);
    case "incorrect":
      return results.get(id) === false;
    case "correct":
      return results.get(id) === true;
    case "bookmarked":
      return bookmarks.has(id);
  }
}

// ---------- filtering ----------

export interface FilterContext {
  results: Map<string, boolean>;
  bookmarks: Set<string>;
}

type Facet = "skills" | "difficulties" | "status";

/** Applies all filters except `skip` (used for facet counts). */
export function applyFilters(items: BankItem[], f: Filters, ctx: FilterContext, skip?: Facet): BankItem[] {
  const q = f.search.trim().toLowerCase();
  const num = /^\d+$/.test(q) ? Number(q) : null;
  return items.filter(
    (it) =>
      it.section === f.section &&
      (skip === "skills" || !f.skills.length || f.skills.includes(it.skill)) &&
      (skip === "difficulties" || !f.difficulties.length || f.difficulties.includes(it.difficulty)) &&
      (skip === "status" || statusOf(it.id, ctx.results, ctx.bookmarks, f.status)) &&
      (!q || it.n === num || it.preview.toLowerCase().includes(q)),
  );
}

// ---------- URL <-> filters ----------

export function filtersFromParams(p: URLSearchParams): Filters {
  const section: SectionId = p.get("section") === "math" ? "math" : "rw";
  const sectionSkills = DOMAINS.filter((d) => d.section === section).flatMap((d) => d.skills.map((s) => s.id));
  let skills = (p.get("skills") ?? "").split(",").filter((s) => sectionSkills.includes(s));
  // Legacy links: ?domain=<id>[&skill=<id>]
  const dom = DOMAINS.find((d) => d.id === p.get("domain") && d.section === section);
  if (!skills.length && dom) skills = p.get("skill") && dom.skills.some((s) => s.id === p.get("skill")) ? [p.get("skill")!] : dom.skills.map((s) => s.id);
  const difficulties = (p.get("diff") ?? p.get("difficulty") ?? "").split(",").filter((d): d is Difficulty => (DIFFS as string[]).includes(d));
  const st = p.get("status") as Status | null;
  return {
    section,
    skills,
    difficulties,
    status: st && STATUSES.some((s) => s.id === st) ? st : "all",
    search: p.get("q") ?? "",
  };
}

export function filtersToQuery(f: Filters): string {
  const p = new URLSearchParams({ section: f.section });
  if (f.skills.length) p.set("skills", f.skills.join(","));
  if (f.difficulties.length) p.set("diff", f.difficulties.join(","));
  if (f.status !== "all") p.set("status", f.status);
  if (f.search.trim()) p.set("q", f.search.trim());
  return p.toString();
}

export function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
