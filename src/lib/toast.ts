"use client";

import { useSyncExternalStore } from "react";

// One short notification at a time ("Progress saved"), shown by <Toaster /> in the root layout.
// Module state, so it survives client-side navigation (e.g. leaving practice for Home).

export interface Toast {
  id: number;
  title: string;
  text?: string;
  /** How long it stays, ms. */
  ms: number;
}

let current: Toast | null = null;
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function showToast(title: string, text?: string, ms = 3000) {
  current = { id: ++seq, title, text, ms };
  emit();
}

export function dismissToast(id: number) {
  if (current?.id === id) {
    current = null;
    emit();
  }
}

export function useToast(): Toast | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => null,
  );
}
