// Validates lesson files (format v2: content/lessons/README.md, spec docs/lessons-v2.md).
//   npm run lessons:check                 every lesson
//   npm run lessons:check -- <file>…      only these files (paths or slugs)
//   npm run lessons:check -- --strict     a visual without a file is an error even if a brief exists
// Errors fail the run (exit 1); warnings are printed but pass.
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { TOKEN_RE, countWords, estimateMinutes, locate, parseLesson } from "../src/lib/lesson-format.ts";
import { DOMAINS } from "../src/lib/taxonomy.ts";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "content/lessons");
const visDir = path.join(root, "src/components/lessons/visuals");
const briefDir = path.join(dir, "_briefs");
const bank = new Map(JSON.parse(fs.readFileSync(path.join(root, "content/bank/dist/questions.json"), "utf8")).map((q) => [q.id, q]));
const visIndex = fs.existsSync(path.join(visDir, "index.ts")) ? fs.readFileSync(path.join(visDir, "index.ts"), "utf8") : "";
const SECTIONS = ["rw", "math", "strategy"];

// Word ranges of the spec (warnings).
const KEY_WORDS = [80, 220];
const THEORY_WORDS = [120, 400];
const EXPLAIN_WORDS = [60, 250];
const MAX_NOTE_WORDS = 20; // a highlight note
const MAX_FEEDBACK_WORDS = 12; // an option's "::" feedback
const MAX_TAGLINE_WORDS = 10;
const MAX_TITLE_WORDS = 5;

