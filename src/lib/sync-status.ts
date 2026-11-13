"use client";

import { useSyncExternalStore } from "react";

// Status of the account sync (written by lib/sync.ts, shown in the sidebar / profile).
//  off      — not signed in: data lives only in this browser
//  syncing  — pulling or pushing right now
//  synced   — everything is in the account (at = last success, Unix ms)
//  offline  — signed in, but the last attempt failed for lack of network; retried automatically
//  error    — the server refused (message in `error`)

export type SyncStatus = "off" | "syncing" | "synced" | "offline" | "error";
export type SyncState = { status: SyncStatus; at: number | null; error?: string };

const INITIAL: SyncState = { status: "off", at: null };
let state: SyncState = INITIAL;
const listeners = new Set<() => void>();

export function setSyncState(patch: Partial<SyncState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getSyncState(): SyncState {
  return state;
}

export function useSyncState(): SyncState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => INITIAL,
  );
}
