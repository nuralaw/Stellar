import Link from "next/link";
import type { University } from "@/lib/admission";
import { UniversityLogo } from "./UniversityLogo";

/**
 * One university on its destination page: a square card, logo tile on top (filling the height the text leaves), then the name and
 * (when known) a short summary. The whole card is the link. The text block has a fixed height, so the logo tiles line up in a row:
 * three lines of summary where the card is wide enough (a container query on the card, so it follows the grid, not the viewport),
 * two in the narrow cards of the 3- and 4-column grids.
 */
export function UniversityCard({ university: u }: { university: University }) {
  return (
    <Link
      href={`/admission/${u.destination}/${u.slug}`}
      prefetch
      className="group @container flex aspect-square flex-col overflow-hidden rounded-2xl border border-line bg-surface p-4 outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
    >
      <UniversityLogo university={u} className="min-h-0 flex-1 text-2xl sm:text-3xl" />
      <div className="mt-3 h-[5.5rem] shrink-0 overflow-hidden @[15rem]:h-[6.75rem]">
        <h2 className="line-clamp-2 leading-snug font-semibold text-ink">{u.name}</h2>
        {u.summary && <p className="mt-1 line-clamp-2 text-sm text-muted @[15rem]:line-clamp-3">{u.summary}</p>}
      </div>
    </Link>
  );
}
