import { cn } from "@/lib/utils";

type LogomarkProps = {
  className?: string;
  size?: "default" | "small";
};

export function Logomark({ className, size = "default" }: LogomarkProps) {
  const isSmall = size === "small";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display font-semibold tracking-[-0.01em] text-corporate-black",
        isSmall ? "text-xs" : "text-[18px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block bg-cch-red",
          isSmall ? "size-[3px]" : "size-[4px]",
        )}
      />
      CCH Automobile
    </span>
  );
}
