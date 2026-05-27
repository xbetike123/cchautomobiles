# CCH Automobile — Build Task File

This file is the execution plan for the CCH Automobile website. It is meant to be read and executed by Claude Code in the terminal. The full design and content brief lives in `cchubbuild.md`. This file does not repeat that content. It assumes Claude Code has already read `cchubbuild.md` in full and uses it as the source of truth for design, copy, color, typography, schema, and page structure.

## How to use this file

Work through the phases in order. Do not skip ahead. Inside each phase, complete every task before moving on. Each task has a goal, the files it should touch, and acceptance criteria. When a task is complete, mark it done by changing `[ ]` to `[x]` in this file and commit with a message that names the task. Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` at the end of every phase. Do not move to the next phase if any of those fail.

Stop and ask the operator when. (1) A task requires a real asset (logo, photo, video) that has not been provided. Use a labeled placeholder and flag the task in a `BLOCKERS.md` file. (2) A secret is needed that has not been added to `.env.local`. List the missing env var name and stop the task. (3) A design decision is ambiguous between `cchubbuild.md` and what you find while building. Quote both and ask.

Never commit `.env*` files except `.env.example`. Never put a service role key or any private key in a file that is rendered in the browser. Re-read the security and infrastructure section of `cchubbuild.md` before writing any server action.

---

## Phase 1 — Project scaffold and foundation

Goal of this phase. A running Next.js project on the latest stable version, deployed to Vercel preview, with the design system tokens, fonts, and base layout in place. No pages built yet beyond a placeholder home route.

- [x] **1.1 Initialize Next.js project**
  - Goal. Scaffold the project with the latest stable Next.js, App Router, TypeScript, Tailwind, ESLint.
  - Files touched. New repo root. `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `.eslintrc.json`, `app/layout.tsx`, `app/page.tsx`.
  - Acceptance. `pnpm dev` runs on port 3000 with a blank starter page. `pnpm typecheck` and `pnpm lint` both pass. Node version pinned in `.nvmrc`. `pnpm-lock.yaml` committed.

- [x] **1.2 Install core dependencies**
  - Goal. Install Tailwind plugins, shadcn/ui CLI, Framer Motion, Supabase client, MailerLite SDK or REST helper, Turnstile React wrapper, Zod, React Hook Form, `server-only`, `clsx`, `tailwind-merge`, `lucide-react` for icons.
  - Files touched. `package.json`, `pnpm-lock.yaml`.
  - Acceptance. All packages install without peer warnings. Use the latest shadcn CLI, not the deprecated `shadcn-ui` package. Run `pnpm dlx shadcn@latest init` and accept defaults except where the design system specifies otherwise.

- [x] **1.3 Set up design tokens in Tailwind**
  - Goal. Encode the full color palette, typography scale, spacing, and border rules from `cchubbuild.md` as Tailwind theme tokens. CCH Red `#C8102E`, corporate black `#0a0a0a`, surface gray `#f6f6f6`, hairline border tokens, Inter and Inter Tight font families, the heading scale, the meta label utility.
  - Files touched. `tailwind.config.ts`, `app/globals.css`, `app/fonts.ts`.
  - Acceptance. A scratch test page using `text-cch-red`, `bg-surface-tint`, `border-hairline`, `font-display`, `text-meta` renders correctly. Inter and Inter Tight load from `next/font` with no FOUT. All design tokens defined in one place, not scattered across components.

- [x] **1.4 Build the root layout shell**
  - Goal. Implement the persistent top utility bar and the main nav exactly as specified in `cchubbuild.md`. Both visible on every page. Footer placeholder.
  - Files touched. `app/layout.tsx`, `components/site/UtilityBar.tsx`, `components/site/MainNav.tsx`, `components/site/Footer.tsx`, `components/site/Logomark.tsx`.
  - Acceptance. Utility bar is 36px, black, with the Guangzhou-to-Lagos line on the left and language and WhatsApp on the right. Main nav is sticky, 72px, white, with the wordmark, links, and primary red CTA. Mobile drawer opens and closes with the 200ms animation specified. Footer is structural only, content comes in a later phase.

