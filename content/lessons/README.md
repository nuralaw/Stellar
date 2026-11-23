# Lessons

One lesson per Digital SAT skill (30) plus three strategy lessons. A lesson is 4–7 **subtopics**. Each subtopic is one
**Learn screen** (an animation, the key ideas, an optional "Not sure?" theory island) followed by an **Easy**, a **Medium**
and a **Hard** task. Spec and screen design: `docs/lessons-v2.md`. This file is the author's reference.

```
content/lessons/
  rw/<skill-id>.md         Reading and Writing skills (ids from src/lib/taxonomy.ts)
  math/<skill-id>.md       Math skills
  strategy/<slug>.md       digital-sat-format, pacing-and-guessing, desmos
  _briefs/<visual-id>.md   a brief for a visual that is not built yet (see "Visuals")
src/components/lessons/visuals/<slug>.tsx          the lesson's topic animation (rules: visuals/README.md)
src/components/lessons/visuals/<slug>--<name>.tsx  a subtopic animation (```visual blocks)
```

Tools:

```
npm run lessons:check -- [slug…] [--strict]        validate lessons (all of them without arguments); --strict: a visual without
                                                   a file is an error even if a brief exists
npm run lessons:visuals -- <id>                    check an animation and save its storyboard PNG
npm run lessons:questions -- <skill-id> [--level easy|medium|hard] [--grep text] [--full] [--all] [--include-used]
                                                   candidate bank questions for a skill (questions already used by a lesson are hidden)
npm run lessons:questions -- --show <id> [<id>…]   the question as stored: raw passage/prompt (copy highlight phrases from it),
                                                   choices, answer, explanation, and whether a lesson already uses it
npm run lessons:questions -- --used [<skill-id>]   the ids already used by a lesson, with lesson, slot and difficulty
```

## Shape

````
---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read the center and radius from the equation. Find arcs and sectors.
---

# Center and radius                       ← a subtopic: "# " + title (≤ 5 words)
Flip the signs inside, root the right.     ← its tagline (≤ 10 words), shown on the overview

```visual
circles--center-point
```

## Key ideas
Markdown, 80–220 words: the rules, formulas, when to use them, the classic trap.
\[(x - h)^2 + (y - k)^2 = r^2\]

```example                                   ← optional: one worked example (and/or one ```desmos)
…
```

```theory
Markdown, 120–400 words: definitions of the terms used, why the rule works, extra examples,
edge cases, how the SAT words this, more traps. Shown in the "Not sure?" island.
```

## Easy
```task
bank: m-12345
highlight:
- "tangent to the x-axis" :: Tangent to the x-axis: the radius reaches the axis.
- "(5, -4)" :: The center is 4 units from the axis, so r = 4.
explain:
Markdown, 60–250 words, step by step, ends with the answer.
```

## Medium
```task
In the \(xy\)-plane, a circle has center \((2, -3)\) and passes through \((5, 1)\). What is its radius?
* 5
- 7 :: You added the coordinates instead of subtracting.
- 25 :: That is \(r^2\), not \(r\).
- \(\sqrt{7}\) :: Square the differences before adding.
highlight:
- "center \((2, -3)\)" :: Start from the center.
- "passes through \((5, 1)\)" :: The radius is the distance to this point.
explain:
…
```

## Hard
```task
…
```

# Next subtopic
…
````

- Frontmatter: `skill` / `domain` / `section` match `src/lib/taxonomy.ts` (strategy: `skill: <slug>`,
  `domain: strategy`, `section: strategy`). `summary` ≤ 80 characters. `also-skills: <skill-id>` only when the bank
  is short of questions for this skill.
- **4–7 subtopics per lesson.** Each one, in this order: `# title`, tagline, one `visual` block, `## Key ideas`
  (text, then the optional `example` / `desmos` blocks, then one `theory` block), `## Easy`, `## Medium`, `## Hard`,
  each with exactly one `task` block. Text outside blocks is allowed only in the tagline and in Key ideas, and in Key
  ideas **all text goes above the blocks** (the checker errors on text after a block).
- One subtopic per lesson is often the classic trap: title it `Trap: …`.
- No Recap, no final "Real SAT questions" part: real questions sit in every subtopic.
- Strategy lessons (digital-sat-format, pacing-and-guessing, desmos) have the same shape; their tasks are own questions
  (format facts, pacing decisions, Desmos moves).
- Word ranges (the checker warns outside them): Key ideas 80–220, theory 120–400, explain 60–250, tagline ≤ 10, titles ≤ 5,
  highlight note ≤ 20, option feedback ≤ 12.

## Tasks

Every subtopic has three: Easy, Medium, Hard. A task is **one question**, then `highlight:`, then `explain:` (to the
end of the block):

- **A bank question:** `bank: <id>` on the first line. Find candidates with `npm run lessons:questions -- <skill-id>`
  (used ones are hidden), solve one yourself with `--show <id>`. Pick the slot by the bank's difficulty (the checker
  warns when it differs). Avoid `choices-image` / `page-image` questions (the checker errors on them). Bank questions
  are the "Real SAT question" tasks; never call them "original".
