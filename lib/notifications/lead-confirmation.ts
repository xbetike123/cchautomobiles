import "server-only";

import {
  getFromAddress,
  getReplyToAddress,
  getResendClient,
} from "@/lib/email/resend";
import {
  renderLeadConfirmationHtml,
  renderLeadConfirmationSubject,
  renderLeadConfirmationText,
} from "@/lib/email/templates/lead-confirmation";
import type { LeadSummary } from "@/lib/notifications/whatsapp";

export type LeadConfirmationResult =
  | { sent: true; mocked: boolean; messageId?: string }
  | { sent: false; error: string };

/**
 * Auto-reply to the lead's inbox confirming we received the request.
 * Best-effort: failure here never blocks the user-facing submission.
 */
export async function sendLeadConfirmationEmail(
  lead: LeadSummary,
): Promise<LeadConfirmationResult> {
  const resend = getResendClient();
  const from = getFromAddress();

  if (!resend || !from) {
    console.warn(
      "[lead-confirmation] Skipping send — RESEND_API_KEY or RESEND_FROM_EMAIL not set. Mock payload below.",
    );
    console.info("[lead-confirmation:mock]", {
      to: lead.email,
      subject: renderLeadConfirmationSubject(lead),
    });
    return { sent: true, mocked: true };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: lead.email,
      replyTo: getReplyToAddress(),
      subject: renderLeadConfirmationSubject(lead),
      text: renderLeadConfirmationText(lead),
      html: renderLeadConfirmationHtml(lead),
      tags: [{ name: "type", value: "lead_confirmation" }],
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
