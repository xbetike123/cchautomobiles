-- Local development seed data. All names, photos, and copy are clearly
-- labeled placeholders. Image URLs point to /public/placeholders/, which
-- ships with the repo from a later phase. Run via `supabase db reset`.

-- inventory ------------------------------------------------------------------

insert into public.inventory (
  slug, model, brand, year, condition, price_usd_fob,
  mileage_km, battery_health_pct, range_km, body_type, owner_count,
  hero_image_url, gallery_image_urls, walkaround_video_url,
  status, week_added, factory_warranty_months, included_paperwork
) values
  (
    'placeholder-byd-seal-2026',
    'Seal',
    'BYD',
    2026,
    'new',
    28500,
    null, null, 650, 'Sedan', 0,
    '/placeholders/inventory-hero-01.jpg',
    array['/placeholders/inventory-gallery-01-a.jpg', '/placeholders/inventory-gallery-01-b.jpg'],
    '/placeholders/inventory-walkaround-01.mp4',
    'available',
    current_date - interval '4 days',
    96,
    array['Factory invoice', 'Export compliance certificate', 'Battery passport']
  ),
  (
    'placeholder-xpeng-g6-2026',
    'G6',
    'Xpeng',
    2026,
    'new',
    34200,
    null, null, 580, 'SUV', 0,
    '/placeholders/inventory-hero-02.jpg',
    array['/placeholders/inventory-gallery-02-a.jpg', '/placeholders/inventory-gallery-02-b.jpg'],
    '/placeholders/inventory-walkaround-02.mp4',
    'available',
    current_date - interval '6 days',
    96,
    array['Factory invoice', 'Export compliance certificate', 'Battery passport']
  ),
  (
    'placeholder-zeekr-001-2026',
    '001',
    'Zeekr',
    2026,
    'new',
    41800,
    null, null, 712, 'Shooting brake', 0,
    '/placeholders/inventory-hero-03.jpg',
    array['/placeholders/inventory-gallery-03-a.jpg', '/placeholders/inventory-gallery-03-b.jpg'],
    '/placeholders/inventory-walkaround-03.mp4',
    'available',
    current_date - interval '2 days',
    96,
    array['Factory invoice', 'Export compliance certificate', 'Battery passport']
  ),
  (
    'placeholder-byd-atto-3-2023',
    'Atto 3',
    'BYD',
    2023,
    'used',
    14800,
    28400, 94, 420, 'SUV', 1,
    '/placeholders/inventory-hero-04.jpg',
    array['/placeholders/inventory-gallery-04-a.jpg', '/placeholders/inventory-gallery-04-b.jpg'],
    '/placeholders/inventory-walkaround-04.mp4',
    'available',
    current_date - interval '5 days',
    null,
    array['First-owner registration', 'Battery health report', 'Service history']
  ),
  (
    'placeholder-geely-geometry-c-2022',
    'Geometry C',
    'Geely',
    2022,
    'used',
    11200,
    41200, 89, 401, 'Hatchback', 1,
    '/placeholders/inventory-hero-05.jpg',
    array['/placeholders/inventory-gallery-05-a.jpg', '/placeholders/inventory-gallery-05-b.jpg'],
    '/placeholders/inventory-walkaround-05.mp4',
    'available',
    current_date - interval '7 days',
    null,
    array['First-owner registration', 'Battery health report', 'Service history']
  ),
  (
    'placeholder-leapmotor-c11-2023',
    'C11',
    'Leapmotor',
    2023,
    'used',
    17400,
    19800, 96, 502, 'SUV', 1,
    '/placeholders/inventory-hero-06.jpg',
    array['/placeholders/inventory-gallery-06-a.jpg', '/placeholders/inventory-gallery-06-b.jpg'],
    '/placeholders/inventory-walkaround-06.mp4',
    'available',
    current_date - interval '3 days',
    null,
    array['First-owner registration', 'Battery health report', 'Service history']
  );

-- testimonials ---------------------------------------------------------------

