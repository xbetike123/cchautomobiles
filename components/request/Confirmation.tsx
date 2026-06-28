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
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-corporate-black md:text-[44px]">
        We&rsquo;ve got it, {name.split(" ")[0]}.
      </h1>
      <p className="mx-auto mt-5 max-w-[460px] text-[15px] leading-relaxed text-text-secondary">
        Continue the conversation with our Guangzhou team on WhatsApp — your
        details are pre-filled, just hit send.
      </p>
      {waLink ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href={waLink} variant="primary">
            Continue on WhatsApp
          </CtaButton>
          <CtaButton href="/lot" variant="secondary" size="small">
            See this week&rsquo;s lot
          </CtaButton>
        </div>
      ) : (
        <div className="mt-8">
          <CtaButton href="/lot" variant="primary">
            See this week&rsquo;s lot
          </CtaButton>
        </div>
      )}
    </div>
  );
}
