"use client";

import {
  Car,
  FileText,
  Inbox,
  LayoutDashboard,
  Receipt,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Car Requests", icon: Inbox },
      { href: "/admin/inventory", label: "Inventory", icon: Car },
      { href: "/admin/quotes", label: "Car Quote", icon: FileText },
      { href: "/admin/invoices", label: "Invoices", icon: Receipt },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-[#0a0a0a] text-white lg:flex">
      <div className="flex h-20 items-center px-6">
        <Image
          src="/logo/logo_only.png"
          alt="CCH Automobile"
          width={40}
          height={40}
          priority
          className="size-10 shrink-0 object-contain invert"
        />
      </div>

      <nav className="flex-1 px-4 py-2" aria-label="Admin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mt-4 first:mt-0">
            <p className="px-3 pb-2 pt-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/35">
              {section.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors",
                        active
                          ? "bg-white/8 text-white"
                          : "text-white/65 hover:bg-white/4 hover:text-white",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-0 top-1.5 bottom-1.5 w-0.75 rounded-r bg-cch-red transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Icon
                        className={cn(
                          "size-4.25 shrink-0 transition-colors",
                          active
                            ? "text-cch-red"
                            : "text-white/55 group-hover:text-white/80",
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

    </aside>
  );
}
