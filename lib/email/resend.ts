import "server-only";

import { Resend } from "resend";

import { env } from "@/lib/env";

let cachedClient: Resend | null = null;

export function getResendClient(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (!cachedClient) {
    cachedClient = new Resend(env.RESEND_API_KEY);
  }
  return cachedClient;
}

export function getFromAddress(): string | null {
  const email = env.RESEND_FROM_EMAIL;
  if (!email) return null;
  const name = env.RESEND_FROM_NAME?.trim() || "CCH Automobile";
  return `${name} <${email}>`;
}

// Replies should always reach a monitored inbox. The "from" address lives on a
// no-reply notifications subdomain, so without a reply-to, customer replies
// bounce or vanish. Fall back to the public contact inbox when unset.
const DEFAULT_REPLY_TO = "hello@chinesecarshub.com";

export function getReplyToAddress(): string {
  return env.RESEND_REPLY_TO_EMAIL || DEFAULT_REPLY_TO;
}
