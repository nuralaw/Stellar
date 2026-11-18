"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isBarePath } from "@/lib/public-paths";

/**
 * The page frame. Normally: theme switch, content with room for the sidebar, footer.
 * On /register and /login (no sidebar): just the page, full width. `toggle` and `footer` are server-rendered by the layout.
 */
export function AppShell({ toggle, footer, children }: { toggle: ReactNode; footer: ReactNode; children: ReactNode }) {
  const bare = isBarePath(usePathname());
  return (
    <>
      {!bare && toggle}
      <div className={`flex min-h-screen flex-col ${bare ? "" : "transition-[padding] duration-200 ease-out lg:pl-64 lg:sb-collapsed:pl-[72px] focus-mode:pl-0!"}`}>
        <main className="flex-1">{children}</main>
        {!bare && footer}
      </div>
    </>
  );
}
