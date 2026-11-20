import { I, Icon } from "@/components/bank/icons";

// The Free / Plus marker of the landing page, worded like /plus. No hooks: usable from server and client components.

export type TagKind = "free" | "plus" | "both";

export function Tag({ kind }: { kind: TagKind }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold";
  if (kind === "free") return <span className={`${base} bg-success-soft text-success`}>Free</span>;
  if (kind === "plus")
    return (
      <span className={`${base} bg-accent-soft text-primary-strong`}>
        <Icon d={I.star} filled className="h-3 w-3" />
        Plus
      </span>
    );
  return <span className={`${base} bg-surface-2 text-ink`}>Free · more with Plus</span>;
}
