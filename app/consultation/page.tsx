import { Check, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { submitConsultationRequest } from "@/app/consultation/actions";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";

const OPERATIONS_PHONE = "+86 131 0670 0341";

const SUBHEADING =
  "Whether you're buying your first Chinese vehicle, importing multiple cars, or planning a fleet, we'll help you make informed decisions before you spend your money.";

export const metadata: Metadata = {
  title: "Book a Vehicle Sourcing Consultation · CCH Automobile",
  description: SUBHEADING,
  openGraph: {
    title: "Book a Vehicle Sourcing Consultation · CCH Automobile",
    description: SUBHEADING,
    type: "website",
  },
};

const HELP_ITEMS = [
  {
    emoji: "🚗",
    title: "Choosing the Right Vehicle",
    body: "Compare models based on your budget, destination, and intended use.",
  },
  {
    emoji: "💰",
    title: "Understanding the Real Cost",
    body: "Learn the total landed cost, including shipping, duties, taxes, and other import expenses.",
  },
  {
    emoji: "📦",
    title: "Import & Export Process",
    body: "Understand timelines, documentation, inspections, and how the buying process works.",
  },
  {
    emoji: "🔋",
    title: "EV Charging & Maintenance",
    body: "Get practical advice on charging, servicing, battery life, and ownership.",
  },
  {
    emoji: "🚕",
    title: "Fleet & Business Projects",
    body: "Planning a dealership, taxi fleet, or commercial project? We'll help you build the right sourcing strategy.",
  },
] as const;

const FOR_WHO = [
  "First-time vehicle buyers",
  "Car dealerships",
  "Fleet operators",
  "Businesses importing multiple vehicles",
  "Buyers comparing several models",
  "Anyone who wants expert guidance before purchasing",
] as const;

const STEPS = [
  { n: 1, body: "Choose a convenient time." },
  { n: 2, body: "Complete a short questionnaire." },
  { n: 3, body: "Meet with our Guangzhou team via video call." },
  { n: 4, body: "Receive clear recommendations and your next steps." },
] as const;

const INCLUDES = [
  "Up to 60-minute private consultation",
  "Direct access to our Guangzhou sourcing team",
  "Vehicle recommendations",
  "Import guidance",
  "Live Q&A",
  "Follow-up summary after the call",
] as const;

const FAQS = [
  { q: "How long is the consultation?", a: "Up to 60 minutes." },
  {
    q: "Is the consultation refundable?",
    a: "No. The consultation fee covers dedicated time with our team and personalized advice.",
  },
  {
    q: "Can you help after the consultation?",
    a: "Yes. If you decide to move forward, we can also assist with sourcing, inspections, export documentation, and shipping.",
  },
] as const;

function BookButton({
  tone = "red",
  className = "",
}: {
  tone?: "red" | "light";
  className?: string;
}) {
  const tones = {
    red: "bg-cch-red text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] hover:bg-cch-red-hover",
    light: "bg-white text-cch-red shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-white/90",
  } as const;
  return (
    <a
      href="#book"
      className={`inline-flex items-center justify-center rounded-button px-8 py-[16px] text-[15px] font-semibold transition-all ${tones[tone]} ${className}`}
    >
      Book My Consultation
    </a>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto h-6 w-[2px] bg-cch-red" aria-hidden />
      <p className="mt-4 text-meta text-cch-red">{label}</p>
      <h2 className="mt-3 font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-corporate-black md:text-[32px]">
        {title}
      </h2>
    </div>
  );
}

function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-cch-red-soft"
        aria-hidden
      >
        <Check className="size-3.5 text-cch-red" />
      </span>
      <span className="text-[15px] leading-snug text-corporate-black/90">
        {children}
      </span>
    </li>
  );
}

