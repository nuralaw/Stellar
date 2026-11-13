"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ACCOUNT_NAV, ADMIN_NAV, NAV_GROUPS, isActive, type NavItem } from "@/lib/nav";
import { useAdminFlag } from "@/lib/admin-flag";
import { Avatar, isPhotoAvatar } from "./Avatar";
import { SIDEBAR_KEY } from "@/lib/sidebar";
import { useAttempts, useHydrated, useNow, useProfile } from "@/lib/store";
import { reviewQueue } from "@/lib/review";

function toggleCollapsed() {
  const el = document.documentElement;
  const next = el.dataset.sidebar === "collapsed" ? "expanded" : "collapsed";
  el.dataset.sidebar = next;
  try {
    localStorage.setItem(SIDEBAR_KEY, next);
  } catch {}
}

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Mistakes due for review today (sidebar badge). */
function useDueCount() {
  const hydrated = useHydrated();
  const attempts = useAttempts();
  const now = useNow();
  return hydrated && now ? reviewQueue(attempts, now).due.length : 0;
}

function NavGroup({ title, items, pathname, onNavigate, badges = {} }: { title: string; items: NavItem[]; pathname: string; onNavigate: () => void; badges?: Record<string, number> }) {
  return (
    <div>
      <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider whitespace-nowrap text-side-muted uppercase rail:hidden">{title}</p>
      <div className="mx-auto mb-2 hidden h-px w-6 bg-side-line rail:block" aria-hidden="true" />
      <ul className="space-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                title={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors rail:justify-center rail:px-0 ${
                  active ? "bg-primary/15 text-accent" : "text-side-muted hover:bg-side-2 hover:text-side-ink"
                }`}
              >
                <span className="relative">
                  <Icon d={item.icon} />
                  {badges[item.href] > 0 && <span className="absolute -top-0.5 -right-0.5 hidden h-2 w-2 rounded-full bg-primary rail:block" aria-hidden="true" />}
                </span>
                <span className="flex-1 whitespace-nowrap rail:sr-only">{item.label}</span>
                {badges[item.href] > 0 && (
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[11px] leading-none font-semibold text-accent tabular-nums rail:hidden" title={`${badges[item.href]} due today`}>
                    {badges[item.href]}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProfileCard({ onNavigate, admin }: { onNavigate: () => void; admin: boolean }) {
  const hydrated = useHydrated();
  const profile = useProfile();
  const named = hydrated && profile.name;
  return (
    <div className="rounded-xl border border-side-line bg-side-2 p-3 rail:border-0 rail:bg-transparent rail:p-0">
      <Link href="/profile" onClick={onNavigate} title="Profile" className="flex items-center gap-3 rounded-lg rail:justify-center">
        {hydrated && isPhotoAvatar(profile.avatar) ? (
          <Avatar value={profile.avatar} className="h-10 w-10" />
        ) : (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-xl text-accent">
            {hydrated ? profile.avatar : <Icon d={ACCOUNT_NAV[0].icon} />}
          </span>
        )}
        <span className="min-w-0 rail:sr-only">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-side-ink">{named ? profile.name : "Guest"}</span>
            {admin && <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs leading-none font-semibold text-accent">Admin</span>}
          </span>
          <span className="block truncate text-xs text-side-muted">Saved on this device</span>
        </span>
      </Link>
      {/* Quiet on purpose: the orange accent is for the page's main action. */}
      <Link
        href="/login"
        onClick={onNavigate}
        className="mt-3 block rounded-lg border border-side-line px-3 py-2 text-center text-sm font-semibold whitespace-nowrap text-side-ink transition-colors hover:bg-side-line rail:hidden"
      >
        Sign in
      </Link>
    </div>
  );
}

function SidebarContent({ pathname, onNavigate, collapsible }: { pathname: string; onNavigate: () => void; collapsible?: boolean }) {
  const due = useDueCount();
  const admin = useAdminFlag();
  return (
    <div className="flex h-full flex-col gap-8 p-4 rail:px-3">
      <div className="flex items-center justify-between gap-2 px-2 pt-2 rail:flex-col rail:gap-4 rail:px-0">
        <div className="rail:hidden">
          <Logo eager variant="onDark" />
        </div>
        <Link href="/" aria-label="Stellar home" className="hidden rail:block">
          <LogoMark variant="onDark" className="h-8" />
        </Link>
        {collapsible && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            className="grid h-8 w-8 place-items-center rounded-lg text-side-muted transition-colors hover:bg-side-2 hover:text-side-ink"
          >
            <Icon d="M15 18l-6-6 6-6" className="h-5 w-5 transition-transform rail:rotate-180" />
          </button>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-5" aria-label="Main">
        {NAV_GROUPS.map((g) => (
          <NavGroup key={g.title} title={g.title} items={g.items} pathname={pathname} onNavigate={onNavigate} badges={{ "/mistakes": due }} />
        ))}
        <NavGroup title="Account" items={admin ? [...ACCOUNT_NAV, ADMIN_NAV] : ACCOUNT_NAV} pathname={pathname} onNavigate={onNavigate} />
      </nav>
      <ProfileCard onNavigate={onNavigate} admin={admin} />
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
      {/* Desktop: collapsible sidebar (full width ↔ icon rail) */}
      <aside
        data-rail
        className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-x-hidden overflow-y-auto border-r border-side-line bg-side transition-[width] duration-200 ease-out lg:block rail:w-[72px] focus-mode:hidden!"
      >
        <SidebarContent pathname={pathname} onNavigate={() => {}} collapsible />
      </aside>

      {/* Mobile: top bar + slide-in drawer */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-side-line bg-side px-4 lg:hidden focus-mode:hidden">
        <Logo eager variant="onDark" className="h-6" />
        <div className="flex items-center gap-1">
          <ThemeToggle className="text-side-ink hover:bg-side-2" />
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
