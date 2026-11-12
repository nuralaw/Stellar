// Lesson file format (content/lessons/README.md): frontmatter, then "# " parts (subtopics), each with "## " steps.
// A step has teaching text and at most one block: ```example, ```quiz, ```check, ```desmos or ```visual.
// Shared by the site (lib/lessons.ts) and scripts/lessons-check.mjs, so it has no imports and only
// type-strippable TypeScript.

export interface QuizOption {
  text: string;
  correct: boolean;
  /** Shown when this option is picked. */
  feedback?: string;
}

/** One line of a worked example: the math/text, and a few words on what was done. */
export interface ExampleLine {
  text: string;
  note?: string;
}

/**
 * One move in a Desmos walkthrough (played on the real Desmos calculator, see components/lessons/DesmosDemo.tsx).
 *   type <latex>                  add an expression, as Desmos LaTeX: y=2x+1, y=\frac{1}{2}x, x^{2}+y^{2}=25
 *   point (x, y)                  mark and label a point (the answer you read off the graph)
 *   slider k = 0 .. 3             make slider k (at 0) and drag it to 3; "slider k = 2" just makes it
 *   zoom xmin xmax ymin ymax      set the visible window
 *   table x_1: 1, 2, 3; y_1: 4, 6, 8   add a table
 *   say                           caption only
 * Every move may end with ":: caption" (what the student should notice, ≤ 12 words).
 */
export type DesmosMove =
  | { a: "type"; latex: string; caption?: string }
  | { a: "point"; x: number; y: number; caption?: string }
  | { a: "slider"; name: string; from: number; to: number | null; caption?: string }
  | { a: "zoom"; xmin: number; xmax: number; ymin: number; ymax: number; caption?: string }
  | { a: "table"; cols: { name: string; values: number[] }[]; caption?: string }
  | { a: "say"; caption?: string };

export type Interactive =
  | { t: "quiz"; prompt: string; options: QuizOption[]; explain: string[]; desmos: DesmosMove[] }
  | { t: "check"; id: string }
  | { t: "example"; prompt: string; lines: ExampleLine[] }
  | { t: "desmos"; prompt: string; moves: DesmosMove[] }
  | { t: "visual"; id: string };

export interface Step {
  title: string;
  /** Teaching text (Markdown) before the interactive block. */
  body: string;
  block: Interactive | null;
  /** Text after the block (not allowed by the format, but rendered if present). */
  after: string;
}

/** A part (subtopic) of a lesson: steps[start..end). */
export interface Part {
  title: string;
  /** One line under the title on the lesson's overview. */
  tagline: string;
  start: number;
  end: number;
}

export interface ParsedLesson {
  meta: Record<string, string>;
  /** All steps in order (parts index into this). */
  steps: Step[];
  parts: Part[];
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

const MOVES = ["type", "point", "slider", "zoom", "table", "say"];
const num = (s: string) => {
  const t = s.trim().replace(/−/g, "-");
  const f = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  return f ? Number(f[1]) / Number(f[2]) : t === "" ? NaN : Number(t);
};

/** Parses one Desmos move ("type y=2x+1 :: caption"); null if the line isn't a move. */
export function parseMove(line: string, where: string, errors: string[]): DesmosMove | null {
  const [head, ...rest] = line.trim().split(/\s+::\s+/);
  const caption = rest.length ? rest.join(" :: ").trim() : undefined;
  const m = head.trim().match(/^(\w+)\s*(.*)$/);
  if (!m || !MOVES.includes(m[1])) return null;
  const arg = m[2].trim();
  const bad = (why: string) => {
    errors.push(`${where}: desmos move "${line.trim().slice(0, 50)}": ${why}`);
    return { a: "say" as const, caption };
  };
  switch (m[1]) {
    case "type":
      return arg ? { a: "type", latex: arg, caption } : bad("nothing to type");
    case "point": {
      const p = arg.match(/^\(\s*([^,]+),\s*([^)]+)\)$/);
      const x = p ? num(p[1]) : NaN;
      const y = p ? num(p[2]) : NaN;
      return Number.isFinite(x) && Number.isFinite(y) ? { a: "point", x, y, caption } : bad("write it as point (x, y) with numbers");
    }
    case "slider": {
      const s = arg.match(/^([a-zA-Z])\s*=\s*([^.\s][^\s]*?)(?:\s*\.\.\s*(\S+))?$/);
      const from = s ? num(s[2]) : NaN;
      const to = s?.[3] !== undefined ? num(s[3]) : null;
      if (!s || !Number.isFinite(from) || (to !== null && !Number.isFinite(to))) return bad("write it as slider k = 0 .. 3 (one letter, numbers)");
      if (/^[xyer]$/.test(s[1])) return bad(`"${s[1]}" can't be a slider name in Desmos`);
      return { a: "slider", name: s[1], from, to, caption };
    }
    case "zoom": {
      const v = arg.split(/\s+/).map(num);
      if (v.length !== 4 || v.some((n) => !Number.isFinite(n)) || v[0] >= v[1] || v[2] >= v[3]) return bad("write it as zoom xmin xmax ymin ymax");
      return { a: "zoom", xmin: v[0], xmax: v[1], ymin: v[2], ymax: v[3], caption };
    }
    case "table": {
      const cols = arg.split(";").map((c) => {
        const [name, vals = ""] = c.split(":");
        return { name: name.trim(), values: vals.split(",").map(num) };
      });
      if (cols.length < 2 || cols.some((c) => !c.name || !c.values.length || c.values.some((n) => !Number.isFinite(n))) || new Set(cols.map((c) => c.values.length)).size !== 1)
        return bad("write it as table x_1: 1, 2, 3; y_1: 4, 6, 8 (same length columns)");
      return { a: "table", cols, caption };
    }
    default:
      return { a: "say", caption: caption ?? (arg || undefined) };
  }
}

