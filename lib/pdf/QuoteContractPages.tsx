import "server-only";

import path from "node:path";

import { Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { formatCareOf } from "@/lib/admin/parent-company";
import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import type { QuoteVehicle } from "@/lib/admin/types";

Font.register({
  family: "NotoSansCJK",
  src: path.join(process.cwd(), "public/fonts/NotoSansCJKsc-Regular.otf"),
});

const RED = "#e63946";
const INK = "#0f172a";
const MUTED = "#475569";
const LINE = "#dbe2ea";
const TINT = "#f7f7f9";

const styles = StyleSheet.create({
  page: { paddingTop: 42, paddingHorizontal: 38, paddingBottom: 48, fontFamily: "NotoSansCJK", fontSize: 8.2, color: INK, lineHeight: 1.45 },
  title: { fontSize: 18, color: INK, marginBottom: 2 },
  subtitle: { fontSize: 13, color: RED, marginBottom: 18 },
  section: { marginBottom: 13 },
  heading: { fontSize: 11, color: INK, marginBottom: 7, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: LINE },
  row: { flexDirection: "row", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: LINE },
  label: { width: "38%", color: MUTED },
  value: { width: "62%", color: INK },
  body: { color: MUTED, marginBottom: 5 },
  bullet: { color: INK, marginBottom: 3, paddingLeft: 8 },
  table: { borderWidth: 1, borderColor: LINE, marginBottom: 10 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE, minHeight: 28 },
  tableHead: { backgroundColor: TINT },
  cell: { paddingHorizontal: 3, paddingVertical: 5, borderRightWidth: 0.5, borderRightColor: LINE, justifyContent: "center" },
  number: { width: "5%" }, model: { width: "19%" }, year: { width: "7%" }, power: { width: "12%" }, colour: { width: "11%" }, vin: { width: "12%" }, qty: { width: "5%" }, price: { width: "14%" }, total: { width: "15%", borderRightWidth: 0 },
  small: { fontSize: 6.5, lineHeight: 1.25 },
  summary: { width: "58%", marginLeft: "42%", borderWidth: 1, borderColor: LINE },
  totalRow: { flexDirection: "row", justifyContent: "space-between", padding: 7, backgroundColor: RED, color: "#fff" },
  signatureRow: { flexDirection: "row", gap: 28, marginTop: 18 },
  signature: { width: "48%", minHeight: 90, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 7 },
  footer: { position: "absolute", left: 38, right: 38, bottom: 22, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8, flexDirection: "row", justifyContent: "space-between", color: "#64748b" },
  footerCol: { width: "32%", fontSize: 6.5, lineHeight: 1.4 },
});

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Section({ number, title, chinese, children }: { number: number; title: string; chinese: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.heading}>{number}. {title} / {chinese}</Text>{children}</View>;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value || "—"}</Text></View>;
}

function Bullets({ items }: { items: string[] }) {
  return <View>{items.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>)}</View>;
}

function PageFooter({ quote }: { quote: QuoteWithClient }) {
  return <View style={styles.footer}><View style={styles.footerCol}><Text>CCH Automobile</Text><Text>{formatCareOf(quote.parentCompany)}</Text><Text>Guangzhou, China</Text></View><View style={styles.footerCol}><Text>hello@chinesecarshub.com</Text><Text>+86 131 0670 0341</Text></View><View style={[styles.footerCol, { textAlign: "right" }]}><Text>Agreement / 协议编号</Text><Text>{quote.id}</Text></View></View>;
}

