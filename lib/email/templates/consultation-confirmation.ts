import {
  BRAND,
  whatsappButton,
  whatsappTextLink,
  wrapEmailHtml,
} from "@/lib/email/templates/shell";

export type ConsultationEmailLead = {
  name: string;
};

export function renderConsultationConfirmationSubject(): string {
  return `We got your consultation request — ${BRAND.name}`;
}

export function renderConsultationConfirmationText(
  lead: ConsultationEmailLead,
): string {
  const firstName = lead.name.split(" ")[0] || "there";
  return [
    `Hi ${firstName},`,
    "",
    "Thank you for booking a vehicle sourcing consultation with CCH Automobile.",
    "",
    "We've received your request and our Guangzhou team will reach out shortly",
    "to confirm a convenient time and share the next steps.",
    "",
    "What to expect:",
    "  • We'll confirm your consultation time",
    "  • You'll complete a short questionnaire",
    "  • We meet via video call (up to 60 minutes)",
    "  • You receive clear recommendations and a follow-up summary",
    "",
    "Please note: this consultation is advisory only. Vehicle sourcing,",
    "inspections, and export services are quoted separately based on your",
    "requirements.",
    "",
    "If you have any questions in the meantime, reply to this email or message",
    "our team on WhatsApp.",
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
  ].join("\n");
}

export function renderConsultationConfirmationHtml(
  lead: ConsultationEmailLead,
): string {
  const firstName = lead.name.split(" ")[0] || "there";

  const paragraph = (text: string) =>
    `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#0a0a0a;">${text}</p>`;
  const bullet = (text: string) =>
    `<li style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#0a0a0a;">${text}</li>`;

  const bodyHtml = `
    ${paragraph(`Hi ${firstName},`)}
    ${paragraph(
      "Thank you for booking a vehicle sourcing consultation with CCH Automobile.",
    )}
    ${paragraph(
      "We&rsquo;ve received your request and our Guangzhou team will reach out shortly to confirm a convenient time and share the next steps.",
    )}
    <p style="margin:0 0 8px;font-size:14.5px;line-height:1.65;color:#0a0a0a;">What to expect:</p>
    <ul style="margin:0 0 18px;padding:0 0 0 20px;">
      ${bullet("We&rsquo;ll confirm your consultation time")}
      ${bullet("You&rsquo;ll complete a short questionnaire")}
      ${bullet("We meet via video call (up to 60 minutes)")}
      ${bullet("You receive clear recommendations and a follow-up summary")}
    </ul>
    <div style="margin:0 0 18px;padding:14px 16px;background:${BRAND.cchRedSoft};border-left:3px solid ${BRAND.cchRed};border-radius:6px;font-size:13px;line-height:1.6;color:${BRAND.textSecondary};">
      This consultation is advisory only. Vehicle sourcing, inspections, and export services are quoted separately based on your requirements.
    </div>
    ${paragraph(
      "If you have any questions in the meantime, reply to this email or message our team on WhatsApp.",
    )}
    ${whatsappButton("Message us on WhatsApp")}
    ${paragraph("Thank you for choosing CCH Automobile.")}
    <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#0a0a0a;">
      Best regards,<br/>
      <span style="font-weight:600;">CCH Automobile</span>
    </p>
  `;

  return wrapEmailHtml({
    preheader:
      "We received your consultation request. Our Guangzhou team will be in touch shortly.",
    eyebrow: "Consultation requested",
    headline: "Thank you for your booking.",
    bodyHtml,
  });
}
