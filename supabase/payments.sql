-- Stellar Plus payments (Gumroad): one row per sale, a log of every webhook call, and the revenue numbers for /admin → Revenue.
-- Needs supabase/subscriptions.sql first (the KPIs count active subscriptions). Safe to re-run.
-- Only the site's server (service-role key) can read or write these; RLS on, no policies.

create table if not exists public.purchases (
  sale_id         text        primary key,                       -- Gumroad's sale id (a repeated ping updates the same row)
  provider        text        not null default 'gumroad',
  user_id         uuid        references auth.users (id) on delete set null,
  email           text,
  plan            text        check (plan in ('monthly', 'pass')),  -- null = product not mapped to a plan
  product_id      text,
  product_name    text,
  price_cents     int         not null default 0,
  fee_cents       int         not null default 0,
  currency        text        not null default 'usd',
  subscription_id text,
  is_recurring    boolean     not null default false,            -- a renewal charge of a membership
  test            boolean     not null default false,            -- the seller bought their own product
  refunded        boolean     not null default false,
  disputed        boolean     not null default false,
  sale_at         timestamptz not null,
  access_until    timestamptz,                                   -- the Plus end date this sale granted
  raw             jsonb,                                         -- the ping minus the card (legacy rows; new ones are sealed, see sealed.sql)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists purchases_sale_at on public.purchases (sale_at);
create index if not exists purchases_user_id on public.purchases (user_id);
create index if not exists purchases_subscription_id on public.purchases (subscription_id);

create or replace function public.purchases_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists purchases_touch on public.purchases;
create trigger purchases_touch before insert or update on public.purchases for each row execute function public.purchases_touch();

-- Every call to the webhook (accepted or not), so a missing sale can be traced.
create table if not exists public.payment_events (
  id            bigint      generated always as identity primary key,
  provider      text        not null default 'gumroad',
  resource_name text,
  ref_id        text,
  verified      boolean     not null default false,
  note          text,
  payload       jsonb,
  at            timestamptz not null default now()
);
create index if not exists payment_events_at on public.payment_events (at);

-- Personal data (buyer email, the ping) is stored encrypted for the admin only (see sealed.sql); these columns hold the ciphertext.
alter table public.purchases add column if not exists sealed text;
alter table public.payment_events add column if not exists sealed text;

alter table public.purchases enable row level security;
alter table public.payment_events enable row level security;

-- The account with this email (case-insensitive), or null.
create or replace function public.admin_user_id_by_email(p_email text)
returns uuid language sql stable security definer set search_path = '' as $$
  select u.id from auth.users u where lower(u.email) = lower(p_email) order by u.created_at limit 1;
$$;

-- Revenue = sales with test = false, refunded = false, disputed = false. gross = price, net = price - fee (integer cents).
-- Totals for [p_from, p_to): { gross_cents, net_cents, sales, refunds }. Internal helper for the functions below.
create or replace function public.revenue_totals(p_from timestamptz, p_to timestamptz)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'gross_cents', coalesce(sum(p.price_cents) filter (where not p.refunded and not p.disputed), 0),
    'net_cents', coalesce(sum(p.price_cents - p.fee_cents) filter (where not p.refunded and not p.disputed), 0),
    'sales', count(*) filter (where not p.refunded and not p.disputed),
    'refunds', count(*) filter (where p.refunded or p.disputed)
  )
  from public.purchases p
  where not p.test and p.sale_at >= p_from and p.sale_at < p_to;
$$;

