import type { Metadata } from "next";
import { Suspense } from "react";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { RowSkeletons } from "@/components/leaderboard/Rows";
import { PAGE } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Ranked SAT matches: global, monthly season and weekly leaderboards by ELO.",
};

// Leaderboard keeps the tab and page in the URL (useSearchParams), so it needs a Suspense boundary (prerendered shell + client render).
export default function Page() {
  return (
    <Suspense
      fallback={
        <section className={PAGE}>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
            <RowSkeletons />
          </div>
        </section>
      }
    >
      <Leaderboard />
    </Suspense>
  );
}
