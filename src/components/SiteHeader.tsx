"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ACCOUNT_NAV, MAIN_NAV, isActive, type NavItem } from "@/lib/nav";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const PROFILE_ICON = ACCOUNT_NAV[0].icon;

/** Mobile drawer nav group. */
function DrawerGroup({ title, items, pathname, onNavigate }: { title: string; items: NavItem[]; pathname: string; onNavigate: () => void }) {
  return (
    <div>
      <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-side-muted uppercase">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary/15 text-accent" : "text-side-muted hover:bg-side-2 hover:text-side-ink"
                }`}
              >
                <Icon d={item.icon} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-side-line bg-side">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-8">
          <Logo eager variant="onDark" />

          {/* Desktop nav */}
          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {MAIN_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-primary/15 text-accent" : "text-side-muted hover:bg-side-2 hover:text-side-ink"
                  }`}
                >
                  <Icon d={item.icon} className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <ThemeToggle className="text-side-ink hover:bg-side-2" />

            {/* Desktop: profile + sign in */}
            <Link
              href="/profile"
              title="Profile"
              aria-label="Profile"
              aria-current={isActive(pathname, "/profile") ? "page" : undefined}
              className={`hidden h-10 w-10 place-items-center rounded-full transition-colors lg:grid ${
                isActive(pathname, "/profile") ? "bg-primary/25 text-accent" : "bg-primary/15 text-accent hover:bg-primary/25"
              }`}
            >
              <Icon d={PROFILE_ICON} />
            </Link>
            <Link
              href="/login"
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover lg:block"
            >
              Sign in
            </Link>

            {/* Mobile: menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-lg text-side-ink hover:bg-side-2 lg:hidden"
            >
              <Icon d="M4 6h16M4 12h16M4 18h16" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-8 border-r border-side-line bg-side p-4 shadow-xl transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu"
        inert={!open}
      >
        <div className="flex items-center justify-between px-2 pt-2">
          <Logo variant="onDark" />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-side-muted hover:bg-side-2 hover:text-side-ink"
          >
            <Icon d="M6 6l12 12M18 6 6 18" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-6" aria-label="Main mobile">
          <DrawerGroup title="Learn" items={MAIN_NAV} pathname={pathname} onNavigate={close} />
          <DrawerGroup title="Account" items={ACCOUNT_NAV} pathname={pathname} onNavigate={close} />
        </nav>
        <div className="rounded-xl border border-side-line bg-side-2 p-3">
          <Link href="/profile" onClick={close} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-accent">
              <Icon d={PROFILE_ICON} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-side-ink">Guest student</span>
              <span className="block truncate text-xs text-side-muted">Sign in to save progress</span>
            </span>
          </Link>
          <Link
            href="/login"
            onClick={close}
            className="mt-3 block rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
          >
            Sign in
          </Link>
        </div>
      </aside>
    </>
  );
}
