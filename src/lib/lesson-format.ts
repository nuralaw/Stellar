// Lesson file format v2 (content/lessons/README.md, spec docs/lessons-v2.md): frontmatter, then subtopics.
// A subtopic is "# title", a tagline, one ```visual, "## Key ideas" (Markdown, with an optional ```example and/or
// ```desmos block, then one ```theory block), and "## Easy" / "## Medium" / "## Hard" with one ```task each.
// A task is a bank question ("bank: m-1234") or an own question (the quiz syntax), plus `highlight:` and `explain:`.
// Shared by the site (lib/lessons.ts) and scripts/lessons-check.mjs, so it has no imports and only
// type-strippable TypeScript.

export interface QuizOption {
  text: string;
  correct: boolean;
  /** Shown when this option is picked. */
  feedback?: string;
}

/** A typed-answer question: a common wrong value and what it means (shown when the student enters it). */
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

/** A worked example (```example): the problem, optional R&W answer choices, and 2–5 numbered lines. */
export interface ExampleBlock {
  prompt: string;
  /** An R&W example's answer choices ("Choices: a / b / c"), shown as lettered chips; empty for math. */
  choices: string[];
  lines: ExampleLine[];
}

/** A Desmos walkthrough (```desmos): the problem line(s), then the moves. */
export interface DesmosBlock {
  prompt: string;
  moves: DesmosMove[];
}

/** An own question (v1 quiz syntax). Multiple choice: `options` (exactly one correct). Typed answer: `answers` + `wrong`, `options` empty. */
export interface OwnQuestion {
  /** Markdown with \( \) formulas; lines joined with "\n". */
  prompt: string;
  options: QuizOption[];
  /** Typed answer: the accepted values ("4", "-2.5", "17/4"). Empty for multiple choice. */
  answers: string[];
  /** Typed answer: common wrong values with feedback (0–3). */
  wrong: QuizWrong[];
  /** Optional "~" lines: the fast way in Desmos, played after a wrong answer (math only). */
  desmos: DesmosMove[];
}

/**
 * One key phrase of a task. After the 2nd wrong answer the player lights the phrases up in the prompt/passage one by
 * one, each with its note. `phrase` is an exact substring of the task's prompt or passage text as stored (for own
 * questions: the Markdown source of `prompt`, formulas included; for bank questions: the bank's `passage` or `prompt`).
 */
export interface Highlight {
  phrase: string;
  /** Markdown (formulas allowed), ≤ 20 words. */
  note: string;
}

export type TaskLevel = "easy" | "medium" | "hard";
export const LEVELS: TaskLevel[] = ["easy", "medium", "hard"];

interface TaskBase {
  /** The slot the task sits in ("## Easy" / "## Medium" / "## Hard"). */
  level: TaskLevel;
  /** 2–5 key phrases, in reasoning order. */
  highlights: Highlight[];
  /** The full step-by-step explanation (Markdown, ends with the answer): shown by "Still confused?" / "See why". */
  explain: string;
}

/** A question from the bank (content/bank/dist/questions.json), by id. Load it with lessonQuestions(). */
export interface BankTask extends TaskBase {
  kind: "bank";
  id: string;
}

/** An own SAT-style question written in the lesson file. */
export interface OwnTask extends TaskBase {
  kind: "own";
  question: OwnQuestion;
}

export type Task = BankTask | OwnTask;

/**
 * One subtopic = one Learn screen + three task screens (Easy, Medium, Hard).
 * A lesson with no format errors has all fields filled and `tasks.length === 3` in the order easy, medium, hard
 * (with errors, missing pieces are "" / null / left out; the checker reports them).
 */
export interface Subtopic {
  title: string;
  /** One line under the title (the overview list and the Learn screen header). */
  tagline: string;
  /** Id of the animation in src/components/lessons/visuals/ (rendered by lessonVisual(id)). */
  visual: string;
  /** "## Key ideas": Markdown text (paragraphs, bullets, display formulas, small tables), without the blocks below. */
  keyIdeas: string;
  /** The optional worked example shown under the key ideas. */
  example: ExampleBlock | null;
  /** The optional Desmos walkthrough shown under the key ideas (after the example if both exist). */
  desmos: DesmosBlock | null;
  /** The ```theory text (Markdown): what the "Not sure?" island opens. */
  theory: string;
  /** Easy, Medium, Hard. */
  tasks: Task[];
}

