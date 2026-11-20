"use client";

import Link from "next/link";
import { useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { TestResult } from "@/lib/store";
import { getDomain, getSkill } from "@/lib/taxonomy";
import { MODULE_INFO, testName, type ModuleId, type PracticeTest } from "@/lib/test-types";
import { isTestCorrect } from "@/lib/test-score";
import { TestQuestionView } from "./TestQuestionView";

const MODULES = Object.keys(MODULE_INFO) as ModuleId[];

/** Score report + per-question review of one finished attempt. */
export function TestResults({ test, result }: { test: PracticeTest; result: TestResult }) {
  const responses = result.responses ?? {};
  const taken = MODULES.filter((m) => test.modules[m]?.length && (result.kind === "full" || !result.kind || MODULE_INFO[m].section === result.kind));
  const [open, setOpen] = useState<string | null>(null);
  const [onlyWrong, setOnlyWrong] = useState(false);

  const sections = [...new Set(taken.map((m) => MODULE_INFO[m].section))];
  const sectionStats = sections.map((sec) => {
    const qs = taken.filter((m) => MODULE_INFO[m].section === sec).flatMap((m) => test.modules[m]!);
    return { sec, score: sec === "rw" ? result.rw : result.math, correct: qs.filter((q) => isTestCorrect(q, responses[q.key])).length, total: qs.length };
  });

  // Weakest skills: lowest accuracy among skills with ≥2 questions.
  const bySkill = new Map<string, { skill: string; domain: string; correct: number; total: number }>();
  for (const m of taken)
    for (const q of test.modules[m]!) {
      const e = bySkill.get(q.skill) ?? { skill: q.skill, domain: q.domain, correct: 0, total: 0 };
      e.total++;
      if (isTestCorrect(q, responses[q.key])) e.correct++;
      bySkill.set(q.skill, e);
    }
  const weak = [...bySkill.values()]
    .filter((e) => e.total >= 2 && e.correct < e.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total || b.total - a.total)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/test" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <Icon d={I.chevronL} className="h-4 w-4" /> All practice tests
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{testName(test)}</h1>
      <p className="mt-1 text-sm text-muted">
        Finished {new Date(result.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-muted">{sections.length === 2 ? "Total score" : "Section score"}</p>
          <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums">{result.total}</p>
          <p className="mt-1 text-xs text-muted">{sections.length === 2 ? "out of 1600" : "out of 800"} · estimated</p>
        </div>
        {sectionStats.map((st) => (
          <div key={st.sec} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-muted">{st.sec === "rw" ? "Reading and Writing" : "Math"}</p>
            <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">{st.score}</p>
            <p className="mt-1 text-xs text-muted tabular-nums">
              {st.correct} of {st.total} correct
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Scores are estimated from the number of correct answers with a typical Digital SAT conversion curve.</p>

      {weak.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Work on next</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {weak.map((w) => (
              <Link
                key={w.skill}
                href={`/practice?section=${getDomain(w.domain)?.section ?? "rw"}&skills=${w.skill}`}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm transition-colors hover:border-primary/50 hover:bg-primary-soft/40"
              >
                {getSkill(w.skill)?.name ?? w.skill} <span className="text-muted tabular-nums">· {w.correct}/{w.total}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Review questions</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          Only incorrect and unanswered
        </label>
      </div>

      {taken.map((m) => {
        const qs = test.modules[m]!;
        const correct = qs.filter((q) => isTestCorrect(q, responses[q.key])).length;
        const shown = onlyWrong ? qs.filter((q) => !isTestCorrect(q, responses[q.key])) : qs;
        return (
          <section key={m} className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{MODULE_INFO[m].label}</h3>
              <p className="text-sm text-muted tabular-nums">
                {correct}/{qs.length} correct
              </p>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
              {shown.length === 0 && <p className="px-5 py-4 text-sm text-muted">All correct 🎉</p>}
              {shown.map((q) => {
                const r = responses[q.key];
                const ok = isTestCorrect(q, r);
                const isOpen = open === q.key;
                return (
                  <div key={q.key} className="border-b border-line last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : q.key)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 sm:px-5"
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-white dark:text-primary-ink ${ok ? "bg-[var(--chart-correct)]" : r ? "bg-[var(--chart-wrong)]" : "bg-muted/60"}`}
                        aria-label={ok ? "Correct" : r ? "Incorrect" : "Not answered"}
                      >
                        <Icon d={ok ? I.check : I.x} className="h-3.5 w-3.5" strokeWidth={2.8} />
                      </span>
                      <span className="w-8 shrink-0 font-semibold tabular-nums">{q.n}</span>
                      <span className="min-w-0 flex-1 truncate text-sm text-muted">{getSkill(q.skill)?.name ?? q.skill}</span>
                      <span className="hidden shrink-0 text-sm tabular-nums sm:inline">
                        <span className="text-muted">You:</span> {r || "—"}
                        {!ok && (
                          <>
                            <span className="ml-3 text-muted">Answer:</span> {typeof q.answer === "string" ? q.answer : q.answer[0]}
                          </>
                        )}
                      </span>
                      <Icon d={I.chevronD} className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-line bg-bg p-3 sm:p-5">
                        <TestQuestionView q={q} response={r} review />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/test/${test.id}`} className="rounded-xl border border-line px-5 py-3 font-semibold hover:bg-surface-2">
          Retake this test
        </Link>
        <Link href="/test" className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink hover:bg-primary-hover">
          Choose another test
        </Link>
      </div>
    </div>
  );
}
