import Link from "next/link";
import { Logo } from "./Logo";

export const NAV = [
  { href: "/practice", label: "Practice" },
  { href: "/test", label: "Practice Test" },
  { href: "/lessons", label: "Lessons" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo eager />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
        >
          Sign in
        </Link>
      </div>
      {/* Mobile nav */}
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden" aria-label="Main mobile">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
