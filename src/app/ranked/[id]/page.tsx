import type { Metadata } from "next";
import { Suspense } from "react";
import { MatchPage } from "@/components/ranked/MatchPage";

// Match ids are unknown at build time and the page is a client component that loads the match itself, so this route is
// rendered on demand instead of being validated for instant navigation.
export const instant = false;

export const metadata: Metadata = {
  title: "Ranked match",
  robots: { index: false },
};

async function Match({ params }: { params: PageProps<"/ranked/[id]">["params"] }) {
  const { id } = await params;
  return <MatchPage id={id} />;
}

export default function Page({ params }: PageProps<"/ranked/[id]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-12 md:px-8"><div className="h-40 animate-pulse rounded-2xl bg-surface-2" /></div>}>
      <Match params={params} />
    </Suspense>
  );
}
