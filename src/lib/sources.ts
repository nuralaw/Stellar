// Where questions come from, and the question banks built from them.
// Every question carries a `source`; a bank is a set of sources shown together on /practice.

export type SourceId = "cb" | "past" | "stellar";

export interface Source {
  id: SourceId;
  name: string;
  /** Short label for badges. */
  short: string;
}

export const SOURCES: Record<SourceId, Source> = {
  cb: { id: "cb", name: "College Board", short: "College Board" },
  past: { id: "past", name: "Past SAT papers", short: "Past paper" },
  stellar: { id: "stellar", name: "Stellar", short: "Stellar" },
};

export type BankId = "all" | "cb";

export interface Bank {
  id: BankId;
  name: string;
  description: string;
  /** Sources included; null = every source. */
  sources: SourceId[] | null;
  /** Needs Stellar Plus (the "question-bank" feature). */
  plus: boolean;
}

export const BANKS: Bank[] = [
  // "all" is the general bank (id kept for old links): everything except College Board.
  { id: "all", name: "General", description: "Questions from past SAT papers, sorted by topic and difficulty.", sources: ["past", "stellar"], plus: true },
  { id: "cb", name: "College Board", description: "Only questions from the official College Board question bank.", sources: ["cb"], plus: false },
];

/** Sources open to everyone; every other source needs the "question-bank" feature. */
export const FREE_SOURCES: readonly SourceId[] = ["cb"];
/** The bank a free visitor lands in. */
export const FREE_BANK: BankId = "cb";

/** Whether a question from `source` may be shown to a visitor (canBank = has the "question-bank" feature). */
export function sourceOpen(source: SourceId, canBank: boolean): boolean {
  return canBank || FREE_SOURCES.includes(source);
}

export function getBank(id: BankId): Bank {
  return BANKS.find((b) => b.id === id) ?? BANKS[0];
}

export function inBank(bank: BankId, source: SourceId): boolean {
  const b = getBank(bank);
  return b.sources === null || b.sources.includes(source);
}