function parseQuiz(lines: string[], where: string, errors: string[]): Interactive {
  const prompt: string[] = [];
  const options: QuizOption[] = [];
  const explain: string[] = [];
  const desmos: DesmosMove[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const opt = t.match(/^([-*])\s+(.*)$/);
    const exp = t.match(/^>\s?(.*)$/);
    const dz = t.match(/^~\s+(.*)$/);
    if (dz) {
      const mv = parseMove(dz[1], where, errors);
      if (mv) desmos.push(mv);
      else errors.push(`${where}: "~ ${dz[1].slice(0, 30)}" is not a desmos move (${MOVES.join(", ")})`);
    } else if (exp) explain.push(exp[1].trim());
    else if (opt) {
      const [text, ...rest] = opt[2].split(/\s+::\s+/);
      options.push({ text: text.trim(), correct: opt[1] === "*", feedback: rest.length ? rest.join(" :: ").trim() : undefined });
    } else if (options.length || explain.length) errors.push(`${where}: quiz line "${t.slice(0, 40)}" after the options (options start with - or *, explanation with >, Desmos moves with ~)`);
    else prompt.push(t);
  }
  if (!prompt.length) errors.push(`${where}: quiz has no question`);
  if (options.length < 2 || options.length > 4) errors.push(`${where}: quiz needs 2–4 options, has ${options.length}`);
  const right = options.filter((o) => o.correct).length;
  if (right !== 1) errors.push(`${where}: quiz needs exactly one correct (*) option, has ${right}`);
  return { t: "quiz", prompt: prompt.join("\n"), options, explain, desmos };
}

function parseExample(lines: string[], where: string, errors: string[]): Interactive {
  const prompt: string[] = [];
  const out: ExampleLine[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const m = t.match(/^\d+\.\s+(.*)$/);
    if (m) {
      const [text, ...rest] = m[1].split(/\s+::\s+/);
      out.push({ text: text.trim(), note: rest.length ? rest.join(" :: ").trim() : undefined });
    } else if (out.length) errors.push(`${where}: example line "${t.slice(0, 40)}" after the numbered lines`);
    else prompt.push(t);
  }
  if (!prompt.length) errors.push(`${where}: example has no problem (the lines before "1.")`);
  if (out.length < 2 || out.length > 5) errors.push(`${where}: example needs 2–5 numbered lines, has ${out.length}`);
  return { t: "example", prompt: prompt.join("\n"), lines: out };
}

function parseDesmos(lines: string[], where: string, errors: string[]): Interactive {
  const prompt: string[] = [];
  const moves: DesmosMove[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const mv = parseMove(t, where, errors);
    if (mv) moves.push(mv);
    else if (moves.length) errors.push(`${where}: desmos line "${t.slice(0, 40)}" is not a move (${MOVES.join(", ")})`);
    else prompt.push(t);
  }
  if (!moves.length) errors.push(`${where}: desmos block has no moves`);
  return { t: "desmos", prompt: prompt.join("\n"), moves };
}

