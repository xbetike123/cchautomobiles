-- Row Level Security policies. RLS is already enabled in 0001; the
-- default-deny posture means every table starts inaccessible to anon and
-- authenticated users. Each policy below opens exactly one read path that
-- matches the public-facing rule from the brief. All writes go through the
-- service role (server-only), which bypasses RLS by design.

-- inventory: anon and authenticated can read rows that are currently for sale.
create policy "Public read available inventory"
  on public.inventory
  for select
  to anon, authenticated
  using (status = 'available');

-- market_intel_posts: anon and authenticated can read posts whose
-- published_at is set and not in the future.
create policy "Public read published market intel"
  on public.market_intel_posts
  for select
  to anon, authenticated
  using (published_at is not null and published_at <= now());

-- testimonials: anon and authenticated can read every testimonial. The
-- home page filters by displayed_on_homepage at query time; the dedicated
-- testimonials page reads them all.
create policy "Public read testimonials"
  on public.testimonials
  for select
  to anon, authenticated
  using (true);

-- team_members: same pattern as testimonials.
create policy "Public read team members"
  on public.team_members
  for select
  to anon, authenticated
  using (true);

-- brands_sourced: anon and authenticated can read active brands only.
create policy "Public read active brands"
  on public.brands_sourced
  for select
  to anon, authenticated
  using (active = true);

-- quote_requests: no anon or authenticated policy at all. Only the service
-- role (used by server actions and route handlers) can read or write,
-- because service role bypasses RLS.
