import type { ReactNode } from "react";

/** The form card of /register and /login (sits inside <AuthScreen />). */
export function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <div className="mt-2">{children}</div>
    </div>
  );
}
