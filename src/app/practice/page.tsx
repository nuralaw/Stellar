import type { Metadata } from "next";
import { Suspense } from "react";
import { Practice } from "@/components/practice/Practice";
import { getCounts } from "@/lib/bank";

export const metadata: Metadata = {
  title: "Practice",
  description: "Free Digital SAT practice questions for Math and Reading & Writing, by topic and difficulty, with step-by-step explanations.",
};

export default function Page() {
  const counts = getCounts();
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-14 text-muted md:px-8">Loading practice…</div>}>
      <Practice counts={counts} />
    </Suspense>
  );
}
