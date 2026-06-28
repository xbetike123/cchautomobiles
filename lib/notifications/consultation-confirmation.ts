import "server-only";

import {
  getFromAddress,
  getReplyToAddress,
  getResendClient,
} from "@/lib/email/resend";
import {
  renderConsultationConfirmationHtml,
  renderConsultationConfirmationSubject,
  renderConsultationConfirmationText,
} from "@/lib/email/templates/consultation-confirmation";

export type ConsultationEmailResult =
  | { sent: true; mocked: boolean; messageId?: string }
  | { sent: false; error: string };

/**
 * Auto-reply to the lead confirming we received their consultation request.
 * Best-effort: failure here never blocks the user-facing submission.
 */
export async function sendConsultationConfirmationEmail(lead: {
  name: string;
  email: string;
}): Promise<ConsultationEmailResult> {
  const resend = getResendClient();
  const from = getFromAddress();

  if (!resend || !from) {
    console.warn(
      "[consultation-confirmation] Skipping send — RESEND_API_KEY or RESEND_FROM_EMAIL not set. Mock payload below.",
    );
    console.info("[consultation-confirmation:mock]", {
      to: lead.email,
      subject: renderConsultationConfirmationSubject(),
    });
    return { sent: true, mocked: true };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: lead.email,
      replyTo: getReplyToAddress(),
      subject: renderConsultationConfirmationSubject(),
      text: renderConsultationConfirmationText(lead),
      html: renderConsultationConfirmationHtml(lead),
      tags: [{ name: "type", value: "consultation_confirmation" }],
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
