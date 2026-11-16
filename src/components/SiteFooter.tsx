import Link from "next/link";
import { Logo } from "./Logo";
import { MAIN_NAV, PLUS_NAV } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-side text-side-muted focus-mode:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_auto] md:px-8">
        <div className="space-y-3">
          <Logo variant="onDark" />
          <p className="max-w-md text-sm">
            SAT prep for everyone. Practice questions, full-length practice tests, and clear
            lessons.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
          {[...MAIN_NAV.filter((i) => i.href !== "/"), PLUS_NAV].map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-accent">
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
