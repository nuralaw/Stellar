"use client";

import { useEffect, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { dismissToast, useToast } from "@/lib/toast";

/** Shows the current toast at the bottom of the screen for its duration (a bar counts it down), then fades it out. */
export function Toaster() {
  const t = useToast();
  const [leaving, setLeaving] = useState<number | null>(null);

  useEffect(() => {
    if (!t) return;
    const out = setTimeout(() => setLeaving(t.id), Math.max(0, t.ms - 250));
    const gone = setTimeout(() => dismissToast(t.id), t.ms);
    return () => {
      clearTimeout(out);
      clearTimeout(gone);
    };
  }, [t]);

  if (!t) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4" aria-live="polite" data-tour-keep>
      <div
        key={t.id}
        role="status"
        className={`toast-in pointer-events-auto relative flex max-w-sm items-center gap-3 overflow-hidden rounded-2xl bg-side py-3 pr-3 pl-3.5 text-side-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] ring-1 ring-side-line ${leaving === t.id ? "toast-out" : ""}`}
      >
        <span className="lesson-pop grid h-8 w-8 shrink-0 place-items-center rounded-full bg-success text-white">
          <Icon d={I.check} className="h-4 w-4" strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{t.title}</span>
          {t.text && <span className="block text-xs leading-snug text-side-muted">{t.text}</span>}
        </span>
        <button type="button" onClick={() => dismissToast(t.id)} aria-label="Close" className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-side-muted hover:bg-side-2 hover:text-side-ink">
          <Icon d={I.x} className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
        {/* countdown */}
        <span className="toast-timer absolute inset-x-0 bottom-0 h-0.5 origin-left bg-success/70" style={{ animationDuration: `${t.ms}ms` }} />
      </div>
    </div>
  );
}
