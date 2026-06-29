import {
  ArrowRight,
  Battery,
  Check,
  ListChecks,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

const OPERATIONS_PHONE = "+86 131 0670 0341";
const WA_DIGITS = OPERATIONS_PHONE.replace(/\D/g, "");

function waLink(text: string): string {
  return `https://wa.me/${WA_DIGITS}?text=${encodeURIComponent(text)}`;
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16 .4C7.4.4.4 7.4.4 16c0 3 .8 5.9 2.4 8.5L0 32l7.7-2.5C10.2 31 13.1 32 16 32c8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm9.1 22c-.4 1.1-1.9 2.1-3 2.3-.8.2-1.8.3-5.3-1.1-4.4-1.8-7.3-6.3-7.5-6.6-.2-.3-1.7-2.3-1.7-4.4 0-2.1 1.1-3.1 1.5-3.5.3-.4.8-.5 1-.5h.7c.2 0 .5 0 .8.6.3.7 1 2.5 1.1 2.7.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.5-.6.6-.2.2-.4.4-.2.7.2.4.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.8 1.7.4.2.6.1.8-.1.2-.2.9-1.1 1.2-1.4.2-.4.5-.3.8-.2.3.1 2.1 1 2.5 1.2.4.2.6.3.7.4.1.3.1 1-.3 2z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Start here · CCH Automobile",
  description:
    "Request a vehicle, book a consultation, or chat with our Guangzhou team. New and carefully selected used Chinese vehicles, sourced direct.",
  openGraph: {
    title: "Start here · CCH Automobile",
    description:
      "Request a vehicle, book a consultation, or chat with our Guangzhou team.",
    type: "website",
  },
  // Bio-link pages are short and high-bounce; no point letting search engines
  // index them ahead of the canonical site routes.
  robots: { index: false, follow: true },
};

type LinkCardProps = {
  href: string;
  external?: boolean;
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  badge?: string;
};

function LinkCard({
  href,
  external,
  title,
  description,
  Icon,
  iconClassName,
  badge,
}: LinkCardProps) {
  const target = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link
      href={href}
      {...target}
      className="group flex items-center gap-4 rounded-2xl border border-hairline bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-all hover:border-corporate-black/30 hover:shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
    >
      <span
        className={
          "grid size-11 shrink-0 place-items-center rounded-full bg-surface-tint text-corporate-black " +
          (iconClassName ?? "")
        }
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-tight text-corporate-black">
          {title}
        </p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-text-secondary">
          {description}
        </p>
      </div>
      {badge ? (
        <span className="shrink-0 rounded-full bg-surface-tint px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-text-secondary">
          {badge}
        </span>
      ) : null}
      <ArrowRight
        className="size-4 shrink-0 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-corporate-black"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function GetStartedPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-5 py-10 text-corporate-black">
      {/* Soft red wash behind the featured card. Subtle on white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-32 z-0 size-[420px] -translate-x-1/2 rounded-full bg-cch-red/10 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-[460px]">
        {/* Brand header */}
        <header className="text-center">
          <Image
            src="/logo/cch_logo_transparent.png"
            alt="CCH Automobile"
            width={88}
            height={88}
            sizes="88px"
            priority
            className="mx-auto"
          />
          <h1 className="mt-4 inline-flex items-center justify-center gap-1.5 font-display text-[22px] font-bold tracking-tight text-corporate-black">
            CCH Automobile
            <svg
              viewBox="0 0 22 22"
              fill="#1D9BF0"
              className="size-5 shrink-0"
              aria-label="Verified"
              role="img"
            >
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
          </h1>
        </header>

        {/* Eyebrow */}
        <div className="mt-9 space-y-3">
          <span aria-hidden="true" className="block h-px w-full bg-hairline" />
          <p className="text-center text-[12.5px] leading-[1.55] text-text-secondary">
            Buy new and clean used Chinese vehicles directly from China, with
            inspection, export, and worldwide shipping handled for you.
          </p>
          <span aria-hidden="true" className="block h-px w-full bg-hairline" />
        </div>

        {/* Trust badges */}
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {[
            "Factory Direct & First Owner Vehicles",
            "Independent Vehicle Inspections",
            "Worldwide Export",
            "Secure International Payments",
          ].map((label) => (
            <li key={label} className="flex items-start gap-2">
              <Check
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-cch-red"
              />
              <span className="text-[12.5px] leading-snug text-corporate-black/85">
                {label}
              </span>
            </li>
          ))}
        </ul>

        {/* Featured CTA */}
        <Link
          href="/request"
          className="group relative mt-6 block overflow-hidden rounded-2xl bg-gradient-to-br from-cch-red to-cch-red-hover px-6 py-7 shadow-[0_18px_40px_rgba(230,57,70,0.28)] transition-shadow hover:shadow-[0_22px_48px_rgba(230,57,70,0.36)]"
        >
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white">
            Start here
          </span>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-[24px] font-bold leading-tight text-white">
                Request a Vehicle
              </h2>
              <p className="mt-2 text-[13px] leading-[1.55] text-white/90">
                Tell us the vehicle you&rsquo;re looking for, your budget,
                destination country, and timeline. We&rsquo;ll send you the
                best available options with detailed specifications, pricing,
                and export information.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white">
              Free
            </span>
          </div>
        </Link>

        {/* Standard cards */}
        <ul className="mt-3 space-y-2.5">
          <li>
            <LinkCard
              href="/consultation"
              Icon={Phone}
              title="Book a Consultation"
              description="Need expert guidance before buying a car? Speak directly with our China team about sourcing, pricing, inspections, or imports."
              badge="$99"
            />
          </li>
          <li>
            <LinkCard
              href="/solutions"
              Icon={Battery}
              title="Ride-Hailing Fleet & EV Charging"
              description="Planning an electric taxi fleet? Explore our complete vehicle, charging, and infrastructure solutions."
            />
          </li>
          <li>
            <Link
              href={waLink("Hi CCH, I'd like to chat.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl bg-[#25D366] px-5 py-4 shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition-all hover:bg-[#1ebe56] hover:shadow-[0_14px_30px_rgba(37,211,102,0.36)]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                <WhatsAppIcon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold leading-tight text-white">
                  Chat on WhatsApp
                </p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-white/85">
                  Replies within minutes during business hours.
                </p>
              </div>
              <ArrowRight
                className="size-4 shrink-0 text-white/70 transition-all group-hover:translate-x-0.5 group-hover:text-white"
                aria-hidden="true"
              />
            </Link>
          </li>
          <li>
            <LinkCard
              href="/process"
              Icon={ListChecks}
              title="How to Buy a Car"
              description="Our simple buying process for new and used vehicles."
            />
          </li>
        </ul>

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="https://instagram.com/cchautomobile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-text-tertiary transition-colors hover:border-corporate-black hover:text-corporate-black"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </Link>
          <p className="text-[11px] text-text-tertiary">
            © {new Date().getFullYear()} CCH Automobile · Guangzhou, China
          </p>
        </footer>
      </div>
    </main>
  );
}
