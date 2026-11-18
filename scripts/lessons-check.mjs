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
const visDir = path.join(root, "src/components/lessons/visuals");
const bank = new Map(JSON.parse(fs.readFileSync(path.join(root, "content/bank/dist/questions.json"), "utf8")).map((q) => [q.id, q]));
const SECTIONS = ["rw", "math", "strategy"];
const TEACH = ["example", "desmos"];
// A step teaches when it has a visual or an example/desmos block.
const teaches = (s) => Boolean(s.visual) || TEACH.includes(s.block?.t ?? "");
const MAX_STEP_WORDS = 25; // teaching text of one step
const MAX_PART_WORDS = 70; // teaching text of one part (the ```more text is not counted)
const MAX_MORE_WORDS = 80;
const MAX_LESSON_WORDS = 490; // 7 teaching parts × 70

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
  const errors = [];
  const warns = [];
  const l = parseLesson(fs.readFileSync(file, "utf8"));
  if (!l) {
    console.log(`✗ ${rel}\n  error: no frontmatter`);
    errorCount++;
    continue;
  }
  errors.push(...l.errors);
  const { meta, steps, parts } = l;
  const isSkill = section !== "strategy";
  const visualOnly = meta["visual-only"] === "true";

  // Frontmatter
  for (const k of ["title", "skill", "domain", "section", "summary"]) if (!meta[k]) errors.push(`frontmatter: missing ${k}`);
  if (meta.section && meta.section !== section) errors.push(`frontmatter: section "${meta.section}" but the file is in ${section}/`);
  if (meta.summary && meta.summary.length > 120) errors.push(`summary is ${meta.summary.length} chars (max 80)`);
  else if (meta.summary && meta.summary.length > 80) warns.push(`summary is ${meta.summary.length} chars (max 80)`);
  if (isSkill) {
    const dom = DOMAINS.find((d) => d.id === meta.domain && d.section === section);
    if (!dom) errors.push(`frontmatter: unknown ${section} domain "${meta.domain}"`);
    else if (!dom.skills.some((s) => s.id === meta.skill)) errors.push(`frontmatter: skill "${meta.skill}" is not in domain ${meta.domain}`);
    if (meta.skill !== slug) errors.push(`frontmatter: skill "${meta.skill}" should equal the file name "${slug}"`);
  } else if (meta.domain !== "strategy" || meta.skill !== slug) errors.push("strategy lessons need domain: strategy and skill: <file name>");
  if (!fs.existsSync(path.join(visDir, `${slug}.tsx`))) warns.push(`no topic animation: src/components/lessons/visuals/${slug}.tsx`);

  // Parts
  const practice = parts.filter((p) => p.title === "Real SAT questions");
  const teaching = parts.filter((p) => p.title !== "Real SAT questions");
  if (parts.length === 1 && parts[0].start === 0 && !/^#\s/m.test(fs.readFileSync(file, "utf8"))) errors.push('no "# " parts: split the lesson into parts (subtopics)');
  if (isSkill) {
    if (teaching.length < 3 || teaching.length > 7) errors.push(`${teaching.length} teaching parts (need 3–7)`);
    if (practice.length !== 1 || parts.at(-1)?.title !== "Real SAT questions") errors.push('the last part must be "# Real SAT questions"');
  } else if (parts.length < 3 || parts.length > 7) errors.push(`${parts.length} parts (need 3–7)`);
  if (!teaching.some((p) => /^Trap:/.test(p.title)) && !visualOnly) warns.push('no "# Trap: …" part');

  let total = 0;
  let quizzes = 0;
  let desmosFixes = 0;
  let typedQuizzes = 0;
  const checks = [];
  // The last quiz before "# Real SAT questions" should read like the real thing (SAT wording and length).
  const lastQuiz = steps.findLast((s) => s.block?.t === "quiz" && !practice.some((p) => steps.indexOf(s) >= p.start && steps.indexOf(s) < p.end));
  for (const p of parts) {
    const ps = steps.slice(p.start, p.end);
    const where = `part "${p.title}"`;
    if (p.title.split(/\s+/).length > 5 && p.title !== "Real SAT questions") warns.push(`${where}: title longer than 5 words`);
    if (!p.tagline) errors.push(`${where}: no tagline (one line under the "# " title)`);
    else if (countWords(p.tagline) > 10) warns.push(`${where}: tagline is ${countWords(p.tagline)} words (max 10)`);
    if (p.title === "Real SAT questions") {
      if (!isSkill) errors.push(`${where}: strategy lessons have no real-question part`);
      const want = ["easy", "medium", "hard"];
      if (ps.length !== 3 || ps.some((s, i) => s.title !== `Your turn: ${want[i]}` || s.block?.t !== "check")) errors.push(`${where}: needs exactly "## Your turn: easy / medium / hard", each with a check`);
      continue;
    }
    if (ps.length < 1 || ps.length > 3) errors.push(`${where}: ${ps.length} steps (2–3)`);
    else if (ps.length < 2 && !visualOnly) warns.push(`${where}: only 1 step (add a quiz)`);
    if (ps[0] && !teaches(ps[0])) errors.push(`${where}: its first step must teach with an example, desmos or visual block`);
    const teach = ps.filter(teaches).length;
    if (teach > 1 && !visualOnly) warns.push(`${where}: ${teach} teaching blocks (one example per part)`);
    let words = 0;
    for (const s of ps) {
      const sw = `step "${s.title}"`;
      const w = countWords(s.body);
      words += w;
      if (w > MAX_STEP_WORDS) errors.push(`${sw}: ${w} words of text (max ${MAX_STEP_WORDS}; put the rest in a \`\`\`more block)`);
      if (visualOnly && w > 0) warns.push(`${sw}: visual-only lesson, but the step has text`);
      if (s.title.split(/\s+/).length > 5) warns.push(`${sw}: title longer than 5 words`);
      if (s.body.includes("```")) errors.push(`${sw}: a code fence that isn't a block`);
      const b = s.block;
      const passage = section === "rw" ? 30 : 0;
      if (s.more) {
        const mw = countWords(s.more);
        if (mw > MAX_MORE_WORDS) errors.push(`${sw}: the more block is ${mw} words (max ${MAX_MORE_WORDS})`);
        if (visualOnly) warns.push(`${sw}: visual-only lesson, but the step has a more block`);
      }
      if (b?.t === "example") {
        words += b.lines.reduce((n, x) => n + countWords(x.note ?? ""), 0);
        const pw = countWords(b.prompt) + b.choices.reduce((n, c) => n + countWords(c), 0);
        if (pw > 60 + passage) errors.push(`${sw}: example problem is ${pw} words (max ${40 + passage})`);
        else if (pw > 40 + passage) warns.push(`${sw}: example problem is ${pw} words (max ${40 + passage})`);
        b.lines.forEach((x, k) => {
          if (countWords(x.text) > 20) errors.push(`${sw}: example line ${k + 1} is ${countWords(x.text)} words (max 14)`);
          if (countWords(x.note ?? "") > 16) errors.push(`${sw}: note on example line ${k + 1} is too long (max 10 words)`);
          else if (countWords(x.note ?? "") > 10) warns.push(`${sw}: note on example line ${k + 1} is ${countWords(x.note ?? "")} words (max 10)`);
        });
      }
      if (b?.t === "desmos") {
        if (b.moves.length < 2 || b.moves.length > 7) warns.push(`${sw}: ${b.moves.length} desmos moves (2–6)`);
        for (const mv of b.moves) if (countWords(mv.caption ?? "") > 14) warns.push(`${sw}: desmos caption "${(mv.caption ?? "").slice(0, 30)}" is long (max 12 words)`);
        if (section !== "math" && slug !== "desmos") warns.push(`${sw}: desmos block outside math`);
      }
      if (s.visual !== null) {
        if (!fs.existsSync(path.join(visDir, `${s.visual}.tsx`))) errors.push(`${sw}: visual "${s.visual}" has no file src/components/lessons/visuals/${s.visual}.tsx`);
        if (!s.visual.startsWith(`${slug}--`)) errors.push(`${sw}: visual id must start with "${slug}--"`);
      }
      if (b?.t === "quiz") {
        quizzes++;
        const typed = b.answers.length > 0;
        if (typed) typedQuizzes++;
        const qw = countWords(b.prompt);
        if (s === lastQuiz && isSkill) {
          // the last quiz is the bridge to the real questions: SAT wording and length
          const [lo, hi] = section === "math" ? [25, 100] : [45, 180];
          if (qw > hi) errors.push(`${sw}: the last quiz is ${qw} words (max ${hi}; real SAT length)`);
          else if (qw < lo) warns.push(`${sw}: the last quiz before the real questions is ${qw} words; make it SAT wording and length (${lo}+ words)`);
        } else if (qw > 65 + passage) errors.push(`${sw}: quiz question is ${qw} words (max ${40 + passage})`);
        else if (qw > 40 + passage) warns.push(`${sw}: quiz question is ${qw} words (max ${40 + passage})`);
        if (!b.explain.length) warns.push(`${sw}: quiz has no > explanation`);
        const ew = countWords(b.explain.join(" "));
        if (ew > 45) errors.push(`${sw}: quiz explanation is ${ew} words (max 25)`);
        else if (ew > 25) warns.push(`${sw}: quiz explanation is ${ew} words (max 25)`);
        if (typed) {
          if (section !== "math") warns.push(`${sw}: typed-answer quizzes are for math (R&W questions are multiple choice)`);
          if (/[A-Za-z]{2,}/.test(b.answers.join(" "))) errors.push(`${sw}: accepted answers must be numbers`);
          for (const w of b.wrong) {
            if (!w.feedback) warns.push(`${sw}: wrong value "${w.value}" has no :: feedback`);
            const fw = countWords(w.feedback ?? "");
            if (fw > 20) errors.push(`${sw}: feedback for "${w.value}" is ${fw} words (max 12)`);
            else if (fw > 12) warns.push(`${sw}: feedback for "${w.value}" is ${fw} words (max 12)`);
          }
        }
        for (const o of b.options) {
          if (!o.correct && !o.feedback) warns.push(`${sw}: wrong option "${o.text.slice(0, 30)}" has no :: feedback`);
          const fw = countWords(o.feedback ?? "");
          if (fw > 20) errors.push(`${sw}: feedback for "${o.text.slice(0, 30)}" is ${fw} words (max 12)`);
          else if (fw > 12) warns.push(`${sw}: feedback for "${o.text.slice(0, 30)}" is ${fw} words (max 12)`);
        }
        if (new Set(b.options.map((o) => o.text.toLowerCase())).size !== b.options.length) errors.push(`${sw}: two quiz options are the same`);
        if (b.desmos.length) {
          desmosFixes++;
          if (section !== "math" && slug !== "desmos") warns.push(`${sw}: desmos moves outside math`);
          if (b.desmos.length > 7) warns.push(`${sw}: ${b.desmos.length} desmos moves (max 6)`);
          for (const mv of b.desmos) if (countWords(mv.caption ?? "") > 14) warns.push(`${sw}: desmos caption "${(mv.caption ?? "").slice(0, 30)}" is long (max 12 words)`);
        }
      }
      if (b?.t === "check") errors.push(`${sw}: check blocks belong in the "Real SAT questions" part`);
    }
    total += words;
    if (words > MAX_PART_WORDS) errors.push(`${where}: ${words} words of teaching text (max ${MAX_PART_WORDS}; the more blocks are not counted)`);
  }
  for (const s of steps) {
    if (s.block?.t !== "check") continue;
    const q = bank.get(s.block.id);
    checks.push(q);
    const sw = `step "${s.title}"`;
    if (!q) errors.push(`${sw}: question ${s.block.id} is not in the live bank`);
    else {
      const allowed = [meta.skill, ...(meta["also-skills"] ?? "").split(",").map((x) => x.trim()).filter(Boolean)];
      if (!allowed.includes(q.skill)) errors.push(`${sw}: ${q.id} is skill ${q.skill}, not ${allowed.join(" / ")}`);
      if (q.choicesImage) errors.push(`${sw}: ${q.id} has its choices in one image`);
      if (q.figure?.fullPage) errors.push(`${sw}: ${q.id} only has a full-page image`);
      if ((owner.get(q.id) ?? []).length > 1) errors.push(`${sw}: ${q.id} is used more than once (${owner.get(q.id).join(", ")})`);
      const d = s.title.split(": ")[1];
      if (d && q.difficulty !== d) warns.push(`${sw}: ${q.id} is ${q.difficulty}`);
    }
    // The first "Your turn" line may be a notation reminder ("△JKL means triangle JKL."); every one is ≤ 12 words.
    if (countWords(s.body) > 12) errors.push(`${sw}: ${countWords(s.body)} words before a check (max 12)`);
    if (s.more) errors.push(`${sw}: a check step has no more block`);
    if (s.visual) errors.push(`${sw}: a check step has no visual`);
  }
  if (total > MAX_LESSON_WORDS) errors.push(`${total} words of teaching text (max ${MAX_LESSON_WORDS})`);
  else if (total > MAX_LESSON_WORDS - 50) warns.push(`${total} words of teaching text (max ${MAX_LESSON_WORDS})`);
  if (section === "math" && typedQuizzes < 1) warns.push("no typed-answer quiz (an \"answer:\" quiz): math lessons need at least one, like the SAT's student-produced response");
  if (section === "math" && desmosFixes < 2) warns.push(`only ${desmosFixes} quizzes with a Desmos way (~ lines); add them where Desmos is faster`);
  if (slug === "desmos" && steps.some((s) => s.block?.t === "quiz" && !s.block.desmos.length)) warns.push("every Desmos-lesson quiz should have ~ moves");
  if (visualOnly && steps.some((s) => !s.visual && s.block?.t !== "quiz")) warns.push("visual-only: every teaching step should be a visual block");

  const mins = estimateMinutes(steps, section);
  console.log(`${errors.length ? "✗" : "✓"} ${rel} · ${parts.length} parts · ${steps.length} steps · ${quizzes} quizzes (${desmosFixes} with Desmos) · ${checks.length} checks · ${total} words · ~${mins} min`);
  for (const e of errors) console.log(`  error: ${e}`);
  for (const w of warns) console.log(`  warn:  ${w}`);
  errorCount += errors.length;
}
console.log(errorCount ? `\n${errorCount} error(s)` : "\nall good");
process.exit(errorCount ? 1 : 0);
