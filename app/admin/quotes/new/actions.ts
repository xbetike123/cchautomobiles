"use server";

import "server-only";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminClient } from "@/lib/admin/supabase";
import { getLeadById } from "@/lib/admin/queries/leads";
import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import type {
  InventoryCondition,
  QuotePaymentOption,
  QuoteSentVia,
  QuoteStatus,
} from "@/lib/admin/types";
import { sendQuoteDeliveryEmail } from "@/lib/notifications/quote-delivery";

export type QuoteBuilderEmailPayload = {
  leadId?: string;
  clientName?: string;
  clientWhatsapp?: string;
  clientEmail?: string;
  destinationCity?: string | null;
  destinationCountry?: string | null;
  carCode?: string;
  carName?: string;
  carYear?: number;
  carCondition?: InventoryCondition;
  photoUrls?: string[];
  basePriceUsd?: number;
  shippingUsd?: number | null;
  purchaseTaxUsd?: number;
  clearingUsd?: number | null;
  serviceFeeUsd?: number;
  totalUsd?: number;
  exchangeRateNgn?: number | null;
  personalNote?: string | null;
  paymentOption?: QuotePaymentOption;
  accountInformation?: string | null;
  validUntil?: string;
};

export type SendBuilderQuoteResult =
  | { ok: true; mocked: boolean; toEmail: string }
  | { ok: false; error: string };

export type SaveQuoteDraftPayload = QuoteBuilderEmailPayload & {
  inventoryId?: string | null;
};

export type SaveQuoteDraftResult =
  | { ok: true; quoteId: string }
  | { ok: false; error: string };

const QUOTE_IMAGES_BUCKET = "quote-images";

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function decodeDataImage(value: string): {
  bytes: Buffer;
  contentType: "image/jpeg" | "image/png";
  extension: "jpg" | "png";
} | null {
  const match = /^data:image\/(png|jpe?g);base64,([a-z0-9+/=\s]+)$/i.exec(value);
  if (!match) return null;
  const isPng = match[1].toLowerCase() === "png";
  return {
    bytes: Buffer.from(match[2], "base64"),
    contentType: isPng ? "image/png" : "image/jpeg",
    extension: isPng ? "png" : "jpg",
  };
}

export async function saveQuoteDraft(
  payload: SaveQuoteDraftPayload,
): Promise<SaveQuoteDraftResult> {
  const admin = await getCurrentAdmin();
  const supabase = getAdminClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase is not configured, so this draft cannot be saved.",
    };
  }
  if (!payload.leadId || !payload.carName?.trim()) {
    return { ok: false, error: "Choose a lead and enter the vehicle details." };
  }

  let persistedLeadId = payload.leadId;
  if (payload.leadId.startsWith("lead-new-")) {
    if (!payload.clientName?.trim() || !payload.clientWhatsapp?.trim()) {
      return {
        ok: false,
        error: "Enter the new client's name and WhatsApp number.",
      };
    }
    const { data: createdLead, error: leadError } = await supabase
      .from("quote_requests")
      .insert({
        name: payload.clientName.trim(),
        whatsapp: payload.clientWhatsapp.trim(),
        email: payload.clientEmail?.trim() ?? "",
        destination_city: payload.destinationCity?.trim() || null,
        destination_country: payload.destinationCountry?.trim() || null,
        cch_car_code: payload.carCode?.trim() || null,
        turnstile_verified: true,
      })
      .select("id")
      .single();
    if (leadError || !createdLead) {
      console.error(
        "[admin/quotes] inline lead save failed:",
        leadError?.message,
      );
      return {
        ok: false,
        error: "The new client could not be saved. Please try again.",
      };
    }
    persistedLeadId = createdLead.id;
  }

  const quoteId = randomUUID();
  const uploadedPaths: string[] = [];
  const photoUrls: string[] = [];

  for (const [index, value] of (payload.photoUrls ?? []).entries()) {
    const image = decodeDataImage(value);
    if (!image) {
      // Keep existing inventory and already-uploaded public URLs.
      if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
        photoUrls.push(value);
      }
      continue;
    }
    if (image.bytes.byteLength > 5 * 1024 * 1024) {
      return { ok: false, error: `Image ${index + 1} is larger than 5 MB.` };
    }

    const path = `${quoteId}/${index}-${randomUUID()}.${image.extension}`;
    const { error } = await supabase.storage
      .from(QUOTE_IMAGES_BUCKET)
      .upload(path, image.bytes, {
        contentType: image.contentType,
        upsert: false,
      });
    if (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(QUOTE_IMAGES_BUCKET).remove(uploadedPaths);
      }
      console.error("[admin/quotes] draft image upload failed:", error.message);
      return {
        ok: false,
        error: "A quote image could not be uploaded. Please try again.",
      };
    }
    uploadedPaths.push(path);
    photoUrls.push(
      supabase.storage.from(QUOTE_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl,
    );
  }

  const { error } = await supabase.from("quotes").insert({
    id: quoteId,
    lead_id: persistedLeadId,
    inventory_id: payload.inventoryId || null,
    car_code: payload.carCode || null,
    car_name: payload.carName.trim(),
    car_year: num(payload.carYear) || new Date().getUTCFullYear(),
    car_condition: payload.carCondition ?? "new",
    photo_urls: photoUrls,
    base_price_usd: num(payload.basePriceUsd),
    shipping_usd:
      payload.shippingUsd == null ? null : num(payload.shippingUsd),
    purchase_tax_usd: num(payload.purchaseTaxUsd),
    clearing_usd:
      payload.clearingUsd == null ? null : num(payload.clearingUsd),
    service_fee_usd: num(payload.serviceFeeUsd),
    total_usd: num(payload.totalUsd),
    exchange_rate_ngn:
      payload.exchangeRateNgn == null ? null : num(payload.exchangeRateNgn),
    personal_note: payload.personalNote || null,
    payment_option: payload.paymentOption ?? "full_payment",
    account_information: payload.accountInformation?.trim() || null,
    sent_via: "download",
    sent_by: admin.email,
    valid_until: payload.validUntil || new Date().toISOString().slice(0, 10),
    status: "draft",
  });

  if (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(QUOTE_IMAGES_BUCKET).remove(uploadedPaths);
    }
    console.error("[admin/quotes] save draft failed:", error.message);
    return { ok: false, error: "The draft could not be saved. Please try again." };
  }

  revalidatePath("/admin/quotes");
  return { ok: true, quoteId };
}

