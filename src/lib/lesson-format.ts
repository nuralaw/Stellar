// Lesson file format (content/lessons/README.md): frontmatter, then "## " steps, each with teaching text and
// at most one ```quiz or ```check block. Shared by the site (lib/lessons.ts) and scripts/lessons-check.mjs,
// so it has no imports and only type-strippable TypeScript.

export interface QuizOption {
  text: string;
  correct: boolean;
  /** Shown when this option is picked. */
  feedback?: string;
}

export type Interactive =
  | { t: "quiz"; prompt: string; options: QuizOption[]; explain: string[] }
  | { t: "check"; id: string };

export interface Step {
  title: string;
  /** Teaching text (Markdown) before the interactive block. */
  body: string;
  block: Interactive | null;
  /** Text after the block (not allowed by the format, but rendered if present). */
  after: string;
}

export interface ParsedLesson {
  meta: Record<string, string>;
  steps: Step[];
  /** Format problems found while parsing (the checker reports them). */
  errors: string[];
}

export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } | null {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2] };
}

function parseQuiz(lines: string[], where: string, errors: string[]): Interactive {
  const prompt: string[] = [];
  const options: QuizOption[] = [];
  const explain: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const opt = t.match(/^([-*])\s+(.*)$/);
    const exp = t.match(/^>\s?(.*)$/);
    if (exp) explain.push(exp[1].trim());
    else if (opt) {
      const [text, ...rest] = opt[2].split(/\s+::\s+/);
      options.push({ text: text.trim(), correct: opt[1] === "*", feedback: rest.length ? rest.join(" :: ").trim() : undefined });
    } else if (options.length || explain.length) errors.push(`${where}: quiz line "${t.slice(0, 40)}" after the options (options start with - or *, explanation with >)`);
    else prompt.push(t);
  }
  if (!prompt.length) errors.push(`${where}: quiz has no question`);
  if (options.length < 2 || options.length > 4) errors.push(`${where}: quiz needs 2–4 options, has ${options.length}`);
  const right = options.filter((o) => o.correct).length;
  if (right !== 1) errors.push(`${where}: quiz needs exactly one correct (*) option, has ${right}`);
  return { t: "quiz", prompt: prompt.join("\n"), options, explain };
}

export function parseLesson(raw: string): ParsedLesson | null {
  const fm = parseFrontmatter(raw);
  if (!fm) return null;
  const errors: string[] = [];
  const lines = fm.body.split("\n");
  const steps: Step[] = [];
  let cur: { title: string; body: string[]; block: Interactive | null; after: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (/^##\s/.test(t) && !/^###/.test(t)) {
      if (cur) steps.push({ title: cur.title, body: cur.body.join("\n").trim(), block: cur.block, after: cur.after.join("\n").trim() });
      cur = { title: t.replace(/^##\s+/, "").trim(), body: [], block: null, after: [] };
      continue;
    }
    if (!cur) {
      if (t) errors.push(`text before the first "## " step: "${t.slice(0, 40)}"`);
      continue;
    }
    const fence = t.match(/^```\s*(quiz|check)\s*$/);
    if (fence) {
      const where = `step "${cur.title}"`;
      const inner: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) inner.push(lines[i++]);
      if (i >= lines.length) errors.push(`${where}: unclosed \`\`\`${fence[1]} block`);
      if (cur.block) errors.push(`${where}: more than one quiz/check block`);
      let block: Interactive;
      if (fence[1] === "check") {
        const ids = inner.map((l) => l.trim()).filter(Boolean);
        if (ids.length !== 1) errors.push(`${where}: a check block holds exactly one question id`);
        block = { t: "check", id: ids[0] ?? "" };
      } else block = parseQuiz(inner, where, errors);
      if (!cur.block) cur.block = block;
      continue;
    }
    if (cur.block) {
      if (t) cur.after.push(line);
    } else cur.body.push(line);
  }
  if (cur) steps.push({ title: cur.title, body: cur.body.join("\n").trim(), block: cur.block, after: cur.after.join("\n").trim() });
  for (const s of steps) if (s.after) errors.push(`step "${s.title}": text after the quiz/check block (the block must end the step)`);
  return { meta: fm.meta, steps, errors };
}

/** Rough word count of Markdown prose (tables and markup ignored as symbols). */
export function countWords(md: string): number {
  return md
    .replace(/[|*`#>_[\]()-]+/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

/** Honest time estimate: reading + answering. */
export function estimateMinutes(steps: Step[], section: string): number {
  let words = 0;
  let quizzes = 0;
  let checks = 0;
  for (const s of steps) {
    words += countWords(s.body) + countWords(s.after);
    if (s.block?.t === "quiz") {
      quizzes++;
      words += countWords(s.block.prompt) + s.block.options.reduce((n, o) => n + countWords(o.text), 0) + countWords(s.block.explain.join(" "));
    }
    if (s.block?.t === "check") checks++;
  }
  const perCheck = section === "math" ? 1.6 : 1.2;
  return Math.max(3, Math.round(words / 170 + quizzes * 0.4 + checks * perCheck));
}
