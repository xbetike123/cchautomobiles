import "server-only";

import {
  getFromAddress,
  getReplyToAddress,
  getResendClient,
} from "@/lib/email/resend";
import {
  renderRequestConfirmationHtml,
  renderRequestConfirmationSubject,
  renderRequestConfirmationText,
} from "@/lib/email/templates/request-confirmation";

type Input = {
  toEmail: string;
  name: string;
  preferredBrand: string | null;
  preferredModel: string | null;
  cchCarCode: string | null;
};

export async function sendRequestConfirmation(input: Input): Promise<void> {
  const resend = getResendClient();
  const from = getFromAddress();
  if (!resend || !from) {
    // Soft no-op: form still saves to the DB. BLOCKERS.md documents the
    // env vars to set so this path activates.
    console.warn(
      "[email] Skipping request confirmation — RESEND_API_KEY or RESEND_FROM_EMAIL not set.",
    );
    return;
  }

  try {
    const result = await resend.emails.send({
      from,
      to: input.toEmail,
      replyTo: getReplyToAddress(),
      subject: renderRequestConfirmationSubject(),
      text: renderRequestConfirmationText(input),
      html: renderRequestConfirmationHtml(input),
      tags: [{ name: "type", value: "request_confirmation" }],
    });
    if (result.error) {
      console.error(
        "[email] request confirmation failed:",
        result.error.message,
      );
    }
  } catch (err) {
    console.error("[email] request confirmation threw:", err);
  }
}
