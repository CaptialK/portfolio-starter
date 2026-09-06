"use client";

/**
 * A short fade between pages.
 *
 * A `template` is like a `layout`, with one difference that matters here: a
 * layout stays put when you move between pages, and a template is rebuilt each
 * time. That rebuild is what gives every page something to fade in from.
 *
 * It is deliberately only a fade, and a fast one. Anything that slides or
 * scales makes the site feel slower than it is, and you'd feel it on every
 * single click.
 *
 * Under `prefers-reduced-motion` there's no fade at all: the page is simply
 * there.
 */

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { ease } from "@/lib/motion-tokens";

/** 200ms. Short enough to feel instant, long enough to soften the change. */
const PAGE_FADE = 0.2;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: PAGE_FADE, ease }}
    >
      {children}
    </motion.div>
  );
}