export function QuoteContractPages({ quote, vehicles }: { quote: QuoteWithClient; vehicles: QuoteVehicle[] }) {
  const vehicleBase = vehicles.reduce((sum, car) => sum + car.basePriceUsd * (car.quantity ?? 1), 0);
  const shipping = vehicles.reduce((sum, car) => sum + (car.shippingUsd ?? 0) * (car.quantity ?? 1), 0);
  const documentation = vehicles.reduce((sum, car) => sum + car.serviceFeeUsd * (car.quantity ?? 1), 0);
  const other = vehicles.reduce((sum, car) => sum + (car.purchaseTaxUsd + (car.clearingUsd ?? 0)) * (car.quantity ?? 1), 0);
  return <>
    <Page size="A4" style={styles.page}>
      <Text style={styles.subtitle}>Vehicle Purchase Agreement & Commercial Invoice / 车辆采购协议及商业发票</Text>
      <Section number={1} title="Seller Information" chinese="一、卖方信息">
        <InfoRow label="Seller / 卖方" value="CCH Automobile" />
        <InfoRow label="Company / 公司名称" value={formatCareOf(quote.parentCompany)} />
        <InfoRow label="Address / 地址" value="Guangzhou, China / 中国广州" />
        <InfoRow label="Phone / 电话 · WhatsApp" value="+86 131 0670 0341" />
        <InfoRow label="Email / 邮箱" value="hello@chinesecarshub.com" />
        <InfoRow label="Account Details / 收款账户信息" value={quote.accountInformation} />
        {quote.paymentOption === "local_payment" ? <><InfoRow label="Local account / 本地收款账号" value={quote.bookingAccountNumber} /><InfoRow label="Local amount / 本地货币金额" value={quote.bookingAmountLocal == null ? null : `${quote.bookingCurrency || "LOCAL"} ${quote.bookingAmountLocal.toLocaleString("en-US")}`} /></> : null}
      </Section>
      <Section number={2} title="Buyer Information" chinese="二、买方信息">
        <InfoRow label="Name / 姓名" value={quote.clientName} />
        <InfoRow label="Country / 国家" value={quote.destinationCity} />
        <InfoRow label="Delivery Address / 收货地址" value={quote.destinationCity} />
        <InfoRow label="Phone / 电话" value={quote.clientWhatsapp} />
        <InfoRow label="Company / 公司名称" />
        <InfoRow label="Email / 邮箱" />
        <InfoRow label="Passport / ID (Optional) / 护照或身份证（可选）" />
      </Section>
      <Section number={3} title="Vehicle Order Details" chinese="三、车辆订购信息">
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHead]}>
            {[["No.\n编号",styles.number],["Vehicle Model\n车型",styles.model],["Year\n年款",styles.year],["Powertrain\n动力类型",styles.power],["Ext./Int. Colour\n外观/内饰颜色",styles.colour],["VIN\n车架号",styles.vin],["Qty\n数量",styles.qty],["Unit Price\n单价",styles.price],["Total USD\n总价",styles.total]].map(([text, style]) => <View key={text as string} style={[styles.cell, style as never]}><Text style={styles.small}>{text as string}</Text></View>)}
          </View>
          {vehicles.map((car, index) => <View key={`${car.carCode}-${index}`} style={styles.tableRow} wrap={false}>
            <View style={[styles.cell,styles.number]}><Text>{index + 1}</Text></View><View style={[styles.cell,styles.model]}><Text>{car.carName}</Text></View><View style={[styles.cell,styles.year]}><Text>{car.carYear}</Text></View><View style={[styles.cell,styles.power]}><Text>{car.powertrain || (car.carCondition === "new" ? "New / 新车" : "Used / 二手车")}</Text></View><View style={[styles.cell,styles.colour]}><Text>{[car.exteriorColor, car.interiorColor].filter(Boolean).join(" / ") || "—"}</Text></View><View style={[styles.cell,styles.vin]}><Text>{car.vin || "—"}</Text></View><View style={[styles.cell,styles.qty]}><Text>{car.quantity ?? 1}</Text></View><View style={[styles.cell,styles.price]}><Text>{money.format(car.basePriceUsd)}</Text></View><View style={[styles.cell,styles.total]}><Text>{money.format(car.totalUsd)}</Text></View>
          </View>)}
        </View>
        <View style={styles.summary}>
          <InfoRow label="Vehicle Total / 车辆总价" value={money.format(vehicleBase)} /><InfoRow label="Shipping / 运费" value={money.format(shipping)} /><InfoRow label="Insurance / 保险费" /><InfoRow label="Documentation / 文件费" value={money.format(documentation)} /><InfoRow label="Inspection Fee / 验车费用" /><InfoRow label="Other Charges / 其他费用" value={money.format(other)} />
          <View style={styles.totalRow}><Text>GRAND TOTAL / 总金额（美元）</Text><Text>{money.format(quote.totalUsd)}</Text></View>
        </View>
      </Section>
    </Page>

    <Page size="A4" style={styles.page}>
      <Section number={4} title="Vehicle Specifications" chinese="四、车辆配置参数">
        {vehicles.map((car, index) => <View key={`${car.carCode}-${index}`} wrap={false} style={{ marginBottom: 8 }}><InfoRow label={`Vehicle ${index + 1} / 车型`} value={car.carName} /><InfoRow label="Year & condition / 年款及状况" value={`${car.carYear} · ${car.carCondition === "new" ? "New / 新车" : "Used / 二手车"}`} /><InfoRow label="Reference / 车辆编号" value={car.carCode} /><InfoRow label="Battery · Drive · Power · Range / 电池·驱动·功率·续航" value="As confirmed in quotation/specification sheet / 以报价及配置表为准" /><InfoRow label="Warranty / 质保" value="Manufacturer warranty where applicable / 适用时按原厂质保" /></View>)}
      </Section>
      <Section number={5} title="Payment Terms" chinese="五、付款条款"><Text style={styles.body}>The buyer agrees to purchase the above vehicle(s) under the following terms. / 买方同意按照以下条款购买上述车辆：</Text><Bullets items={["30% deposit is required to confirm the order. / 支付30%订金确认订单。","Production or procurement begins immediately after receipt of deposit. / 收到订金后立即安排采购或生产。","Remaining 70% is payable after inspection, VIN verification, photos/videos and buyer approval. / 验车、VIN核验、照片视频及买方确认后支付余款70%。","Shipment commences only after full payment has been received. / 收到全部货款后方可安排发货。"]} /></Section>
      <Section number={6} title="Vehicle Condition" chinese="六、车辆状况说明"><Text style={styles.body}>CCH Automobile guarantees that each supplied vehicle will: / CCH Automobile 保证所提供车辆：</Text><Bullets items={["Be genuine, authentic and legally exportable from China. / 车辆真实合法并符合中国出口规定。","Be free from undisclosed major accident, flood, fire or structural chassis damage. / 无隐瞒重大事故、水泡、火烧或车架结构性损坏。","Have no hidden major mechanical defects and match agreed specifications/options. / 无重大机械隐患，配置及选装符合约定。","Be professionally inspected before export. / 出口前完成专业检测。","Used vehicles: mileage is accurately disclosed and a full inspection report is provided. / 二手车真实披露里程并提供完整验车报告。"]} /></Section>
      <Section number={7} title="Inspection Process" chinese="七、车辆检测流程"><Bullets items={["Exterior, interior and undercarriage inspection / 外观、内饰及底盘检测","Battery health and charging test (EV) / 新能源车辆电池健康及充电检测","Suspension, tires and electronics inspection / 悬挂、轮胎及电器系统检测","Road test where applicable / 适用情况下进行路试","High-resolution photos and HD walkaround video / 高清照片及高清验车视频"]} /></Section>
      <Section number={8} title="Shipping Terms" chinese="八、运输条款"><InfoRow label="Mode / 运输方式" value="Sea Freight / 海运" /><InfoRow label="Origin Port / 起运港" value="Nansha, China / 中国南沙港" /><InfoRow label="Destination Port / 目的港" value="To be confirmed / 待确认" /><InfoRow label="Incoterms / 国际贸易条款" value="FOB / CIF / CFR — as stated in final invoice / 以最终发票为准" /><Text style={styles.body}>Estimated shipping time will be confirmed after vessel booking. Timing may vary due to customs, weather, vessel schedules or force majeure. / 预计运输时间将在订舱后确认，可能因清关、天气、船期或不可抗力调整。</Text></Section>
    </Page>

    <Page size="A4" style={styles.page}>
      <Section number={9} title="Documents Supplied" chinese="九、卖方提供文件"><Bullets items={["Commercial invoice and sales agreement / 商业发票及销售合同","Packing list and bill of lading / 装箱单及提单","Certificate of origin and export customs declaration / 原产地证及出口报关资料","Vehicle inspection report, photos and videos / 验车报告、车辆照片及视频","Manufacturer documentation and user manual where available / 原厂资料及使用说明书（如有）"]} /></Section>
      <Section number={10} title="Warranty" chinese="十、质量保证"><Text style={styles.body}>Brand new vehicles: manufacturer warranty applies according to manufacturer policy and may differ by destination. / 新车按照厂家官方质保政策执行，因品牌及出口国家而异。</Text><Text style={styles.body}>Used vehicles: supplied after inspection and verification; wear-and-tear items are excluded. Any applicable warranty is stated in the quotation. / 二手车经检测核验后交付，正常损耗件不在质保范围；如有质保，以报价单为准。</Text></Section>
      <Section number={11} title="Warranty Exclusions" chinese="十一、质保免责条款"><Bullets items={["Improper maintenance, unauthorized modifications or negligence / 保养不当、非授权改装或人为疏忽","Accident, flood, fire, racing or natural disaster / 事故、水泡、火烧、竞技用途或自然灾害","Improper charging / 错误充电","Normal wear items including tires, brake pads, wiper blades and consumables / 轮胎、刹车片、雨刷及耗材等正常损耗件"]} /></Section>
      <Section number={12} title="Delivery Process" chinese="十二、交付流程"><Bullets items={["Vehicle inspection and export documentation / 车辆检测及出口资料准备","Customs declaration, container booking and vessel loading / 出口报关、订舱及装船","Bill of lading and shipment tracking / 签发提单及物流跟踪","Arrival notification, customs assistance and final delivery / 到港通知、协助清关及最终交付"]} /></Section>
      <Section number={13} title="Additional Services Included" chinese="十三、增值服务"><Bullets items={["Professional sourcing, factory verification and independent inspection / 专业采购、工厂审核及第三方验车","Negotiation, export documentation and shipping coordination / 商务谈判、出口资料及国际物流协调","Purchase updates, pre-shipment photos and HD videos / 采购进度、发货前照片及高清视频","After-sales support, spare-parts sourcing and technical consultation / 售后、配件采购及技术咨询"]} /></Section>
      <Section number={14} title="Force Majeure" chinese="十四、不可抗力"><Text style={styles.body}>Neither party shall be liable for delays beyond reasonable control, including government regulations, natural disasters, port congestion, strikes, vessel delays, customs inspections, pandemics or war. / 因政府政策、自然灾害、港口拥堵、罢工、船期延误、海关检查、疫情、战争等不可抗力导致的延误，双方均不承担违约责任。</Text></Section>
    </Page>

    <Page size="A4" style={styles.page}>
      <Section number={15} title="Acceptance" chinese="十五、双方确认"><Text style={styles.body}>By signing, both parties confirm the vehicle order details and agree to this agreement. / 双方签字即确认车辆订单信息并同意本协议。</Text><View style={styles.signatureRow}><View style={styles.signature}><Text>Buyer / 买方</Text><Text style={styles.body}>Name / 姓名: {quote.clientName}</Text><Text style={styles.body}>Signature / 签字:</Text><Text style={styles.body}>Date / 日期:</Text></View><View style={styles.signature}><Text>Seller / 卖方</Text><Text style={styles.body}>Representative / 卖方代表:</Text><Text style={styles.body}>Signature & company stamp / 签字及公司盖章:</Text><Text style={styles.body}>Date / 日期:</Text></View></View></Section>
      <Section number={16} title="CCH Automobile Purchase Protection" chinese="十六、CCH Automobile 购车保障"><Text style={styles.body}>Every vehicle purchased through CCH Automobile includes / 凡通过 CCH Automobile 购买的车辆均享有：</Text><Bullets items={["Full vehicle verification before balance payment. / 尾款支付前完成车辆全面核验。","High-resolution actual-vehicle photos and HD inspection videos. / 提供车辆实拍高清照片及高清验车视频。","Live video inspection upon request. / 可预约实时视频验车。","VIN verification where applicable. / VIN车架号核验（适用时）。","Battery health verification for electric vehicles. / 新能源车辆电池健康检测。","Export documentation review before shipment. / 发货前审核全部出口文件。","Shipment tracking updates until delivery. / 提供运输全程跟踪。","Dedicated after-sales support for parts and technical assistance. / 提供售后技术支持及配件采购服务。"]} /></Section>
      <View style={{ marginTop: 28, padding: 16, backgroundColor: TINT, borderLeftWidth: 3, borderLeftColor: RED }}><Text style={{ fontSize: 10 }}>Agreement reference / 协议编号</Text><Text style={{ marginTop: 4, color: MUTED }}>{quote.id}</Text><Text style={{ marginTop: 10 }}>Valid until / 有效期至: {quote.validUntil}</Text></View>
      <PageFooter quote={quote} />
    </Page>
  </>;
}
