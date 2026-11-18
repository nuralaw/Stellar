import type { ReactNode } from "react";

/** The form card of /register and /login (sits inside <AuthScreen />). */
export function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 xl:h-full xl:p-5">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
