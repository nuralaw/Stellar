import { Avatar } from "@/components/Avatar";
import { LevelBadge } from "@/components/ranked/LevelBadge";
import type { LeaderBoardId, LeaderboardRow } from "@/lib/elo-api-types";
import { MEDAL, YouTag, displayName } from "./Rows";

// Place -> pedestal height / look. Order on screen is 2nd, 1st, 3rd.
const PLACES = [
  { i: 1, base: "h-14 sm:h-20", tone: "bg-surface-2" },
  { i: 0, base: "h-20 sm:h-28", tone: "bg-primary-soft" },
  { i: 2, base: "h-10 sm:h-14", tone: "bg-surface-2" },
] as const;

/** Top 3 as a podium (page 1 of a board with at least three players). */
export function Podium({ rows, board }: { rows: LeaderboardRow[]; board: LeaderBoardId }) {
  const week = board === "week";
  return (
    <ol className="grid grid-cols-3 items-end gap-2 sm:gap-4" aria-label="Top 3">
      {PLACES.map(({ i, base, tone }) => {
        const r = rows[i];
        return (
          <li key={i} className="flex min-w-0 flex-col items-center text-center">
            <Avatar value={r.avatar || "🙂"} className={`${i === 0 ? "h-14 w-14 text-3xl sm:h-20 sm:w-20 sm:text-5xl" : "h-11 w-11 text-2xl sm:h-14 sm:w-14 sm:text-3xl"} ${r.me ? "ring-2 ring-primary" : ""}`} />
            <p className="mt-2 flex max-w-full items-center gap-1 text-sm font-semibold">
              <span className="truncate">{displayName(r)}</span>
              {r.me && <YouTag />}
            </p>
            <div className="mt-1 hidden sm:block">
              <LevelBadge level={r.level} size="sm" />
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">{week ? (r.points ?? 0) : r.rating}</p>
            <p className="text-xs text-muted">{week ? "points" : "ELO"}</p>
            <div className={`mt-2 grid w-full place-items-start justify-items-center rounded-t-xl border border-b-0 border-line pt-2 text-2xl ${tone} ${base}`}>
              <span aria-label={`Rank ${i + 1}`}>{MEDAL[i]}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
