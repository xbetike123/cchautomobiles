type ConfirmationInput = {
  name: string;
  preferredBrand: string | null;
  preferredModel: string | null;
  cchCarCode: string | null;
};

export function renderRequestConfirmationSubject(): string {
  return "We've got your CCH request";
}

export function renderRequestConfirmationText({
  name,
  preferredBrand,
  preferredModel,
  cchCarCode,
}: ConfirmationInput): string {
  const lines = [
    `Hi ${name},`,
    "",
    "Thanks for reaching out to CCH Automobile. Your request has landed with our Guangzhou team and someone will follow up on WhatsApp within 24 hours.",
    "",
    "What you sent us:",
    `  Brand: ${preferredBrand ?? "Not sure yet"}`,
    `  Model: ${preferredModel ?? "Not specified"}`,
    `  CCH car code: ${cchCarCode ?? "Not specified"}`,
    "",
    "If anything changes — budget, destination port, urgency — just reply to this email or message us on WhatsApp and we'll update your file.",
    "",
    "— CCH Automobile",
    "Guangzhou export group · EV sourcing for Africa",
  ];
  return lines.join("\n");
}

export function renderRequestConfirmationHtml({
  name,
  preferredBrand,
  preferredModel,
  cchCarCode,
}: ConfirmationInput): string {
  const detail = (label: string, value: string | null) =>
    `<tr>
      <td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">${label}</td>
      <td style="padding:6px 0;color:#0a0a0a;font-size:13px;font-weight:500;">${
        value ?? '<span style="color:#9ca3af;font-weight:400;">—</span>'
      }</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>We've got your CCH request</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0a0a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f6f6f6;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#C8102E;">CCH Automobile</p>
                <h1 style="margin:10px 0 0 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;color:#0a0a0a;line-height:1.25;">Your request landed in Guangzhou.</h1>
                <p style="margin:14px 0 0 0;font-size:14px;line-height:1.55;color:#4b5563;">
                  Hi ${escapeHtml(name)}, thanks for getting in touch. Our team will follow up on WhatsApp within 24 hours with availability, pricing, and next steps.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#9ca3af;">What you sent us</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;">
                  ${detail("Brand", preferredBrand ? escapeHtml(preferredBrand) : "Not sure yet")}
                  ${detail("Model", preferredModel ? escapeHtml(preferredModel) : null)}
                  ${detail("CCH car code", cchCarCode ? escapeHtml(cchCarCode) : null)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#4b5563;">
                  If your budget, destination port, or timing changes, just reply to this email and we'll update your file before we send the shortlist.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#0a0a0a;padding:18px 32px;">
                <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.85);font-weight:500;">CCH Automobile</p>
                <p style="margin:2px 0 0 0;font-size:11.5px;color:rgba(255,255,255,0.55);">Guangzhou export group · EV sourcing for Africa</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0 0;font-size:11px;color:#9ca3af;">You're receiving this because you submitted a request on cchautomobile.com.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
