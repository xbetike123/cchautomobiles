import "server-only";

import { env } from "@/lib/env";

export type ConsultationLead = {
  name: string;
  whatsapp: string;
  email: string;
  country: string;
  buyerType: string | null;
  topics: string[];
  preferredTime: string | null;
  notes: string | null;
};

export type DiscordSendResult =
  | { sent: true; mocked: boolean }
  | { sent: false; error: string };

/**
 * Posts a new consultation booking to the admin Discord channel via webhook.
 * Best-effort: failure here never blocks the user-facing submission. When the
 * webhook URL is unset we log a mock payload so local dev still works.
 */
export async function sendConsultationToDiscord(
  lead: ConsultationLead,
): Promise<DiscordSendResult> {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;

  const fields = [
    { name: "Name", value: lead.name, inline: true },
    { name: "Country", value: lead.country, inline: true },
    { name: "WhatsApp", value: lead.whatsapp, inline: true },
    { name: "Email", value: lead.email, inline: false },
    ...(lead.buyerType
      ? [{ name: "Buyer type", value: lead.buyerType, inline: true }]
      : []),
    ...(lead.topics.length
      ? [{ name: "Topics", value: lead.topics.join(", "), inline: false }]
      : []),
    ...(lead.preferredTime
      ? [{ name: "Preferred time", value: lead.preferredTime, inline: false }]
      : []),
    ...(lead.notes
      ? [{ name: "Notes", value: lead.notes.slice(0, 1000), inline: false }]
      : []),
  ];

  const payload = {
    username: "CCH Consultations",
    embeds: [
      {
        title: "New consultation booking",
        color: 0xe63946, // cch-red
        fields,
      },
    ],
  };

  if (!webhookUrl) {
    console.warn(
      "[discord] Skipping send — DISCORD_WEBHOOK_URL not set. Mock payload below.",
    );
    console.info("[discord:mock]", JSON.stringify(payload));
    return { sent: true, mocked: true };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        sent: false,
        error: `HTTP ${res.status} ${errText.slice(0, 200)}`,
      };
    }
    return { sent: true, mocked: false };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
