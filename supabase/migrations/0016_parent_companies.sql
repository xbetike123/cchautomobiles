-- parent_companies -----------------------------------------------------------

-- CCH Automobile trades under a parent entity, printed as "C/O <legal name>"
-- on quotes and invoices. That entity used to be hardcoded in the PDF
-- templates; operators now maintain the list in /admin/settings and pick one
-- per document.

create table public.parent_companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint parent_companies_legal_name_not_blank
    check (length(btrim(legal_name)) > 0)
);

-- Names are matched case-insensitively so "Naiyuan Mart Co. Ltd" and
-- "naiyuan mart co. ltd" cannot both exist.
create unique index parent_companies_legal_name_idx
  on public.parent_companies (lower(btrim(legal_name)));

-- At most one company may be the default. Partial unique index: rows with
-- is_default = false are not covered, so any number of them can coexist.
create unique index parent_companies_single_default_idx
  on public.parent_companies (is_default)
  where is_default;

alter table public.parent_companies enable row level security;

create trigger parent_companies_set_updated_at
  before update on public.parent_companies
  for each row execute function public.set_updated_at();

-- Seed the entity that was hardcoded in the PDF templates, so existing
-- behaviour is preserved on day one.
insert into public.parent_companies (legal_name, is_default)
values ('Naiyuan Mart Co. Ltd', true)
on conflict do nothing;

-- Documents store the chosen legal name as text rather than a foreign key.
-- An issued quote or invoice is a legal record: renaming or deleting a
-- company later must not rewrite what an already-sent document said.
-- Null means "fall back to the current default at render time".
alter table public.quotes
  add column parent_company text;

alter table public.invoices
  add column parent_company text;
