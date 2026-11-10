"use client";

import { useEffect } from "react";

/** While mounted, marks <html data-focus> so chrome like the site footer hides (solving / tests / rounds). */
export function useFocusMode() {
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.focus = "";
    return () => {
      delete el.dataset.focus;
    };
  }, []);
}