- **An own question:** the question syntax below (prompt lines, options or `answer:`, optional `~` Desmos lines). It
  must read like the SAT: wording, notation (△JKL, xy-plane, "respectively"), length, four options with plausible
  distractors.
- **`highlight:`** 2–5 lines `- "<exact phrase>" :: <note ≤ 20 words>`, in the order you reason. After the student's
  **second wrong answer** the player lights these phrases up in the question one by one, each with its note. The
  phrase must be an **exact substring** of what the student reads:
  - bank question: the stored `passage` or `prompt` text. Copy it from `lessons:questions -- --show <id>`; it keeps the
    bank's notation (`x^2`, `sqrt(3)`, `−`, `π`). Do not use text from the choices.
  - own question: the Markdown source of the prompt. A phrase may contain whole formulas (`center \((2, -3)\)`) but must
    not start or end inside one.
  
- **`explain:`** the full step-by-step explanation, 60–250 words, ends with the answer. Shown by "Still confused?"
  (after the hints) and "See why" (after a right answer). It must work for someone who guessed.
- **No question is used twice anywhere on the site** (the same bank id, or the same own prompt). The checker errors.
- Math lessons need at least one typed-answer task (own `answer:` question, or a bank grid-in), like the SAT's
  student-produced response.

## Blocks

### Example: a worked example (in Key ideas)

````
```example
\(x^2 + y^2 - 6x + 10y + 9 = 0\). Find the center and the radius.
1. \((x^2 - 6x) + (y^2 + 10y) = -9\) :: Group \(x\) and \(y\). Move the number.
2. \((x - 3)^2 + (y + 5)^2 = 25\) :: Add 9 and 25 to both sides.
3. Center \((3, -5)\), radius 5 :: Flip the signs. \(\sqrt{25} = 5\).
```
````

Problem ≤ 40 words (R&W passage ≤ 70). 2–5 numbered lines: the work itself (≤ 14 words) `::` the move (≤ 10 words).
The last line is the answer.

**Answer choices** (R&W examples) go on their own line after the problem: `Choices:` and 2–4 choices separated by
` / ` (space, slash, space).

````
```example
The rain ______ the game began.
Choices: stopped, / stopped; / stopped
1. Before: "The rain stopped" :: A full sentence.
2. After: "the game began" :: Also a full sentence.
3. Answer: stopped; :: A semicolon joins two full sentences.
```
````

The player shows them as lettered chips (A, B, C, D) in a row that wraps. Short choices (up to three words) are set
in a monospace font with the punctuation marks picked out, so `stopped,` and `stopped;` are easy to tell apart.
Write the punctuation as part of the choice, exactly as the SAT choice has it. Choices count toward the problem's
word limit. Also accepted (older lessons): `Choices:` at the end of the last problem line, and a comma-separated
list of single words (`Choices: fragile, pricey, hardy`). Write new ones the canonical way.

### Own question (inside a task block)

An own question is the lines before `highlight:`. Multiple choice, with the Desmos way:

````
```task
\(x + y = 7\) and \(2x - y = 5\). What is \(x\)?
* 4
- 3 :: That's y. The question asks for x.
- 12 :: That's 3x. Divide by 3.
- 2 :: You subtracted the equations. Add them to cancel y.
~ type x+y=7 :: Type both equations as they are.
~ type 2x-y=5
~ point (4, 3) :: Click the crossing: x = 4.
highlight:
- "\(2x - y = 5\)" :: The second equation: add it to the first to cancel \(y\).
- "What is \(x\)?" :: The question asks for \(x\) only.
explain:
Add the equations to cancel \(y\): …
```
````

