import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Practice Test" };

export default function Page() {
  return (
    <ComingSoon
      title="Full-length practice test"
      body="A timed, adaptive test in the Digital SAT format with an estimated 400–1600 score."
    />
  );
}
