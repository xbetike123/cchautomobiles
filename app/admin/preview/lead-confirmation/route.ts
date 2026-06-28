import "server-only";

import { NextResponse } from "next/server";

import { renderLeadConfirmationHtml } from "@/lib/email/templates/lead-confirmation";
import type { LeadSummary } from "@/lib/notifications/whatsapp";

/**
 * Dev-only preview endpoint for the customer car-request confirmation email.
 * Open /admin/preview/lead-confirmation in a browser to see the live HTML
 * exactly as Resend will send it, then edit lib/email/templates/lead-confirmation.ts
 * (or the shared shell in lib/email/templates/shell.ts) and refresh.
 *
 *   /admin/preview/lead-confirmation         → generic request (no specific car)
 *   /admin/preview/lead-confirmation?car=1   → request tied to a specific vehicle
 *
 * Delete once the template is finalised.
 */

const SAMPLE_LEAD: LeadSummary = {
  name: "Adaeze Okafor",
  whatsapp: "+234 803 123 4567",
  email: "adaeze@example.com",
  destinationCity: "Lagos",
  destinationCountry: "Nigeria",
  vehicleType: "SUV",
  condition: "Either new or used",
  budget: "$20,000 – $30,000",
  timeline: "Within 1–3 months",
  preferredBrand: "BYD",
  notes: "Prefer a white exterior with a panoramic roof if possible.",
  aboutCar: null,
};

const SAMPLE_ABOUT_CAR: NonNullable<LeadSummary["aboutCar"]> = {
  slug: "2024-byd-song-plus-dmi",
  label: "2024 BYD Song Plus DM-i",
  condition: "new",
  bodyType: "SUV",
  priceUsdFob: 23500,
};

export async function GET(request: Request) {
  const withCar = new URL(request.url).searchParams.get("car") === "1";
  const lead: LeadSummary = withCar
    ? { ...SAMPLE_LEAD, aboutCar: SAMPLE_ABOUT_CAR }
    : SAMPLE_LEAD;

  const html = renderLeadConfirmationHtml(lead);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
