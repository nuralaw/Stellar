"use client";

import { usePathname } from "next/navigation";
import { ACCOUNT_NAV, MAIN_NAV } from "@/lib/nav";
import { SupportButton } from "./SupportButton";

/** The start page of every sidebar section (Home, Lessons, Vocabulary, …, Profile). */
const START_PAGES = new Set([...MAIN_NAV, ...ACCOUNT_NAV].map((i) => i.href));

/**
 * The Support button on every start page. Hidden on inner pages (a lesson, a word set, a test) and while solving
 * (focus mode: practice sets, tests and rounds open inside these same pages).
 */
export function SupportDock() {
  const pathname = usePathname();
  if (!START_PAGES.has(pathname)) return null;
  return (
    <div className="focus-mode:hidden">
      <SupportButton />
    </div>
  );
}
