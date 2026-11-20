"use client";

import { useId, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { Markdown } from "./Markdown";

/**
 * The step's ```more block: a quiet "Not clear? Explain more" button that opens a short extra explanation
 * (a term defined, a missing step, a second phrasing). Closed by default; the height and opacity animate
 * (not with reduced motion). The player re-mounts it for every step, so it starts closed.
 */
export function More({ source }: { source: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="group -ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-muted transition-colors outline-none hover:text-primary-strong focus-visible:ring-3 focus-visible:ring-primary/30"
      >
        {open ? "Show less" : "Not clear? Explain more"}
        <Icon d={I.chevronD} className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} strokeWidth={2.2} />
      </button>
      {/* grid-rows 0fr → 1fr animates the height; inert keeps the closed text out of reach of keyboard and screen readers */}
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mt-1.5 rounded-xl bg-surface-2 px-4 py-3.5 text-[15px] [&>div]:text-[15px] [&>div]:leading-relaxed [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0">
            <Markdown source={source} />
          </div>
        </div>
      </div>
    </div>
  );
}
