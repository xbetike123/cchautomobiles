import Image from "next/image";

import { SectionHeader } from "@/components/site/SectionHeader";
import { TertiaryLink } from "@/components/site/TertiaryLink";
import { getBrands } from "@/lib/queries/brands";

export async function Brands() {
  const brands = await getBrands();

  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-16 md:py-24">
        <SectionHeader
          label="Our sourcing network"
          heading="Direct relationships with China's EV leaders."
          description="Long-running supply lines into the Guangzhou and Shenzhen factories that ship the most-exported EVs out of China today."
        />
        <div className="mt-12 grid grid-cols-2 border-t border-l border-hairline md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex h-[160px] items-center justify-center border-b border-r border-hairline bg-surface-tint px-4 transition-opacity"
            >
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  width={160}
                  height={64}
                  className="max-h-12 w-auto opacity-80 transition-opacity hover:opacity-100"
                />
              ) : (
                <span className="font-display text-[18px] font-medium tracking-[-0.01em] text-corporate-black/80 transition-opacity hover:text-corporate-black">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <TertiaryLink href="/about#sourcing">
            Read about our sourcing approach
          </TertiaryLink>
        </div>
      </div>
    </section>
  );
}
