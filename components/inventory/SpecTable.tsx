import type { InventoryRow } from "@/lib/queries/inventory";

const numberFormatter = new Intl.NumberFormat("en-US");

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Row = { label: string; value: string };

type Section = {
  title: string;
  rows: Row[];
};

function formatMileage(km: number | null): string {
  if (km == null) return "—";
  return `${numberFormatter.format(km)} km`;
}

function buildSections(car: InventoryRow): Section[] {
  const isUsed = car.condition === "used";

  const overview: Row[] = [
    { label: "Brand", value: car.brand },
    { label: "Model", value: car.model },
    { label: "Model year", value: String(car.year) },
    {
      label: "Condition",
      value: isUsed ? "Used (first-owner)" : "New from factory",
    },
    { label: "Body type", value: car.body_type ?? "—" },
  ];

  const specifications: Row[] = [
    {
      label: "Range (claimed)",
      value:
        car.range_km != null
          ? `${numberFormatter.format(car.range_km)} km`
          : "Manufacturer claim",
    },
    {
      label: "Mileage",
      value: isUsed ? formatMileage(car.mileage_km) : "0 km · pre-delivery",
    },
    {
      label: "Battery health",
      value: isUsed
        ? car.battery_health_pct != null
          ? `${car.battery_health_pct}%`
          : "Inspection pending"
        : "New pack, 100%",
    },
    {
      label: "Factory warranty",
      value:
        car.factory_warranty_months != null
          ? `${car.factory_warranty_months} months from production`
          : "Original warranty expired",
    },
    {
      label: "Price (FOB Guangzhou)",
      value: usdFormatter.format(car.price_usd_fob),
    },
  ];

  const history: Row[] = [
    {
      label: "Owner count",
      value: isUsed ? `${car.owner_count ?? 1} prior owner${(car.owner_count ?? 1) === 1 ? "" : "s"}` : "First-hand stock",
    },
    {
      label: "On the lot since",
      value: car.week_added ?? "—",
    },
    {
      label: "CCH lot location",
      value: "Guangzhou export yard",
    },
  ];

  const inspection: Row[] = [
    {
      label: "Visual inspection",
      value: "Complete · filmed on the lot",
    },
    {
      label: "Road test",
      value: isUsed ? "30 km mixed city + highway" : "Pre-delivery factory test only",
    },
    {
      label: "Battery diagnostic",
      value: isUsed ? "Battery health report on file" : "Battery passport included",
    },
    {
      label: "Underbody and panel scan",
      value: "Photo set in gallery below",
    },
  ];

  const paperwork: Row[] = (car.included_paperwork.length > 0
    ? car.included_paperwork.map((item) => ({
        label: item,
        value: "Included",
      }))
    : [{ label: "Standard export paperwork", value: "Included" }]);
  paperwork.push({
    label: "Pre-export inspection certificate",
    value: "Issued by CCH operations",
  });

  return [
    { title: "Overview", rows: overview },
    { title: "Specifications", rows: specifications },
    { title: "History", rows: history },
    { title: "Inspection report", rows: inspection },
    { title: "Paperwork", rows: paperwork },
  ];
}

type Props = {
  car: InventoryRow;
};

export function SpecTable({ car }: Props) {
  const sections = buildSections(car);
  return (
    <div className="overflow-hidden rounded-card-lg border border-hairline bg-white">
      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="border-b border-hairline bg-surface-tint/70 px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
            {section.title}
          </h3>
          <dl>
            {section.rows.map((row, idx) => (
              <div
                key={`${section.title}-${row.label}`}
                className={
                  "grid grid-cols-1 gap-1 px-6 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6 " +
                  (idx < section.rows.length - 1
                    ? "border-b border-hairline"
                    : "")
                }
              >
                <dt className="text-[12.5px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
                  {row.label}
                </dt>
                <dd className="text-[14px] text-corporate-black">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