- The prompt is one or more lines. 2–4 options (aim for four, like the SAT), `*` = correct (exactly one), `-` = wrong
  with `:: feedback` (≤ 12 words, names the mistake). A line starting with `>` is an error: the explanation goes in
  `explain:`.
- **Retry:** a first wrong pick shows that option's feedback (or "Not quite. Try once more.") and the student tries
  again. The second wrong answer starts the highlights (see "Tasks"). So write feedback that helps a second attempt.
- `~` lines (math only, optional): **the fastest way in Desmos.** The site plays them on the real Desmos
  calculator after a wrong answer (and offers them after a right one). Add them whenever Desmos is a genuinely
  faster or safer route: systems, intersections, solutions/zeros, max/min, "how many solutions", checking
  equivalence, regressions, sliders for unknown constants. Skip them when Desmos doesn't help.

### Typed answer (the SAT's student-produced response)

````
```task
2x + 1 = 10.5. What is the value of x?
answer: 4.75, 19/4
- 9.5 :: That is 2x. Subtract 1 first, then divide.
- 4.5 :: You added 1 instead of subtracting.
~ type 2x+1=10.5 :: Check it in Desmos.
highlight:
- "What is the value of x?" :: Solve for x, not 2x.
- "10.5" :: Undo the +1 first.
explain:
…
```
````

- An `answer:` line replaces the options. It lists the accepted values, separated by commas. Each value already
  accepts every equivalent form (`19/4`, `4.75` and `4.750` all match), so list a second value only when the question
  really has two answers (`answer: 3, -3`). Write values as an integer, a decimal or an integer fraction (`-2.5`, `.5`,
  `17/4`). Write an answer that repeats as a fraction (`2/3`), never as a rounded decimal.
- Optional `- value :: feedback` lines (0–3) are **common wrong values**, with the usual ≤ 12-word feedback naming the
  mistake. No `*` lines. The prompt and the `~` lines work as in a multiple-choice question.
- The player shows a text input (so `/` and `−` can be typed on iOS) and Check. Spaces are allowed only around `/`
  and after a leading minus; `−` and `-` are the same. Fractions and decimals are equivalent (`17/4` = `4.25`,
  `.5` = `0.5` = `1/2`, a leading `.` is fine).
- **Repeating answers follow the SAT's rule.** If the answer is a fraction that doesn't end (2/3, 50/3), a decimal is
  right only if it is the value truncated or rounded **and fills the answer grid**: 5 characters counting the `.`
  (6 with a minus sign), where a leading `0` may be left out. So for 2/3: `.6666`, `.6667`, `0.666`, `0.667` are right,
  but `.666`, `.67` and `.7` are not. For 50/3: `16.67` and `16.66` are right, `16.6` and `16.7` are not. A decimal with
  the right value but more characters than the grid holds (`16.667`) gets the hint "Too long for the answer grid"
  and does not count as a try.
