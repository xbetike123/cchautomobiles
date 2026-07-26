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
import { QuoteContractPages } from "@/lib/pdf/QuoteContractPages";
import { PreSalesContractPages } from "@/lib/pdf/PreSalesContractPages";

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
  companyIdentity: {
    marginLeft: 12,
    justifyContent: "center",
  },
  companyTradingName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: CORPORATE_BLACK,
  },
  companyLegalName: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    marginTop: 3,
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

function formatQuoteNumber(id: string, issuedAt: string): string {
  const date = new Date(issuedAt);
  const datePart = Number.isNaN(date.getTime())
    ? "00000000"
    : date.toISOString().slice(0, 10).replaceAll("-", "");
  const idPart = id.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  return `CCH-Q-${datePart}-${idPart.padStart(6, "0")}`;
}

const COMPANY = {
  name: "CCH Automobile",
  legalName: "C/O Naiyuan Mart Co. Ltd",
  address: "101-103 Agile Time Mansion, Wehai Road, Shibi, Panyu District, Guangzhou, China",
  email: "hello@chinesecarshub.com",
  phone: "+86 131 0670 0341",
};

type Props = {
  quote: QuoteWithClient;
  logoSrc?: string | Buffer;
  photoSrcs?: (string | Buffer)[];
  vehiclePhotoSrcs?: (string | Buffer)[][];
  // Optional manufacturer spec sheet (param name -> value), e.g. scraped from
  // carnewschina. Rendered as a "Specifications" section when present.
  specs?: Record<string, string> | null;
};

export function QuoteDocument({ quote, logoSrc, photoSrcs, vehiclePhotoSrcs, specs }: Props) {
  const quoteNumber = formatQuoteNumber(quote.id, quote.sentAt);
  const specEntries = specs
    ? Object.entries(specs).filter(
        ([, value]) => typeof value === "string" && value.trim().length > 0,
      )
    : [];
  const photos = photoSrcs ?? [];
  const heroPhoto = photos[0] ?? null;
  const galleryPhotos = photos.slice(1);
  const vehicles = quote.vehicles?.length ? quote.vehicles : [{
    inventoryId: quote.inventoryId, carCode: quote.carCode, carName: quote.carName,
    carYear: quote.carYear, carCondition: quote.carCondition, photoUrls: quote.photoUrls,
    basePriceUsd: quote.basePriceUsd, shippingUsd: quote.shippingUsd,
    purchaseTaxUsd: quote.purchaseTaxUsd, clearingUsd: quote.clearingUsd,
    serviceFeeUsd: quote.serviceFeeUsd, totalUsd: quote.totalUsd,
  }];
  const lineItems: Array<{ label: string; value: number }> = [];
  for (const [index, vehicle] of vehicles.entries()) {
    const quantity = vehicle.quantity ?? 1;
    const prefix = vehicles.length > 1 ? `Car ${index + 1} · ${vehicle.carName}${quantity > 1 ? ` × ${quantity}` : ""} — ` : "";
    lineItems.push({ label: `${prefix}${quote.quoteKind === "pre_sales" ? "Booking Cost" : "FOB Guangzhou"}`, value: vehicle.basePriceUsd * quantity });
    if (vehicle.shippingUsd != null) lineItems.push({ label: `${prefix}Ocean freight & insurance`, value: vehicle.shippingUsd * quantity });
    if (vehicle.clearingUsd != null) lineItems.push({ label: `${prefix}Port clearing`, value: vehicle.clearingUsd * quantity });
    if (vehicle.purchaseTaxUsd > 0) lineItems.push({ label: `${prefix}Purchase tax`, value: vehicle.purchaseTaxUsd * quantity });
    lineItems.push({ label: `${prefix}Export licence`, value: vehicle.serviceFeeUsd * quantity });
  }

  return (
    <Document
      title={`CCH Quote ${quoteNumber}`}
      author="CCH Automobile"
      subject={`${quote.quoteKind === "pre_sales" ? "Pre-sales booking" : "Quote"} for ${quote.carName}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row" }}>
            {logoSrc ? <PdfImage src={logoSrc} style={styles.logo} /> : null}
            <View style={styles.companyIdentity}>
              <Text style={styles.companyTradingName}>{COMPANY.name}</Text>
              <Text style={styles.companyLegalName}>{COMPANY.legalName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.redRule} />

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Quote number</Text>
            <Text style={styles.metaValue}>{quoteNumber}</Text>
            <Text style={styles.metaSecondary}>
              Issued {formatDate(quote.sentAt)}
            </Text>
            <Text style={styles.metaSecondary}>
              Valid until {formatDate(quote.validUntil)}
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

        {vehicles.map((vehicle, index) => {
          const vehicleHeroPhoto = vehiclePhotoSrcs?.[index]?.[0] ?? (index === vehicles.length - 1 ? heroPhoto : null);
          return (
            <View key={`${vehicle.carCode}-${index}`} style={styles.vehicleHero} wrap={false}>
              {vehicleHeroPhoto ? (
                <PdfImage src={vehicleHeroPhoto} style={styles.vehiclePhoto} />
              ) : (
                <View style={styles.vehiclePhoto} />
              )}
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleEyebrow}>{vehicles.length > 1 ? `Vehicle ${index + 1}` : "Vehicle"}</Text>
                <Text style={styles.vehicleName}>{vehicle.carName}</Text>
                <Text style={styles.vehicleSub}>
                  {vehicle.carYear} · {vehicle.carCondition === "new" ? "New from factory" : "Used"}
                  {(vehicle.quantity ?? 1) > 1 ? ` · Quantity ${vehicle.quantity}` : ""}
                </Text>
                {vehicle.powertrain ? <Text style={styles.vehicleSub}>{vehicle.powertrain}</Text> : null}
                {vehicle.exteriorColor || vehicle.interiorColor ? (
                  <Text style={styles.vehicleSub}>
                    {[vehicle.exteriorColor && `Exterior: ${vehicle.exteriorColor}`, vehicle.interiorColor && `Interior: ${vehicle.interiorColor}`].filter(Boolean).join(" · ")}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}

        {vehicles.length === 1 && galleryPhotos.length > 0 ? (
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

        <Text style={styles.sectionTitle}>{quote.quoteKind === "pre_sales" ? "Booking payment" : "Payment details"}</Text>
        <View style={styles.noteBlock} wrap={false}>
          {quote.quoteKind === "pre_sales" || quote.paymentOption === "local_payment" ? <>
            <Text style={styles.metaLabel}>{quote.quoteKind === "pre_sales" ? "Booking amount due" : "Local payment due"}</Text>
            <Text style={styles.paymentAmount}>{quote.bookingCurrency || "LOCAL"} {quote.bookingAmountLocal?.toLocaleString("en-US") ?? "—"}</Text>
            <Text style={styles.paymentAccount}>Account number: {quote.bookingAccountNumber || "—"}</Text>
          </> : <><Text style={styles.metaLabel}>
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
          </>}
        </View>

        {quote.personalNote ? (
          <>
            <Text style={styles.sectionTitle}>Purchase Terms</Text>
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

      </Page>
      {quote.quoteKind === "pre_sales" ? <PreSalesContractPages quote={quote} vehicles={vehicles} /> : <QuoteContractPages quote={quote} vehicles={vehicles} />}
    </Document>
  );
}
