import Link from "next/link";
import { LINK_STRONG } from "@/components/plus/styles";
import { RESOURCE_NAV } from "@/lib/nav";
import { H3 } from "./styles";

/** Links to the other free resource pages; `current` is the page it sits on. */
export function MoreTools({ current }: { current: string }) {
  return (
    <nav aria-labelledby="more-tools-title" className="mt-10">
      <h2 id="more-tools-title" className={H3}>
        More free SAT tools
      </h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {RESOURCE_NAV.filter((i) => i.href !== current).map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={LINK_STRONG}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
