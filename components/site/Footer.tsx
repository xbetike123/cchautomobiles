import Link from "next/link";

import { CtaButton } from "@/components/site/CtaButton";
import { Logomark } from "@/components/site/Logomark";

const WHATSAPP_PLACEHOLDER_URL = "https://wa.me/0000000000";
const EMAIL_PLACEHOLDER = "operations@example.cchautomobile";

type Group = {
  title: string;
  links: { label: string; href: string }[];
};

const inventoryGroup: Group = {
  title: "Inventory",
  links: [
    { label: "New cars", href: "/lot?condition=new" },
    { label: "Used cars", href: "/lot?condition=used" },
    { label: "On the lot this week", href: "/lot" },
    { label: "Sold archive", href: "/lot/sold" },
  ],
};

const companyGroup: Group = {
  title: "Company",
  links: [
    { label: "Process", href: "/process" },
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
    { label: "WhatsApp", href: WHATSAPP_PLACEHOLDER_URL },
    { label: "FAQ", href: "/about#faq" },
    { label: "Shipping rates", href: "/process#shipping" },
    { label: "Duty calculator", href: "/lot#duty-calculator" },
  ],
};

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Compliance", href: "/compliance" },
];

function FooterColumn({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-4" aria-label={group.title}>
      <p className="text-meta text-text-tertiary">{group.title}</p>
      <ul className="flex flex-col gap-2.5">
        {group.links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-[14px] leading-[1.4] text-corporate-black transition-colors hover:text-cch-red"
              >
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
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-content px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Logomark />
            <p className="text-[14px] leading-[1.5] text-text-secondary">
              Guangzhou export group. EV sourcing for Africa.
            </p>
            <div>
              <CtaButton href="/request" size="small">
                Start a request
              </CtaButton>
            </div>
          </div>
          <FooterColumn group={inventoryGroup} />
          <FooterColumn group={companyGroup} />
          <FooterColumn group={supportGroup} />
          <address className="flex flex-col gap-4 not-italic" aria-label="Contact">
            <p className="text-meta text-text-tertiary">Contact</p>
            <div className="flex flex-col gap-3 text-[14px] leading-[1.5] text-corporate-black">
              <div>
                <p className="text-text-secondary">Guangzhou lot</p>
                <p>Placeholder address line one, Guangzhou, China.</p>
              </div>
              <div>
                <p className="text-text-secondary">Lagos representative</p>
                <p>Placeholder address line one, Lagos, Nigeria.</p>
              </div>
              <Link
                href={WHATSAPP_PLACEHOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-corporate-black hover:text-cch-red"
              >
                WhatsApp · +placeholder
              </Link>
              <Link
                href={`mailto:${EMAIL_PLACEHOLDER}`}
                className="text-corporate-black hover:text-cch-red"
              >
                {EMAIL_PLACEHOLDER}
              </Link>
            </div>
          </address>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-hairline pt-6 text-[12px] text-text-tertiary sm:flex-row sm:items-center">
          <p>&copy; 2026 CCH Automobile. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-corporate-black"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Logomark size="small" />
        </div>
      </div>
    </footer>
  );
}
