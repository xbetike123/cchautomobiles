"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
};

/**
 * Wraps a home page section in a one-shot fade-in on scroll into view,
 * per the cchubbuild.md animation discipline: max 400ms duration,
 * 12px translate distance, ease-out.
 *
 * Always renders motion.div on both server and client to keep the DOM
 * structure identical and avoid hydration mismatches.
 *
 * Reduced motion is honored by zeroing out the offset + duration so the
 * section appears in its final state immediately — without branching the
 * JSX tree, which would cause SSR/client divergence when the OS preference
 * is set.
 */
export function SectionReveal({ children }: SectionRevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
