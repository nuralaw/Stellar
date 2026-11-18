// Lesson file format (content/lessons/README.md): frontmatter, then "# " parts (subtopics), each with "## " steps.
// A step has teaching text, then (in this order) an optional ```visual, at most one of ```example, ```desmos,
// ```quiz or ```check, and an optional ```more (the "Not clear? Explain more" text). A visual can only be paired
// with an example or desmos block.
// Shared by the site (lib/lessons.ts) and scripts/lessons-check.mjs, so it has no imports and only
// type-strippable TypeScript.

export interface QuizOption {
  text: string;
  correct: boolean;
  /** Shown when this option is picked. */
  feedback?: string;
}

/** A typed-answer quiz: a common wrong value and what it means (shown when the student enters it). */
export interface QuizWrong {
  value: string;
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
  // Multiple choice: `options` (exactly one correct). Typed answer: `answers` (accepted values) and `wrong`; `options` is empty.
  | { t: "quiz"; prompt: string; options: QuizOption[]; answers: string[]; wrong: QuizWrong[]; explain: string[]; desmos: DesmosMove[] }
  | { t: "check"; id: string }
  // `choices`: an R&W example's answer choices ("Choices: a / b / c"), shown as lettered chips.
  | { t: "example"; prompt: string; choices: string[]; lines: ExampleLine[] }
  | { t: "desmos"; prompt: string; moves: DesmosMove[] };

export interface Step {
  title: string;
  /** Teaching text (Markdown) before the blocks. */
  body: string;
  /** The id of the step's ```visual animation (shown first, above the block), or null. */
  visual: string | null;
  block: Interactive | null;
  /** The ```more text (Markdown): the expandable "Not clear? Explain more" under the step, or null. */
  more: string | null;
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

/* ---------------- typed answers (the SAT's student-produced response) ---------------- */

/** A typed entry: a number as an integer, decimal or fraction ("4", "-2.5", ".5", "17/4"), or something else. */
export type Entry =
  | { kind: "num"; value: number; /** exact value as a fraction */ n: number; d: number; /** digits after the decimal point, null for integers and fractions */ places: number | null; /** the entry as the answer grid would show it */ text: string }
  | { kind: "mixed" }
  | { kind: "bad" };

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * Reads what a student typed (or an author wrote as an accepted answer). Spaces are allowed only around "/" and after
 * a leading minus; "4 1/4" is a mixed number; anything else with a space ("12 3") is not a number.
 */
export function parseEntry(raw: string): Entry {
  const t = raw.trim().replace(/−/g, "-");
  if (/^-?\s*\d+\s+\d+\s*\/\s*\d+$/.test(t)) return { kind: "mixed" };
  const frac = t.match(/^(-?)\s*(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const n = Number(frac[2]);
    const d = Number(frac[3]);
    if (!d) return { kind: "bad" };
    const sign = frac[1] ? -1 : 1;
    return { kind: "num", value: (sign * n) / d, n: sign * n, d, places: null, text: `${frac[1]}${frac[2]}/${frac[3]}` };
  }
  const dec = t.match(/^(-?)\s*(\d+)?(?:\.(\d*))?$/);
  if (!dec || (dec[2] === undefined && !dec[3])) return { kind: "bad" };
  const places = dec[3] ?? null;
  const d = 10 ** (places?.length ?? 0);
  const n = Number(`${dec[2] ?? ""}${places ?? ""}`) * (dec[1] ? -1 : 1);
  return { kind: "num", value: n / d, n, d, places: places === null ? null : places.length, text: `${dec[1]}${dec[2] ?? ""}${places === null ? "" : `.${places}`}` };
}

const same = (a: { n: number; d: number }, b: { n: number; d: number }) => a.n * b.d === b.n * a.d;

/** True when the fraction can't be written as a finite decimal (2/3, 5/6, 1/7). */
function repeats(e: { n: number; d: number }) {
  let d = e.d / (gcd(Math.abs(e.n), e.d) || 1);
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d !== 1;
}

/**
 * A decimal entry against an answer that doesn't end (2/3, 50/3), by the SAT's rule: the decimal must be the value
 * truncated or rounded at the places it has, and fill the answer grid (5 characters counting the ".", 6 with a minus
 * sign; a leading 0 may be left out, so "0.666" and ".6666" both fill it). "no": not such a decimal (or too short:
 * .67, 1.33); "long": the right value, but more characters than the grid holds (16.667); "ok": accepted.
 */
function approximates(e: Extract<Entry, { kind: "num" }>, t: Extract<Entry, { kind: "num" }>): "ok" | "long" | "no" {
  if (e.places === null || e.places < 1 || !repeats(t) || Math.sign(e.value) !== Math.sign(t.value)) return "no";
  const exact = (Math.abs(t.n) * 10 ** e.places) / t.d;
  const digits = Math.abs(e.n);
  if (digits !== Math.floor(exact + 1e-9) && digits !== Math.round(exact)) return "no";
  const typed = e.text.replace(/^-/, "");
  const bare = typed.replace(/^0(?=\.)/, "");
  if (bare.length > 5) return "long";
  return typed.length === 5 || bare.length === 5 ? "ok" : "no";
}

/**
 * Does the entry equal one of the accepted answers (given as "4", "-2.5", "17/4")? Equivalent forms count (17/4,
 * 4.25, 4.250). For an accepted fraction that doesn't end (2/3), a grid-filling decimal counts (.6666, .6667, 0.666,
 * 0.667, and 16.67 for 50/3), but .666, .67 and .7 do not.
 */
export function matchesAnswer(raw: string, accepted: string[]): boolean {
  const e = parseEntry(raw);
  if (e.kind !== "num") return false;
  return accepted.some((a) => {
    const t = parseEntry(a);
    return t.kind === "num" && (same(e, t) || approximates(e, t) === "ok");
  });
}

/** True when the entry is the right value as a decimal, but longer than the answer grid holds. */
export function tooLongForGrid(raw: string, accepted: string[]): boolean {
  const e = parseEntry(raw);
  if (e.kind !== "num") return false;
  return accepted.some((a) => {
    const t = parseEntry(a);
    return t.kind === "num" && !same(e, t) && approximates(e, t) === "long";
  });
}

export type Grade = { kind: "invalid"; hint: string } | { kind: "right" } | { kind: "wrong"; feedback?: string };

/** Grades a typed entry against a typed quiz. An entry that isn't a number gets a hint and doesn't count as a try. */
export function gradeTyped(q: { answers: string[]; wrong: QuizWrong[] }, raw: string): Grade {
  const e = parseEntry(raw);
  if (e.kind === "mixed") return { kind: "invalid", hint: "The SAT doesn't take mixed numbers like 4 1/4. Enter an improper fraction (17/4) or a decimal (4.25)." };
  if (e.kind === "bad") return { kind: "invalid", hint: "Enter a number, a fraction like 3/4, or a decimal like 0.75." };
  if (matchesAnswer(raw, q.answers)) return { kind: "right" };
  if (tooLongForGrid(raw, q.answers)) return { kind: "invalid", hint: "Too long for the answer grid: use at most 5 characters (6 with a minus sign)." };
  return { kind: "wrong", feedback: q.wrong.find((w) => matchesAnswer(raw, [w.value]))?.feedback };
}

function parseQuiz(lines: string[], where: string, errors: string[]): Interactive {
  const prompt: string[] = [];
  const options: QuizOption[] = [];
  const wrong: QuizWrong[] = [];
  const answers: string[] = [];
  let typed = false;
  const explain: string[] = [];
  const desmos: DesmosMove[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const opt = t.match(/^([-*])\s+(.*)$/);
    const exp = t.match(/^>\s?(.*)$/);
    const dz = t.match(/^~\s+(.*)$/);
    const ans = t.match(/^answer:\s*(.*)$/i);
    if (dz) {
      const mv = parseMove(dz[1], where, errors);
      if (mv) desmos.push(mv);
      else errors.push(`${where}: "~ ${dz[1].slice(0, 30)}" is not a desmos move (${MOVES.join(", ")})`);
    } else if (exp) explain.push(exp[1].trim());
    else if (ans) {
      if (typed) errors.push(`${where}: quiz has two "answer:" lines (put every accepted value on one line, separated by commas)`);
      typed = true;
      for (const v of ans[1].split(",").map((x) => x.trim()).filter(Boolean)) {
        if (parseEntry(v).kind === "num") answers.push(v);
        else errors.push(`${where}: accepted answer "${v.slice(0, 20)}" is not a number, decimal or fraction like 17/4`);
      }
      if (!ans[1].trim()) errors.push(`${where}: "answer:" needs at least one accepted value`);
    } else if (opt) {
      const [text, ...rest] = opt[2].split(/\s+::\s+/);
      const feedback = rest.length ? rest.join(" :: ").trim() : undefined;
      if (typed) {
        // typed quiz: "- 3 :: feedback" is a common wrong value
        if (opt[1] === "*") errors.push(`${where}: a typed quiz lists its right answers on the "answer:" line, not as * options`);
        else if (parseEntry(text).kind !== "num") errors.push(`${where}: wrong value "${text.trim().slice(0, 20)}" is not a number, decimal or fraction`);
        else wrong.push({ value: text.trim(), feedback });
      } else options.push({ text: text.trim(), correct: opt[1] === "*", feedback });
    } else if (options.length || explain.length || typed) errors.push(`${where}: quiz line "${t.slice(0, 40)}" after the options (options start with - or *, explanation with >, Desmos moves with ~)`);
    else prompt.push(t);
  }
  if (!prompt.length) errors.push(`${where}: quiz has no question`);
  if (typed) {
    if (options.length) errors.push(`${where}: a quiz is either multiple choice (- / * options) or typed (an "answer:" line), not both`);
    for (const w of wrong) if (matchesAnswer(w.value, answers)) errors.push(`${where}: wrong value "${w.value}" is also an accepted answer`);
    if (wrong.length > 3) errors.push(`${where}: a typed quiz lists at most 3 common wrong values, has ${wrong.length}`);
  } else {
    if (options.length < 2 || options.length > 4) errors.push(`${where}: quiz needs 2–4 options, has ${options.length}`);
    const right = options.filter((o) => o.correct).length;
    if (right !== 1) errors.push(`${where}: quiz needs exactly one correct (*) option, has ${right}`);
  }
  return { t: "quiz", prompt: prompt.join("\n"), options, answers, wrong, explain, desmos };
}

function parseExample(lines: string[], where: string, errors: string[]): Interactive {
  const prompt: string[] = [];
  let choices: string[] = [];
  const out: ExampleLine[] = [];
  let sawChoices = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const m = t.match(/^\d+\.\s+(.*)$/);
    if (m) {
      const [text, ...rest] = m[1].split(/\s+::\s+/);
      out.push({ text: text.trim(), note: rest.length ? rest.join(" :: ").trim() : undefined });
    } else if (out.length) errors.push(`${where}: example line "${t.slice(0, 40)}" after the numbered lines`);
    else {
      // "Choices: a / b / c": on its own line (canonical) or at the end of the last problem line. Shown as lettered chips.
      const c = t.match(/^(.*?)\s*\bChoices:\s*(.*)$/);
      if (c) {
        if (sawChoices) errors.push(`${where}: example has two "Choices:" lines`);
        sawChoices = true;
        // Canonical: " / " between choices. A plain list of single words ("Choices: fragile, pricey, hardy") also works.
        const sep = /\s+\/\s+/.test(c[2]) ? /\s+\/\s+/ : /^[\w'’-]+(?:,\s*[\w'’-]+)+$/.test(c[2].trim()) ? /,\s*/ : /\s+\/\s+/;
        choices = c[2].split(sep).map((x) => x.trim());
        if (choices.length < 2 || choices.length > 4 || choices.some((x) => !x)) errors.push(`${where}: "Choices:" needs 2–4 choices separated by " / " (got ${choices.length})`);
        if (c[1]) prompt.push(c[1]);
      } else if (sawChoices) errors.push(`${where}: example line "${t.slice(0, 40)}" after "Choices:" (the numbered lines come next)`);
      else prompt.push(t);
    }
  }
  if (!prompt.length) errors.push(`${where}: example has no problem (the lines before "1.")`);
  if (out.length < 2 || out.length > 5) errors.push(`${where}: example needs 2–5 numbered lines, has ${out.length}`);
  return { t: "example", prompt: prompt.join("\n"), choices, lines: out };
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
  type Cur = { title: string; body: string[]; visual: string | null; block: Interactive | null; more: string | null; after: string[] };
  let cur: Cur | null = null;
  const close = () => {
    if (cur) steps.push({ title: cur.title, body: cur.body.join("\n").trim(), visual: cur.visual, block: cur.block, more: cur.more, after: cur.after.join("\n").trim() });
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
      cur = { title: t.replace(/^##\s+/, "").trim(), body: [], visual: null, block: null, more: null, after: [] };
      continue;
    }
    if (!cur) {
      if (!t) continue;
      if (parts.length) parts[parts.length - 1].tagline.push(t);
      else errors.push(`text before the first "# " part or "## " step: "${t.slice(0, 40)}"`);
      continue;
    }
    const fence = t.match(/^```\s*(quiz|check|example|desmos|visual|more)\s*$/);
    if (fence) {
      const kind = fence[1];
      const where = `step "${cur.title}"`;
      const inner: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) inner.push(lines[i++]);
      if (i >= lines.length) errors.push(`${where}: unclosed \`\`\`${kind} block`);
      if (cur.more !== null) errors.push(`${where}: the more block must be the last thing in the step (found a ${kind} block after it)`);
      if (kind === "more") {
        const text = inner.join("\n").trim();
        if (cur.more !== null) errors.push(`${where}: more than one more block`);
        else if (!text) errors.push(`${where}: empty more block`);
        else cur.more = text;
      } else if (kind === "visual") {
        const ids = inner.map((l) => l.trim()).filter(Boolean);
        if (ids.length !== 1) errors.push(`${where}: a visual block holds exactly one id`);
        if (cur.visual !== null) errors.push(`${where}: more than one visual block`);
        else if (cur.block) errors.push(`${where}: put the visual block before the ${cur.block.t} block (the visual is shown first)`);
        else cur.visual = ids[0] ?? "";
      } else {
        let block: Interactive;
        if (kind === "check") {
          const ids = inner.map((l) => l.trim()).filter(Boolean);
          if (ids.length !== 1) errors.push(`${where}: a check block holds exactly one id`);
          block = { t: "check", id: ids[0] ?? "" };
        } else if (kind === "example") block = parseExample(inner, where, errors);
        else if (kind === "desmos") block = parseDesmos(inner, where, errors);
        else block = parseQuiz(inner, where, errors);
        if (cur.block) errors.push(`${where}: more than one block (a step has one example, desmos, quiz or check, plus an optional visual and more)`);
        else {
          if (cur.visual !== null && (block.t === "quiz" || block.t === "check")) errors.push(`${where}: a visual can only be paired with an example or desmos block, not a ${block.t}`);
          cur.block = block;
        }
      }
      continue;
    }
    if (cur.block || cur.visual !== null || cur.more !== null) {
      if (t) cur.after.push(line);
    } else cur.body.push(line);
  }
  close();
  for (const s of steps) if (s.after) errors.push(`step "${s.title}": text after a block; move it above the blocks (a step is its text, then the blocks)`);

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
      words += countWords(b.prompt) + b.choices.reduce((n, c) => n + countWords(c), 0) + b.lines.reduce((n, l) => n + countWords(l.text) + countWords(l.note ?? ""), 0);
    }
    if (b?.t === "desmos" || s.visual) shows++;
    if (s.more) words += countWords(s.more) * 0.1; // optional, so it only counts a little
    if (b?.t === "check") checks++;
  }
  const perCheck = section === "math" ? 1.6 : 1.2;
  return Math.max(2, Math.round(words / 170 + quizzes * 0.35 + shows * 0.3 + checks * perCheck));
}
