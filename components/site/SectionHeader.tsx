import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
  heading: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  /** Render an aside element to the right of the heading (e.g. a "View all" link). */
  aside?: React.ReactNode;
};

export function SectionHeader({
  label,
  heading,
  description,
  align = "center",
  className,
  aside,
}: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <header
      className={cn(
        "flex flex-col",
        isCenter ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <div className={cn("h-px w-6 bg-cch-red")} aria-hidden="true" />
      <p className="mt-4 text-meta text-cch-red">{label}</p>
      <div
        className={cn(
          "mt-4 flex w-full",
          aside
            ? "flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            : "flex-col",
          isCenter && !aside ? "items-center" : "",
        )}
      >
        <h2
          className={cn(
            "font-display font-semibold leading-[1.1] tracking-[-0.02em]",
            "text-[28px] md:text-[40px]",
            isCenter && !aside ? "text-center" : "",
            aside ? "max-w-[820px]" : "",
          )}
        >
          {heading}
        </h2>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-[600px] text-base leading-[1.6] text-text-secondary",
            isCenter ? "" : "",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
