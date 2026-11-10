// Where questions come from, and the question banks built from them.
// Every question carries a `source`; a bank is a set of sources shown together on /practice.

export type SourceId = "cb" | "stellar";

export interface Source {
  id: SourceId;
  name: string;
  /** Short label for badges. */
  short: string;
}

export const SOURCES: Record<SourceId, Source> = {
  cb: { id: "cb", name: "College Board", short: "College Board" },
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
  { id: "all", name: "All questions", description: "Every practice question on Stellar, including College Board questions.", sources: null },
  { id: "cb", name: "College Board", description: "Only questions from the official College Board question bank.", sources: ["cb"] },
];

export function getBank(id: BankId): Bank {
  return BANKS.find((b) => b.id === id) ?? BANKS[0];
}

export function inBank(bank: BankId, source: SourceId): boolean {
  const b = getBank(bank);
  return b.sources === null || b.sources.includes(source);
}
