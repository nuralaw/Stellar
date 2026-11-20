import Link from "next/link";
import { Logo } from "./Logo";
import { MAIN_NAV, PLUS_NAV } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer data-chrome className="mt-24 bg-side text-side-muted focus-mode:hidden">
      {/* Text column keeps a real minimum; the links wrap inside their share (an `auto` column grew with every new nav item and squeezed the text to one word per line). */}
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[minmax(16rem,1fr)_minmax(0,1.4fr)] md:px-8">
        <div className="space-y-3">
          <Logo variant="onDark" />
          <p className="max-w-md text-sm">
            SAT prep for everyone. Practice questions, full-length practice tests, and clear
            lessons.
          </p>
        </div>
        <nav className="flex flex-wrap content-start gap-x-6 gap-y-2 text-sm md:justify-end" aria-label="Footer">
          {[...MAIN_NAV.filter((i) => i.href !== "/"), PLUS_NAV].map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-side-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-side-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed md:px-8">
          SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse,
          this website.
        </p>
      </div>
    </footer>
  );
}
