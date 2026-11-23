"use client";

import { useEffect, useState } from "react";
import { useAccess } from "@/lib/access";
import { DOMAINS, getDomain, type SectionId } from "@/lib/taxonomy";
import type { Attempt } from "@/lib/store";
import { BANKS, inBank, type BankId, type SourceId } from "@/lib/sources";
import type { BankIndexRow, Difficulty, Question } from "@/lib/types";

export interface BankItem {
  id: string;
  /** Number shown to students, e.g. 41 for "m-0041". */
  n: number;
  section: SectionId;
  source: SourceId;
  domain: string;
  skill: string;
  difficulty: Difficulty;
  preview: string;
}

export type Status = "all" | "new" | "solved" | "incorrect" | "correct" | "bookmarked";
/** Status tabs above the list. ("correct" still works from a URL but has no tab.) */
export const STATUSES: { id: Status; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "Unsolved" },
  { id: "solved", label: "Solved" },
  { id: "incorrect", label: "Incorrect" },
  { id: "bookmarked", label: "Bookmarked" },
];
const STATUS_IDS: Status[] = ["all", "new", "solved", "incorrect", "correct", "bookmarked"];
export const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export type Sort = "number" | "easy-first" | "hard-first";
export const SORTS: { id: Sort; label: string }[] = [
  { id: "number", label: "Question #" },
  { id: "easy-first", label: "Easiest first" },
  { id: "hard-first", label: "Hardest first" },
];

export function skillName(it: { domain: string; skill: string }) {
  return getDomain(it.domain)?.skills.find((s) => s.id === it.skill)?.name ?? it.skill;
}

export interface Filters {
  bank: BankId;
  section: SectionId;
  /** Selected skill ids; empty = all skills in the section. */
  skills: string[];
  /** Selected difficulties; empty = all. */
  difficulties: Difficulty[];
  status: Status;
  search: string;
  sort: Sort;
}

export function emptyFilters(bank: BankId, section: SectionId): Filters {
  return { bank, section, skills: [], difficulties: [], status: "all", search: "", sort: "number" };
}

const DIFF_CODE = { e: "easy", m: "medium", h: "hard" } as const;

// ---------- index loading ----------

// The server sends every row but blanks the previews of Plus-only questions for visitors without Plus,
// so the two variants are cached separately.
type IndexVariant = "full" | "free";
const indexPromises = new Map<IndexVariant, Promise<BankItem[]>>();
function loadIndex(variant: IndexVariant): Promise<BankItem[]> {
  let p = indexPromises.get(variant);
  if (!p) {
    const request: Promise<BankItem[]> = fetch("/api/bank/index", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        // The server gave the other variant (e.g. it couldn't confirm Plus): use the answer now, but don't keep it
        // under this variant's name, so the next mount asks again.
        const applied = r.headers.get("X-Bank-Access");
        if (applied && applied !== variant && indexPromises.get(variant) === request) indexPromises.delete(variant);
        return r.json() as Promise<BankIndexRow[]>;
      })
      .then((rows) =>
        rows.map(
          ([id, domain, skill, d, preview, source]): BankItem => ({
            id,
            n: Number(id.split("-")[1]),
            section: id.startsWith("rw-") ? "rw" : "math",
            source: source ?? "cb",
            domain,
            skill,
            difficulty: DIFF_CODE[d],
            preview,
          }),
        ),
      )
      .catch((e) => {
        indexPromises.delete(variant); // allow retry
        throw e;
      });
    indexPromises.set(variant, request);
    p = request;
  }
  return p;
}

/** The question list for the visitor's plan. Waits until the plan is known; `items` stays null until then. */
export function useBankIndex(): { items: BankItem[] | null; error: string | null } {
  const access = useAccess();
  const variant: IndexVariant = access.can("question-bank") ? "full" : "free";
  const [state, setState] = useState<{ variant: IndexVariant; items: BankItem[] | null; error: string | null } | null>(null);
  useEffect(() => {
    if (!access.ready) return;
    let alive = true;
    loadIndex(variant).then(
      (items) => alive && setState({ variant, items, error: null }),
      (e: Error) => alive && setState({ variant, items: null, error: e.message }),
    );
    return () => {
      alive = false;
    };
  }, [access.ready, variant]);
  // An answer for the other variant is stale (the plan changed): show nothing until the right one arrives.
  const mine = access.ready && state?.variant === variant ? state : null;
  return { items: mine?.items ?? null, error: mine?.error ?? null };
}

// ---------- full questions (fetched on demand, cached) ----------

const questionCache = new Map<string, Question>();

export function cachedQuestion(id: string): Question | undefined {
  return questionCache.get(id);
}

/**
 * Loads the questions that aren't cached yet. Throws on HTTP / network errors. Questions the server leaves out (this visitor
 * can't open them, or they no longer exist) don't throw: they come back in `missing`, and `plan` says which variant the server applied.
 */
export async function fetchQuestions(ids: string[]): Promise<{ missing: string[]; plan: "full" | "free" | null }> {
  const todo = ids.filter((id) => !questionCache.has(id));
  if (!todo.length) return { missing: [], plan: null };
  const res = await fetch(`/api/questions?ids=${todo.join(",")}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  for (const q of (await res.json()).questions as Question[]) questionCache.set(q.id, q);
  const applied = res.headers.get("X-Bank-Access");
  return { missing: todo.filter((id) => !questionCache.has(id)), plan: applied === "full" || applied === "free" ? applied : null };
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
    case "solved":
      return results.has(id);
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
  // "123" or "#123" is a question number if there is such a question here; otherwise it is looked up in the text.
  const num = /^#?\d+$/.test(q) ? Number(q.replace("#", "")) : null;
  const byNumber = num !== null && items.some((it) => it.n === num && it.section === f.section && inBank(f.bank, it.source));
  return items.filter(
    (it) =>
      it.section === f.section &&
      inBank(f.bank, it.source) &&
      (skip === "skills" || !f.skills.length || f.skills.includes(it.skill)) &&
      (skip === "difficulties" || !f.difficulties.length || f.difficulties.includes(it.difficulty)) &&
      (skip === "status" || statusOf(it.id, ctx.results, ctx.bookmarks, f.status)) &&
      (!q || (byNumber ? it.n === num : it.preview.toLowerCase().includes(q))),
  );
}

const DIFF_RANK: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

export function sortItems(items: BankItem[], sort: Sort): BankItem[] {
  if (sort === "number") return items;
  const dir = sort === "easy-first" ? 1 : -1;
  return [...items].sort((a, b) => dir * (DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty]) || a.n - b.n);
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
  const bank = BANKS.find((b) => b.id === p.get("bank"))?.id ?? "all";
  return {
    bank,
    section,
    skills,
    difficulties,
    status: st && STATUS_IDS.includes(st) ? st : "all",
    search: p.get("q") ?? "",
    sort: SORTS.some((s) => s.id === p.get("sort")) ? (p.get("sort") as Sort) : "number",
  };
}

export function filtersToQuery(f: Filters): string {
  const p = new URLSearchParams({ section: f.section });
  if (f.bank !== "all") p.set("bank", f.bank);
  if (f.skills.length) p.set("skills", f.skills.join(","));
  if (f.difficulties.length) p.set("diff", f.difficulties.join(","));
  if (f.status !== "all") p.set("status", f.status);
  if (f.search.trim()) p.set("q", f.search.trim());
  if (f.sort !== "number") p.set("sort", f.sort);
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
