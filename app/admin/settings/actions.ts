"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminClient } from "@/lib/admin/supabase";

export type ParentCompanyResult = { ok: true } | { ok: false; error: string };

const NOT_CONFIGURED =
  "Supabase is not configured, so parent companies cannot be edited.";
const MIGRATION_HINT =
  "The parent companies table is missing. Apply Supabase migration 0016, then try again.";

function isMissingTable(message: string): boolean {
  return (
    message.includes("parent_companies") &&
    (message.includes("does not exist") || message.includes("schema cache"))
  );
}

function isDuplicateName(message: string): boolean {
  return message.includes("parent_companies_legal_name_idx");
}

function revalidate() {
  revalidatePath("/admin/settings");
  revalidatePath("/admin/quotes/new");
  revalidatePath("/admin/quotes/pre-sales/new");
  revalidatePath("/admin/invoices/new");
}

export async function createParentCompany(
  legalName: string,
): Promise<ParentCompanyResult> {
  await getCurrentAdmin();
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: NOT_CONFIGURED };

  const name = legalName.trim();
  if (!name) return { ok: false, error: "Enter the company's legal name." };

  // The first company added becomes the default, so the builders always have
  // something pre-selected.
  const { count, error: countError } = await supabase
    .from("parent_companies")
    .select("*", { head: true, count: "exact" });
  if (countError) {
    console.error("[admin/settings] company count failed:", countError.message);
    return {
      ok: false,
      error: isMissingTable(countError.message)
        ? MIGRATION_HINT
        : "The company could not be added. Please try again.",
    };
  }

  const { error } = await supabase
    .from("parent_companies")
    .insert({ legal_name: name, is_default: (count ?? 0) === 0 });
  if (error) {
    console.error("[admin/settings] create company failed:", error.message);
    if (isDuplicateName(error.message)) {
      return { ok: false, error: `"${name}" is already on the list.` };
    }
    return {
      ok: false,
      error: isMissingTable(error.message)
        ? MIGRATION_HINT
        : "The company could not be added. Please try again.",
    };
  }

  revalidate();
  return { ok: true };
}

export async function renameParentCompany(
  id: string,
  legalName: string,
): Promise<ParentCompanyResult> {
  await getCurrentAdmin();
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: NOT_CONFIGURED };

  const name = legalName.trim();
  if (!name) return { ok: false, error: "Enter the company's legal name." };

  const { error } = await supabase
    .from("parent_companies")
    .update({ legal_name: name })
    .eq("id", id);
  if (error) {
    console.error("[admin/settings] rename company failed:", error.message);
    if (isDuplicateName(error.message)) {
      return { ok: false, error: `"${name}" is already on the list.` };
    }
    return { ok: false, error: "The company could not be renamed. Please try again." };
  }

  // Quotes and invoices snapshot the name they were issued under, so
  // already-sent documents deliberately keep the old name.
  revalidate();
  return { ok: true };
}

export async function setDefaultParentCompany(
  id: string,
): Promise<ParentCompanyResult> {
  await getCurrentAdmin();
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: NOT_CONFIGURED };

  // A partial unique index allows only one default row, so the old default
  // has to be cleared before the new one is set.
  const { error: clearError } = await supabase
    .from("parent_companies")
    .update({ is_default: false })
    .eq("is_default", true);
  if (clearError) {
    console.error("[admin/settings] clear default failed:", clearError.message);
    return { ok: false, error: "The default could not be changed. Please try again." };
  }

  const { error } = await supabase
    .from("parent_companies")
    .update({ is_default: true })
    .eq("id", id);
  if (error) {
    console.error("[admin/settings] set default failed:", error.message);
    return { ok: false, error: "The default could not be changed. Please try again." };
  }

  revalidate();
  return { ok: true };
}

export async function deleteParentCompany(
  id: string,
): Promise<ParentCompanyResult> {
  await getCurrentAdmin();
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: NOT_CONFIGURED };

  const { data: company, error: readError } = await supabase
    .from("parent_companies")
    .select("is_default")
    .eq("id", id)
    .maybeSingle();
  if (readError) {
    console.error("[admin/settings] read company failed:", readError.message);
    return { ok: false, error: "The company could not be removed. Please try again." };
  }
  if (!company) return { ok: false, error: "That company no longer exists." };

  const { count, error: countError } = await supabase
    .from("parent_companies")
    .select("*", { head: true, count: "exact" });
  if (countError) {
    console.error("[admin/settings] company count failed:", countError.message);
    return { ok: false, error: "The company could not be removed. Please try again." };
  }
  if ((count ?? 0) <= 1) {
    return {
      ok: false,
      error: "Keep at least one company — documents need a C/O line.",
    };
  }

  const { error } = await supabase.from("parent_companies").delete().eq("id", id);
  if (error) {
    console.error("[admin/settings] delete company failed:", error.message);
    return { ok: false, error: "The company could not be removed. Please try again." };
  }

  // Deleting the default would leave every builder with nothing pre-selected,
  // so promote the next company by name.
  if (company.is_default) {
    const { data: next } = await supabase
      .from("parent_companies")
      .select("id")
      .order("legal_name", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (next) {
      await supabase
        .from("parent_companies")
        .update({ is_default: true })
        .eq("id", next.id);
    }
  }

  revalidate();
  return { ok: true };
}
