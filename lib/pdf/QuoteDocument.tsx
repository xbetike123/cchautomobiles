import "server-only";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  // jsx-a11y/alt-text fires on the literal name `Image` because the rule
  // assumes the HTML img semantics. Alias so the React-PDF primitive is
  // recognised as something else.
  Image as PdfImage,
} from "@react-pdf/renderer";

import type { QuoteWithClient } from "@/lib/admin/queries/quotes";

const CCH_RED = "#e63946";
const CORPORATE_BLACK = "#0f172a";
const TEXT_SECONDARY = "#475569";
const TEXT_TERTIARY = "#94a3b8";
const HAIRLINE = "#e2e8f0";
const SURFACE_TINT = "#f7f7f9";

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
  logo: {
    width: 56,
    height: 56,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metaBlock: {
    flexDirection: "column",
    flexShrink: 1,
    maxWidth: "48%",
  },
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
  metaSecondary: {
    fontSize: 9,
    color: TEXT_SECONDARY,
    lineHeight: 1.4,
  },
  vehicleHero: {
    flexDirection: "row",
    gap: 18,
    padding: 16,
    backgroundColor: SURFACE_TINT,
    borderRadius: 8,
    marginBottom: 24,
  },
  vehiclePhoto: {
    width: 168,
    height: 105,
    borderRadius: 6,
    objectFit: "cover",
    backgroundColor: HAIRLINE,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: -8,
    marginBottom: 24,
  },
  galleryPhoto: {
    width: 120,
    height: 78,
    borderRadius: 4,
    objectFit: "cover",
    backgroundColor: HAIRLINE,
  },
  vehicleInfo: {
    flexShrink: 1,
    flexGrow: 1,
    justifyContent: "center",
  },
  vehicleEyebrow: {
    fontSize: 8,
    color: CCH_RED,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  vehicleName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: CORPORATE_BLACK,
    marginBottom: 4,
  },
  vehicleSub: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: CORPORATE_BLACK,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  lineItemsBlock: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 6,
    marginBottom: 20,
  },
  lineItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
  },
  lineItemLabel: {
    fontSize: 10,
    color: CORPORATE_BLACK,
  },
  lineItemValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: CORPORATE_BLACK,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: SURFACE_TINT,
  },
  totalLabel: {
    fontSize: 9,
    color: TEXT_TERTIARY,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: CCH_RED,
  },
  noteBlock: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 6,
    padding: 14,
    marginBottom: 22,
  },
  specsBlock: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 6,
    marginBottom: 22,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
  },
  specName: {
    fontSize: 9,
    color: TEXT_SECONDARY,
    width: "46%",
  },
  specValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: CORPORATE_BLACK,
    width: "50%",
    textAlign: "right",
  },
  noteText: {
    fontSize: 10,
    color: CORPORATE_BLACK,
    lineHeight: 1.55,
  },
  paymentAmount: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: CCH_RED,
    marginBottom: 8,
  },
  paymentAccount: {
    fontSize: 9.5,
    color: CORPORATE_BLACK,
    lineHeight: 1.5,
  },
  emptyNote: {
    fontSize: 10,
    color: TEXT_TERTIARY,
    fontStyle: "italic",
  },
  validityBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: SURFACE_TINT,
    borderRadius: 6,
    marginBottom: 36,
  },
  validityCell: {
    flexDirection: "column",
    flexShrink: 1,
  },
  footer: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 36,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerCol: {
    flexDirection: "column",
    flexShrink: 1,
    maxWidth: "33%",
  },
  footerLabel: {
    fontSize: 7,
    color: TEXT_TERTIARY,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  footerText: {
    fontSize: 8,
    color: TEXT_SECONDARY,
    lineHeight: 1.45,
  },
  pageNote: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 20,
    fontSize: 7,
    color: TEXT_TERTIARY,
    textAlign: "center",
  },
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatUsd(value: number): string {
  return usdFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

const COMPANY = {
  name: "CCH Automobile Co. Ltd",
  address: "101-103 Agile Time Mansion, Wehai Road, Shibi, Panyu District, Guangzhou, China",
  email: "hello@chinesecarshub.com",
  phone: "+86 131 0670 0341",
};

type Props = {
  quote: QuoteWithClient;
  logoSrc?: string | Buffer;
  photoSrcs?: (string | Buffer)[];
  // Optional manufacturer spec sheet (param name -> value), e.g. scraped from
  // carnewschina. Rendered as a "Specifications" section when present.
  specs?: Record<string, string> | null;
};

export function QuoteDocument({ quote, logoSrc, photoSrcs, specs }: Props) {
  const specEntries = specs
    ? Object.entries(specs).filter(
        ([, value]) => typeof value === "string" && value.trim().length > 0,
      )
    : [];
  const photos = photoSrcs ?? [];
  const heroPhoto = photos[0] ?? null;
  const galleryPhotos = photos.slice(1);
  const lineItems: Array<{ label: string; value: number }> = [
    { label: "Base price (FOB Guangzhou)", value: quote.basePriceUsd },
  ];
  if (quote.shippingUsd != null) {
    lineItems.push({
      label: "Ocean freight & insurance",
      value: quote.shippingUsd,
    });
  }
  if (quote.clearingUsd != null) {
    lineItems.push({
      label: "Port clearing (destination)",
      value: quote.clearingUsd,
    });
  }
  if (quote.purchaseTaxUsd > 0) {
    lineItems.push({ label: "Purchase tax", value: quote.purchaseTaxUsd });
  }
  lineItems.push({
    label: "Export licence",
    value: quote.serviceFeeUsd,
  });

  return (
    <Document
      title={`CCH Quote ${quote.id}`}
      author="CCH Automobile"
      subject={`Quote for ${quote.carName}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {logoSrc ? <PdfImage src={logoSrc} style={styles.logo} /> : null}
          </View>
        </View>

        <View style={styles.redRule} />

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Quote</Text>
            <Text style={styles.metaValue}>{quote.id.toUpperCase()}</Text>
            <Text style={styles.metaSecondary}>
              Issued {formatDate(quote.sentAt)}
            </Text>
          </View>
          <View style={[styles.metaBlock, { alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Prepared for</Text>
            <Text style={styles.metaValue}>{quote.clientName}</Text>
            {quote.clientWhatsapp ? (
              <Text style={styles.metaSecondary}>{quote.clientWhatsapp}</Text>
            ) : null}
            {quote.destinationCity ? (
              <Text style={styles.metaSecondary}>{quote.destinationCity}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.vehicleHero}>
          {heroPhoto ? (
            <PdfImage src={heroPhoto} style={styles.vehiclePhoto} />
          ) : (
            <View style={styles.vehiclePhoto} />
          )}
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleEyebrow}>Vehicle</Text>
            <Text style={styles.vehicleName}>{quote.carName}</Text>
            <Text style={styles.vehicleSub}>
              {quote.carYear} ·{" "}
              {quote.carCondition === "new"
                ? "New from factory"
                : "Used (first-owner)"}
            </Text>
            <Text style={styles.vehicleSub}>Lot reference {quote.carCode}</Text>
          </View>
        </View>

        {galleryPhotos.length > 0 ? (
          <View style={styles.gallery}>
            {galleryPhotos.map((src, i) => (
              <PdfImage
                key={i}
                src={src}
                style={styles.galleryPhoto}
              />
            ))}
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Price breakdown</Text>
        <View style={styles.lineItemsBlock}>
          {lineItems.map((line) => (
            <View key={line.label} style={styles.lineItemRow}>
              <Text style={styles.lineItemLabel}>{line.label}</Text>
              <Text style={styles.lineItemValue}>{formatUsd(line.value)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total cost</Text>
            <Text style={styles.totalValue}>{formatUsd(quote.totalUsd)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment details</Text>
        <View style={styles.noteBlock} wrap={false}>
          <Text style={styles.metaLabel}>
            {quote.paymentOption === "deposit"
              ? "60% deposit due"
              : "Full payment due"}
          </Text>
          <Text style={styles.paymentAmount}>
            {formatUsd(
              quote.paymentOption === "deposit"
                ? quote.totalUsd * 0.6
                : quote.totalUsd,
            )}
          </Text>
          {quote.accountInformation ? (
            <Text style={styles.paymentAccount}>
              {quote.accountInformation}
            </Text>
          ) : (
            <Text style={styles.emptyNote}>
              Account information will be provided separately.
            </Text>
          )}
        </View>

        {quote.personalNote ? (
          <>
            <Text style={styles.sectionTitle}>Note from the sourcing desk</Text>
            <View style={styles.noteBlock}>
              <Text style={styles.noteText}>{quote.personalNote}</Text>
            </View>
          </>
        ) : null}

        {specEntries.length > 0 ? (
          <>
            <Text style={styles.sectionTitle} break>
              Specifications
            </Text>
            <View style={styles.specsBlock}>
              {specEntries.map(([name, value]) => (
                <View key={name} style={styles.specRow} wrap={false}>
                  <Text style={styles.specName}>{name}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.validityBlock}>
          <View style={styles.validityCell}>
            <Text style={styles.metaLabel}>Valid until</Text>
            <Text style={styles.metaValue}>{formatDate(quote.validUntil)}</Text>
          </View>
          <View style={[styles.validityCell, { alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Quote status</Text>
            <Text style={styles.metaValue}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.footerLabel}>Issued by</Text>
            <Text style={styles.footerText}>{COMPANY.name}</Text>
            <Text style={styles.footerText}>{COMPANY.address}</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerLabel}>Contact</Text>
            <Text style={styles.footerText}>{COMPANY.email}</Text>
            <Text style={styles.footerText}>{COMPANY.phone}</Text>
          </View>
          <View style={[styles.footerCol, { alignItems: "flex-end" }]}>
            <Text style={styles.footerLabel}>Reference</Text>
            <Text style={styles.footerText}>{quote.id.toUpperCase()}</Text>
            <Text style={styles.footerText}>
              {quote.carCode} · {quote.carYear}
            </Text>
          </View>
        </View>

        <Text style={styles.pageNote} fixed>
          Prices are USD and valid until the date shown. Final invoice may
          adjust for FX, port handling, and destination duties not included
          in the breakdown above.
        </Text>
      </Page>
    </Document>
  );
}
