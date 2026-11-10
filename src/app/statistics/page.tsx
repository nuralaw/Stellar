import type { Metadata } from "next";
import { Statistics } from "@/components/home/Statistics";

export const metadata: Metadata = {
  title: "Statistics",
  description: "Your SAT practice statistics: questions answered, accuracy, score trend, and progress by section and topic.",
};

export default function Page() {
  return <Statistics />;
}
