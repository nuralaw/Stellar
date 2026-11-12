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
