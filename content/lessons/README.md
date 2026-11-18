# Lessons

One lesson per Digital SAT skill (30) plus three strategy lessons. Opening a lesson shows its **parts**
(subtopics) under the topic's animation; the student picks one or goes in order. Each part teaches **one idea with
one clear example**, then checks it. No filler: every word must earn its place.

```
content/lessons/
  rw/<skill-id>.md         Reading and Writing skills (ids from src/lib/taxonomy.ts)
  math/<skill-id>.md       Math skills
  strategy/<slug>.md       digital-sat-format, pacing-and-guessing, desmos
src/components/lessons/visuals/<slug>.tsx          the lesson's topic animation (rules: visuals/README.md)
src/components/lessons/visuals/<slug>--<name>.tsx  a step animation (```visual blocks)
```

Tools:

```
npm run lessons:check -- [slug…]                   validate lessons (all of them without arguments)
npm run lessons:visuals -- <id>                    check an animation and save its storyboard PNG
npm run lessons:questions -- <skill-id>            candidate bank questions for a skill, by difficulty
npm run lessons:questions -- --show <id> [<id>…]   full text, choices, answer and explanation
```

## Shape

```
---
title: Circles
skill: circles
domain: geometry-trig
section: math
summary: Read the center and radius from the equation. Find arcs and sectors.
---

# Center and radius                      ← a part (subtopic): "# " + title (≤ 5 words)
Flip the signs, root the right side.      ← its tagline (≤ 10 words), shown on the lesson overview

## Read center and radius                 ← a step: "## " + title (≤ 5 words)
**(x − h)² + (y − k)² = r²** …            ← teaching text (≤ 25 words)
```example … ```                          ← the part's one worked example

## Read it yourself
```quiz … ```

# Complete the square
…

# Real SAT questions                      ← skill lessons end with this part
Three real questions, easy to hard.
## Your turn: easy
```check … ```
## Your turn: medium
…
## Your turn: hard
…
```

- Frontmatter: `skill` / `domain` / `section` match `src/lib/taxonomy.ts` (strategy: `skill: <slug>`,
  `domain: strategy`, `section: strategy`). `summary` ≤ 80 characters. `also-skills: <skill-id>` only when the bank
  is short of questions for this skill.
- **Skill lessons: 3–7 teaching parts + the `# Real SAT questions` part** (exactly the three `## Your turn: …`
  steps, ≤ 12 words of text each, one `check` each).
- **Strategy lessons: 3–7 parts**, no checks.
- **A teaching part = 2–3 steps:** step 1 teaches the idea (one `example` or `desmos`, optionally with one `visual`
  above it; or a `visual` alone); the next 1–2 steps are quizzes. Step text ≤ 25 words. **≤ 70 words of teaching
  text per part** (step text + example notes; the `more` text is not counted).
- A step is its text, then the blocks in this order: an optional `visual`, at most one of `example` / `desmos` /
  `quiz` / `check`, and an optional `more`. A `visual` can only be paired with an `example` or `desmos`.
  **All the step's text goes above the blocks.** Text between or after blocks is an error ("text after a block; move
  it above the blocks"), because the player shows the step's text first and would otherwise show it under the block
  and outside the word limits.
- One part per lesson is the classic trap: title it `Trap: …` (e.g. `# Trap: inscribed angles`).
- No Recap: the overview's part titles and taglines are the recap.

## Blocks

### Example: a worked example that opens line by line

