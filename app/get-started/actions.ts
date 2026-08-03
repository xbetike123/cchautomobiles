"use server";

import "server-only";

import { headers } from "next/headers";

import {
  GUIDE_SLUG,
  GUIDE_TITLE,
  guideDownloadSchema,
  type GuideDownloadInput,
} from "@/app/get-started/schema";
import { sendGuideDownloadToDiscord } from "@/lib/notifications/discord";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export type GuideDownloadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function requestGuideDownload(
  input: GuideDownloadInput,
): Promise<GuideDownloadResult> {
  const parsed = guideDownloadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;
  const reqHeaders = await headers();
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    reqHeaders.get("x-real-ip") ||
    null;

  // Looser than the quote form at 10/hour: downloading a guide is a much
  // lower-commitment action, and a shared office IP shouldn't be locked out.
  const rate = await checkRateLimit({
    scope: "guide_download",
    identifier: ip ?? "anon",
    limit: 10,
    windowSeconds: 60 * 60,
  });
  if (!rate.allowed) {
    return {
      ok: false,
      error:
        "You've hit the limit for this hour. Reach us on WhatsApp and we'll send the guide over.",
    };
  }

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("guide_downloads").insert({
    first_name: data.firstName,
    email: data.email,
    guide_slug: GUIDE_SLUG,
    source: "get-started",
    ip_address: ip,
  });

  if (error) {
    // The visitor kept their side of the bargain, so never block the download
    // on our storage failing — log it and let them through.
    console.error("[get-started] guide download insert failed", error);
  }

  // Notify the team. Also best-effort: a webhook outage must not cost the
  // visitor their download, and the row above is already the record of truth.
  const discord = await sendGuideDownloadToDiscord({
    firstName: data.firstName,
    email: data.email,
    guideTitle: GUIDE_TITLE,
  });
  if (!discord.sent) {
    console.error("[get-started] discord notify failed", discord.error);
  }

  return { ok: true };
}
