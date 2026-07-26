alter table public.quotes
  add column quote_kind text not null default 'purchase',
  add column booking_account_number text,
  add column booking_currency text,
  add column booking_amount_local numeric(16, 2);

alter table public.quotes
  add constraint quotes_quote_kind_check
  check (quote_kind in ('purchase', 'pre_sales'));
