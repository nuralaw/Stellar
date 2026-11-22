// Ranked matches (docs/ELO-live.md, with docs/ELO.md §8.4 for the unchanged parts): the JSON contract between the API
// (/api/ranked/**, /api/leaderboard) and the UI. The API produces exactly these shapes, the pages consume them.
// All times are epoch milliseconds (server clock). Change a shape only together with every producer and consumer.

import type { CompetitionQuestion } from "./competition";
import type { LevelInfo } from "./elo";
import type { SectionId } from "./taxonomy";
import type { Difficulty } from "./types";

/** Only Mixed for now (5 RW + 5 Math); "rw" / "math" come with stage 7. */
export type RankedMode = "mixed";
export type RankedRole = "a" | "b";
/**
 * Live matchmaking (docs/ELO-live.md): a match exists only once two players are paired from the queue; both then
 * play the same 10 questions at the same time. "playing" = at least one part still open; "finished" = both parts done and
 * ELO applied; "void" = nobody started in time (or voided by an admin), no rating change.
 */
export type RankedStatus = "playing" | "finished" | "void";
/** From the viewer's side. */
export type RankedOutcome = "win" | "loss" | "draw";

/** What anyone may see about a player: the public name and avatar from the profile, rating and level. */
export interface PublicPlayer {
  name: string;
  avatar: string;
  rating: number;
  level: LevelInfo;
}

export interface RankedMe extends PublicPlayer {
  peak: number;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  /** No public name in the profile yet: the hub asks for one before "Play ranked". */
  needsName: boolean;
}

/** One match in the hub's lists. */
export interface MatchSummary {
  id: string;
  mode: RankedMode;
  status: RankedStatus;
  role: RankedRole;
  createdAt: number;
  /** Questions this player has finished (answered, timed out or annulled), of `total`. */
  answered: number;
  total: number;
  myPoints: number | null;
  /** Only once the match is finished. */
  opponentPoints: number | null;
  opponent: PublicPlayer | null;
  outcome: RankedOutcome | null;
  /** Rating change for this player (after the floor); null until finished. */
  delta: number | null;
  /** This player's part is complete (all 10 questions closed). */
  myPartDone: boolean;
  /** The opponent's part is complete (their points stay hidden until the match is finished). */
  opponentDone: boolean;
  /** While this player hasn't opened their first question: the start deadline (pairing + 90 s); null once started. */
  startBy: number | null;
}

/** GET /api/ranked */
export interface RankedHub {
  me: RankedMe;
  /** The match this player is in right now (status "playing"), whether or not their own part is done. */
  active: MatchSummary | null;
  /** Last 10 finished / void matches. */
  recent: MatchSummary[];
  /** This player's queue state (so a reload during a search shows the search screen again). */
  queue: QueueState;
  limits: { dailyLeft: number };
}

/**
 * The matchmaking queue. POST /api/ranked/queue { mode, name, avatar } joins (or refreshes) the search;
 * GET /api/ranked/queue is the heartbeat + poll (every ~2 s while the search screen is open — a player who stops polling
 * for 15 s drops out of the queue); DELETE /api/ranked/queue cancels. Any of them can return "matched".
 * The search stops by itself after 5 minutes ("timeout"): no match is created, nothing changes.
 */
export interface QueueState {
  status: "idle" | "searching" | "matched" | "timeout";
  /** When the current search started; null when idle. */
  since: number | null;
  /** The current rating window (± points); null when not searching, or when there is no limit any more (after 2 minutes). */
  window: number | null;
  /** When the search gives up (since + 5 min); null when not searching. */
  until: number | null;
  /** Set when status is "matched". */
  matchId: string | null;
  opponent: PublicPlayer | null;
  /** Other players searching right now (any rating, same mode) — for "N players searching". */
  searching: number;
  serverNow: number;
}

/** A question as the player sees it during a match: no answer, no explanation, no bank id. */
export type RankedQuestion = Omit<CompetitionQuestion, "id">;

/** POST /api/ranked/[id]/next */
export type NextResponse =
  | {
      done: false;
      idx: number;
      total: number;
      section: SectionId;
      difficulty: Difficulty;
      question: RankedQuestion;
      limitS: number;
      issuedAt: number;
      /** For a clock-independent countdown: remaining = limitS·1000 − (serverNow − issuedAt) at receipt. */
      serverNow: number;
      totalPoints: number;
    }
  | { done: true; totalPoints: number };

/** POST /api/ranked/[id]/answer  { idx, response } */
export interface AnswerResponse {
  idx: number;
  correct: boolean;
  timedOut: boolean;
  base: number;
  bonus: number;
  points: number;
  elapsedMs: number;
  totalPoints: number;
  /** This player's part of the match is complete. */
  done: boolean;
}

/** One question in the review, available only once the match is no longer "playing" (finished or void). */
export interface ReviewItem {
  idx: number;
  section: SectionId;
  difficulty: Difficulty;
  question: RankedQuestion;
  answer: string | string[];
  explanation: string;
  response: string | null;
  correct: boolean;
  status: "answered" | "timeout" | "annulled";
  elapsedMs: number | null;
  limitS: number;
  base: number;
  bonus: number;
  points: number;
}

/** GET /api/ranked/[id] */
export interface MatchState extends MatchSummary {
  /** The server's clock when this was answered: count down to `startBy` from it, not from the device clock. */
  serverNow: number;
  ratingBefore: number | null;
  ratingAfter: number | null;
  /** Set when this player (or the opponent) forfeited. */
  forfeit: RankedRole | null;
  /** Null while the match is "playing" (the opponent may still be playing the same questions), and when there is nothing to review. */
  review: ReviewItem[] | null;
}

export type LeaderBoardId = "global" | "season" | "week";

export interface LeaderboardRow {
  rank: number;
  name: string;
  avatar: string;
  rating: number;
  level: LevelInfo;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  /** 0..1 */
  winRate: number;
  /** Week board only: points from ranked matches this week. */
  points?: number;
  me: boolean;
}

/** GET /api/leaderboard?board=global|season|week&page=1 */
export interface LeaderboardResponse {
  board: LeaderBoardId;
  page: number;
  pageSize: number;
  total: number;
  rows: LeaderboardRow[];
  /** The viewer's row (rank null when not on this board yet); null when signed out. */
  me: (Omit<LeaderboardRow, "rank"> & { rank: number | null }) | null;
  /** "YYYY-MM" for the season board, the week's Monday "YYYY-MM-DD" for the week board. */
  period?: string;
}

/**
 * Every error response: `{ error, code }` with the HTTP status from docs/ELO.md §8.4 (docs/ELO-live.md 5.2).
 * "in_match" (409): tried to queue while already in a "playing" match (the UI should open that match instead).
 */
export type RankedErrorCode = "auth" | "verify" | "name" | "in_match" | "limit_daily" | "not_found" | "conflict" | "bad_request" | "setup";
export interface RankedError {
  error: string;
  code: RankedErrorCode;
}
