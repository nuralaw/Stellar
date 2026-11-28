import Link from "next/link";

export interface DestinationRow {
  slug: string;
  name: string;
  /** Number of universities. */
  count: number;
}

/** The destinations next to the globe: the keyboard and screen-reader way in. */
export function DestinationList({ destinations }: { destinations: DestinationRow[] }) {
  return (
    <nav aria-label="Destinations">
      <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Destinations</h2>
      <ul className="mt-3 space-y-3">
        {destinations.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/admission/${d.slug}`}
              prefetch
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>
                <span className="block font-semibold text-ink">{d.name}</span>
                <span className="block text-sm text-muted">
                  {d.count} {d.count === 1 ? "university" : "universities"}
                </span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5 shrink-0 text-muted">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
