# Stellar — 20-day roadmap

Free Digital SAT prep: question bank, timed adaptive practice test, lessons, progress tracking.
Stack: Next.js 16 (App Router) + Tailwind 4 + Supabase, deployed on Vercel.

Start: 2026-11-10 · Target launch: 2026-11-29

## Week 1 — Foundation & question bank
- [x] **Day 1** — Scaffold, design tokens (light/dark), site layout, landing page, SAT taxonomy + question data model
- [ ] **Day 2** — Practice mode UI: pick section/domain/difficulty, answer, instant feedback, explanations; KaTeX math rendering
- [ ] **Day 3** — Math content batch #1 (Algebra, Advanced Math)
- [ ] **Day 4** — R&W content batch #1 (all 4 domains)
- [ ] **Day 5** — Supabase: project, auth (email magic link + Google), `profiles` table, sign-in UI  ← *needs Supabase keys*
- [ ] **Day 6** — Save attempts to DB, dashboard with accuracy per domain/skill
- [ ] **Day 7** — Buffer, review, bug fixes

## Week 2 — Practice test & lessons
- [ ] **Day 8** — Test engine: modules, timer, question navigator, mark-for-review, Desmos calculator  ← *needs Desmos API key*
- [ ] **Day 9** — Adaptive module 2 (easier/harder by module 1 result), score estimate 400–1600
- [ ] **Day 10** — Results page, answer review with explanations, save test results
- [ ] **Day 11** — Math content batch #2 (PSDA, Geometry & Trig) + practice test #1 math modules
- [ ] **Day 12** — R&W content batch #2 + practice test #1 R&W modules
- [ ] **Day 13** — Lessons system (MDX), Math lessons
- [ ] **Day 14** — R&W lessons, buffer

## Week 3 — Polish & launch
- [ ] **Day 15** — Dashboard: weak-skill recommendations, streaks
- [ ] **Day 16** — SEO: metadata, sitemap, robots, OG images, landing copy
- [ ] **Day 17** — Mobile, accessibility, dark mode pass
- [ ] **Day 18** — Vercel deploy, env vars, Supabase prod auth URLs, analytics  ← *needs Vercel account*
- [ ] **Day 19** — Testing, content proofreading, fixes
- [ ] **Day 20** — Launch 🚀

## Content targets (MVP)
- Question bank: ~250 original questions (no copied College Board material)
- 1 full adaptive practice test (~150 questions incl. both module-2 variants)
- ~16 lessons (one per major skill group)

## Digital SAT format (reference)
| Section | Modules | Questions/module | Time/module |
|---|---|---|---|
| Reading & Writing | 2 | 27 | 32 min |
| Math | 2 | 22 | 35 min |
