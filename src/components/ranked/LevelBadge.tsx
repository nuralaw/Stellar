import { I, Icon } from "@/components/bank/icons";
import { PLACEMENT_MATCHES } from "@/lib/elo-config";
import type { LevelInfo } from "@/lib/elo";

const SIZES = {
  sm: { box: "gap-1 rounded-lg px-2 py-0.5 text-xs", icon: "h-3 w-3" },
  md: { box: "gap-1.5 rounded-xl px-3 py-1 text-sm", icon: "h-4 w-4" },
  lg: { box: "gap-2 rounded-2xl px-4 py-2 text-lg", icon: "h-5 w-5" },
} as const;

/** Colour by tier: early levels are quiet, the top ones are filled with the brand orange. */
function tone(level: number): string {
  if (level >= 8) return "border-primary bg-primary text-primary-ink";
  if (level >= 5) return "border-primary-strong/40 bg-primary-soft text-primary-strong";
  return "border-line bg-surface-2 text-ink";
}

/** Star-themed level name (Spark ... Stellar), or "Placement · N/10" while the player is still calibrating. */
export function LevelBadge({ level, size = "md" }: { level: LevelInfo; size?: "sm" | "md" | "lg" }) {
  const s = SIZES[size];
  if (level.placement) {
    return (
      <span className={`inline-flex items-center border border-dashed border-muted/60 bg-surface font-semibold whitespace-nowrap text-muted tabular-nums ${s.box}`}>
        Placement · {PLACEMENT_MATCHES - level.left}/{PLACEMENT_MATCHES}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center border font-semibold whitespace-nowrap ${tone(level.level)} ${s.box}`} title={`Level ${level.level}`}>
      <Icon d={I.star} className={s.icon} filled strokeWidth={1.4} />
      {level.name}
    </span>
  );
}
