# CCH Automobile — Website Build Prompt

## Project overview

Build a Fortune 500 grade corporate marketing website for **CCH Automobile**, a Chinese EV sourcing and export business that delivers new and used electric vehicles from Guangzhou, China to buyers in Nigeria and across Africa. The brand should sit visually alongside BMW.com, Mercedes-Benz.com, Ford.com, and Lexus.com. Not a dealer template. Not a marketplace. A corporate brand site for an export operator that happens to sell cars.

The business model is unique. CCH sources new EVs directly from Chinese factories (BYD, Geely, Xpeng, Zeekr, Wuling, Leapmotor) and sources used EVs directly from first owners in China. No auctions. No middlemen. Every car is inspected on the CCH lot in Guangzhou and filmed before shipping. Because Chinese EV models change too quickly to maintain a fixed catalog, the site is built around a transparent process, a rotating weekly inventory, and the trust signals a serious importer needs to see before wiring money to China.

## Tech stack

**Use the latest stable Next.js** (currently 16.x as of May 2026, with App Router as the recommended modern router). Do not pin to Next.js 14 unless a dependency forces it. Run `npx create-next-app@latest` and confirm App Router, TypeScript, Tailwind, and ESLint are all enabled at scaffold time.

Full stack.
- Next.js latest stable, App Router, Server Components by default.
- TypeScript strict mode.
- Tailwind CSS.
- shadcn/ui components (installed via the latest CLI, not the deprecated package).
- Supabase for inventory, quote requests, testimonials, team, brands, and market intel posts.
- Vercel for deployment.
- next/image for all imagery with proper width, height, alt, and `priority` only on the hero image.
- Framer Motion for subtle scroll-triggered fades only. See the animation discipline rules below.
- MailerLite for the market intel newsletter.
- WhatsApp Cloud API for primary lead routing on form submissions.
- Cloudflare Turnstile for spam protection on the request form.

## Security and infrastructure rules

These are not optional. They go in the implementation, not in a follow-up task.

**Supabase Row Level Security.** RLS must be enabled on every table from day one. Default-deny on all tables. Public read policies only on `inventory` (where `status = 'available'`), `market_intel_posts` (where `published_at <= now()`), `testimonials` (where `displayed_on_homepage = true` or for the dedicated testimonials page), `team_members` (where `displayed_on_homepage = true` or for the about page), and `brands_sourced` (where `active = true`). All writes happen server-side only, never from the browser.

**API key safety.** The Supabase anon key is the only key that ever reaches the browser, and it is restricted by RLS. The service role key never appears in client code, never appears in any file with a name starting with `page.tsx` or `layout.tsx`, and is read only inside server actions, route handlers, or server-only utility files marked with `import 'server-only'` at the top. Same rule for the WhatsApp Cloud API token, MailerLite API key, and any Turnstile secret. Use `.env.local` for development and Vercel environment variables for production. Never commit `.env*` files except `.env.example`.

**Quote request notifications.** On every quote request submission, the server action must in this order: (1) validate Turnstile token, (2) insert the row into Supabase, (3) send a WhatsApp message via Cloud API to the CCH operations number with the lead summary, (4) send a fallback email via Resend or MailerLite transactional to a CCH operations inbox in case WhatsApp delivery fails, (5) return success to the client. If any of steps 3 or 4 fail, the lead is still saved and a `notification_status` field on the row records the failure for retry by an admin cron job.

**Spam protection.** Cloudflare Turnstile widget on the request page and the market intel newsletter signup. Server-side verification of the token before any database write or email send. Additionally, implement rate limiting on the quote request route handler at five submissions per IP per hour, using Vercel KV or Upstash Redis.

**Admin access.** Build a minimal `/admin` route protected by Supabase Auth with a single admin role check, where the CCH team can view incoming leads, update lead status, and mark inventory as reserved or sold. No public signup, only invited users. This can ship in a second milestone after the public site is live, but build the database tables and RLS policies for it now.

