-- Public quote images are rendered into customer-facing PDFs. Writes remain
-- service-role-only; public clients may only read objects.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'quote-images',
  'quote-images',
  true,
  5242880,
  array['image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public quote image reads" on storage.objects;
create policy "Public quote image reads"
  on storage.objects for select
  to public
  using (bucket_id = 'quote-images');