-- Revenue for a period, bucketed by day | week | month in the admin's time zone.
-- Returns { series: [{t, gross_cents, net_cents, sales, refunds}], totals: {...}, previous: {...}, by_plan: {monthly, pass, other: {gross_cents, sales}} }.
-- previous = the same-length period right before p_from. refunds = refunded or disputed sales (count) by sale date.
create or replace function public.admin_revenue_stats(p_from timestamptz, p_to timestamptz, p_bucket text, p_tz text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  span interval := p_to - p_from;
  result jsonb;
begin
  if p_bucket not in ('day', 'week', 'month') then raise exception 'bad bucket'; end if;
  with buckets as (
    select g as t
    from generate_series(
      date_trunc(p_bucket, p_from at time zone p_tz),
      date_trunc(p_bucket, (p_to - interval '1 second') at time zone p_tz),
      ('1 ' || p_bucket)::interval
    ) g
  ),
  agg as (
    select date_trunc(p_bucket, p.sale_at at time zone p_tz) t,
           coalesce(sum(p.price_cents) filter (where not p.refunded and not p.disputed), 0) gross,
           coalesce(sum(p.price_cents - p.fee_cents) filter (where not p.refunded and not p.disputed), 0) net,
           count(*) filter (where not p.refunded and not p.disputed) sales,
           count(*) filter (where p.refunded or p.disputed) refunds
    from public.purchases p
    where not p.test and p.sale_at >= p_from and p.sale_at < p_to
    group by 1
  ),
  plans as (
    select coalesce(p.plan, 'other') plan, sum(p.price_cents) gross, count(*) sales
    from public.purchases p
    where not p.test and not p.refunded and not p.disputed and p.sale_at >= p_from and p.sale_at < p_to
    group by 1
  )
  select jsonb_build_object(
    'series', coalesce((
      select jsonb_agg(jsonb_build_object(
        't', to_char(b.t, 'YYYY-MM-DD'),
        'gross_cents', coalesce(a.gross, 0),
        'net_cents', coalesce(a.net, 0),
        'sales', coalesce(a.sales, 0),
        'refunds', coalesce(a.refunds, 0)
      ) order by b.t)
      from buckets b
      left join agg a on a.t = b.t
    ), '[]'::jsonb),
    'totals', public.revenue_totals(p_from, p_to),
    'previous', public.revenue_totals(p_from - span, p_from),
    'by_plan', jsonb_build_object(
      'monthly', jsonb_build_object('gross_cents', coalesce((select gross from plans where plan = 'monthly'), 0), 'sales', coalesce((select sales from plans where plan = 'monthly'), 0)),
      'pass', jsonb_build_object('gross_cents', coalesce((select gross from plans where plan = 'pass'), 0), 'sales', coalesce((select sales from plans where plan = 'pass'), 0)),
      'other', jsonb_build_object('gross_cents', coalesce((select gross from plans where plan = 'other'), 0), 'sales', coalesce((select sales from plans where plan = 'other'), 0))
    )
  ) into result;
  return result;
end $$;

-- Headline numbers. Windows are in p_tz: today = since local midnight, yesterday = the day before, week = since Monday,
-- month = since the 1st; last_week / last_month = the same elapsed span one week / one month earlier.
-- rejected_7d = calls rejected for a missing or wrong signature (payment_events notes starting 'sig:') in the last 7 days.
-- Returns { today, yesterday, week, last_week, month, last_month, all_time: {gross_cents, net_cents, sales},
--           active_plus, active_monthly, active_pass, unlinked_sales, rejected_7d, last_sale_at, currency }.
-- plpgsql (not sql) so this file can be created before subscriptions.sql has been run.
create or replace function public.admin_revenue_kpis(p_tz text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  now_l timestamp := now() at time zone p_tz;
  day_s timestamptz := date_trunc('day', now_l) at time zone p_tz;
  yday_s timestamptz := (date_trunc('day', now_l) - interval '1 day') at time zone p_tz;
  week_s timestamptz := date_trunc('week', now_l) at time zone p_tz;
  lweek_s timestamptz := (date_trunc('week', now_l) - interval '1 week') at time zone p_tz;
  lweek_e timestamptz := (now_l - interval '1 week') at time zone p_tz;
  month_s timestamptz := date_trunc('month', now_l) at time zone p_tz;
  lmonth_s timestamptz := (date_trunc('month', now_l) - interval '1 month') at time zone p_tz;
  lmonth_e timestamptz := (now_l - interval '1 month') at time zone p_tz;
  n timestamptz := now();
  a_plus int; a_monthly int; a_pass int;
begin
  select count(*),
         count(*) filter (where lp.plan = 'monthly'),
         count(*) filter (where lp.plan = 'pass')
    into a_plus, a_monthly, a_pass
  from public.subscriptions s
  left join lateral (
    select p.plan from public.purchases p
    where p.user_id = s.user_id and p.provider = 'gumroad' and not p.test and not p.refunded and not p.disputed
    order by p.sale_at desc limit 1
  ) lp on true
  where s.expires_at is null or s.expires_at > n;

  return jsonb_build_object(
    'today', public.revenue_totals(day_s, 'infinity') - 'refunds',
    'yesterday', public.revenue_totals(yday_s, day_s) - 'refunds',
    'week', public.revenue_totals(week_s, 'infinity') - 'refunds',
    'last_week', public.revenue_totals(lweek_s, lweek_e) - 'refunds',
    'month', public.revenue_totals(month_s, 'infinity') - 'refunds',
    'last_month', public.revenue_totals(lmonth_s, lmonth_e) - 'refunds',
    'all_time', public.revenue_totals('-infinity', 'infinity') - 'refunds',
    'active_plus', a_plus,
    'active_monthly', a_monthly,
    'active_pass', a_pass,
    'unlinked_sales', (select count(*) from public.purchases p where p.provider = 'gumroad' and not p.test and p.user_id is null),
    'rejected_7d', (select count(*) from public.payment_events e where not e.verified and e.note like 'sig:%' and e.at > n - interval '7 days'),
    'last_sale_at', (select max(p.sale_at) from public.purchases p where p.provider = 'gumroad' and not p.test),
    'currency', coalesce((select p.currency from public.purchases p where p.provider = 'gumroad' group by p.currency order by count(*) desc, p.currency limit 1), 'usd')
  );
end $$;

-- Latest purchases for the list under the chart (admin only). Test sales are included and flagged; the synthetic 'admin:<uid>' rows
-- (provider 'admin', see extendPlus in lib/access-server.ts) are left out, here and in every count above.
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

revoke all on function public.admin_user_id_by_email(text) from public, anon, authenticated;
revoke all on function public.revenue_totals(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_revenue_stats(timestamptz, timestamptz, text, text) from public, anon, authenticated;
revoke all on function public.admin_revenue_kpis(text) from public, anon, authenticated;
revoke all on function public.admin_recent_purchases(int) from public, anon, authenticated;
revoke all on function public.purchases_touch() from public, anon, authenticated;
grant execute on function public.admin_user_id_by_email(text) to service_role;
grant execute on function public.admin_revenue_stats(timestamptz, timestamptz, text, text) to service_role;
grant execute on function public.admin_revenue_kpis(text) to service_role;
grant execute on function public.admin_recent_purchases(int) to service_role;