export interface ParsedLesson {
  /** Frontmatter: title, skill, domain, section, summary, optional also-skills. */
  meta: Record<string, string>;
  subtopics: Subtopic[];
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


/** Reads one quiz-syntax question (the prompt lines, then options or an "answer:" line, then optional "~" lines). */
function parseQuestion(lines: string[], where: string, errors: string[]): OwnQuestion {
  const prompt: string[] = [];
  const options: QuizOption[] = [];
  const wrong: QuizWrong[] = [];
  const answers: string[] = [];
  let typed = false;
  let sawOption = false;
  const desmos: DesmosMove[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const opt = t.match(/^([-*])\s+(.*)$/);
    const dz = t.match(/^~\s+(.*)$/);
    const ans = t.match(/^answer:\s*(.*)$/i);
    if (/^>/.test(t)) errors.push(`${where}: no ">" explanation line in a task (write the explanation in the explain: part)`);
    else if (dz) {
      const mv = parseMove(dz[1], where, errors);
      if (mv) desmos.push(mv);
      else errors.push(`${where}: "~ ${dz[1].slice(0, 30)}" is not a desmos move (${MOVES.join(", ")})`);
    } else if (ans) {
      if (typed) errors.push(`${where}: question has two "answer:" lines (put every accepted value on one line, separated by commas)`);
      typed = true;
      for (const v of ans[1].split(",").map((x) => x.trim()).filter(Boolean)) {
        if (parseEntry(v).kind === "num") answers.push(v);
        else errors.push(`${where}: accepted answer "${v.slice(0, 20)}" is not a number, decimal or fraction like 17/4`);
      }
      if (!ans[1].trim()) errors.push(`${where}: "answer:" needs at least one accepted value`);
    } else if (opt) {
      sawOption = true;
      const [text, ...rest] = opt[2].split(/\s+::\s+/);
      const feedback = rest.length ? rest.join(" :: ").trim() : undefined;
      if (typed) {
        // typed answer: "- 3 :: feedback" is a common wrong value
        if (opt[1] === "*") errors.push(`${where}: a typed question lists its right answers on the "answer:" line, not as * options`);
        else if (parseEntry(text).kind !== "num") errors.push(`${where}: wrong value "${text.trim().slice(0, 20)}" is not a number, decimal or fraction`);
        else wrong.push({ value: text.trim(), feedback });
      } else options.push({ text: text.trim(), correct: opt[1] === "*", feedback });
    } else if (sawOption || typed || desmos.length) errors.push(`${where}: line "${t.slice(0, 40)}" after the options (options start with - or *, Desmos moves with ~)`);
    else prompt.push(t);
  }
  if (!prompt.length) errors.push(`${where}: question has no prompt`);
  if (typed) {
    if (options.length) errors.push(`${where}: a question is either multiple choice (- / * options) or typed (an "answer:" line), not both`);
    for (const w of wrong) if (matchesAnswer(w.value, answers)) errors.push(`${where}: wrong value "${w.value}" is also an accepted answer`);
    if (wrong.length > 3) errors.push(`${where}: a typed question lists at most 3 common wrong values, has ${wrong.length}`);
  } else {
    if (options.length < 2 || options.length > 4) errors.push(`${where}: question needs 2–4 options, has ${options.length}`);
    const right = options.filter((o) => o.correct).length;
    if (right !== 1) errors.push(`${where}: question needs exactly one correct (*) option, has ${right}`);
  }
  return { prompt: prompt.join("\n"), options, answers, wrong, desmos };
}

function parseExample(lines: string[], where: string, errors: string[]): ExampleBlock {
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
  return { prompt: prompt.join("\n"), choices, lines: out };
}

function parseDesmos(lines: string[], where: string, errors: string[]): DesmosBlock {
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
  return { prompt: prompt.join("\n"), moves };
}

/** The inside of a ```task block: "bank: <id>" or a quiz-syntax question, then "highlight:" lines, then "explain:" to the end. */
function parseTask(lines: string[], level: TaskLevel, where: string, errors: string[]): Task {
  const e = lines.findIndex((l) => /^\s*explain:/i.test(l));
  const head = e < 0 ? lines : lines.slice(0, e);
  const explain = e < 0 ? "" : [lines[e].replace(/^\s*explain:\s*/i, ""), ...lines.slice(e + 1)].join("\n").trim();
  if (e < 0) errors.push(`${where}: no explain: part (the full step-by-step explanation, to the end of the task block)`);
  else if (!explain) errors.push(`${where}: explain: is empty`);

  const h = head.findIndex((l) => /^\s*highlight:\s*$/i.test(l));
  const questionLines = h < 0 ? head : head.slice(0, h);
  const highlights: Highlight[] = [];
  if (h < 0) errors.push(`${where}: no highlight: part (2–5 lines: - "phrase" :: note), and it comes before explain:`);
  else
    for (const line of head.slice(h + 1)) {
      const t = line.trim();
      if (!t) continue;
      const m = t.match(/^-\s+"(.+?)"\s+::\s+(.+)$/);
      if (m) highlights.push({ phrase: m[1], note: m[2].trim() });
      else errors.push(`${where}: highlight line "${t.slice(0, 40)}" must look like - "exact phrase" :: note`);
    }

  const bank = questionLines.find((l) => l.trim())?.trim().match(/^bank:\s*(.*)$/i);
  if (bank) {
    const id = bank[1].trim();
    if (!/^[\w-]+$/.test(id)) errors.push(`${where}: bank: needs one question id (like m-1234)`);
    const extra = questionLines.filter((l) => l.trim()).slice(1);
    if (extra.length) errors.push(`${where}: a bank task has only the bank: line, then highlight: and explain: (found "${extra[0].trim().slice(0, 30)}")`);
    return { kind: "bank", level, id, highlights, explain };
  }
  return { kind: "own", level, question: parseQuestion(questionLines, where, errors), highlights, explain };
}

const SECTION_TITLES: Record<string, "key" | TaskLevel> = { "key ideas": "key", easy: "easy", medium: "medium", hard: "hard" };
const FENCES = ["visual", "theory", "example", "desmos", "task"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

interface Draft {
  title: string;
  tagline: string[];
  visual: string | null;
  key: string[];
  example: ExampleBlock | null;
  desmos: DesmosBlock | null;
  theory: string | null;
  tasks: Partial<Record<TaskLevel, Task>>;
  /** Sections seen so far, in order. */
  seen: ("key" | TaskLevel)[];
  /** Key ideas text may not follow a block. */
  keyBlock: boolean;
}

export function parseLesson(raw: string): ParsedLesson | null {
  const fm = parseFrontmatter(raw);
  if (!fm) return null;
  const errors: string[] = [];
  const lines = fm.body.split("\n");
  const subtopics: Subtopic[] = [];
  let cur: Draft | null = null;
  let sec: "head" | "key" | TaskLevel = "head";

  const close = () => {
    const d = cur;
    if (!d) return;
    const where = `subtopic "${d.title}"`;
    if (!d.tagline.length) errors.push(`${where}: no tagline (one line under the "# " title)`);
    if (d.visual === null) errors.push(`${where}: no \`\`\`visual block (every subtopic has one animation)`);
    if (!d.seen.includes("key")) errors.push(`${where}: no "## Key ideas"`);
    else if (!d.key.join("").trim()) errors.push(`${where}: "## Key ideas" has no text`);
    if (d.theory === null) errors.push(`${where}: no \`\`\`theory block (in "## Key ideas", after the text)`);
    for (const lv of LEVELS) if (!d.tasks[lv]) errors.push(`${where}: no "## ${cap(lv)}" task`);
    subtopics.push({
      title: d.title,
      tagline: d.tagline.join(" ").trim(),
      visual: d.visual ?? "",
      keyIdeas: d.key.join("\n").trim(),
      example: d.example,
      desmos: d.desmos,
      theory: d.theory ?? "",
      tasks: LEVELS.flatMap((lv) => (d.tasks[lv] ? [d.tasks[lv]] : [])),
    });
    cur = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    const fence = t.match(/^```\s*(\w+)?\s*$/);
    if (fence) {
      const kind = fence[1] ?? "";
      const inner: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) inner.push(lines[i++]);
      const d = cur as Draft | null;
      if (!d) {
        errors.push(`\`\`\`${kind} block before the first "# " subtopic`);
        continue;
      }
      const where = `subtopic "${d.title}"`;
      if (i >= lines.length) errors.push(`${where}: unclosed \`\`\`${kind} block`);
      if (!FENCES.includes(kind)) {
        errors.push(`${where}: unknown block \`\`\`${kind || "(none)"} (use ${FENCES.join(", ")})`);
        continue;
      }
      if (kind === "visual") {
        const ids = inner.map((l) => l.trim()).filter(Boolean);
        if (ids.length !== 1) errors.push(`${where}: a visual block holds exactly one id`);
        if (sec !== "head") errors.push(`${where}: the visual block goes under the tagline, before "## Key ideas"`);
        if (d.visual !== null) errors.push(`${where}: more than one visual block`);
        else d.visual = ids[0] ?? "";
      } else if (kind === "task") {
        if (sec === "head" || sec === "key") {
          errors.push(`${where}: a task block belongs under "## Easy", "## Medium" or "## Hard"`);
          continue;
        }
        const label = `${where} · ${cap(sec)} task`;
        if (d.tasks[sec]) errors.push(`${label}: more than one task block`);
        else d.tasks[sec] = parseTask(inner, sec, label, errors);
      } else {
        if (sec !== "key") {
          errors.push(`${where}: a ${kind} block belongs in "## Key ideas"`);
          continue;
        }
        d.keyBlock = true;
        if (kind === "theory") {
          const text = inner.join("\n").trim();
          if (d.theory !== null) errors.push(`${where}: more than one theory block`);
          else if (!text) errors.push(`${where}: empty theory block`);
          else d.theory = text;
        } else if (kind === "example") {
          if (d.theory !== null) errors.push(`${where}: the example block goes above the theory block`);
          if (d.example) errors.push(`${where}: more than one example block`);
          else d.example = parseExample(inner, where, errors);
        } else {
          if (d.theory !== null) errors.push(`${where}: the desmos block goes above the theory block`);
          if (d.desmos) errors.push(`${where}: more than one desmos block`);
          else d.desmos = parseDesmos(inner, where, errors);
        }
      }
      continue;
    }
    if (/^#\s/.test(t)) {
      close();
      cur = { title: t.replace(/^#\s+/, "").trim(), tagline: [], visual: null, key: [], example: null, desmos: null, theory: null, tasks: {}, seen: [], keyBlock: false };
      sec = "head";
      continue;
    }
    if (/^##\s/.test(t)) {
      const name = t.replace(/^##\s+/, "").trim();
      const kind = SECTION_TITLES[name.toLowerCase()];
      const d = cur as Draft | null;
      if (!d) errors.push(`"## ${name}" before the first "# " subtopic`);
      else if (!kind) errors.push(`subtopic "${d.title}": unknown section "## ${name}" (use Key ideas, Easy, Medium, Hard)`);
      else {
        const want = (["key", ...LEVELS] as const)[d.seen.length];
        if (d.seen.includes(kind)) errors.push(`subtopic "${d.title}": "## ${name}" appears twice`);
        else if (kind !== want) errors.push(`subtopic "${d.title}": sections must come in the order Key ideas, Easy, Medium, Hard ("## ${name}" is out of order)`);
        d.seen.push(kind);
        sec = kind;
      }
      continue;
    }
    const d = cur as Draft | null;
    if (!t) {
      if (d && sec === "key") d.key.push(line);
      continue;
    }
    if (!d) errors.push(`text before the first "# " subtopic: "${t.slice(0, 40)}"`);
    else if (sec === "head") d.tagline.push(t);
    else if (sec === "key") {
      if (d.keyBlock) errors.push(`subtopic "${d.title}": text after a block; put all the Key ideas text above the example, desmos and theory blocks ("${t.slice(0, 30)}")`);
      d.key.push(line);
    } else errors.push(`subtopic "${d.title}": text under "## ${cap(sec)}" outside the task block ("${t.slice(0, 30)}")`);
  }
  close();
  if (!subtopics.length) errors.push('no subtopics (each starts with "# title")');
  return { meta: fm.meta, subtopics, errors };
}
/**
 * One pass over lesson text: a `code span` (no group matched: it is kept as it is), a formula \( … \) (group 1, inline)
 * or \[ … \] (group 2, display), on one line. Rendered with KaTeX, see components/lessons/Markdown.tsx.
 */
export const TOKEN_RE = /`[^`]+`|\\\((.+?)\\\)|\\\[(.+?)\\\]/g;

/** Rough word count of Markdown prose (tables and markup ignored as symbols). A whole formula counts as one word. */
export function countWords(md: string): number {
  return md
    .replace(TOKEN_RE, (m, a, b) => (a === undefined && b === undefined ? m : " F "))
    .replace(/[|*`#>_[\]()-]+/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

/**
 * Honest time estimate: reading the tagline, key ideas and example (theory is optional, counted a little), watching
 * the visual, answering the three tasks.
 */
export function estimateMinutes(subtopics: Subtopic[], section: string): number {
  const taskMinutes: Record<TaskLevel, number> = { easy: 0.5, medium: 0.9, hard: 1.4 };
  const k = section === "math" ? 1.2 : 1;
  let words = 0;
  let minutes = 0;
  for (const s of subtopics) {
    words += countWords(s.tagline) + countWords(s.keyIdeas);
    if (s.example) words += countWords(s.example.prompt) + s.example.lines.reduce((n, l) => n + countWords(l.text) + countWords(l.note ?? ""), 0);
    if (s.desmos) words += countWords(s.desmos.prompt) + 20;
    words += countWords(s.theory) * 0.15;
    minutes += 0.3; // the visual
    for (const t of s.tasks) minutes += taskMinutes[t.level] * k;
  }
  return Math.max(2, Math.round(words / 170 + minutes));
}

/* ---------------- highlights: where a task's key phrases sit ---------------- */
// One rule for the player (components/lessons/v2/highlight.ts) and the checker (scripts/lessons-check.mjs).

/**
 * Where a task's key phrases sit in its texts (the passage and/or prompt, as stored: for bank questions the question's
 * own text, for own questions the Markdown source). The match is on the RAW text, before anything is rendered, so a
 * phrase may contain a formula `\( … \)`; the pieces are rendered afterwards one by one.
 */
export interface Placement {
  /** Which text (index into the `texts` given to locate()) the phrase is in. */
  text: number;
  start: number;
  end: number;
  /** The highlight's number in the task's list (0-based, authoring order). */
  highlight: number;
}

export interface Located {
  /** Found phrases in the author's order (hint i = placements[i]). */
  placements: Placement[];
  /** Highlights that could not be placed, with why (the player logs them and skips them; the checker errors). */
  problems: string[];
}

/** Ranges a split must not cut through: formulas, code spans, **bold** and *italic* runs, bank math notation. */
export function protectedRanges(text: string): [number, number][] {
  const out: [number, number][] = [];
  for (const m of text.matchAll(TOKEN_RE)) out.push([m.index, m.index + m[0].length]);
  for (const m of text.matchAll(/\*\*(?:[^*]|\*(?!\*))+\*\*|\*[^*\s][^*]*\*/g)) out.push([m.index, m.index + m[0].length]);
  // The bank's plain math notation: x^2, (x - 1)^(1/2), sqrt(3), x_1 (a run of underscores is a blank, not a subscript).
  for (const m of text.matchAll(/[A-Za-z0-9)]\^(?:\((?:[^()]|\([^()]*\))*\)|-?\w+)|\b(?:sqrt|cbrt)\((?:[^()]|\([^()]*\))*\)|[A-Za-z0-9)]_(?!_)(?:\((?:[^()]|\([^()]*\))*\)|\w+)/g)) out.push([m.index, m.index + m[0].length]);
  return out;
}

