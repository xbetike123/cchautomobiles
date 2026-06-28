-- Consultation booking requests captured from the /consultation landing page.
-- Mirrors the quote_requests posture: RLS on, no anon/authenticated policy, so
-- only the service-role client (used by the server action after a rate-limit
-- check) can insert. Notifications (lead email + admin Discord ping) are
-- best-effort and tracked in notification_status for retry from /admin later.

create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  whatsapp text not null,
  email text not null,
  country text not null,
  buyer_type text,
  topics text[] not null default '{}',
  preferred_time text,
  notes text,
  status text not null default 'new',
  notification_status jsonb not null default '{}'::jsonb,
  ip_address inet,
  constraint consultation_requests_status_check check (
    status in ('new', 'contacted', 'scheduled', 'completed', 'closed')
  )
);

create index consultation_requests_status_idx
  on public.consultation_requests (status);
create index consultation_requests_created_at_idx
  on public.consultation_requests (created_at desc);

alter table public.consultation_requests enable row level security;