// Formulas: \( … \) inline, \[ … \] display, on one line (README "Math"). Every formula must render in KaTeX; math left
// outside formulas is warned about (once per piece of text).
// (° before C or F is a temperature in R&W text, not math.)
const MATH_CHARS = /[²³√π≤≥×÷½⅓¼θ]|°(?![CF])|[A-Za-z0-9)]\s*−\s*[A-Za-z0-9(]/;
const MATH_NOTATION = /[A-Za-z0-9)]\^[({\-\w]|\^\(|\bsqrt\(|\bcbrt\(|[A-Za-z]_\(?\w/;

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const norm = (t) => t.replace(/\s+/g, " ").trim().toLowerCase();
const INLINE_ONLY = ["subtopic title", "tagline"];

/** Errors for the formulas in `texts` ([what, text] pairs), and one warning for math left outside formulas. */
function mathProblems(sw, texts) {
  const errors = [];
  const warns = [];
  let loose = null;
  for (const [what, text] of texts.filter(([, t]) => t)) {
    for (const line of text.split("\n")) {
      // One pass like the site's: code spans are skipped, formulas found. With both removed, no \( \) \[ \] may remain.
      const rest = line.replace(TOKEN_RE, "");
      if (/\\[()[\]]/.test(rest)) errors.push(`${sw}: ${what}: unbalanced \\( \\) \\[ \\] (a formula opens and closes on one line): "${line.trim().slice(0, 60)}"`);
      for (const m of line.matchAll(TOKEN_RE)) {
        if (m[1] === undefined && m[2] === undefined) continue; // a code span
        const tex = (m[1] ?? m[2]).trim();
        const display = m[1] === undefined;
        const [open, close] = display ? ["\\[", "\\]"] : ["\\(", "\\)"];
        if (display && INLINE_ONLY.includes(what)) errors.push(`${sw}: ${what}: display math \\[ \\] is not allowed here (use \\( \\))`);
        try {
          // strict "error": KaTeX's warnings (unicode in math, unknown commands) are errors. Commands it does not trust
          // (\href, \url, \includegraphics, \htmlId) don't throw but come out in its error colour.
          const html = katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: "error", output: "htmlAndMathml" });
          if (html.includes("#cc0000")) throw new Error("command not allowed (KaTeX shows it in red)");
        } catch (e) {
          errors.push(`${sw}: ${what}: formula ${open} ${tex.slice(0, 60)} ${close} does not render: ${String(e.message).replace(/^KaTeX parse error: /, "")}`);
        }
      }
      if (loose === null) {
        const found = rest.match(MATH_CHARS) ?? rest.match(MATH_NOTATION);
        if (found) loose = `${what}: "${rest.trim().slice(Math.max(0, found.index - 15), found.index + 25)}"`;
      }
    }
  }
  if (loose) warns.push(`${sw}: math outside \\( \\) / \\[ \\] (${loose})`);
  return { errors, warns };
}

const wordRange = (sw, what, text, [lo, hi], warns) => {
  const n = countWords(text);
  if (n < lo || n > hi) warns.push(`${sw}: ${what} is ${n} words (${lo}–${hi})`);
};

const files = [];
for (const sec of SECTIONS) {
  const d = path.join(dir, sec);
  if (fs.existsSync(d)) for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".md")).sort()) files.push(path.join(d, f));
}
const strict = process.argv.includes("--strict");
const wanted = process.argv.slice(2).filter((a) => !a.startsWith("--")).map((a) => path.basename(a, ".md"));
const targets = wanted.length ? files.filter((f) => wanted.includes(path.basename(f, ".md"))) : files;
if (wanted.length && targets.length !== wanted.length) {
  console.error(`not found: ${wanted.filter((w) => !targets.some((f) => path.basename(f, ".md") === w)).join(", ")}`);
  process.exit(1);
}

// Questions across the whole site: bank ids and own prompts (the same question twice anywhere is an error).
const bankOwner = new Map();
const ownOwner = new Map();
const push = (map, key, who) => (map.get(key) ?? map.set(key, []).get(key)).push(who);
for (const f of files) {
  const l = parseLesson(fs.readFileSync(f, "utf8"));
  const slug = path.basename(f, ".md");
  for (const s of l?.subtopics ?? []) for (const t of s.tasks) push(t.kind === "bank" ? bankOwner : ownOwner, t.kind === "bank" ? t.id : norm(t.question.prompt), slug);
}

const bankPrompts = new Map();
for (const q of bank.values()) bankPrompts.set(norm(q.prompt), q.id);

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
  const { meta, subtopics } = l;
  const isSkill = section !== "strategy";

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
  const allowedSkills = [meta.skill, ...(meta["also-skills"] ?? "").split(",").map((x) => x.trim()).filter(Boolean)];

  if (subtopics.length < 4 || subtopics.length > 7) errors.push(`${subtopics.length} subtopics (need 4–7)`);

  let words = 0;
  let typed = 0;
  let bankTasks = 0;
  let ownTasks = 0;
  for (const s of subtopics) {
    const sw = `subtopic "${s.title}"`;
    words += countWords(s.keyIdeas) + countWords(s.theory);

    // Titles, tagline, visual
    if (s.title.split(/\s+/).length > MAX_TITLE_WORDS) warns.push(`${sw}: title longer than ${MAX_TITLE_WORDS} words`);
    if (s.tagline && countWords(s.tagline) > MAX_TAGLINE_WORDS) warns.push(`${sw}: tagline is ${countWords(s.tagline)} words (max ${MAX_TAGLINE_WORDS})`);
    if (s.visual) {
      const hasFile = /^[a-z0-9-]+$/.test(s.visual) && fs.existsSync(path.join(visDir, `${s.visual}.tsx`));
      if (!/^[a-z0-9-]+$/.test(s.visual)) errors.push(`${sw}: visual id "${s.visual}" must be lowercase letters, digits and dashes`);
      else if (hasFile) {
        if (!visIndex.includes(`from "./${s.visual}"`)) warns.push(`${sw}: visual "${s.visual}" is not in visuals/index.ts (run npm run lessons:visuals -- --index)`);
      } else if (fs.existsSync(path.join(briefDir, `${s.visual}.md`))) (strict ? errors : warns).push(`${sw}: visual "${s.visual}" missing — brief exists (content/lessons/_briefs/${s.visual}.md)`);
      else errors.push(`${sw}: visual "${s.visual}" has no file src/components/lessons/visuals/${s.visual}.tsx and no brief content/lessons/_briefs/${s.visual}.md`);
      // The lesson's own topic animation (`<slug>`) may also illustrate a subtopic.
      if (s.visual !== slug && !s.visual.startsWith(`${slug}--`)) warns.push(`${sw}: visual id should be "${slug}" or start with "${slug}--"`);
    }

    // Learn screen text
    if (s.keyIdeas) wordRange(sw, "Key ideas", s.keyIdeas, KEY_WORDS, warns);
    if (s.theory) wordRange(sw, "theory", s.theory, THEORY_WORDS, warns);
    if (s.keyIdeas.includes("```") || s.theory.includes("```")) errors.push(`${sw}: a code fence that isn't a block`);
    const learn = [["subtopic title", s.title], ["tagline", s.tagline], ["key ideas", s.keyIdeas], ["theory", s.theory]];
    if (s.example) {
      const e = s.example;
      learn.push(["example problem", e.prompt]);
      for (const c of e.choices) learn.push(["example choice", c]);
      for (const x of e.lines) learn.push(["example line", x.text], ["example note", x.note ?? ""]);
      const pw = countWords(e.prompt) + e.choices.reduce((n, c) => n + countWords(c), 0);
      if (pw > 70) warns.push(`${sw}: example problem is ${pw} words (keep it short)`);
      e.lines.forEach((x, k) => {
        if (countWords(x.text) > 20) warns.push(`${sw}: example line ${k + 1} is ${countWords(x.text)} words (max 14)`);
        if (countWords(x.note ?? "") > 14) warns.push(`${sw}: note on example line ${k + 1} is ${countWords(x.note ?? "")} words (max 10)`);
      });
    }
    if (s.desmos) {
      learn.push(["desmos problem", s.desmos.prompt]);
      for (const mv of s.desmos.moves) learn.push(["desmos caption", mv.caption ?? ""]);
      if (s.desmos.moves.length < 2 || s.desmos.moves.length > 7) warns.push(`${sw}: ${s.desmos.moves.length} desmos moves (2–6)`);
      for (const mv of s.desmos.moves) if (countWords(mv.caption ?? "") > 14) warns.push(`${sw}: desmos caption "${(mv.caption ?? "").slice(0, 30)}" is long (max 12 words)`);
      if (section !== "math" && slug !== "desmos") warns.push(`${sw}: desmos block outside math`);
    }
    {
      const mp = mathProblems(sw, learn);
      errors.push(...mp.errors);
      warns.push(...mp.warns);
    }

    // Tasks
    for (const t of s.tasks) {
      const tw = `${sw} · ${cap(t.level)} task`;
      const texts = [];
      let fields = []; // [label, text] pairs a highlight phrase may be found in
      if (t.kind === "bank") {
        bankTasks++;
        const q = bank.get(t.id);
        if (!q) errors.push(`${tw}: question ${t.id} is not in the live bank`);
        else {
          if (!allowedSkills.includes(q.skill)) errors.push(`${tw}: ${q.id} is skill ${q.skill}, not ${allowedSkills.join(" / ")}`);
          if (q.choicesImage) errors.push(`${tw}: ${q.id} has its choices in one image`);
          if (q.figure?.fullPage) errors.push(`${tw}: ${q.id} only has a full-page image`);
          if (q.difficulty !== t.level) warns.push(`${tw}: ${q.id} is ${q.difficulty}`);
          if (q.type === "spr") typed++;
          // highlights are matched against the question text as stored: the passage and the prompt
          fields = [["passage", q.passage ?? ""], ["prompt", q.prompt]];
        }
        const owners = bankOwner.get(t.id) ?? [];
        if (owners.length > 1) errors.push(`${tw}: ${t.id} is used more than once on the site (${owners.join(", ")})`);
      } else {
        ownTasks++;
        const q = t.question;
        fields = [["prompt", q.prompt]];
        texts.push(["question", q.prompt]);
        const isTyped = q.answers.length > 0;
        if (isTyped) typed++;
        const owners = ownOwner.get(norm(q.prompt)) ?? [];
        if (owners.length > 1) errors.push(`${tw}: the same question is used more than once on the site (${owners.join(", ")})`);
        const copy = bankPrompts.get(norm(q.prompt));
        if (copy) errors.push(`${tw}: this prompt is the bank question ${copy} (use bank: ${copy}, and it may be used only once)`);
        if (isTyped) {
          if (section !== "math") warns.push(`${tw}: typed-answer questions are for math (R&W questions are multiple choice)`);
          if (/[A-Za-z]{2,}/.test(q.answers.join(" "))) errors.push(`${tw}: accepted answers must be numbers`);
          for (const w of q.wrong) {
            texts.push(["feedback", w.feedback ?? ""]);
            if (!w.feedback) warns.push(`${tw}: wrong value "${w.value}" has no :: feedback`);
            if (countWords(w.feedback ?? "") > MAX_FEEDBACK_WORDS) warns.push(`${tw}: feedback for "${w.value}" is ${countWords(w.feedback)} words (max ${MAX_FEEDBACK_WORDS})`);
          }
        } else {
          if (q.options.length < 4) warns.push(`${tw}: ${q.options.length} options (SAT questions have four)`);
          for (const o of q.options) {
            texts.push(["option", o.text], ["feedback", o.feedback ?? ""]);
            if (!o.correct && !o.feedback) warns.push(`${tw}: wrong option "${o.text.slice(0, 30)}" has no :: feedback`);
            if (countWords(o.feedback ?? "") > MAX_FEEDBACK_WORDS) warns.push(`${tw}: feedback for "${o.text.slice(0, 30)}" is ${countWords(o.feedback)} words (max ${MAX_FEEDBACK_WORDS})`);
          }
          if (new Set(q.options.map((o) => norm(o.text))).size !== q.options.length) errors.push(`${tw}: two options are the same`);
        }
        if (q.desmos.length) {
          if (section !== "math" && slug !== "desmos") warns.push(`${tw}: desmos moves outside math`);
          if (q.desmos.length > 7) warns.push(`${tw}: ${q.desmos.length} desmos moves (max 6)`);
          for (const mv of q.desmos) {
            texts.push(["desmos caption", mv.caption ?? ""]);
            if (countWords(mv.caption ?? "") > 14) warns.push(`${tw}: desmos caption "${(mv.caption ?? "").slice(0, 30)}" is long (max 12 words)`);
          }
        }
      }

      // highlights: 2–5, each an exact substring of the prompt/passage that the player can mark (same rule as the player)
      if (t.highlights.length < 2 || t.highlights.length > 5) errors.push(`${tw}: ${t.highlights.length} highlights (need 2–5)`);
      for (const h of t.highlights) {
        texts.push(["highlight note", h.note]);
        if (countWords(h.note) > MAX_NOTE_WORDS) warns.push(`${tw}: highlight note "${h.note.slice(0, 30)}…" is ${countWords(h.note)} words (max ${MAX_NOTE_WORDS})`);
        if (!h.phrase.trim()) errors.push(`${tw}: empty highlight phrase`);
      }
      if (fields.length)
        for (const problem of locate(fields.map(([, text]) => text), t.highlights.filter((h) => h.phrase.trim())).problems)
          errors.push(`${tw}: ${problem.replace("not found in the task text", t.kind === "bank" ? `not in the stored question text (passage or prompt; copy it from npm run lessons:questions -- --show ${t.id})` : "not in the question prompt")}`);
      if (new Set(t.highlights.map((h) => h.phrase)).size !== t.highlights.length) warns.push(`${tw}: the same highlight phrase twice`);

      // explain
      if (t.explain) wordRange(tw, "explain", t.explain, EXPLAIN_WORDS, warns);
      texts.push(["explain", t.explain]);
      words += countWords(t.explain);
      const mp = mathProblems(tw, texts);
      errors.push(...mp.errors);
      warns.push(...mp.warns);
    }
  }

  if (section === "math" && typed < 1) warns.push('no typed-answer task (an "answer:" question or a grid-in bank question): math lessons need at least one, like the SAT\'s student-produced response');
  if (slug === "desmos" && subtopics.some((s) => s.tasks.some((t) => t.kind === "own" && !t.question.desmos.length))) warns.push("every Desmos-lesson task should have ~ moves");

  const mins = estimateMinutes(subtopics, section);
  console.log(`${errors.length ? "✗" : "✓"} ${rel} · ${subtopics.length} subtopics · ${bankTasks + ownTasks} tasks (${bankTasks} bank, ${ownTasks} own, ${typed} typed) · ${words} words · ~${mins} min`);
  for (const e of errors) console.log(`  error: ${e}`);
  for (const w of warns) console.log(`  warn:  ${w}`);
  errorCount += errors.length;
}
console.log(errorCount ? `\n${errorCount} error(s)` : "\nall good");
process.exit(errorCount ? 1 : 0);
