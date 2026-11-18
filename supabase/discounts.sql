-- Personal discounts: "50% off the first month of Monthly" for a student whose bug report was confirmed (or given by hand in
-- /admin → Accounts). Run in the Supabase SQL editor. Safe to re-run.
-- One row per discount. An OPEN one (not used, not revoked) is put into that student's checkout link on /plus as the shared
-- Gumroad code GUMROAD_BUG_CODE; the sale webhook closes it (used_at, sale_id). See docs/PAYMENTS.md → Bug-report discounts.
-- Written and read only by the site's server with the service-role key; RLS on, no policies, so browsers can't touch it.
create table if not exists public.discounts (
  id          bigint      generated always as identity primary key,
  user_id     uuid        not null,
  percent     int         not null check (percent between 1 and 100),
  source      text        not null check (source in ('bug', 'admin')),
  support_id  text        unique,               -- the support request that earned it (null for a hand-made one)
  note        text,
  created_at  timestamptz not null default now(),
  used_at     timestamptz,                      -- set when the Gumroad sale with the code arrives
  sale_id     text,                             -- that sale
  revoked_at  timestamptz
);

-- At most one open discount per student (no stacking).
create unique index if not exists discounts_one_open_per_user on public.discounts (user_id) where used_at is null and revoked_at is null;

alter table public.discounts enable row level security;
