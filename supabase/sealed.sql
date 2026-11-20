-- Admin-only encryption of personal data. Run after support.sql, reports.sql and payments.sql (npm run db:apply -- supabase/sealed.sql). Safe to re-run.
-- The site's server seals contacts, messages, notes, buyer emails and ping payloads with the admin's PUBLIC key (ADMIN_SEAL_PUBLIC_KEY) and
-- stores the ciphertext in `sealed`; the plain columns stay empty for new rows. Only the admin's browser holds the private key.
-- Rows written before this are encrypted in place by `npm run data:seal`.

alter table public.support_requests add column if not exists sealed text;
alter table public.support_requests alter column message drop not null;  -- new rows keep '' here; the text is in `sealed`
alter table public.question_reports add column if not exists sealed text;
alter table public.purchases add column if not exists sealed text;
alter table public.payment_events add column if not exists sealed text;

-- Latest purchases for /admin -> Revenue: `sealed` carries the buyer's email for new rows (the admin's browser opens it); `email` is only filled for old rows.
create or replace function public.admin_recent_purchases(p_limit int default 50)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(x order by x.sale_at desc), '[]'::jsonb)
  from (
    select p.sale_id, p.sale_at, p.email, p.sealed, p.user_id, p.plan, p.product_name, p.price_cents, p.fee_cents, p.currency,
           p.is_recurring, p.test, p.refunded, p.disputed
    from public.purchases p
    where p.provider = 'gumroad'
    order by p.sale_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
  ) x;
$$;

revoke all on function public.admin_recent_purchases(int) from public, anon, authenticated;
grant execute on function public.admin_recent_purchases(int) to service_role;
