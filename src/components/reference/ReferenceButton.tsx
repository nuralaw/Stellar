"use client";

import { useId, useRef, useState, type ComponentType, type KeyboardEvent, type MouseEvent } from "react";
import { I, Icon } from "@/components/bank/icons";
import { showToast } from "@/lib/toast";
import type { ReferencePanel as ReferencePanelType } from "./ReferencePanel";

// The panel (and KaTeX with it) is only fetched the first time the button is pressed.
let Panel: ComponentType<Parameters<typeof ReferencePanelType>[0]> | null = null;

/** Same breakpoint as the panel: from here on it floats as a window, below it it is a bottom sheet. */
const WIDE_QUERY = "(min-width: 640px)";

/**
 * The "Reference" button of a math screen's header, with the official SAT reference sheet it opens (per screen, closed by
 * default). `variant="label"` is the Calculator button of lessons / practice (icon + label from `labelFrom`), `"icon"` the
 * icon-only one of timed screens. On phones both the sheet and the calculator are bottom sheets, so opening one closes
 * the other: pass the screen's `calcOpen` and a way to close it.
 */
export function ReferenceButton({
  variant = "label",
  labelFrom = "sm",
  className = "",
  calcOpen = false,
  onCloseCalc,
}: {
  variant?: "label" | "icon";
  /** Viewport breakpoint from which the "Reference" label shows (`variant="label"`). */
  labelFrom?: "sm" | "lg";
  className?: string;
  calcOpen?: boolean;
  onCloseCalc?: () => void;
}) {
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const loading = useRef(false);
  /** null = closed. `top` is where the floating window starts (under the header); `key` = opened from the keyboard. */
  const [shown, setShown] = useState<{ top: number; key: boolean } | null>(null);
  const open = shown !== null;

  // The calculator was opened while the reference sheet is a bottom sheet: the calculator wins.
  const [wasCalcOpen, setWasCalcOpen] = useState(calcOpen);
  if (wasCalcOpen !== calcOpen) {
    setWasCalcOpen(calcOpen);
    if (calcOpen && shown && !window.matchMedia(WIDE_QUERY).matches) setShown(null);
  }

  /** Focus goes back to the button only after a keyboard close, so a mouse close doesn't make Enter press it again. */
  const close = (keyboard: boolean) => {
    setShown(null);
    if (keyboard) btn.current?.focus();
  };

  const toggle = async (e: MouseEvent<HTMLButtonElement>) => {
    if (open) {
      setShown(null);
      return;
    }
    if (loading.current) return;
    const header = e.currentTarget.closest(".sticky") ?? e.currentTarget;
    const top = Math.round(header.getBoundingClientRect().bottom) + 8;
    const key = e.detail === 0;
    if (!Panel) {
      loading.current = true;
      try {
        Panel = (await import("./ReferencePanel")).ReferencePanel;
      } catch {
        showToast("Reference sheet", "It couldn't be loaded. Check your connection and try again.");
        return;
      } finally {
        loading.current = false;
      }
    }
    if (calcOpen && !window.matchMedia(WIDE_QUERY).matches) onCloseCalc?.();
    setShown({ top, key });
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      close(true);
    }
  };

  const base = variant === "icon" ? "grid h-9 w-9 shrink-0 place-items-center rounded-lg border bg-surface transition-colors hover:bg-surface-2" : "inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-semibold transition-colors";
  const state = variant === "icon" ? (open ? "border-primary text-primary-strong" : "border-line text-muted") : open ? "border-primary bg-primary-soft text-primary-strong" : "border-line bg-surface text-ink hover:bg-surface-2";

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={toggle}
        onMouseDown={(e) => e.preventDefault()}
        onKeyDown={onKey}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-haspopup="dialog"
        aria-label="Official SAT reference sheet"
        title="Official SAT reference sheet"
        className={`${base} ${state} ${className}`}
      >
        <Icon d={I.formula} className="h-4.5 w-4.5" />
        {variant === "label" && <span className={`hidden ${labelFrom === "lg" ? "lg:inline" : "sm:inline"}`}>Reference</span>}
      </button>
      {shown && Panel && <Panel id={id} top={shown.top} focusFirst={shown.key} onClose={close} />}
    </>
  );
}
