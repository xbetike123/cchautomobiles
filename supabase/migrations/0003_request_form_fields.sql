-- Quick-capture request modal fields. These are nullable additions because
-- the modal sits on top of the longer-form /request page in Phase 5; clients
-- may submit through either path.

alter table public.quote_requests
  add column preferred_brand text,
  add column preferred_model text,
  add column cch_car_code text,
  add column reference_image_path text;

create index quote_requests_cch_car_code_idx
  on public.quote_requests (cch_car_code)
  where cch_car_code is not null;
