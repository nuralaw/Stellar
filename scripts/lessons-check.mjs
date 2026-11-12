// Validates lesson files against content/lessons/README.md.
//   npm run lessons:check                 every lesson
//   npm run lessons:check -- <file>…      only these files (paths or slugs)
// Errors fail the run (exit 1); warnings are printed but pass.
import fs from "node:fs";
import path from "node:path";
import { countWords, estimateMinutes, parseLesson } from "../src/lib/lesson-format.ts";
import { DOMAINS } from "../src/lib/taxonomy.ts";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "content/lessons");
const bank = new Map(JSON.parse(fs.readFileSync(path.join(root, "content/bank/dist/questions.json"), "utf8")).map((q) => [q.id, q]));
const SECTIONS = ["rw", "math", "strategy"];

const files = [];
for (const sec of SECTIONS) {
  const d = path.join(dir, sec);
  if (fs.existsSync(d)) for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".md")).sort()) files.push(path.join(d, f));
}
const wanted = process.argv.slice(2).map((a) => path.basename(a, ".md"));
const targets = wanted.length ? files.filter((f) => wanted.includes(path.basename(f, ".md"))) : files;
if (wanted.length && targets.length !== wanted.length) {
  console.error(`not found: ${wanted.filter((w) => !targets.some((f) => path.basename(f, ".md") === w)).join(", ")}`);
  process.exit(1);
}

// Question ids across all lessons (duplicates are errors).
const owner = new Map();
for (const f of files) {
  const l = parseLesson(fs.readFileSync(f, "utf8"));
  for (const s of l?.steps ?? []) if (s.block?.t === "check") (owner.get(s.block.id) ?? owner.set(s.block.id, []).get(s.block.id)).push(path.basename(f, ".md"));
}

