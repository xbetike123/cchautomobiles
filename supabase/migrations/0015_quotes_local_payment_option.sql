alter table public.quotes
  drop constraint if exists quotes_payment_option_check;

alter table public.quotes
  add constraint quotes_payment_option_check
  check (payment_option in ('full_payment', 'deposit', 'local_payment'));
