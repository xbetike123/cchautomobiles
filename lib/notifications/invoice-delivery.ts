import "server-only";

import {
  getFromAddress,
  getReplyToAddress,
  getResendClient,
} from "@/lib/email/resend";
import {
  renderInvoiceDeliveryHtml,
  renderInvoiceDeliverySubject,
  renderInvoiceDeliveryText,
} from "@/lib/email/templates/invoice-delivery";
import type { Invoice } from "@/lib/admin/types";
import { renderInvoicePdf } from "@/lib/pdf/render";

export type InvoiceDeliveryResult =
  | { sent: true; mocked: boolean; messageId?: string }
  | { sent: false; error: string };

export async function sendInvoiceDeliveryEmail(
  invoice: Invoice,
  toEmail: string,
): Promise<InvoiceDeliveryResult> {
  const resend = getResendClient();
  const from = getFromAddress();

  if (!resend || !from) {
    console.warn(
      "[invoice-delivery] Skipping send — RESEND_API_KEY or RESEND_FROM_EMAIL not set.",
    );
    console.info("[invoice-delivery:mock]", {
      to: toEmail,
      subject: renderInvoiceDeliverySubject(invoice),
    });
    return { sent: true, mocked: true };
  }

  let pdf: Buffer;
  try {
    pdf = await renderInvoicePdf(invoice);
  } catch (error) {
    return {
      sent: false,
      error:
        "PDF render failed: " +
        (error instanceof Error ? error.message : "Unknown error"),
    };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: toEmail,
      replyTo: getReplyToAddress(),
      subject: renderInvoiceDeliverySubject(invoice),
      text: renderInvoiceDeliveryText(invoice),
      html: renderInvoiceDeliveryHtml(invoice),
      attachments: [
        {
          filename: `CCH-${invoice.invoiceNumber}.pdf`,
          content: pdf,
        },
      ],
      tags: [{ name: "type", value: "invoice_delivery" }],
    });
    if (result.error) {
      return { sent: false, error: result.error.message };
    }
    return { sent: true, mocked: false, messageId: result.data?.id };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
