# Blockers

Real assets and operator-provided details the build is currently stubbing out. Each entry names the placeholder location, the asset or fact needed, and the task that introduced it.

## Operator contact details

- **CCH operations phone number** — utility bar top-right ([components/site/UtilityBar.tsx](components/site/UtilityBar.tsx)). Currently rendered as the literal string `+86 · placeholder`. Replace with the real number used for inbound calls. Introduced in Task 1.4.
- **CCH WhatsApp number** — utility bar top-right WhatsApp link ([components/site/UtilityBar.tsx](components/site/UtilityBar.tsx)) and main nav drawer. Currently links to `https://wa.me/0000000000`. Replace with the real operations WhatsApp number (digits only, with country code, no `+`). Introduced in Task 1.4.

## Imagery and video

_None yet. Hero image and lot photos arrive in Phase 3._

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
