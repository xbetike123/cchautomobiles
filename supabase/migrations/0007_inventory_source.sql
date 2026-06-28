-- Add source attribution + the full scraped spec set to inventory rows.
-- `source_url` is the upstream /params page the row was imported from.
-- `source_data` keeps the entire scraped payload (trim name, prices, full
-- spec map) so the public detail page can render a rich, categorised spec
-- block without re-scraping on every request.

alter table public.inventory
  add column source_url text,
  add column source_data jsonb;

create index inventory_source_url_idx
  on public.inventory (source_url)
  where source_url is not null;
