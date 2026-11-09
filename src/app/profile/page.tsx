import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Profile" };

export default function Page() {
  return (
    <ComingSoon
      title="Student profile"
      body="Your target score, test date, and progress across every SAT skill — all in one place."
    />
  );
}
