import type { ReactNode } from "react";
import type { AuthFacts } from "@/lib/auth-facts";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccountView } from "./auth-views";

// Layout of /register and /login: a bare full-screen page (the layout hides the app sidebar and footer on these pages,
// see components/AppShell.tsx) with the logo, the theme switch and the form card next to the art. Features and Pricing
// live on the public landing page ("/#features", "/#pricing").

export function AuthScreen({ mode, facts, children }: { mode: "register" | "signin"; facts: AuthFacts; children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip">
      <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-8">
        <Logo eager className="h-7" />
        <ThemeToggle className="border border-line bg-surface/90 text-ink shadow-sm hover:bg-surface-2" />
      </header>
      <section className="flex flex-1 flex-col items-center justify-center px-4 pt-2 pb-10 sm:px-8 xl:flex-row xl:items-center xl:justify-center xl:py-6">
        <AccountView mode={mode} facts={facts}>
          {children}
        </AccountView>
      </section>
    </div>
  );
}