**Animation discipline.** Framer Motion is allowed only for these specific cases. (1) Section fade-in on scroll into view, maximum 400ms duration, 12px translate distance, ease-out. (2) Testimonial carousel slide transition, 300ms. (3) Mobile nav drawer open and close, 200ms. Nothing else. No hover scale transforms. No parallax. No marquee. No counter animations on the stat numbers. The brand reads as serious operator, not startup.

## Design direction

**Aesthetic.** Modern friendly dealership. Soft, rounded, confident, approachable. Think the Marlin reference template: a clean white canvas with light gray section bands, pillow-soft card shadows, pill-shaped CTAs, and a single bright red accent that drives the eye through hero, filters, and primary actions. Generous whitespace, large product photography, decorative red ribbons and chips earn their place because the brand is consumer-facing.

**Color palette.**
- Background: pure white `#ffffff`
- Surface tint: very light cool gray `#f7f7f9` for alternating section bands and card insets
- Warm surface: `#f1efee` for hero backdrops and product card insets that need a softer wash
- Primary text: deep slate `#0f172a`
- Secondary text: `rgba(15,23,42,0.65)`
- Tertiary text and meta labels: `rgba(15,23,42,0.5)`
- Borders: `rgba(15,23,42,0.08)` hairlines
- CCH Red: `#E63946` (primary accent, used liberally on CTAs, ribbons, active tabs, price chips)
- Red hover state: `#C52836`
- Red soft tint: `#FDE8EA` for badge backgrounds and hover wash

Red usage. Red is the brand's primary accent and shows up wherever the user needs to act or compare: primary CTA pills, the active nav ribbon, filter chip active state, "View All" pills inside category cards, price tags, the small ribbon on the logomark, and the round search button on the hero filter. Red on white never on red.

**Typography.**
- Display and headings: **Inter Tight** weights 500-700.
- Body: **Inter** weights 400 and 500.
- Meta labels: **Inter** weight 500, letter-spacing 0.08em, uppercase, 11px.
- H1 hero: 56px desktop, 36px mobile, weight 700, letter-spacing `-0.03em`, line-height 1.05.
- H2 section: 36px desktop, 26px mobile, weight 600, letter-spacing `-0.02em`, line-height 1.15.
- H3 subsection: 22px, weight 600, letter-spacing `-0.01em`.
- Body: 16px, weight 400, line-height 1.6, color `rgba(15,23,42,0.65)` for supporting copy.
- Headlines in sentence case. Uppercase only for meta labels, filter labels, and badge text.

**Layout rules.**
- Max content width 1200px, centered.
- Section vertical padding 5rem top and bottom on desktop, 2.5rem on mobile.
- 12-column grid with 24px gutters on desktop, 16px on mobile.
- Hairline borders 1px at `rgba(15,23,42,0.08)`, used sparingly because soft shadows separate cards.
- Border radius: 16px for cards and image containers, 24px for hero cards and large surfaces, 9999px (full pill) for buttons, chips, inputs in filter rows.
- Soft card shadows: `0 6px 24px rgba(15,23,42,0.06)` resting, `0 10px 32px rgba(15,23,42,0.10)` on hover.
- Use alternating white and `#f7f7f9` section bands to create rhythm down the page.

**Buttons.**
- Primary: solid CCH Red `#E63946` pill, white text, 14px vertical padding, 28px horizontal, font weight 600, 14px text. Hover darkens to `#C52836`. Soft red shadow `0 8px 18px rgba(230,57,70,0.28)` on hover.
- Secondary: white pill with `rgba(15,23,42,0.08)` hairline border, slate text. Hover fills to `#0f172a` with white text.
- Tertiary inline link: slate text with a subtle underline. Hover moves the underline to red.
- Round search button: 56px circle, CCH Red, white magnifier icon. Lives at the right end of the hero filter row.

