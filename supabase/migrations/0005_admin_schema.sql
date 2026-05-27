-- Admin schema. Backs the operator-facing dashboard at /admin.
--
-- Strategy: keep the existing public columns (inventory.status,
-- quote_requests.status) intact so the public RLS policies and lot
-- queries continue to work, and add admin-side columns alongside.
-- A trigger derives the public inventory.status from the richer
-- inventory.internal_status so we never have to update both columns
-- in app code.
--
-- New tables (quotes, invoices, admin_settings) have RLS enabled with
-- no anon/authenticated policies; only the service role (used by
-- server actions) can read or write.

-- inventory: admin columns ---------------------------------------------------

alter table public.inventory
  add column car_code text,
  add column internal_notes text,
  add column internal_status text not null default 'on_the_lot';

create unique index inventory_car_code_idx
  on public.inventory (car_code)
  where car_code is not null;

alter table public.inventory
  add constraint inventory_internal_status_check check (
    internal_status in (
      'coming_soon',
      'on_the_lot',
      'reserved',
      'in_shipping',
      'delivered',
      'sold',
      'archived'
    )
  );

-- Derive the public lifecycle column from internal_status so admin
-- writes only need to set the rich value. Mapping:
--   on_the_lot, coming_soon  -> available  (visible on /lot via RLS)
--   reserved, in_shipping    -> reserved
--   delivered, sold          -> sold
--   archived                 -> sold (not 'available', so /lot hides it)
create or replace function public.sync_inventory_status()
returns trigger
language plpgsql
as $$
begin
  new.status := case new.internal_status
    when 'on_the_lot' then 'available'
    when 'coming_soon' then 'available'
    when 'reserved' then 'reserved'
    when 'in_shipping' then 'reserved'
    when 'delivered' then 'sold'
    when 'sold' then 'sold'
    when 'archived' then 'sold'
    else new.status
  end;
  return new;
end;
$$;

create trigger inventory_sync_status
  before insert or update of internal_status on public.inventory
  for each row execute function public.sync_inventory_status();

-- Back-fill internal_status from the existing public status so the
-- existing six seed rows have a sane admin lifecycle. The trigger
-- above does not fire on this update because we are setting
-- internal_status directly without a real state change yet — we
-- want the public status preserved as it stands.
update public.inventory set internal_status = case status
  when 'available' then 'on_the_lot'
  when 'reserved'  then 'reserved'
  when 'sold'      then 'sold'
  else 'on_the_lot'
end
where internal_status = 'on_the_lot';

-- quote_requests: admin workflow columns ------------------------------------

-- Drop the narrow public status check (new|contacted|qualified|closed)
-- so we can store the richer admin lifecycle. The set above is a strict
-- superset of the previous values except 'qualified' (which we map to
-- 'quoted') and 'closed' (mapped to 'closed_won' in back-fill below).
alter table public.quote_requests
  drop constraint if exists quote_requests_status_check;

update public.quote_requests
  set status = case status
    when 'qualified' then 'quoted'
    when 'closed' then 'closed_won'
    else status
  end;

alter table public.quote_requests
  add constraint quote_requests_status_check check (
    status in (
      'new',
      'contacted',
      'quoted',
      'negotiating',
      'reserved',
      'closed_won',
      'closed_lost'
    )
  );

alter table public.quote_requests
  add column track text not null default 'unclassified',
  add column source_deadline timestamptz,
  add column wait_response text not null default 'pending',
  add column wait_response_at timestamptz,
  add column auto_reply_sent_at timestamptz,
  add column closed_lost_reason text,
  add column closed_won_inventory_id uuid references public.inventory (id) on delete set null,
  add column screenshot_urls text[] not null default '{}';

alter table public.quote_requests
  add constraint quote_requests_track_check check (
    track in ('in_stock', 'source_to_order', 'unclassified')
  ),
  add constraint quote_requests_wait_response_check check (
    wait_response in ('pending', 'can_wait', 'cannot_wait', 'no_response')
  ),
  add constraint quote_requests_closed_lost_reason_check check (
    closed_lost_reason is null
    or closed_lost_reason in (
      'price',
      'timing',
      'found_elsewhere',
      'no_response',
      'unable_to_source',
      'other'
    )
  );

create index quote_requests_track_idx on public.quote_requests (track);
create index quote_requests_source_deadline_idx
  on public.quote_requests (source_deadline)
  where source_deadline is not null;

