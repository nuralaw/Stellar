// Repairs PDF-extraction artifacts in question text. Applied by bank-build and tests-build when the site's data is
// built, so the imported source files stay untouched (a re-import gets the same repairs).
//
//   "long- term" → "long-term"    a space after a compound hyphen (kept: "short- and long-term", "first- or second-")
//   "2008– 2011" → "2008–2011"    a space after an en dash between numbers
//   "Bendire’ s" → "Bendire’s"    a space before a possessive s
//   "T otal" → "Total" …          letters split by kerning (listed one by one)

const SPLIT = [
  ["T otal", "Total"],
  ["T orre", "Torre"],
  ["T otozoquean", "Totozoquean"],
  ["T -ReCS", "T-ReCS"],
  ["VL T", "VLT"],
  ["surface area 2 (cm )", "surface area (cm²)"],
];

// Words the text cites as prefixes ("the mim- root", "the affix meng-"): their hyphen really ends the word.
const AFFIXES = new Set(["mim", "meng"]);

export function cleanText(s) {
  if (typeof s !== "string") return s;
  let t = s;
  for (const [from, to] of SPLIT) t = t.split(from).join(to);
  t = t.replace(/(\d)– (\d)/g, "$1–$2");
  t = t.replace(/(\w)’ s\b/g, "$1’s");
  t = t.replace(/([A-Za-z]+)- (?!(?:and|or|nor|to)\b)(?=[a-z])/g, (m, word) => (AFFIXES.has(word.toLowerCase()) ? m : `${word}-`));
  return t;
}

/** The question with its text fields cleaned (passage, prompt, choices, table). */
export function cleanQuestion(q) {
  const out = { ...q };
  if (q.passage) out.passage = cleanText(q.passage);
  if (q.prompt) out.prompt = cleanText(q.prompt);
  if (q.choices) out.choices = Object.fromEntries(Object.entries(q.choices).map(([k, v]) => [k, cleanText(v)]));
  if (q.table)
    out.table = {
      ...q.table,
      ...(q.table.caption ? { caption: cleanText(q.table.caption) } : {}),
      headers: q.table.headers.map(cleanText),
      rows: q.table.rows.map((r) => r.map(cleanText)),
    };
  return out;
}
