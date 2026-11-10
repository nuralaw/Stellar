"use client";

import { useEffect, useRef, useState } from "react";
import { loadDesmos, type DesmosCalculator } from "@/lib/desmos";

const isDark = () => document.documentElement.dataset.theme === "dark";

/**
 * Desmos graphing calculator (the one built into the real Digital SAT).
 * Keep it mounted while hidden so expressions survive between questions; pass `visible` so it can resize when shown.
 */
export function Calculator({ visible }: { visible: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const calc = useRef<DesmosCalculator | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Create once (and again on retry).
  useEffect(() => {
    let alive = true;
    loadDesmos().then(
      (Desmos) => {
        if (!alive || !host.current) return;
        calc.current = Desmos.GraphingCalculator(host.current, {
          keypad: true,
          expressions: true,
          settingsMenu: true,
          zoomButtons: true,
          expressionsTopbar: true,
          border: false,
          autosize: true,
          invertedColors: isDark(),
        });
      },
      (e: Error) => alive && setError(e.message),
    );
    return () => {
      alive = false;
      calc.current?.destroy();
      calc.current = null;
    };
  }, [attempt]);

  // Follow the site theme.
  useEffect(() => {
    const obs = new MutationObserver(() => calc.current?.updateSettings({ invertedColors: isDark() }));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // A hidden container has no size; re-measure when it becomes visible.
  useEffect(() => {
    if (visible) requestAnimationFrame(() => calc.current?.resize());
  }, [visible]);

  if (error)
    return (
      <div className="grid h-full place-content-center gap-3 p-6 text-center text-sm">
        <p className="font-semibold">Calculator unavailable</p>
        <p className="text-muted">
          {error.startsWith("Missing") ? "The Desmos API key isn't set (NEXT_PUBLIC_DESMOS_API_KEY)." : `${error}. Check your connection.`}
        </p>
        {!error.startsWith("Missing") && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setAttempt((n) => n + 1);
            }}
            className="mx-auto rounded-lg border border-line px-3 py-1.5 font-semibold hover:bg-surface-2"
          >
            Try again
          </button>
        )}
      </div>
    );

  return (
    <div className="relative h-full w-full" data-calculator>
      <p className="absolute inset-0 grid place-content-center text-sm text-muted">Loading calculator…</p>
      <div ref={host} className="relative h-full w-full" />
    </div>
  );
}
