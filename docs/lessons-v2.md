# Lessons v2 — format, player and content rules

Status: approved direction from the owner (2026-11-23). Replaces the step-by-step lesson format of
`content/lessons/README.md` (v1: ≤ 25-word steps, "Continue" between tiny screens, one quiz per part,
"# Real SAT questions" at the end).

## What the owner asked for
1. **Every subtopic has a graphic explanation** (an animation from `src/components/lessons/visuals/`).
2. **Layout:** the graphic explanation sits in its own island on the left part of the screen (not full screen,
   not full width). To the right of it: the key principles of the subtopic. Under the principles a
   **"Not sure?"** button; pressing it opens a new island **directly next to the text** with the theory
   behind the subtopic.
3. **No "Next step" paging inside a subtopic.** The explanation is written out fully on one screen.
   Navigation: **‹ Back / Next ›** arrows at the bottom-left of the island.
4. **After every subtopic: one Easy, one Medium, one Hard task.** After **2 wrong answers** the island
   highlights, **one by one**, the key words of the question that lead to the answer (each with a short
   note). Then it asks **"Still confused?"**; pressing it opens the full step-by-step explanation.
5. Formulas are typeset with KaTeX (`\( … \)` inline, `\[ … \]` display — see README "Math").
6. Content: every lesson is rewritten to cover the rules and traps that real SAT questions test.
Questions come from the question bank when a good match exists, otherwise we write our own SAT-style task.
All 33 lessons are converted in one batch.

## Lesson flow
Overview (cover: title, summary, list of subtopics with done marks, Start/Continue)
→ for each subtopic: **Learn** screen → **Easy** task → **Medium** task → **Hard** task
→ next subtopic … → **Complete** screen (score, practice link, next lesson; existing behaviour).
The old final "# Real SAT questions" part is gone: real questions now live in every subtopic.

## Screens
**Learn screen** — one island (card):
- Desktop (≥ 1024 px): two columns. Left ≈ 40 %: the visual in its own inner island (Stage, landscape aspect,
  never full width of the page); under it, at the island's bottom-left, the arrows `‹ Back` `Next ›`.
  Right ≈ 60 %: subtopic title + tagline, the **Key ideas** text in full (paragraphs, bullets, display
  formulas, small tables, an optional worked ```example and/or ```desmos walkthrough), then the
  **"Not sure?"** button. Pressing it opens the **Theory** island right below the button inside the right
  column (pops in next to the text; close ×; press again to hide).
- Phone/tablet (< 1024 px): stacked — visual island on top, text below, arrows at the bottom-left of the card.

**Task screen** — same island shell:
- Left column: difficulty chip (Easy / Medium / Hard), "Real SAT question" chip for bank questions, the
  passage/prompt (this is where highlights appear). Right column: choices or the typed-answer box, Check,
  feedback. Arrows at the bottom-left. Stacked on phones.
- Answer logic:
  - Wrong #1 → that choice's feedback, try again.
  - Wrong #2 → **hints start**: the task's key phrases light up in the prompt one after another (≈ 1.2 s apart,
    or a "Next hint" button), each with its numbered note beside/under it. The student may answer again.
  - After the last hint → **"Still confused?"** button → an island opens next to the question with the full
    step-by-step explanation; the correct answer is marked.
  - Right answer at any point → success state; "See why" opens the same explanation.
  - Bank questions log one attempt per pass via `addAttempt` (correct = first answer right), so misses go to
    the existing mistakes notebook (`src/lib/review.ts`).
- Keyboard: A–D / 1–4 choose, Enter checks, ← / → Back / Next.

**Progress:** a subtopic is done when its 3 tasks are answered (right, or explanation revealed). Lesson done
when all subtopics are done. Resume where the student left. Overview shows per-subtopic state. Keep the
lessons-by-domain navigation (domain back links, `rememberTab`), Plus gating (server-side), attempts.

## File format — `content/lessons/<section>/<slug>.md`
Frontmatter unchanged (`title, skill, domain, section, summary`, optional `also-skills`).

````
# Center and radius
Flip the signs inside, take the root on the right.

```visual
circles--center-point
```

## Key ideas
Markdown, 80–220 words (+ optional one ```example and/or one ```desmos block): the rules, formulas,
when to use them, the classic trap.

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
In the xy-plane, a circle has center \((2, -3)\) and passes through \((5, 1)\). What is its radius?
* 5
- 7 :: You added the coordinates instead of subtracting.
- 25 :: That is r², not r.
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
````

Rules:
- 4–7 subtopics per lesson. Each subtopic, in this order: `# title`, tagline, one ```visual, `## Key ideas`,
  one ```theory, `## Easy`, `## Medium`, `## Hard` — each with exactly one ```task.
- A task is either `bank: <id>` (a question from `public`/`src` bank — find candidates with
  `npm run lessons:questions -- <skill-id>`, read one with `--show <id>`) or an own question in the v1 quiz
  syntax (prompt lines, `*` right, `- wrong :: feedback`, or `answer: <value>` for typed math answers).
  Own questions must read like the SAT (wording, length, four choices, plausible distractors).
- `highlight:` 2–5 lines `- "<exact phrase>" :: <note ≤ 20 words>`, in reasoning order. The phrase must be an
  exact substring of the task's prompt/passage as stored (for bank questions: the stored question text).
- `explain:` is required (60–250 words).
- Bank difficulty should match the slot (Easy/Medium/Hard); the checker warns otherwise.
- **No question is used twice anywhere on the site.**
- Strategy lessons (digital-sat-format, pacing-and-guessing, desmos) follow the same shape; their tasks are
  own questions (format facts, pacing decisions, Desmos moves).

## Content rules
- Teach the SAT, not a book: cover every rule and trick for this skill that actually appears in SAT questions.
- **Write in our own words.** Never copy sentences or examples from prep books; build new examples with new
  numbers and contexts.
- English, clear, friendly, concrete. Key ideas = what you need to answer; theory = why and more depth.
- Math: every formula in KaTeX syntax; show the formula, then a tiny worked example.
- R&W: visuals should show structure (clauses, punctuation slots, text roles, evidence → claim), not just text.

## Visuals
- Every subtopic needs one visual id that exists in `src/components/lessons/visuals/` and is registered in
  `index.ts`. Reuse an existing one when it truly fits the subtopic; otherwise a new one is built.
- New visuals follow `src/components/lessons/visuals/README.md`; check with `npm run lessons:visuals -- <id>`.
- Formulas inside visuals use the kit's `<Tex>` (KaTeX inside the SVG), not plain text.
- Content writers who need a new visual write a brief to `content/lessons/_briefs/<visual-id>.md`
  (what it shows, the frames/storyboard, labels/formulas, colours to stress) and use that id in the lesson;
  the visual builders implement the briefs.

## Checker (`npm run lessons:check`)
Errors: structure above; missing visual file (until built: reported as "visual missing — brief exists" so
writers can see progress); unknown bank id; highlight phrase not found in the prompt; duplicate question
across the site; KaTeX errors; missing explain/theory. Warnings: word ranges; bank difficulty ≠ slot;
leftover Unicode math outside formulas.
