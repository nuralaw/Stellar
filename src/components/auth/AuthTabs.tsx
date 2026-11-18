"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { I } from "@/components/bank/icons";
import { Logo } from "@/components/Logo";
import { FOCUS_ON_DARK } from "@/components/plus/styles";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PLUS_NAV } from "@/lib/nav";

// Sidebar + panels of /register and /login: three tabs (the form, Features, Pricing) that look like the app's sidebar
// (components/Sidebar.tsx). The panels stay mounted (only `hidden` flips), so the form keeps what was typed and the
// "Check your email" step while the visitor looks around. A panel going display:none -> shown restarts its CSS
// animations, which replays the entrance animations on every tab switch. The tab lives in the URL hash.

export type AuthTab = "account" | "features" | "pricing";

type Select = (t: AuthTab, opts?: { focusForm?: boolean; fromLink?: boolean }) => void;
const Ctx = createContext<{ tab: AuthTab; select: Select } | null>(null);

export function useAuthTabs() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuthTabs must be used inside <AuthTabs>");
  return v;
}

/** A button that switches tab (e.g. "See all features →"). */
export function TabLink({ to, focusForm, className, children }: { to: AuthTab; focusForm?: boolean; className?: string; children: ReactNode }) {
  const { select } = useAuthTabs();
  return (
    <button type="button" onClick={() => select(to, { focusForm, fromLink: true })} className={className}>
      {children}
    </button>
  );
}

const ORDER: AuthTab[] = ["account", "features", "pricing"];

const fromHash = (hash: string): AuthTab => (hash === "#features" ? "features" : hash === "#pricing" ? "pricing" : "account");

const ICON_REGISTER = "M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M16 11h6";
const ICON_SIGNIN = "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3";

export function AuthTabs({ mode, account, features, pricing }: { mode: "register" | "signin"; account: ReactNode; features: ReactNode; pricing: ReactNode }) {
  const [tab, setTab] = useState<AuthTab>("account");

  useEffect(() => {
    const read = () => setTab(fromHash(window.location.hash));
    const id = requestAnimationFrame(read);
    window.addEventListener("hashchange", read);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("hashchange", read);
    };
  }, []);

  const select = useCallback<Select>((t, opts) => {
    setTab(t);
    window.history.replaceState(null, "", window.location.pathname + window.location.search + (t === "account" ? "" : `#${t}`));
    window.scrollTo(0, 0);
    // The button that was clicked may sit in the panel that just got hidden: move focus to the form or the new tab.
    if (opts?.fromLink) {
      requestAnimationFrame(() => {
        const input = opts.focusForm ? document.querySelector<HTMLInputElement>("#auth-panel-account input") : null;
        (input ?? document.getElementById(`auth-tab-${t}`))?.focus({ preventScroll: true });
      });
    }
  }, []);

  const value = useMemo(() => ({ tab, select }), [tab, select]);

  const tabs: { id: AuthTab; label: string; icon: string }[] = [
    { id: "account", label: mode === "register" ? "Create account" : "Sign in", icon: mode === "register" ? ICON_REGISTER : ICON_SIGNIN },
    { id: "features", label: "Features", icon: I.grid },
    { id: "pricing", label: "Pricing", icon: PLUS_NAV.icon },
  ];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = ORDER.indexOf(tab);
    let next: number;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % ORDER.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + ORDER.length) % ORDER.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ORDER.length - 1;
    else return;
    e.preventDefault();
    select(ORDER[next]);
    document.getElementById(`auth-tab-${ORDER[next]}`)?.focus();
  };

  return (
    <Ctx.Provider value={value}>
      <aside className="sticky top-0 z-30 border-b border-side-line bg-side text-side-ink lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex flex-col lg:h-full lg:gap-8 lg:p-4">
          <div className="flex h-14 items-center justify-between px-4 lg:h-auto lg:px-2 lg:pt-2">
            <Logo eager variant="onDark" className="h-6 lg:h-7" />
            <div className="lg:hidden">
              <ThemeToggle className="text-side-ink hover:bg-side-2" />
            </div>
          </div>
          <div className="px-2 pb-1 lg:flex-1 lg:px-0 lg:pb-0">
            <p className="hidden px-3 pb-2 text-[11px] font-semibold tracking-wider text-side-muted uppercase lg:block">Get started</p>
            <div role="tablist" aria-label="Sign-up menu" onKeyDown={onKeyDown} className="flex gap-1 -mt-1 overflow-x-auto p-1 lg:mt-0 lg:flex-col lg:overflow-visible lg:p-0">
              {tabs.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    id={`auth-tab-${t.id}`}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`auth-panel-${t.id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => select(t.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      active ? "bg-primary/15 text-accent" : "text-side-muted hover:bg-side-2 hover:text-side-ink"
                    } ${FOCUS_ON_DARK}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`hidden h-5 w-5 shrink-0 sm:block ${t.id === "pricing" && !active ? "text-accent" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={t.icon} />
                    </svg>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="hidden rounded-xl border border-side-line bg-side-2 p-3 lg:block">
            <p className="text-sm font-semibold text-side-ink">Free to start</p>
            <p className="mt-0.5 text-[13px] text-side-muted">No card and no trial clock. Plus is optional.</p>
          </div>
        </div>
      </aside>

      <div className="relative lg:pl-64">
        <div className="absolute top-4 right-4 z-10 hidden lg:block">
          <ThemeToggle className="border border-line bg-surface/90 text-ink shadow-sm hover:bg-surface-2" />
        </div>
        <section
          id="auth-panel-account"
          role="tabpanel"
          aria-labelledby="auth-tab-account"
          hidden={tab !== "account"}
          className="flex min-h-[calc(100svh-7rem)] flex-col items-center justify-center px-4 py-10 sm:px-8 lg:min-h-screen lg:py-16"
        >
          {account}
        </section>
        <section id="auth-panel-features" role="tabpanel" aria-labelledby="auth-tab-features" hidden={tab !== "features"} className="px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
          {features}
        </section>
        <section
          id="auth-panel-pricing"
          role="tabpanel"
          aria-labelledby="auth-tab-pricing"
          hidden={tab !== "pricing"}
          className="relative isolate overflow-hidden px-4 py-8 sm:px-8 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-12 lg:py-5"
        >
          {pricing}
        </section>
      </div>
    </Ctx.Provider>
  );
}
