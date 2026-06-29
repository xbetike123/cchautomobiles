import { CtaButton } from "@/components/site/CtaButton";

type Props = {
  whatsappNumber: string | null;
  name: string;
  notes: string | null;
  destinationCity: string | null;
  destinationCountry: string;
  aboutCarLabel: string | null;
};

function buildPrefilledMessage({
  name,
  notes,
  destinationCity,
  destinationCountry,
  aboutCarLabel,
}: Omit<Props, "whatsappNumber">): string {
  const lines: string[] = [`Hi CCH, this is ${name}.`];
  if (aboutCarLabel) {
    lines.push(`I just submitted a request about the ${aboutCarLabel}.`);
  } else {
    lines.push("I just submitted a request on your site.");
  }
  const destination = [destinationCity, destinationCountry]
    .filter(Boolean)
    .join(", ");
  lines.push(`Destination: ${destination}.`);
  if (notes) {
    lines.push("", notes);
  }
  return lines.join("\n");
}

export function Confirmation({
  whatsappNumber,
  name,
  notes,
  destinationCity,
  destinationCountry,
  aboutCarLabel,
}: Props) {
  const message = buildPrefilledMessage({
    name,
    notes,
    destinationCity,
    destinationCountry,
    aboutCarLabel,
  });
  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`
    : null;

  return (
    <div className="text-center">
      <div className="mx-auto h-12 w-[2px] bg-cch-red" aria-hidden />
      <p className="mt-6 text-meta text-cch-red">Request received</p>
      <h1 className="mt-3 font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.02em] text-corporate-black md:text-[40px]">
        🎉 Request submitted successfully
      </h1>
      <p className="mx-auto mt-5 max-w-[480px] text-[15px] leading-relaxed text-text-secondary">
        Our China team is now reviewing your requirements and will contact you
        as soon as we&rsquo;ve prepared the best available options for your
        needs.
      </p>
      <p className="mx-auto mt-4 max-w-[480px] text-[14.5px] leading-relaxed text-text-secondary">
        <span className="font-semibold text-corporate-black">
          Typical response time:
        </span>{" "}
        within minutes during business hours.
      </p>
      <p className="mx-auto mt-4 max-w-[480px] text-[14.5px] leading-relaxed text-text-secondary">
        We appreciate the opportunity to assist you with your vehicle purchase
        from China.
      </p>
      {waLink ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href={waLink} variant="primary">
            Message us on WhatsApp
          </CtaButton>
        </div>
      ) : null}
    </div>
  );
}
