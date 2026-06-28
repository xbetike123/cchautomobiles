-- Add per-quote NGN exchange rate. Matches the column already present on
-- public.invoices and is captured at quote-creation time so the rate stays
-- locked even when the global daily rate drifts before the customer signs.

alter table public.quotes
  add column exchange_rate_ngn numeric(12, 4);
