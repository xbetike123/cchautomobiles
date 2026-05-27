import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";

import { SectionHeader } from "@/components/site/SectionHeader";
import { TertiaryLink } from "@/components/site/TertiaryLink";

async function getBrandLogos() {
  // Re-read public/brands/ on every request so newly dropped files appear
  // without needing a server restart. fs.readdir would otherwise be cached
  // as part of the static render.
  noStore();
  const dir = path.join(process.cwd(), "public", "brands");
  const files = await fs.readdir(dir);
  return files
    .filter((f) => /\.(png|svg|webp|jpg|jpeg)$/i.test(f))
    .sort();
}

export async function Brands() {
  const logos = await getBrandLogos();

  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-12 md:py-24">
        <SectionHeader
          label="Our brands"
          heading="What's your dream Chinese car?"
          description="Shop a wide range of clean and affordable cars from the following top brands."
        />
        <div className="mt-12 grid grid-cols-2 border-t border-l border-hairline md:grid-cols-3 lg:grid-cols-6">
          {logos.map((file) => (
            <div
              key={file}
              className="flex h-40 items-center justify-center border-b border-r border-hairline bg-surface-tint p-6"
            >
              <Image
                src={`/brands/${file}`}
                alt=""
                width={120}
                height={64}
                className="max-h-16 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
              />
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
