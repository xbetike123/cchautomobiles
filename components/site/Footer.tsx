import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { Logomark } from "@/components/site/Logomark";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M21.6 7.2c-.2-1.2-1.2-2.2-2.4-2.4C17 4.4 12 4.4 12 4.4s-5 0-7.2.4c-1.2.2-2.2 1.2-2.4 2.4C2 9.2 2 12 2 12s0 2.8.4 4.8c.2 1.2 1.2 2.2 2.4 2.4 2.2.4 7.2.4 7.2.4s5 0 7.2-.4c1.2-.2 2.2-1.2 2.4-2.4.4-2 .4-4.8.4-4.8s0-2.8-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9V15h-2.5v-3h2.5V9.6c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.8l-.4 3h-2.4v6.9C18.3 21.1 22 17 22 12z" />
    </svg>
  );
}

function ThreadsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M17.5 11.3c-.1 0-.1-.1-.2-.1-.1-1.7-.9-2.6-2.4-2.7-.9 0-1.7.4-2.2 1.1l1.1.7c.4-.5.9-.6 1.4-.6.6.1.9.4 1.1 1.1-.7-.1-1.4-.1-2.1 0-2 .1-3.3 1.2-3.2 2.8 0 .7.4 1.3.9 1.7.6.4 1.4.7 2.3.6 1.1-.1 1.9-.5 2.5-1.3.4-.6.7-1.4.7-2.3.4.2.7.6.9 1 .3.7.4 1.7-.4 2.6-.7.8-1.6 1.2-2.9 1.2-1.5 0-2.7-.5-3.5-1.5C9.7 13 9.7 11.1 9.7 11c0-.2 0-2.1.8-3.2.8-1 2-1.5 3.5-1.5 1.6 0 2.8.5 3.6 1.5.5.6.9 1.4 1 2.3l1.4-.4c-.2-1.1-.7-2.1-1.4-2.9-1-1.2-2.6-1.9-4.6-1.9-2 0-3.5.7-4.6 1.9-1 1.2-1.5 2.8-1.5 4.7v.1c0 1.9.5 3.6 1.5 4.8 1.1 1.2 2.7 1.9 4.6 1.9 1.7 0 3-.4 4-1.2 1.3-1 2-2.6 1.8-4.1-.1-.7-.4-1.4-.9-1.9zm-3.4 3c-1 .1-1.9-.4-2-1.3 0-.6.4-1.4 2.1-1.5h.3c.4 0 .7 0 1.1.1-.2 1.7-.9 2.6-1.5 2.7z" />
    </svg>
  );
}

const OPERATIONS_EMAIL = "hello@chinesecarshub.com";
const OPERATIONS_PHONE = "+86 131 0670 0341";
const INSTAGRAM_PLACEHOLDER_URL = "https://instagram.com/cchautomobile";
const YOUTUBE_PLACEHOLDER_URL = "https://youtube.com/@cchautomobile";
const FACEBOOK_PLACEHOLDER_URL = "https://facebook.com/cchautomobile";
const THREADS_PLACEHOLDER_URL = "https://threads.net/@cchautomobile";

type Group = {
  title: string;
  links: { label: string; href: string }[];
};

const inventoryGroup: Group = {
  title: "Inventory",
  links: [
    { label: "New Cars", href: "/lot?condition=new" },
    { label: "Used Cars", href: "/lot?condition=used" },
    { label: "In the Lot This Week", href: "/lot" },
    { label: "Sold Archive", href: "/lot/sold" },
  ],
};

const companyGroup: Group = {
  title: "Company",
  links: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/about#team" },
    { label: "Market intel", href: "/intel" },
    { label: "Careers", href: "/about#careers" },
  ],
};

const supportGroup: Group = {
  title: "Support",
  links: [
    { label: "Contact", href: "/request" },
    { label: "FAQ", href: "/faq" },
  ],
};

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Compliance", href: "/compliance" },
];

type Social = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const socials: Social[] = [
  { label: "Instagram", href: INSTAGRAM_PLACEHOLDER_URL, Icon: InstagramIcon },
  { label: "Facebook", href: FACEBOOK_PLACEHOLDER_URL, Icon: FacebookIcon },
  { label: "Threads", href: THREADS_PLACEHOLDER_URL, Icon: ThreadsIcon },
  { label: "YouTube", href: YOUTUBE_PLACEHOLDER_URL, Icon: YoutubeIcon },
];

function FooterColumn({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-5" aria-label={group.title}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
        {group.title}
      </p>
      <ul className="flex flex-col gap-3">
        {group.links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 text-[14px] leading-[1.4] text-white/65 transition-colors hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-1 rounded-full bg-cch-red/0 transition-colors group-hover:bg-cch-red"
                />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-corporate-black text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cch-red to-transparent"
      />
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Logomark size="default" className="[&_img]:invert" />
              <p className="max-w-[340px] text-[14px] leading-[1.65] text-white/70">
                Your trusted partner for new and carefully selected used
                Chinese vehicles, sourced directly from factories and first
                owners.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-[13px] text-white/80">
              <a
                href={`tel:${OPERATIONS_PHONE.replace(/\s+/g, "")}`}
                className="group inline-flex items-center gap-3 transition-colors hover:text-white"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-cch-red">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                {OPERATIONS_PHONE}
              </a>
              <a
                href={`mailto:${OPERATIONS_EMAIL}`}
                className="group inline-flex items-center gap-3 transition-colors hover:text-white"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-cch-red">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                {OPERATIONS_EMAIL}
              </a>
              <span className="inline-flex items-start gap-3 text-white/60">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="pt-1.5 leading-[1.45]">
                  101-103 Agile Time Mansion,
                  <br />
                  Wehai Road, Shibi, Panyu District,
                  <br />
                  Guangzhou, China
                </span>
              </span>
            </div>

          </div>

          <FooterColumn group={inventoryGroup} />
          <FooterColumn group={companyGroup} />
          <div className="flex flex-col gap-6">
            <FooterColumn group={supportGroup} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Follow us
              </p>
              <ul className="mt-3 flex items-center gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all hover:-translate-y-0.5 hover:border-cch-red hover:bg-cch-red hover:text-white"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-[12px] text-white/55 sm:flex-row sm:items-center">
          <p>&copy; 2026 CCH Automobile. All Rights Reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