- [x] **1.5 Configure environment and Supabase project**
  - Goal. Create the Supabase project, get the URL and anon key, set up `.env.local`, `.env.example`, and the Supabase client wrappers (one for the browser, one for the server).
  - Files touched. `.env.example`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/env.ts`.
  - Acceptance. `.env.example` lists every required env var with no values: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `WHATSAPP_CLOUD_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OPERATIONS_NUMBER`, `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. `lib/env.ts` validates env at boot using Zod. `lib/supabase/server.ts` starts with `import 'server-only'`.

- [ ] **1.6 Deploy to Vercel preview**
  - Goal. Connect the repo to Vercel, set environment variables in the Vercel dashboard, deploy.
  - Files touched. None new in repo. Vercel project settings only.
  - Acceptance. Preview URL renders the layout shell. No console errors. Lighthouse score above 90 on the empty layout.

---

## Phase 2 — Database schema and RLS

Goal of this phase. Every table from `cchubbuild.md` exists in Supabase with Row Level Security enabled, public read policies in place where appropriate, and seed data for local development.

- [x] **2.1 Create migration for all tables**
  - Goal. Write a single SQL migration that creates `inventory`, `quote_requests`, `market_intel_posts`, `testimonials`, `team_members`, `brands_sourced`, with every field listed in `cchubbuild.md`.
  - Files touched. `supabase/migrations/0001_initial_schema.sql`.
  - Acceptance. Migration runs cleanly against a fresh Supabase project. Every field from the schema section is present. `quote_requests` includes `notification_status` (jsonb), `ip_address`, `turnstile_verified` (boolean). Enums use Postgres `check` constraints, not text. Timestamps default to `now()`.

- [x] **2.2 Enable Row Level Security on all tables**
  - Goal. RLS on, default-deny, then add the specific public read policies from `cchubbuild.md`.
  - Files touched. `supabase/migrations/0002_rls_policies.sql`.
  - Acceptance. `select * from inventory` from the anon role returns only rows where `status = 'available'`. `market_intel_posts` only returns where `published_at <= now()`. `quote_requests` returns zero rows for anon, full access for service role. Same default-deny pattern verified on `testimonials`, `team_members`, `brands_sourced`. Test each policy with a SQL block that uses `set role authenticated` and `set role anon`.

- [x] **2.3 Seed development data**
  - Goal. Create realistic seed data for local development. Six inventory cars (three new, three used) with placeholder image URLs, three testimonials, five team members, twelve brands, three market intel posts.
  - Files touched. `supabase/seed.sql`.
  - Acceptance. `supabase db reset` populates a working dataset. No real client names or photos, use clearly labeled placeholders like "Placeholder client one." Image URLs point to the `/public/placeholders/` directory.

- [x] **2.4 Generate TypeScript types from Supabase**
  - Goal. Use the Supabase CLI to generate types so all queries are typed end to end.
  - Files touched. `lib/supabase/types.ts`, `package.json` (add `db:types` script).
  - Acceptance. `pnpm db:types` regenerates the file. Importing `Database` and using `Tables<'inventory'>` works in IDE with full autocomplete.

---

## Phase 3 — Home page

Goal of this phase. The home page is complete, pixel-faithful to `cchubbuild.md`, on the preview URL.

- [x] **3.1 Hero section**
  - Goal. Full-bleed 21:9 hero with vignette overlay, bottom-left aligned copy, red meta label with horizontal line, three-line H1, supporting paragraph, two buttons.
  - Files touched. `app/(marketing)/page.tsx`, `components/home/Hero.tsx`, `public/placeholders/lot-hero.jpg`.
  - Acceptance. Matches spec exactly. Hero image uses `priority` on `next/image`. Text is legible on mobile. Buttons route to `/request` and `/lot` respectively.

