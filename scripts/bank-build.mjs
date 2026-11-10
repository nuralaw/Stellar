// Merges content/bank/source/*.json with content/bank/answers/*.json, validates everything,
// and writes content/bank/dist/questions.json (answered questions only) + counts.json.
//
//   npm run bank:build                      build + validate everything
//   npm run bank:check -- <answers.json>    validate a single answers file (no output written)

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BANK = path.join(ROOT, "content", "bank");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

// Taxonomy (kept in sync with src/lib/taxonomy.ts — parsed from the TS source to avoid duplication).
const taxSrc = fs.readFileSync(path.join(ROOT, "src", "lib", "taxonomy.ts"), "utf8");
const DOMAINS = {};
for (const m of taxSrc.matchAll(/id: "([\w-]+)",\s*section: "(rw|math)",[\s\S]*?skills: \[([\s\S]*?)\],\s*\}/g)) {
  DOMAINS[m[1]] = { section: m[2], skills: [...m[3].matchAll(/id: "([\w-]+)"/g)].map((s) => s[1]) };
}

const source = new Map();
for (const f of ["rw.json", "math.json"]) for (const q of read(path.join(BANK, "source", f))) source.set(q.id, q);

const parseNumeric = (s) => {
  const t = String(s).replace(/\s+/g, "").replace(/−/g, "-");
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return Number(t);
  const f = t.match(/^(-?)(\d+)\/(\d+)$/);
  return f && Number(f[3]) !== 0 ? (f[1] ? -1 : 1) * (Number(f[2]) / Number(f[3])) : null;
};

/** Returns a list of problems for one answers entry. */
function validate(a) {
  const errs = [];
  const q = source.get(a.id);
  if (!q) return [`unknown id`];
  const d = DOMAINS[a.domain];
  if (!d) errs.push(`unknown domain "${a.domain}"`);
  else {
    if (d.section !== q.section) errs.push(`domain "${a.domain}" not in section ${q.section}`);
    if (!d.skills.includes(a.skill)) errs.push(`skill "${a.skill}" not in domain "${a.domain}"`);
  }
  if (!["easy", "medium", "hard"].includes(a.difficulty)) errs.push(`bad difficulty "${a.difficulty}"`);
  if (!["high", "medium", "low"].includes(a.confidence)) errs.push(`bad confidence "${a.confidence}"`);
  if (typeof a.explanation !== "string" || a.explanation.trim().length < 30) errs.push("explanation missing/too short");
  if (q.type === "mcq") {
    if (!["A", "B", "C", "D"].includes(a.answer)) errs.push(`mcq answer must be A–D, got ${JSON.stringify(a.answer)}`);
  } else if (!Array.isArray(a.answer) || !a.answer.length || a.answer.some((x) => parseNumeric(x) === null)) {
    errs.push(`spr answer must be a non-empty array of numeric strings, got ${JSON.stringify(a.answer)}`);
  }
  return errs;
}

const checkOnly = process.argv[2] === "--check";
const files = checkOnly
  ? [path.resolve(process.argv[3])]
  : fs.existsSync(path.join(BANK, "answers"))
    ? fs.readdirSync(path.join(BANK, "answers")).filter((f) => f.endsWith(".json")).map((f) => path.join(BANK, "answers", f))
    : [];

const answers = new Map();
const problems = [];
for (const file of files) {
  let list;
  try {
    list = read(file);
  } catch (e) {
    problems.push(`${path.basename(file)}: invalid JSON — ${e.message}`);
    continue;
  }
  if (!Array.isArray(list)) {
    problems.push(`${path.basename(file)}: must be a JSON array`);
    continue;
  }
  for (const a of list) {
    const errs = validate(a);
    if (answers.has(a.id)) errs.push("answered twice");
    errs.forEach((e) => problems.push(`${path.basename(file)} ${a.id}: ${e}`));
    if (!errs.length) answers.set(a.id, a);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n` + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
if (checkOnly) {
  console.log(`OK — ${answers.size} valid entries`);
  process.exit(0);
}

// Merge. Low-confidence answers are kept out of the live bank until reviewed.
const out = [];
const counts = { total: 0, rw: {}, math: {} };
let lowConfidence = 0;
for (const [id, q] of source) {
  const a = answers.get(id);
  if (!a) continue;
  if (a.confidence === "low") {
    lowConfidence++;
    continue;
  }
  // Only public fields go to the site (confidence / reviewer notes stay in the answers files).
  out.push({ ...q, answer: a.answer, explanation: a.explanation, domain: a.domain, skill: a.skill, difficulty: a.difficulty });
  const sec = counts[q.section];
  sec[a.domain] ??= { easy: 0, medium: 0, hard: 0 };
  sec[a.domain][a.difficulty]++;
  counts.total++;
}

fs.mkdirSync(path.join(BANK, "dist"), { recursive: true });
fs.writeFileSync(path.join(BANK, "dist", "questions.json"), JSON.stringify(out));
fs.writeFileSync(path.join(BANK, "dist", "counts.json"), JSON.stringify(counts, null, 1) + "\n");
console.log(
  `Bank: ${out.length} live questions (of ${source.size} imported; ${answers.size} answered, ${lowConfidence} low-confidence held back)`,
);
