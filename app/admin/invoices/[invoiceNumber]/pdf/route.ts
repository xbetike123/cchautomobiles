import "server-only";

import { NextResponse } from "next/server";

import { getInvoiceByNumber } from "@/lib/admin/queries/invoices";
import { renderInvoicePdf } from "@/lib/pdf/render";

type RouteContext = {
  params: Promise<{ invoiceNumber: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { invoiceNumber: rawNumber } = await context.params;
  const invoiceNumber = decodeURIComponent(rawNumber);

  const invoice = await getInvoiceByNumber(invoiceNumber);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  let pdf: Buffer;
  try {
    pdf = await renderInvoicePdf(invoice);
  } catch (error) {
    console.error("[admin/invoices/pdf] render failed:", error);
    return NextResponse.json(
      { error: "Failed to render invoice PDF" },
      { status: 500 },
    );
  }

  const filename = `CCH-${invoice.invoiceNumber}.pdf`;
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
