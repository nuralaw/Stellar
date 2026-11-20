import type { Metadata } from "next";
import { RankedHub } from "@/components/ranked/RankedHub";

export const metadata: Metadata = {
  title: "Ranked matches",
  description: "Ranked Digital SAT matches: the same ten questions as your opponent, points for speed and accuracy, an ELO rating and star-themed levels.",
};

export default function Page() {
  return <RankedHub />;
}
