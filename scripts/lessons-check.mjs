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
  if (meta.summary && meta.summary.length > 120) errors.push(`summary is ${meta.summary.length} chars (max 80)`);
  else if (meta.summary && meta.summary.length > 80) warns.push(`summary is ${meta.summary.length} chars (max 80)`);
  if (meta.minutes) warns.push("frontmatter: drop `minutes` (the site computes it)");
  const isSkill = section !== "strategy";
  if (isSkill) {
    const dom = DOMAINS.find((d) => d.id === meta.domain && d.section === section);
    if (!dom) errors.push(`frontmatter: unknown ${section} domain "${meta.domain}"`);
    else if (!dom.skills.some((s) => s.id === meta.skill)) errors.push(`frontmatter: skill "${meta.skill}" is not in domain ${meta.domain}`);
    if (meta.skill !== slug) errors.push(`frontmatter: skill "${meta.skill}" should equal the file name "${slug}"`);
  } else if (meta.domain !== "strategy" || meta.skill !== slug) errors.push("strategy lessons need domain: strategy and skill: <file name>");
  if (!fs.existsSync(path.join(root, "src/components/lessons/visuals", `${slug}.tsx`))) warns.push(`no animation yet: src/components/lessons/visuals/${slug}.tsx`);

  // Steps
  const [lo, hi] = isSkill ? [9, 10] : [5, 8];
  if (steps.length < lo - 1 || steps.length > hi + 1) errors.push(`${steps.length} steps (need ${lo}–${hi})`);
  else if (steps.length < lo || steps.length > hi) warns.push(`${steps.length} steps (aim for ${lo}–${hi})`);
  let callouts = 0;
  let quizzes = 0;
  let textWords = 0;
  const checks = [];
  const examples = steps.filter((s) => s.block?.t === "example").length;
  if (examples !== 1) errors.push(`${examples} example blocks (need exactly one, in the first step)`);
  if (steps[0] && steps[0].block?.t !== "example") errors.push("the first step must end with the ```example block");
  const passage = section === "rw" ? 30 : 0;
  steps.forEach((s, i) => {
    const where = `step ${i + 1} "${s.title}"`;
    const words = countWords(s.body);
    textWords += words;
    if (s.title !== "Recap") {
      if (words > 40) errors.push(`${where}: ${words} words of text (max 25)`);
      else if (words > 25) warns.push(`${where}: ${words} words of text (max 25)`);
    }
    if (s.title.split(/\s+/).length > 5 && !/^Your turn/.test(s.title)) warns.push(`${where}: title longer than 5 words`);
    const lines = s.body.split("\n").map((x) => x.trim());
    callouts += lines.filter((x) => /^>\s*\*\*[^*]+\*\*/.test(x)).length;
    lines.forEach((x, j) => {
      if (x.startsWith("|") && !(lines[j + 1]?.startsWith("|") || lines[j - 1]?.startsWith("|"))) errors.push(`${where}: a line starts with "|" but isn't a table`);
      if (/<\/?[a-z][^>]*>/i.test(x)) warns.push(`${where}: looks like HTML: ${x.slice(0, 50)}`);
      if (/^\s{2,}[-*]\s/.test(s.body.split("\n")[j] ?? "")) errors.push(`${where}: nested list`);
      if (x.startsWith("|") && x.split("|").length - 2 > 3 && j === lines.findIndex((y) => y.startsWith("|"))) warns.push(`${where}: table has more than 3 columns`);
    });
    if (s.body.includes("```")) errors.push(`${where}: a code fence that isn't \`\`\`example, \`\`\`quiz or \`\`\`check`);
    const b = s.block;
    if (b?.t === "example") {
      const pw = countWords(b.prompt);
      textWords += b.lines.reduce((n, l) => n + countWords(l.note ?? ""), 0);
      if (pw > 60 + passage) errors.push(`${where}: example problem is ${pw} words (max ${40 + passage})`);
      else if (pw > 40 + passage) warns.push(`${where}: example problem is ${pw} words (max ${40 + passage})`);
      b.lines.forEach((l, k) => {
        const tw = countWords(l.text);
        const nw = countWords(l.note ?? "");
        if (tw > 20) errors.push(`${where}: example line ${k + 1} is ${tw} words (max 14)`);
        else if (tw > 14) warns.push(`${where}: example line ${k + 1} is ${tw} words (max 14)`);
        if (nw > 16) errors.push(`${where}: note on example line ${k + 1} is ${nw} words (max 10)`);
        else if (nw > 10) warns.push(`${where}: note on example line ${k + 1} is ${nw} words (max 10)`);
      });
    }
    if (b?.t === "quiz") {
      quizzes++;
      const qw = countWords(b.prompt);
      if (qw > 65 + passage) errors.push(`${where}: quiz question is ${qw} words (max ${40 + passage})`);
      else if (qw > 40 + passage) warns.push(`${where}: quiz question is ${qw} words (max ${40 + passage})`);
      if (!b.explain.length) warns.push(`${where}: quiz has no > explanation`);
      if (b.explain.length > 2) warns.push(`${where}: ${b.explain.length} explanation lines (max 2)`);
      const expWords = countWords(b.explain.join(" "));
      if (expWords > 45) errors.push(`${where}: quiz explanation is ${expWords} words (max 25)`);
      else if (expWords > 25) warns.push(`${where}: quiz explanation is ${expWords} words (max 25)`);
      b.options.forEach((o) => {
        if (!o.correct && !o.feedback) warns.push(`${where}: wrong option "${o.text.slice(0, 30)}" has no :: feedback`);
        const fw = countWords(o.feedback ?? "");
        if (fw > 20) errors.push(`${where}: feedback for "${o.text.slice(0, 30)}" is ${fw} words (max 12)`);
        else if (fw > 12) warns.push(`${where}: feedback for "${o.text.slice(0, 30)}" is ${fw} words (max 12)`);
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
      if (words > 12) warns.push(`${where}: ${words} words before a check (max 12)`);
    }
  });
  if (callouts > 1) warns.push(`${callouts} callouts (max 1)`);
  if (textWords > 200) errors.push(`${textWords} words of teaching text (max 160)`);
  else if (textWords > 160) warns.push(`${textWords} words of teaching text (max 160)`);
  const last = steps.at(-1);
  if (!last || last.title !== "Recap") errors.push('the last step must be "## Recap"');
  else {
    if (last.block) errors.push("the Recap step has no example/quiz/check");
    const bullets = last.body.split("\n").filter((x) => /^\s*[-*]\s/.test(x)).length;
    const rw = countWords(last.body);
    if (bullets < 2 || bullets > 3) warns.push(`Recap has ${bullets} bullets (2–3)`);
    if (rw > 45) errors.push(`Recap is ${rw} words (max 30)`);
    else if (rw > 30) warns.push(`Recap is ${rw} words (max 30)`);
  }
  const traps = steps.filter((s) => /^Trap:/.test(s.title));
  if (traps.length !== 1) warns.push(`${traps.length} "## Trap: …" steps (need one)`);
  else if (traps[0].block?.t !== "quiz") errors.push(`step "${traps[0].title}" needs a quiz`);
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
  if (quizzes < 3) warns.push(`only ${quizzes} quizzes (aim for 3–5)`);

  const mins = estimateMinutes(steps, section);
  const ok = !errors.length;
  console.log(`${ok ? "✓" : "✗"} ${rel} · ${steps.length} steps · ${quizzes} quizzes · ${checks.length} checks · ${textWords} words · ~${mins} min`);
  for (const e of errors) console.log(`  error: ${e}`);
  for (const w of warns) console.log(`  warn:  ${w}`);
  errorCount += errors.length;
}
console.log(errorCount ? `\n${errorCount} error(s)` : "\nall good");
process.exit(errorCount ? 1 : 0);
