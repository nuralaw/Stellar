import type { Metadata } from "next";
import { Suspense } from "react";
import { QuestionBank } from "@/components/bank/QuestionBank";
import { PAGE } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Question Bank",
  description:
    "Free Digital SAT question bank: Math and Reading & Writing questions sorted by topic, skill, and difficulty, with step-by-step explanations.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className={`${PAGE} text-muted`}>Loading question bank…</div>}>
      <QuestionBank />
    </Suspense>
  );
}
