import type { Invoice } from "@/lib/admin/types";
import { BRAND, wrapEmailHtml } from "@/lib/email/templates/shell";

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

function formatDate(value: string | null): string {
  if (!value) return "Not specified";
  return dateFormatter.format(new Date(value));
}

function firstName(name: string): string {
  return name.split(" ")[0] || name;
}

function kindLabel(kind: Invoice["kind"]): string {
  if (kind === "deposit") return "Deposit invoice";
  if (kind === "balance") return "Balance invoice";
  return "Invoice";
}

export function renderInvoiceDeliverySubject(invoice: Invoice): string {
  const kind = kindLabel(invoice.kind);
  return `${kind} ${invoice.invoiceNumber} — ${BRAND.name}`;
}

export function renderInvoiceDeliveryText(invoice: Invoice): string {
  const fxRate = invoice.exchangeRateNgn;
  const amountNgn =
    fxRate != null ? Math.round(invoice.amountUsd * fxRate) : null;

  const lines: string[] = [
    `Hello ${firstName(invoice.clientName)},`,
    "",
    `Please find your ${kindLabel(invoice.kind).toLowerCase()} attached to this email as a PDF.`,
    "",
    "Invoice summary:",
    `  Invoice #:   ${invoice.invoiceNumber}`,
    `  Vehicle:     ${invoice.carDescription ?? "—"}`,
    `  Amount due:  ${usd.format(invoice.amountUsd)} USD`,
    ...(amountNgn != null
      ? [`  In Naira:    ≈ ${formatNgn(amountNgn)}`]
      : []),
    ...(fxRate != null
      ? [`  FX rate:     1 USD = ${formatNgn(fxRate)}`]
      : []),
    `  Issued:      ${formatDate(invoice.issuedAt)}`,
    `  Due:         ${formatDate(invoice.dueAt)}`,
  ];

  lines.push(
    "",
    "Payment methods:",
    "  USD wires:   Bank of China · Guangzhou — Naiyuan Mart Ltd.",
    "  NGN local:   Guaranty Trust Bank — Naiyuan Mart Ltd.",
    "  (Full account numbers are listed in the attached PDF.)",
  );

  if (invoice.notes) {
    lines.push("", "Notes:", invoice.notes);
  }

  lines.push(
    "",
    `Once payment is on the way, reply to this email or message us on WhatsApp at ${BRAND.phone} with the wire confirmation and we'll mark the invoice as paid.`,
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

export function renderInvoiceDeliveryHtml(invoice: Invoice): string {
  const whatsappHref = `https://wa.me/${BRAND.phone.replace(/[^\d]/g, "")}`;
  const kind = kindLabel(invoice.kind);
  const fxRate = invoice.exchangeRateNgn;
  const amountNgn =
    fxRate != null ? Math.round(invoice.amountUsd * fxRate) : null;

  const ngnLine =
    amountNgn != null
      ? `<div style="font-size:13px;color:${BRAND.corporateBlack};font-weight:600;margin-top:4px;">≈ ${escape(formatNgn(amountNgn))}</div>`
      : "";
  const fxLine =
    fxRate != null
      ? `<div style="font-size:11px;color:${BRAND.textTertiary};margin-top:4px;">1 USD = ${escape(formatNgn(fxRate))}</div>`
      : "";

  const summaryCallout = `
    <div style="margin:0 0 24px;padding:16px 18px;background:#fbfbfc;border:1px solid ${BRAND.hairline};border-radius:6px;">
      <div style="font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.cchRed};font-weight:600;margin-bottom:8px;">${escape(kind)} · ${escape(invoice.invoiceNumber)}</div>
      ${invoice.carDescription ? `<div style="font-size:14.5px;color:${BRAND.corporateBlack};font-weight:600;margin-bottom:12px;">${escape(invoice.carDescription)}</div>` : ""}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.textTertiary};padding-bottom:4px;">Amount due</td>
          <td align="right" style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.textTertiary};padding-bottom:4px;">Due by</td>
        </tr>
        <tr>
          <td style="font-size:22px;font-weight:700;color:${BRAND.cchRed};">${escape(usd.format(invoice.amountUsd))}</td>
          <td align="right" style="font-size:14px;font-weight:500;color:${BRAND.corporateBlack};">${escape(formatDate(invoice.dueAt))}</td>
        </tr>
        ${ngnLine || fxLine ? `<tr><td colspan="2">${ngnLine}${fxLine}</td></tr>` : ""}
      </table>
    </div>
  `;

  const paymentBlock = `
    <div style="margin:0 0 24px;padding:16px 18px;background:#fbfbfc;border:1px solid ${BRAND.hairline};border-radius:6px;">
      <div style="font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.textTertiary};font-weight:600;margin-bottom:10px;">Payment methods</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.textTertiary};padding-bottom:2px;width:80px;">USD wires</td>
          <td style="font-size:13.5px;color:${BRAND.corporateBlack};font-weight:500;padding-bottom:2px;">Bank of China · Guangzhou</td>
        </tr>
        <tr>
          <td></td>
          <td style="font-size:12px;color:${BRAND.textSecondary};padding-bottom:10px;">Naiyuan Mart Ltd. · SWIFT BKCHCNBJ</td>
        </tr>
        <tr>
          <td style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.textTertiary};padding-bottom:2px;">NGN local</td>
          <td style="font-size:13.5px;color:${BRAND.corporateBlack};font-weight:500;padding-bottom:2px;">Guaranty Trust Bank</td>
        </tr>
        <tr>
          <td></td>
          <td style="font-size:12px;color:${BRAND.textSecondary};">Naiyuan Mart Ltd. · SWIFT GTBINGLA</td>
        </tr>
      </table>
      <div style="font-size:11.5px;color:${BRAND.textTertiary};margin-top:10px;">Full account numbers are in the attached PDF.</div>
    </div>
  `;

  const notesBlock = invoice.notes
    ? `<div style="margin:0 0 20px;padding:14px 16px;background:${BRAND.cchRedSoft};border-left:3px solid ${BRAND.cchRed};border-radius:6px;">
        <div style="font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.cchRed};font-weight:600;margin-bottom:6px;">Notes</div>
        <div style="font-size:13.5px;color:${BRAND.corporateBlack};line-height:1.55;white-space:pre-wrap;">${escape(invoice.notes)}</div>
      </div>`
    : "";

  const para = (text: string) =>
    `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:${BRAND.corporateBlack};">${text}</p>`;

  const bodyHtml = `
    ${summaryCallout}
    ${para(`Please find your ${kind.toLowerCase()} attached to this email as a PDF.`)}
    ${paymentBlock}
    ${notesBlock}
    ${para(
      `Once payment is on the way, reply to this email or message us on WhatsApp at <a href="${whatsappHref}" style="color:${BRAND.cchRed};text-decoration:none;font-weight:500;">${BRAND.phone}</a> with the wire confirmation and we'll mark the invoice as paid.`,
    )}
    ${para("Thank you for choosing CCH Automobile.")}
    <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:${BRAND.corporateBlack};">
      Best regards,<br/>
      <span style="font-weight:600;">CCH Automobile</span>
    </p>
  `;

  return wrapEmailHtml({
    preheader: `${kind} ${invoice.invoiceNumber} for ${usd.format(invoice.amountUsd)} USD. Due ${formatDate(invoice.dueAt)}.`,
    eyebrow: kind,
    headline: `${kind} ${invoice.invoiceNumber}`,
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