let errorCount = 0;
for (const file of targets) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const section = path.basename(path.dirname(file));
  const slug = path.basename(file, ".md");
  const raw = fs.readFileSync(file, "utf8");
  const errors = [];
  const warns = [];
  const l = parseLesson(raw);
  if (!l) {
    console.log(`✗ ${rel}\n  error: no frontmatter`);
    errorCount++;
    continue;
  }
  errors.push(...l.errors);
  const { meta, steps } = l;

  // Frontmatter
  for (const k of ["title", "skill", "domain", "section", "summary"]) if (!meta[k]) errors.push(`frontmatter: missing ${k}`);
  if (meta.section && meta.section !== section) errors.push(`frontmatter: section "${meta.section}" but the file is in ${section}/`);
  if (meta.summary && meta.summary.length > 160) errors.push(`summary is ${meta.summary.length} chars (max 140)`);
  else if (meta.summary && meta.summary.length > 140) warns.push(`summary is ${meta.summary.length} chars (max 140)`);
  if (meta.minutes) warns.push("frontmatter: drop `minutes` (the site computes it)");
  const isSkill = section !== "strategy";
  if (isSkill) {
    const dom = DOMAINS.find((d) => d.id === meta.domain && d.section === section);
    if (!dom) errors.push(`frontmatter: unknown ${section} domain "${meta.domain}"`);
    else if (!dom.skills.some((s) => s.id === meta.skill)) errors.push(`frontmatter: skill "${meta.skill}" is not in domain ${meta.domain}`);
    if (meta.skill !== slug) errors.push(`frontmatter: skill "${meta.skill}" should equal the file name "${slug}"`);
  } else if (meta.domain !== "strategy" || meta.skill !== slug) errors.push("strategy lessons need domain: strategy and skill: <file name>");

  // Steps
  if (steps.length < 7 || steps.length > 13) errors.push(`${steps.length} steps (need 8–12)`);
  else if (steps.length < 8 || steps.length > 12) warns.push(`${steps.length} steps (aim for 8–12)`);
  let callouts = 0;
  let quizzes = 0;
  const checks = [];
  steps.forEach((s, i) => {
    const where = `step ${i + 1} "${s.title}"`;
    const words = countWords(s.body);
    if (words > 110) errors.push(`${where}: ${words} words of text (max 90)`);
    else if (words > 90) warns.push(`${where}: ${words} words of text (max 90)`);
    if (s.title.split(/\s+/).length > 6 && !/^Your turn/.test(s.title)) warns.push(`${where}: title longer than 6 words`);
    const lines = s.body.split("\n").map((x) => x.trim());
    callouts += lines.filter((x) => /^>\s*\*\*[^*]+\*\*/.test(x)).length;
    lines.forEach((x, j) => {
      if (x.startsWith("|") && !(lines[j + 1]?.startsWith("|") || lines[j - 1]?.startsWith("|"))) errors.push(`${where}: a line starts with "|" but isn't a table`);
      if (/<\/?[a-z][^>]*>/i.test(x)) warns.push(`${where}: looks like HTML: ${x.slice(0, 50)}`);
      if (/^\s{2,}[-*]\s/.test(s.body.split("\n")[j] ?? "")) errors.push(`${where}: nested list`);
      if (x.startsWith("|") && x.split("|").length - 2 > 3 && j === lines.findIndex((y) => y.startsWith("|"))) warns.push(`${where}: table has more than 3 columns`);
    });
    if (s.body.includes("```")) errors.push(`${where}: a code fence that isn't \`\`\`quiz or \`\`\`check`);
    const b = s.block;
    if (b?.t === "quiz") {
      quizzes++;
      if (!b.explain.length) warns.push(`${where}: quiz has no > explanation`);
      const expWords = countWords(b.explain.join(" "));
      if (expWords > 110) warns.push(`${where}: quiz explanation is ${expWords} words (max 60, worked example 100)`);
      b.options.forEach((o) => {
        if (!o.correct && !o.feedback) warns.push(`${where}: wrong option "${o.text.slice(0, 30)}" has no :: feedback`);
        if (o.feedback && countWords(o.feedback) > 35) warns.push(`${where}: feedback for "${o.text.slice(0, 30)}" is ${countWords(o.feedback)} words (max 25)`);
      });
      const texts = b.options.map((o) => o.text.toLowerCase());
      if (new Set(texts).size !== texts.length) errors.push(`${where}: two quiz options are the same`);
    }
    if (b?.t === "check") {
      const q = bank.get(b.id);
      checks.push({ step: s, q });
      if (!isSkill) errors.push(`${where}: strategy lessons don't use check blocks`);
      if (!q) errors.push(`${where}: question ${b.id} is not in the live bank`);
      else {
        // `also-skills: a, b` lets a skill with too few bank questions borrow from a closely related skill.
        const allowed = [meta.skill, ...(meta["also-skills"] ?? "").split(",").map((x) => x.trim()).filter(Boolean)];
        if (!allowed.includes(q.skill)) errors.push(`${where}: ${b.id} is skill ${q.skill}, not ${allowed.join(" / ")}`);
        if (q.choicesImage) errors.push(`${where}: ${b.id} has its choices in one image`);
        if (q.figure?.fullPage) errors.push(`${where}: ${b.id} only has a full-page image`);
        const dupes = owner.get(b.id) ?? [];
        if (dupes.length > 1) errors.push(`${where}: ${b.id} is used more than once (${dupes.join(", ")})`);
      }
      if (words > 25) warns.push(`${where}: ${words} words before a check (max 20)`);
    }
  });
  if (callouts > 3) warns.push(`${callouts} callouts (max 3)`);
  const last = steps.at(-1);
  if (!last || last.title !== "Recap") errors.push('the last step must be "## Recap"');
  else if (last.block) errors.push("the Recap step has no quiz/check");
  if (isSkill) {
    const want = ["easy", "medium", "hard"];
    const turns = steps.filter((s) => /^Your turn/.test(s.title));
    if (checks.length !== 3) errors.push(`${checks.length} check blocks (need exactly 3)`);
    if (turns.length !== 3 || turns.some((s, i) => s.title !== `Your turn: ${want[i]}`)) errors.push('need three steps "## Your turn: easy", "## Your turn: medium", "## Your turn: hard" in that order');
    turns.forEach((s) => {
      if (s.block?.t !== "check") errors.push(`step "${s.title}" needs a check block`);
      const q = s.block?.t === "check" ? bank.get(s.block.id) : null;
      const d = s.title.split(": ")[1];
      if (q && q.difficulty !== d) warns.push(`step "${s.title}": ${q.id} is ${q.difficulty}`);
    });
  }
  if (quizzes < 4) warns.push(`only ${quizzes} quizzes (most steps should end with one)`);

  const mins = estimateMinutes(steps, section);
  const ok = !errors.length;
  console.log(`${ok ? "✓" : "✗"} ${rel} · ${steps.length} steps · ${quizzes} quizzes · ${checks.length} checks · ~${mins} min`);
  for (const e of errors) console.log(`  error: ${e}`);
  for (const w of warns) console.log(`  warn:  ${w}`);
  errorCount += errors.length;
}
console.log(errorCount ? `\n${errorCount} error(s)` : "\nall good");
process.exit(errorCount ? 1 : 0);
