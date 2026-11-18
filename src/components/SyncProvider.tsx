"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-client";
import { applyPendingName } from "@/lib/pending-name";
import { startSync } from "@/lib/sync";
import { useSyncState } from "@/lib/sync-status";

/** Starts the account sync (lib/sync.ts) once in the browser, and puts the name typed on /register into the profile after the first sync. Renders nothing. */
export function SyncProvider() {
  const user = useAuth().user;
  const synced = useSyncState().status === "synced";

  useEffect(() => {
    startSync();
  }, []);

  useEffect(() => {
    if (user && synced) void applyPendingName(user);
  }, [user, synced]);

  return null;
}
