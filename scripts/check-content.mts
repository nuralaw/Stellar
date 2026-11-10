// Validates question content. Run: npm run check:content
// (Node runs this TypeScript file directly via type stripping.)
import katex from "katex";
import { MATH_QUESTIONS } from "../src/content/questions/math.ts";
import { RW_QUESTIONS } from "../src/content/questions/rw.ts";
import { DOMAINS } from "../src/lib/taxonomy.ts";
import { parseNumeric } from "../src/lib/answers.ts";

const questions = [...RW_QUESTIONS, ...MATH_QUESTIONS];
const errors: string[] = [];
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

function checkMath(id: string, field: string, text: string | undefined) {
  if (!text) return;
  const t = text.replaceAll("\\$", "");
  if ((t.match(/\$/g) ?? []).length % 2 !== 0) err(id, `${field}: unbalanced $ (write a literal dollar as \\$)`);
  for (const m of t.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
    const tex = m[1] ?? m[2];
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode: Boolean(m[1]) });
    } catch (e) {
      err(id, `${field}: KaTeX error in "${tex}": ${(e as Error).message}`);
    }
  }
}

const seen = new Set<string>();
for (const q of questions) {
  if (seen.has(q.id)) err(q.id, "duplicate id");
  seen.add(q.id);

  const domain = DOMAINS.find((d) => d.id === q.domain);
  if (!domain) err(q.id, `unknown domain "${q.domain}"`);
  else {
    if (domain.section !== q.section) err(q.id, `domain "${q.domain}" is not in section "${q.section}"`);
    if (!domain.skills.some((s) => s.id === q.skill)) err(q.id, `skill "${q.skill}" not in domain "${q.domain}"`);
  }
  if (!q.prompt.trim()) err(q.id, "empty prompt");
  if (q.explanation.trim().length < 20) err(q.id, "explanation too short");

  if (q.type === "mcq") {
    for (const l of ["A", "B", "C", "D"] as const) {
      if (!q.choices[l]?.trim()) err(q.id, `choice ${l} is empty`);
      checkMath(q.id, `choice ${l}`, q.choices[l]);
    }
    if (!(q.answer in q.choices)) err(q.id, `answer "${q.answer}" is not a choice`);
    const texts = Object.values(q.choices).map((c) => c.trim());
    if (new Set(texts).size !== texts.length) err(q.id, "duplicate choice text");
  } else {
    if (!q.answer.length) err(q.id, "no accepted answers");
    for (const a of q.answer) if (parseNumeric(a) === null) err(q.id, `accepted answer "${a}" is not numeric`);
  }

  for (const [field, text] of [
    ["passage", q.passage],
    ["passage2", q.passage2],
    ["prompt", q.prompt],
    ["explanation", q.explanation],
  ] as const)
    checkMath(q.id, field, text);
}

const count = (pred: (q: (typeof questions)[number]) => boolean) => questions.filter(pred).length;
console.log(`${questions.length} questions · R&W ${count((q) => q.section === "rw")} · Math ${count((q) => q.section === "math")}`);
for (const d of DOMAINS) console.log(`  ${d.section.padEnd(4)} ${d.name.padEnd(36)} ${count((q) => q.domain === d.id)}`);

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log("\nAll questions OK");
