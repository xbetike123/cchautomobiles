import "server-only";

import { env } from "@/lib/env";
import type { LeadSummary } from "@/lib/notifications/whatsapp";

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
 * Posts a prepared webhook payload. Best-effort: callers treat a failure as
 * non-fatal. When the webhook URL is unset we log a mock payload so local dev
 * still works.
 */
async function postToDiscord(payload: unknown): Promise<DiscordSendResult> {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;

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

/**
 * Posts a new consultation booking to the admin Discord channel via webhook.
 * Best-effort: failure here never blocks the user-facing submission. When the
 * webhook URL is unset we log a mock payload so local dev still works.
 */
export async function sendConsultationToDiscord(
  lead: ConsultationLead,
): Promise<DiscordSendResult> {
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

  return postToDiscord(payload);
}

/**
 * Posts a new car request (quote request) to the admin Discord channel via
 * webhook. Best-effort: failure here never blocks the user-facing submission.
 * When the webhook URL is unset we log a mock payload so local dev still works.
 */
export async function sendLeadToDiscord(
  lead: LeadSummary,
): Promise<DiscordSendResult> {
  const destination = [lead.destinationCity, lead.destinationCountry]
    .filter(Boolean)
    .join(", ");

  const fields = [
    { name: "Name", value: lead.name, inline: true },
    ...(destination
      ? [{ name: "Destination", value: destination, inline: true }]
      : []),
    { name: "WhatsApp", value: lead.whatsapp, inline: true },
    { name: "Email", value: lead.email, inline: false },
    ...(lead.aboutCar
      ? [
          {
            name: "Asking about",
            value: `${lead.aboutCar.label} — ${
              lead.aboutCar.condition === "new" ? "New" : "Used"
            }${lead.aboutCar.bodyType ? ` · ${lead.aboutCar.bodyType}` : ""} · FOB $${lead.aboutCar.priceUsdFob.toLocaleString()}`,
            inline: false,
          },
        ]
      : []),
    ...(lead.vehicleType
      ? [{ name: "Vehicle type", value: lead.vehicleType, inline: true }]
      : []),
    ...(lead.condition
      ? [{ name: "Condition", value: lead.condition, inline: true }]
      : []),
    ...(lead.budget
      ? [{ name: "Budget", value: lead.budget, inline: true }]
      : []),
    ...(lead.timeline
      ? [{ name: "Timeline", value: lead.timeline, inline: true }]
      : []),
    ...(lead.preferredBrand
      ? [{ name: "Preferred brand", value: lead.preferredBrand, inline: true }]
      : []),
    ...(lead.notes
      ? [{ name: "Notes", value: lead.notes.slice(0, 1000), inline: false }]
      : []),
  ];

  const payload = {
    username: "CCH Requests",
    embeds: [
      {
        title: "New car request",
        color: 0xe63946, // cch-red
        fields,
      },
    ],
  };

  return postToDiscord(payload);
}

export type GuideDownloadLead = {
  firstName: string;
  email: string;
  guideTitle: string;
};

/**
 * Posts a guide download (lead magnet) to the admin Discord channel via
 * webhook. Best-effort: failure here never blocks the visitor's download.
 */
export async function sendGuideDownloadToDiscord(
  lead: GuideDownloadLead,
): Promise<DiscordSendResult> {
  const payload = {
    username: "CCH Guides",
    embeds: [
      {
        title: "New guide download",
        color: 0x0f172a, // corporate-black
        fields: [
          { name: "First name", value: lead.firstName, inline: true },
          { name: "Email", value: lead.email, inline: true },
          { name: "Guide", value: lead.guideTitle, inline: false },
        ],
      },
    ],
  };

  return postToDiscord(payload);
}