insert into public.testimonials (
  client_name, client_title, client_company, client_city, client_country,
  photo_url, quote, vehicle_purchased, displayed_on_homepage, order_index
) values
  (
    'Placeholder client one',
    'Managing director',
    'Placeholder import company A',
    'Lagos',
    'Nigeria',
    '/placeholders/testimonial-01.jpg',
    'Placeholder testimonial quote one. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'BYD Atto 3 (2023)',
    true,
    1
  ),
  (
    'Placeholder client two',
    'Fleet manager',
    'Placeholder import company B',
    'Accra',
    'Ghana',
    '/placeholders/testimonial-02.jpg',
    'Placeholder testimonial quote two. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Xpeng G6 (2026)',
    true,
    2
  ),
  (
    'Placeholder client three',
    'Founder',
    'Placeholder import company C',
    'Abidjan',
    'Côte d''Ivoire',
    '/placeholders/testimonial-03.jpg',
    'Placeholder testimonial quote three. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    'Zeekr 001 (2026)',
    true,
    3
  );

-- team_members --------------------------------------------------------------

insert into public.team_members (
  name, role, bio_short, bio_long, photo_url, displayed_on_homepage, order_index
) values
  (
    'Placeholder team member one',
    'Operations lead, Guangzhou',
    'Placeholder short bio one.',
    'Placeholder long bio one. Lorem ipsum dolor sit amet.',
    '/placeholders/team-01.jpg',
    true,
    1
  ),
  (
    'Placeholder team member two',
    'Head of sourcing',
    'Placeholder short bio two.',
    'Placeholder long bio two. Sed do eiusmod tempor incididunt.',
    '/placeholders/team-02.jpg',
    true,
    2
  ),
  (
    'Placeholder team member three',
    'Inspection lead',
    'Placeholder short bio three.',
    'Placeholder long bio three. Ut enim ad minim veniam.',
    '/placeholders/team-03.jpg',
    true,
    3
  ),
  (
    'Placeholder team member four',
    'Logistics manager',
    'Placeholder short bio four.',
    'Placeholder long bio four. Quis nostrud exercitation.',
    '/placeholders/team-04.jpg',
    false,
    4
  ),
  (
    'Placeholder team member five',
    'Lagos representative',
    'Placeholder short bio five.',
    'Placeholder long bio five. Duis aute irure dolor.',
    '/placeholders/team-05.jpg',
    false,
    5
  );

-- brands_sourced ------------------------------------------------------------

insert into public.brands_sourced (name, logo_url, country, order_index, active) values
  ('BYD',        '/placeholders/brand-byd.svg',        'China', 1,  true),
  ('Geely',      '/placeholders/brand-geely.svg',      'China', 2,  true),
  ('Xpeng',      '/placeholders/brand-xpeng.svg',      'China', 3,  true),
  ('Zeekr',      '/placeholders/brand-zeekr.svg',      'China', 4,  true),
  ('Wuling',     '/placeholders/brand-wuling.svg',     'China', 5,  true),
  ('Leapmotor',  '/placeholders/brand-leapmotor.svg',  'China', 6,  true),
  ('Nio',        '/placeholders/brand-nio.svg',        'China', 7,  true),
  ('Li Auto',    '/placeholders/brand-li-auto.svg',    'China', 8,  true),
  ('Hongqi',     '/placeholders/brand-hongqi.svg',     'China', 9,  true),
  ('Aion',       '/placeholders/brand-aion.svg',       'China', 10, true),
  ('Neta',       '/placeholders/brand-neta.svg',       'China', 11, true),
  ('Avatr',      '/placeholders/brand-avatr.svg',      'China', 12, true);

-- market_intel_posts --------------------------------------------------------

insert into public.market_intel_posts (
  slug, title, preview, body_markdown, published_at, read_time_minutes,
  cover_image_url, author, category
) values
  (
    'placeholder-intel-byd-export-pricing',
    'Placeholder: BYD export pricing snapshot',
    'Placeholder preview line for the BYD export pricing post.',
    '# Placeholder post body one\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.',
    now() - interval '3 days',
    6,
    '/placeholders/intel-01.jpg',
    'Placeholder author',
    'Pricing'
  ),
  (
    'placeholder-intel-shipping-rates',
    'Placeholder: Ocean shipping rates to Lagos',
    'Placeholder preview line for the shipping rates post.',
    '# Placeholder post body two\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    now() - interval '10 days',
    8,
    '/placeholders/intel-02.jpg',
    'Placeholder author',
    'Shipping'
  ),
  (
    'placeholder-intel-battery-health',
    'Placeholder: Battery health on used Chinese EVs',
    'Placeholder preview line for the battery health post.',
    '# Placeholder post body three\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    now() - interval '21 days',
    7,
    '/placeholders/intel-03.jpg',
    'Placeholder author',
    'Inspection'
  );
