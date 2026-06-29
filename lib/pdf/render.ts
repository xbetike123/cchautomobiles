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
    if (!url.startsWith("/")) continue;
    const ext = path.extname(url).toLowerCase();
    if (!SUPPORTED_PHOTO_EXTS.has(ext)) continue;
    const buf = await readPublicAsset(url);
    if (buf) out.push(buf);
  }
  return out;
}

export async function renderQuotePdf(
  quote: QuoteWithClient,
  specs?: Record<string, string> | null,
): Promise<Buffer> {
  const [logoSrc, photoSrcs] = await Promise.all([
    loadLogo(),
    loadCarPhotos(quote.photoUrls),
  ]);
  return renderToBuffer(
    QuoteDocument({
      quote,
      logoSrc: logoSrc ?? undefined,
      photoSrcs,
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
