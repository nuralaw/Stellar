"use client";

import { useAccess, type Access } from "@/lib/access";

/** "Jan 5, 2027". Fixed locale so it doesn't depend on the browser's language. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Whole days of Plus left at `now` (Unix ms), rounded up; 0 or negative once it has ended. */
export function daysLeft(iso: string, now: number): number {
  return Math.ceil((Date.parse(iso) - now) / 86_400_000);
}

/** "Free" / "Stellar Plus until Jan 5, 2027" / "Stellar Plus" / "Admin" */
export function planText(a: Pick<Access, "plan" | "expiresAt">): string {
  if (a.plan === "admin") return "Admin";
  if (a.plan === "plus") return a.expiresAt ? `Stellar Plus until ${formatDate(a.expiresAt)}` : "Stellar Plus";
  return "Free";
}

/** The visitor's current plan as text (a placeholder bar while it's being looked up). */
export function PlanLabel({ className = "" }: { className?: string }) {
  const access = useAccess();
  if (!access.ready) return <span className={`inline-block h-5 w-40 animate-pulse rounded bg-surface-2 align-middle ${className}`} aria-hidden="true" />;
  return <span className={className}>{planText(access)}</span>;
}
