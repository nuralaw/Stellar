-- Stellar Plus subscriptions. One row per subscribed user. Run in the Supabase SQL editor. Safe to re-run.
-- Written only by the site's server with the service-role key (admin grants today, a payment provider later).
-- Signed-in students may read their own row; there are no insert/update/delete policies, so browsers can't change it.
create table if not exists public.subscriptions (
  user_id     uuid        primary key references auth.users (id) on delete cascade,
  plan        text        not null check (plan in ('plus')),
  expires_at  timestamptz,                      -- null = no end date
  source      text        not null default 'admin',  -- 'admin', 'payment', ...
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.subscriptions_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists subscriptions_touch on public.subscriptions;
create trigger subscriptions_touch before insert or update on public.subscriptions for each row execute function public.subscriptions_touch();

alter table public.subscriptions enable row level security;

drop policy if exists "own row: select" on public.subscriptions;
create policy "own row: select" on public.subscriptions for select to authenticated using ((select auth.uid()) = user_id);
