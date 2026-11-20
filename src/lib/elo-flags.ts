// Ranked matches: suspicion flags for the admin's manual review (docs/ELO.md 6.4). Pure functions, no I/O, no automatic punishment.
// Three flags:
//  - fast_accurate: >= 8 of 10 correct and the mean of elapsed / limit over the answered questions is below 25%.
//  - same_pair: the same two players met in more than 3 matches inside one 7-day window that contains this match.
//  - rating_spike: a player's rating gain within the 24 hours up to this match is above +150.
// The numbers are here (not in elo-config.ts) because only the admin tab uses them.

export const ELO_FLAGS = {
  /** fast_accurate: at least this many correct answers ... */
  fastCorrectMin: 8,
  /** ... with the mean share of the time limit (elapsed / limit) strictly below this. */
  fastMeanShare: 0.25,
  /** same_pair: more than this many matches of one pair ... */
  pairMatchesMax: 3,
  /** ... inside this many days. */
  pairWindowDays: 7,
  /** rating_spike: a gain strictly above this many points ... */
  gainMax: 150,
  /** ... within this many hours. */
  gainWindowH: 24,
} as const;

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const MS_PER_S = 1000;

export type FlagKind = "fast_accurate" | "same_pair" | "rating_spike";
export type FlagSide = "a" | "b" | "both";

export interface MatchFlag {
  kind: FlagKind;
  side: FlagSide;
  /** Short human-readable numbers for the admin ("9/10 correct, mean 18% of the limit"). */
  detail: string;
}

/** What fast_accurate needs from one answer row. */
export interface FlagAnswer {
  status: "open" | "answered" | "timeout" | "annulled";
  correct: boolean | null;
  elapsedMs: number | null;
  limitS: number;
}

export interface FastAccurateResult {
  flagged: boolean;
  correct: number;
  /** Questions that count for the mean (answered, with a measured time). */
  answered: number;
  /** Mean of elapsed / limit, 0..1+ ; null when nothing was answered. */
  meanShare: number | null;
}

/** >= 8 correct with a mean time share below 25% of the limits. Timeouts and open rows don't enter the mean. */
export function fastAccurate(answers: readonly FlagAnswer[]): FastAccurateResult {
  const correct = answers.filter((a) => a.correct === true).length;
  const timed = answers.filter((a) => a.status === "answered" && a.elapsedMs !== null && a.limitS > 0);
  if (timed.length === 0) return { flagged: false, correct, answered: 0, meanShare: null };
  const meanShare = timed.reduce((s, a) => s + (a.elapsedMs as number) / (a.limitS * MS_PER_S), 0) / timed.length;
  return { flagged: correct >= ELO_FLAGS.fastCorrectMin && meanShare < ELO_FLAGS.fastMeanShare, correct, answered: timed.length, meanShare };
}

export interface PairMatch {
  id: string;
  playerA: string;
  playerB: string | null;
  status: string;
  /** Unix ms the pair was made: when the match was created. */
  createdAt: number;
}

export interface SamePairResult {
  flagged: boolean;
  /** The largest number of this pair's matches inside one 7-day window that contains the target match. */
  count: number;
}

const samePlayers = (x: PairMatch, y: PairMatch) =>
  x.playerB !== null && y.playerB !== null && ((x.playerA === y.playerA && x.playerB === y.playerB) || (x.playerA === y.playerB && x.playerB === y.playerA));

/**
 * `others` may hold any matches (the target itself, other pairs and void ones are ignored). The target always counts, even if void,
 * so the admin sees why an already voided match was suspicious.
 */
export function samePair(target: PairMatch, others: readonly PairMatch[]): SamePairResult {
  if (target.playerB === null) return { flagged: false, count: 0 };
  const times = new Map<string, number>([[target.id, target.createdAt]]);
  for (const o of others) {
    if (o.id !== target.id && o.status !== "void" && samePlayers(target, o)) times.set(o.id, o.createdAt);
  }
  const all = [...times.values()];
  const span = ELO_FLAGS.pairWindowDays * DAY_MS;
  let count = 0;
  for (const start of all) {
    if (start > target.createdAt || start + span < target.createdAt) continue; // the window [start, start + 7 d] must contain the target
    count = Math.max(count, all.filter((t) => t >= start && t <= start + span).length);
  }
  return { flagged: count > ELO_FLAGS.pairMatchesMax, count };
}

/** One finished (not void) match of a player: when it finished and how much their rating changed. */
export interface GainRow {
  matchId: string;
  at: number;
  delta: number;
}

export interface RatingSpikeResult {
  flagged: boolean;
  /** Sum of the player's rating changes in the 24 hours up to and including `at`. */
  gain: number;
}

/** `rows` are the player's finished, non-void matches (the target may be among them). Window: [at - 24 h, at]. */
export function ratingSpike(at: number, rows: readonly GainRow[]): RatingSpikeResult {
  const from = at - ELO_FLAGS.gainWindowH * HOUR_MS;
  const gain = rows.filter((r) => r.at >= from && r.at <= at).reduce((s, r) => s + r.delta, 0);
  return { flagged: gain > ELO_FLAGS.gainMax, gain };
}

export interface FlagMatch extends PairMatch {
  finishedAt: number | null;
  deltaA: number | null;
  deltaB: number | null;
}

export interface FlagContext {
  answersA: readonly FlagAnswer[];
  answersB: readonly FlagAnswer[];
  /** Matches around this one (any pairs: they are filtered). */
  pairMatches: readonly PairMatch[];
  /** Finished non-void matches of each player around this one's finish time. */
  gainsA: readonly GainRow[];
  gainsB: readonly GainRow[];
}

const pct = (x: number | null) => (x === null ? "-" : `${Math.round(x * 100)}%`);

/** All flags of one match. */
export function flagsForMatch(m: FlagMatch, ctx: FlagContext): MatchFlag[] {
  const flags: MatchFlag[] = [];
  for (const [side, answers] of [["a", ctx.answersA], ["b", ctx.answersB]] as const) {
    const f = fastAccurate(answers);
    if (f.flagged) flags.push({ kind: "fast_accurate", side, detail: `${f.correct} correct, mean ${pct(f.meanShare)} of the limit` });
  }
  const pair = samePair(m, ctx.pairMatches);
  if (pair.flagged) flags.push({ kind: "same_pair", side: "both", detail: `${pair.count} matches of this pair within ${ELO_FLAGS.pairWindowDays} days` });
  if (m.status === "finished" && m.finishedAt !== null) {
    for (const [side, delta, rows] of [["a", m.deltaA, ctx.gainsA], ["b", m.deltaB, ctx.gainsB]] as const) {
      if (delta === null) continue;
      // The match itself always counts, even if the caller's rows missed it.
      const own: GainRow = { matchId: m.id, at: m.finishedAt, delta };
      const spike = ratingSpike(m.finishedAt, [...rows.filter((r) => r.matchId !== m.id), own]);
      if (spike.flagged) flags.push({ kind: "rating_spike", side, detail: `${spike.gain >= 0 ? "+" : ""}${spike.gain} rating in ${ELO_FLAGS.gainWindowH} h` });
    }
  }
  return flags;
}

export const FLAG_LABEL: Record<FlagKind, string> = {
  fast_accurate: "Fast and accurate",
  same_pair: "Same pair",
  rating_spike: "Rating spike",
};
