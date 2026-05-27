import "server-only";

import type {
  ClosedLostReason,
  Invoice,
  InvoiceKind,
  InvoiceStatus,
  Inventory,
  InventoryCondition,
  InventoryStatus,
  Lead,
  LeadStatus,
  LeadTrack,
  Quote,
  QuoteSentVia,
  QuoteStatus,
  WaitResponse,
} from "@/lib/admin/types";
import type { Database } from "@/lib/supabase/types";

type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];
type LeadRow = Database["public"]["Tables"]["quote_requests"]["Row"];
type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];

const INVENTORY_STATUS_SET: ReadonlySet<InventoryStatus> = new Set([
  "coming_soon",
  "on_the_lot",
  "reserved",
  "in_shipping",
  "delivered",
  "sold",
  "archived",
]);

const LEAD_STATUS_SET: ReadonlySet<LeadStatus> = new Set([
  "new",
  "contacted",
  "quoted",
  "negotiating",
  "reserved",
  "closed_won",
  "closed_lost",
]);

const LEAD_TRACK_SET: ReadonlySet<LeadTrack> = new Set([
  "in_stock",
  "source_to_order",
  "unclassified",
]);

const WAIT_RESPONSE_SET: ReadonlySet<WaitResponse> = new Set([
  "pending",
  "can_wait",
  "cannot_wait",
  "no_response",
]);

const CLOSED_LOST_REASON_SET: ReadonlySet<ClosedLostReason> = new Set([
  "price",
  "timing",
  "found_elsewhere",
  "no_response",
  "unable_to_source",
  "other",
]);

const QUOTE_STATUS_SET: ReadonlySet<QuoteStatus> = new Set([
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "superseded",
]);

const QUOTE_SENT_VIA_SET: ReadonlySet<QuoteSentVia> = new Set([
  "email",
  "download",
  "whatsapp",
]);

const INVOICE_STATUS_SET: ReadonlySet<InvoiceStatus> = new Set([
  "draft",
  "sent",
  "paid",
  "overdue",
  "refunded",
  "void",
]);

const INVOICE_KIND_SET: ReadonlySet<InvoiceKind> = new Set([
  "deposit",
  "balance",
  "single",
]);

function asInvoiceKind(value: string | null | undefined): InvoiceKind {
  return value && INVOICE_KIND_SET.has(value as InvoiceKind)
    ? (value as InvoiceKind)
    : "single";
}

function asCondition(value: string): InventoryCondition {
  return value === "used" ? "used" : "new";
}

function asInventoryStatus(value: string): InventoryStatus {
  return INVENTORY_STATUS_SET.has(value as InventoryStatus)
    ? (value as InventoryStatus)
    : "on_the_lot";
}

function asLeadStatus(value: string): LeadStatus {
  return LEAD_STATUS_SET.has(value as LeadStatus)
    ? (value as LeadStatus)
    : "new";
}

function asLeadTrack(value: string): LeadTrack {
  return LEAD_TRACK_SET.has(value as LeadTrack)
    ? (value as LeadTrack)
    : "unclassified";
}

function asWaitResponse(value: string): WaitResponse {
  return WAIT_RESPONSE_SET.has(value as WaitResponse)
    ? (value as WaitResponse)
    : "pending";
}

function asClosedLostReason(value: string | null): ClosedLostReason | null {
  return value && CLOSED_LOST_REASON_SET.has(value as ClosedLostReason)
    ? (value as ClosedLostReason)
    : null;
}

function asQuoteStatus(value: string): QuoteStatus {
  return QUOTE_STATUS_SET.has(value as QuoteStatus)
    ? (value as QuoteStatus)
    : "draft";
}

function asQuoteSentVia(value: string): QuoteSentVia {
  return QUOTE_SENT_VIA_SET.has(value as QuoteSentVia)
    ? (value as QuoteSentVia)
    : "email";
}