- [x] **3.2 Trust bar**
  - Goal. Four-stat strip below hero with vertical hairlines between.
  - Files touched. `components/home/TrustBar.tsx`.
  - Acceptance. Numbers in 40px Inter Tight 600 red, labels in 12px uppercase. No counter animation. Responsive: stacks to 2x2 on mobile.

- [x] **3.3 New vs Used split section**
  - Goal. Two equal panels with vertical divider, each with image, label, H3, paragraph, three bullets with 1px red square markers, tertiary link.
  - Files touched. `components/home/NewVsUsed.tsx`.
  - Acceptance. On mobile, panels stack vertically with horizontal divider instead. Bullet markers are exactly 1px red squares, not dots.

- [x] **3.4 Process diagram section**
  - Goal. Six-step horizontal diagram with central car silhouette, three connector lines per side, step blocks above and below.
  - Files touched. `components/home/ProcessDiagram.tsx`, `public/icons/car-silhouette.svg`.
  - Acceptance. Diagram renders correctly on desktop. On mobile, falls back to a vertical six-step list with the car image at the top. Connector lines are 1px at `rgba(0,0,0,0.1)`.

- [x] **3.5 On the lot section**
  - Goal. Three-column grid of cars pulled live from Supabase, filtered to `status = 'available'`, ordered by `week_added desc`, limited to 6.
  - Files touched. `components/home/OnTheLot.tsx`, `components/inventory/CarCard.tsx`, `lib/queries/inventory.ts`.
  - Acceptance. Query runs server-side in a Server Component. Cards link to `/lot/[slug]`. No card borders, no backgrounds, typography only. "View all inventory" tertiary link top-right of the section.

- [x] **3.6 Walk the lot video section**
  - Goal. Full-width 16:9 player, autoplay muted on scroll into view, with caption.
  - Files touched. `components/home/WalkTheLot.tsx`.
  - Acceptance. Uses Intersection Observer to start playback. Pauses when out of view. Has 1px hairline border. Placeholder video for now.

- [x] **3.7 Brands section**
  - Goal. Six-column logo grid with hairline cells, pulled from Supabase `brands_sourced`.
  - Files touched. `components/home/Brands.tsx`, `lib/queries/brands.ts`.
  - Acceptance. Logos at 80% opacity, 100% on hover. Responsive: 3 columns tablet, 2 columns mobile. Tertiary link below.

- [x] **3.8 Testimonials section**
  - Goal. Manual-navigation carousel, one quote at a time, dot indicators, arrows on left and right edges.
  - Files touched. `components/home/Testimonials.tsx`, `lib/queries/testimonials.ts`.
  - Acceptance. No autoplay. 300ms slide transition. Active dot in red. Pulled from Supabase where `displayed_on_homepage = true`, ordered by `order_index`.

- [x] **3.9 Team section**
  - Goal. Five-column grid of team members with portrait, name, role, hairline divider.
  - Files touched. `components/home/Team.tsx`, `lib/queries/team.ts`.
  - Acceptance. 3:4 portraits. Pulled from Supabase where `displayed_on_homepage = true`. No social icons. No bios on home.

- [x] **3.10 Market intel section**
  - Goal. Three article cards, typography only, no images.
  - Files touched. `components/home/MarketIntel.tsx`, `lib/queries/marketIntel.ts`.
  - Acceptance. Cards link to `/intel/[slug]` (route built later but link works in markup). 1px right border between cards.

- [x] **3.11 Final CTA band and full footer**
  - Goal. Black CTA band before footer. Five-column footer per spec.
  - Files touched. `components/home/FinalCTA.tsx`, `components/site/Footer.tsx` (expand from placeholder).
  - Acceptance. CTA buttons route correctly. Footer columns balanced. Copyright row at bottom with privacy and terms links.

- [ ] **3.12 Home page polish pass**
  - Goal. Review the full home page against `cchubbuild.md` line by line. Fix every drift.
  - Files touched. Any home component files.
  - Acceptance. Lighthouse 95+ on the preview URL. No console warnings. Mobile rendering perfect on iPhone 14 and Pixel 7 viewports. All section transitions are 400ms fade with 12px translate, nothing more.

