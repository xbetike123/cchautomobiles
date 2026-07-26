import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { renderToBuffer } from "@react-pdf/renderer";

import type { Invoice } from "@/lib/admin/types";
import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument";
import { QuoteDocument } from "@/lib/pdf/QuoteDocument";

const SUPPORTED_PHOTO_EXTS = new Set([".png", ".jpg", ".jpeg"]);
const MAX_REMOTE_IMAGE_BYTES = 10 * 1024 * 1024;

function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

async function readPublicAsset(publicPath: string): Promise<Buffer | null> {
  if (!publicPath.startsWith("/")) return null;
  if (publicPath.includes("..")) return null;
  try {
    const absolute = path.join(process.cwd(), "public", publicPath);
    return await readFile(absolute);
  } catch {
    return null;
  }
}

async function loadLogo(): Promise<Buffer | null> {
  return readPublicAsset("/logo/cch_logo_transparent.png");
}

function dataUrlToBuffer(dataUrl: string): Buffer | null {
  const match = /^data:image\/(png|jpe?g);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  try {
    return Buffer.from(match[2], "base64");
  } catch {
    return null;
  }
}

async function loadCarPhotos(photoUrls: string[]): Promise<Buffer[]> {
  const out: Buffer[] = [];
  for (const url of photoUrls) {
    // Inline data URLs — images attached directly in the quote builder.
    if (url.startsWith("data:image/")) {
      const buf = dataUrlToBuffer(url);
      if (buf) out.push(buf);
      continue;
    }
    // Local public assets (e.g. /placeholders/…).
    if (url.startsWith("/")) {
      const ext = path.extname(url).toLowerCase();
      if (!SUPPORTED_PHOTO_EXTS.has(ext)) continue;
      const buf = await readPublicAsset(url);
      if (buf) out.push(buf);
      continue;
    }
    // Public quote-bucket and inventory URLs.
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      continue;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") continue;
    if (isPrivateHostname(parsed.hostname)) continue;
    try {
      const response = await fetch(parsed, {
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });
      const contentType = response.headers.get("content-type")?.split(";")[0];
      const contentLength = Number(response.headers.get("content-length") ?? 0);
      if (
        !response.ok ||
        (contentType !== "image/jpeg" && contentType !== "image/png") ||
        contentLength > MAX_REMOTE_IMAGE_BYTES
      ) {
        continue;
      }
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength <= MAX_REMOTE_IMAGE_BYTES) {
        out.push(Buffer.from(bytes));
      }
    } catch (error) {
      console.warn("[pdf] Could not load quote image:", parsed.origin, error);
    }
  }
  return out;
}

export async function renderQuotePdf(
  quote: QuoteWithClient,
  specs?: Record<string, string> | null,
): Promise<Buffer> {
  const vehicles = quote.vehicles?.length ? quote.vehicles : null;
  const [logoSrc, photoSrcs, vehiclePhotoSrcs] = await Promise.all([
    loadLogo(),
    loadCarPhotos(quote.photoUrls),
    vehicles
      ? Promise.all(vehicles.map((vehicle) => loadCarPhotos(vehicle.photoUrls)))
      : Promise.resolve(undefined),
  ]);
  return renderToBuffer(
    QuoteDocument({
      quote,
      logoSrc: logoSrc ?? undefined,
      photoSrcs,
      vehiclePhotoSrcs,
      specs,
    }),
  );
}

export async function renderInvoicePdf(invoice: Invoice): Promise<Buffer> {
  const logoSrc = await loadLogo();
  return renderToBuffer(
    InvoiceDocument({
      invoice,
      logoSrc: logoSrc ?? undefined,
    }),
  );
}
