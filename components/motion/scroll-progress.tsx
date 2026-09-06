"use client";

/**
 * ScrollProgress — a thin accent bar pinned to the top of the window that
 * fills as you scroll down the page.
 *
 * WHAT IT DOES
 * `useScroll` gives a value from 0 at the top of the document to 1 at the
 * bottom. That value drives the bar's horizontal scale. A spring sits in
 * between so the bar eases toward the scroll position instead of twitching
 * with every wheel tick.
 *
 * WHEN TO USE IT
 * Long pages where "how much is left?" is a real question — the course at
 * /guide, a long case study. One per page.
 *
 * WHEN NOT TO USE IT
 * - Short pages. A progress bar that's 80% full when the page loads is noise.
 * - Alongside another progress indicator for the same scroll. On /guide the
 *   section rail already says where you are; this bar and that rail are
 *   deliberately the only two, and they say different things (how far through
 *   the page vs. which section).
 *
 * PROPS
 * None. It measures the whole document.
 *
 * ACCESSIBILITY
 * `aria-hidden` — it's decoration, and the information it carries is available
 * from the scrollbar itself. Under `prefers-reduced-motion` it renders nothing
 * at all: a bar whose whole purpose is to move can't be usefully stilled, and
 * the page loses nothing without it.
 *
 * It's `position: fixed`, so it's outside the document flow and can't shift
 * anything below it.
 *
 * @example
 * // Near the top of a long page's JSX:
 * <ScrollProgress />
 */

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { spring } from "@/lib/motion-tokens";

export function ScrollProgress() {
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();

  // Hooks have to run in the same order every render, so this spring is created
  // whether or not it gets used. Cheap, and it keeps the early return legal.
  const scaleX = useSpring(scrollYProgress, spring);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-step-1 origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
