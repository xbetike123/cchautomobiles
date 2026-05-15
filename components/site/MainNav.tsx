"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CtaButton } from "./CtaButton";
import { Logomark } from "./Logomark";

type NavLink = {
  label: string;
  href: string;
  match?: (pathname: string) => boolean;
};

const navLinks: NavLink[] = [
  {
    label: "New cars",
    href: "/lot?condition=new",
    match: (p) => p === "/lot",
  },
  {
    label: "Used cars",
    href: "/lot?condition=used",
    match: (p) => p === "/lot",
  },
  { label: "Process", href: "/process" },
  {
    label: "On the lot",
    href: "/lot",
    match: (p) => p.startsWith("/lot"),
  },
  { label: "Brands", href: "/#brands" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/request" },
];

export function MainNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trackedPathname, setTrackedPathname] = useState(pathname);

  if (trackedPathname !== pathname) {
    setTrackedPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background">
      <div className="mx-auto flex h-18 max-w-content items-center justify-between px-6">
        <Link href="/" aria-label="CCH Automobile home">
          <Logomark />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-10 lg:flex"
        >
          {navLinks.map((link) => {
            const active = link.match
              ? link.match(pathname)
              : pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active
                    ? "text-cch-red"
                    : "text-corporate-black hover:text-cch-red",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <CtaButton href="/request" size="small" className="hidden lg:inline-flex">
            Request a Car
          </CtaButton>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="inline-flex size-10 items-center justify-center text-corporate-black lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-40 bg-corporate-black/30 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col bg-background lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="flex h-18 items-center justify-between border-b border-hairline px-6">
                <Logomark />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex size-10 items-center justify-center text-corporate-black"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
              <nav
                aria-label="Mobile"
                className="flex flex-1 flex-col gap-1 px-6 py-6"
              >
                {navLinks.map((link) => {
                  const active = link.match
                    ? link.match(pathname)
                    : pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "border-b border-hairline py-4 text-base font-medium",
                        active ? "text-cch-red" : "text-corporate-black",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-hairline px-6 py-6">
                <CtaButton href="/request" className="w-full">
                  Request a Car
                </CtaButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
