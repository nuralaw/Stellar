import type { Metadata } from "next";
import { TestList } from "@/components/test/TestList";
import { freeTestIds } from "@/lib/free-tests";
import { getTestIndex } from "@/lib/tests";

export const metadata: Metadata = {
  title: "Practice Tests",
  description: "Timed Digital SAT practice tests from past papers, with an estimated 400–1600 score and a review of every question.",
};

export default function Page() {
  const tests = getTestIndex();
  return <TestList tests={tests} freeIds={[...freeTestIds(tests)]} />;
}
