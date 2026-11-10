import type { Metadata } from "next";
import { Suspense } from "react";
import { Mistakes } from "@/components/mistakes/Mistakes";
import { PAGE } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Mistakes",
  description: "Your SAT mistakes notebook: questions you got wrong come back after 1, 3 and 7 days until you've mastered them.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className={`${PAGE} text-muted`}>Loading mistakes…</div>}>
      <Mistakes />
    </Suspense>
  );
}
