-- Private storage bucket for client-supplied reference images on the
-- Request a Car modal. Only the service role can read or write because
-- no storage.objects policies are granted to anon/authenticated. Admin
-- tooling generates signed URLs on demand to view uploads.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'request-images',
  'request-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;
