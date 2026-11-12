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
- **Skill lessons: 3–5 teaching parts + the `# Real SAT questions` part** (exactly the three `## Your turn: …`
  steps, ≤ 12 words of text each, one `check` each).
- **Strategy lessons: 3–6 parts**, no checks.
- **A teaching part = 2–3 steps:** step 1 shows the idea with **one** block that teaches (`example`, `desmos` or
  `visual`); the next 1–2 steps are quizzes. ≤ 60 words of teaching text per part (step text + example notes).
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
- `~` lines (math only, optional): **the fastest way in Desmos.** The site plays them on the real Desmos
  calculator right after a wrong answer (and offers them after a right one). Add them whenever Desmos is a genuinely
  faster or safer route: systems, intersections, solutions/zeros, max/min, "how many solutions", checking
  equivalence, regressions, sliders for unknown constants. Skip them when Desmos doesn't help.

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
subscripts longer than one character (`x^{10}`, `y_{1}`), `\frac{a}{b}`, `\sqrt{x}`, `\le` / `\ge`, `\sim` for
regressions, `\pi`. Make a slider **before** typing an expression that uses it. Slider names: one letter, not x, y,
e or r. Zoom so the key point is clearly inside the window (Desmos starts at −10..10).

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

Plays `src/components/lessons/visuals/<id>.tsx` big. Same rules as topic animations (visuals/README.md); the CSS
prefix is `v-<id>-`. A lesson with `visual-only: true` in its frontmatter (digital-sat-format) teaches only with
visuals: no step text, every teaching step a `visual`.

### Check: a real question from the bank

````
```check
m-0566
```
````

Pick one easy, one medium and one hard question **of this skill**; solve each yourself (`--show`) first; avoid
`choices-image` / `page-image`; never reuse a question across lessons.

## Writing rules

- **Short.** ≤ 60 words of teaching text per part, ≤ 240 per lesson. Say a fact once. No intros, no filler, no
  hedging, no motivational lines.
- Plain English a 16-year-old gets on first read. Explain a term in a few words the first time.
- **Accurate first.** Solve every quiz and example twice. Each wrong option is wrong for the reason its feedback
  states. Desmos moves must give exactly the answer shown.
- Our own words only. Bank questions are "real SAT questions", never "original".
- Markdown: paragraphs, `-` bullets, `**bold**`, `*italic*`, `` `code` ``, small tables (≤ 3 columns). Math in
  Unicode (x², √x, ≤, −, π) or bank notation (`x^2`, `sqrt(x)`). True minus sign (−) in math text.
