import "server-only";

import { FALLBACK_PARENT_COMPANY } from "@/lib/admin/parent-company";
import { getAdminClient } from "@/lib/admin/supabase";
import type { ParentCompany } from "@/lib/admin/types";

const MOCK_PARENT_COMPANIES: ParentCompany[] = [
  { id: "company-1", legalName: FALLBACK_PARENT_COMPANY, isDefault: true },
];

export async function listParentCompanies(): Promise<ParentCompany[]> {
  const supabase = getAdminClient();
  if (!supabase) return MOCK_PARENT_COMPANIES;

  const { data, error } = await supabase
    .from("parent_companies")
    .select("*")
    .order("is_default", { ascending: false })
    .order("legal_name", { ascending: true });
  if (error) {
    console.error("[admin/companies] listParentCompanies failed:", error.message);
    return MOCK_PARENT_COMPANIES;
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    legalName: row.legal_name,
    isDefault: row.is_default,
  }));
}

/**
 * Legal name pre-selected in the builders and used for documents saved
 * before parent companies shipped.
 */
export async function getDefaultParentCompanyName(): Promise<string> {
  const companies = await listParentCompanies();
  const fallback = companies.find((c) => c.isDefault) ?? companies[0];
  return fallback?.legalName ?? FALLBACK_PARENT_COMPANY;
}
