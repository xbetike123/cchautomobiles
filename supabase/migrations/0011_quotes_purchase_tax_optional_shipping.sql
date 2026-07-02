alter table public.quotes
  alter column shipping_usd drop not null,
  add column purchase_tax_usd numeric(12, 2) not null default 0;
