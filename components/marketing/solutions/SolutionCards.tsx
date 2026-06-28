import {
  ArrowRight,
  Building2,
  Compass,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type CardAction =
  | { kind: "link"; href: string; label: string }
  | { kind: "request"; label: string };

type SolutionCard = {
  title: string;
  icon: LucideIcon;
  body: string;
  action: CardAction;
};

const CARDS: SolutionCard[] = [
  {
    title: "Individual Buyers",
    icon: User,
    body: "Your first EV. Your next family car. Sourced direct from BYD, Geely, Zeekr, Xpeng, or Leapmotor — or from a first-owner used unit on the lot. Filmed, inspected, and shipped to your port.",
    action: { kind: "request", label: "Request a Car" },
  },
  {
    title: "Dealers & Resellers",
    icon: Store,
    body: "Volume pricing on mixed-model containers. Standing supply from our Guangzhou desks. Built for dealerships moving units month after month.",
    action: { kind: "request", label: "Request a Bulk Quote" },
  },
  {
    title: "Fleet & Corporate Buyers",
    icon: Building2,
    body: "Ten units. Fifty. A hundred. Factory-direct allocation for ride-hailing, logistics, and corporate fleets — with warranty coverage and delivery timelines you can plan against.",
    action: { kind: "request", label: "Talk to Our Fleet Desk" },
  },
  {
    title: "First-Time Importers",
    icon: Compass,
    body: "New to importing? We walk you through every step. Six clear stages from first request to doorstep delivery — with a real person from Guangzhou on every shipment.",
    action: { kind: "link", href: "#how-it-works", label: "See How It Works" },
  },
];

export function SolutionCards() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="group relative flex h-full flex-col rounded-card-lg border border-hairline bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cch-red/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-cch-red-soft text-cch-red">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-semibold leading-snug tracking-tight text-corporate-black">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-[1.6] text-text-secondary">
                  {card.body}
                </p>
                <div className="mt-6">
                  {card.action.kind === "link" ? (
                    <Link
                      href={card.action.href}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cch-red transition-colors hover:text-cch-red-hover"
                    >
                      {card.action.label}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/request"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cch-red transition-colors hover:text-cch-red-hover"
                    >
                      {card.action.label}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
