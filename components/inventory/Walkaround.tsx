"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { InventoryRow } from "@/lib/queries/inventory";

type Props = {
  car: InventoryRow;
};

export function Walkaround({ car }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = car.walkaround_video_url;

  useEffect(() => {
    if (!src) return;
    const node = videoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void node.play().catch(() => {});
          } else {
            node.pause();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [src]);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 py-12 md:py-16">
        <h2 className="font-display text-[22px] font-semibold leading-tight tracking-tight text-corporate-black md:text-[26px]">
          Walkaround
        </h2>
        <p className="mt-2 max-w-[640px] text-[14px] text-text-secondary">
          Filmed by the CCH operations team on the Guangzhou lot. Engine bay,
          underbody, panel scan, and a road test pass.
        </p>

        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-card-lg border border-hairline bg-corporate-black shadow-[var(--shadow-card)]">
          {src ? (
            <video
              ref={videoRef}
              src={src}
              poster="/placeholders/walk-the-lot-poster.svg"
              muted
              loop
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : (
            <Image
              src="/placeholders/walk-the-lot-poster.svg"
              alt=""
              fill
              sizes="(min-width: 1200px) 1200px, 100vw"
              className="object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
