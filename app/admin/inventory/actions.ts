"use server";

import "server-only";

import {
  scrapeCarnewschina,
  type ScrapeResult,
} from "@/lib/scrapers/carnewschina";

/**
 * Fetch + parse a carnewschina.com /params URL. Used by the Add/Edit Car
 * form to optionally attach a full manufacturer spec set to a listing.
 */
export async function previewScrape(url: string): Promise<ScrapeResult> {
  return scrapeCarnewschina(url);
}
