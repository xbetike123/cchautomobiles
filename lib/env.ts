import { z } from "zod";

/**
 * Treat empty strings the same as missing. `.env.local` lines like
 * `FOO=` parse to "" not undefined, and we don't want those to count
 * as a "value is set" when later code calls requireEnv().
 */
const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.length === 0 ? undefined : v),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.length === 0 ? undefined : v),
  z.url().optional(),
);

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,

  WHATSAPP_CLOUD_API_TOKEN: optionalString,
  WHATSAPP_PHONE_NUMBER_ID: optionalString,
  WHATSAPP_OPERATIONS_NUMBER: optionalString,

  MAILERLITE_API_KEY: optionalString,
  MAILERLITE_GROUP_ID: optionalString,

  TURNSTILE_SITE_KEY: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,

  RESEND_API_KEY: optionalString,
  RESEND_FROM_EMAIL: optionalString,
  RESEND_FROM_NAME: optionalString,
  RESEND_REPLY_TO_EMAIL: optionalString,

  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  WHATSAPP_CLOUD_API_TOKEN: process.env.WHATSAPP_CLOUD_API_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_OPERATIONS_NUMBER: process.env.WHATSAPP_OPERATIONS_NUMBER,
  MAILERLITE_API_KEY: process.env.MAILERLITE_API_KEY,
  MAILERLITE_GROUP_ID: process.env.MAILERLITE_GROUP_ID,
  TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
  RESEND_REPLY_TO_EMAIL: process.env.RESEND_REPLY_TO_EMAIL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
});

if (!parsed.success) {
  console.error(
    "[env] Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error(
    "Invalid environment variables. See logs for the failing keys.",
  );
}

export const env = parsed.data;

export type EnvKey = keyof typeof env;

/**
 * Look up an env var and throw a precise error if it is missing or empty.
 * Use this at the point of use (server actions, route handlers, server
 * components) so that pages which do not depend on a given service can
 * still build during local development before that service is wired up.
 */
export function requireEnv<K extends EnvKey>(key: K): NonNullable<(typeof env)[K]> {
  const value = env[key];
  if (value === undefined || value === "") {
    throw new Error(
      `Missing required environment variable: ${key}. Set it in .env.local for development and in the Vercel dashboard for preview and production.`,
    );
  }
  return value as NonNullable<(typeof env)[K]>;
}