/**
 * Why [s, e) of `text` is not a clean place to cut, or null. A cut must not go through a protected range (overlap it
 * without covering it whole), and, for the bank's plain notation (`x^(1/2)`, `sqrt(3)`, `x_1`), must not end on `^` or `_`,
 * start right after one, or leave a `(` open.
 */
function cutReason(text: string, s: number, e: number, ranges: [number, number][]): string | null {
  if (ranges.some(([a, b]) => s < b && e > a && !(s <= a && e >= b))) return "starts or ends inside a formula, `code` or **bold**/*italic* run";
  const phrase = text.slice(s, e);
  // (a run of underscores, like the blank "______" in R&W text, is not a subscript mark)
  const sub = (i: number) => text[i] === "^" || (text[i] === "_" && text[i - 1] !== "_" && text[i + 1] !== "_");
  if ((e > s && sub(e - 1)) || (s > 0 && sub(s - 1))) return "cuts a ^ or _ off from its exponent or subscript";
  if ((phrase.match(/\(/g) ?? []).length > (phrase.match(/\)/g) ?? []).length) return "leaves a ( open";
  return null;
}

/** Places each highlight in the first text where it fits (not cutting anything, not overlapping an earlier one). */
export function locate(texts: string[], highlights: Highlight[]): Located {
  const ranges = texts.map(protectedRanges);
  const placements: Placement[] = [];
  const problems: string[] = [];
  highlights.forEach((h, highlight) => {
    if (!h.phrase) return;
    let reason = "not found in the task text";
    for (let t = 0; t < texts.length; t++) {
      for (let at = texts[t].indexOf(h.phrase); at >= 0; at = texts[t].indexOf(h.phrase, at + 1)) {
        const end = at + h.phrase.length;
        const cut = cutReason(texts[t], at, end, ranges[t]);
        if (cut) reason = cut;
        else if (placements.some((p) => p.text === t && at < p.end && end > p.start)) reason = "overlaps another highlight";
        else {
          placements.push({ text: t, start: at, end, highlight });
          return;
        }
      }
    }
    problems.push(`highlight "${h.phrase}": ${reason}`);
  });
  return { placements, problems };
}