---

## Phase 4 — Inventory pages

Goal of this phase. The lot index, filters, sorting, pagination, and individual car detail pages.

- [x] **4.1 Lot index page**
  - Goal. `/lot` route with page header, sticky filter bar, sort dropdown, four-column grid, pagination.
  - Files touched. `app/(marketing)/lot/page.tsx`, `components/inventory/FilterBar.tsx`, `components/inventory/SortDropdown.tsx`, `components/inventory/InventoryGrid.tsx`, `components/inventory/Pagination.tsx`.
  - Acceptance. Filters work via URL search params (e.g. `/lot?condition=used&body=sedan`). Sort works the same way. Server-side queries with proper RLS-respecting client. Pagination is page numbers, not infinite scroll.

- [x] **4.2 Car detail page**
  - Goal. `/lot/[slug]` route with hero image, two-column layout, sticky price card, walkaround video, gallery, landed cost calculator.
  - Files touched. `app/(marketing)/lot/[slug]/page.tsx`, `components/inventory/CarHero.tsx`, `components/inventory/SpecTable.tsx`, `components/inventory/PriceCard.tsx`, `components/inventory/Walkaround.tsx`, `components/inventory/Gallery.tsx`, `components/inventory/LandedCostCalculator.tsx`.
  - Acceptance. Breadcrumb at top. Right column sticky on scroll. Tabbed information block displays as a single structured spec table with hairline rows. Gallery is 3x3. Calculator updates totals client-side as the destination port changes. Page returns 404 for invalid slugs.

- [ ] **4.3 Landed cost calculator logic**
  - Goal. Real arithmetic for FOB, ocean shipping, insurance, customs duty, ECOWAS levy, NAC levy, terminal handling, clearing agent, CCH service fee.
  - Files touched. `lib/calculators/landedCost.ts`, `lib/calculators/landedCost.test.ts`.
  - Acceptance. Configurable rate table per destination port. Unit tests cover Lagos Apapa, Lagos Tin Can, Tema, Cotonou, Dakar. Totals match a sample calculation provided by the operator. All numbers formatted as USD with thousand separators.

---

## Phase 5 — Request form and notifications

Goal of this phase. The request form works end to end. Submission writes to Supabase, sends WhatsApp, sends fallback email, and survives a failure of either notification path.

- [ ] **5.1 Request form UI**
  - Goal. Build the form per spec with floating labels, multi-select chips, sliders, radios, Turnstile widget.
  - Files touched. `app/(marketing)/request/page.tsx`, `components/request/RequestForm.tsx`, `components/request/ChipMultiSelect.tsx`, `components/request/CountryCodeSelect.tsx`.
  - Acceptance. Validation with Zod and React Hook Form. Error states use 1px red border, not red fills. Turnstile widget styled to match.

- [ ] **5.2 Request server action**
  - Goal. Server action that validates input, verifies Turnstile, checks rate limit, writes to Supabase, fires notifications, returns result.
  - Files touched. `app/(marketing)/request/actions.ts`, `lib/security/turnstile.ts`, `lib/security/rateLimit.ts`.
  - Acceptance. File starts with `import 'server-only'`. Turnstile verified server-side using the secret key. Rate limit at 5 per IP per hour using Upstash Redis. Lead saved before any notification fires.

- [ ] **5.3 WhatsApp Cloud API integration**
  - Goal. Send a formatted message to the CCH operations number with the lead summary.
  - Files touched. `lib/notifications/whatsapp.ts`, `lib/notifications/whatsapp.test.ts`.
  - Acceptance. Uses the operator's WhatsApp Cloud API credentials. Message includes name, WhatsApp, email, destination, use case, budget, timeline, notes. Failures are logged to the `notification_status` field on the row, not thrown.

