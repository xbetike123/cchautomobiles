// Admin-end domain types. These mirror the planned Supabase schema from
// cchu_admin_architecture.md so the mock-to-Supabase swap is mechanical.
// When the database lands, these types should converge with the generated
// Supabase types in lib/supabase/types.ts.

export type AdminRole = "admin" | "sales" | "operations" | "read_only";

export type AdminProfile = {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  active: boolean;
  lastLoginAt: string | null;
};

// Inventory --------------------------------------------------------------

export type InventoryCondition = "new" | "used";

export type InventoryStatus =
  | "coming_soon"
  | "on_the_lot"
  | "reserved"
  | "in_shipping"
  | "delivered"
  | "sold"
  | "archived";

export type Inventory = {
  id: string;
  carCode: string;            // CCH-####
  slug: string;
  brand: string;
  model: string;
  year: number;
  condition: InventoryCondition;
  bodyType: string | null;
  priceUsdFob: number;
  mileageKm: number | null;
  batteryHealthPct: number | null;
  rangeKm: number | null;
  ownerCount: number | null;
  heroImageUrl: string | null;
  galleryImageUrls: string[];
  walkaroundVideoUrl: string | null;
  status: InventoryStatus;
  weekAdded: string | null;   // ISO date
  soldDate: string | null;
  factoryWarrantyMonths: number | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

// Leads ------------------------------------------------------------------

export type LeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "negotiating"
  | "reserved"
  | "closed_won"
  | "closed_lost";

export type LeadTrack = "in_stock" | "source_to_order" | "unclassified";

export type WaitResponse =
  | "pending"
  | "can_wait"
  | "cannot_wait"
  | "no_response";

export type ClosedLostReason =
  | "price"
  | "timing"
  | "found_elsewhere"
  | "no_response"
  | "unable_to_source"
  | "other";

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  whatsapp: string;
  email: string;
  carCode: string | null;
  preferredBrand: string | null;
  preferredModel: string | null;
  screenshotUrls: string[];
  budgetMinUsd: number | null;
  budgetMaxUsd: number | null;
  timeline: string | null;
  conditionPreference: InventoryCondition | "either" | null;
  bodyTypePreferences: string[];
  destinationCity: string | null;
  destinationCountry: string | null;
  notes: string | null;
  status: LeadStatus;
  track: LeadTrack;
  sourceDeadline: string | null;
  waitResponse: WaitResponse;
  waitResponseAt: string | null;
  autoReplySentAt: string | null;
  assignedTo: string | null;
  closedLostReason: ClosedLostReason | null;
  closedWonInventoryId: string | null;
};

// Quotes -----------------------------------------------------------------

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"
  | "superseded";

export type QuoteSentVia = "email" | "download" | "whatsapp";

export type Quote = {
  id: string;
  leadId: string;
  inventoryId: string | null;
  carCode: string;
  carName: string;
  carYear: number;
  carCondition: InventoryCondition;
  photoUrls: string[];
  basePriceUsd: number;
  shippingUsd: number | null;
  purchaseTaxUsd: number;
  clearingUsd: number | null;
  serviceFeeUsd: number;
  totalUsd: number;
  // NGN-per-USD rate locked on this quote. Optional so quotes created
  // before the field shipped don't break; new quotes should always set it.
  exchangeRateNgn: number | null;
  personalNote: string | null;
  pdfUrl: string | null;
  sentVia: QuoteSentVia;
  sentAt: string;
  sentBy: string;
  validUntil: string;
  status: QuoteStatus;
};

// Invoices ---------------------------------------------------------------

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "refunded"
  | "void";

// "deposit" / "balance" are paired (linked via parentInvoiceId).
// "single" covers one-shot charges (retainers, shipping uplifts, refunds, etc.).
export type InvoiceKind = "deposit" | "balance" | "single";

export type Invoice = {
  id: string;
  invoiceNumber: string; // INV-####
  kind: InvoiceKind;
  parentInvoiceId: string | null; // Set on "balance" invoices, points back to the matching deposit.
  leadId: string | null;
  inventoryId: string | null;
  carCode: string | null;
  carDescription: string | null;
  clientName: string;
  clientEmail: string | null;
  amountUsd: number; // The amount due ON THIS invoice (not the total car price).
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string | null;
  paidAt: string | null;
  paymentMethod: string | null;
  exchangeRateNgn: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

// Settings ---------------------------------------------------------------

export type CurrencyRate = {
  code: string; // ISO-4217 like NGN, GHS, XOF, CNY
  label: string;
  symbol: string;
  ratePerUsd: number;
  updatedAt: string;
  source: "manual" | "auto";
};

export type AdminSettings = {
  companyName: string;
  legalName: string;
  guangzhouAddress: string;
  lagosAddress: string | null;
  timezone: string;
  baseCurrency: string; // "USD"
  shippingUsd: number;
  clearingUsd: number;
  exportLicenseUsd: number;
  cchServiceFeeUsd: number;
  whatsappOperationsNumber: string | null;
  operationsEmail: string | null;
  sourceToOrderSlaHours: number; // e.g. 48
  waitResponseTimeoutHours: number; // e.g. 24
  currencies: CurrencyRate[];
  ratesUpdatedAt: string;
};

// Dashboard --------------------------------------------------------------

export type DashboardKpis = {
  newLeadsThisWeek: number;
  carsOnTheLot: number;
  quotesSentThisWeek: number;
  reservedThisMonth: number;
};
