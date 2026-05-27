import "server-only";

import type { AdminProfile } from "@/lib/admin/types";

// Dev-only auth stub. Returns a hardcoded admin profile so admin pages can
// render without a real session. When Supabase Auth is wired:
//   1. Replace this body with `createSupabaseServerClient()` + `auth.getUser()`
//      and a `profiles` row lookup keyed by user id.
//   2. Add middleware.ts to enforce auth + role on every /admin/* route.
//   3. Keep this function signature stable so server components don't change.

export async function getCurrentAdmin(): Promise<AdminProfile> {
  return {
    id: "profile-peter",
    email: "peter@cchautomobile.com",
    fullName: "Peter Chen",
    role: "admin",
    active: true,
    lastLoginAt: "2026-05-16T08:00:00Z",
  };
}
