import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Lessons" };

export default function Page() {
  return (
    <ComingSoon
      title="Lessons"
      body="Short lessons on every skill the Digital SAT tests: formulas, grammar rules, and strategies."
    />
  );
}
