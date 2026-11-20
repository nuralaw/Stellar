"use client";

import { useEffect, useSyncExternalStore } from "react";

// "This browser belongs to an admin": decides whether the sidebar shows the admin bits (Support list, badge)
// and what useAccess() reports. Set by /admin after the server confirms the account; re-checked once per
// browser session so a signed-out / expired admin loses it. The admin APIs check the session themselves.

const KEY = "stellar:admin";
const EVENT = "stellar:admin-change";
/** sessionStorage marker: the flag was confirmed by /api/admin/me in this browser session. */
const CHECKED = "stellar:admin-checked";

export function setAdminFlag(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
    // Whoever sets the flag just asked the server, so this session counts as checked.
    if (on) sessionStorage.setItem(CHECKED, "1");
    else sessionStorage.removeItem(CHECKED);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function read() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// Module-level guard: the sidebar mounts twice (desktop + mobile drawer), but we ask the server once.
let verifying = false;

/** Flag set but not yet confirmed this session → ask the server once; clear the flag if no longer admin. */
function verifyOnce() {
  if (verifying || !read()) return; // normal visitors: no request
  try {
    if (sessionStorage.getItem(CHECKED) === "1") return;
  } catch {
    return;
  }
  verifying = true;
  // Loaded on demand: only the admin's browser needs the signing code (the layout bundle stays small for everyone else).
  import("./admin-keys")
    .then((k) => k.adminFetch("/api/admin/me", { cache: "no-store" }))
    .then((r) => (r.ok ? r.json() : null))
    .then((m: { admin?: boolean } | null) => {
      if (!m) return; // server hiccup: keep the flag, try again next load
      if (m.admin) {
        try {
          sessionStorage.setItem(CHECKED, "1");
        } catch {}
      } else setAdminFlag(false);
    })
    .catch(() => {}) // offline: keep the flag
    .finally(() => {
      verifying = false;
    });
}

export function useAdminFlag() {
  const on = useSyncExternalStore(subscribe, read, () => false);
  useEffect(() => {
    if (on) verifyOnce();
  }, [on]);
  return on;
}
