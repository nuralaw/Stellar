// Merges content/tests/source/<id>.json (imported past papers) with content/tests/answers/<id>.json (reviewed:
// checked answers, text fixes, figures, explanations) and writes content/tests/dist/<id>.json + index.json.
// Tests without an answers file are still built from the source (answers from the sheet, no explanations).
//
//   npm run tests:build              build everything
//   npm run tests:check -- <id>      validate content/tests/answers/<id>.json (nothing written)

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "content", "tests");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

// Taxonomy, parsed from src/lib/taxonomy.ts (same as bank-build).
const taxSrc = fs.readFileSync(path.join(ROOT, "src", "lib", "taxonomy.ts"), "utf8");
const SKILL_DOMAIN = {};
const SECTION_OF = {};
for (const m of taxSrc.matchAll(/id: "([\w-]+)",\s*section: "(rw|math)",[\s\S]*?skills: \[([\s\S]*?)\],\s*\}/g)) {
  SECTION_OF[m[1]] = m[2];
  for (const s of m[3].matchAll(/id: "([\w-]+)"/g)) SKILL_DOMAIN[s[1]] = m[1];
}

const parseNumeric = (s) => {
  const t = String(s).replace(/\s+/g, "").replace(/−/g, "-");
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return Number(t);
  const f = t.match(/^(-?)(\d+)\/(\d+)$/);
  return f && Number(f[3]) !== 0 ? (f[1] ? -1 : 1) * (Number(f[2]) / Number(f[3])) : null;
};

const LETTERS = ["A", "B", "C", "D"];
const FIX_FIELDS = ["prompt", "passage", "choices", "table"];
const ALLOWED = ["key", "answer", "type", "skill", "difficulty", "confidence", "explanation", "fix", "figure", "choiceImages", "note"];

function validateEntry(a, q) {
  const errs = [];
  for (const k of Object.keys(a)) if (!ALLOWED.includes(k)) errs.push(`field "${k}" not allowed`);
  const type = a.type ?? q.type;
  if (a.type !== undefined && !["mcq", "spr"].includes(a.type)) errs.push(`bad type "${a.type}"`);
  if (!SKILL_DOMAIN[a.skill]) errs.push(`unknown skill "${a.skill}"`);
  else if (SECTION_OF[SKILL_DOMAIN[a.skill]] !== q.section) errs.push(`skill "${a.skill}" is not a ${q.section} skill`);
  if (!["easy", "medium", "hard"].includes(a.difficulty)) errs.push(`bad difficulty "${a.difficulty}"`);
  if (!["high", "medium", "low"].includes(a.confidence)) errs.push(`bad confidence "${a.confidence}"`);
  if (typeof a.explanation !== "string" || a.explanation.trim().length < 30) errs.push("explanation missing/too short");
  if (/\$[^\d\s]|\\(frac|sqrt|cdot|left|right)/.test(a.explanation ?? "")) errs.push("explanation uses LaTeX; use plain-text notation");
  if (type === "mcq") {
    if (!LETTERS.includes(a.answer)) errs.push(`mcq answer must be A–D, got ${JSON.stringify(a.answer)}`);
  } else if (!Array.isArray(a.answer) || !a.answer.length || a.answer.some((x) => parseNumeric(x) === null)) {
    errs.push(`spr answer must be a non-empty array of numeric strings, got ${JSON.stringify(a.answer)}`);
  }
  if (a.fix !== undefined) {
    if (typeof a.fix !== "object" || a.fix === null) errs.push("fix must be an object");
    else {
      for (const k of Object.keys(a.fix)) if (!FIX_FIELDS.includes(k)) errs.push(`fix: field "${k}" not allowed`);
      if (a.fix.choices && (typeof a.fix.choices !== "object" || Object.keys(a.fix.choices).some((k) => !LETTERS.includes(k))))
        errs.push("fix.choices must be {A..D}");
      if (a.fix.table && (!Array.isArray(a.fix.table.headers) || !Array.isArray(a.fix.table.rows))) errs.push("fix.table needs headers[] and rows[][]");
      for (const k of ["prompt", "passage"]) if (a.fix[k] !== undefined && typeof a.fix[k] !== "string") errs.push(`fix.${k} must be a string`);
    }
  }
  const n = q.images?.length ?? 0;
  if (a.figure !== undefined && !(Number.isInteger(a.figure) && a.figure >= 0 && a.figure <= n)) errs.push(`figure must be 0..${n}`);
  if (a.choiceImages !== undefined) {
    if (type !== "mcq") errs.push("choiceImages only on mcq");
    for (const [k, v] of Object.entries(a.choiceImages)) {
      if (!LETTERS.includes(k)) errs.push(`choiceImages key "${k}"`);
      if (!(Number.isInteger(v) && v >= 1 && v <= n)) errs.push(`choiceImages.${k} must be 1..${n}`);
    }
  }
  if (type === "mcq" && !a.choiceImages) {
    const choices = { ...(q.choices ?? {}), ...(a.fix?.choices ?? {}) };
    const missing = LETTERS.filter((l) => !String(choices[l] ?? "").trim());
    if (missing.length) errs.push(`choices ${missing.join(",")} empty (give fix.choices or choiceImages)`);
  }
  return errs;
}

/** Answer from the sheet, when a test hasn't been reviewed yet. */
function rawAnswer(q) {
  const a = q.answer.trim();
  if (q.type === "mcq") return LETTERS.includes(a) ? a : null;
  const vals = a.split(/\s*(?:,|;|\bor\b)\s*/).filter((x) => parseNumeric(x) !== null);
  return vals.length ? vals : null;
}

