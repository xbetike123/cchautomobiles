import type { InventoryRow } from "@/lib/queries/inventory";

type SourceData = {
  sourceUrl?: string | null;
  pageTitle?: string | null;
  trim?: { name?: string | null } | null;
  specs?: Record<string, string | null | undefined>;
};

type Category = {
  title: string;
  // Lower-cased keyword that must appear in the param name to land here.
  // First match wins, in order.
  keywords: string[];
};

// Ordered top to bottom. "Other" catches anything we didn't classify.
const CATEGORIES: Category[] = [
  {
    title: "Dimensions",
    keywords: [
      "length",
      "width",
      "height",
      "wheelbase",
      "track",
      "ground clearance",
      "curb weight",
      "gross weight",
      "weight",
      "cargo",
      "trunk",
      "luggage",
    ],
  },
  {
    title: "Powertrain",
    keywords: [
      "motor",
      "engine",
      "drive type",
      "transmission",
      "top speed",
      "0-100",
      "acceleration",
      "power",
      "torque",
      "horsepower",
      "kw",
    ],
  },
  {
    title: "Battery & range",
    keywords: [
      "battery",
      "range",
      "cltc",
      "wltp",
      "nedc",
      "kwh",
      "fuel type",
      "consumption",
      "regen",
    ],
  },
  {
    title: "Charging",
    keywords: ["charging", "charge", "ac power", "dc power", "plug"],
  },
  {
    title: "Body & doors",
    keywords: [
      "vehicle type",
      "body type",
      "body style",
      "door",
      "seats",
      "seating",
    ],
  },
  {
    title: "Wheels & tires",
    keywords: ["wheel", "tire", "tyre", "rim"],
  },
  {
    title: "Chassis",
    keywords: ["suspension", "brake", "steering", "drive mode"],
  },
  {
    title: "Safety",
    keywords: [
      "airbag",
      "abs",
      "esp",
      "lane",
      "cruise",
      "auto pilot",
      "adas",
      "blind spot",
      "collision",
      "tpms",
      "isofix",
      "child",
      "safety",
    ],
  },
  {
    title: "Comfort & interior",
    keywords: [
      "air conditioning",
      "ac",
      "seat",
      "sunroof",
      "moonroof",
      "steering wheel",
      "interior",
      "trim",
      "leather",
      "fabric",
      "screen",
      "display",
      "audio",
      "speaker",
      "infotainment",
      "navigation",
      "voice",
      "wireless charging",
      "usb",
      "smart key",
      "keyless",
      "ambient",
      "climate",
    ],
  },
  {
    title: "Lighting",
    keywords: [
      "headlight",
      "headlamp",
      "taillight",
      "taillamp",
      "fog light",
      "drl",
      "daytime running",
    ],
  },
  {
    title: "Exterior",
    keywords: ["mirror", "window", "wiper", "antenna", "spoiler", "paint"],
  },
  {
    title: "Release",
    keywords: ["released", "launch", "production"],
  },
];

function categorise(
  entries: [string, string][],
): { title: string; rows: [string, string][] }[] {
  const buckets = new Map<string, [string, string][]>();
  for (const cat of CATEGORIES) buckets.set(cat.title, []);
  const other: [string, string][] = [];

  for (const [name, value] of entries) {
    const lower = name.toLowerCase();
    let placed = false;
    for (const cat of CATEGORIES) {
      if (cat.keywords.some((kw) => lower.includes(kw))) {
        buckets.get(cat.title)!.push([name, value]);
        placed = true;
        break;
      }
    }
    if (!placed) other.push([name, value]);
  }

  const ordered = CATEGORIES.map(({ title }) => ({
    title,
    rows: buckets.get(title) ?? [],
  })).filter((c) => c.rows.length > 0);
  if (other.length > 0) ordered.push({ title: "Other", rows: other });
  return ordered;
}

type Props = {
  car: InventoryRow;
};

export function FullSpecs({ car }: Props) {
  const sourceData = car.source_data as SourceData | null;
  const specs = sourceData?.specs;
  if (!sourceData || !specs) return null;
  const entries = Object.entries(specs)
    .filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" && entry[1].trim().length > 0,
    )
    .map(([k, v]) => [k, v.trim()] as [string, string]);
  if (entries.length === 0) return null;

  const grouped = categorise(entries);
  const sourceHost = sourceData.sourceUrl
    ? new URL(sourceData.sourceUrl).host
    : null;

  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-meta text-cch-red">Full specifications</p>
            <h2 className="mt-2 font-display text-[22px] font-semibold leading-tight tracking-tight text-corporate-black md:text-[26px]">
              Every spec for {sourceData.trim?.name ?? "this trim"}
            </h2>
            <p className="mt-2 max-w-[640px] text-[14px] text-text-secondary">
              {entries.length} data points, sourced from the manufacturer
              parameter sheet.
            </p>
          </div>
          {sourceData.sourceUrl ? (
            <a
              href={sourceData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] uppercase tracking-[0.1em] text-text-tertiary transition-colors hover:text-corporate-black"
            >
              Source · {sourceHost}
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {grouped.map((group) => (
            <section
              key={group.title}
              className="overflow-hidden rounded-card-lg border border-hairline bg-white"
            >
              <h3 className="border-b border-hairline bg-surface-tint/70 px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                {group.title}
              </h3>
              <dl>
                {group.rows.map(([name, value], idx) => (
                  <div
                    key={`${group.title}-${name}`}
                    className={
                      "grid grid-cols-[180px_1fr] gap-4 px-5 py-2.5 " +
                      (idx < group.rows.length - 1
                        ? "border-b border-hairline"
                        : "")
                    }
                  >
                    <dt className="text-[12.5px] text-text-tertiary">{name}</dt>
                    <dd className="text-[13.5px] text-corporate-black">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
