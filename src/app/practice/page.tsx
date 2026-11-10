import type { Metadata } from "next";
import { Suspense } from "react";
import { QuestionBank } from "@/components/bank/QuestionBank";

export const metadata: Metadata = {
  title: "Question Bank",
  description:
    "Free Digital SAT question bank: Math and Reading & Writing questions sorted by topic, skill, and difficulty, with step-by-step explanations.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-muted md:px-8">Loading question bank…</div>}>
      <QuestionBank />
    </Suspense>
  );
}
