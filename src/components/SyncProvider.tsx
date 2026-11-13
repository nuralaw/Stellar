"use client";

import { useEffect } from "react";
import { startSync } from "@/lib/sync";

/** Starts the account sync (lib/sync.ts) once in the browser. Renders nothing. */
export function SyncProvider() {
  useEffect(() => {
    startSync();
  }, []);
  return null;
}
