"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { getInvoiceByNumber } from "@/lib/admin/queries/invoices";
import { getAdminClient } from "@/lib/admin/supabase";
import { sendInvoiceDeliveryEmail } from "@/lib/notifications/invoice-delivery";

export type SendInvoiceResult =
  | { ok: true; mocked: boolean; toEmail: string }
  | { ok: false; error: string };

export async function sendInvoiceToCustomer(
  invoiceNumber: string,
): Promise<SendInvoiceResult> {
  const invoice = await getInvoiceByNumber(invoiceNumber);
  if (!invoice) {
    return { ok: false, error: "Invoice not found." };
  }

  const toEmail = invoice.clientEmail;
  if (!toEmail) {
    return {
      ok: false,
      error:
        "No email on file for this customer. Add a client email to the invoice before sending.",
    };
  }

  const result = await sendInvoiceDeliveryEmail(invoice, toEmail);
  if (!result.sent) {
    return { ok: false, error: result.error };
  }

  // Mark the invoice as sent if it was a draft. Already-sent / paid / void
  // invoices keep their existing status so resends don't downgrade state.
  if (invoice.status === "draft") {
    const supabase = getAdminClient();
    if (supabase) {
      const { error: updateError } = await supabase
        .from("invoices")
        .update({
          status: "sent",
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoice.id);
      if (updateError) {
        console.error(
          "[admin/invoices/actions] Failed to mark invoice as sent:",
          updateError.message,
        );
      }
    }
  }

  revalidatePath(`/admin/invoices/${invoice.invoiceNumber}`);
  revalidatePath("/admin/invoices");

  return { ok: true, mocked: result.mocked, toEmail };
}
