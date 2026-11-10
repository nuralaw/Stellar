# Reviewing guide — practice tests (past papers)

Each test is `content/tests/source/<test-id>.json` (do not edit it). It was imported from an Excel sheet that was
extracted from a TalimSAT PDF, so the text can be garbled. You review **one whole test** and write
`content/tests/answers/<test-id>.json`, then validate with:

```
npm run tests:check -- <test-id>
```

Fix every error it prints and run it again until it says OK.

## Looking at the original PDF

Every question has `page` (its page in the PDF). The page shows the question exactly as printed (math typeset
properly, figures, choices); tests with a key also show "Correct answer" and an explanation (it may continue on the
next page). Render pages to PNG and open them with the Read tool:

```
python scripts/tests-page.py <test-id> <page> [<page> ...]
```

- **Math:** look at the page of **every** math question — the extracted text often loses fractions, roots,
  exponents and absolute-value bars (e.g. `∣4x − 48∣ + 4\n= 6\n8` really is `(|4x − 48| + 4)/8 = 6`).
- **R&W:** the text is usually fine. Look at the page when the question has `images`, a table, a missing
  passage, odd line breaks, or anything that looks wrong.

## Output format

A JSON **array**, one object per question, **in the same order as the source** (`key` order):

```json
[
  {
    "key": "rw1-01",
    "answer": "D",
    "skill": "words-in-context",
    "difficulty": "medium",
    "confidence": "high",
    "explanation": "..."
  },
  {
    "key": "m1-20",
    "answer": "C",
    "skill": "nonlinear-equations",
    "difficulty": "hard",
    "confidence": "high",
    "explanation": "...",
    "fix": { "prompt": "(|4x − 48| + 4)/8 = 6\nWhat is the sum of the solutions to the given equation?" }
  }
]
```

- `key` — copied from the source.
- `answer` — multiple choice: `"A" | "B" | "C" | "D"`. Student-produced response (grid-in): an **array of
  strings** in SAT grid-in form, e.g. `["12"]`, `["2/3", ".6666", ".6667", "0.6667"]`, `["-4.5", "-9/2"]`. Numeric
  equivalents are matched automatically, so one exact value is usually enough; for non-terminating decimals list the
  fraction plus the 4- and 5-character decimal forms.
- `type` — only if the source type is wrong (e.g. source says `"spr"` but the PDF shows A–D choices): `"mcq"` or
  `"spr"`. When you switch to `"mcq"`, give the choices in `fix.choices`.
- `skill` — id from the table below (the domain is derived from it). The source already has a mapped `skill`;
  keep it unless it's clearly wrong (e.g. "Command of Evidence" with a graph/table → `command-of-evidence-quantitative`).
