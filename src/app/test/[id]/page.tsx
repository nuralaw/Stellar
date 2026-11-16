import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TestCoverSkeleton, TestLocked } from "@/components/test/TestLocked";
import { TestRunner } from "@/components/test/TestRunner";
import { getAccess } from "@/lib/access-server";
import { canOpenTest, freeTestIds } from "@/lib/free-tests";
import { testFacts } from "@/lib/plus-facts";
import { MODULE_INFO, fmtMinutes, minutesOf, questionCount, testName, type ModuleId } from "@/lib/test-types";
import { getTest, getTestIndex } from "@/lib/tests";

export function generateStaticParams() {
  return getTestIndex().map((t) => ({ id: t.id }));
}

// Title only comes from the index (never the questions).
export async function generateMetadata({ params }: PageProps<"/test/[id]">): Promise<Metadata> {
  const id = (await params).id;
  const row = getTestIndex().find((t) => t.id === id);
  return { title: row ? `${testName(row)} — Practice Test` : "Practice Test" };
}

// The server decides. A free test (two latest months) needs no session, so it prerenders with its content. Any
// other test reads the visitor's session at request time, and its JSON is only read after the check passes, so
// it is never in the prerender, the HTML or the RSC payload of a visitor without Plus.
async function Test({ params }: { params: PageProps<"/test/[id]">["params"] }) {
  const id = (await params).id;
  const index = getTestIndex();
  const row = index.find((t) => t.id === id);
  if (!row) notFound();

  const free = freeTestIds(index);
  if (!free.has(id) && !canOpenTest(await getAccess(), id, free)) {
    const f = testFacts(index);
    const order: ModuleId[] = ["rw1", "rw2", "math1", "math2"];
    return (
      <TestLocked
        name={testName(row)}
        full={row.sections.length === 2}
        questions={questionCount(row)}
        minutes={fmtMinutes(minutesOf(row))}
        reviewed={row.reviewed}
        modules={order
          .filter((m) => row.counts[m])
          .map((m) => ({ id: m, label: `${MODULE_INFO[m].section === "rw" ? "R&W" : "Math"} · Module ${MODULE_INFO[m].n}`, questions: row.counts[m] ?? 0, minutes: MODULE_INFO[m].minutes }))}
        facts={{ total: f.total, plusOnly: f.plusOnly, firstYear: f.firstYear, lastYear: f.lastYear, questions: f.questions }}
        freeLabel={f.freeLabel}
        freeRows={f.freeRows}
        freeHref={f.newestFreeFullId ? `/test/${f.newestFreeFullId}` : "/test"}
      />
    );
  }

  const test = getTest(id);
  if (!test) notFound();
  return <TestRunner test={test} />;
}

export default function Page({ params }: PageProps<"/test/[id]">) {
  return (
    <Suspense fallback={<TestCoverSkeleton />}>
      <Test params={params} />
    </Suspense>
  );
}
