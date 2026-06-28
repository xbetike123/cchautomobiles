import "server-only";

import { load } from "cheerio";

/**
 * Server-side scraper for data.carnewschina.com /params pages.
 *
 * The page renders one row per spec with N values (one per trim) inside
 *   <div class="table__row">
 *     <div class="table__cell table__cell-param-name">Length</div>
 *     <div class="flow-x__scroll">
 *       <div class="table__cell">4,805 mm</div>
 *       <div class="table__cell">4,810 mm</div>
 *       ...
 *     </div>
 *   </div>
 *
 * Trim boxes carry name + USD/CNY price:
 *   <div class="box box-trim">
 *     <div class="box-trim__name">Aion S 2026 Shine 580</div>
 *     <div class="box-trim__price-main">USD 13,240</div>
 *     <div class="box-trim__price-info">(89,800 yuan)</div>
 *   </div>
 */

const ALLOWED_HOST = "data.carnewschina.com";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const FETCH_TIMEOUT_MS = 15_000;

export type ScrapedTrim = {
  name: string;
  priceUsd: number | null;
  priceCny: number | null;
};

export type ScrapedCar = {
  sourceUrl: string;
  brand: string;
  modelLabel: string;
  year: number;
  pageTitle: string;
  trims: ScrapedTrim[];
  // Param name -> one value per trim, index-aligned with `trims`.
  specs: Record<string, string[]>;
};

export type ScrapeResult =
  | { ok: true; data: ScrapedCar }
  | { ok: false; error: string };

export async function scrapeCarnewschina(rawUrl: string): Promise<ScrapeResult> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { ok: false, error: "Not a valid URL." };
  }
  if (url.host !== ALLOWED_HOST) {
    return {
      ok: false,
      error: `Only ${ALLOWED_HOST} URLs are supported (got ${url.host}).`,
    };
  }
  // Expect path like /database/{brand}/{model}/{year}/params
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] !== "database" || segments[segments.length - 1] !== "params") {
    return {
      ok: false,
      error:
        "URL must look like https://data.carnewschina.com/database/{brand}/{model}/{year}/params",
    };
  }
  const yearStr = segments[segments.length - 2];
  const year = Number.parseInt(yearStr, 10);
  if (!Number.isFinite(year) || year < 2000 || year > 2100) {
    return { ok: false, error: `Unrecognised year segment "${yearStr}".` };
  }
  const brandSlug = segments[1] ?? "";
  const modelSlug = segments[2] ?? "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let html: string;
  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `Source returned HTTP ${res.status}.` };
    }
    html = await res.text();
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error && err.name === "AbortError"
          ? "Source timed out."
          : `Fetch failed: ${err instanceof Error ? err.message : "unknown"}`,
    };
  } finally {
    clearTimeout(timeout);
  }

  const $ = load(html);

  // -------- trims --------
  const trims: ScrapedTrim[] = [];
  $(".box.box-trim").each((_, el) => {
    const $el = $(el);
    const name = $el.find(".box-trim__name").first().text().trim();
    if (!name) return;
    const priceText = $el.find(".box-trim__price-main").first().text().trim();
    const cnyText = $el.find(".box-trim__price-info").first().text().trim();
    trims.push({
      name,
      priceUsd: parseUsd(priceText),
      priceCny: parseCny(cnyText),
    });
  });

  if (trims.length === 0) {
    return {
      ok: false,
      error:
        "Couldn't find any trims on the page. The source layout may have changed.",
    };
  }

  // -------- specs --------
  const specs: Record<string, string[]> = {};
  $(".table__row").each((_, row) => {
    const $row = $(row);
    const name = $row.find(".table__cell-param-name").first().text().trim();
    if (!name) return;
    const values: string[] = [];
    $row
      .find(".flow-x__scroll .table__cell, .flow-x .table__cell")
      .each((_, cell) => {
        values.push($(cell).text().trim());
      });
    if (values.length > 0) specs[name] = values;
  });

  // -------- page title (best-effort) --------
  const pageTitle =
    $("title").first().text().split("|")[0]?.trim() ||
    `${capitalize(brandSlug)} ${capitalize(modelSlug)} ${year}`;

  return {
    ok: true,
    data: {
      sourceUrl: url.toString(),
      brand: brandSlug.split("-").map(capitalize).join(" "),
      modelLabel: modelSlug.split("-").map(capitalize).join(" "),
      year,
      pageTitle,
      trims,
      specs,
    },
  };
}

function parseUsd(text: string): number | null {
  // "USD 13,240" → 13240
  const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Math.round(Number(match[1])) : null;
}

function parseCny(text: string): number | null {
  // "(89,800 yuan)" → 89800
  const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Math.round(Number(match[1])) : null;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
