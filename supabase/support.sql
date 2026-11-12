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