**Imagery rules.**
- Car photography: three-quarter front angle, clean light backdrop, consistent shadow direction.
- Where real photos are not yet available, use `#f1efee` placeholders with a faint car silhouette.
- All images via `next/image` with width, height, and alt text. `priority` only on the hero car.
- Hero car render: roughly 16:7 aspect, floats on a soft warm backdrop with no hard edge.
- Inventory cards: 4:3 image area.

**What to avoid.**
- No emoji.
- No stock photography. No AI generated imagery. Placeholders only until real footage is captured.
- No bold mid-sentence text inside running copy.
- No em dashes in body copy. Use periods or commas.
- No phrases like "discover," "explore," "unlock," "elevate," "seamless," or "revolutionize."
- No marquee, no auto-rotating banners. Tabbed inventory sections may animate the underline, nothing else.

## Page structure

### 1. Home page (`/`)

**Top utility bar.** Thin black `#0a0a0a` strip at the very top, 36px tall, white 12px text. Left: "Guangzhou to Lagos · Weekly shipments." Right: phone number, language selector (EN, soon FR for Francophone Africa), and a small WhatsApp link.

**Main nav.** Sticky, white background, 72px tall, 1px bottom border at `rgba(0,0,0,0.1)`. Left: CCH Automobile wordmark in Inter Tight 18px weight 600, with a 4px red square sitting to the left of the C. Center: nav links in 14px weight 500, spaced 2.5rem apart — New cars, Used cars, Process, On the lot, Brands, About, Contact. Right: a primary red "Start a request" button.

**Hero section.** Full bleed 21:9 cinematic image of the CCH lot in Guangzhou with a subtle dark vignette on the bottom 40% for text legibility. Hero copy bottom-left aligned with 6rem padding from edges. Small red meta label "CCH AUTOMOBILE · GUANGZHOU EXPORT GROUP" with a 24px red horizontal line above it. H1 in three stacked lines: "Electric vehicles. / Sourced direct from China. / Delivered to Africa." 540px max-width supporting paragraph below in white at 90% opacity: "New from the factory. Used from the first owner. Every car inspected on our lot in Guangzhou before it ships." Two buttons: primary red "Start a request" and secondary white-outlined "See this week's lot."

**Trust bar.** Sits directly below the hero, full bleed, white background, 1px borders top and bottom. Four equally spaced statistics in a row. Each stat: the number in 40px Inter Tight weight 600 in CCH Red, then the label in 12px uppercase weight 500 in `rgba(0,0,0,0.45)`. Stats: "8+ Years operating in China," "3,000+ Clients served," "15+ Brands sourced," "100% Pre-shipment inspection." Vertical 1px hairlines between stats.

**New vs Used split section.** White background. Section header centered: red 24px horizontal line, then "OUR INVENTORY" meta label, then H2 "Two paths. One standard of inspection." Below, two equal-width panels side by side with a 1px vertical divider between them. Each panel: 16:9 image at top, then 3rem padding for content. Left: "NEW" meta label, H3 "From the factory.", three-line supporting paragraph, three bullet points (Factory warranty preserved, Latest 2026 models, 30 to 45 days delivery) with a 1px red square as the bullet, and a tertiary "View new inventory" link. Right: same structure for used cars with the H3 "From the first owner." Bullets: First-owner verification, Battery health report, Full service history.

**Process section.** Light gray `#f6f6f6` band. Centered header: red line, "OUR PROCESS" label, H2 "Six steps. Fully transparent.", and a 600px supporting line "You see your car at every stage, from the Guangzhou lot to the port in Lagos." Below, a horizontal six-step diagram with a central car silhouette anchoring it, in the Marlin style adapted for corporate restraint. Steps numbered 01 through 06 (Identify, Deposit, Source, Inspect, Document, Deliver) with three connector lines on each side leading into the central car image. Each step block: red 01 in 13px weight 500, then step name in 16px weight 500, then a single line of 13px supporting copy. Below the diagram, a tertiary "See the full process" link to `/process`.

