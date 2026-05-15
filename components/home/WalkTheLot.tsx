"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Real walkaround video drop-in. Until a file is supplied, the section
// renders the placeholder poster only. See BLOCKERS.md.
const VIDEO_SRC: string | null = null;

export function WalkTheLot() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!VIDEO_SRC) return;
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
  }, []);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 pb-16 md:pb-24">
        <div className="relative w-full aspect-video overflow-hidden border border-hairline bg-corporate-black">
          {VIDEO_SRC ? (
            <video
              ref={videoRef}
              src={VIDEO_SRC}
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
        <p className="mt-4 text-[13px] leading-[1.5] text-text-secondary">
          Filmed this week in Guangzhou by the CCH operations team.
        </p>
      </div>
    </section>
  );
}
