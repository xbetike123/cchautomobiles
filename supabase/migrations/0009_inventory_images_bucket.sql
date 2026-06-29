-- Public storage bucket for admin-uploaded car photos. Unlike the private
-- request-images bucket, lot photos are shown on the public site, so this
-- bucket is public-read. Writes still go through the service role only
-- (no storage.objects insert/update policies are granted to anon), so the
-- admin write layer is the sole uploader. ~10MB cap, common web image types.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inventory-images',
  'inventory-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;
