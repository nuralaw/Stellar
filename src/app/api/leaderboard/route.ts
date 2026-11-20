import type { NextRequest } from "next/server";
import { currentUser, NO_STORE } from "@/lib/admin";
import { levelOf } from "@/lib/elo";
import { BOARD_MAX_PAGES, BOARD_PAGE_SIZE, prevSeasonKey, seasonKey, weekKey } from "@/lib/elo-season";
import { EloSetupError, EloStoreUnavailable, store, type Board, type LeaderRow } from "@/lib/elo-store";
import type { LeaderBoardId, LeaderboardResponse, LeaderboardRow, RankedError } from "@/lib/elo-api-types";
import { anonIdOf } from "../competition/handle";

// GET /api/leaderboard?board=global|season|week&page=1 -> LeaderboardResponse (docs/ELO.md 7, 8.4). Public: readable signed out (me = null).
// Only the top 100 is browsable (pages 1 and 2 of 50); the viewer's own row always comes back in `me`, with its true rank.
// Cache-Control: no-store, because the body carries the viewer's own row and a shared cache would hand it to someone else;
// the boards change after every finished match anyway.

const BOARDS: readonly LeaderBoardId[] = ["global", "season", "week"];

const fail = (status: number, code: RankedError["code"], error: string) => Response.json({ error, code } satisfies RankedError, { status, headers: NO_STORE });

/** Closing a month is idempotent in the store, so "once" only has to hold per server process: concurrent requests share one call. */
const closing = new Map<string, Promise<void>>();
const closed = new Set<string>();

/** Lazily saves the final table of the previous UTC month the first time the season board is read in a new month. Never blocks the board. */
async function closePreviousSeason(now: number): Promise<void> {
  const season = prevSeasonKey(now);
  if (closed.has(season)) return;
  let run = closing.get(season);
  if (!run) {
    run = store
      .closeSeason(season, now)
      .then(() => void closed.add(season))
      .catch((e) => {
        // Setup / outage errors surface from the board query itself; here just allow a retry on the next request.
        console.error(`[leaderboard] closing season ${season} failed:`, e instanceof Error ? e.message : e);
      })
      .finally(() => void closing.delete(season));
    closing.set(season, run);
  }
  await run;
}

function toRow(r: LeaderRow, rank: number | null, me: boolean) {
  return {
    rank,
    name: r.name,
    avatar: r.avatar,
    rating: r.rating,
    level: levelOf(r.rating, r.matches),
    matches: r.matches,
    wins: r.wins,
    losses: r.losses,
    draws: r.draws,
    winRate: r.matches > 0 ? r.wins / r.matches : 0,
    ...(r.points !== undefined ? { points: r.points } : {}),
    me,
  };
}

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const board = (p.get("board") ?? "global") as LeaderBoardId;
  if (!BOARDS.includes(board)) return fail(400, "bad_request", "Unknown board.");
  const asked = Number(p.get("page") ?? 1);
  if (p.get("page") !== null && !Number.isInteger(asked)) return fail(400, "bad_request", "Page must be a whole number.");
  const page = Math.min(BOARD_MAX_PAGES, Math.max(1, asked));
  const now = Date.now();

  try {
    const user = await currentUser();
    // Local dev (no Supabase accounts, file store): the tournament's guest id stands in for the account so "You" can be tried out.
    const viewer = user ? user.id.toLowerCase() : store.kind === "file" ? anonIdOf(p.get("userId")) : null;

    if (board === "season") await closePreviousSeason(now);
    const result = await store.leaderboard({ board: board as Board, page, size: BOARD_PAGE_SIZE, userId: viewer, now });

    const myRank = result.me?.rank ?? null;
    const offset = (page - 1) * BOARD_PAGE_SIZE;
    const body: LeaderboardResponse = {
      board,
      page,
      pageSize: BOARD_PAGE_SIZE,
      total: result.total,
      rows: result.rows.map((r, i): LeaderboardRow => {
        const rank = r.rank ?? offset + i + 1;
        return toRow(r, rank, rank === myRank) as LeaderboardRow;
      }),
      me: result.me ? toRow(result.me, myRank, true) : null,
      ...(board === "season" ? { period: seasonKey(now) } : board === "week" ? { period: weekKey(now) } : {}),
    };
    return Response.json(body, { headers: NO_STORE });
  } catch (e) {
    if (e instanceof EloSetupError) return fail(503, "setup", e.message);
    if (e instanceof EloStoreUnavailable) return fail(503, "setup", "The ranked database is unavailable right now. Try again in a moment.");
    throw e;
  }
}
