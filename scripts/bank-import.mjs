// Imports the question bank from sat_questions.xlsx (+ images) into content/bank/source/*.json
// and public/bank/img/**.webp.
//
// Usage: npm run bank:import -- [path/to/sat_questions]   (default: ~/Desktop/sat_questions)
//
// The source text is kept as-is (plain-text math: ^ exponent, _ subscript, sqrt( ), <u>underline</u>).
// Answers/explanations/classification live separately in content/bank/answers/*.json.

import ExcelJS from "exceljs";
import sharp from "sharp";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(process.argv[2] ?? path.join(os.homedir(), "Desktop", "sat_questions"));
const XLSX = path.join(SRC, "sat_questions.xlsx");
const OUT_JSON = path.join(ROOT, "content", "bank", "source");
const OUT_IMG = path.join(ROOT, "public", "bank", "img");

const cell = (v) => {
  if (v == null) return "";
  if (typeof v === "object") return String(v.text ?? v.result ?? (v.richText ? v.richText.map((r) => r.text).join("") : ""));
  return String(v);
};
const clean = (s) => s.replace(/\r\n/g, "\n").trim();

/** "a | b\n1 | 2" → { headers, rows } (first line may be a caption without "|"). */
function parseTable(text) {
  const lines = clean(text).split("\n").map((l) => l.trim()).filter(Boolean);
  let caption;
  if (lines.length && !lines[0].includes("|")) caption = lines.shift();
  const cells = lines.map((l) => l.split("|").map((c) => c.trim()));
  if (!cells.length) return null;
  return { ...(caption ? { caption } : {}), headers: cells[0], rows: cells.slice(1) };
}

const imgJobs = [];
/** Queue a PNG → WebP conversion; returns the public URL. */
function image(kind, file) {
  if (!file) return undefined;
  const from = path.join(SRC, "images", kind === "rw" ? "english" : "math", file);
  if (!fs.existsSync(from)) {
    console.warn(`  missing image: ${from}`);
    return undefined;
  }
  const name = file.replace(/\.png$/i, ".webp");
  imgJobs.push({ from, to: path.join(OUT_IMG, kind, name) });
  return `/bank/img/${kind}/${name}`;
}

function readSheet(ws) {
  const headers = ws.getRow(1).values.slice(1).map(cell);
  const rows = [];
  ws.eachRow((row, i) => {
    if (i === 1) return;
    const o = {};
    headers.forEach((h, k) => (o[h] = clean(cell(row.values[k + 1]))));
    if (o.id) rows.push(o);
  });
  return rows;
}

const pad = (id) => String(id).padStart(4, "0");
const CHOICE_IMG = "[see choices image]";

function rwQuestion(r) {
  const q = {
    id: `rw-${pad(r.id)}`,
    section: "rw",
    type: "mcq",
    passage: r.passage,
    prompt: r.question,
    choices: { A: r.A, B: r.B, C: r.C, D: r.D },
  };
  if (r.figure_type === "table" && r.figure_text) q.table = parseTable(r.figure_text);
  else if (r.figure_image) q.figure = { src: image("rw", r.figure_image), ...(r.figure_text ? { caption: r.figure_text } : {}) };
  if (r.flags) q.flags = r.flags.split(/[,;]\s*/).filter(Boolean);
  return q;
}

function mathQuestion(r) {
  let prompt = r.question;
  const q = { id: `m-${pad(r.id)}`, section: "math", type: r.type === "grid-in" ? "spr" : "mcq" };
  if (/\[TABLE\]/.test(prompt) && r.table) {
    q.table = parseTable(r.table);
    prompt = prompt.replace(/\[TABLE\]\s*/g, "");
  }
  const hasFigureMark = /\[figure\]/.test(prompt);
  prompt = prompt.replace(/\[figure\]\s*/g, "");
  // Figure: the extracted graph, or (when only marked as [figure]) the full original page image.
  const fig = r.figure_image || (hasFigureMark ? r.question_image : "");
  if (fig) q.figure = { src: image("math", fig), ...(fig === r.question_image ? { fullPage: true } : {}) };
  if (r.question_image) q.sourceImage = fig === r.question_image ? q.figure.src : image("math", r.question_image);
  q.prompt = clean(prompt);
  if (q.type === "mcq") {
    q.choices = { A: r.A, B: r.B, C: r.C, D: r.D };
    if (r.choices_image || Object.values(q.choices).every((c) => c === CHOICE_IMG)) {
      q.choicesImage = image("math", r.choices_image);
      for (const k of Object.keys(q.choices)) if (q.choices[k] === CHOICE_IMG) q.choices[k] = "";
    }
  }
  if (r.flags) q.flags = r.flags.split(/[,;]\s*/).filter(Boolean);
  return q;
}

console.log(`Reading ${XLSX}`);
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(XLSX);
const rw = readSheet(wb.getWorksheet("English")).map(rwQuestion);
const math = readSheet(wb.getWorksheet("Math")).map(mathQuestion);
fs.mkdirSync(OUT_JSON, { recursive: true });
fs.writeFileSync(path.join(OUT_JSON, "rw.json"), JSON.stringify(rw, null, 1) + "\n");
fs.writeFileSync(path.join(OUT_JSON, "math.json"), JSON.stringify(math, null, 1) + "\n");
console.log(`Wrote ${rw.length} R&W and ${math.length} Math questions to content/bank/source/`);

for (const kind of ["rw", "math"]) fs.mkdirSync(path.join(OUT_IMG, kind), { recursive: true });
let done = 0;
for (const job of imgJobs) {
  if (!fs.existsSync(job.to)) await sharp(job.from).webp({ quality: 85 }).toFile(job.to);
  done++;
}
console.log(`Images: ${done} ready in public/bank/img/`);
