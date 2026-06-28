import "server-only";

import { NextResponse } from "next/server";

import { MOCK_INVOICES } from "@/lib/admin/mocks/invoices";
import { renderInvoicePdf } from "@/lib/pdf/render";

/**
 * Dev-only preview endpoint that renders the first mock invoice as a PDF.
 * Use it when the connected Supabase has no invoices yet but you want to
 * see what the live invoice PDF looks like. Delete once real invoice rows
 * exist in the DB.
 */
export async function GET() {
  const invoice = MOCK_INVOICES.find((i) => i.notes) ?? MOCK_INVOICES[0];
  if (!invoice) {
    return NextResponse.json({ error: "No mock invoice available" }, { status: 404 });
  }

  let pdf: Buffer;
  try {
    pdf = await renderInvoicePdf(invoice);
  } catch (error) {
    console.error("[admin/_preview/invoice-pdf] render failed:", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }

  const body = new Uint8Array(pdf);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="CCH-${invoice.invoiceNumber}-preview.pdf"`,
      "Cache-Control": "no-store",
      "Content-Length": String(body.byteLength),
    },
  });
}
