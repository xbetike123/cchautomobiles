import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { renderToBuffer } from "@react-pdf/renderer";

import type { Invoice } from "@/lib/admin/types";
import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument";
import { QuoteDocument } from "@/lib/pdf/QuoteDocument";

const SUPPORTED_PHOTO_EXTS = new Set([".png", ".jpg", ".jpeg"]);

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

async function loadCarPhoto(photoUrls: string[]): Promise<Buffer | null> {
  for (const url of photoUrls) {
    if (!url.startsWith("/")) continue;
    const ext = path.extname(url).toLowerCase();
    if (!SUPPORTED_PHOTO_EXTS.has(ext)) continue;
    const buf = await readPublicAsset(url);
    if (buf) return buf;
  }
  return null;
}

export async function renderQuotePdf(
  quote: QuoteWithClient,
): Promise<Buffer> {
  const [logoSrc, photoSrc] = await Promise.all([
    loadLogo(),
    loadCarPhoto(quote.photoUrls),
  ]);
  return renderToBuffer(
    QuoteDocument({
      quote,
      logoSrc: logoSrc ?? undefined,
      photoSrc: photoSrc ?? undefined,
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
