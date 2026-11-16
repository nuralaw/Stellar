"use client";

import Link from "next/link";
import { I, Icon } from "@/components/bank/icons";
import { FOCUS } from "@/components/plus/styles";
import { useHydrated, useTestResults } from "@/lib/store";

/** The free practice tests, with this browser's last score on each (shown beside a Plus lock). */
export function FreeTests({ rows, label }: { rows: { id: string; name: string; questions: number; minutes: string }[]; label: string }) {
  const hydrated = useHydrated();
  const results = useTestResults();
  const last = new Map<string, number>();
  if (hydrated) for (const r of [...results].sort((a, b) => a.at - b.at)) if (r.testId) last.set(r.testId, r.total);
  return (
    <section aria-labelledby="free-tests-title" className="rounded-2xl border border-line bg-surface p-5">
      <h2 id="free-tests-title" className="text-base font-semibold">
        Free right now
      </h2>
      <p className="mt-1 text-sm text-muted">Tests from {label} are free for everyone.</p>
      <ul className="mt-3 space-y-1">
        {rows.map((r) => {
          const s = last.get(r.id);
          return (
            <li key={r.id}>
              <Link href={`/test/${r.id}`} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2 ${FOCUS}`}>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.name}</span>
                  <span className="text-xs text-muted tabular-nums">
                    {r.questions} questions · {r.minutes}
                  </span>
                </span>
                {s !== undefined && <span className="rounded-lg bg-success-soft px-2 py-0.5 text-sm font-bold text-success tabular-nums">{s}</span>}
                <span className="text-sm font-semibold text-primary-strong">{s !== undefined ? "Review" : "Start"}</span>
                <Icon d={I.chevronR} className="h-4 w-4 shrink-0 text-muted" />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">Free tests move forward when newer papers are added.</p>
    </section>
  );
}
