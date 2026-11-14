# Stellar — roadmap

Digital SAT prep: question bank, timed practice tests, lessons, vocabulary, weekly tournament, progress tracking.
Stack: Next.js 16 (App Router) + Tailwind 4 + Supabase, deployed on Vercel (team stellar1600, domain stellar1600.com).

Start: 2026-11-10 · Target launch: 2026-11-29

## Status (2026-11-14)
Built: site shell and design, Home dashboard, Statistics, profile with avatar, Question Bank (5,773 past-paper
questions), Mistakes notebook with spaced review, 71 timed past-paper tests with scores and review, 33 lessons
(topic animations, parts, Desmos walkthroughs), Vocabulary (805 words), Weekly tournament with leaderboards,
Support and question reports, student accounts (email + Google) with progress sync, /admin
(Overview, Accounts, Support, Reports, Competition, Traffic), our own visit counter.

## Your part (only you can do these)
- [ ] DNS for stellar1600.com at the registrar (the vercel.app alias redirects there, so the public site is down until this is set)
- [ ] Resend API key → I set it up as Supabase SMTP and switch the sign-in emails to a 6-digit code
- [ ] Publish the Google OAuth app (needs Branding: home page, privacy policy, domain; after DNS)
- [ ] Check the Supabase redirect URLs (`/auth/callback**`)
- [ ] Decide on the flagged bank questions (see "Question bank fixes")
- [ ] Optional: Plausible (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`; Stats API needs the $19/mo plan), see docs/PLAUSIBLE.md

## Still to build
**Before launch**
- [ ] SEO: metadata per page, sitemap, robots, OG images, landing copy
- [ ] Accessibility, mobile and dark-mode pass across all pages
- [ ] Testing, content proofreading, fixes
- [ ] Privacy policy page (also needed for Google OAuth)

**Learning**
- [ ] Weak-skill recommendations on Home (streaks already exist)
- [ ] Recheck difficulty labels (skewed to Easy, e.g. Algebra 422 easy / 37 hard; auto-split into thirds was reverted)
- [ ] Adaptive module 2 in tests (past papers have one module 2 only, so tests are linear today)

**Lessons (reviewer ideas)**
- [ ] Shuffle quiz options
- [ ] "Try it yourself" after a Desmos demo
- [ ] Part progress bar on /lessons cards
- [ ] End screen with one next action
- [ ] Step animations for visual math parts
- [ ] Daily lesson goal
- [ ] Recommend lessons from mistakes

**Tournament**
- [ ] Rewards for winners (leaderboards only today)

**Analytics**
- [ ] Wire the 8 `trackEvent()` calls (places listed in src/lib/analytics.ts)

**Accounts**
- [ ] A progress reset on one device should clear the other devices too
- [ ] Tournament: stop a guest from submitting under another account's UUID

**Business**
- [ ] Paid subscription (gate is prepared in src/lib/access.ts; bug reporters were promised 50% off)

## Question bank fixes (ask before changing)
- rw-1741: answer probably wrong · rw-10142: debatable
- m-12224, m-12418: explanations contradict the choices
- Garbled tables: rw-0121, rw-0228, rw-0102, m-1370, m-1217 · m-1658: line break

## Launch
- [ ] Day 20 — Launch 🚀

## Digital SAT format (reference)
| Section | Modules | Questions/module | Time/module |
|---|---|---|---|
| Reading & Writing | 2 | 27 | 32 min |
| Math | 2 | 22 | 35 min |
