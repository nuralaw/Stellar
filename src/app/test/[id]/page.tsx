import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TestRunner } from "@/components/test/TestRunner";
import { testName } from "@/lib/test-types";
import { getTest, getTestIndex } from "@/lib/tests";

export function generateStaticParams() {
  return getTestIndex().map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/test/[id]">): Promise<Metadata> {
  const test = getTest((await params).id);
  return { title: test ? `${testName(test)} — Practice Test` : "Practice Test" };
}

const loading = <div className="mx-auto max-w-5xl px-4 py-10 text-muted md:px-8">Loading test…</div>;

async function Test({ params }: { params: PageProps<"/test/[id]">["params"] }) {
  const test = getTest((await params).id);
  if (!test) notFound();
  return <TestRunner test={test} />;
}

export default function Page({ params }: PageProps<"/test/[id]">) {
  return (
    <Suspense fallback={loading}>
      <Test params={params} />
    </Suspense>
  );
}
