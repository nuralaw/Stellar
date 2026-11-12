# Lessons

One lesson per Digital SAT skill (30) plus three strategy lessons. The site plays a lesson as a series of short
**steps**, one per screen: a little teaching, then a check. The student answers, sees why, and taps Continue.
Real SAT questions from our bank close every skill lesson.

```
content/lessons/
  rw/<skill-id>.md         Reading and Writing skills (ids from src/lib/taxonomy.ts)
  math/<skill-id>.md       Math skills
  strategy/<slug>.md       digital-sat-format, pacing-and-guessing, desmos
```

Tools:

```
npm run lessons:questions -- <skill-id>            candidate bank questions for a skill, by difficulty
npm run lessons:questions -- --show <id> [<id>…]   full text, choices, answer and explanation
npm run lessons:check -- [file…]                   validate lessons (all of them without arguments)
```

## File format

Frontmatter: simple `key: value` lines only.

```
---
title: Words in Context
skill: words-in-context
domain: craft-structure
section: rw
summary: Pick the word that fits the sentence's exact meaning, not just its topic.
---
```

- `skill` / `domain` / `section` must match `src/lib/taxonomy.ts`. Strategy lessons: `skill: <slug>`,
  `domain: strategy`, `section: strategy`.
- `summary` ≤ 140 characters, one sentence: what the student can do after the lesson.
- `also-skills: <skill-id>` (optional): only when the bank has too few questions of this skill, a closely related
  skill whose questions the `check` blocks may also use (e.g. statistical-claims borrows inference-sample).
- No `minutes`: the site computes it.

## Steps

Every `## Heading` starts a new step. Nothing goes before the first `##`. A lesson has **8–12 steps**.

A step is:

1. `## Title` — short (≤ 6 words), says the point: "Cancel the x-terms", not "Part 2".
2. **Teaching text** — at most **90 words**. One idea per step. Use a short paragraph, a numbered method,
   bullets, a small table or one callout. Bold only the words the student must notice.
3. **At most one interactive block** (`quiz` or `check`), always at the end of the step.

Most steps should end with a quiz. A step without one is fine for a short method summary or the recap.

### Quiz: our own question

````
```quiz
3x + 1 = 3x + 4. How many solutions does it have?
- Exactly one :: That needs different x-coefficients. Here both are 3.
* None :: Right. The x-terms cancel and leave 1 = 4, which is false.
- Infinitely many :: That needs the leftover to be true, like 4 = 4.
> Subtract 3x from both sides: 1 = 4. A false statement means no value of x works.
```
````

- The first lines, up to the first option, are the question (1–5 lines; a short R&W passage is fine here).
- 2–4 options. `-` = wrong, `*` = correct. **Exactly one** `*`.
- `:: feedback` after an option is optional but strongly preferred for wrong options: name the mistake that
  leads there (≤ 25 words). It is shown when that option is picked.
- `>` lines = the explanation, shown after any answer (≤ 60 words; up to 100 for a worked example). Several `>`
  lines become separate paragraphs.
- Worked examples are quizzes: an SAT-style question we wrote ourselves, with the explanation walking through the
  method.

### Check: a real question from the bank

````
```check
m-0566
```
````

One question id per block. The site shows the full question (passage, figure, choices, Desmos) with Check answer
and the bank's explanation, and records the answer in the student's stats.

## Lesson shape (skill lessons)

| Steps | What |
|---|---|
| 1 | **Spot it.** What the question looks like on screen and how to recognize it in seconds. A quiz like "Which of these is a … question?" or a first easy check of the idea. |
| 2–6 | **Teach.** The method and the rules, one idea per step, each with a quiz. Include 1–2 worked examples (quizzes with a full explanation). |
| 1 | **The trap.** A quiz where the tempting wrong option is the classic trap; its feedback names the trap. |
| 3 | **Your turn.** Exactly three steps titled `## Your turn: easy`, `## Your turn: medium`, `## Your turn: hard`, each with ≤ 20 words of text (a one-line pointer back to the method, never the answer) and one `check`. |
| 1 | `## Recap` — 4–6 bullets: the checklist to run on every question of this type. No interactive block. |

Strategy lessons use the same rhythm (short steps, quizzes, Recap) but no `check` blocks.

### Picking bank questions

- Use `npm run lessons:questions -- <skill-id>` and pick one easy, one medium and one hard question **of this skill**.
- Prefer questions that show the lesson's method clearly. Avoid ones flagged `choices-image` or `page-image`.
- **Solve each one yourself** (`--show <id>`) before using it. If you disagree with the stored answer, or the text
  looks broken, pick another and list the id in your report.
- Don't use the same question in two lessons.

## Writing rules

- Plain, friendly English a 16-year-old gets on first read. Short sentences. Explain each term the first time.
- **Accurate first.** Every rule, number and quiz answer must be right; check each quiz twice. Each wrong option
  must be wrong for a reason you can state, and that reason goes in its `::` feedback.
- Our own words only. Never copy text, explanations or questions from any source. Never call bank questions
  "original" — in lessons they are "real SAT questions".
- No repetition: say each fact once. No filler ("It's important to note…"), no hedging.
- Callouts (`> **Tip:** …`, `> **Trap:** …`, `> **Key idea:** …`, `> **Remember:** …`) belong in the teaching
  text, before the quiz: at most one per step, at most 3 per lesson.
- Tables: ≤ 3 columns, a few words per cell (they must fit a phone).
- No HTML, no images, no LaTeX, no nested lists. A line starting with `|` must be a table row.

## Markdown the site renders

- `##` step titles, `###` small sub-headings (rarely needed), paragraphs, `-` bullets, `1.` numbered lists
- `**bold**`, `*italic*` (words-as-words: *their*, *however*), `` `code` `` for expressions and Desmos input,
  `[links](https://…)`
- tables with a header row (`| a | b |` + `|---|---|`)
- callouts as `>` blockquotes starting with a bold label (outside quiz blocks)
- Math in text: Unicode (x², √x, ≤, ≥, ≠, π, θ, −, ×, ÷) or the bank notation `x^2`, `2^(x+1)`, `x_1`, `sqrt(x)`,
  which renders as superscript / subscript / √. Fractions as `a/b`.