function asInvoiceStatus(value: string): InvoiceStatus {
  return INVOICE_STATUS_SET.has(value as InvoiceStatus)
    ? (value as InvoiceStatus)
    : "draft";
}

function asConditionPreference(
  value: string | null,
): InventoryCondition | "either" | null {
  if (value === "new" || value === "used" || value === "either") return value;
  return null;
}

export function inventoryFromRow(row: InventoryRow): Inventory {
  return {
    id: row.id,
    carCode: row.car_code ?? "",
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    condition: asCondition(row.condition),
    bodyType: row.body_type,
    priceUsdFob: Number(row.price_usd_fob),
    mileageKm: row.mileage_km,
    batteryHealthPct: row.battery_health_pct,
    rangeKm: row.range_km,
    ownerCount: row.owner_count,
    heroImageUrl: row.hero_image_url,
    galleryImageUrls: row.gallery_image_urls ?? [],
    walkaroundVideoUrl: row.walkaround_video_url,
    status: asInventoryStatus(row.internal_status),
    weekAdded: row.week_added,
    soldDate: row.sold_date,
    factoryWarrantyMonths: row.factory_warranty_months,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function leadFromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    whatsapp: row.whatsapp,
    email: row.email,
    carCode: row.cch_car_code,
    preferredBrand: row.preferred_brand,
    preferredModel: row.preferred_model,
    screenshotUrls: row.screenshot_urls ?? [],
    budgetMinUsd: row.budget_min_usd === null ? null : Number(row.budget_min_usd),
    budgetMaxUsd: row.budget_max_usd === null ? null : Number(row.budget_max_usd),
    timeline: row.timeline,
    conditionPreference: asConditionPreference(row.condition_preference),
    bodyTypePreferences: row.body_type_preferences ?? [],
    destinationCity: row.destination_city,
    destinationCountry: row.destination_country,
    notes: row.notes,
    status: asLeadStatus(row.status),
    track: asLeadTrack(row.track),
    sourceDeadline: row.source_deadline,
    waitResponse: asWaitResponse(row.wait_response),
    waitResponseAt: row.wait_response_at,
    autoReplySentAt: row.auto_reply_sent_at,
    assignedTo: row.assigned_to,
    closedLostReason: asClosedLostReason(row.closed_lost_reason),
    closedWonInventoryId: row.closed_won_inventory_id,
  };
}

export function quoteFromRow(row: QuoteRow): Quote {
  return {
    id: row.id,
    leadId: row.lead_id ?? "",
    inventoryId: row.inventory_id,
    carCode: row.car_code ?? "",
    carName: row.car_name,
    carYear: row.car_year,
    carCondition: asCondition(row.car_condition),
    photoUrls: row.photo_urls ?? [],
    basePriceUsd: Number(row.base_price_usd),
    shippingUsd: Number(row.shipping_usd),
    clearingUsd: row.clearing_usd === null ? null : Number(row.clearing_usd),
    serviceFeeUsd: Number(row.service_fee_usd),
    totalUsd: Number(row.total_usd),
    personalNote: row.personal_note,
    pdfUrl: row.pdf_url,
    sentVia: asQuoteSentVia(row.sent_via),
    sentAt: row.sent_at,
    sentBy: row.sent_by ?? "",
    validUntil: row.valid_until,
    status: asQuoteStatus(row.status),
  };
}

export function invoiceFromRow(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    kind: asInvoiceKind(row.kind),
    parentInvoiceId: row.parent_invoice_id,
    leadId: row.lead_id,
    inventoryId: row.inventory_id,
    carCode: row.car_code,
    carDescription: row.car_description,
    clientName: row.client_name,
    clientEmail: row.client_email,
    amountUsd: Number(row.amount_usd),
    status: asInvoiceStatus(row.status),
    issuedAt: row.issued_at,
    dueAt: row.due_at,
    paidAt: row.paid_at,
    paymentMethod: row.payment_method,
    exchangeRateNgn:
      row.exchange_rate_ngn === null ? null : Number(row.exchange_rate_ngn),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