- [ ] **5.4 Email fallback via Resend**
  - Goal. Send a formatted email to the CCH operations inbox as fallback.
  - Files touched. `lib/notifications/email.ts`, `emails/NewLead.tsx`.
  - Acceptance. Uses Resend with a React Email template. Same lead summary as WhatsApp. Always sent regardless of WhatsApp success (both for redundancy). Failures logged to `notification_status`.

- [ ] **5.5 Confirmation screen**
  - Goal. After successful submission, show a confirmation screen with a WhatsApp deep link.
  - Files touched. `components/request/Confirmation.tsx`.
  - Acceptance. WhatsApp deep link prefills a message: "Hi CCH, I just submitted a request on your site." Browser does not navigate, just swaps the form for the confirmation.

---

## Phase 6 — Process, About, and Market Intel pages

Goal of this phase. The three remaining content pages live.

- [ ] **6.1 Process page**
  - Goal. `/process` route with six step sections, alternating image alignment, oversized step numbers, sub-checklists, full-bleed dividers between steps.
  - Files touched. `app/(marketing)/process/page.tsx`, `components/process/ProcessStep.tsx`.
  - Acceptance. Each step has a 200-word body, three to five sub-step bullets, and a 16:9 image. Bottom CTA band reuses the home page component.

- [ ] **6.2 About page**
  - Goal. `/about` route with founder hero, company timeline, full team grid with bios, Guangzhou office gallery, CTA band.
  - Files touched. `app/(marketing)/about/page.tsx`, `components/about/FounderHero.tsx`, `components/about/Timeline.tsx`, `components/about/FullTeamGrid.tsx`, `components/about/OfficeGallery.tsx`.
  - Acceptance. Timeline renders as a vertical sequence with hairline connectors. Full team grid pulls all `team_members` rows. Bios open in a slide-over panel, not a route change.

- [ ] **6.3 Market intel index and detail**
  - Goal. `/intel` index with all posts in a clean list, `/intel/[slug]` detail with prose styling.
  - Files touched. `app/(marketing)/intel/page.tsx`, `app/(marketing)/intel/[slug]/page.tsx`, `components/intel/PostCard.tsx`, `lib/markdown.ts`.
  - Acceptance. Markdown body renders with the corporate typography. Read time displayed. No images in card grid on the index. Detail page is 720px max content width.

- [ ] **6.4 MailerLite newsletter signup**
  - Goal. Newsletter signup block on the market intel index page, with Turnstile, server action, write to MailerLite group.
  - Files touched. `components/intel/NewsletterSignup.tsx`, `app/api/newsletter/route.ts` (or server action), `lib/notifications/mailerlite.ts`.
  - Acceptance. Subscribes to MailerLite group ID from env. Returns a clean success state, no page reload. Errors handled gracefully.

---

## Phase 7 — Admin foundation

Goal of this phase. A minimal authenticated admin route where the operator can view leads and update inventory status. Not a full CMS, just enough to operate.

- [ ] **7.1 Supabase Auth setup**
  - Goal. Email magic link auth with a single admin role enforced via RLS.
  - Files touched. `supabase/migrations/0003_admin_role.sql`, `app/(admin)/layout.tsx`, `lib/auth/admin.ts`, `middleware.ts`.
  - Acceptance. `/admin` redirects to `/admin/login` for unauthenticated users. Magic link arrives within 60 seconds. Only invited emails (added by the operator in Supabase) can complete login. RLS prevents non-admin authenticated users from reading `quote_requests`.

- [ ] **7.2 Leads dashboard**
  - Goal. `/admin/leads` route with a table of all quote requests, sortable, with status update controls.
  - Files touched. `app/(admin)/leads/page.tsx`, `components/admin/LeadsTable.tsx`, `app/(admin)/leads/actions.ts`.
  - Acceptance. Shows lead summary, status, notification status, created date. Status updates via server action. Failed notifications can be retried with a button.