- A **mixed number** (`4 1/4`) and anything that is not a number (`12 3`, `4,25`, letters) get a hint ("The SAT
  doesn't take mixed numbers…", "Enter a number…") and do not count as a try.
- Typed answers are for **math** lessons (R&W is multiple choice). The checker warns when a math lesson has no typed
  task; a bank grid-in counts.

### Desmos moves (in `~` lines and ```desmos blocks)

```
type <Desmos LaTeX>        add an expression: y=2x+1   y=\frac{1}{2}x-3   x^{2}+y^{2}=25   y=a(x-3)^{2}+4
point (x, y)               mark and label the point the student reads off (the answer)
slider k = 0 .. 3          make slider k at 0 and drag it to 3 ("slider k = 2" only makes it)
zoom xmin xmax ymin ymax   set the window so the answer is in view
table x_1: 1, 2, 3; y_1: 5, 7, 9     add a table (then e.g. type y_{1}\sim mx_{1}+b for a regression)
say                        caption only (a pause to notice something)
```

Each move may end with `:: caption` (≤ 12 words: what to notice). 2–6 moves. LaTeX rules: braces for powers and
subscripts (`x^{10}`, `y_{1}`), `\frac{a}{b}`, `\sqrt{x}`, `\le` / `\ge`, `\sim` for regressions, `\pi`,
`\mean\left(L\right)`, `\median`, `\stdev` (sent to Desmos as `\operatorname{mean}` and so on). Make a slider
**before** typing an expression that uses it. Slider names: one letter, not x, y, e or r.

**Zoom windows are shown exactly as written**, with different x and y scales when the window is tall or wide
(`zoom -3 30 -100 900` shows 33 units across and 1000 up). Only a window that is already near-square (width between
½ and 2× the height) keeps equal units, so circles stay round. Pick the window for the numbers in the problem so the
key point is clearly inside it (Desmos starts at −10..10).

**What the student sees typed.** The chip beside each `type` move shows the keystrokes that really work in Desmos,
which differ from the LaTeX: `\frac{2}{5}x+3` shows `y=2/5→x+3` (→ is the right arrow key: Desmos keeps everything
after `/` in the denominator until you press it), `y_{1}\sim mx_{1}+b` shows `y1~mx1+b` (Desmos subscripts a digit
after a letter by itself), `x^{2}y` shows `x^2→y`, `\sqrt{x}+1` shows `sqrt x→+1`, `\frac{1}{x^{2}}+1` shows `1/x^2→→+1` (one → for each open
exponent, radical or denominator). Write the LaTeX normally; the chip, and its note "→ = press the
right arrow key", are made for you (`src/lib/desmos-keys.ts`). In your captions, never tell students to type the
LaTeX form.

### Desmos: a walkthrough in Key ideas

````
```desmos
\(2x + y = 7\) and \(x - y = 2\). Find \((x, y)\).
type 2x+y=7 :: Type each equation on its own line.
type x-y=2
point (3, 1) :: Click the crossing: (3, 1).
```
````

The problem line(s) first, then the moves. At most one `example` and one `desmos` block per subtopic, after the Key
ideas text and before the `theory` block (the Desmos lesson uses `desmos` blocks everywhere).

### Visual: the subtopic's animation

````
```visual
circles--center-point
```
````

One id per subtopic, under the tagline. It plays `src/components/lessons/visuals/<id>.tsx` in the Learn screen's visual
island. Convention for the id: `<lesson slug>--<name>`. Rules for the animation: `src/components/lessons/visuals/README.md`;
check it with `npm run lessons:visuals -- <id>`. Formulas inside a visual use the kit's `<Tex>`.

**A visual that doesn't exist yet:** write a brief to `content/lessons/_briefs/<visual-id>.md` (what it shows, the
frames/storyboard, the labels and formulas, which colours to stress) and use that id in the lesson. The checker then
reports a **warning** "visual missing — brief exists" instead of an error, so writers can see progress; the visual
builders implement the briefs. An id with neither a file nor a brief is an error. Reuse an existing visual only when it
truly fits the subtopic.

### Theory: the "Not sure?" island

````
```theory
Markdown (formulas, lists, small tables), 120–400 words.
```
````

Inside `## Key ideas`, after the text and after any `example` / `desmos` block. Key ideas say **what to do**; theory
says **why** and goes deeper: definitions of the terms, the reasoning, extra examples, edge cases, how the SAT words
it, more traps.

## Math

Formulas are typeset with KaTeX. Write them in LaTeX between delimiters:

- `\( … \)` **inline** (inside a sentence).
- `\[ … \]` **display**. On a line of its own in Key ideas, theory or an explanation it is a centered block. Anywhere
  else (example problem and lines, question, options, feedback, highlight notes, captions, list items, a
  sentence) it is set in display style but stays inline, so it never breaks the layout. Put the key formula of a
  subtopic on its own line; use it in an example or option only when a big fraction really helps.
- Never `$…$`: money like `$12` is common in SAT word problems and stays plain text.
- A formula sits on **one line** (the checker errors on a `\(` without its `\)`, and on LaTeX that KaTeX can't
  read). Everything between the delimiters is LaTeX: no `**bold**`, no `::`, and write `\vert` for a bar (a `|` inside a
  formula or `code span` does not split a table cell, but `\vert` is safer).
