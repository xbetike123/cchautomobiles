import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TertiaryLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function TertiaryLink({
  href,
  children,
  className,
  ...rest
}: TertiaryLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-baseline gap-1 text-[13px] font-medium text-corporate-black",
        "border-b border-[rgba(0,0,0,0.2)] pb-0.5 transition-colors",
        "hover:border-corporate-black",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
