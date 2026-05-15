"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireEnv } from "@/lib/env";
import type { Database } from "./types";

/**
 * Browser-side Supabase client. The anon key reaches the client; RLS
 * policies in supabase/migrations/0002 gate every readable row.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}
