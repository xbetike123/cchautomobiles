import { CarCard } from "@/components/inventory/CarCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { TertiaryLink } from "@/components/site/TertiaryLink";
import { getOnTheLot } from "@/lib/queries/inventory";

export async function OnTheLot() {
  const cars = await getOnTheLot();

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 py-12 md:py-24">
        <SectionHeader
          label="On the lot"
          heading="This week in Guangzhou."
          align="left"
          aside={
            <TertiaryLink href="/lot">View all inventory</TertiaryLink>
          }
        />
        {cars.length === 0 ? (
          <p className="mt-12 text-text-secondary">
            No cars on the lot this week. Check back next week.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
