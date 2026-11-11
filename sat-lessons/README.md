# SAT lessons

One lesson for every Digital SAT skill (30) plus three strategy lessons, written after a research sweep of official
College Board material, YouTube channels, prep websites, Khan Academy and Reddit threads. Every lesson is our own
writing. Sources are credited at the end of each lesson, and `research/` keeps the notes: the best sources per skill
and what each one teaches.

The files use the same format as `content/lessons/` (the site's /lessons page), so a lesson can be copied there as is.

```
sat-lessons/
  rw/<skill-id>.md          Reading and Writing skills (ids from src/lib/taxonomy.ts)
  math/<skill-id>.md        Math skills
  strategy/<slug>.md        digital-sat-format, pacing-and-guessing, desmos
  research/<group>.md       research notes per group of skills
```

## Lessons

### Start here: test strategy

| Lesson | What you'll learn | Minutes |
|---|---|---|
| [How the Digital SAT Works](strategy/digital-sat-format.md) | Know how the SAT works in 2026: sections, adaptive modules, timing, question order, Bluebook tools, typing math answers, and scoring. | 17 |
| [Pacing and Guessing](strategy/pacing-and-guessing.md) | Use a time plan with checkpoints for each module, skip and come back the smart way, and never leave a question blank. | 16 |
| [Desmos on the Digital SAT](strategy/desmos.md) | Use the built-in Desmos calculator the right way: type without errors, graph, run regressions, use sliders, and know when paper is faster. | 24 |

### Reading and Writing

| Domain | Lesson | Examples | Minutes |
|---|---|---|---|
| Information and Ideas | [Central Ideas and Details](rw/central-ideas.md) | 5 | 23 |
| Information and Ideas | [Command of Evidence: Textual](rw/command-of-evidence-textual.md) | 5 | 20 |
| Information and Ideas | [Command of Evidence: Quantitative](rw/command-of-evidence-quantitative.md) | 5 | 23 |
| Information and Ideas | [Inferences](rw/inferences.md) | 5 | 19 |
| Craft and Structure | [Words in Context](rw/words-in-context.md) | 6 | 34 |
| Craft and Structure | [Text Structure and Purpose](rw/text-structure-purpose.md) | 6 | 24 |
| Craft and Structure | [Cross-Text Connections](rw/cross-text-connections.md) | 5 | 22 |
| Expression of Ideas | [Rhetorical Synthesis](rw/rhetorical-synthesis.md) | 5 | 21 |
| Expression of Ideas | [Transitions](rw/transitions.md) | 6 | 18 |
| Standard English Conventions | [Boundaries](rw/boundaries.md) | 6 | 41 |
| Standard English Conventions | [Form, Structure, and Sense](rw/form-structure-sense.md) | 6 | 38 |

### Math

| Domain | Lesson | Examples | Minutes |
|---|---|---|---|
| Algebra | [Linear equations in one variable](math/linear-equations-one-var.md) | 6 | 21 |
| Algebra | [Linear functions](math/linear-functions.md) | 6 | 20 |
| Algebra | [Linear equations in two variables](math/linear-equations-two-var.md) | 6 | 20 |
| Algebra | [Systems of two linear equations](math/systems-linear.md) | 6 | 24 |
| Algebra | [Linear inequalities](math/linear-inequalities.md) | 6 | 22 |
| Advanced Math | [Nonlinear functions](math/nonlinear-functions.md) | 6 | 26 |
| Advanced Math | [Nonlinear equations and systems](math/nonlinear-equations.md) | 6 | 22 |
| Advanced Math | [Equivalent expressions](math/equivalent-expressions.md) | 6 | 18 |
| Problem-Solving and Data Analysis | [Ratios, rates, proportions, and units](math/ratios-rates.md) | 6 | 20 |
| Problem-Solving and Data Analysis | [Percentages](math/percentages.md) | 6 | 18 |
| Problem-Solving and Data Analysis | [One-variable data](math/one-var-data.md) | 6 | 22 |
| Problem-Solving and Data Analysis | [Two-variable data and scatterplots](math/two-var-data.md) | 5 | 20 |
| Problem-Solving and Data Analysis | [Probability and conditional probability](math/probability.md) | 6 | 19 |
| Problem-Solving and Data Analysis | [Inference from samples and margin of error](math/inference-sample.md) | 5 | 16 |
| Problem-Solving and Data Analysis | [Evaluating statistical claims](math/statistical-claims.md) | 5 | 16 |
| Geometry and Trigonometry | [Area and volume](math/area-volume.md) | 6 | 19 |
| Geometry and Trigonometry | [Lines, angles, and triangles](math/lines-angles-triangles.md) | 6 | 21 |
| Geometry and Trigonometry | [Right triangles and trigonometry](math/right-triangles-trig.md) | 6 | 19 |
| Geometry and Trigonometry | [Circles](math/circles.md) | 6 | 20 |

33 lessons, 179 worked examples, about 112k words; 10 research-notes files.

## How they were made

- On 2026-11-11 ten research agents each took one group of skills. Each one studied how the best teachers explain
  those skills, then wrote the lessons and a research-notes file.
- The lessons and notes cite 494 different pages, and every link was checked on 2026-11-11:
  - College Board: 34 pages and PDFs (assessment framework, question bank, practice-test explanations, Bluebook help)
  - YouTube: 164 videos from more than 50 channels; the most cited are Tutorllini, Settele Tutoring, Scalar Learning,
    Penguin SAT Prep and 3-4-5 Tutoring
  - Khan Academy: 25 pages
  - Reddit: 19 threads
  - 252 pages on 54 other prep sites (Test Ninjas, PrepScholar, The Test Advantage, Varsity Tutors, UWorld,
    The Critical Reader and others)
- Limits of the research: reddit.com blocks automated tools, so threads were read through archive copies or
  second-hand. YouTube transcripts couldn't be reached, so videos were judged by their titles, descriptions and
  chapter lists. Many Khan Academy pages sit behind a bot check.
- All worked examples are original. Math: a script checked every answer and every wrong choice. Reading and Writing:
  a separate agent re-solved every example blind, and examples were fixed wherever it disagreed. Desmos: every input
  was typed key by key into College Board's version of Desmos.

## File format

Frontmatter: simple `key: value` lines only (no lists, no nesting, no quotes).

```
---
title: Words in Context
skill: words-in-context
domain: craft-structure
section: rw
summary: One plain sentence: what you'll be able to do after this lesson.
minutes: 12
---
```

- File name = `<skill>.md`. `skill`, `domain` and `section` match `src/lib/taxonomy.ts`.
  Strategy lessons: `skill: <slug>`, `domain: strategy`, `section: strategy`.
- `title` = the skill name from the taxonomy (strategy lessons: a short plain title).
- `summary` = one sentence, at most 160 characters.
- `minutes` = honest reading time including the examples (about 150 words per minute).

## Skill lessons: `##` sections in this order, no others

```
## What this question looks like
## The method
## Rules and formulas you need
## Worked examples
## Traps to avoid
## Desmos shortcut          (math only, when Desmos genuinely helps; omit otherwise)
## Quick checklist
## Sources
```

- **What this question looks like**: how to recognize it in a few seconds. Give the typical question stems, what is on
  screen, roughly how many questions per test, and the sub-types.
- **The method**: a numbered step-by-step routine a student can follow on every question of this type.
- **Rules and formulas you need**: the facts to know cold. Use `###` sub-headings per sub-type. Tables are welcome.
- **Worked examples**: 3–6 ORIGINAL examples, Digital SAT style, easy → hard, covering the main sub-types.
- **Traps to avoid**: the wrong-answer patterns the test uses. One bullet each: what the trap is and why it's wrong.
- **Desmos shortcut**: how to solve this question type with the built-in Desmos calculator, with exact input in `code`.
- **Quick checklist**: 4–7 short bullets to run through before answering.
- **Sources**: 4–10 bullets `- [Title](https://url) — what it was useful for`, only pages actually opened.

### Worked example format

```
### Example 1: Slope from two points

A line in the xy-plane passes through the points (2, 5) and (6, 17). What is the slope of the line?

- (A) 2
- (B) 3
- (C) 4
- (D) 12

**Solution.** Slope = change in y ÷ change in x = (17 − 5)/(6 − 2) = 12/4 = 3. Choice (D) is only the change in y,
and (A) and (C) come from subtracting in the wrong order or mixing up the coordinates.

**Answer:** (B)
```

- Student-produced response: instead of choices write `*Student-produced response: enter your answer.*` and end with
  `**Answer:** 12` (list every accepted form, e.g. `**Answer:** 3/4 or .75`).
- The site hides everything from the `**Solution.**` paragraph to the next heading behind a "Show solution" button,
  so the whole question (passage, table, stem, choices) goes above it, and the answer line goes last.

## Strategy lessons

Free `##` sections that fit the topic (e.g. "How the test is built", "Scoring", "A pacing plan"), ending with
`## Quick checklist` and `## Sources`. Worked examples are optional; when used, same format as above.

## Markdown subset the site renders

- `##` and `###` headings, paragraphs, `-` bullets, `1.` numbered lists (one level, no nesting)
- `**bold**`, `*italic*`, `` `code` ``, `[links](https://…)` (URLs without spaces or `)`)
- tables with a header row (`| a | b |` + `|---|---|`)
- callouts: a blockquote that starts with a bold label, one paragraph each:
  `> **Tip:** …` (green), `> **Trap:** …` (red), `> **Key idea:** …` / `> **Remember:** …` (orange)
- No HTML, no images, no LaTeX, no nested lists, no `#` title (the page shows the title), no `---` lines in the body.
- Passages are plain paragraphs. A blank is `______` (six underscores) followed by a space or punctuation.
  Label paired texts as `**Text 1**` and `**Text 2**` on their own lines.
- Math is plain text: `−` for minus, `×` for times (never `*`), `÷`, `≤`, `≥`, `≠`, `π`, `θ`, `°`, `√`, `½`.
  Powers: `x²`, `x³` or caret notation, which the site renders as a superscript: `x^5`, `2^(x+1)`, `(1.04)^t`
  (parentheses right after `^` group the exponent and are not shown). Roots: `√x` or `sqrt(x + 3)` (drawn with a bar).
  Subscripts: `x_1`, `y_(n)`. Fractions as `a/b`, with parentheses when needed: `(x + 3)/(x − 2)`.
  `code` is shown exactly as typed, so use it for Desmos input, written key by key the way a student types it:
  `y1~mx1+b`, not `y_1~mx_1+b` (Desmos turns a letter followed by a digit into a subscript by itself, while a typed
  `_` traps everything after it in the subscript). After `/` everything you type goes into the denominator, even a
  closing parenthesis, so write the arrow key as a step ("type `2/3`, press →, then `x+1`") or clear the fraction
  first (`12(y-14)=-5(x-4)`). Every input in these lessons was typed key by key into College Board's Desmos.
- In Reading and Writing lessons never put a letter or digit right after `_` or `^` (it would turn into a subscript
  or superscript).
- Figures can't be drawn: describe them in words ("In right triangle ABC, angle C is 90°, AC = 5 and BC = 12").
  Data goes in tables; describe graphs in words or give their data as a table.

## Rules for authors

- Plain, friendly English that a 16-year-old understands on first read. Many readers are not native speakers:
  short sentences, common words, every term explained the first time.
- Everything is written in our own words. Never copy text, explanations or questions from any source, and never
  reproduce official College Board, Khan Academy or past-paper questions, not even with small changes.
- Check every worked example twice: the correct answer must be right and each wrong choice must be wrong for a reason
  you can state. Math: verify the numbers with a quick script.
