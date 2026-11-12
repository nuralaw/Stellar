# Stellar — 20-day roadmap

Digital SAT prep: question bank, timed adaptive practice test, lessons, progress tracking.
Stack: Next.js 16 (App Router) + Tailwind 4 + Supabase, deployed on Vercel.

Start: 2026-11-10 · Target launch: 2026-11-29

## Status (end of 2026-11-10)
Days 1–4 done in one session: site shell, design, Home dashboard, profile, full question bank
(3,770 questions answered, 3,755 live) and the Question Bank UI. Progress is stored in the browser only.

## Goals for 2026-11-11
**Before we start (you):**
- [ ] Create a Supabase project (supabase.com) and send the Project URL + anon key
- [ ] Optional: Google OAuth client (I'll walk you through it) — otherwise email-only sign-in first
- [ ] Request a Desmos API key (needed for the practice test, Day 8)
- [ ] Skim content/bank/REVIEW.md — 15 hidden questions need a look at the original PDF

**Build (Day 5 + Day 6):**
- [ ] Supabase auth: email magic link (+ Google), `/login` page, sign out, sidebar card shows the real user
- [ ] Database: `profiles`, `attempts`, `bookmarks` tables with row-level security
- [ ] Sync: save answers/bookmarks/goal to the account; on first sign-in, move existing browser progress into it
- [ ] Home dashboard reads from the account when signed in (browser storage stays as the guest fallback)

**Polish:**
- [ ] Re-check difficulty labels (currently skewed to Easy, e.g. Algebra 422 easy / 37 hard) — auto-split into thirds was tried and reverted (user kept the solver labels)
- [x] Mobile pass on the Question Bank: sort + difficulty on phones, filter sheet locks the page, navigator no longer off-screen, toolbar fits with the calculator, calculator sheet keeps "Check answer" visible
- [x] Home "By topic": skill chips with accuracy, each opens that skill in the Question Bank

## Week 1 — Foundation & question bank
- [x] **Day 1** — Scaffold, design tokens (light/dark), site layout, landing page, SAT taxonomy + question data model, logo, orange/gray palette (60-30-10), collapsible sidebar, theme switch
- [x] **Day 2** — Home tab (`/`) personal dashboard: target score, test date + countdown, stats overview (saved in browser until Supabase on Day 5)
- [x] **Day 2** — Student profile page (`/profile`): name/avatar; sidebar profile card
- [x] **Day 2** — Practice mode UI: pick section/domain/difficulty, answer, instant feedback, explanations; KaTeX math rendering; 18 seed questions + `npm run check:content`
- [x] **Day 3** — Imported question bank (3,770 Qs from sat_questions.xlsx), answers + explanations for every question
- [x] **Day 4** — Question Bank UI: filters by topic → skill, difficulty, status; list + solve mode; bookmarks; review list (content/bank/REVIEW.md)
- [ ] **Day 5** — Supabase: project, auth (email magic link + Google), `profiles` table, sign-in UI  ← *needs Supabase keys*
- [ ] **Day 6** — Save attempts to DB, dashboard with accuracy per domain/skill
- [ ] **Day 7** — Buffer, review, bug fixes

## Week 2 — Practice test & lessons
- [x] **Day 8** — Test engine: modules, timer, question navigator, mark-for-review, Desmos calculator (done 2026-11-10 with 71 past papers)
- [ ] **Day 9** — Adaptive module 2 (easier/harder by module 1 result) — *past papers have one module 2 only, so tests are linear*; score estimate 400–1600 ✓
- [x] **Day 10** — Results page, answer review with explanations, save test results
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
- Question bank: 3,770 imported questions (sat_questions.xlsx), answers + explanations written per batch
- 1 full adaptive practice test (~150 questions incl. both module-2 variants)
- ~16 lessons (one per major skill group)

## Digital SAT format (reference)
| Section | Modules | Questions/module | Time/module |
|---|---|---|---|
| Reading & Writing | 2 | 27 | 32 min |
| Math | 2 | 22 | 35 min |
