import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import {
  BRAND,
  whatsappButton,
  whatsappTextLink,
  wrapEmailHtml,
} from "@/lib/email/templates/shell";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const ngnNumber = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 0,
});

function formatNgn(amount: number): string {
  return `₦${ngnNumber.format(amount)}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

function firstName(name: string): string {
  return name.split(" ")[0] || name;
}

export function renderQuoteDeliverySubject(quote: QuoteWithClient): string {
  return `Your quote for the ${quote.carName} — ${BRAND.name}`;
}

export function renderQuoteDeliveryText(quote: QuoteWithClient): string {
  const fxRate = quote.exchangeRateNgn;
  const totalNgn =
    fxRate != null ? Math.round(quote.totalUsd * fxRate) : null;

  const lines: string[] = [
    `Hello ${firstName(quote.clientName)},`,
    "",
    `Thank you for your interest in the ${quote.carYear} ${quote.carName}.`,
    "Your quote is attached to this email as a PDF.",
    "",
    "Quote summary:",
    `  Vehicle:     ${quote.carYear} ${quote.carName} (${quote.carCondition})`,
    `  Car code:    ${quote.carCode}`,
    `  Total (USD): ${usd.format(quote.totalUsd)} FOB Guangzhou`,
    ...(totalNgn != null
      ? [`  In Naira:    ≈ ${formatNgn(totalNgn)}`]
      : []),
    ...(fxRate != null
      ? [`  FX rate:     1 USD = ${formatNgn(fxRate)}`]
      : []),
    `  Valid until: ${formatDate(quote.validUntil)}`,
  ];

  if (quote.personalNote) {
    lines.push("", "From our sales team:", quote.personalNote);
  }

  lines.push(
    "",
    "If you'd like to proceed, reply to this email or tap the WhatsApp link below — we'll prepare your deposit invoice and confirm shipping.",
    "",
    `WhatsApp: ${whatsappTextLink()}`,
    "",
    "Thank you for choosing CCH Automobile.",
    "",
    "Best regards,",
    BRAND.name,
    "",
    "—",
    BRAND.address,
  );

  return lines.join("\n");
}

export function renderQuoteDeliveryHtml(quote: QuoteWithClient): string {
  const fxRate = quote.exchangeRateNgn;
  const totalNgn =
    fxRate != null ? Math.round(quote.totalUsd * fxRate) : null;

  const ngnLine =
    totalNgn != null
      ? `<div style="font-size:13px;color:${BRAND.corporateBlack};font-weight:600;margin-top:4px;">≈ ${escape(formatNgn(totalNgn))}</div>`
      : "";
  const fxLine =
    fxRate != null
      ? `<div style="font-size:11px;color:${BRAND.textTertiary};margin-top:4px;">1 USD = ${escape(formatNgn(fxRate))}</div>`
      : "";

  const summaryCallout = `
    <div style="margin:0 0 24px;padding:16px 18px;background:#fbfbfc;border:1px solid ${BRAND.hairline};border-radius:6px;">
      <div style="font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.cchRed};font-weight:600;margin-bottom:8px;">Quote summary</div>
      <div style="font-size:15.5px;color:${BRAND.corporateBlack};font-weight:600;margin-bottom:4px;">${escape(`${quote.carYear} ${quote.carName}`)}</div>
      <div style="font-size:12.5px;color:${BRAND.textSecondary};margin-bottom:12px;">${escape(quote.carCondition === "new" ? "New" : "Used")} · Car code ${escape(quote.carCode)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.textTertiary};padding-bottom:4px;">Total · FOB Guangzhou</td>
          <td align="right" style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.textTertiary};padding-bottom:4px;">Valid until</td>
        </tr>
        <tr>
          <td style="font-size:20px;font-weight:700;color:${BRAND.cchRed};">${escape(usd.format(quote.totalUsd))}</td>
          <td align="right" style="font-size:14px;font-weight:500;color:${BRAND.corporateBlack};">${escape(formatDate(quote.validUntil))}</td>
        </tr>
        ${ngnLine || fxLine ? `<tr><td colspan="2">${ngnLine}${fxLine}</td></tr>` : ""}
      </table>
    </div>
  `;

  const personalNoteBlock = quote.personalNote
    ? `<div style="margin:0 0 20px;padding:14px 16px;background:${BRAND.cchRedSoft};border-left:3px solid ${BRAND.cchRed};border-radius:6px;">
        <div style="font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.cchRed};font-weight:600;margin-bottom:6px;">From our sales team</div>
        <div style="font-size:13.5px;color:${BRAND.corporateBlack};line-height:1.55;white-space:pre-wrap;">${escape(quote.personalNote)}</div>
      </div>`
    : "";

  const para = (text: string) =>
    `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:${BRAND.corporateBlack};">${text}</p>`;

  const bodyHtml = `
    ${summaryCallout}
    ${para(`Thank you for your interest in the <strong>${escape(`${quote.carYear} ${quote.carName}`)}</strong>. Your detailed quote is attached to this email as a PDF.`)}
    ${personalNoteBlock}
    ${para(
      "If you'd like to move forward, reply to this email or message our team on WhatsApp. We'll prepare your deposit invoice and confirm shipping to your port.",
    )}
    ${whatsappButton("Message us on WhatsApp")}
    ${para("Thank you for choosing CCH Automobile.")}
    <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:${BRAND.corporateBlack};">
      Best regards,<br/>
      <span style="font-weight:600;">CCH Automobile</span>
    </p>
  `;

  return wrapEmailHtml({
    preheader: `Your quote for the ${quote.carYear} ${quote.carName}: ${usd.format(quote.totalUsd)} FOB Guangzhou. Valid until ${formatDate(quote.validUntil)}.`,
    eyebrow: "Quote ready",
    headline: `Your quote, ${firstName(quote.clientName)}.`,
    bodyHtml,
  });
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
