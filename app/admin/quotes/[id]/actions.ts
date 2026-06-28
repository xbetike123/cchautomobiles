"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { getLeadById } from "@/lib/admin/queries/leads";
import { getQuoteById } from "@/lib/admin/queries/quotes";
import { getAdminClient } from "@/lib/admin/supabase";
import { sendQuoteDeliveryEmail } from "@/lib/notifications/quote-delivery";

export type SendQuoteResult =
  | { ok: true; mocked: boolean; toEmail: string }
  | { ok: false; error: string };

export async function sendQuoteToCustomer(
  quoteId: string,
): Promise<SendQuoteResult> {
  const quote = await getQuoteById(quoteId);
  if (!quote) {
    return { ok: false, error: "Quote not found." };
  }

  const lead = await getLeadById(quote.leadId);
  const toEmail = lead?.email;
  if (!toEmail) {
    return {
      ok: false,
      error:
        "No email on file for this customer. Add an email to the lead before sending.",
    };
  }

  const result = await sendQuoteDeliveryEmail(quote, toEmail);
  if (!result.sent) {
    return { ok: false, error: result.error };
  }

  // Mark the quote as sent in Supabase (no-op against the in-memory mock
  // dataset, but the response still reads as a successful send so the UI
  // updates locally).
  const supabase = getAdminClient();
  if (supabase) {
    const { error: updateError } = await supabase
      .from("quotes")
      .update({
        status: "sent",
        sent_via: "email",
        sent_at: new Date().toISOString(),
      })
      .eq("id", quote.id);
    if (updateError) {
      console.error(
        "[admin/quotes/actions] Failed to mark quote as sent:",
        updateError.message,
      );
    }
  }

  revalidatePath(`/admin/quotes/${quote.id}`);
  revalidatePath("/admin/quotes");

  return { ok: true, mocked: result.mocked, toEmail };
}
