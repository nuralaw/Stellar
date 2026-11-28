import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UniversityDetail } from "@/components/admission/UniversityDetail";
import { getDestination, getDestinations, getUniversities, getUniversity } from "@/lib/admission";
import { PAGE } from "@/lib/ui";

export function generateStaticParams() {
  return getDestinations().flatMap((d) => getUniversities(d.slug).map((u) => ({ destination: d.slug, university: u.slug })));
}

export async function generateMetadata({ params }: PageProps<"/admission/[destination]/[university]">): Promise<Metadata> {
  const { destination, university } = await params;
  const u = getUniversity(destination, university);
  if (!u) return { title: "Admission" };
  return { title: `${u.name} — Admission`, ...(u.summary ? { description: u.summary } : {}) };
}

async function University({ params }: { params: PageProps<"/admission/[destination]/[university]">["params"] }) {
  const { destination, university } = await params;
  const d = getDestination(destination);
  const u = getUniversity(destination, university);
  if (!d || !u) notFound();
  return <UniversityDetail destination={d} university={u} />;
}

function Skeleton() {
  return (
    <div className={PAGE}>
      <div className="flex items-center gap-4">
        <div className="h-20 w-40 shrink-0 animate-pulse rounded-xl bg-surface-2 md:h-24 md:w-48" />
        <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-surface-2" />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-2" />
        ))}
      </div>
    </div>
  );
}

export default function Page({ params }: PageProps<"/admission/[destination]/[university]">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <University params={params} />
    </Suspense>
  );
}
