import "server-only";

import {
  getFromAddress,
  getReplyToAddress,
  getResendClient,
} from "@/lib/email/resend";
import {
  renderQuoteDeliveryHtml,
  renderQuoteDeliverySubject,
  renderQuoteDeliveryText,
} from "@/lib/email/templates/quote-delivery";
import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import { renderQuotePdf } from "@/lib/pdf/render";

export type QuoteDeliveryResult =
  | { sent: true; mocked: boolean; messageId?: string }
  | { sent: false; error: string };

/**
 * Send the quote PDF to the customer. Best-effort: failures are returned so
 * the caller can surface them in the admin UI without losing the action.
 */
export async function sendQuoteDeliveryEmail(
  quote: QuoteWithClient,
  toEmail: string,
): Promise<QuoteDeliveryResult> {
  const resend = getResendClient();
  const from = getFromAddress();

  if (!resend || !from) {
    console.warn(
      "[quote-delivery] Skipping send — RESEND_API_KEY or RESEND_FROM_EMAIL not set.",
    );
    console.info("[quote-delivery:mock]", {
      to: toEmail,
      subject: renderQuoteDeliverySubject(quote),
    });
    return { sent: true, mocked: true };
  }

  let pdf: Buffer;
  try {
    pdf = await renderQuotePdf(quote);
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
      subject: renderQuoteDeliverySubject(quote),
      text: renderQuoteDeliveryText(quote),
      html: renderQuoteDeliveryHtml(quote),
      attachments: [
        {
          filename: `CCH-Quote-${quote.id.toUpperCase()}.pdf`,
          content: pdf,
        },
      ],
      tags: [{ name: "type", value: "quote_delivery" }],
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
