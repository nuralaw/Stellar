# Lessons

One Markdown file per Digital SAT skill, plus a few strategy lessons. The site's /lessons page renders these files.

```
content/lessons/
  rw/<skill-id>.md         Reading and Writing skills (ids from src/lib/taxonomy.ts)
  math/<skill-id>.md       Math skills
  strategy/<slug>.md       Test-wide strategy (format, pacing, Desmos)
```

## File format

Frontmatter: simple `key: value` lines only (no lists, no nesting, no quotes needed).

```
---
title: Words in Context
skill: words-in-context
domain: craft-structure
section: rw
summary: One plain sentence: what you'll be able to do after this lesson.
minutes: 8
---
```

- `skill` / `domain` / `section` must match `src/lib/taxonomy.ts` (strategy lessons: `skill: <slug>`, `domain: strategy`, `section: strategy`).
- `minutes` = honest reading time.

## Body: sections in this order

```
## What this question looks like
## The method
## Rules and formulas you need
## Worked examples
## Traps to avoid
## Desmos shortcut          (math only, when Desmos genuinely helps; omit otherwise)
## Quick checklist
```

- **What this question looks like** — how to recognize it in a few seconds (typical question stems, what's on screen).
- **The method** — a numbered step-by-step routine a student can follow on every question of this type.
- **Rules and formulas you need** — the facts to know cold. Tables are welcome.
- **Worked examples** — 2–4 ORIGINAL examples written by the author, Digital SAT style, each as
  `### Example 1: <short name>`, then the question, choices (A)–(D) as a list when multiple choice, then
  **Solution** walking through the method, ending with `**Answer:** (B)`.
- **Traps to avoid** — the wrong-answer patterns test makers use, each as a bullet with why it's wrong.
- **Quick checklist** — 4–7 short bullets to run through before answering.

## Markdown subset the site renders

- `##` and `###` headings, paragraphs, `-` bullets, `1.` numbered lists (one level, no nesting)
- `**bold**`, `*italic*`, `` `code` ``, `[links](https://…)`
- tables with a header row (`| a | b |` + `|---|---|`)
- callouts as blockquotes that start with a bold label: `> **Tip:** …`, `> **Trap:** …`, `> **Key idea:** …`
- No HTML, no images, no LaTeX. Write math in plain Unicode: x², x³, √x, ≤, ≥, ≠, π, θ, −, ×, ÷, ½, fractions as `a/b`, and use `code` for longer expressions, e.g. `y = 2x² − 3x + 1`.

## Style: how a lesson should read (UI/UX rules)

The lesson page is the product. A student skims first, then reads. Write for that.

- **Lead with the payoff.** Right after the frontmatter, before the first `##`, put one callout:
  `> **Key idea:** <the single most useful sentence of the lesson>`.
- **Short blocks.** Paragraphs ≤ 3 sentences (~60 words). Sequences and lists of things → bullets or a numbered list.
  One idea per bullet, ≤ ~25 words.
- **Scannable.** Each `##` section opens with its point in the first sentence. Use `###` sub-headings when a section
  covers several sub-types. Same section names and order in every lesson (see above).
- **Bold sparingly.** Only key terms and the words a student must notice, at most about one per paragraph.
  Never bold whole sentences. Italic only for words-as-words (*their*, *however*).
- **Callouts are rare.** At most 4 per lesson, labels only `Key idea`, `Tip`, `Trap`, `Remember`. One paragraph each.
- **Tables fit a phone.** At most 4 columns, short cells (a few words). Long explanations go below the table.
- **No repetition.** Say each fact once, in the section where it belongs. Traps live in **Traps to avoid**,
  not repeated in the method. Cut filler ("It's important to note that…", "Basically…") and hedging.
- **Plain words.** Explain a term the first time it appears. Prefer "pick", "check", "cross out" over jargon.
- **Honest numbers.** `minutes` = words ÷ 150, rounded. `summary` ≤ 160 characters, one sentence, no fluff.
- **Nothing that breaks rendering.** No line may start with `|` unless it's a table row (write absolute value as
  `abs(2x − 1)` in code or "the absolute value of 2x − 1"). No nested lists.

## Rules for authors

- Plain, friendly language a 16-year-old understands on first read. Short sentences. Explain every term the first time.
- Everything is written in our own words. Never copy text, explanations or questions from any source; never reproduce official College Board questions. No "Sources" section: research stays behind the scenes.
- Check every worked example twice: the correct answer must be right and each wrong choice must be wrong for a reason you can state.
