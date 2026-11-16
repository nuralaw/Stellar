"use client";

import { useState, type ReactNode } from "react";
import { useHydrated, useNow } from "@/lib/store";
import { FOCUS } from "./styles";

const key = (id: string) => `stellar:plus-hide:${id}`;

function hiddenUntil(id: string): number {
  try {
    return Number(localStorage.getItem(key(id))) || 0;
  } catch {
    return 0;
  }
}

/** Shows its children until the student hides them (for `days`). Renders nothing before the browser is ready. */
export function Dismissible({ id, days = 14, children }: { id: string; days?: number; children: (hide: () => void) => ReactNode }) {
  const hydrated = useHydrated();
  const now = useNow();
  const [hidden, setHidden] = useState(false);
  if (!hydrated || !now || hidden || hiddenUntil(id) > now) return null;
  const hide = () => {
    try {
      localStorage.setItem(key(id), String(now + days * 86_400_000));
    } catch {}
    setHidden(true);
  };
  return <>{children(hide)}</>;
}

export function HideButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-muted transition-colors hover:text-ink ${FOCUS}`}>
      Hide for 2 weeks
    </button>
  );
}
