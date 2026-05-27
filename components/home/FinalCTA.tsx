import { CtaButton } from "@/components/site/CtaButton";
import { RequestCarCta } from "@/components/site/RequestCarCta";

const WHATSAPP_PLACEHOLDER_URL = "https://wa.me/0000000000";

export function FinalCTA() {
  return (
    <section className="bg-corporate-black text-white">
      <div className="mx-auto max-w-content px-6 py-12 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-[820px] font-display text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            Ready to import your first EV from China?
          </h2>
          <p className="mt-6 max-w-[640px] text-[18px] leading-[1.5] text-white/70">
            Tell us what you&apos;re looking for. We&apos;ll send a shortlist
            from this week&apos;s lot within 24 hours.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <RequestCarCta>Request a Car</RequestCarCta>
            <CtaButton
              href={WHATSAPP_PLACEHOLDER_URL}
              variant="outline-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk on WhatsApp
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
