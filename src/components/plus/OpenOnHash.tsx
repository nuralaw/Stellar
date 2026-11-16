"use client";

import { useEffect } from "react";

/** Opens the FAQ item (<details>) named by the URL hash, on load and when the hash changes. */
export function OpenOnHash() {
  useEffect(() => {
    const open = () => {
      let id = "";
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const el = id ? document.getElementById(id) : null;
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
