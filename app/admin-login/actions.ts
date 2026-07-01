"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin/session";

function passwordsMatch(supplied: string, expected: string): boolean {
  const suppliedHash = createHash("sha256").update(supplied).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(suppliedHash, expectedHash);
}

export async function login(formData: FormData) {
  const suppliedPassword = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    typeof suppliedPassword !== "string" ||
    !adminPassword ||
    adminPassword.length < 12 ||
    !passwordsMatch(suppliedPassword, adminPassword)
  ) {
    redirect("/admin-login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(),
    adminSessionCookieOptions,
  );
  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin-login");
}
