// Bank questions for lesson authors (content/lessons/README.md).
//   npm run lessons:questions -- <skill-id> [--all]     candidates by difficulty (40 per level unless --all)
//   npm run lessons:questions -- --show <id> [<id>…]    full question with answer and explanation
import fs from "node:fs";
import path from "node:path";
import { parseLesson } from "../src/lib/lesson-format.ts";

const root = path.resolve(import.meta.dirname, "..");
const bank = JSON.parse(fs.readFileSync(path.join(root, "content/bank/dist/questions.json"), "utf8"));
const args = process.argv.slice(2);

// Question ids already used by a lesson → lesson file.
function usedIds() {
  const used = new Map();
  const dir = path.join(root, "content/lessons");
  for (const sec of ["rw", "math", "strategy"]) {
    const d = path.join(dir, sec);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".md"))) {
      const l = parseLesson(fs.readFileSync(path.join(d, f), "utf8"));
      for (const s of l?.steps ?? []) if (s.block?.t === "check") used.set(s.block.id, `${sec}/${f}`);
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
  const byId = new Map(bank.map((q) => [q.id, q]));
  for (const id of args.slice(1)) {
    const q = byId.get(id);
    if (!q) {
      console.log(`\n${id}: not in the live bank`);
      continue;
    }
    console.log(`\n==== ${q.id} · ${q.section}/${q.domain}/${q.skill} · ${q.difficulty} · source ${q.source}${q.origin ? ` (${q.origin})` : ""} · ${flags(q).join(", ") || "plain"}`);
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

const skill = args.find((a) => !a.startsWith("--"));
if (!skill) {
  console.error("usage: npm run lessons:questions -- <skill-id> [--all] | --show <id>…");
  process.exit(1);
}
const all = args.includes("--all");
const used = usedIds();
const pool = bank.filter((q) => q.skill === skill);
if (!pool.length) {
  console.error(`no live questions with skill "${skill}"`);
  process.exit(1);
}
console.log(`${pool.length} questions for ${skill}. Columns: id · source · flags · preview. "USED by …" = already in a lesson.`);
for (const d of ["easy", "medium", "hard"]) {
  // Plain ones first (no figure/table/images), then the rest; College Board before past papers.
  const list = pool
    .filter((q) => q.difficulty === d)
    .sort((a, b) => flags(a).length - flags(b).length || (a.source === "cb" ? -1 : 1) - (b.source === "cb" ? -1 : 1));
  console.log(`\n--- ${d} (${list.length})`);
  for (const q of all ? list : list.slice(0, 40)) {
    const text = `${q.passage ? q.passage + " / " : ""}${q.prompt}`.replace(/\s+/g, " ").slice(0, 110);
    const u = used.get(q.id);
    console.log(`${q.id} · ${q.source} · ${flags(q).join(",") || "-"}${u ? ` · USED by ${u}` : ""} · ${text}`);
  }
}
