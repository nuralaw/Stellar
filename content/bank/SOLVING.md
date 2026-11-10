# Solving guide — answers for the Stellar question bank

Source questions: `content/bank/source/rw.json` and `content/bank/source/math.json` (do not edit them).
You write answers to `content/bank/answers/<file>.json` and validate with `npm run bank:check -- <file>`.

## Output format

A JSON **array**, one object per question, in id order:

```json
[
  {
    "id": "m-0019",
    "answer": "B",
    "domain": "algebra",
    "skill": "linear-functions",
    "difficulty": "hard",
    "confidence": "high",
    "explanation": "..."
  }
]
```

- `answer` — multiple choice (`"type": "mcq"`): one of `"A" | "B" | "C" | "D"`.
  Grid-in (`"type": "spr"`): an **array of strings**, each a number in SAT grid-in form, e.g. `["12"]`, `["2/3", ".6666", ".6667", "0.6667"]`, `["-4.5", "-9/2"]`. Any listed value is accepted; numeric equivalents (3/4 = .75) are matched automatically, so one exact value is usually enough. For non-terminating decimals list the fraction plus the 4- and 5-character decimal forms.
- `domain` / `skill` — ids from the table below. The skill must belong to the domain.
- `difficulty` — `"easy" | "medium" | "hard"`, judged against real SAT difficulty.
- `confidence` — `"high"` (verified, e.g. math checked by substitution or computation), `"medium"` (solid reasoning, small doubt), `"low"` (unclear figure/garbled text/genuinely unsure). Low-confidence answers are held back from the live site for human review, so be honest.
- `explanation` — see style below.

## Taxonomy ids

| Section | domain | skills |
|---|---|---|
| rw | `information-ideas` | `central-ideas`, `command-of-evidence-textual`, `command-of-evidence-quantitative`, `inferences` |
| rw | `craft-structure` | `words-in-context`, `text-structure-purpose`, `cross-text-connections` |
| rw | `expression-ideas` | `rhetorical-synthesis`, `transitions` |
| rw | `conventions` | `boundaries` (punctuation between clauses/phrases), `form-structure-sense` (agreement, verb forms, pronouns, modifiers, possessives) |
| math | `algebra` | `linear-equations-one-var`, `linear-functions`, `linear-equations-two-var`, `systems-linear`, `linear-inequalities` |
| math | `advanced-math` | `nonlinear-functions`, `nonlinear-equations`, `equivalent-expressions` |
| math | `problem-solving` | `ratios-rates`, `percentages`, `one-var-data`, `two-var-data`, `probability`, `inference-sample`, `statistical-claims` |
| math | `geometry-trig` | `area-volume`, `lines-angles-triangles`, `right-triangles-trig`, `circles` |

Hints: "Which choice most logically completes the text?" → usually `inferences`. "...uses relevant information from the notes" → `rhetorical-synthesis`. Graph/table + claim → `command-of-evidence-quantitative`. "most strongly support/weaken the claim" (text only) → `command-of-evidence-textual`. Text 1 / Text 2 → `cross-text-connections`. Blank + "logical transition" → `transitions`.

## Explanation style

- 2–5 sentences, plain English, written for a high-school student. Original wording.
- Start with *why the correct answer is right* (the key step or the evidence in the text), then briefly say why the most tempting wrong choice fails.
- Math: show the key steps. Use the **same plain-text notation as the questions**: `x^2`, `(x+1)^(1/2)`, `x_1`, `sqrt(x)`, `a/b`, `·`. Do **not** use LaTeX or `$…$` for math (a `$` means dollars).
- Don't refer to "the answer key" or "the College Board"; don't paste the passage back.

## Questions with figures

Fields `figure.src`, `choicesImage`, `sourceImage` point to `/bank/img/<rw|math>/<name>.webp`. To look at a figure, open the original PNG (same base name) with the Read tool:

- R&W: `C:\Users\Nurali\Desktop\sat_questions\images\english\<name>.png`
- Math: `C:\Users\Nurali\Desktop\sat_questions\images\math\<name>.png`

`figure.fullPage: true` means the figure is only available as the full original page image. Questions flagged `formulas_read_from_image` had formulas transcribed from an image — if the text looks garbled, check `sourceImage` and solve from the image. If you still can't determine the answer, use `confidence: "low"`.

R&W `<u>…</u>` marks underlined text. Tables are in `table`.
