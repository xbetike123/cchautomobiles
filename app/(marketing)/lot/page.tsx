import { CarCard } from "@/components/inventory/CarCard";
import { FilterBar } from "@/components/inventory/FilterBar";
import { Pagination } from "@/components/inventory/Pagination";
import { SortDropdown } from "@/components/inventory/SortDropdown";
import {
  getInventory,
  getInventoryFacets,
  type InventorySort,
} from "@/lib/queries/inventory";

const PER_PAGE = 12;

type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

type PageProps = {
  searchParams: Promise<RawSearchParams>;
};

function asString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

const SORT_VALUES: readonly InventorySort[] = [
  "newest",
  "price-asc",
  "price-desc",
  "battery-desc",
];

function parseSort(value: string | undefined): InventorySort {
  return SORT_VALUES.includes(value as InventorySort)
    ? (value as InventorySort)
    : "newest";
}

function parseCondition(value: string | undefined): "new" | "used" | undefined {
  return value === "new" || value === "used" ? value : undefined;
}

function parsePage(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export default async function LotPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const condition = parseCondition(asString(raw.condition));
  const brand = asString(raw.brand);
  const body = asString(raw.body);
  const sort = parseSort(asString(raw.sort));
  const page = parsePage(asString(raw.page));

  const [{ rows, total }, facets] = await Promise.all([
    getInventory({
      condition,
      brand,
      body,
      sort,
      page,
      perPage: PER_PAGE,
    }),
    getInventoryFacets(),
  ]);

  const params = new URLSearchParams();
  if (condition) params.set("condition", condition);
  if (brand) params.set("brand", brand);
  if (body) params.set("body", body);
  if (sort !== "newest") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));

  return (
    <>
      <section className="bg-surface-tint">
        <div className="mx-auto max-w-content px-6 pb-10 pt-14 md:pb-12 md:pt-20">
          <div className="flex flex-col items-start gap-4">
            <span className="inline-flex h-px w-6 bg-cch-red" aria-hidden="true" />
            <p className="text-meta text-cch-red">On the lot</p>
            <h1 className="font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.02em] text-corporate-black md:text-[44px]">
              This week in Guangzhou.
            </h1>
            <p className="max-w-[600px] text-[15px] leading-[1.6] text-text-secondary">
              Inspected, filmed, and ready to ship. Filter the lot by
              condition, make, or body type. New cars are factory-fresh; used
              cars are first-owner only.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-y border-hairline bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-content flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterBar brands={facets.brands} bodyTypes={facets.bodyTypes} />
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <p className="text-[12.5px] text-text-tertiary lg:hidden">
              <span className="font-semibold text-corporate-black tabular-nums">
                {total}
              </span>{" "}
              cars
            </p>
            <SortDropdown />
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-content px-6 py-10 md:py-12">
          <div className="mb-6 hidden items-center justify-between text-[13px] text-text-secondary lg:flex">
            <p>
              <span className="font-semibold text-corporate-black tabular-nums">
                {total}
              </span>{" "}
              {total === 1 ? "car" : "cars"} available
              {condition || brand || body
                ? " matching your filters"
                : " this week"}
            </p>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-card-lg border border-hairline bg-white px-8 py-16 text-center">
              <p className="text-[15px] font-medium text-corporate-black">
                No cars match those filters this week.
              </p>
              <p className="mt-2 text-[13px] text-text-secondary">
                Try clearing a filter, or request a sourcing run for the spec
                you want.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rows.map((car, index) => (
                <CarCard key={car.id} car={car} priority={index < 4} />
              ))}
            </div>
          )}

          {rows.length > 0 ? (
            <div className="mt-12">
              <Pagination
                total={total}
                perPage={PER_PAGE}
                page={page}
                pathname="/lot"
                searchParams={params}
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