export default function ConsultationPage() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-16 md:py-24">
      {/* Hero */}
      <section className="text-center">
        <div className="mx-auto h-6 w-[2px] bg-cch-red" aria-hidden />
        <p className="mt-4 text-meta text-cch-red">Consultation</p>
        <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-corporate-black md:text-[48px]">
          Book a Vehicle Sourcing Consultation
        </h1>
        <p className="mx-auto mt-5 max-w-[560px] text-[16px] leading-relaxed text-text-secondary">
          {SUBHEADING}
        </p>

        {/* Best for — qualifies the visitor instantly */}
        <p className="mx-auto mt-7 max-w-[600px] rounded-card border border-hairline bg-surface-warm px-5 py-3.5 text-[13.5px] leading-relaxed text-text-secondary">
          <span className="font-semibold text-corporate-black">Best for:</span>{" "}
          First-time buyers, dealerships, fleet operators, and businesses
          importing vehicles from China.
        </p>

        <div className="mt-8">
          <BookButton />
        </div>
      </section>

      {/* What we'll help you with */}
      <section className="mt-20 md:mt-28">
        <SectionHeader
          label="What we'll help you with"
          title="Make the right call before you spend"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {HELP_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`rounded-card-lg border border-hairline bg-white p-6 shadow-[var(--shadow-card)] ${
                i === HELP_ITEMS.length - 1 ? "sm:col-span-2" : ""
              }`}
            >
              <span
                className="grid size-11 place-items-center rounded-full bg-surface-tint text-[22px] leading-none"
                aria-hidden
              >
                {item.emoji}
              </span>
              <h3 className="mt-4 font-display text-[18px] font-semibold leading-tight text-corporate-black">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who this is for */}
      <section className="mt-20 md:mt-28">
        <SectionHeader
          label="Who it's for"
          title="Who this consultation is for"
        />
        <ul className="mx-auto mt-10 grid max-w-[600px] gap-x-8 gap-y-4 sm:grid-cols-2">
          {FOR_WHO.map((item) => (
            <CheckRow key={item}>{item}</CheckRow>
          ))}
        </ul>
      </section>

      {/* What happens after you book */}
      <section className="mt-20 md:mt-28">
        <SectionHeader
          label="The process"
          title="What happens after you book?"
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex items-start gap-4 rounded-card-lg border border-hairline bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cch-red text-[15px] font-semibold text-white">
                {step.n}
              </span>
              <p className="pt-1.5 text-[14.5px] leading-snug text-corporate-black/90">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Consultation includes */}
      <section className="mt-20 md:mt-28">
        <SectionHeader
          label="What's included"
          title="Your consultation includes"
        />
        <ul className="mx-auto mt-10 grid max-w-[600px] gap-x-8 gap-y-4 sm:grid-cols-2">
          {INCLUDES.map((item) => (
            <CheckRow key={item}>{item}</CheckRow>
          ))}
        </ul>
      </section>

      {/* Important note */}
      <section className="mt-16 md:mt-20">
        <div className="mx-auto max-w-[640px] rounded-r-card border-l-2 border-cch-red bg-cch-red-soft px-6 py-5">
          <p className="text-[14px] italic leading-relaxed text-text-secondary">
            This consultation is advisory only. Vehicle sourcing, inspections,
            and export services are quoted separately based on your requirements.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="mt-20 md:mt-28">
        <div className="overflow-hidden rounded-card-lg bg-gradient-to-br from-cch-red to-cch-red-hover px-8 py-12 text-center shadow-[0_18px_40px_rgba(230,57,70,0.28)]">
          <h2 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[34px]">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-relaxed text-white/90">
            Book your consultation today and get expert guidance before making
            your purchase.
          </p>
          <div className="mt-8">
            <BookButton tone="light" />
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="mt-20 scroll-mt-8 md:mt-28">
        <SectionHeader
          label="Book your consultation"
          title="Tell us a bit about your plans"
        />
        <p className="mx-auto mt-4 max-w-[480px] text-center text-[14.5px] leading-relaxed text-text-secondary">
          A few quick details so we can prepare for your call. Our Guangzhou team
          will follow up to confirm a time.
        </p>
        <div className="mx-auto mt-10 max-w-[560px]">
          <ConsultationForm
            submit={submitConsultationRequest}
            whatsappContact={OPERATIONS_PHONE}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 md:mt-28">
        <SectionHeader label="FAQ" title="Common questions" />
        <div className="mx-auto mt-10 max-w-[600px]">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group border-b border-hairline py-4 first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-corporate-black [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown
                  aria-hidden
                  className="size-4 shrink-0 text-text-tertiary transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
