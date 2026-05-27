import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { QuoteDocument } from "@/lib/pdf/QuoteDocument";
import { getQuoteById } from "@/lib/admin/queries/quotes";

const SUPPORTED_PHOTO_EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function readPublicAsset(publicPath: string): Promise<Buffer | null> {
  // Only allow paths that stay inside /public/. Block traversal.
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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = decodeURIComponent(rawId);

  const quote = await getQuoteById(id);
  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const [logoSrc, photoSrc] = await Promise.all([
    loadLogo(),
    loadCarPhoto(quote.photoUrls),
  ]);

  let pdf: Buffer;
  try {
    pdf = await renderToBuffer(
      QuoteDocument({
        quote,
        logoSrc: logoSrc ?? undefined,
        photoSrc: photoSrc ?? undefined,
      }),
    );
  } catch (error) {
    console.error("[admin/quotes/pdf] render failed:", error);
    return NextResponse.json(
      { error: "Failed to render quote PDF" },
      { status: 500 },
    );
  }

  const filename = `CCH-Quote-${quote.id.toUpperCase()}.pdf`;

  // Convert the Buffer to a Uint8Array so the Response BodyInit type is happy
  // across both Node and Edge runtimes. Buffer extends Uint8Array, but the
  // explicit copy is the safest cross-runtime form.
  const body = new Uint8Array(pdf);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, no-store",
      "Content-Length": String(body.byteLength),
    },
  });
}
