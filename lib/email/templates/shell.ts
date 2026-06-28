/**
 * Shared brand shell for CCH transactional emails. Both the operator
 * notification (new-lead) and the customer auto-reply (lead-confirmation)
 * wrap their unique body through `wrapEmailHtml` so headers, footers, and
 * brand styling stay consistent.
 *
 * Email-safe rules followed:
 *   - Tables for layout (Gmail / Outlook compatibility)
 *   - All styles inline; no <style> blocks; no external CSS or web fonts
 *   - System font stack only
 *   - 600px max width
 *   - Preheader text rendered hidden for inbox previews
 */

export const BRAND = {
  name: "CCH Automobile",
  address:
    "101-103 Agile Time Mansion, Wehai Road, Shibi, Panyu District, Guangzhou, China",
  email: "hello@chinesecarshub.com",
  phone: "+86 131 0670 0341",
  site: "cchautomobile.com",
  cchRed: "#E63946",
  cchRedSoft: "#FDE8EA",
  corporateBlack: "#0A0A0A",
  textSecondary: "#52606D",
  textTertiary: "#9CA3AF",
  hairline: "rgba(15,23,42,0.08)",
  surfaceTint: "#F6F7F9",
} as const;

/**
 * Email images need an absolute URL. SITE_URL points at the canonical
 * deployment (e.g. https://cchautomobile.com) and is set per environment
 * in Vercel. Falls back to a sensible production guess so prod emails
 * don't ship a relative path if the var is ever unset.
 */
function siteUrl(): string {
  const url =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://cchautomobile.com";
  return url.replace(/\/$/, "");
}

/**
 * Absolute URL for the email logo. Emails can't load relative paths or
 * localhost, so this must point at a publicly reachable host.
 *
 * Set EMAIL_LOGO_URL to override — useful before the main site is deployed
 * (point it at a CDN / Supabase public bucket) or to preview locally
 * (EMAIL_LOGO_URL=http://localhost:3000/logo/cch_logo_email.png).
 *
 * Otherwise it falls back to the optimized logo on the canonical site.
 */
function logoUrl(): string {
  const override = process.env.EMAIL_LOGO_URL?.trim();
  if (override) return override;
  return `${siteUrl()}/logo/cch_logo_email.png`;
}

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

type WrapOptions = {
  /** Inbox preview text. Shown by most clients next to the subject. */
  preheader: string;
  /** Small uppercase label rendered above the headline in CCH red. */
  eyebrow: string;
  /** Main email headline. */
  headline: string;
  /** Optional supporting paragraph rendered under the headline. */
  intro?: string;
  /** HTML for the body content. Already escaped by the caller. */
  bodyHtml: string;
};

