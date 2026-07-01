import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSession,
} from "@/lib/admin/session";
import type { AdminProfile } from "@/lib/admin/types";

export async function getCurrentAdmin(): Promise<AdminProfile> {
  const cookieStore = await cookies();
  if (
    !isValidAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
  ) {
    redirect("/admin-login");
  }

  return {
    id: "profile-peter",
    email: "peter@cchautomobile.com",
    fullName: "Peter Chen",
    role: "admin",
    active: true,
    lastLoginAt: "2026-05-16T08:00:00Z",
  };
}
