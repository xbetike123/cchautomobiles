import { Plus } from "lucide-react";
import Link from "next/link";

export function NewQuoteButton() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/admin/quotes/pre-sales/new" className="inline-flex items-center gap-1.5 rounded-full border border-cch-red bg-white px-4 py-2 text-[12.5px] font-semibold text-cch-red transition-colors hover:bg-cch-red/5">
        <Plus className="size-4" />Pre-sales booking
      </Link>
      <Link href="/admin/quotes/new" className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover">
        <Plus className="size-4" />Purchase quote
      </Link>
    </div>
  );
}
