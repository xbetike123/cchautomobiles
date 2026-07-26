-- Keep the original vehicle columns as a backwards-compatible primary vehicle
-- while allowing one quote to contain an ordered collection of cars.
alter table public.quotes
  add column quote_vehicles jsonb not null default '[]'::jsonb;

alter table public.quotes
  add constraint quotes_quote_vehicles_array_check
  check (jsonb_typeof(quote_vehicles) = 'array');