````
```example
x² + y² − 6x + 10y + 9 = 0. Find the center and the radius.
1. (x² − 6x) + (y² + 10y) = −9 :: Group x and y. Move the number.
2. (x − 3)² + (y + 5)² = 25 :: Add 9 and 25 to both sides.
3. Center (3, −5), radius 5 :: Flip the signs. √25 = 5.
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

### Quiz: our own question (+ the Desmos way)

````
```quiz
x + y = 7 and 2x − y = 5. What is x?
* 4
- 3 :: That's y. The question asks for x.
- 12 :: That's 3x. Divide by 3.
> Add the equations: 3x = 12, so x = 4.
~ type x+y=7 :: Type both equations as they are.
~ type 2x-y=5
~ point (4, 3) :: Click the crossing: x = 4.
```
````

- 2–4 options, `*` = correct (exactly one), `-` = wrong with `:: feedback` (≤ 12 words, names the mistake).
- `>` explanation, ≤ 25 words.
- **Retry:** a first wrong pick shows that option's feedback (or "Not quite. Try once more.") and the student tries
  again (the wrong option is crossed out). A second wrong pick reveals the answer, the feedback and the
  explanation; so does a right pick ("Correct!"). So write feedback that helps a second attempt, and an explanation
  that works for someone who guessed.
- `~` lines (math only, optional): **the fastest way in Desmos.** The site plays them on the real Desmos
  calculator right after a wrong answer (and offers them after a right one). Add them whenever Desmos is a genuinely
  faster or safer route: systems, intersections, solutions/zeros, max/min, "how many solutions", checking
  equivalence, regressions, sliders for unknown constants. Skip them when Desmos doesn't help.

### Typed-answer quiz (the SAT's student-produced response)

````
```quiz
2x + 1 = 10.5. What is the value of x?
answer: 4.75, 19/4
- 9.5 :: That is 2x. Subtract 1 first, then divide.
- 4.5 :: You added 1 instead of subtracting.
> 2x = 9.5, so x = 4.75 = 19/4.
~ type 2x+1=10.5 :: Check it in Desmos.
```
````

- An `answer:` line replaces the options. It lists the accepted values, separated by commas. Each value already
  accepts every equivalent form (`19/4`, `4.75` and `4.750` all match), so list a second value only when the question
  really has two answers (`answer: 3, -3`). Write values as an integer, a decimal or an integer fraction (`-2.5`, `.5`,
  `17/4`). Write an answer that repeats as a fraction (`2/3`), never as a rounded decimal.
- Optional `- value :: feedback` lines (0–3) are **common wrong values**, with the usual ≤ 12-word feedback naming the
  mistake. No `*` lines. The prompt, the `>` explanation and the `~` lines work as in a multiple-choice quiz.
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
  doesn't take mixed numbers…", "Enter a number…") and do not count as a try. After a first miss the "Try once more"
  note stays on screen, with the hint under it.
- Retry works as above: a first wrong value shows its feedback and lets the student try again; a second wrong value
  reveals the answer ("the answer is 4.75 or 19/4") and the explanation.
- Typed quizzes are for **math** lessons. Every math lesson should have at least one (the checker warns if none).

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

### Desmos: a step that teaches in Desmos

````
```desmos
2x + y = 7 and x − y = 2. Find (x, y).
type 2x+y=7 :: Type each equation on its own line.
type x-y=2
point (3, 1) :: Click the crossing: (3, 1).
```
````

The problem line(s) first, then the moves. Used as a part's teaching block (the Desmos lesson does this everywhere).

### Visual: a step that teaches with an animation

````
```visual
digital-sat-format--modules
```
````

Plays `src/components/lessons/visuals/<id>.tsx` big. The id is `<lesson slug>--<name>` (the checker requires the
slug prefix and the file). Same rules as topic animations (visuals/README.md); the CSS prefix is `v-<id>-`. A lesson
with `visual-only: true` in its frontmatter (digital-sat-format) teaches only with visuals: no step text, every
teaching step a `visual`.

**A visual and an example (or desmos) in one step:** at most one of each, the `visual` block written first. The player
shows the visual (a little smaller than a lone visual), then the example or Desmos walkthrough under it:

````
## Read the center and radius
Flip the signs of the numbers in the brackets.

```visual
circles--center-radius
```

```example
x² + y² − 6x + 10y + 9 = 0. Find the center and the radius.
1. (x² − 6x) + (y² + 10y) = −9 :: Group x and y. Move the number.
2. (x − 3)² + (y + 5)² = 25 :: Add 9 and 25 to both sides.
3. Center (3, −5), radius 5 :: Flip the signs. √25 = 5.
```
````

A visual can't be paired with a `quiz` or `check`, and a step can't hold two visuals. The pair counts as one teaching
block.

### More: "Not clear? Explain more"

````
```more
A **full sentence** has a subject and a verb and can stand alone: *The rain stopped.* A phrase like *After the rain*
can't.
```
````

A `more` block is the **last thing in a step**, after its text and blocks. Markdown, **≤ 80 words**, at most one per
step. Use it for a term's definition, an intermediate step the example skips, or the same idea in other words. The
player shows the step as usual with a quiet "Not clear? Explain more" button under it. Clicking opens the text
(a short height and opacity animation, none with reduced motion), the button becomes "Show less", and it is closed
again on every visit. Not allowed on `check` steps. It does not count toward the 25-word step or 70-word part limits,
and adding or removing one does not reset a student's saved progress.

### Check: a real question from the bank

````
```check
m-0566
```
````

Pick one easy, one medium and one hard question **of this skill**; solve each yourself (`--show`) first; avoid
`choices-image` / `page-image`; never reuse a question across lessons.

The text above a check (≤ 12 words) is a hint. The `Your turn: easy` step may instead carry **one notation line**
that the real questions assume, e.g. `△JKL means triangle JKL.` or `xy-plane: the plane with an x-axis and a y-axis.`

## Writing rules

- **Short.** Step text ≤ 25 words, ≤ 70 words of teaching text per part, ≤ 490 per lesson (`more` blocks don't
  count). Say a fact once. No intros, no filler, no hedging, no motivational lines.
- Plain English a 16-year-old gets on first read. **Define a term at its first use** in 3–6 words ("slope: how steep
  the line is") or, if it needs more, in the step's `more` block.
- **The last quiz before `# Real SAT questions` matches the SAT:** its wording, notation (△JKL, xy-plane, congruent,
  respectively …) and length (25–100 words in math; a passage plus a question in R&W). The checker warns if it is short.
- **Math lessons include at least one typed-answer quiz** (`answer:`), because the SAT has student-produced
  responses. The checker warns if there is none.
- Quiz feedback in plain words a non-native speaker can read ("You added instead of subtracting"), not one-word verdicts.
- **Accurate first.** Solve every quiz and example twice. Each wrong option is wrong for the reason its feedback
  states. Desmos moves must give exactly the answer shown.
- Our own words only. Bank questions are "real SAT questions", never "original".
- Markdown: paragraphs, `-` bullets, `**bold**`, `*italic*`, `` `code` ``, small tables (≤ 3 columns). Math in
  Unicode (x², √x, ≤, −, π) or bank notation (`x^2`, `sqrt(x)`). True minus sign (−) in math text.
