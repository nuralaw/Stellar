import type { Metadata } from "next";
import { Competition } from "@/components/compete/Competition";

export const metadata: Metadata = {
  title: "Weekly Competition",
  description: "Weekly SAT competition: random Reading & Writing and Math rounds, points for speed and accuracy, and a leaderboard.",
};

export default function Page() {
  return <Competition />;
}
