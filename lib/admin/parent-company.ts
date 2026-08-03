/**
 * The parent entity CCH issues documents under, printed as "C/O <legal name>".
 *
 * Kept free of server-only imports so the PDF templates, the admin builders,
 * and the query layer can all share one definition of the fallback.
 */

/**
 * The entity that was hardcoded in the PDF templates before parent companies
 * became editable. Used when Supabase is unconfigured, and for documents
 * issued before the feature shipped.
 */
export const FALLBACK_PARENT_COMPANY = "Naiyuan Mart Co. Ltd";

/** Renders the C/O line for a document, falling back when nothing is set. */
export function formatCareOf(name: string | null | undefined): string {
  const trimmed = name?.trim();
  return `C/O ${trimmed || FALLBACK_PARENT_COMPANY}`;
}
