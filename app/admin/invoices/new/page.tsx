import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { InvoiceForm } from "@/components/admin/invoices/InvoiceForm";

export default function AdminNewInvoicePage() {
  return (
    <>
      <AdminHeader
        eyebrow="Billing"
        title="New invoice"
        description="Issue a draft invoice. Send it once the totals are confirmed."
        actions={
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to invoices
          </Link>
        }
      />
      <div className="flex-1 px-6 py-6">
        <InvoiceForm />
      </div>
    </>
  );
}
