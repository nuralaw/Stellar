// Builds content/vocab/words.json from the word list (source.json) and our own entries (entries.json).
//   npm run vocab:build    merge + check (errors fail; warnings print)
// source.json: the words, their lists ("core" sets 1–25, "power", "math") and flags (cram, with).
// entries.json: our own definition, example, the word's form in the example, synonyms, math topic.
import fs from "node:fs";
import path from "node:path";

const dir = path.join(path.resolve(import.meta.dirname, ".."), "content/vocab");
const source = JSON.parse(fs.readFileSync(path.join(dir, "source.json"), "utf8"));
const entries = JSON.parse(fs.readFileSync(path.join(dir, "entries.json"), "utf8"));
const key = (list, word) => `${list}:${word}`;
const byKey = new Map(entries.map((e) => [key(e.list, e.word), e]));

// Display names for math terms whose source name is awkward.
const NAME = {
  "isoceles (triangle)": "isosceles triangle",
  "prime (number)": "prime number",
  "consecutive (number)": "consecutive numbers",
  "inscribed (angle in a circle)": "inscribed angle",
  "exponent/power": "exponent (power)",
};
const slug = (s) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const words = (s) => s.split(/\s+/).filter(Boolean).length;

const out = [];
const errors = [];
const warns = [];
const ids = new Set();
for (const s of source) {
  const e = byKey.get(key(s.list, s.word));
  if (!e) {
    errors.push(`${s.word} (${s.list}): no entry`);
    continue;
  }
  const word = NAME[s.word] ?? s.word;
  const id = (s.list === "math" ? "m-" : "") + slug(word);
  if (ids.has(id)) errors.push(`${word}: duplicate id ${id}`);
  ids.add(id);
  for (const f of ["def", "example", "form", "pos"]) if (!e[f]?.trim()) errors.push(`${word}: empty ${f}`);
  if (e.example && e.form && !e.example.toLowerCase().includes(e.form.toLowerCase())) errors.push(`${word}: form "${e.form}" is not in the example`);
  if (words(e.def ?? "") > (s.list === "math" ? 20 : 14)) warns.push(`${word}: definition is ${words(e.def)} words`);
  if (words(e.example ?? "") > 24) warns.push(`${word}: example is ${words(e.example)} words`);
  out.push({
    id,
    word,
    pos: e.pos,
    def: e.def.trim(),
    example: e.example.trim(),
    form: e.form.trim(),
    syn: (e.syn ?? []).filter(Boolean).slice(0, 3),
    list: s.list,
    ...(s.unit ? { unit: s.unit } : {}),
    ...(s.cram ? { cram: true } : {}),
    ...(s.with ? { with: s.with } : {}),
    ...(s.list === "math" ? { topic: e.topic || "other" } : {}),
  });
}
for (const e of entries) if (!source.some((s) => s.list === e.list && s.word === e.word)) warns.push(`${e.word}: entry with no word in source.json`);

fs.writeFileSync(path.join(dir, "words.json"), JSON.stringify(out, null, 1) + "\n");
const count = (l) => out.filter((w) => w.list === l).length;
console.log(`words.json: ${out.length} entries (core ${count("core")}, power ${count("power")}, math ${count("math")}, must-know ${out.filter((w) => w.cram).length})`);
for (const w of warns) console.log(`  warn:  ${w}`);
for (const e of errors) console.log(`  error: ${e}`);
process.exit(errors.length ? 1 : 0);