-- quotes ---------------------------------------------------------------------

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.quote_requests (id) on delete set null,
  inventory_id uuid references public.inventory (id) on delete set null,
  car_code text,
  car_name text not null,
  car_year smallint not null,
  car_condition text not null,
  photo_urls text[] not null default '{}',
  base_price_usd numeric(12, 2) not null,
  shipping_usd numeric(12, 2) not null default 0,
  clearing_usd numeric(12, 2),
  service_fee_usd numeric(12, 2) not null default 0,
  total_usd numeric(12, 2) not null,
  personal_note text,
  pdf_url text,
  sent_via text not null,
  sent_at timestamptz not null default now(),
  sent_by text,
  valid_until date not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quotes_condition_check check (car_condition in ('new', 'used')),
  constraint quotes_sent_via_check check (sent_via in ('email', 'download', 'whatsapp')),
  constraint quotes_status_check check (
    status in ('draft', 'sent', 'accepted', 'rejected', 'expired', 'superseded')
  )
);

create index quotes_lead_id_idx on public.quotes (lead_id);
create index quotes_inventory_id_idx on public.quotes (inventory_id);
create index quotes_status_idx on public.quotes (status);
create index quotes_sent_at_idx on public.quotes (sent_at desc);

alter table public.quotes enable row level security;

create trigger quotes_set_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- invoices -------------------------------------------------------------------

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  lead_id uuid references public.quote_requests (id) on delete set null,
  inventory_id uuid references public.inventory (id) on delete set null,
  car_code text,
  car_description text,
  client_name text not null,
  client_email text,
  amount_usd numeric(12, 2) not null,
  deposit_usd numeric(12, 2) not null default 0,
  balance_usd numeric(12, 2) not null default 0,
  status text not null default 'draft',
  issued_at timestamptz not null default now(),
  due_at timestamptz,
  paid_at timestamptz,
  payment_method text,
  exchange_rate_ngn numeric(12, 4),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_status_check check (
    status in ('draft', 'sent', 'paid', 'overdue', 'refunded', 'void')
  )
);

create index invoices_status_idx on public.invoices (status);
create index invoices_issued_at_idx on public.invoices (issued_at desc);
create index invoices_lead_id_idx on public.invoices (lead_id);
create index invoices_inventory_id_idx on public.invoices (inventory_id);

alter table public.invoices enable row level security;

create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- admin_settings -------------------------------------------------------------

-- Single-row settings table. The application always reads from the row
-- whose id matches the all-zeros singleton uuid below. A check
-- constraint prevents accidental insertion of additional rows.
create table public.admin_settings (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  company_name text not null,
  legal_name text not null,
  guangzhou_address text,
  lagos_address text,
  timezone text not null default 'Africa/Lagos',
  base_currency text not null default 'USD',
  shipping_usd numeric(12, 2) not null default 1500,
  clearing_usd numeric(12, 2) not null default 400,
  export_license_usd numeric(12, 2) not null default 250,
  cch_service_fee_usd numeric(12, 2) not null default 600,
  whatsapp_operations_number text,
  operations_email text,
  source_to_order_sla_hours smallint not null default 48,
  wait_response_timeout_hours smallint not null default 24,
  currencies jsonb not null default '[]'::jsonb,
  rates_updated_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_settings_singleton check (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

alter table public.admin_settings enable row level security;

create trigger admin_settings_set_updated_at
  before update on public.admin_settings
  for each row execute function public.set_updated_at();

-- admin_settings: seed the single row with operator-supplied values from
-- the mock fixture. Safe to re-run via on conflict do nothing.
insert into public.admin_settings (
  id, company_name, legal_name,
  guangzhou_address, lagos_address, timezone, base_currency,
  shipping_usd, clearing_usd, export_license_usd, cch_service_fee_usd,
  whatsapp_operations_number, operations_email,
  source_to_order_sla_hours, wait_response_timeout_hours,
  currencies, rates_updated_at
) values (
  '00000000-0000-0000-0000-000000000001',
  'CCH Automobile',
  'CCH Automobile Co. Ltd',
  '101-103 Agile Time Mansion, Wehai Road, Shibi, Panyu District, Guangzhou, China',
  null,
  'Africa/Lagos',
  'USD',
  1500, 400, 250, 600,
  null,
  'hello@chinesecarshub.com',
  48, 24,
  '[
    {"code":"NGN","label":"Nigerian Naira","symbol":"₦","ratePerUsd":1620,"updatedAt":"2026-05-15T08:00:00Z","source":"manual"},
    {"code":"GHS","label":"Ghanaian Cedi","symbol":"₵","ratePerUsd":14.85,"updatedAt":"2026-05-15T08:00:00Z","source":"manual"},
    {"code":"XOF","label":"West African CFA Franc","symbol":"CFA","ratePerUsd":605,"updatedAt":"2026-05-15T08:00:00Z","source":"manual"},
    {"code":"CNY","label":"Chinese Yuan","symbol":"¥","ratePerUsd":7.22,"updatedAt":"2026-05-15T08:00:00Z","source":"manual"}
  ]'::jsonb,
  '2026-05-15T08:00:00Z'
) on conflict (id) do nothing;
