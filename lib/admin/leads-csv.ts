import { LEAD_STATUS_LABEL } from "@/lib/admin/format";
import { LEAD_ROUTE_LABEL, type UnifiedLead } from "@/lib/admin/types";

export const LEADS_CSV_HEADER = [
  "Name",
  "Email",
  "WhatsApp",
  "Route",
  "Interest",
  "Destination",
  "Status",
  "Submitted",
] as const;

/** RFC 4180: wrap every field in quotes and double any embedded quote. */
function csvCell(value: string | null): string {
  const text = value ?? "";
  return `"${text.replaceAll('"', '""')}"`;
}

export function leadsToCsv(rows: UnifiedLead[]): string {
  const lines = [LEADS_CSV_HEADER.map(csvCell).join(",")];
  for (const lead of rows) {
    lines.push(
      [
        csvCell(lead.name),
        csvCell(lead.email),
        csvCell(lead.whatsapp),
        csvCell(LEAD_ROUTE_LABEL[lead.route]),
        csvCell(lead.detail),
        csvCell(lead.destination),
        csvCell(lead.status ? LEAD_STATUS_LABEL[lead.status] : null),
        csvCell(lead.createdAt),
      ].join(","),
    );
  }
  // Excel only decodes UTF-8 correctly when the byte-order mark is present.
  return `﻿${lines.join("\r\n")}`;
}

export function leadsCsvFilename(today: string): string {
  return `cch-leads-${today.slice(0, 10)}.csv`;
}
