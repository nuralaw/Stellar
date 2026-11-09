"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ACCOUNT_NAV, MAIN_NAV, isActive, type NavItem } from "@/lib/nav";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function NavGroup({ title, items, pathname, onNavigate }: { title: string; items: NavItem[]; pathname: string; onNavigate: () => void }) {
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

function ProfileCard({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="rounded-xl border border-side-line bg-side-2 p-3">
      <Link href="/profile" onClick={onNavigate} className="flex items-center gap-3 rounded-lg">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-accent">
          <Icon d={ACCOUNT_NAV[0].icon} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-side-ink">Guest student</span>
          <span className="block truncate text-xs text-side-muted">Sign in to save progress</span>
        </span>
      </Link>
      <Link
        href="/login"
        onClick={onNavigate}
        className="mt-3 block rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
      >
        Sign in
      </Link>
    </div>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 p-4">
      <div className="px-2 pt-2">
        <Logo eager variant="onDark" />
      </div>
      <nav className="flex flex-1 flex-col gap-6" aria-label="Main">
        <NavGroup title="Learn" items={MAIN_NAV} pathname={pathname} onNavigate={onNavigate} />
        <NavGroup title="Account" items={ACCOUNT_NAV} pathname={pathname} onNavigate={onNavigate} />
      </nav>
      <ProfileCard onNavigate={onNavigate} />
    </div>
  );
}

export function Sidebar() {
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
      {/* Desktop: fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-side-line bg-side lg:block">
        <SidebarContent pathname={pathname} onNavigate={() => {}} />
      </aside>

      {/* Mobile: top bar + drawer */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-side-line bg-side px-4 lg:hidden">
        <Logo eager variant="onDark" className="h-6" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-lg text-side-ink hover:bg-side-2"
        >
          <Icon d="M4 6h16M4 12h16M4 18h16" className="h-6 w-6" />
        </button>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-side-line bg-side shadow-xl transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu"
        inert={!open}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="absolute top-4 right-3 grid h-9 w-9 place-items-center rounded-lg text-side-muted hover:bg-side-2 hover:text-side-ink"
        >
          <Icon d="M6 6l12 12M18 6 6 18" />
        </button>
        <SidebarContent pathname={pathname} onNavigate={close} />
      </aside>
    </>
  );
}
