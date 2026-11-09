import Link from "next/link";
import { Logo } from "./Logo";
import { NAV } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-md text-sm text-muted">
            Free Digital SAT preparation for everyone. Practice questions, full-length adaptive tests, and clear
            lessons.
          </p>
        </div>
        <nav className="flex gap-6 text-sm" aria-label="Footer">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted">
          SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse,
          this website. All practice questions on Stellar are original.
        </p>
      </div>
    </footer>
  );
}