export function parseLesson(raw: string): ParsedLesson | null {
  const fm = parseFrontmatter(raw);
  if (!fm) return null;
  const errors: string[] = [];
  const lines = fm.body.split("\n");
  const steps: Step[] = [];
  const parts: { title: string; tagline: string[]; start: number }[] = [];
  let cur: { title: string; body: string[]; block: Interactive | null; after: string[] } | null = null;
  const close = () => {
    if (cur) steps.push({ title: cur.title, body: cur.body.join("\n").trim(), block: cur.block, after: cur.after.join("\n").trim() });
    cur = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (/^#\s/.test(t)) {
      close();
      parts.push({ title: t.replace(/^#\s+/, "").trim(), tagline: [], start: steps.length });
      continue;
    }
    if (/^##\s/.test(t)) {
      close();
      cur = { title: t.replace(/^##\s+/, "").trim(), body: [], block: null, after: [] };
      continue;
    }
    if (!cur) {
      if (!t) continue;
      if (parts.length) parts[parts.length - 1].tagline.push(t);
      else errors.push(`text before the first "# " part or "## " step: "${t.slice(0, 40)}"`);
      continue;
    }
    const fence = t.match(/^```\s*(quiz|check|example|desmos|visual)\s*$/);
    if (fence) {
      const where = `step "${cur.title}"`;
      const inner: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) inner.push(lines[i++]);
      if (i >= lines.length) errors.push(`${where}: unclosed \`\`\`${fence[1]} block`);
      if (cur.block) errors.push(`${where}: more than one block`);
      let block: Interactive;
      if (fence[1] === "check" || fence[1] === "visual") {
        const ids = inner.map((l) => l.trim()).filter(Boolean);
        if (ids.length !== 1) errors.push(`${where}: a ${fence[1]} block holds exactly one id`);
        block = fence[1] === "check" ? { t: "check", id: ids[0] ?? "" } : { t: "visual", id: ids[0] ?? "" };
      } else if (fence[1] === "example") block = parseExample(inner, where, errors);
      else if (fence[1] === "desmos") block = parseDesmos(inner, where, errors);
      else block = parseQuiz(inner, where, errors);
      if (!cur.block) cur.block = block;
      continue;
    }
    if (cur.block) {
      if (t) cur.after.push(line);
    } else cur.body.push(line);
  }
  close();
  for (const s of steps) if (s.after) errors.push(`step "${s.title}": text after the block (the block must end the step)`);

  // No "# " parts: the whole lesson is one part.
  const list = parts.length ? parts : [{ title: fm.meta.title ?? "Lesson", tagline: [], start: 0 }];
  if (parts.length && parts[0].start > 0) errors.push('steps before the first "# " part');
  const out: Part[] = list.map((p, k) => ({ title: p.title, tagline: p.tagline.join(" ").trim(), start: p.start, end: list[k + 1]?.start ?? steps.length }));
  for (const p of out) if (p.end <= p.start) errors.push(`part "${p.title}" has no steps`);
  return { meta: fm.meta, steps, parts: out, errors };
}

/** Rough word count of Markdown prose (tables and markup ignored as symbols). */
export function countWords(md: string): number {
  return md
    .replace(/[|*`#>_[\]()-]+/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

/** Honest time estimate: reading + answering + watching. */
export function estimateMinutes(steps: Step[], section: string): number {
  let words = 0;
  let quizzes = 0;
  let checks = 0;
  let shows = 0;
  for (const s of steps) {
    words += countWords(s.body) + countWords(s.after);
    const b = s.block;
    if (b?.t === "quiz") {
      quizzes++;
      words += countWords(b.prompt) + b.options.reduce((n, o) => n + countWords(o.text), 0) + countWords(b.explain.join(" "));
    }
    if (b?.t === "example") {
      quizzes++;
      words += countWords(b.prompt) + b.lines.reduce((n, l) => n + countWords(l.text) + countWords(l.note ?? ""), 0);
    }
    if (b?.t === "desmos" || b?.t === "visual") shows++;
    if (b?.t === "check") checks++;
  }
  const perCheck = section === "math" ? 1.6 : 1.2;
  return Math.max(2, Math.round(words / 170 + quizzes * 0.35 + shows * 0.3 + checks * perCheck));
}