/**
 * Email the quote PDF straight from the builder, without persisting a quote
 * row. Mirrors the ephemeral preview render: builds a transient
 * QuoteWithClient from form state, renders the PDF, and ships it via Resend.
 */
export async function sendQuoteFromBuilder(
  payload: QuoteBuilderEmailPayload,
): Promise<SendBuilderQuoteResult> {
  await getCurrentAdmin();

  if (!payload.leadId) {
    return { ok: false, error: "Pick a lead before sending." };
  }

  const lead = await getLeadById(payload.leadId);
  const toEmail = lead?.email?.trim();
  if (!toEmail) {
    return {
      ok: false,
      error:
        "No email on file for this customer. Add an email to the lead before sending.",
    };
  }

  const quote: QuoteWithClient = {
    id: randomUUID(),
    leadId: payload.leadId,
    inventoryId: null,
    carCode: payload.carCode || "—",
    carName: payload.carName || "Untitled vehicle",
    carYear: num(payload.carYear) || new Date().getUTCFullYear(),
    carCondition: payload.carCondition ?? "new",
    photoUrls: payload.photoUrls ?? [],
    basePriceUsd: num(payload.basePriceUsd),
    shippingUsd:
      payload.shippingUsd == null ? null : num(payload.shippingUsd),
    purchaseTaxUsd: num(payload.purchaseTaxUsd),
    clearingUsd:
      payload.clearingUsd == null ? null : num(payload.clearingUsd),
    serviceFeeUsd: num(payload.serviceFeeUsd),
    totalUsd: num(payload.totalUsd),
    exchangeRateNgn:
      payload.exchangeRateNgn == null ? null : num(payload.exchangeRateNgn),
    personalNote: payload.personalNote || null,
    paymentOption: payload.paymentOption ?? "full_payment",
    accountInformation: payload.accountInformation?.trim() || null,
    pdfUrl: null,
    sentVia: "email" satisfies QuoteSentVia,
    sentAt: new Date().toISOString(),
    sentBy: "builder",
    validUntil: payload.validUntil || new Date().toISOString(),
    status: "sent" satisfies QuoteStatus,
    clientName: payload.clientName || lead?.name || "Customer",
    clientWhatsapp: payload.clientWhatsapp ?? lead?.whatsapp ?? "",
    destinationCity:
      payload.destinationCity ?? lead?.destinationCity ?? null,
  };

  const result = await sendQuoteDeliveryEmail(quote, toEmail);
  if (!result.sent) {
    return { ok: false, error: result.error };
  }
  return { ok: true, mocked: result.mocked, toEmail };
}
