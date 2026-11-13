-- Stellar: every table at once. Paste the whole file into Supabase → SQL Editor → Run. Safe to re-run.
-- Same content as competition.sql + reports.sql + support.sql.

-- ═══ competition.sql ═══
-- Weekly competition entries. Run once in the Supabase SQL editor.
-- The site's server talks to this table with the service-role key (SUPABASE_SERVICE_ROLE_KEY, server-only env var).
-- RLS is on with no policies, so the public anon key can't read or write it.

create table if not exists public.competition_entries (
  week          text    not null,            -- Monday of the week (UTC), "YYYY-MM-DD"
  round         text    not null check (round in ('rw', 'math')),
  user_id       text    not null,
  name          text    not null,
  avatar        text    not null default '',
  ids           text[]  not null,            -- question ids, in order
  started_at    bigint  not null,            -- Unix ms
  responses     jsonb   not null default '{}'::jsonb,
  saved_at      bigint,
  submitted_at  bigint,
  correct       jsonb,                       -- {"easy": n, "medium": n, "hard": n}
  base          integer,
  bonus         integer,
  score         integer,
  seconds       integer,
  annulled      boolean not null default false, -- left full screen mid-round: score 0, off the boards
  primary key (week, round, user_id)
);

create index if not exists competition_entries_board on public.competition_entries (week, score desc) where submitted_at is not null;

alter table public.competition_entries enable row level security;

-- Added 2026-11-11 (full-screen rule). Safe to re-run on an existing table.
alter table public.competition_entries add column if not exists annulled boolean not null default false;

-- ═══ reports.sql ═══
-- Problem reports on questions ("answer key is wrong", typos…). Run once in the Supabase SQL editor.
-- Written by the site's server with the service-role key; RLS on with no policies, so browsers can't read or write it.
-- Read them in the Supabase table editor, e.g. newest first, or grouped by qid.

create table if not exists public.question_reports (
  id          bigint generated always as identity primary key,
  qid         text        not null,           -- question id, e.g. "rw-0001"
  reason      text        not null check (reason in ('answer', 'explanation', 'typo', 'display', 'other')),
  note        text        not null default '',
  telegram    text        not null default '',  -- optional usernames, so we can reply
  instagram   text        not null default '',
  user_id     text,                           -- anonymous browser id, if sent
  created_at  timestamptz not null default now(),
  resolved    boolean     not null default false
);

create index if not exists question_reports_qid on public.question_reports (qid);

alter table public.question_reports enable row level security;

-- Added 2026-11-12, for a table created before then:
alter table public.question_reports add column if not exists telegram text not null default '';
alter table public.question_reports add column if not exists instagram text not null default '';

-- ═══ support.sql ═══
-- Support requests from the Home page's Support button. Run once in the Supabase SQL editor.
-- Written by the site's server with the service-role key; RLS on with no policies, so browsers can't read or write it.
-- Read them in the Supabase table editor (newest first); screenshots are in Storage → support-screenshots.

create table if not exists public.support_requests (
  id          text        primary key,        -- e.g. "2026-11-12-1a2b3c4d"
  telegram    text        not null default '',
  instagram   text        not null default '',
  other       text        not null default '',  -- WhatsApp, email…
  message     text        not null,
  screenshot  text,                           -- file name in the support-screenshots bucket
  user_id     text,                           -- anonymous browser id, if sent
  created_at  timestamptz not null default now(),
  -- your notes: was it a real bug (→ 50% off a subscription), did you reply
  bug_confirmed boolean   not null default false,
  resolved      boolean   not null default false
);

alter table public.support_requests enable row level security;

-- Private bucket for the screenshots (only the service-role key can read or write).
insert into storage.buckets (id, name, public) values ('support-screenshots', 'support-screenshots', false)
on conflict (id) do nothing;
