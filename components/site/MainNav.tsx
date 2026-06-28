"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logomark } from "./Logomark";
import { RequestCarCta } from "./RequestCarCta";

type NavLink = {
  label: string;
  href: string;
  match?: (pathname: string) => boolean;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
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
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md shadow-[0_6px_28px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex h-20 max-w-content items-center justify-between gap-6 px-6">
        <Link href="/" aria-label="CCH Automobile home" className="flex items-center">
          <Logomark size="default" />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-hairline/70 bg-surface-tint/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] lg:flex"
        >
          {navLinks.map((link) => {
            const active = link.match
              ? link.match(pathname)
              : pathname === link.href ||
                (link.href !== "/" &&
                  !link.href.startsWith("/#") &&
                  pathname.startsWith(link.href.split("#")[0]));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "inline-flex items-center rounded-full px-4 py-2 text-[13.5px] font-medium leading-none transition-all duration-200",
                  active
                    ? "bg-cch-red text-white shadow-[0_8px_18px_rgba(230,57,70,0.32)]"
                    : "text-text-secondary hover:bg-white hover:text-corporate-black",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <RequestCarCta
            size="small"
            className="hidden rounded-full px-5 lg:inline-flex"
          >
            Contact Us
          </RequestCarCta>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-hairline/70 bg-surface-tint text-corporate-black transition-colors hover:bg-white lg:hidden"
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
              className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col bg-white lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="flex h-20 items-center justify-between border-b border-hairline/70 px-6">
                <Logomark />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-hairline/70 bg-surface-tint text-corporate-black transition-colors hover:bg-white"
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
                        "rounded-full px-4 py-3 text-[15px] font-medium transition-colors",
                        active
                          ? "bg-cch-red text-white shadow-[0_8px_18px_rgba(230,57,70,0.32)]"
                          : "text-corporate-black hover:bg-surface-tint",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-hairline/70 px-6 py-6">
                <Link
                  href="/request"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-cch-red px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