- A whole formula counts as **one word** in every word limit, so converting a formula never breaks a limit.

````
\[(x - h)^2 + (y - k)^2 = r^2\]
Center \((h, k)\), radius \(r\). Know a point on the circle? Its distance to the center is \(r\).
````

What goes in a formula:

- The subtopic's **key formula** as a display line (above). Short expressions inline: `\(72^\circ\)`, `\(2\pi r\)`,
  `\(\frac{1}{5}\)`, `\(y = 2x + 1\)`, coordinates `\((-5, 2)\)`.
- **Variables mentioned in prose**: `\(x\)`, `\(k\)`, `\(r^2\)`, `\(x\)-axis`, `\(xy\)-plane`.
- **Stays text:** plain numbers in prose ("legs 3 and 4", "radius 7", "5 units"), money (`$12`), point labels
  (A, B, C), and a lone `=` in a sentence you do not need typeset. Typed answers (`answer:` line) stay plain numbers.
- Write LaTeX the standard way: `\frac{a}{b}`, `\sqrt{x}`, `\pi`, `\theta`, `\le` / `\ge`, `\ne`,
  `\cdot` (for ×), `\div`, `^{…}` and `_{…}` **with braces** (`x^{10}`, `x_{1}`), `^\circ` for degrees,
  `\text{…}` for words, a plain `-` for minus.
- **Do not bold formulas** (`**\(x\)**` renders, but the formula stays regular weight). Bold the term, not the math,
  and write `the \(xy\)-plane`, not `**\(xy\)-plane**`.
- A formula inside a `` `code span` `` is not a formula (the span stays as written), so `` `\(` `` never pairs with a later `\)`.
- Only plain LaTeX: `\href`, `\url`, `\includegraphics` and `\htmlId` are not allowed (the checker errors).
- Formulas work everywhere lesson text does: Key ideas, theory, example problem / lines / notes, own questions and
  their options and `::` feedback, highlight notes, `explain:`, Desmos captions. **Subtopic titles and taglines** take
  inline `\( \)` formulas too (`# Radius meets tangent at \(90^\circ\)`); keep them short, and never `\[ \]` there
  (error). Bank questions are plain text in the bank's own notation (`x^2`, `sqrt(3)`), so a highlight phrase on a bank
  question is copied as stored. The one place formulas do not work: the `Choices:` of an R&W example.
- **Desmos `type` moves stay Desmos LaTeX** (`type y=2x+1`). They are not wrapped in `\( \)`. Captions after `::`
  are ordinary lesson text, so formulas there are wrapped.
- `npm run lessons:check` renders every formula with KaTeX (errors) and warns, once per piece of text (key ideas, theory, each task part), about math still written
  outside formulas, in titles and taglines too: Unicode math (² √ π ≤ × ÷ ° …, a − between numbers or letters; `°` after a number before C or F is a temperature and fine) and bank notation (`x^2`, `sqrt(`,
  `x_1`). Bank questions themselves are not checked for this (their text is stored as it is).


## Writing rules

- **Teach the SAT, not the book.** Cover every rule and trick that actually appears in SAT questions for this skill,
  and fix every error listed in the lesson's compare report. **Our own words only:** never copy sentences or examples
  from the extracted book text; use it to know what to teach and build new examples with new numbers and contexts.
- Plain English a 16-year-old gets on first read. **Define a term at its first use** in 3–6 words, or in the theory.
  Friendly, concrete, no filler, no hedging, no motivational lines.
- **Key ideas = what you need to answer; theory = why and more depth.** Show the formula, then a tiny worked example.
- R&W: visuals show structure (clauses, punctuation slots, text roles, evidence → claim), not just text.
- Feedback in plain words a non-native speaker can read ("You added instead of subtracting"), not one-word verdicts.
  Each wrong option is wrong for the reason its feedback states.
- **Accurate first.** Solve every task and example twice. Desmos moves must give exactly the answer shown.
- Markdown: paragraphs, `-` bullets, `1.` lists, `**bold**`, `*italic*`, `` `code` ``, small tables (≤ 3 columns).
  **Math is always a formula** (next section); plain text outside formulas is for words and plain numbers only.
