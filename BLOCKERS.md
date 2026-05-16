# Blockers

Real assets and operator-provided details the build is currently stubbing out. Each entry names the placeholder location, the asset or fact needed, and the task that introduced it.

## Operator contact details

- **CCH operations phone number** — utility bar top-right ([components/site/UtilityBar.tsx](components/site/UtilityBar.tsx)). Currently rendered as the literal string `+86 · placeholder`. Replace with the real number used for inbound calls. Introduced in Task 1.4.
- **CCH WhatsApp number** — utility bar ([components/site/UtilityBar.tsx](components/site/UtilityBar.tsx)), final CTA band ([components/home/FinalCTA.tsx](components/home/FinalCTA.tsx)), and footer ([components/site/Footer.tsx](components/site/Footer.tsx)). All three currently link to `https://wa.me/0000000000`. Replace with the real operations WhatsApp number (digits only, with country code, no `+`). Introduced in Task 1.4, reused in 3.11.
- **CCH operations addresses and email** — Guangzhou lot address, Lagos representative address, and operations email rendered in the footer ([components/site/Footer.tsx](components/site/Footer.tsx)). Currently placeholder strings. Introduced in Task 3.11.

## Imagery and video

- **Home page hero image** — cinematic 21:9 photograph of the CCH lot in Guangzhou. Currently rendered with [public/placeholders/lot-hero.svg](public/placeholders/lot-hero.svg), a dark placeholder with three faint car silhouettes. Replace with a real `.jpg` (suggested path `public/lot-hero.jpg`) and update the `src` in [components/home/Hero.tsx](components/home/Hero.tsx). Introduced in Task 3.1.
- **Walk the Lot walkaround video** — full-width 16:9 walkaround of the CCH lot, filmed by the operations team and refreshed weekly. Currently the section in [components/home/WalkTheLot.tsx](components/home/WalkTheLot.tsx) renders only the placeholder poster at [public/placeholders/walk-the-lot-poster.svg](public/placeholders/walk-the-lot-poster.svg). When the file is ready (suggested path `public/walk-the-lot.mp4`), set `VIDEO_SRC` at the top of `WalkTheLot.tsx` to that path. The IntersectionObserver autoplay wiring is already in place. Introduced in Task 3.6.
- **Brand logos** — flat black wordmark SVGs for BYD, Geely, Xpeng, Zeekr, Wuling, Leapmotor, Nio, Li Auto, Hongqi, Aion, Neta, and Avatr. Until logo files are dropped into `public/placeholders/` (paths in [supabase/seed.sql](supabase/seed.sql)) and the matching rows updated in Supabase, the brand grid in [components/home/Brands.tsx](components/home/Brands.tsx) falls back to rendering the brand name as text. Introduced in Task 3.7.
- **Team portraits** — 3:4 portraits of each CCH team member who appears on the home page (operations, sourcing, inspection, logistics, client relations). Currently every card in [components/home/Team.tsx](components/home/Team.tsx) renders [public/placeholders/team-portrait.svg](public/placeholders/team-portrait.svg). Replace the `photo_url` per team member in Supabase or in the fixture inside [lib/queries/team.ts](lib/queries/team.ts). Introduced in Task 3.9.

## Environment secrets

`.env.local` is not committed and is currently empty. The shape lives in
[.env.example](.env.example). Operator must create the following accounts
and supply credentials before the indicated phase can run:

- **Supabase project** — needed for Phase 2 onwards.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **WhatsApp Cloud API** — needed for Task 5.3.
  - `WHATSAPP_CLOUD_API_TOKEN`
  - `WHATSAPP_PHONE_NUMBER_ID`
  - `WHATSAPP_OPERATIONS_NUMBER` (digits only, with country code, no `+`)
- **MailerLite** — needed for Task 6.4.
  - `MAILERLITE_API_KEY`
  - `MAILERLITE_GROUP_ID`
- **Cloudflare Turnstile** — needed for Task 5.1 and the request page.
  - `TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`
- **Resend** — needed for Task 5.4.
  - `RESEND_API_KEY`
- **Upstash Redis** — needed for Task 5.2 rate limiting.
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
