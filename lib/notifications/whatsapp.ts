import "server-only";

import { env } from "@/lib/env";

export type LeadSummary = {
  name: string;
  whatsapp: string;
  email: string;
  destinationCity: string | null;
  destinationCountry: string | null;
  // Structured intent answers, pre-formatted as display labels (null when the
  // lead left a dropdown on its "unsure" default / unselected).
  vehicleType: string | null;
  condition: string | null;
  budget: string | null;
  timeline: string | null;
  preferredBrand: string | null;
  notes: string | null;
  aboutCar: {
    slug: string;
    label: string;
    condition: "new" | "used";
    bodyType: string | null;
    priceUsdFob: number;
  } | null;
};

export type WhatsappSendResult =
  | { sent: true; mocked: boolean; messageId?: string }
  | { sent: false; error: string };

export async function sendLeadToWhatsapp(
  lead: LeadSummary,
): Promise<WhatsappSendResult> {
  const token = env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  const operationsNumber = env.WHATSAPP_OPERATIONS_NUMBER;
  const body = renderLeadMessage(lead);

  if (!token || !phoneNumberId || !operationsNumber) {
    console.warn(
      "[whatsapp] Skipping send — WHATSAPP_CLOUD_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, or WHATSAPP_OPERATIONS_NUMBER not set. Mock payload below.",
    );
    console.info("[whatsapp:mock]", { to: operationsNumber, body });
    return { sent: true, mocked: true };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: operationsNumber,
          type: "text",
          text: { body },
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { sent: false, error: `HTTP ${res.status} ${errText.slice(0, 200)}` };
    }
    const data = (await res.json()) as { messages?: { id: string }[] };
    return { sent: true, mocked: false, messageId: data.messages?.[0]?.id };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

function renderLeadMessage(lead: LeadSummary): string {
  // WhatsApp-first form only collects: name, WhatsApp, email, destination
  // city, and a free-text intent ("what they're looking for", stored in
  // `notes`). Everything else is asked in the WhatsApp conversation.
  const destination =
    [lead.destinationCity, lead.destinationCountry].filter(Boolean).join(", ") ||
    "Not specified";

  const lines: string[] = [
    "*New CCH lead*",
    "",
    ...(lead.aboutCar
      ? [
          `Asking about: ${lead.aboutCar.label}`,
          `  ${lead.aboutCar.condition === "new" ? "New" : "Used"}${
            lead.aboutCar.bodyType ? ` · ${lead.aboutCar.bodyType}` : ""
          } · FOB $${lead.aboutCar.priceUsdFob.toLocaleString()}`,
          `  Slug: ${lead.aboutCar.slug}`,
          "",
        ]
      : []),
    `Name: ${lead.name}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Email: ${lead.email}`,
    `Destination: ${destination}`,
  ];
  if (lead.preferredBrand) {
    lines.push(`Preferred brand: ${lead.preferredBrand}`);
  }
  if (lead.vehicleType) lines.push(`Vehicle type: ${lead.vehicleType}`);
  if (lead.condition) lines.push(`Condition: ${lead.condition}`);
  if (lead.budget) lines.push(`Budget: ${lead.budget}`);
  if (lead.timeline) lines.push(`Timeline: ${lead.timeline}`);
  if (lead.notes) {
    lines.push("", lead.aboutCar ? "Anything else:" : "Notes:", lead.notes);
  }
  return lines.join("\n");
}
