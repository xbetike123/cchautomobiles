"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { TestimonialRow } from "@/lib/queries/testimonials";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Props = {
  testimonials: TestimonialRow[];
};

export function TestimonialsCarousel({ testimonials }: Props) {
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) return null;
  const safeIndex = ((index % testimonials.length) + testimonials.length) %
    testimonials.length;

  const go = (delta: number) =>
    setIndex((current) => current + delta);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous testimonial"
        onClick={() => go(-1)}
        className="absolute -left-2 top-1/2 hidden -translate-y-1/2 text-[32px] font-normal text-corporate-black/40 transition-colors hover:text-corporate-black md:inline-flex"
      >
        <ChevronLeft className="size-8" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next testimonial"
        onClick={() => go(1)}
        className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-[32px] font-normal text-corporate-black/40 transition-colors hover:text-corporate-black md:inline-flex"
      >
        <ChevronRight className="size-8" aria-hidden="true" />
      </button>

      <div className="overflow-hidden px-0 md:px-12">
        <div
          className="flex w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
          aria-live="polite"
        >
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="w-full shrink-0 grow-0 basis-full px-2 md:px-6"
            >
              <span
                aria-hidden="true"
                className="block font-display text-[60px] font-medium leading-none text-cch-red"
              >
                &ldquo;
              </span>
              <p className="mt-2 max-w-[820px] font-sans text-[22px] font-normal leading-[1.4] text-corporate-black">
                {t.quote}
              </p>
              <div className="mt-8 border-t border-hairline pt-6">
                <div className="flex items-center gap-4">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-tint">
                    {t.photo_url ? (
                      <Image
                        src={t.photo_url}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-[13px] font-medium text-text-tertiary">
                        {getInitials(t.client_name)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] font-medium leading-tight text-corporate-black">
                      {t.client_name}
                      {t.client_title ? `, ${t.client_title}` : ""}
                    </p>
                    <p className="text-[13px] font-normal leading-tight text-text-secondary">
                      {[t.client_company, t.client_city]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            aria-current={i === safeIndex}
            onClick={() => setIndex(i)}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i === safeIndex ? "bg-cch-red" : "bg-corporate-black/20",
            )}
          />
        ))}
      </div>
    </div>
  );
}
