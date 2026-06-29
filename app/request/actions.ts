"use server";

import "server-only";

import { headers } from "next/headers";
import {
  BUDGET_RANGES,
  CONDITIONS,
  TIMELINES,
  VEHICLE_TYPES,
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/app/request/schema";
import { sendLeadToDiscord } from "@/lib/notifications/discord";
import { sendLeadConfirmationEmail } from "@/lib/notifications/lead-confirmation";
import type { LeadSummary } from "@/lib/notifications/whatsapp";
import { getCarBySlug } from "@/lib/queries/inventory";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export type QuoteRequestResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export async function submitQuoteRequest(
  input: QuoteRequestInput,
): Promise<QuoteRequestResult> {
  // Last line of defense: a thrown server action surfaces as a raw 500 to the
  // user. Anything unexpected (misconfigured env, a notifier blowing up, etc.)
  // is logged and returned as a friendly error so the form never hard-crashes.
  try {
    return await runSubmitQuoteRequest(input);
  } catch (error) {
    console.error("[request] unexpected error", error);
    return {
      ok: false,
      error:
        "Something went wrong on our end. Please try again in a moment, or reach us on WhatsApp.",
    };
  }
}

async function runSubmitQuoteRequest(
  input: QuoteRequestInput,
): Promise<QuoteRequestResult> {
  const parsed = quoteRequestSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Resolve dropdown values into DB columns + display labels for notifications.
  const budgetRange = data.budgetRange
    ? BUDGET_RANGES.find((b) => b.value === data.budgetRange)
    : undefined;
  const labelFor = (
    opts: readonly { value: string; label: string }[],
    value: string | undefined,
  ) => (value ? (opts.find((o) => o.value === value)?.label ?? null) : null);
  const vehicleTypeLabel =
    data.vehicleType && data.vehicleType !== "not_sure"
      ? labelFor(VEHICLE_TYPES, data.vehicleType)
      : null;
  // Condition has a non-empty default ("either"), but the question is only
  // asked when the lead isn't about a specific car — suppress it otherwise.
  const conditionLabel = data.aboutCarSlug
    ? null
    : labelFor(CONDITIONS, data.conditionPreference);
  const budgetLabel =
    data.budgetRange && data.budgetRange !== "not_sure"
      ? labelFor(BUDGET_RANGES, data.budgetRange)
      : null;
  const timelineLabel = labelFor(TIMELINES, data.timeline);

  const reqHeaders = await headers();
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    reqHeaders.get("x-real-ip") ||
    null;

  // 1. Rate limit at 5 per IP per hour. Bot protection beyond this point
  // is currently rate-limit only; a Turnstile / CAPTCHA layer was removed.
  const rate = await checkRateLimit({
    scope: "quote_request",
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

  // 2. Insert the row before notifications fire so leads are never lost.
  const supabase = createSupabaseServiceClient();
  const whatsapp = `${data.whatsappDialCode} ${data.whatsappLocalNumber}`.trim();
  const { data: inserted, error: insertError } = await supabase
    .from("quote_requests")
    .insert({
      use_cases: [],
      budget_min_usd: budgetRange ? budgetRange.min : null,
      budget_max_usd: budgetRange && budgetRange.max > 0 ? budgetRange.max : null,
      timeline: data.timeline ?? null,
      condition_preference: data.conditionPreference,
      body_type_preferences:
        data.vehicleType && data.vehicleType !== "not_sure"
          ? [data.vehicleType]
          : [],
      name: data.name,
      whatsapp,
      email: data.email,
      destination_city: data.destinationCity ?? null,
      destination_country: data.destinationCountry,
      preferred_brand: data.preferredBrand ?? null,
      notes: data.notes ?? null,
      cch_car_code: data.aboutCarSlug ?? null,
      ip_address: ip,
      turnstile_verified: false,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[request] insert failed", insertError);
    return {
      ok: false,
      error: "We couldn't save your request. Try again in a moment.",
    };
  }

  // Resolve the car the request is about (if any) so we can surface it in
  // both notifications. Lookup failures are non-fatal — the lead is saved
  // regardless and the slug is still in the DB row via cch_car_code.
  const aboutCar = data.aboutCarSlug
    ? await getCarBySlug(data.aboutCarSlug).then((c) =>
        c
          ? {
              slug: c.slug,
              label: `${c.year} ${c.brand} ${c.model}`,
              condition: c.condition === "new" ? ("new" as const) : ("used" as const),
              bodyType: c.body_type,
              priceUsdFob: c.price_usd_fob,
            }
          : null,
      )
    : null;

  // 3 + 4. Discord-first flow:
  //   - A Discord webhook post to the CCH ops channel is the canonical lead
  //     notification.
  //   - The customer also gets an auto-reply email so they have a paper trail.
  // Both run in parallel and are best-effort. Failures are recorded in
  // notification_status so they can be retried from /admin without losing
  // the lead.
  const summary: LeadSummary = {
    name: data.name,
    whatsapp,
    email: data.email,
    destinationCity: data.destinationCity ?? null,
    destinationCountry: data.destinationCountry,
    vehicleType: vehicleTypeLabel,
    condition: conditionLabel,
    budget: budgetLabel,
    timeline: timelineLabel,
    preferredBrand: data.preferredBrand ?? null,
    notes: data.notes ?? null,
    aboutCar,
  };

  const [discordResult, confirmationResult] = await Promise.all([
    sendLeadToDiscord(summary),
    sendLeadConfirmationEmail(summary),
  ]);

  if (!discordResult.sent) {
    console.error("[request] discord notify failed", discordResult.error);
  }
  if (!confirmationResult.sent) {
    console.error(
      "[request] lead confirmation email failed",
      confirmationResult.error,
    );
  }

  const notificationStatus = {
    discord_sent: discordResult.sent,
    customer_email_sent: confirmationResult.sent,
    retry_count: 0,
    last_error: discordResult.sent ? null : (discordResult.error ?? null),
  };

  await supabase
    .from("quote_requests")
    .update({ notification_status: notificationStatus })
    .eq("id", inserted.id);

  return { ok: true };
}
