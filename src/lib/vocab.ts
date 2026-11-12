import "server-only";
import fs from "node:fs";
import path from "node:path";

// Vocabulary: content/vocab/words.json (built by scripts/vocab-build.mjs from source.json + our own entries).
// Three lists: "core" (25 sets of 20 SAT words), "power" (harder words + the Must-know set), "math" (SAT math terms).

export type VocabList = "core" | "power" | "math";

export interface VocabWord {
  /** Stable id for progress (the word; math terms get an "m-" prefix). */
  id: string;
  word: string;
  pos: string;
  def: string;
  example: string;
  /** The exact form of the word in the example, to highlight. */
  form: string;
  syn: string[];
  list: VocabList;
  /** core: set number 1–25. */
  unit?: number;
  /** One of the ~50 most important words. */
  cram?: boolean;
  /** Preposition the word goes with ("on" for "capitalize on"). */
  with?: string;
  /** math: algebra | geometry | data | numbers. */
  topic?: string;
}

export interface VocabSet {
  id: string;
  list: VocabList;
  title: string;
  /** One short line: "characterize, constraint, contradict…" or a range. */
  subtitle: string;
  words: VocabWord[];
}

export const LISTS: { id: VocabList; label: string; blurb: string }[] = [
  { id: "core", label: "SAT words", blurb: "500 words that keep showing up in SAT passages, 20 per set." },
  { id: "power", label: "Advanced", blurb: "Harder words for a top score, and the 50 to know first." },
  { id: "math", label: "Math terms", blurb: "The words math questions use, by topic." },
];

const TOPICS: Record<string, string> = { algebra: "Algebra", geometry: "Geometry", data: "Data and statistics", numbers: "Numbers and operations" };

const ROOT = path.join(process.cwd(), "content", "vocab");
let cache: { words: VocabWord[]; sets: VocabSet[] } | null = null;

function load() {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const file = path.join(ROOT, "words.json");
  const words: VocabWord[] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
  const sets: VocabSet[] = [];
  const preview = (ws: VocabWord[]) => ws.slice(0, 3).map((w) => w.word).join(", ") + (ws.length > 3 ? "…" : "");

  // SAT words: one set per unit.
  const core = words.filter((w) => w.list === "core");
  for (const u of [...new Set(core.map((w) => w.unit ?? 0))].sort((a, b) => a - b)) {
    const ws = core.filter((w) => w.unit === u);
    sets.push({ id: `set-${u}`, list: "core", title: `Set ${u}`, subtitle: preview(ws), words: ws });
  }

  // Advanced: the must-know words first, then the rest A–Z in sets of about 20.
  const must = words.filter((w) => w.cram && w.list !== "math").sort((a, b) => a.word.localeCompare(b.word));
  if (must.length) sets.push({ id: "must-know", list: "power", title: `Must-know ${must.length}`, subtitle: "Learn these first", words: must });
  const power = words.filter((w) => w.list === "power" && !w.cram).sort((a, b) => a.word.localeCompare(b.word));
  const chunks = Math.max(1, Math.round(power.length / 20));
  for (let k = 0; k < chunks; k++) {
    const ws = power.slice(Math.round((k * power.length) / chunks), Math.round(((k + 1) * power.length) / chunks));
    if (!ws.length) continue;
    const range = `${ws[0].word[0].toUpperCase()}–${ws[ws.length - 1].word[0].toUpperCase()}`;
    sets.push({ id: `power-${k + 1}`, list: "power", title: `Advanced ${k + 1}`, subtitle: `${range} · ${preview(ws)}`, words: ws });
  }

  // Math terms by topic.
  const math = words.filter((w) => w.list === "math");
  for (const [t, title] of Object.entries(TOPICS)) {
    const ws = math.filter((w) => w.topic === t).sort((a, b) => a.word.localeCompare(b.word));
    if (ws.length) sets.push({ id: `math-${t}`, list: "math", title, subtitle: preview(ws), words: ws });
  }
  const other = math.filter((w) => !w.topic || !TOPICS[w.topic]);
  if (other.length) sets.push({ id: "math-other", list: "math", title: "More math terms", subtitle: preview(other), words: other });

  cache = { words, sets };
  return cache;
}

export function getVocabSets(): VocabSet[] {
  return load().sets;
}

export function getVocabSet(id: string): VocabSet | null {
  if (!/^[\w-]+$/.test(id)) return null;
  return load().sets.find((s) => s.id === id) ?? null;
}

export function getVocabWords(): VocabWord[] {
  return load().words;
}
