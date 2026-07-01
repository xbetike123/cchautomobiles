import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "cch_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function sign(expiresAt: string, secret: string): string {
  return createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function createAdminSessionToken(now = Date.now()): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to a random value of at least 32 characters.",
    );
  }

  const expiresAt = String(now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function isValidAdminSession(
  token: string | undefined,
  now = Date.now(),
): boolean {
  const secret = getSessionSecret();
  if (!token || !secret) return false;

  const separator = token.indexOf(".");
  if (separator === -1) return false;

  const expiresAt = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);
  const expiry = Number(expiresAt);

  if (!Number.isSafeInteger(expiry) || expiry <= now) return false;

  const expectedSignature = sign(expiresAt, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);

  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  priority: "high" as const,
};
