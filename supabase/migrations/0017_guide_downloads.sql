-- guide_downloads ------------------------------------------------------------

-- Leads captured by the downloadable guide (the "lead magnet") on
-- /get-started. The visitor gives a first name and email, and the download
-- unlocks. Kept separate from quote_requests: these are top-of-funnel
-- contacts who have not asked for a specific vehicle.

create table public.guide_downloads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  -- Which guide was downloaded. Lets a second lead magnet reuse this table.
  guide_slug text not null default 'international-buyer-handbook',
  -- Where the visitor came from, e.g. 'get-started'.
  source text,
  ip_address text,
  created_at timestamptz not null default now(),
  constraint guide_downloads_first_name_not_blank
    check (length(btrim(first_name)) > 0),
  constraint guide_downloads_email_not_blank
    check (length(btrim(email)) > 0)
);

-- The same person may come back for a later edition, so email is not unique.
-- Index it for de-duplication and for cross-referencing against quote_requests.
create index guide_downloads_email_idx
  on public.guide_downloads (lower(btrim(email)));

create index guide_downloads_created_at_idx
  on public.guide_downloads (created_at desc);

-- Writes go through a server action using the service role, matching the
-- consultation and quote request flows. No anon policies.
alter table public.guide_downloads enable row level security;
