import "server-only";

import { NextResponse } from "next/server";

import { getQuoteById } from "@/lib/admin/queries/quotes";
import { renderQuotePdf } from "@/lib/pdf/render";

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

  let pdf: Buffer;
  try {
    pdf = await renderQuotePdf(quote);
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
