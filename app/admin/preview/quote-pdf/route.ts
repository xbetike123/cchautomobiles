import "server-only";

import { NextResponse } from "next/server";

import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import type { InventoryCondition, QuoteStatus } from "@/lib/admin/types";
import { MOCK_QUOTES } from "@/lib/admin/mocks/quotes";
import { MOCK_LEADS } from "@/lib/admin/mocks/leads";
import { renderQuotePdf } from "@/lib/pdf/render";

/**
 * Dev-only preview endpoint for the quote PDF.
 *
 * - GET renders the first mock quote, so you can see the live PDF layout
 *   even when the connected Supabase has no quotes yet.
 * - POST renders whatever the quote builder currently has in its form,
 *   so the "Generate PDF" buttons on /admin/quotes/new open a real preview.
 *
 * Delete once real quote rows exist and the builder posts to a persisted
 * server action instead.
 */

function pdfResponse(pdf: Buffer, filename: string): NextResponse {
  const body = new Uint8Array(pdf);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
      "Content-Length": String(body.byteLength),
    },
  });
}

export async function GET() {
  const base = MOCK_QUOTES.find((q) => q.personalNote) ?? MOCK_QUOTES[0];
  if (!base) {
    return NextResponse.json({ error: "No mock quote available" }, { status: 404 });
  }
  const lead = MOCK_LEADS.find((l) => l.id === base.leadId);
  const quote: QuoteWithClient = {
    ...base,
    clientName: lead?.name ?? "Sample Client",
    clientWhatsapp: lead?.whatsapp ?? "",
    destinationCity: lead?.destinationCity ?? null,
  };

  try {
    const pdf = await renderQuotePdf(quote);
    return pdfResponse(pdf, `CCH-${quote.id}-preview.pdf`);
  } catch (error) {
    console.error("[admin/preview/quote-pdf] GET render failed:", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }
}

type QuoteBuilderPayload = {
  leadId?: string;
  clientName?: string;
  clientWhatsapp?: string;
  destinationCity?: string | null;
  carCode?: string;
  carName?: string;
  carYear?: number;
  carCondition?: InventoryCondition;
  photoUrls?: string[];
  basePriceUsd?: number;
  shippingUsd?: number;
  clearingUsd?: number | null;
  serviceFeeUsd?: number;
  totalUsd?: number;
  exchangeRateNgn?: number | null;
  personalNote?: string | null;
  validUntil?: string;
};

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function POST(request: Request) {
  let payload: QuoteBuilderPayload;
  try {
    payload = (await request.json()) as QuoteBuilderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Build a QuoteWithClient from the builder's live form state. This quote
  // is never persisted — it exists only to render the preview PDF.
  const quote: QuoteWithClient = {
    id: "qte-preview",
    leadId: payload.leadId ?? "preview",
    inventoryId: null,
    carCode: payload.carCode || "—",
    carName: payload.carName || "Untitled vehicle",
    carYear: num(payload.carYear) || new Date().getUTCFullYear(),
    carCondition: payload.carCondition ?? "new",
    photoUrls: payload.photoUrls ?? [],
    basePriceUsd: num(payload.basePriceUsd),
    shippingUsd: num(payload.shippingUsd),
    clearingUsd:
      payload.clearingUsd == null ? null : num(payload.clearingUsd),
    serviceFeeUsd: num(payload.serviceFeeUsd),
    totalUsd: num(payload.totalUsd),
    exchangeRateNgn:
      payload.exchangeRateNgn == null ? null : num(payload.exchangeRateNgn),
    personalNote: payload.personalNote || null,
    pdfUrl: null,
    sentVia: "email",
    sentAt: new Date().toISOString(),
    sentBy: "preview",
    validUntil: payload.validUntil || new Date().toISOString(),
    status: "draft" as QuoteStatus,
    clientName: payload.clientName || "Sample Client",
    clientWhatsapp: payload.clientWhatsapp ?? "",
    destinationCity: payload.destinationCity ?? null,
  };

  try {
    const pdf = await renderQuotePdf(quote);
    return pdfResponse(pdf, "CCH-quote-preview.pdf");
  } catch (error) {
    console.error("[admin/preview/quote-pdf] POST render failed:", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }
}
