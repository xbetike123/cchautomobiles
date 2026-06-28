"use client";

import { Check, Download, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { sendInvoiceToCustomer } from "@/app/admin/invoices/[invoiceNumber]/actions";
import type { InvoiceStatus } from "@/lib/admin/types";

type Props = {
  invoiceNumber: string;
  clientName: string;
  status: InvoiceStatus;
};

export function InvoiceActions({ invoiceNumber, clientName, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  const handleMarkPaid = () => {
    // Wire to server action.
    console.log("mark paid", invoiceNumber);
  };

  const handleSend = () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await sendInvoiceToCustomer(invoiceNumber);
      if (result.ok) {
        setFeedback({
          kind: "success",
          message: result.mocked
            ? `Mock send to ${result.toEmail} (Resend env not set).`
            : `Sent to ${result.toEmail}.`,
        });
      } else {
        setFeedback({ kind: "error", message: result.error });
      }
    });
  };

  const handleDownload = () => {
    window.open(
      `/admin/invoices/${encodeURIComponent(invoiceNumber)}/pdf`,
      "_blank",
    );
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
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="size-3.5" aria-hidden="true" />
          {pending ? "Sending…" : "Send"}
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
      {feedback ? (
        <span
          role={feedback.kind === "error" ? "alert" : "status"}
          className={
            "w-full text-[12px] " +
            (feedback.kind === "error"
              ? "text-cch-red"
              : "text-emerald-700")
          }
        >
          {feedback.message}
        </span>
      ) : null}
    </div>
  );
}
