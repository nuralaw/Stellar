import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Practice" };

export default function Page() {
  return (
    <ComingSoon
      title="Question bank"
      body="Practice Math and Reading & Writing questions by skill and difficulty, with step-by-step explanations."
    />
  );
}
