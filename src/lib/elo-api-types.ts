// Ranked matches (docs/ELO.md §8.4): the JSON contract between the API (/api/ranked/**, /api/leaderboard) and the UI.
// Stages 3–6 are built in parallel against this file: the API produces exactly these shapes, the pages consume them.
// All times are epoch milliseconds (server clock). Change a shape only together with every producer and consumer.

import type { CompetitionQuestion } from "./competition";
import type { LevelInfo } from "./elo";
import type { SectionId } from "./taxonomy";
import type { Difficulty } from "./types";

/** Only Mixed for now (5 RW + 5 Math); "rw" / "math" come with stage 7. */
export type RankedMode = "mixed";
export type RankedRole = "a" | "b";
export type RankedStatus = "playing_a" | "waiting" | "playing_b" | "finished" | "expired" | "void";
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
  /** While waiting for an opponent: when the match expires. */
  expiresAt: number | null;
}

/** GET /api/ranked */
export interface RankedHub {
  me: RankedMe;
  /** A match this player still has to play (playing_a as creator, playing_b as opponent). */
  active: MatchSummary | null;
  /** This player's finished part, opponent pending (waiting / playing_b as creator). */
  waiting: MatchSummary[];
  /** Last 10 finished / expired / void matches. */
  recent: MatchSummary[];
  limits: { waitingLeft: number; dailyLeft: number };
}

/** POST /api/ranked/play  { mode } */
export interface PlayResponse {
  matchId: string;
  role: RankedRole;
  /** The opponent when joining as B; null when playing first as A. */
  opponent: PublicPlayer | null;
  /** True when an unfinished match was returned instead of a new one. */
  resumed: boolean;
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

/** One question in the review, available only after this player's part is done. */
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
  myPartDone: boolean;
  ratingBefore: number | null;
  ratingAfter: number | null;
  /** Set when this player (or the opponent) forfeited. */
  forfeit: RankedRole | null;
  /** Null until this player's part is done. */
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

/** Every error response: `{ error, code }` with the HTTP status from docs/ELO.md §8.4. */
export type RankedErrorCode = "auth" | "verify" | "name" | "limit_waiting" | "limit_daily" | "not_found" | "conflict" | "bad_request" | "setup";
export interface RankedError {
  error: string;
  code: RankedErrorCode;
}
