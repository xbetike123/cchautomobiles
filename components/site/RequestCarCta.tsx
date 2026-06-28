import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline-light" | "soft";
type Size = "default" | "small" | "large";

type RequestCarCtaProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  params?: Record<string, string>;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-button text-sm font-semibold leading-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cch-red focus-visible:ring-offset-background";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-cch-red text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] hover:bg-cch-red-hover hover:shadow-[0_10px_22px_rgba(230,57,70,0.32)]",
  secondary:
    "bg-white text-corporate-black border border-hairline hover:bg-corporate-black hover:text-white focus-visible:ring-corporate-black",
  "outline-light":
    "bg-transparent text-white border border-white/60 hover:bg-white hover:text-corporate-black focus-visible:ring-white",
  soft: "bg-cch-red-soft text-cch-red hover:bg-cch-red hover:text-white",
};

const sizeStyles: Record<Size, string> = {
  default: "px-7 py-[14px]",
  small: "px-5 py-[10px] text-[13px]",
  large: "px-8 py-[16px] text-[15px]",
};

export function RequestCarCta({
  children,
  variant = "primary",
  size = "default",
  className,
  params,
}: RequestCarCtaProps) {
  const query = params ? new URLSearchParams(params).toString() : "";
  const href = query ? `/request?${query}` : "/request";
  return (
    <Link
      href={href}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
    >
      {children}
    </Link>
  );
}