export function wrapEmailHtml(opts: WrapOptions): string {
  const { preheader, eyebrow, headline, intro, bodyHtml } = opts;

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escape(headline)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.surfaceTint};font-family:${FONT_STACK};color:${BRAND.corporateBlack};-webkit-font-smoothing:antialiased;">
<!-- Preheader: hidden in body, surfaced by clients in the inbox preview. -->
<div style="display:none;max-height:0;overflow:hidden;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${BRAND.surfaceTint};opacity:0;">
  ${escape(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BRAND.surfaceTint};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${BRAND.hairline};border-radius:10px;overflow:hidden;">
      <!-- CCH red accent bar -->
      <tr><td style="height:4px;background:${BRAND.cchRed};line-height:4px;font-size:0;">&nbsp;</td></tr>

      <!-- Brand header -->
      <tr><td align="center" style="padding:20px 32px 18px;border-bottom:1px solid ${BRAND.hairline};text-align:center;">
        <a href="${siteUrl()}" style="display:inline-block;text-decoration:none;line-height:0;">
          <img src="${logoUrl()}" alt="${escape(BRAND.name)}" width="96" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:96px;margin:0 auto;" />
        </a>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:28px 32px 8px;">
        <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.cchRed};font-weight:600;margin-bottom:10px;font-family:${FONT_STACK};">
          ${escape(eyebrow)}
        </div>
        <h1 style="margin:0 0 ${intro ? "12px" : "20px"};font-size:24px;line-height:1.25;font-weight:600;color:${BRAND.corporateBlack};letter-spacing:-0.015em;font-family:${FONT_STACK};">
          ${escape(headline)}
        </h1>
        ${
          intro
            ? `<p style="margin:0 0 24px;font-size:14.5px;line-height:1.6;color:${BRAND.corporateBlack};font-family:${FONT_STACK};">${escape(intro)}</p>`
            : ""
        }
        ${bodyHtml}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:24px 32px 28px;border-top:1px solid ${BRAND.hairline};background:#fbfbfc;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr><td style="font-size:12px;line-height:1.6;color:${BRAND.textSecondary};font-family:${FONT_STACK};">
            <div style="font-weight:600;color:${BRAND.corporateBlack};margin-bottom:4px;">${escape(BRAND.name)}</div>
            <div>${escape(BRAND.address)}</div>
            <div style="margin-top:12px;font-size:11px;color:${BRAND.textTertiary};">© ${new Date().getFullYear()} ${escape(BRAND.name)}. All rights reserved.</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/**
 * Tiny HTML-entity escaper. Use on every user-controlled string interpolated
 * into the email body.
 */
export function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Render a label/value row for the email field table. Reused by both
 * templates so spacing and color stay in sync.
 */
export function leadRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:9px 16px 9px 0;color:${BRAND.textSecondary};font-size:13px;width:140px;vertical-align:top;font-family:${FONT_STACK};">${escape(label)}</td>
    <td style="padding:9px 0;color:${BRAND.corporateBlack};font-size:13.5px;font-weight:500;font-family:${FONT_STACK};">${escape(value)}</td>
  </tr>`;
}

/**
 * Multi-line value variant (used for Notes). Preserves whitespace and wraps
 * long content.
 */
export function leadRowMultiline(label: string, value: string): string {
  return `<tr>
    <td style="padding:9px 16px 9px 0;color:${BRAND.textSecondary};font-size:13px;vertical-align:top;font-family:${FONT_STACK};">${escape(label)}</td>
    <td style="padding:9px 0;color:${BRAND.corporateBlack};font-size:13.5px;line-height:1.55;white-space:pre-wrap;font-family:${FONT_STACK};">${escape(value)}</td>
  </tr>`;
}

/**
 * Renders the red-tinted "asking about" callout used at the top of both
 * the operator notification and the customer confirmation when the request
 * is attached to a specific car.
 */
export function aboutCarCallout(opts: {
  eyebrow: string;
  label: string;
  condition: "new" | "used";
  bodyType: string | null;
  priceUsdFob: number;
  slug?: string;
}): string {
  const conditionLine = `${opts.condition === "new" ? "New" : "Used"}${
    opts.bodyType ? ` · ${escape(opts.bodyType)}` : ""
  } · FOB $${opts.priceUsdFob.toLocaleString()}`;
  return `<div style="margin:0 0 24px;padding:16px 18px;background:${BRAND.cchRedSoft};border-left:3px solid ${BRAND.cchRed};border-radius:6px;font-family:${FONT_STACK};">
    <div style="font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.cchRed};font-weight:600;margin-bottom:6px;">${escape(opts.eyebrow)}</div>
    <div style="font-size:15.5px;color:${BRAND.corporateBlack};font-weight:600;">${escape(opts.label)}</div>
    <div style="font-size:12.5px;color:${BRAND.corporateBlack};margin-top:4px;">${conditionLine}</div>
    ${
      opts.slug
        ? `<div style="font-size:11px;color:${BRAND.textTertiary};margin-top:4px;">${escape(opts.slug)}</div>`
        : ""
    }
  </div>`;
}
