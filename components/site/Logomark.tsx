import Image from "next/image";

import { cn } from "@/lib/utils";

type LogomarkProps = {
  className?: string;
  size?: "default" | "small";
};

export function Logomark({ className, size = "default" }: LogomarkProps) {
  const isSmall = size === "small";
  const markSize = isSmall ? 44 : 64;
  return (
    <span
      className={cn(
        "inline-flex items-center",
        className,
      )}
    >
      <Image
        src="/logo/cch_logo_transparent.png"
        alt="CCH Automobile"
        width={markSize}
        height={markSize}
        priority
        className="inline-block"
      />
    </span>
  );
}
