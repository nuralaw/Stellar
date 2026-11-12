# Lessons

One lesson per Digital SAT skill (30) plus three strategy lessons. A lesson is **short**: the student sees the
idea, walks through **one clear example**, checks themselves a few times and finishes with real SAT questions.
No filler. Every word must earn its place.

```
content/lessons/
  rw/<skill-id>.md         Reading and Writing skills (ids from src/lib/taxonomy.ts)
  math/<skill-id>.md       Math skills
  strategy/<slug>.md       digital-sat-format, pacing-and-guessing, desmos
src/components/lessons/visuals/<slug>.tsx   the lesson's animation (rules: visuals/README.md)
```

Tools:

```
npm run lessons:questions -- <skill-id>            candidate bank questions for a skill, by difficulty
npm run lessons:questions -- --show <id> [<id>…]   full text, choices, answer and explanation
npm run lessons:check -- [slug…]                   validate lessons (all of them without arguments)
npm run lessons:visuals -- <slug>                  check a lesson's animation and save its storyboard PNG
```

## How the site plays a lesson

1. **Cover** (automatic, not in the file): the topic's animation in a big island, the title and the `summary`.
2. **The idea + one example**: the first step. One sentence of rule, then a worked example that opens line by
   line.
3. **Try it**: a few one-screen quizzes, each with at most one sentence of new teaching.
4. **The trap**: the classic mistake as a quiz.
5. **Your turn**: three real SAT questions (skill lessons).
6. **Recap**: 2–3 bullets.

## File format

Frontmatter: simple `key: value` lines only.

```
---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read the center and radius straight from the equation.
---
```

- `skill` / `domain` / `section` must match `src/lib/taxonomy.ts`. Strategy lessons: `skill: <slug>`,
  `domain: strategy`, `section: strategy`.
- `summary`: **≤ 80 characters**, one plain sentence under the cover animation: what the student will be able to
  do. No "In this lesson", no "learn how to".
- `also-skills: <skill-id>` (optional): only when the bank has too few questions of this skill, a closely related
  skill whose questions the `check` blocks may also use (e.g. statistical-claims borrows inference-sample).

Every `## Heading` starts a step. Nothing goes before the first `##`. A step is a title (≤ 5 words, says the
point), a little text, and at most one block (`example`, `quiz` or `check`) at the end.

## Lesson shape

| Steps | What |
|---|---|
| 1 | **The idea.** Title = the idea in ≤ 5 words. ≤ 25 words of text: the rule, often one bold formula or one bold sentence. Then the lesson's **only** ```` ```example ````. |
| 3–4 | **Try it.** ≤ 25 words of text each (zero is fine), then a quiz. The first one applies the example's idea directly; the next ones each add **one** twist the SAT uses (one sentence teaches it). |
| 1 | **The trap.** Title starts with `Trap:` (e.g. `Trap: inscribed angles`). ≤ 20 words + a quiz whose tempting wrong option is the classic trap. |
| 3 | **Your turn.** `## Your turn: easy`, `## Your turn: medium`, `## Your turn: hard`, each ≤ 12 words of text (a pointer to the method, never the answer) and one `check`. |
| 1 | `## Recap` — 2–3 bullets, ≤ 30 words in total. No block. |

So a skill lesson has **9–10 steps**. Strategy lessons: the idea + example, 3–5 quizzes, Recap (5–8 steps), no
`check` blocks.

### Example: the one worked example

````
```example
x² + y² − 6x + 10y + 9 = 0. Find the center and the radius.
1. (x² − 6x) + (y² + 10y) = −9 :: Group x and y. Move the number.
2. (x − 3)² + (y + 5)² = 25 :: Add 9 and 25 to both sides.
3. Center (3, −5), radius 5 :: Flip the signs. √25 = 5.
```
````

- Lines before `1.` = the problem (≤ 40 words; an R&W passage may take ≤ 60).
- 2–5 numbered lines: `N. what you write :: what you did`. The text is the work itself (≤ 14 words); the note
  after `::` says the move in ≤ 10 words. The last line is the answer (the site highlights it).
- Pick the **clearest, most typical** SAT case of the skill. It should make the rule obvious on its own.

### Quiz: our own question

````
```quiz
3x + 1 = 3x + 4. How many solutions?
- Exactly one :: That needs different x-coefficients.
* None
- Infinitely many :: That needs a true leftover, like 4 = 4.
> The x-terms cancel: 1 = 4 is false, so no x works.
```
````

- The lines up to the first option are the question (≤ 40 words; with an R&W passage ≤ 70).
- 2–4 options. `-` = wrong, `*` = correct. **Exactly one** `*`.
- `:: feedback` on every wrong option: the mistake that leads there, **≤ 12 words**.
- `>` = the explanation shown after any answer: **≤ 25 words**, one or two `>` lines.

### Check: a real question from the bank

````
```check
m-0566
```
````

One question id per block. The site shows the full question with Check answer and the bank's explanation, and
records the answer in the student's stats.

### Picking bank questions

- `npm run lessons:questions -- <skill-id>`: one easy, one medium, one hard question **of this skill**.
- Prefer questions that show the lesson's method clearly. Avoid ones flagged `choices-image` or `page-image`.
- **Solve each one yourself** (`--show <id>`) before using it. If you disagree with the stored answer or the text
  looks broken, pick another and report the id.
- Don't use the same question in two lessons.

## Writing rules

- **Short.** Text for the whole lesson (step text + example) ≤ 160 words. Say a fact once. No intros ("In this
  lesson…", "Let's…"), no filler ("It's important to note…"), no hedging, no motivational lines.
- Plain English a 16-year-old gets on first read. Short sentences. Explain a term in a few words the first time.
- **Accurate first.** Every rule, number and answer must be right; solve each quiz twice. Each wrong option must
  be wrong for a reason you can state, and that reason is its feedback.
- Our own words only. Never copy text, explanations or questions from any source. Bank questions are "real SAT
  questions", never "original".
- At most one callout per lesson (`> **Tip:** …` or `> **Remember:** …`), only if it saves a step.
- No tables unless a table *is* the example. No HTML, no images, no LaTeX, no nested lists.

## Markdown the site renders

- paragraphs, `-` bullets, `1.` numbered lists, `**bold**`, `*italic*` (words-as-words: *their*, *however*),
  `` `code` `` for expressions and Desmos input
- tables with a header row (≤ 3 columns, a few words per cell)
- Math: Unicode (x², √x, ≤, ≥, ≠, π, θ, −, ×, ÷) or the bank notation `x^2`, `2^(x+1)`, `x_1`, `sqrt(x)`, which
  renders as superscript / subscript / √. Fractions as `a/b`. Use the true minus sign (−) in math.
