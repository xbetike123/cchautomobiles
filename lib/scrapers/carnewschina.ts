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

const URL_SHAPE_HINT =
  "Use a data.carnewschina.com model page, e.g. https://data.carnewschina.com/database/aion/aion-y/2025/params";

function isModelYear(value: number): boolean {
  return Number.isFinite(value) && value >= 2000 && value <= 2100;
}

type PageFetch =
  | { ok: true; html: string; finalUrl: URL }
  | { ok: false; error: string };

async function fetchPage(url: URL): Promise<PageFetch> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: controller.signal,
      cache: "no-store",
      // The site redirects a model URL to its most recent year.
      redirect: "follow",
    });
    if (!res.ok) {
      return { ok: false, error: `Source returned HTTP ${res.status}.` };
    }
    return {
      ok: true,
      html: await res.text(),
      finalUrl: new URL(res.url || url.toString()),
    };
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
}

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
      error: `Only ${ALLOWED_HOST} URLs are supported (got ${url.host}). ${URL_SHAPE_HINT}`,
    };
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] !== "database") {
    return { ok: false, error: `That isn't a database page. ${URL_SHAPE_HINT}` };
  }

  // Accept every shape the site hands out, not just the fully-qualified specs
  // URL: browsing to a car and copying the address bar gives you the model or
  // model+year form, and the site itself redirects between them.
  //   /database/{brand}/{model}
  //   /database/{brand}/{model}/{year}
  //   /database/{brand}/{model}/{year}/params
  const base =
    segments[segments.length - 1] === "params" ? segments.slice(0, -1) : segments;
  const brandSlug = base[1] ?? "";
  const modelSlug = base[2] ?? "";
  if (!brandSlug || !modelSlug) {
    return {
      ok: false,
      error: `That URL is missing the brand or model. ${URL_SHAPE_HINT}`,
    };
  }

  let year = Number.parseInt(base[3] ?? "", 10);
  if (!isModelYear(year)) {
    // No year in the path — follow the model URL to whichever year the site
    // considers current, then read the specs for that year.
    const modelPage = await fetchPage(
      new URL(`/database/${brandSlug}/${modelSlug}`, url.origin),
    );
    if (!modelPage.ok) return modelPage;

    const resolved = modelPage.finalUrl.pathname.split("/").filter(Boolean);
    year = Number.parseInt(resolved[3] ?? "", 10);
    if (!isModelYear(year)) {
      return {
        ok: false,
        error: `Couldn't work out the model year for ${brandSlug}/${modelSlug}. Open the car on data.carnewschina.com, click Parameters, and paste that URL.`,
      };
    }
  }

  const paramsUrl = new URL(
    `/database/${brandSlug}/${modelSlug}/${year}/params`,
    url.origin,
  );
  const page = await fetchPage(paramsUrl);
  if (!page.ok) return page;
  const html = page.html;
  url = paramsUrl;

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
