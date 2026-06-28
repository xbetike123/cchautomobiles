import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";

async function getBrandLogos() {
  noStore();
  const dir = path.join(process.cwd(), "public", "brands");
  const files = await fs.readdir(dir);
  return files
    .filter((f) => /\.(png|svg|webp|jpg|jpeg)$/i.test(f))
    .sort()
    .slice(0, 10);
}

export async function CarentoBrands() {
  const logos = await getBrandLogos();
  const doubled = [...logos, ...logos];

  return (
    <section className="bg-surface-tint py-20 md:py-24">
      <div className="mx-auto max-w-content px-6">
        <div>
          <h2 className="font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[44px]">
            Leading Chinese Car Manufacturers
          </h2>
          <p className="mt-2 text-[14px] text-text-secondary">
            Carefully selected brands known for innovation, performance, and quality.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden md:mt-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,var(--color-surface-tint),transparent)] md:w-24"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(-90deg,var(--color-surface-tint),transparent)] md:w-24"
          />

          <ul className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused]">
            {doubled.map((file, i) => (
              <li
                key={`${file}-${i}`}
                className="flex size-32 shrink-0 items-center justify-center rounded-[14px] border border-hairline bg-white p-4 transition-colors hover:border-cch-red/30 md:size-36"
              >
                <Image
                  src={`/brands/${file}`}
                  alt=""
                  width={120}
                  height={120}
                  className="max-h-14 w-auto object-contain opacity-80"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
