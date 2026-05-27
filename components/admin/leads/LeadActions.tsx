"use client";

import {
  ChevronDown,
  Send,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { LeadStatus } from "@/lib/admin/types";
import { LEAD_STATUS_LABEL } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

const STATUS_VALUES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "negotiating",
  "reserved",
  "closed_won",
  "closed_lost",
];

type Props = {
  leadId: string;
  leadName: string;
  status: LeadStatus;
};

export function LeadActions({ leadId, leadName, status }: Props) {
  const router = useRouter();

  const handleStatusChange = (next: LeadStatus) => {
    console.log("update lead status", { leadId, status: next });
  };

  const handleSendQuote = () => {
    router.push(`/admin/quotes/new?lead=${leadId}`);
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete the lead from ${leadName}? This can't be undone.`,
      )
    ) {
      return;
    }
    console.log("delete lead", leadId);
    router.push("/admin/leads");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleSendQuote}
        className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover"
      >
        <Send className="size-3.5" aria-hidden="true" />
        Send quote
      </button>
      <div className="relative inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-white px-3 text-[12.5px] font-medium text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors hover:bg-corporate-black/[0.04]">
        <UserCheck className="size-3.5 text-text-tertiary" aria-hidden="true" />
        <span>{LEAD_STATUS_LABEL[status]}</span>
        <ChevronDown
          className="ml-1 size-3.5 text-text-tertiary"
          aria-hidden="true"
        />
        <select
          aria-label="Change status"
          value={status}
          onChange={(event) =>
            handleStatusChange(event.target.value as LeadStatus)
          }
          className={cn(
            "absolute inset-0 cursor-pointer appearance-none rounded-full bg-transparent opacity-0",
          )}
        >
          {STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {LEAD_STATUS_LABEL[value]}
            </option>
          ))}
        </select>
      </div>
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
