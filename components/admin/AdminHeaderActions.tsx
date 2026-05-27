"use client";

import { Menu } from "@base-ui/react/menu";
import { Popover } from "@base-ui/react/popover";
import {
  Bell,
  CircleHelp,
  LogOut,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import type { AdminProfile } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<AdminProfile["role"], string> = {
  admin: "Admin",
  sales: "Sales",
  operations: "Operations",
  read_only: "Read only",
};

type Notification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "alert" | "info" | "success";
};

// Placeholder feed. Wire to a queries function when the activity log lands.
const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Source-to-order SLA approaching",
    detail: "Lead LD-1042 · 11h to deadline",
    time: "12m ago",
    tone: "alert",
  },
  {
    id: "n2",
    title: "Quote sent",
    detail: "QT-2218 · Atto 3 to Lagos Apapa",
    time: "1h ago",
    tone: "info",
  },
  {
    id: "n3",
    title: "Deposit received",
    detail: "Lead LD-1029 · $1,500 on CCH-2026-014",
    time: "Yesterday",
    tone: "success",
  },
];

const TONE_DOT: Record<Notification["tone"], string> = {
  alert: "bg-cch-red",
  info: "bg-corporate-black/70",
  success: "bg-emerald-500",
};

type Props = {
  profile: AdminProfile;
};

export function AdminHeaderActions({ profile }: Props) {
  const initials = profile.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const unread = NOTIFICATIONS.length;

  return (
    <div className="flex items-center gap-2">
      <Popover.Root>
        <Popover.Trigger
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="relative inline-flex size-9 items-center justify-center rounded-full bg-surface-tint text-corporate-black transition-colors hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-black focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Bell className="size-4" aria-hidden="true" />
          {unread > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-cch-red text-[9px] font-semibold text-white ring-2 ring-white"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={10} align="end">
            <Popover.Popup
              className={cn(
                "z-50 w-80 origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_24px_60px_rgba(10,10,10,0.18)]",
                "transition-all duration-150",
                "data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
                "data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0",
              )}
            >
              <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                <Popover.Title className="text-[13px] font-semibold text-corporate-black">
                  Notifications
                </Popover.Title>
                <Link
                  href="/admin/activity"
                  className="text-[11.5px] font-medium text-text-tertiary hover:text-corporate-black"
                >
                  View all
                </Link>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id}>
                    <div className="flex items-start gap-3 px-4 py-3 hover:bg-surface-tint/60">
                      <span
                        aria-hidden="true"
                        className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", TONE_DOT[n.tone])}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-corporate-black">
                          {n.title}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                          {n.detail}
                        </p>
                        <p className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Menu.Root>
        <Menu.Trigger className="group flex items-center gap-2.5 rounded-full bg-surface-tint px-2 py-1.5 pr-3 transition-colors hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-black focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[popup-open]:bg-white data-[popup-open]:shadow-sm">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-full bg-corporate-black text-[11px] font-semibold text-white"
          >
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[12.5px] font-medium leading-tight text-corporate-black">
              {profile.fullName}
            </span>
            <span className="block text-[10.5px] leading-tight text-text-tertiary">
              {ROLE_LABEL[profile.role]}
            </span>
          </span>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={10} align="end">
            <Menu.Popup
              className={cn(
                "z-50 w-56 origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-hairline bg-white py-1.5 shadow-[0_24px_60px_rgba(10,10,10,0.18)]",
                "transition-all duration-150",
                "data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
                "data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0",
              )}
            >
              <div className="border-b border-hairline px-3.5 pb-2.5 pt-1.5">
                <p className="truncate text-[13px] font-medium text-corporate-black">
                  {profile.fullName}
                </p>
                <p className="truncate text-[11.5px] text-text-tertiary">
                  {profile.email}
                </p>
              </div>
              <MenuLink href="/admin/profile" icon={UserRound}>
                Profile
              </MenuLink>
              <MenuLink href="/admin/settings" icon={SettingsIcon}>
                Settings
              </MenuLink>
              <MenuLink href="/admin/help" icon={CircleHelp}>
                Help &amp; docs
              </MenuLink>
              <div className="my-1 h-px bg-hairline" role="separator" />
              <Menu.Item
                render={
                  <Link
                    href="/admin/signout"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-cch-red transition-colors data-[highlighted]:bg-cch-red/5"
                  />
                }
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}

type MenuLinkProps = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

function MenuLink({ href, icon: Icon, children }: MenuLinkProps) {
  return (
    <Menu.Item
      render={
        <Link
          href={href}
          className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-corporate-black transition-colors data-[highlighted]:bg-surface-tint"
        />
      }
    >
      <Icon className="size-4 text-text-secondary" aria-hidden="true" />
      {children}
    </Menu.Item>
  );
}
