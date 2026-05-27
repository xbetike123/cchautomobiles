import "server-only";

import { getAdminClient } from "@/lib/admin/supabase";
import { MOCK_SETTINGS } from "@/lib/admin/mocks/settings";
import type { AdminSettings, CurrencyRate } from "@/lib/admin/types";
import type { Database, Json } from "@/lib/supabase/types";

type SettingsRow = Database["public"]["Tables"]["admin_settings"]["Row"];

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const ALLOWED_SOURCES: ReadonlySet<CurrencyRate["source"]> = new Set([
  "manual",
  "auto",
]);

function parseCurrencies(value: Json): CurrencyRate[] {
  if (!Array.isArray(value)) return [];
  const out: CurrencyRate[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const record = entry as Record<string, Json>;
    const code = record.code;
    const label = record.label;
    const symbol = record.symbol;
    const ratePerUsd = record.ratePerUsd;
    const updatedAt = record.updatedAt;
    const source = record.source;
    if (
      typeof code === "string" &&
      typeof label === "string" &&
      typeof symbol === "string" &&
      typeof ratePerUsd === "number" &&
      typeof updatedAt === "string" &&
      typeof source === "string" &&
      ALLOWED_SOURCES.has(source as CurrencyRate["source"])
    ) {
      out.push({
        code,
        label,
        symbol,
        ratePerUsd,
        updatedAt,
        source: source as CurrencyRate["source"],
      });
    }
  }
  return out;
}

function settingsFromRow(row: SettingsRow): AdminSettings {
  return {
    companyName: row.company_name,
    legalName: row.legal_name,
    guangzhouAddress: row.guangzhou_address ?? "",
    lagosAddress: row.lagos_address,
    timezone: row.timezone,
    baseCurrency: row.base_currency,
    shippingUsd: Number(row.shipping_usd),
    clearingUsd: Number(row.clearing_usd),
    exportLicenseUsd: Number(row.export_license_usd),
    cchServiceFeeUsd: Number(row.cch_service_fee_usd),
    whatsappOperationsNumber: row.whatsapp_operations_number,
    operationsEmail: row.operations_email,
    sourceToOrderSlaHours: row.source_to_order_sla_hours,
    waitResponseTimeoutHours: row.wait_response_timeout_hours,
    currencies: parseCurrencies(row.currencies),
    ratesUpdatedAt: row.rates_updated_at,
  };
}

export async function getSettings(): Promise<AdminSettings> {
  const supabase = getAdminClient();
  if (!supabase) {
    return MOCK_SETTINGS;
  }
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("id", SETTINGS_ID)
    .maybeSingle();
  if (error) {
    console.error("[admin/settings] getSettings failed:", error.message);
    return MOCK_SETTINGS;
  }
  return data ? settingsFromRow(data) : MOCK_SETTINGS;
}
