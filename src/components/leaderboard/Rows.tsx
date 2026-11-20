import { Avatar } from "@/components/Avatar";
import { LevelBadge } from "@/components/ranked/LevelBadge";
import type { LeaderBoardId, LeaderboardRow } from "@/lib/elo-api-types";

export type AnyRow = Omit<LeaderboardRow, "rank"> & { rank: number | null };

export const MEDAL = ["🥇", "🥈", "🥉"] as const;

/** Rank, avatar + name (+ level on phones), then level, ELO, matches and win % (points on the week board) from `sm` up. */
export const GRID = "items-center gap-x-2 sm:grid-cols-[3rem_minmax(0,1fr)_9rem_4.5rem_4.5rem_4.5rem] sm:gap-x-3";
const GRID_MOBILE = "grid-cols-[2.25rem_minmax(0,1fr)_auto]";

export const displayName = (r: { name: string }) => r.name.trim() || "Player";
const pct = (r: AnyRow) => `${Math.round(r.winRate * 100)}%`;

export function RankCell({ rank }: { rank: number | null }) {
  if (rank === null) return <span className="text-muted">–</span>;
  return rank <= 3 ? <span aria-label={`Rank ${rank}`}>{MEDAL[rank - 1]}</span> : <span>{rank}</span>;
}

export function TableHead({ board }: { board: LeaderBoardId }) {
  return (
    <div className={`hidden sm:grid ${GRID} border-b border-line px-5 py-2.5 text-xs font-medium text-muted`} role="row">
      <span role="columnheader">#</span>
      <span role="columnheader">Player</span>
      <span role="columnheader">Level</span>
      <span className="text-right" role="columnheader">
        ELO
      </span>
      <span className="text-right" role="columnheader">
        Matches
      </span>
      <span className="text-right" role="columnheader">
        {board === "week" ? "Points" : "Win %"}
      </span>
    </div>
  );
}

export function YouTag() {
  return <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-ink uppercase">You</span>;
}

/** One leaderboard row: a compact 3-column row on phones, a full table row from `sm`. */
export function PlayerRow({ row, board }: { row: AnyRow; board: LeaderBoardId }) {
  const week = board === "week";
  return (
    <div className={`grid ${GRID} ${GRID_MOBILE} px-4 py-3 text-sm sm:px-5 ${row.me ? "bg-primary-soft/60" : ""}`} role="row">
      <span className="font-semibold tabular-nums" role="cell">
        <RankCell rank={row.rank} />
      </span>
      <span className="flex min-w-0 flex-col gap-1 sm:block" role="cell">
        <span className="flex min-w-0 items-center gap-2">
          <Avatar value={row.avatar || "🙂"} className="h-8 w-8 text-lg sm:h-7 sm:w-7 sm:text-base" />
          <span className="truncate font-medium">{displayName(row)}</span>
          {row.me && <YouTag />}
        </span>
        <span className="pl-10 sm:hidden">
          <LevelBadge level={row.level} size="sm" />
        </span>
      </span>
      <span className="hidden sm:block" role="cell">
        <LevelBadge level={row.level} size="sm" />
      </span>
      {/* Phones: the main number with the rest under it. */}
      <span className="text-right sm:hidden" role="cell">
        <span className="block font-bold tabular-nums">{week ? `${row.points ?? 0} pts` : row.rating}</span>
        <span className="block text-xs text-muted tabular-nums">
          {week ? `ELO ${row.rating}` : `${row.matches} m · ${pct(row)}`}
        </span>
      </span>
      <span className={`hidden text-right tabular-nums sm:block ${week ? "text-muted" : "font-bold"}`} role="cell">
        {row.rating}
      </span>
      <span className="hidden text-right text-muted tabular-nums sm:block" role="cell">
        {row.matches}
      </span>
      <span className={`hidden text-right tabular-nums sm:block ${week ? "font-bold" : "text-muted"}`} role="cell">
        {week ? (row.points ?? 0) : pct(row)}
      </span>
    </div>
  );
}

export function RowSkeletons({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-3 p-4 sm:p-5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-5 w-6 rounded bg-surface-2 motion-safe:animate-pulse" />
          <div className="h-8 w-8 shrink-0 rounded-full bg-surface-2 motion-safe:animate-pulse" />
          <div className="h-5 flex-1 rounded-lg bg-surface-2 motion-safe:animate-pulse" />
          <div className="h-5 w-16 rounded-lg bg-surface-2 motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}
