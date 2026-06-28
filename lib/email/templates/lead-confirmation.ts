import type { LeadSummary } from "@/lib/notifications/whatsapp";
import {
  BRAND,
  aboutCarCallout,
  wrapEmailHtml,
} from "@/lib/email/templates/shell";

export function renderLeadConfirmationSubject(lead: LeadSummary): string {
  if (lead.aboutCar) {
    return `We got your request for the ${lead.aboutCar.label} — ${BRAND.name}`;
  }
  return `We got your request — ${BRAND.name}`;
}

export function renderLeadConfirmationText(lead: LeadSummary): string {
  const lines: string[] = [
    "Hello,",
    "",
    "Thank you for your vehicle request to CCH Automobile.",
    "",
    "We've successfully received your request and our team is now",
    "reviewing your requirements.",
    "",
    "Over the next 24–48 business hours, we will:",
    "  • Match your requirements with available vehicles",
    "  • Review the best options based on your budget and preferences",
    "  • Prepare detailed vehicle specifications",
    "  • Estimate shipping and export costs to your destination",
    "  • Send you the most suitable options for your review",
    "",
    "Once everything is ready, a member of our team will contact you",
    "directly with the recommended vehicles and the next steps.",
    "",
    "Our goal is to help you buy the right vehicle from China with",
    "confidence through transparent pricing, professional inspections,",
    "and reliable export support.",
    "",
    `If you'd like to add more information or update your requirements,`,
    `simply contact us on WhatsApp at ${BRAND.phone}.`,
    "",
    "Thank you for choosing CCH Automobile.",
    "",
    "We look forward to helping you find the right vehicle.",
    "",
    "Best regards,",
    "The CCH Automobile Team",
    "",
    "—",
    BRAND.address,
  ];
  // Keep a short reference to the car the customer asked about so the
  // email still makes sense if the inquiry was tied to a specific vehicle.
  if (lead.aboutCar) {
    lines.splice(
      4,
      0,
      "",
      `Your request: ${lead.aboutCar.label}`,
      `              ${lead.aboutCar.condition === "new" ? "New" : "Used"}${
        lead.aboutCar.bodyType ? ` · ${lead.aboutCar.bodyType}` : ""
      } · FOB $${lead.aboutCar.priceUsdFob.toLocaleString()}`,
    );
  }
  return lines.join("\n");
}

export function renderLeadConfirmationHtml(lead: LeadSummary): string {
  const aboutCarHtml = lead.aboutCar
    ? aboutCarCallout({
        eyebrow: "Your request",
        label: lead.aboutCar.label,
        condition: lead.aboutCar.condition,
        bodyType: lead.aboutCar.bodyType,
        priceUsdFob: lead.aboutCar.priceUsdFob,
      })
    : "";

  const preheader = lead.aboutCar
    ? `We received your request for the ${lead.aboutCar.label}. Our sales team will be in touch in 24–48 hours.`
    : "We received your request. Our sales team will be in touch in 24–48 hours.";

  const whatsappHref = `https://wa.me/${BRAND.phone.replace(/[^\d]/g, "")}`;

  const paragraph = (text: string) =>
    `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#0a0a0a;">${text}</p>`;

  const bullet = (text: string) =>
    `<li style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#0a0a0a;">${text}</li>`;

  // Bulletproof (table-based) CTA button so it renders in Outlook too.
  const whatsappButton = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:4px 0 18px;">
      <tr>
        <td align="center" bgcolor="${BRAND.cchRed}" style="border-radius:8px;">
          <a href="${whatsappHref}" target="_blank" style="display:inline-block;padding:12px 26px;font-size:14.5px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
            Message us on WhatsApp
          </a>
        </td>
      </tr>
    </table>`;

  const bodyHtml = `
    ${aboutCarHtml}
    ${paragraph(
      "We&rsquo;ve successfully received your request and our team is now reviewing your requirements.",
    )}
    <p style="margin:0 0 8px;font-size:14.5px;line-height:1.65;color:#0a0a0a;">Over the next <strong>24&ndash;48 business hours</strong>, we will:</p>
    <ul style="margin:0 0 18px;padding:0 0 0 20px;">
      ${bullet("Match your requirements with available vehicles")}
      ${bullet("Review the best options based on your budget and preferences")}
      ${bullet("Prepare detailed vehicle specifications")}
      ${bullet("Estimate shipping and export costs to your destination")}
      ${bullet("Send you the most suitable options for your review")}
    </ul>
    ${paragraph(
      "Once everything is ready, a member of our team will contact you directly with the recommended vehicles and the next steps.",
    )}
    ${paragraph(
      "Our goal is to help you buy the right vehicle from China with confidence through transparent pricing, professional inspections, and reliable export support.",
    )}
    ${paragraph(
      "If you&rsquo;d like to add more information or update your requirements, message us on WhatsApp and our team will assist you.",
    )}
    ${whatsappButton}
    ${paragraph("Thank you for choosing CCH Automobile.")}
    ${paragraph("We look forward to helping you find the right vehicle.")}
    <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#0a0a0a;">
      Best regards,<br/>
      <span style="font-weight:600;">The CCH Automobile Team</span>
    </p>
  `;

  return wrapEmailHtml({
    preheader,
    eyebrow: "Request received",
    headline: "Thank you for your vehicle request.",
    bodyHtml,
  });
}