**On the lot section.** White background. Section header: red line, "ON THE LOT" meta label, H2 "This week in Guangzhou.", with a tertiary "View all inventory" link aligned right of the H2. Three-column grid of cars below. Card style: 4:3 image, then below the image, small uppercase meta label "USED · 2023" or "NEW · 2026" in red, model name in 18px Inter Tight weight 500, single line of facts ("28,400 km · 94% battery health" or "401 km range · DM-i hybrid backup"), and "From $14,800 FOB Guangzhou" in 14px weight 500. No card borders. No card backgrounds. Just image and typography. Cards link to `/lot/[slug]`.

**Walk the lot video section.** Full-width 16:9 video player below the inventory section, autoplay muted on scroll into view, with a hairline 1px border around it. Caption below: "Filmed this week in Guangzhou by the CCH operations team." Use a placeholder for now.

**Brands section.** Light gray `#f6f6f6` band. Centered header: red line, "OUR SOURCING NETWORK" label, H2 "Direct relationships with China's EV leaders.", and a 600px supporting line about CCH's factory access. Below, a six-column grid (three columns on tablet, two on mobile) of brand logos in flat black `#0a0a0a` at 80% opacity, hover state 100% opacity. Logos: BYD, Geely, Xpeng, Zeekr, Wuling, Leapmotor, Nio, Li Auto, Hongqi, Aion, Neta, Avatr. Each logo cell is 160px tall with a 1px right and bottom border to create a clean grid. Below the grid, a tertiary "Read about our sourcing approach" link.

**Testimonials section.** White background. Centered header: red line, "CLIENTS" label, H2 "From importers across West Africa." Below, a single testimonial carousel showing one testimonial at a time, with three small dot indicators below in `rgba(0,0,0,0.2)`, active dot in CCH Red. Each testimonial: 60px Inter Tight weight 500 red opening quotation mark, then 22px body quote in Inter weight 400, then a 1px horizontal divider, then a row with the client's photo (48px circular) on the left, name and title in 14px weight 500, company and city in 13px weight 400 `rgba(0,0,0,0.6)` below. Three testimonials in rotation, manually navigable, no autoplay. Arrows on left and right edges of the section for navigation, 32px Inter weight 400.

**Team section.** Light gray `#f6f6f6` band. Centered header: red line, "OUR TEAM" label, H2 "On the ground in Guangzhou.", and a 600px supporting line: "The people inspecting your car, negotiating with the factory, and filing your export paperwork." Below, a five-column grid of team members (or as many as exist, scaled to fit). Each card: 3:4 portrait photo, then below, name in 16px weight 500, role in 13px weight 400 `rgba(0,0,0,0.6)`, and 1px hairline divider. Roles: Founder and Sourcing Lead, Head of Inspection, Logistics Manager, Client Relations Lead, Documentation Officer. No social icons. No bios on the home page. Click-through to `/about` for full bios.

**Market intel section.** White background. Centered header: red line, "MARKET INTEL" label, H2 "Notes from Guangzhou.", with a tertiary "Read all articles" link aligned right. Three article cards in a row, no images on cards. Each card: meta line with "MARCH 12, 2026 · 4 MIN READ" in 11px uppercase weight 500 in red and gray, then 18px Inter Tight weight 500 headline in two lines max, then a 13px weight 400 single-line preview in `rgba(0,0,0,0.6)`. 1px right border between cards. Bottom of each card has a tertiary "Read article" link.

**Final CTA band.** Black `#0a0a0a` background, white text, full bleed, 6rem vertical padding. Centered. H2 in white "Ready to import your first EV from China?" Supporting line in `rgba(255,255,255,0.7)` 18px: "Tell us what you're looking for. We'll send a shortlist from this week's lot within 24 hours." Two buttons: primary red "Start a request" and secondary white-outlined "Talk on WhatsApp."

