import Link from "next/link";
import { Skeleton } from "@/components/home/parts";
import { PlusLock } from "@/components/PlusLock";
import { EYEBROW, LINK_STRONG } from "@/components/plus/styles";
import { SignInHint } from "@/components/plus/SignInHint";
import type { FreeRow } from "@/lib/plus-facts";
import { PAGE } from "@/lib/ui";
import { FreeTests } from "./FreeTests";

export interface TestLockedProps {
  name: string;
  full: boolean;
  questions: number;
  minutes: string;
  reviewed: boolean;
  modules: { id: string; label: string; questions: number; minutes: number }[];
  facts: { total: number; plusOnly: number; firstYear: number; lastYear: number; questions: number };
  freeLabel: string;
  freeRows: FreeRow[];
  freeHref: string;
}

/** What a visitor without Plus sees at a Plus-only /test/[id]: numbers from the index only, never the questions. */
export function TestLocked({ name, full, questions, minutes, reviewed, modules, facts, freeLabel, freeRows, freeHref }: TestLockedProps) {
  const chip = "rounded-full bg-surface px-3 py-1 text-sm ring-1 ring-line tabular-nums";
  return (
    <div className={PAGE}>
      <Link href="/test" className={`text-sm ${LINK_STRONG}`}>
        ← All practice tests
      </Link>
      <p className={`mt-6 ${EYEBROW}`}>Past paper · {full ? "Reading and Writing + Math" : "Reading and Writing only"}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{name}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={chip}>{questions} questions</span>
        <span className={chip}>{minutes}</span>
        <span className={chip}>{modules.length} timed modules</span>
        {reviewed && <span className={chip}>Every question explained</span>}
      </div>
      <ul aria-label="Modules" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {modules.map((m) => (
          <li key={m.id} className="rounded-xl bg-surface p-3 ring-1 ring-line">
            <p className="text-sm font-semibold">{m.label}</p>
            <p className="text-xs text-muted tabular-nums">
              {m.questions} questions · {m.minutes} min
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <PlusLock
          variant="panel"
          feature="tests"
          title={`Take this test and ${facts.plusOnly - 1} more with Plus`}
          points={["Timed module by module, like test day", `An estimated score out of ${full ? 1600 : 800} the moment you finish`, ...(reviewed ? ["Every question reviewed, with its explanation"] : [])]}
          fact={`${facts.total} past papers from ${facts.firstYear}–${facts.lastYear} · ${facts.questions.toLocaleString("en-US")} questions in all`}
          free={{ href: freeHref, label: "start a free test" }}
          footer={<SignInHint />}
        />
        <FreeTests rows={freeRows} label={freeLabel} />
      </div>
    </div>
  );
}

export function TestCoverSkeleton() {
  return (
    <div className={PAGE} aria-busy="true">
      <span className="sr-only">Loading test…</span>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-6 h-4 w-48" />
      <Skeleton className="mt-2 h-9 w-80 max-w-full" />
      <Skeleton className="mt-4 h-8 w-96 max-w-full rounded-full" />
      <Skeleton className="mt-6 h-20 rounded-xl" />
      <Skeleton className="mt-8 h-72 rounded-3xl" />
    </div>
  );
}
