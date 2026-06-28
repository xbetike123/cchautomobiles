import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { requireEnv } from "@/lib/env";
import type { Database } from "./types";

/**
 * Server-side Supabase client bound to the current request's cookies.
 * Use this in Server Components, route handlers, and server actions to
 * read public data under RLS or to act as a signed-in admin user.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot mutate cookies; ignored.
          }
        },
      },
    },
  );
}

/**
 * Service-role Supabase client that bypasses RLS. Server-only. Use only
 * for trusted writes such as quote_requests inserts after the rate-limit
 * check, or admin retry of failed notifications.
 */
export function createSupabaseServiceClient() {
  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
