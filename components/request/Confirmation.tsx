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
        🎉 Request Submitted Successfully
      </h1>
      <p className="mx-auto mt-5 max-w-[480px] text-[16px] font-medium leading-relaxed text-corporate-black">
        Thank you for your request.
      </p>
      <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-relaxed text-text-secondary">
        Our China team has received your enquiry and is now reviewing your
        requirements. We&rsquo;ll contact you as soon as we&rsquo;ve prepared
        the most suitable vehicle options for your needs.
      </p>
      <p className="mx-auto mt-4 max-w-[480px] rounded-lg bg-surface-tint px-4 py-3 text-[14px] leading-relaxed text-text-secondary">
        A confirmation email has been sent to your inbox. If you don&rsquo;t
        see it within a few minutes, please check your{" "}
        <span className="font-semibold text-corporate-black">Spam</span> or{" "}
        <span className="font-semibold text-corporate-black">Junk</span> folder.
      </p>
      <p className="mx-auto mt-4 max-w-[480px] text-[14.5px] leading-relaxed text-text-secondary">
        <span className="font-semibold text-corporate-black">
          Typical response time:
        </span>{" "}
        within minutes during business hours.
      </p>
      <p className="mx-auto mt-4 max-w-[480px] text-[14.5px] leading-relaxed text-text-secondary">
        Thank you for choosing CCH Automobile.
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