**Footer.** White background, 1px top border, 6rem of padding. Five columns. Column 1: CCH Automobile wordmark with red accent, single line description "Guangzhou export group. EV sourcing for Africa.", and the same primary red "Start a request" button in a smaller size. Column 2: Inventory links (New cars, Used cars, On the lot this week, Sold archive). Column 3: Company links (Process, About, Team, Market intel, Careers). Column 4: Support links (Contact, WhatsApp, FAQ, Shipping rates, Duty calculator). Column 5: Contact block with the Guangzhou address, the Lagos representative address, the WhatsApp number, and the email. Below the columns, a 1px hairline, then a row with "© 2026 CCH Automobile. All rights reserved." on the left and small text links on the right (Privacy, Terms, Compliance). Far right of that bottom row: CCH wordmark in 12px weight 500.

### 2. Process page (`/process`)

A dedicated page that expands each of the six steps into its own section with full-width imagery between them. Each step section alternates left and right image alignment. Each step has the oversized step number in 80px Inter Tight weight 600 at 15% opacity, the step name as H2, a 200-word explanation in body text, a small inline checklist of three to five sub-steps, and a 16:9 image or video showing that step happening on the CCH lot. Between steps, a full-bleed 1px hairline divider with the next step number floating below it. Bottom of the page: black CTA band with "Start a request" button.

### 3. Inventory page (`/lot`)

Top of page: page header with red line, "ON THE LOT" label, H1 "This week in Guangzhou.", and a supporting line with the current week's date range and how many cars are available. Below the header: a horizontal filter bar in light gray `#f6f6f6`, sticky on scroll. Filters as plain text buttons separated by 1px vertical hairlines, with the active filter underlined in red 2px: All, New, Used, Sedan, SUV, Compact, Premium, Commercial. Sort dropdown aligned right: Newest, Price low to high, Price high to low, Battery health high to low.

Grid is four columns on desktop, two on tablet, one on mobile. Same card style as the home page. Pagination at the bottom (no infinite scroll, this is corporate not e-commerce). Page numbers in a horizontal row with active page in red.

### 4. Individual car detail page (`/lot/[slug]`)

Breadcrumb at top: On the lot / Used / 2023 BYD Atto 3 in 12px weight 400. Below, large hero image, full bleed up to the 1200px content width. Below the image, two columns. Left column (8/12 width): model name as H1, year and trim as H3 below, then a tabbed information block with tabs (Overview, Specifications, History, Inspection report, Paperwork) all displayed inline as a structured spec table with 1px hairline row dividers. Right column (4/12 width): sticky on scroll, contains price prominently in 32px weight 600, a single-line "FOB Guangzhou. Add shipping and duties below." caption, a primary red "Reserve with deposit" button, a secondary "Ask on WhatsApp" button, and a small "Download spec sheet (PDF)" tertiary link.

Below the two columns: full-width walkaround video filmed by the CCH team for this specific car, with a caption. Below that: photo gallery in a 3-by-3 grid. Below that: "Total landed cost to Nigeria" calculator with editable destination port (Lagos Apapa, Lagos Tin Can, Tema, Cotonou, Dakar) and a clear line-item breakdown of FOB, ocean shipping, insurance, Nigeria customs duty, ECOWAS levy, NAC levy, terminal handling, clearing agent, and CCH service fee. Each line in a 1px hairline row, total at the bottom in red.

### 5. Request page (`/request`)

Centered 600px column. Page header: red line, "REQUEST FORM" label, H1 "Tell us what you're looking for.", and a single supporting line: "We'll send a shortlist from this week's lot within 24 hours, on WhatsApp or by email." Form below with floating labels inside inputs, 1px hairline borders that turn black on focus.

