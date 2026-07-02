alter table public.quotes
  add column payment_option text not null default 'full_payment',
  add column account_information text,
  add constraint quotes_payment_option_check
    check (payment_option in ('full_payment', 'deposit'));
