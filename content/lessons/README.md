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
## Sources
```

- **What this question looks like** — how to recognize it in a few seconds (typical question stems, what's on screen).
- **The method** — a numbered step-by-step routine a student can follow on every question of this type.
- **Rules and formulas you need** — the facts to know cold. Tables are welcome.
- **Worked examples** — 2–4 ORIGINAL examples written by the author, Digital SAT style, each as
  `### Example 1: <short name>`, then the question, choices (A)–(D) as a list when multiple choice, then
  **Solution** walking through the method, ending with `**Answer:** (B)`.
- **Traps to avoid** — the wrong-answer patterns test makers use, each as a bullet with why it's wrong.
- **Quick checklist** — 4–7 short bullets to run through before answering.
- **Sources** — bullet list of `[Title](https://url)` links to the best resources consulted (videos, guides, threads).

## Markdown subset the site renders

- `##` and `###` headings, paragraphs, `-` bullets, `1.` numbered lists (one level, no nesting)
- `**bold**`, `*italic*`, `` `code` ``, `[links](https://…)`
- tables with a header row (`| a | b |` + `|---|---|`)
- callouts as blockquotes that start with a bold label: `> **Tip:** …`, `> **Trap:** …`, `> **Key idea:** …`
- No HTML, no images, no LaTeX. Write math in plain Unicode: x², x³, √x, ≤, ≥, ≠, π, θ, −, ×, ÷, ½, fractions as `a/b`, and use `code` for longer expressions, e.g. `y = 2x² − 3x + 1`.

## Rules for authors

- Plain, friendly language a 16-year-old understands on first read. Short sentences. Explain every term the first time.
- Everything is written in our own words. Never copy text, explanations or questions from any source; never reproduce official College Board questions. Sources are for research and are credited in **Sources**.
- Check every worked example twice: the correct answer must be right and each wrong choice must be wrong for a reason you can state.
