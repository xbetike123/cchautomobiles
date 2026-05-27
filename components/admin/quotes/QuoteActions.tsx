"use client";

import { Check, Download, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { QuoteStatus } from "@/lib/admin/types";

type Props = {
  quoteId: string;
  carName: string;
  status: QuoteStatus;
};

export function QuoteActions({ quoteId, carName, status }: Props) {
  const router = useRouter();

  const handleSend = () => {
    console.log("send quote", quoteId);
  };

  const handleMarkAccepted = () => {
    console.log("mark accepted", quoteId);
  };

  const handleDownload = () => {
    window.open(`/admin/quotes/${encodeURIComponent(quoteId)}/pdf`, "_blank");
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete the quote for ${carName}? This can't be undone.`)) {
      return;
    }
    console.log("delete quote", quoteId);
    router.push("/admin/quotes");
  };

  const canSend = status === "draft";
  const canMarkAccepted = status === "sent";

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
      {canMarkAccepted ? (
        <button
          type="button"
          onClick={handleMarkAccepted}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-[12.5px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <Check className="size-3.5" aria-hidden="true" />
          Mark accepted
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
