import { I, Icon } from "@/components/bank/icons";

const S = { sm: "h-6 w-6 rounded-lg", md: "h-9 w-9 rounded-xl", lg: "h-12 w-12 rounded-2xl" } as const;
const ICON = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-6 w-6" } as const;

/** The Stellar Plus star: a gradient tile. Decorative, always next to text. */
export function PlusMark({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center bg-linear-to-br from-accent to-primary-hover text-primary-ink shadow-[0_6px_18px_-8px_var(--liquid-ring)] dark:from-primary-hover dark:to-accent ${S[size]} ${className}`}
    >
      <Icon d={I.star} filled className={ICON[size]} />
    </span>
  );
}

/** The quiet "Plus" marker for lists. */
export function PlusTag({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 font-medium text-muted ${className}`}>
      <Icon d={I.star} className="h-3 w-3" />
      Plus
    </span>
  );
}

/** Marks sample data. */
export function ExampleChip() {
  return <span className="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink uppercase">Example</span>;
}
