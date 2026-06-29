"use server";

import "server-only";

import { headers } from "next/headers";
import {
  BUYER_TYPES,
  CONSULTATION_TOPICS,
  consultationRequestSchema,
  type ConsultationRequestInput,
} from "@/app/consultation/schema";
import { sendConsultationConfirmationEmail } from "@/lib/notifications/consultation-confirmation";
import { sendConsultationToDiscord } from "@/lib/notifications/discord";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export type ConsultationRequestResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

const labelFor = (
  opts: readonly { value: string; label: string }[],
  value: string | undefined,
) => (value ? (opts.find((o) => o.value === value)?.label ?? null) : null);

export async function submitConsultationRequest(
  input: ConsultationRequestInput,
): Promise<ConsultationRequestResult> {
  const parsed = consultationRequestSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;
  const reqHeaders = await headers();
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    reqHeaders.get("x-real-ip") ||
    null;

  // Rate limit at 5 per IP per hour, matching the quote request flow.
  const rate = await checkRateLimit({
    scope: "consultation_request",
    identifier: ip ?? "anon",
    limit: 5,
    windowSeconds: 60 * 60,
  });
  if (!rate.allowed) {
    return {
      ok: false,
      error:
        "You've hit the submission limit for this hour. Reach us on WhatsApp instead.",
    };
  }

  const whatsapp = `${data.whatsappDialCode} ${data.whatsappLocalNumber}`.trim();
  const buyerTypeLabel = labelFor(BUYER_TYPES, data.buyerType);
  const topicLabels = data.topics
    .map((t) => labelFor(CONSULTATION_TOPICS, t))
    .filter((v): v is string => Boolean(v));

  // Insert the row before notifications fire so bookings are never lost.
  const supabase = createSupabaseServiceClient();
  const { data: inserted, error: insertError } = await supabase
    .from("consultation_requests")
    .insert({
      name: data.name,
      whatsapp,
      email: data.email,
      country: data.country,
      buyer_type: data.buyerType ?? null,
      topics: data.topics,
      preferred_time: null,
      notes: null,
      ip_address: ip,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[consultation] insert failed", insertError);
    return {
      ok: false,
      error: "We couldn't save your request. Try again in a moment.",
    };
  }

  // Notifications run in parallel and are best-effort. Failures are recorded in
  // notification_status so they can be retried from /admin without losing the
  // booking.
  const [emailResult, discordResult] = await Promise.all([
    sendConsultationConfirmationEmail({ name: data.name, email: data.email }),
    sendConsultationToDiscord({
      name: data.name,
      whatsapp,
      email: data.email,
      country: data.country,
      buyerType: buyerTypeLabel,
      topics: topicLabels,
      preferredTime: null,
      notes: null,
    }),
  ]);

  if (!emailResult.sent) {
    console.error("[consultation] confirmation email failed", emailResult.error);
  }
  if (!discordResult.sent) {
    console.error("[consultation] discord notify failed", discordResult.error);
  }

  await supabase
    .from("consultation_requests")
    .update({
      notification_status: {
        customer_email_sent: emailResult.sent,
        discord_sent: discordResult.sent,
        retry_count: 0,
        last_error: !discordResult.sent
          ? discordResult.error
          : !emailResult.sent
            ? emailResult.error
            : null,
      },
    })
    .eq("id", inserted.id);

  return { ok: true };
}