- [ ] **7.3 Inventory admin**
  - Goal. `/admin/inventory` route to mark cars as reserved, sold, or available, and edit prices.
  - Files touched. `app/(admin)/inventory/page.tsx`, `components/admin/InventoryTable.tsx`, `app/(admin)/inventory/actions.ts`.
  - Acceptance. Table view of all inventory. Quick status changes via dropdown. Price edits inline. New inventory creation deferred to a later milestone, just status and price edits for now.

---

## Phase 8 — Launch readiness

Goal of this phase. The site is ready to point the production domain at.

- [ ] **8.1 SEO and metadata**
  - Goal. Every route has proper title, description, OG image. Generate `sitemap.xml` and `robots.txt`.
  - Files touched. `app/sitemap.ts`, `app/robots.ts`, `app/(marketing)/*/page.tsx` (add `generateMetadata` to each).
  - Acceptance. Page titles follow the pattern "Page name — CCH Automobile". Descriptions written in the brand voice. OG images either custom designed or use the hero image of each page.

- [ ] **8.2 Analytics**
  - Goal. Add Vercel Analytics and Vercel Speed Insights. No third-party trackers.
  - Files touched. `app/layout.tsx`, `package.json`.
  - Acceptance. Both packages installed and configured. Privacy footer line updated to reflect Vercel-only analytics.

- [ ] **8.3 Error pages**
  - Goal. Custom `not-found.tsx` and `error.tsx` that match the brand.
  - Files touched. `app/not-found.tsx`, `app/error.tsx`.
  - Acceptance. 404 page has the brand voice and a primary red CTA back to home or to `/lot`. Error page logs to console, shows a calm message, offers a retry.

- [ ] **8.4 Accessibility audit**
  - Goal. Pass axe DevTools with zero critical issues. Keyboard navigation works on every page.
  - Files touched. Any with issues.
  - Acceptance. All images have alt text. All form inputs have labels. Color contrast passes AA. Focus rings visible on every interactive element. Tab order matches visual order.

- [ ] **8.5 Performance audit**
  - Goal. Lighthouse 95+ on all main routes on the preview URL, on both mobile and desktop tabs.
  - Files touched. Anywhere needed to hit the target.
  - Acceptance. All hero images using `priority`. All other images lazy by default. Fonts using `display: swap`. No render-blocking third-party scripts. JavaScript bundle for the home route under 200kb.

- [ ] **8.6 Production env and domain**
  - Goal. Configure production environment variables in Vercel. Point the production domain. Confirm WhatsApp Cloud API webhook secrets in production differ from preview.
  - Files touched. None in repo. Vercel and DNS settings.
  - Acceptance. `https://cchautomobile.com` (or final domain) serves the site. HTTPS valid. WWW redirect configured. All env vars set in the Production environment, not just Preview.

- [ ] **8.7 Final pre-launch checklist**
  - Goal. Walk the site end to end as a real visitor. Submit a real test request. Verify the operator received both WhatsApp and email. Mark the test lead as test in the admin panel.
  - Files touched. None.
  - Acceptance. Real lead arrives in WhatsApp within 30 seconds. Email arrives within 60 seconds. Lead visible in `/admin/leads`. All forms work. All links work. No console errors. No 404s on any link in the footer or nav.

---

## Conventions

Commit messages. `phase.task: short description`. Example: `3.5: implement on the lot section`.

Branches. Work on `main` for solo development, or one branch per phase if multiple contributors. Each task is small enough to be one commit.

Code style. Prettier and ESLint configs come from the Next.js scaffold. Do not change them mid-build. Component files use named exports, not default, except for Next.js pages and layouts which require default exports.

Server vs client. Default to Server Components. Only add `'use client'` when a component needs state, effects, or browser APIs. Server actions live in `actions.ts` files colocated with the route, not in a global `lib/actions/` folder.

Asset placeholders. All placeholders go in `/public/placeholders/` and are named clearly, e.g. `lot-hero-placeholder.jpg`. Track every placeholder in `BLOCKERS.md` so the operator knows what real assets are still needed.