- `difficulty` — `"easy" | "medium" | "hard"`, judged against real SAT difficulty.
- `confidence` — how sure you are of the **answer**:
  `"high"` = verified (the PDF's printed answer agrees with your own solution, or math checked by computation);
  `"medium"` = solid reasoning, small doubt; `"low"` = garbled/unreadable or genuinely unsure (add a `note`).
- `explanation` — see style below.
- `fix` — corrected text, only when the source text is wrong or garbled: any of `passage`, `prompt`,
  `choices` (any of A–D), `table`. Give the **whole** corrected field, not a diff.
- `figure` / `choiceImages` — see "Figures".
- `note` — short reason, for anything a human should look at (low confidence, PDF answer you disagree with, …).

### The answer

- Source field `answer` + `answerConfidence`: `"from file"` = printed in the PDF; `"high"/"medium"/"low"` = the
  PDF had **no** key and it was solved by a model — re-solve those yourself carefully.
- Always solve the question yourself. If you disagree with the printed answer, re-check twice; if you are still sure,
  use your answer, `confidence: "medium"` and a `note` ("PDF says B; B fails because …").
- Source `type: "spr"` with a letter answer means the choices were lost — set `type: "mcq"` and give `fix.choices`
  from the PDF page.

### Text fixes (notation)

Use the site's plain-text notation — **no LaTeX, no `$…$`** (`$` means dollars):

| Meaning | Write |
|---|---|
| exponent | `x^2`, `x^(n+1)`, `2^(x/3)` |
| subscript | `x_1`, `a_(n)` |
| fraction | `a/b`, `(x + 1)/(x − 3)` — parenthesize multi-term parts |
| root | `sqrt(x)`, `sqrt(2x + 1)`, `cbrt(x)`, `root[4](x)` |
| absolute value | `|4x − 48|` |
| multiply | `·` or `×` as printed |
| minus | `−` (as printed) or `-` |
| ≤ ≥ ≠ π θ ° | keep the symbols |

- Equations shown on their own line stay on their own line (`\n`), then the question.
- R&W: `passage` is the text; `prompt` is the question line ("Which choice most logically completes the text?").
  If the source has the passage glued into the prompt (no `passage`), fix both. Keep paragraph breaks (`\n\n`),
  "Text 1"/"Text 2" headings on their own line, and bullet notes as lines starting with `• `.
  Underlined text in the PDF → `<u>…</u>`.
- Tables (when the table is text, not an image): `"table": { "caption": "optional", "headers": ["x", "y"], "rows": [["1", "3"], ["2", "5"]] }`.
- Don't rewrite text that is already correct; only fix what is wrong.

## Figures

`images` lists the pictures extracted from the question's PDF page, in reading order (1-based): `{src, w, h, y}`.
Open them with Read: `public<src>` (e.g. `public/tests/img/2024-05-int-a/m1-05-1.webp`).

- One image that is the question's graph/table/diagram → nothing to do (it's shown above the question by default).
- If the image is **not** part of the question (decoration), set `"figure": 0`.
- Several images: `"figure": n` = the one shown with the question (or 0 for none), and if the **choices** are
  pictures: `"choiceImages": { "A": 2, "B": 3, "C": 4, "D": 5 }` (then `fix.choices` may be empty strings).
- A figure that exists in the PDF but has no extracted image (e.g. drawn as vector, or a text table): describe a text
  table with `fix.table`; otherwise `confidence` per your answer and `note: "figure missing"`.

## Explanation style

- 2–5 sentences, plain English, for a high-school student, **your own wording** (don't copy the PDF's explanation).
- Start with *why the correct answer is right* (the key step or the evidence in the text), then briefly why the
  most tempting wrong choice fails.
- Math: show the key steps in the plain-text notation above.
- Don't mention "the answer key", "the PDF", TalimSAT or the College Board; don't paste the passage back.

## Taxonomy ids

| Section | domain | skills |
|---|---|---|
| rw | `information-ideas` | `central-ideas`, `command-of-evidence-textual`, `command-of-evidence-quantitative`, `inferences` |
| rw | `craft-structure` | `words-in-context`, `text-structure-purpose`, `cross-text-connections` |
| rw | `expression-ideas` | `rhetorical-synthesis`, `transitions` |
| rw | `conventions` | `boundaries`, `form-structure-sense` |
| math | `algebra` | `linear-equations-one-var`, `linear-functions`, `linear-equations-two-var`, `systems-linear`, `linear-inequalities` |
| math | `advanced-math` | `nonlinear-functions`, `nonlinear-equations`, `equivalent-expressions` |
| math | `problem-solving` | `ratios-rates`, `percentages`, `one-var-data`, `two-var-data`, `probability`, `inference-sample`, `statistical-claims` |
| math | `geometry-trig` | `area-volume`, `lines-angles-triangles`, `right-triangles-trig`, `circles` |

## Working tips

- Write the file in chunks if you like (e.g. R&W module 1 first), but the final file must contain every question.
- Keep the PNGs you rendered in `content/tests/.work/` (ignored by git); don't create files anywhere else.
