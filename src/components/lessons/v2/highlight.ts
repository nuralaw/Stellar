import { locate, type Located, type Placement } from "@/lib/lesson-format";

export { locate };
export type { Located, Placement };

/** A piece of one text: plain, or the phrase of placement `mark` (index into Located.placements). */
export interface Piece {
  text: string;
  mark?: number;
  /** A mark's later paragraph (the phrase spans a blank line): lit like the first, but without the number badge. */
  cont?: boolean;
}

/** Cuts `texts[text]` at the placements that belong to it. The pieces join back into the original text. */
export function pieces(texts: string[], text: number, placements: Placement[]): Piece[] {
  const raw = texts[text];
  const mine = placements
    .map((p, mark) => ({ p, mark }))
    .filter(({ p }) => p.text === text)
    .sort((a, b) => a.p.start - b.p.start);
  const out: Piece[] = [];
  let at = 0;
  for (const { p, mark } of mine) {
    if (p.start > at) out.push({ text: raw.slice(at, p.start) });
    out.push({ text: raw.slice(p.start, p.end), mark });
    at = p.end;
  }
  if (at < raw.length) out.push({ text: raw.slice(at) });
  return out.length ? out : [{ text: raw }];
}

/** Bank R&W text can hold <u>…</u>: a cut inside it would leave tags unpaired, so close and reopen the tag at each cut. */
export function balanceUnderline(list: Piece[]): Piece[] {
  let depth = 0;
  return list.map((p) => {
    const opens = (p.text.match(/<u>/g) ?? []).length;
    const closes = (p.text.match(/<\/u>/g) ?? []).length;
    const text = `${depth > 0 ? "<u>" : ""}${p.text}`;
    depth = Math.max(0, depth + opens - closes);
    return { ...p, text: depth > 0 ? `${text}</u>` : text };
  });
}

/** Splits pieces into paragraphs at blank lines (as RichText does), so a paragraph break never sits inside a mark. */
export function paragraphs(list: Piece[]): Piece[][] {
  const out: Piece[][] = [[]];
  for (const p of list) {
    p.text.split(/\n\s*\n/).forEach((part, i) => {
      if (i > 0) out.push([]);
      if (part) out[out.length - 1].push({ text: part, mark: p.mark, ...(i > 0 && p.mark !== undefined ? { cont: true } : {}) });
    });
  }
  return out.filter((para) => para.length);
}
