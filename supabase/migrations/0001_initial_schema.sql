-- Initial schema for CCH Automobile.
-- Tables: inventory, quote_requests, market_intel_posts, testimonials,
-- team_members, brands_sourced. RLS is enabled here on every table with
-- default-deny. Public read and service-role policies live in 0002.

create extension if not exists "pgcrypto";

-- inventory ------------------------------------------------------------------

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  model text not null,
  brand text not null,
  year smallint not null,
  condition text not null,
  price_usd_fob numeric(12, 2) not null,
  mileage_km integer,
  battery_health_pct smallint,
  range_km integer,
  body_type text,
  owner_count smallint,
  hero_image_url text,
  gallery_image_urls text[] not null default '{}',
  walkaround_video_url text,
  status text not null default 'available',
  week_added date,
  sold_date date,
  spec_sheet_pdf_url text,
  factory_warranty_months smallint,
  included_paperwork text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_condition_check check (condition in ('new', 'used')),
  constraint inventory_status_check check (status in ('available', 'reserved', 'sold')),
  constraint inventory_battery_health_range check (
    battery_health_pct is null or (battery_health_pct between 0 and 100)
  )
);

create index inventory_status_idx on public.inventory (status);
create index inventory_condition_idx on public.inventory (condition);
create index inventory_week_added_idx on public.inventory (week_added desc);

alter table public.inventory enable row level security;

-- quote_requests -------------------------------------------------------------

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  use_cases text[] not null default '{}',
  budget_min_usd numeric(12, 2),
  budget_max_usd numeric(12, 2),
  timeline text,
  condition_preference text,
  body_type_preferences text[] not null default '{}',
  name text not null,
  whatsapp text not null,
  email text not null,
  destination_city text,
  destination_country text,
  notes text,
  status text not null default 'new',
  assigned_to uuid references auth.users (id) on delete set null,
  notification_status jsonb not null default jsonb_build_object(
    'whatsapp_sent', false,
    'email_sent', false,
    'retry_count', 0,
    'last_error', null
  ),
  ip_address inet,
  turnstile_verified boolean not null default false,
  constraint quote_requests_status_check check (
    status in ('new', 'contacted', 'qualified', 'closed')
  ),
  constraint quote_requests_condition_pref_check check (
    condition_preference is null or condition_preference in ('new', 'used', 'either')
  ),
  constraint quote_requests_budget_order check (
    budget_min_usd is null
    or budget_max_usd is null
    or budget_min_usd <= budget_max_usd
  )
);

create index quote_requests_status_idx on public.quote_requests (status);
create index quote_requests_created_at_idx on public.quote_requests (created_at desc);

alter table public.quote_requests enable row level security;

-- market_intel_posts ---------------------------------------------------------

create table public.market_intel_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  preview text not null,
  body_markdown text not null,
  published_at timestamptz,
  read_time_minutes smallint,
  cover_image_url text,
  author text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index market_intel_posts_published_at_idx
  on public.market_intel_posts (published_at desc);

alter table public.market_intel_posts enable row level security;

-- testimonials ---------------------------------------------------------------

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_title text,
  client_company text,
  client_city text,
  client_country text,
  photo_url text,
  quote text not null,
  vehicle_purchased text,
  displayed_on_homepage boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index testimonials_order_idx on public.testimonials (order_index);

alter table public.testimonials enable row level security;

-- team_members --------------------------------------------------------------

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio_short text,
  bio_long text,
  photo_url text,
  displayed_on_homepage boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index team_members_order_idx on public.team_members (order_index);

alter table public.team_members enable row level security;

-- brands_sourced ------------------------------------------------------------

create table public.brands_sourced (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  country text,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index brands_sourced_order_idx on public.brands_sourced (order_index);
create index brands_sourced_active_idx on public.brands_sourced (active);

alter table public.brands_sourced enable row level security;

-- updated_at triggers --------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger inventory_set_updated_at
  before update on public.inventory
  for each row execute function public.set_updated_at();

create trigger market_intel_posts_set_updated_at
  before update on public.market_intel_posts
  for each row execute function public.set_updated_at();
