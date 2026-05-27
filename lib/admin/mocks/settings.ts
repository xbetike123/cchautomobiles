import type { AdminSettings } from "@/lib/admin/types";

// Mock CCH operations settings. Backed by Supabase `settings` row in the
// production schema; the same shape lives there. The currencies array
// becomes the `settings.currencies` jsonb column.

export const MOCK_SETTINGS: AdminSettings = {
  companyName: "CCH Automobile",
  legalName: "CCH Automobile Co. Ltd",
  guangzhouAddress:
    "101-103 Agile Time Mansion, Wehai Road, Shibi, Panyu District, Guangzhou, China",
  lagosAddress: null,
  timezone: "Africa/Lagos",
  baseCurrency: "USD",
  shippingUsd: 1500,
  clearingUsd: 400,
  exportLicenseUsd: 250,
  cchServiceFeeUsd: 600,
  whatsappOperationsNumber: null,
  operationsEmail: "hello@chinesecarshub.com",
  sourceToOrderSlaHours: 48,
  waitResponseTimeoutHours: 24,
  ratesUpdatedAt: "2026-05-15T08:00:00Z",
  currencies: [
    {
      code: "NGN",
      label: "Nigerian Naira",
      symbol: "₦",
      ratePerUsd: 1620,
      updatedAt: "2026-05-15T08:00:00Z",
      source: "manual",
    },
    {
      code: "GHS",
      label: "Ghanaian Cedi",
      symbol: "₵",
      ratePerUsd: 14.85,
      updatedAt: "2026-05-15T08:00:00Z",
      source: "manual",
    },
    {
      code: "XOF",
      label: "West African CFA Franc",
      symbol: "CFA",
      ratePerUsd: 605,
      updatedAt: "2026-05-15T08:00:00Z",
      source: "manual",
    },
    {
      code: "CNY",
      label: "Chinese Yuan",
      symbol: "¥",
      ratePerUsd: 7.22,
      updatedAt: "2026-05-15T08:00:00Z",
      source: "manual",
    },
  ],
};
