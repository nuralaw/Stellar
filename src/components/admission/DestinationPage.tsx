import Link from "next/link";
import type { Destination, University } from "@/lib/admission";
import { PAGE } from "@/lib/ui";
import { UniversityCard } from "./UniversityCard";

/** /admission/[destination]: the destination's universities as a grid of cards. */
export function DestinationPage({ destination, universities }: { destination: Destination; universities: University[] }) {
  return (
    <section className={PAGE}>
      <Link href="/admission" prefetch className="inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-muted outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-primary">
        <span aria-hidden="true">←</span> All destinations
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Universities in {destination.name}</h1>
      <p className="mt-2 max-w-2xl text-muted">{destination.intro}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {universities.map((u) => (
          <li key={u.slug}>
            <UniversityCard university={u} />
          </li>
        ))}
      </ul>
    </section>
  );
}
