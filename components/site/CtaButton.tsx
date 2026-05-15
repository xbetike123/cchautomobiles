import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CtaVariant = "primary" | "secondary" | "outline-light";
type CtaSize = "default" | "small";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  size?: CtaSize;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

const baseStyles =
  "inline-flex items-center justify-center rounded-button text-sm font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cch-red focus-visible:ring-offset-background";

const variantStyles: Record<CtaVariant, string> = {
  primary:
    "bg-cch-red text-white hover:bg-cch-red-hover focus-visible:ring-cch-red",
  secondary:
    "bg-white text-corporate-black border border-corporate-black hover:bg-corporate-black hover:text-white focus-visible:ring-corporate-black",
  "outline-light":
    "bg-transparent text-white border border-white hover:bg-white hover:text-corporate-black focus-visible:ring-white",
};

const sizeStyles: Record<CtaSize, string> = {
  default: "px-8 py-[14px]",
  small: "px-5 py-[10px] text-[13px]",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "default",
  className,
  ...rest
}: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