Fields in order: What are you looking for (multi-select chips with red active state: Personal use, Ride-hail fleet, Executive, Dealer resale, Commercial), Budget range in USD (two number inputs, min and max), Timeline (radio buttons inline: Within 30 days, 30 to 60 days, Flexible), New or used preference (radio: New only, Used only, Show me both), Body type preference (multi-select chips: Sedan, SUV, Compact, Premium, any), Name, WhatsApp number with country code dropdown, Email, Destination city in Nigeria or Africa, and a notes textarea. A Cloudflare Turnstile widget sits below the notes field, styled to match the form. Single primary red button at the bottom: "Send to the CCH team." Below the button in 12px `rgba(0,0,0,0.45)`: "Your information stays with CCH. We never share leads with third parties." On submit, the server action validates the Turnstile token, applies the rate limit, writes to Supabase, triggers a WhatsApp notification to the CCH operations number, sends a fallback email, and shows a confirmation screen with a WhatsApp link. All notification logic per the security and infrastructure rules above.

### 6. About page (`/about`)

Hero with the CCH founder portrait on the right and an H1 on the left: "Eight years in China. One mission." Supporting paragraph below the H1 about the founding story. Below the hero: company timeline with key milestones (founded, first shipment, 1,000th client, EV pivot, current). Below the timeline: full team grid with bios. Below the team: Guangzhou office gallery. Bottom: black CTA band.

## Supabase schema

Create these tables.

**inventory** — id, slug, model, brand, year, condition (new or used), price_usd_fob, mileage_km, battery_health_pct, range_km, body_type, owner_count, hero_image_url, gallery_image_urls (array), walkaround_video_url, status (available, reserved, sold), week_added, sold_date, spec_sheet_pdf_url, factory_warranty_months, included_paperwork (array).

**quote_requests** — id, created_at, use_cases (array), budget_min_usd, budget_max_usd, timeline, condition_preference, body_type_preferences (array), name, whatsapp, email, destination_city, destination_country, notes, status (new, contacted, qualified, closed), assigned_to, notification_status (jsonb tracking whatsapp_sent, email_sent, retry_count, last_error), ip_address (for rate limit auditing), turnstile_verified (boolean).

**market_intel_posts** — id, slug, title, preview, body_markdown, published_at, read_time_minutes, cover_image_url, author, category.

**testimonials** — id, client_name, client_title, client_company, client_city, client_country, photo_url, quote, vehicle_purchased, displayed_on_homepage (boolean), order_index.

**team_members** — id, name, role, bio_short, bio_long, photo_url, displayed_on_homepage (boolean), order_index.

**brands_sourced** — id, name, logo_url, country, order_index, active (boolean).

## Brand voice

Direct, confident, short sentences. No hype. No emoji. No exclamation marks. No em dashes. Write like a serious export operator who knows the business and doesn't need to oversell. The reader is a successful Nigerian importer who has been burned by middlemen before and is evaluating whether CCH is the real thing.

Examples of the right voice.
- "Every car inspected on our lot before it ships."
- "No auctions. No middlemen."
- "You see your car at every stage."
- "Filmed this week in Guangzhou."
- "Eight years in China. Three thousand clients served."

Examples of the wrong voice to avoid.
- "Discover the future of mobility with our curated selection."
- "Unlock the power of Chinese electric vehicles."
- "We are revolutionizing how Africa imports cars."
- "Seamless end-to-end solutions for the modern importer."

## Final notes

The site should load fast, score above 95 on Lighthouse, work flawlessly on mobile, and feel completely silent in its design. No animation on initial load. No hero video autoplay on first visit. No scroll-jacking. Subtle fade-in on scroll for sections is acceptable using Framer Motion at a maximum 400ms duration and 12px translate distance. The site succeeds when a Nigerian importer lands on it and immediately feels they're dealing with a serious corporate operator that could pass diligence from a bank.

Brand name throughout: **CCH Automobile**. Never abbreviate to just CCH except in the favicon and tight UI spots like the footer copyright. Never expand the acronym anywhere on the site.

## Handoff suggestion

If using Claude Code, save this file as `BUILD.md` in the repo root, run `claude`, and tell it to read `BUILD.md` and start with the home page only. Build the home page section by section. Review each section before moving to the next. Only move to the process page after the home page is locked.

If using v0 or Lovable, paste the home page section only first. Get the hero, trust bar, and new vs used split panel pixel-perfect before adding more. These tools work better with focused scope.
