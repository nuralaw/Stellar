import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinationPage } from "@/components/admission/DestinationPage";
import { getDestination, getDestinations, getUniversities } from "@/lib/admission";
import { PAGE } from "@/lib/ui";

export function generateStaticParams() {
  return getDestinations().map((d) => ({ destination: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/admission/[destination]">): Promise<Metadata> {
  const d = getDestination((await params).destination);
  return d ? { title: `Universities in ${d.name}`, description: d.intro } : { title: "Admission" };
}

async function Destination({ params }: { params: PageProps<"/admission/[destination]">["params"] }) {
  const d = getDestination((await params).destination);
  if (!d) notFound();
  return <DestinationPage destination={d} universities={getUniversities(d.slug)} />;
}

function Skeleton() {
  return (
    <div className={PAGE}>
      <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-2xl bg-surface-2" />
        ))}
      </div>
    </div>
  );
}

export default function Page({ params }: PageProps<"/admission/[destination]">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Destination params={params} />
    </Suspense>
  );
}
