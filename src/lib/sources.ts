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
}

export const BANKS: Bank[] = [
  // "all" is the general bank (id kept for old links): everything except College Board.
  { id: "all", name: "General", description: "Questions from past SAT papers, sorted by topic and difficulty.", sources: ["past", "stellar"] },
  { id: "cb", name: "College Board", description: "Only questions from the official College Board question bank.", sources: ["cb"] },
];

export function getBank(id: BankId): Bank {
  return BANKS.find((b) => b.id === id) ?? BANKS[0];
}

export function inBank(bank: BankId, source: SourceId): boolean {
  const b = getBank(bank);
  return b.sources === null || b.sources.includes(source);
}
