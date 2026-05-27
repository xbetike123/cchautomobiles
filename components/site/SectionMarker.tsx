import { cn } from "@/lib/utils";

type SectionMarkerProps = {
  number: string;
  label?: string;
  className?: string;
};

/**
 * Editorial section number + thin vertical rule. Used as the left-edge
 * "ladder" running down the home page, in the spirit of the year scale
 * on the Square reference design.
 */
export function SectionMarker({ number, label, className }: SectionMarkerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col items-start gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-text-tertiary",
        className,
      )}
    >
      <span aria-hidden="true" className="block h-10 w-px bg-cch-red/70" />
      <span className="flex items-baseline gap-2 tabular-nums">
        <span className="text-corporate-black">{number}</span>
        {label ? <span>{label}</span> : null}
      </span>
    </div>
  );
}
