import "server-only";

import path from "node:path";
import { Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import type { QuoteVehicle } from "@/lib/admin/types";

Font.register({ family: "NotoSansCJK", src: path.join(process.cwd(), "public/fonts/NotoSansCJKsc-Regular.otf") });

const RED = "#e63946";
const styles = StyleSheet.create({
  page: { padding: 44, paddingBottom: 54, fontFamily: "NotoSansCJK", fontSize: 9, color: "#0f172a", lineHeight: 1.55 },
  title: { fontSize: 18, marginBottom: 3 }, subtitle: { fontSize: 13, color: RED, marginBottom: 20 },
  heading: { fontSize: 11, marginTop: 12, marginBottom: 7, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#dbe2ea" },
  row: { flexDirection: "row", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0" },
  label: { width: "40%", color: "#64748b" }, value: { width: "60%" },
  car: { padding: 10, marginBottom: 7, backgroundColor: "#f7f7f9", borderLeftWidth: 3, borderLeftColor: RED },
  bullet: { marginBottom: 5, paddingLeft: 8 },
  amount: { padding: 14, marginVertical: 12, backgroundColor: "#0f172a", color: "#fff" },
  amountLabel: { fontSize: 8, color: "#cbd5e1" }, amountValue: { fontSize: 18, marginTop: 4 },
  signatures: { flexDirection: "row", gap: 28, marginTop: 28 }, signature: { width: "48%", minHeight: 90, borderTopWidth: 1, borderTopColor: "#94a3b8", paddingTop: 7 },
  footer: { position: "absolute", bottom: 22, left: 44, right: 44, borderTopWidth: 1, borderTopColor: "#dbe2ea", paddingTop: 8, flexDirection: "row", justifyContent: "space-between", fontSize: 6.5, color: "#64748b" },
});

const localNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
function Row({ label, value }: { label: string; value?: string | null }) { return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value || "—"}</Text></View>; }
function Footer({ quote }: { quote: QuoteWithClient }) { return <View style={styles.footer}><View><Text>CCH Automobile</Text><Text>C/O Naiyuan Mart Co. Ltd</Text></View><View><Text>hello@chinesecarshub.com</Text><Text>+86 131 0670 0341</Text></View><View><Text>Agreement / 协议编号</Text><Text>{quote.id}</Text></View></View>; }

export function PreSalesContractPages({ quote, vehicles }: { quote: QuoteWithClient; vehicles: QuoteVehicle[] }) {
  const currency = quote.bookingCurrency || "LOCAL";
  const amount = quote.bookingAmountLocal == null ? "—" : `${currency} ${localNumber.format(quote.bookingAmountLocal)}`;
  return <>
    <Page size="A4" style={styles.page}>
      <Text style={styles.subtitle}>Pre-Sales Booking Quote & Reservation Agreement / 预售订购报价及预订协议</Text>
      <Text style={styles.heading}>1. Customer Information / 一、客户信息</Text>
      <Row label="Name / 姓名" value={quote.clientName} /><Row label="Phone / 电话" value={quote.clientWhatsapp} /><Row label="Destination / 目的地" value={quote.destinationCity} />
      <Text style={styles.heading}>2. Vehicles Reserved / 二、预订车辆</Text>
      {vehicles.map((car, index) => <View key={`${car.carCode}-${index}`} style={styles.car} wrap={false}><Text>{index + 1}. {car.carName}</Text><Text>{car.carYear} · {car.carCondition === "new" ? "New / 新车" : "Used / 二手车"} · Qty {car.quantity ?? 1}</Text>{car.powertrain ? <Text>{car.powertrain}</Text> : null}{car.exteriorColor || car.interiorColor ? <Text>{[car.exteriorColor, car.interiorColor].filter(Boolean).join(" / ")}</Text> : null}</View>)}
      <Text style={styles.heading}>3. Booking Payment / 三、预订付款</Text>
      <Row label="Receiving account / 收款账号" value={quote.bookingAccountNumber} />
      <View style={styles.amount}><Text style={styles.amountLabel}>BOOKING AMOUNT DUE / 应付预订金额</Text><Text style={styles.amountValue}>{amount}</Text></View>
      <Text>The booking payment secures the customer’s place in the allocation queue for the vehicle(s) listed above. / 预订款用于锁定上述车辆的配额排队顺位。</Text>
      <Text style={styles.heading}>4. Estimated Vehicle Value / 四、车辆预估价值</Text>
      <Row label="Estimated total (USD) / 预估总价（美元）" value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(quote.totalUsd)} />
      <Text>This is an estimate and not the final commercial invoice. / 此金额为预估价，并非最终商业发票。</Text>
    </Page>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>5. Pre-Sales Terms / 五、预售条款</Text>
      {["Vehicle pricing, specifications, colours and availability remain subject to manufacturer confirmation. / 车辆价格、配置、颜色及供应情况以厂家最终确认为准。","The booking amount will be credited toward the final vehicle payment unless otherwise agreed in writing. / 除非另有书面约定，预订款将抵扣最终车款。","CCH Automobile will notify the customer when allocation, production or procurement is confirmed. / 配额、生产或采购确认后，CCH Automobile 将通知客户。","The final balance and payment schedule will be stated in the final purchase agreement and commercial invoice. / 最终余款及付款安排以正式采购协议和商业发票为准。","Estimated launch, production and delivery dates may change due to the manufacturer, shipping, customs or force majeure. / 预计上市、生产及交付日期可能因厂家、运输、海关或不可抗力调整。","Cancellation and refund eligibility must follow the written booking terms agreed with the customer. / 取消及退款资格以双方书面确认的预订条款为准。"].map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>)}
      <Text style={styles.heading}>6. Customer Protection / 六、客户保障</Text>
      {["Written confirmation of the vehicle reservation. / 提供车辆预订书面确认。","Regular allocation and procurement updates. / 定期提供配额及采购进度。","Final specification and price confirmation before balance payment. / 支付余款前确认最终配置及价格。","VIN, photos, video and inspection information when the actual vehicle becomes available. / 实车到位后提供VIN、照片、视频及验车信息。","Dedicated shipment and after-sales support. / 提供专属运输及售后支持。"].map((item) => <Text key={item} style={styles.bullet}>✓ {item}</Text>)}
      <Text style={styles.heading}>7. Acceptance / 七、双方确认</Text>
      <Text>By signing, both parties acknowledge this pre-sales booking and the terms above. / 双方签字即确认本预售订购及上述条款。</Text>
      <View style={styles.signatures}><View style={styles.signature}><Text>Customer / 客户</Text><Text>Name / 姓名: {quote.clientName}</Text><Text>Signature / 签字:</Text><Text>Date / 日期:</Text></View><View style={styles.signature}><Text>Seller / 卖方</Text><Text>CCH Automobile</Text><Text>C/O Naiyuan Mart Co. Ltd</Text><Text>Signature & stamp / 签字及盖章:</Text><Text>Date / 日期:</Text></View></View>
      <Footer quote={quote} />
    </Page>
  </>;
}
