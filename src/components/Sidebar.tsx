"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ACCOUNT_NAV, ADMIN_NAV, NAV_GROUPS, PLUS_NAV, isActive, type NavItem } from "@/lib/nav";
import { useAccess, type Plan } from "@/lib/access";
import { PlusBadge } from "./PlusLock";
import { Avatar, isPhotoAvatar } from "./Avatar";
import { SIDEBAR_KEY } from "@/lib/sidebar";
import { isBarePath } from "@/lib/public-paths";
import { useAttempts, useHydrated, useNow, useProfile } from "@/lib/store";
import { reviewQueue } from "@/lib/review";
import { useAuth } from "@/lib/auth-client";
import { useSyncState } from "@/lib/sync-status";
import { loginHref, syncLabel } from "./profile/sync-label";

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

/** Mistakes due for review today (sidebar badge). Spaced review is Plus-only, so 0 unless `enabled`. */
function useDueCount(enabled: boolean) {
  const hydrated = useHydrated();
  const attempts = useAttempts();
  const now = useNow();
  return enabled && hydrated && now ? reviewQueue(attempts, now).due.length : 0;
}

function NavGroup({ title, items, pathname, onNavigate, badges = {}, tour }: { title: string; items: NavItem[]; pathname: string; onNavigate: () => void; badges?: Record<string, number>; tour?: boolean }) {
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
                data-tour={tour ? item.href : undefined}
                onClick={onNavigate}
                title={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors rail:justify-center rail:px-0 ${
                  active ? "bg-primary/15 text-accent" : "text-side-muted hover:bg-side-2 hover:text-side-ink"
                }`}
              >
                <span className={`relative ${item.href === PLUS_NAV.href && !active ? "text-accent" : ""}`}>
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

/** Second line of the profile card: where the progress lives (and, when signed in, how the sync is doing). */
function SaveStatus() {
  const auth = useAuth();
  const sync = useSyncState();
  // Blank until the session is known, so a signed-in student never sees "Saved on this device" flash.
  if (!auth.ready) return <span className="block text-[13px] text-side-muted">&nbsp;</span>;
  if (!auth.user) return <span className="block truncate text-[13px] text-side-muted">Saved on this device</span>;
  const s = syncLabel(sync);
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-side-muted" title={s.title}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
      <span className="truncate">{s.text}</span>
    </span>
  );
}

function ProfileCard({ onNavigate, plan, pathname }: { onNavigate: () => void; plan: Plan | null; pathname: string }) {
  const hydrated = useHydrated();
  const profile = useProfile();
  const auth = useAuth();
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
            {plan === "admin" && <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs leading-none font-semibold text-accent">Admin</span>}
            {plan === "plus" && <PlusBadge tone="onDark" />}
          </span>
          <SaveStatus />
        </span>
      </Link>
      {/* Quiet on purpose: the orange accent is for the page's main action. */}
      {auth.ready && !auth.user && (
        <Link
          href={loginHref(pathname)}
          onClick={onNavigate}
          className="mt-3 block rounded-lg border border-side-line px-3 py-2.5 text-center text-sm font-semibold whitespace-nowrap text-side-ink transition-colors hover:bg-side-line rail:hidden"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}

/** `collapsible` = the desktop sidebar, the only one the tour (components/SidebarTour.tsx) points at (data-tour). */
function SidebarContent({ pathname, onNavigate, collapsible }: { pathname: string; onNavigate: () => void; collapsible?: boolean }) {
  const access = useAccess();
  const due = useDueCount(access.ready && access.can("mistake-review"));
  const admin = access.plan === "admin";
  const plusItem = access.ready && access.plan === "plus" ? { ...PLUS_NAV, label: "Your Plus" } : PLUS_NAV;
  return (
    <div className="flex h-full flex-col gap-8 p-4 rail:px-3">
      <div data-tour={collapsible ? "intro" : undefined} className="flex items-center justify-between gap-2 px-2 pt-2 rail:flex-col rail:gap-4 rail:px-0">
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
          <NavGroup key={g.title} title={g.title} items={g.items} pathname={pathname} onNavigate={onNavigate} badges={{ "/mistakes": due }} tour={collapsible} />
        ))}
        <NavGroup title="Account" items={admin ? [...ACCOUNT_NAV, plusItem, ADMIN_NAV] : [...ACCOUNT_NAV, plusItem]} pathname={pathname} onNavigate={onNavigate} tour={collapsible} />
      </nav>
      <ProfileCard onNavigate={onNavigate} plan={access.ready ? access.plan : null} pathname={pathname} />
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

  // /register and /login are full-screen pages without navigation.
  if (isBarePath(pathname)) return null;

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
        data-tour-skip
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