function merge(q, a) {
  const out = { key: q.key, section: q.section, module: q.module, n: q.n, type: a?.type ?? q.type };
  const fix = a?.fix ?? {};
  const passage = fix.passage ?? q.passage;
  if (passage) out.passage = passage;
  out.prompt = fix.prompt ?? q.prompt;
  const table = fix.table ?? q.table;
  if (table) out.table = table;
  const imgs = q.images ?? [];
  const figN = a?.figure ?? (a?.choiceImages ? 0 : imgs.length ? 1 : 0);
  if (figN) out.figure = { src: imgs[figN - 1].src, w: imgs[figN - 1].w, h: imgs[figN - 1].h };
  if (out.type === "mcq") {
    out.choices = Object.fromEntries(LETTERS.map((l) => [l, fix.choices?.[l] ?? q.choices?.[l] ?? ""]));
    if (a?.choiceImages) out.choiceImages = Object.fromEntries(Object.entries(a.choiceImages).map(([l, i]) => [l, imgs[i - 1].src]));
  }
  out.answer = a ? a.answer : rawAnswer(q);
  const skill = a?.skill ?? q.skill;
  out.skill = skill;
  out.domain = SKILL_DOMAIN[skill] ?? q.domain;
  if (a) {
    out.difficulty = a.difficulty;
    out.explanation = a.explanation;
    if (a.confidence === "low") out.unsure = true;
  }
  return out;
}

const sources = fs.readdirSync(path.join(DIR, "source")).filter((f) => /^\d{4}-.*\.json$/.test(f));
const checkOnly = process.argv[2] === "--check";

if (checkOnly) {
  const id = String(process.argv[3] ?? "").replace(/\.json$/, "").replace(/^.*[\\/]/, "");
  const srcFile = path.join(DIR, "source", `${id}.json`);
  const ansFile = path.join(DIR, "answers", `${id}.json`);
  if (!fs.existsSync(srcFile)) {
    console.error(`No test "${id}" in content/tests/source`);
    process.exit(1);
  }
  if (!fs.existsSync(ansFile)) {
    console.error(`Missing ${path.relative(ROOT, ansFile)}`);
    process.exit(1);
  }
  const test = read(srcFile);
  let answers;
  try {
    answers = read(ansFile);
  } catch (e) {
    console.error(`Invalid JSON: ${e.message}`);
    process.exit(1);
  }
  const errs = [];
  if (!Array.isArray(answers)) errs.push("file must be a JSON array");
  else {
    const byKey = new Map(test.questions.map((q) => [q.key, q]));
    const seen = new Set();
    answers.forEach((a, i) => {
      const q = byKey.get(a?.key);
      if (!q) return errs.push(`[${i}] unknown key ${JSON.stringify(a?.key)}`);
      if (seen.has(a.key)) errs.push(`${a.key}: duplicate`);
      seen.add(a.key);
      for (const e of validateEntry(a, q)) errs.push(`${a.key}: ${e}`);
    });
    const missing = test.questions.filter((q) => !seen.has(q.key)).map((q) => q.key);
    if (missing.length) errs.push(`missing ${missing.length} question(s): ${missing.join(", ")}`);
    const order = answers.map((a) => a?.key).join();
    if (!missing.length && order !== test.questions.map((q) => q.key).join()) errs.push("entries are not in source order");
  }
  if (errs.length) {
    console.error(`${errs.length} problem(s):\n` + errs.map((e) => "  " + e).join("\n"));
    process.exit(1);
  }
  const low = answers.filter((a) => a.confidence === "low").length;
  const fixes = answers.filter((a) => a.fix).length;
  console.log(`OK ${id}: ${answers.length} questions, ${fixes} fixed, ${low} low-confidence`);
  process.exit(0);
}

const OUT = path.join(DIR, "dist");
fs.mkdirSync(OUT, { recursive: true });
const index = [];
let bad = 0;
for (const f of sources) {
  const test = read(path.join(DIR, "source", f));
  const ansFile = path.join(DIR, "answers", f);
  let answers = null;
  if (fs.existsSync(ansFile)) {
    try {
      answers = new Map(read(ansFile).map((a) => [a.key, a]));
    } catch (e) {
      console.warn(`  ! ${f}: answers file unreadable (${e.message}), building from source`);
    }
  }
  const questions = test.questions.map((q) => {
    const a = answers?.get(q.key);
    if (a && validateEntry(a, q).length) {
      bad++;
      return merge(q, null);
    }
    return merge(q, a);
  });
  // Questions without a usable answer can't be scored.
  const usable = questions.filter((q) => q.answer !== null);
  const modules = {};
  for (const q of usable) (modules[`${q.section}${q.module}`] ??= []).push(q);
  const reviewed = Boolean(answers) && test.questions.every((q) => answers.has(q.key));
  const out = {
    id: test.id,
    title: test.title,
    year: test.year,
    month: test.month,
    version: test.version,
    form: test.form,
    sections: test.sections,
    reviewed,
    modules,
  };
  fs.writeFileSync(path.join(OUT, f), JSON.stringify(out));
  index.push({
    id: test.id,
    title: test.title,
    year: test.year,
    month: test.month,
    version: test.version,
    form: test.form,
    sections: test.sections,
    reviewed,
    counts: Object.fromEntries(Object.entries(modules).map(([k, v]) => [k, v.length])),
  });
}
index.sort((a, b) => b.year - a.year || b.month - a.month || a.version.localeCompare(b.version) || a.form.localeCompare(b.form));
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index));
const reviewed = index.filter((t) => t.reviewed).length;
console.log(`Tests: ${index.length} built (${reviewed} reviewed)${bad ? `, ${bad} invalid answer entries skipped — run tests:check` : ""}`);
