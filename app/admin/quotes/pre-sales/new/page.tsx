import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { QuoteBuilder } from "@/components/admin/quotes/QuoteBuilder";
import { listParentCompanies } from "@/lib/admin/queries/companies";
import { getInventory } from "@/lib/admin/queries/inventory";
import { getLeadById, listLeads } from "@/lib/admin/queries/leads";

type RawSearchParams = { [key: string]: string | string[] | undefined };
type PageProps = { searchParams: Promise<RawSearchParams> };

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewPreSalesQuotePage({ searchParams }: PageProps) {
  const leadId = asString((await searchParams).lead);
  const [leads, inventory, initialLead, parentCompanies] = await Promise.all([
    listLeads(),
    getInventory(),
    leadId ? getLeadById(leadId) : null,
    listParentCompanies(),
  ]);
  const initialInventory = initialLead?.carCode
    ? inventory.find((item) => item.carCode === initialLead.carCode) ?? null
    : null;

  return <>
    <AdminHeader
      eyebrow="Pre-sales"
      title="Build a pre-sales booking quote"
      description="Reserve one or more vehicles and collect the local-currency booking payment."
      actions={<Link href="/admin/quotes" className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-text-secondary transition-colors hover:bg-surface-tint hover:text-corporate-black"><ArrowLeft className="size-3.5" />Back to quotes</Link>}
    />
    <div className="flex-1 px-6 py-6">
      <QuoteBuilder initialLead={initialLead} initialInventory={initialInventory} leads={leads} inventory={inventory} parentCompanies={parentCompanies} initialQuoteKind="pre_sales" />
    </div>
  </>;
}
