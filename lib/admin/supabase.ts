import "server-only";

import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * Returns a service-role Supabase client suitable for admin reads and
 * writes, or `null` if the service-role env vars are absent. Admin
 * queries use this so that local development without Supabase keys
 * falls back to the in-memory mocks instead of crashing.
 */
export function getAdminClient() {
  if (
    !env.NEXT_PUBLIC_SUPABASE_URL ||
    !env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  return createSupabaseServiceClient();
}
