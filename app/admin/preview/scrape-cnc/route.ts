import "server-only";

import { NextResponse } from "next/server";

import { scrapeCarnewschina } from "@/lib/scrapers/carnewschina";

/**
 * Dev-only smoke endpoint for the carnewschina scraper. Pass ?url=... and
 * it returns the parsed JSON so we can verify trim + spec extraction
 * without going through the full admin UI.
 */
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: "Pass ?url=<carnewschina /params url>" },
      { status: 400 },
    );
  }
  const result = await scrapeCarnewschina(url);
  return NextResponse.json(result, {
    status: result.ok ? 200 : 422,
  });
}
