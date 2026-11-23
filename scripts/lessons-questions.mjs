// Bank questions for lesson authors (content/lessons/README.md).
//   npm run lessons:questions -- <skill-id> [options]   candidates by difficulty; questions already used by a lesson are hidden
//       --all             every candidate (40 per level otherwise)
//       --level easy|medium|hard   only that level
//       --grep <text>     only questions whose passage or prompt contains the text (case-insensitive)
//       --full            print each candidate's raw stored text instead of a one-line preview
//       --include-used    also list the used ones (marked USED)
//   npm run lessons:questions -- --show <id> [<id>…]    the question as stored (raw text to copy highlight phrases from),
//                                                       choices, answer and explanation
//   npm run lessons:questions -- --used [<skill-id>]    ids already used by a lesson, with lesson, slot and difficulty
import fs from "node:fs";
import path from "node:path";
import { parseLesson } from "../src/lib/lesson-format.ts";

const root = path.resolve(import.meta.dirname, "..");
const bank = JSON.parse(fs.readFileSync(path.join(root, "content/bank/dist/questions.json"), "utf8"));
const byId = new Map(bank.map((q) => [q.id, q]));
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const OPTS_WITH_VALUE = ["--level", "--grep"];

// Question ids already used by a lesson task → "math/circles.md · Easy · Center and radius".
function usedIds() {
  const used = new Map();
  const dir = path.join(root, "content/lessons");
  for (const sec of ["rw", "math", "strategy"]) {
    const d = path.join(dir, sec);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".md")).sort()) {
      const l = parseLesson(fs.readFileSync(path.join(d, f), "utf8"));
      for (const s of l?.subtopics ?? []) for (const t of s.tasks) if (t.kind === "bank") used.set(t.id, `${sec}/${f} · ${t.level[0].toUpperCase()}${t.level.slice(1)} · ${s.title}`);
    }
  }
  return used;
}

const flags = (q) =>
  [
    q.type === "spr" ? "grid-in" : "",
    q.figure ? (q.figure.fullPage ? "page-image" : "figure") : "",
    q.table ? "table" : "",
    q.choicesImage ? "choices-image" : "",
    q.choiceImages ? "picture-choices" : "",
  ].filter(Boolean);

if (args[0] === "--show") {
  const used = usedIds();
  for (const id of args.slice(1)) {
    const q = byId.get(id);
    if (!q) {
      console.log(`\n${id}: not in the live bank`);
      continue;
    }
    console.log(`\n==== ${q.id} · ${q.difficulty} · ${q.section}/${q.domain}/${q.skill} · source ${q.source}${q.origin ? ` (${q.origin})` : ""} · ${flags(q).join(", ") || "plain"}${used.has(q.id) ? ` · USED by ${used.get(q.id)}` : ""}`);
    console.log("(PASSAGE and PROMPT are printed as stored: a highlight phrase must be copied from them exactly)");
    if (q.passage) console.log(`PASSAGE:\n${q.passage}`);
    if (q.table) console.log(`TABLE: ${q.table.caption ?? ""}\n${[q.table.headers, ...q.table.rows].map((r) => r.join(" | ")).join("\n")}`);
    if (q.figure) console.log(`FIGURE: ${q.figure.src}${q.figure.caption ? ` (${q.figure.caption})` : ""}  ← open public${q.figure.src} to see it`);
    console.log(`PROMPT:\n${q.prompt}`);
    if (q.type === "mcq") for (const l of ["A", "B", "C", "D"]) console.log(`(${l}) ${q.choices[l] || q.choiceImages?.[l] || "[in image]"}`);
    console.log(`ANSWER: ${Array.isArray(q.answer) ? q.answer.join(" or ") : q.answer}`);
    console.log(`EXPLANATION:\n${q.explanation}`);
  }
  process.exit(0);
}

if (args.includes("--used")) {
  const skill = args.find((a, i) => !a.startsWith("--") && !OPTS_WITH_VALUE.includes(args[i - 1]));
  const rows = [...usedIds()].filter(([id]) => !skill || byId.get(id)?.skill === skill);
  console.log(`${rows.length} question(s) already used by a lesson${skill ? ` (skill ${skill})` : ""}. Columns: id · difficulty · lesson · slot · subtopic`);
  for (const [id, where] of rows) {
    const q = byId.get(id);
    console.log(`${id} · ${q?.difficulty ?? "NOT IN BANK"} · ${where}`);
  }
  process.exit(0);
}

const skill = args.find((a, i) => !a.startsWith("--") && !OPTS_WITH_VALUE.includes(args[i - 1]));
if (!skill) {
  console.error("usage: npm run lessons:questions -- <skill-id> [--all] [--level easy|medium|hard] [--grep text] [--full] [--include-used] | --show <id>… | --used [<skill-id>]");
  process.exit(1);
}
const all = args.includes("--all");
const full = args.includes("--full");
const includeUsed = args.includes("--include-used");
const grep = opt("--grep")?.toLowerCase();
const level = opt("--level");
if (level && !["easy", "medium", "hard"].includes(level)) {
  console.error('--level must be easy, medium or hard');
  process.exit(1);
}
const used = usedIds();
const pool = bank.filter((q) => q.skill === skill);
if (!pool.length) {
  console.error(`no live questions with skill "${skill}"`);
  process.exit(1);
}
const hidden = pool.filter((q) => used.has(q.id)).length;
console.log(`${pool.length} questions for ${skill}${includeUsed ? "" : `, ${hidden} already used by a lesson (hidden; --include-used shows them)`}. Columns: id · difficulty · source · flags · text.`);
console.log("Use --show <id> to read one in full (the text there is the raw stored text for highlight phrases).");
for (const d of level ? [level] : ["easy", "medium", "hard"]) {
  // Plain ones first (no figure/table/images), then the rest; College Board before past papers.
  const list = pool
    .filter((q) => q.difficulty === d && (includeUsed || !used.has(q.id)) && (!grep || `${q.passage ?? ""}\n${q.prompt}`.toLowerCase().includes(grep)))
    .sort((a, b) => flags(a).length - flags(b).length || (a.source === "cb" ? -1 : 1) - (b.source === "cb" ? -1 : 1));
  console.log(`\n--- ${d} (${list.length})`);
  for (const q of all || grep ? list : list.slice(0, 40)) {
    const head = `${q.id} · ${d} · ${q.source} · ${flags(q).join(",") || "-"}${used.has(q.id) ? ` · USED by ${used.get(q.id)}` : ""}`;
    if (full) console.log(`${head}\n${q.passage ? `PASSAGE: ${q.passage}\n` : ""}PROMPT: ${q.prompt}\n`);
    else console.log(`${head} · ${`${q.passage ? q.passage + " / " : ""}${q.prompt}`.replace(/\s+/g, " ").slice(0, 110)}`);
  }
}
