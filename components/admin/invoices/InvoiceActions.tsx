"use client";

import { Check, Download, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { InvoiceStatus } from "@/lib/admin/types";

type Props = {
  invoiceNumber: string;
  clientName: string;
  status: InvoiceStatus;
};

export function InvoiceActions({ invoiceNumber, clientName, status }: Props) {
  const router = useRouter();

  const handleMarkPaid = () => {
    // Wire to server action.
    console.log("mark paid", invoiceNumber);
  };

  const handleSend = () => {
    console.log("send invoice", invoiceNumber);
  };

  const handleDownload = () => {
    console.log("download invoice pdf", invoiceNumber);
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete ${invoiceNumber} (${clientName})? This can't be undone.`,
      )
    ) {
      return;
    }
    console.log("delete invoice", invoiceNumber);
    router.push("/admin/invoices");
  };

  const canMarkPaid = status === "sent" || status === "overdue";
  const canSend = status === "draft";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canSend ? (
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover"
        >
          <Send className="size-3.5" aria-hidden="true" />
          Send
        </button>
      ) : null}
      {canMarkPaid ? (
        <button
          type="button"
          onClick={handleMarkPaid}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-[12.5px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <Check className="size-3.5" aria-hidden="true" />
          Mark paid
        </button>
      ) : null}
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
      >
        <Download className="size-3.5" aria-hidden="true" />
        PDF
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex items-center gap-1.5 rounded-full border border-cch-red/40 bg-white px-3.5 py-2 text-[12.5px] font-medium text-cch-red transition-colors hover:bg-cch-red hover:text-white"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete
      </button>
    </div>
  );
}
