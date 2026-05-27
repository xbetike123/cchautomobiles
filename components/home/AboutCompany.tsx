import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionMarker } from "@/components/site/SectionMarker";

const SHOWROOM_IMAGE = "/about/pexels-zion-5948346.jpg";

const stats: { value: string; label: string }[] = [
  { value: "12+", label: "Years in business" },
  { value: "200+", label: "Cars in stock" },
  { value: "98%", label: "Satisfied clients" },
  { value: "30+", label: "Brands sourced" },
];

export function AboutCompany() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="03" label="About" className="mb-10" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            <h2 className="font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[56px]">
              About the company.
            </h2>
            <p className="mt-5 max-w-[480px] text-[15px] leading-[1.65] text-text-secondary">
              CCH Automobile is a premium dealership where every car is held to
              a stricter standard. We work only with verified suppliers, take on
              every stage of the deal ourselves, and stay with the unit from
              registration through aftersales.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="order-2 mt-1.5 text-[11.5px] uppercase tracking-[0.12em] text-text-tertiary">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-display text-[32px] font-semibold tabular-nums leading-none text-corporate-black md:text-[36px]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-[2px] border border-corporate-black bg-white px-8 py-[14px] text-[12.5px] font-medium uppercase tracking-[0.14em] text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
              >
                More about us
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[6px] border border-hairline">
            <Image
              src={SHOWROOM_IMAGE}
              alt=""
              width={1280}
              height={720}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
