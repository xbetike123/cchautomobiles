import "server-only";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PdfImage,
} from "@react-pdf/renderer";

import type { Invoice } from "@/lib/admin/types";

const CCH_RED = "#e63946";
const CORPORATE_BLACK = "#0f172a";
const TEXT_SECONDARY = "#475569";
const TEXT_TERTIARY = "#94a3b8";
const HAIRLINE = "#e2e8f0";
const SURFACE_TINT = "#f7f7f9";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Standard Helvetica doesn't include the Naira glyph (₦), so we prefix the
// NGN amounts with the ISO code in the PDF rather than the symbol.
const ngn = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

function kindLabel(kind: Invoice["kind"]): string {
  if (kind === "deposit") return "Deposit invoice";
  if (kind === "balance") return "Balance invoice";
  return "Invoice";
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingHorizontal: 48,
    paddingBottom: 64,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: CORPORATE_BLACK,
    backgroundColor: "#ffffff",
  },
  redRule: {
    height: 3,
    backgroundColor: CCH_RED,
    width: 64,
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  logo: { width: 56, height: 56 },
  brandBlock: { flexDirection: "column", alignItems: "flex-end" },
  brandWordmark: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    letterSpacing: 0.4,
    color: CORPORATE_BLACK,
  },
  brandSub: {
    fontSize: 8,
    color: TEXT_TERTIARY,
    marginTop: 3,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metaBlock: { flexDirection: "column", flexShrink: 1, maxWidth: "48%" },
  metaLabel: {
    fontSize: 8,
    color: TEXT_TERTIARY,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: CORPORATE_BLACK,
    marginBottom: 2,
  },
  metaSecondary: { fontSize: 9, color: TEXT_SECONDARY, lineHeight: 1.4 },
  amountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: SURFACE_TINT,
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 8,
    color: TEXT_TERTIARY,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  amountValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    color: CCH_RED,
  },
  amountNgn: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: CORPORATE_BLACK,
    marginTop: 4,
  },
  amountDescription: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: CORPORATE_BLACK,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  block: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
  },
  rowKv: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
  },
  rowKvLast: { borderBottomWidth: 0 },
  rowKvLabel: { fontSize: 10, color: TEXT_SECONDARY },
  rowKvValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: CORPORATE_BLACK,
  },
  bankRow: { flexDirection: "row", marginBottom: 10 },
  bankCol: { flex: 1, paddingRight: 12 },
  bankCurrency: {
    fontSize: 8,
    color: TEXT_TERTIARY,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bankName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: CORPORATE_BLACK,
    marginBottom: 2,
  },
  bankLine: { fontSize: 9, color: TEXT_SECONDARY, lineHeight: 1.45 },
  notesBox: {
    backgroundColor: "#fde8ea",
    borderLeftWidth: 3,
    borderLeftColor: CCH_RED,
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 8,
    color: CCH_RED,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  notesText: { fontSize: 10, color: CORPORATE_BLACK, lineHeight: 1.5 },
  footer: { borderTopWidth: 1, borderTopColor: HAIRLINE, paddingTop: 14 },
  footerText: { fontSize: 8.5, color: TEXT_TERTIARY, lineHeight: 1.5 },
});

// Hardcoded for now; mirrors the same constant in the invoice detail page so
// the PDF and the web view stay in sync. Move to /admin/settings once wired.
const BANK_ACCOUNTS: {
  currency: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swift: string;
}[] = [
  {
    currency: "USD",
    bankName: "Bank of China · Guangzhou",
    accountName: "Naiyuan Mart Ltd.",
    accountNumber: "XXXX-XXXX-XXXX-XXXX",
    swift: "BKCHCNBJ",
  },
  {
    currency: "NGN",
    bankName: "Guaranty Trust Bank",
    accountName: "Naiyuan Mart Ltd.",
    accountNumber: "0000000000",
    swift: "GTBINGLA",
  },
];

const CCH_ADDRESS_LINES = [
  "CCH Automobile · Naiyuan Mart Ltd.",
  "101-103 Agile Time Mansion, Wehai Road",
  "Shibi, Panyu District, Guangzhou, China",
  "hello@chinesecarshub.com · +86 131 0670 0341",
];

type Props = {
  invoice: Invoice;
  logoSrc?: Buffer;
};

export function InvoiceDocument({ invoice, logoSrc }: Props) {
  const kind = kindLabel(invoice.kind);
  const fxRate = invoice.exchangeRateNgn;
  const amountNgn =
    fxRate != null ? Math.round(invoice.amountUsd * fxRate) : null;

  return (
    <Document
      title={`CCH Invoice ${invoice.invoiceNumber}`}
      author="CCH Automobile"
      subject={`Invoice ${invoice.invoiceNumber}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.redRule} />

        <View style={styles.header}>
          {logoSrc ? (
            <PdfImage src={logoSrc} style={styles.logo} />
          ) : (
            <View style={styles.logo} />
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>{kind}</Text>
            <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
            <Text style={styles.metaSecondary}>
              Issued {formatDate(invoice.issuedAt)}
            </Text>
            <Text style={styles.metaSecondary}>
              Due {formatDate(invoice.dueAt)}
            </Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Billed to</Text>
            <Text style={styles.metaValue}>{invoice.clientName}</Text>
            {invoice.clientEmail ? (
              <Text style={styles.metaSecondary}>{invoice.clientEmail}</Text>
            ) : null}
            {invoice.carDescription ? (
              <Text style={styles.metaSecondary}>{invoice.carDescription}</Text>
            ) : null}
            {invoice.carCode ? (
              <Text style={styles.metaSecondary}>
                Car code {invoice.carCode}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.amountCard}>
          <View>
            <Text style={styles.amountLabel}>Amount due</Text>
            <Text style={styles.amountValue}>
              {usd.format(invoice.amountUsd)}
            </Text>
            {amountNgn != null ? (
              <Text style={styles.amountNgn}>
                ≈ NGN {ngn.format(amountNgn)}
              </Text>
            ) : null}
            <Text style={styles.amountDescription}>
              USD · {kind.toLowerCase()}
              {fxRate != null ? ` · 1 USD = NGN ${ngn.format(fxRate)}` : ""}
            </Text>
          </View>
          <View>
            <Text style={styles.amountLabel}>Status</Text>
            <Text style={styles.metaValue}>
              {invoice.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment methods</Text>
        <View style={styles.block}>
          {BANK_ACCOUNTS.map((acct, idx) => (
            <View
              key={acct.currency}
              style={idx > 0 ? { marginTop: 10 } : undefined}
            >
              <Text style={styles.bankCurrency}>{acct.currency} wires</Text>
              <Text style={styles.bankName}>{acct.bankName}</Text>
              <Text style={styles.bankLine}>{acct.accountName}</Text>
              <Text style={styles.bankLine}>
                Account: {acct.accountNumber}
              </Text>
              <Text style={styles.bankLine}>SWIFT: {acct.swift}</Text>
            </View>
          ))}
        </View>

        {invoice.notes ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Purchase Terms</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          {CCH_ADDRESS_LINES.map((line) => (
            <Text key={line} style={styles.footerText}>
              {line}
            </Text>
          ))}
          <Text style={[styles.footerText, { marginTop: 8 }]}>
            Reply to this invoice on WhatsApp once payment is on the way and
            we&apos;ll mark it as paid. Thank you for choosing CCH Automobile.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
