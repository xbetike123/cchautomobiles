import {
  AlertTriangle,
  Inbox,
  TimerReset,
} from "lucide-react";
import Link from "next/link";

import type { AdminProfile } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type Chip = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href: string;
  tone: "alert" | "warn" | "neutral";
};

type Props = {
  profile: AdminProfile;
  hour: number; // 0-23, in the target timezone
  newLeadsThisWeek: number;
  deadlinesIn12h: number;
  waitResponsesPending: number;
};

function greetingFor(hour: number): string {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Working late";
}

function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

const TONE_STYLES: Record<Chip["tone"], string> = {
  alert:
    "border-cch-red/30 bg-cch-red-soft text-cch-red hover:border-cch-red/60",
  warn: "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300",
  neutral:
    "border-hairline bg-white text-corporate-black hover:border-corporate-black/30",
};

export function DashboardWelcome({
  profile,
  hour,
  newLeadsThisWeek,
  deadlinesIn12h,
  waitResponsesPending,
}: Props) {
  const firstName = firstNameOf(profile.fullName);
  const greeting = greetingFor(hour);

  const chips: Chip[] = [
    {
      icon: AlertTriangle,
      label: deadlinesIn12h === 1 ? "deadline in 12h" : "deadlines in 12h",
      value: deadlinesIn12h,
      href: "/admin/leads?track=source_to_order",
      tone: "alert",
    },
    {
      icon: TimerReset,
      label: "waiting on reply",
      value: waitResponsesPending,
      href: "/admin/leads?status=contacted",
      tone: "warn",
    },
    {
      icon: Inbox,
      label: newLeadsThisWeek === 1 ? "new lead this week" : "new leads this week",
      value: newLeadsThisWeek,
      href: "/admin/leads?status=new",
      tone: "neutral",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-white via-surface-tint/40 to-surface-tint/80 shadow-card">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-cch-red-soft/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-corporate-black/[0.04] blur-3xl"
      />

      <div className="relative px-6 py-6 md:px-7 md:py-7">
        <h2 className="font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.01em] text-corporate-black md:text-[28px]">
          {greeting}, {firstName}.
        </h2>
        <p className="mt-1.5 max-w-[640px] text-[14px] leading-[1.5] text-text-secondary">
          Here&apos;s what&apos;s happening on the CCH lot today. Jump straight
          into the queues that need a human.
        </p>

        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => {
            const Icon = chip.icon;
            return (
              <li key={chip.label}>
                <Link
                  href={chip.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                    TONE_STYLES[chip.tone],
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span className="tabular-nums font-semibold">
                    {chip.value}
                  </span>
                  <span>{chip.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
