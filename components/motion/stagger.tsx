"use client";

/**
 * Stagger + StaggerItem — brings a list in one item at a time.
 *
 * WHAT IT DOES
 * Stagger is the parent; StaggerItem wraps each child. When the parent scrolls
 * into view it tells its children to animate in sequence rather than together.
 * The children don't each watch the scroll position — the parent does it once
 * and passes the signal down. That's what "variants" means in Motion: named
 * states a parent can hand to its children.
 *
 * WHEN TO USE IT
 * Any set of sibling things that arrive together: cards in a grid, bullets in
 * a list, rows in a table, steps in a sequence. The eye reads a stagger as
 * "here are several things", where a single fade reads as "here is one block".
 *
 * WHEN NOT TO USE IT
 * - For one element. That's Reveal.
 * - For a list long enough to blow the animation budget. gap × (n − 1) plus one
 *   child's own animation must stay under MAX_DURATION (800ms) — that's seven
 *   children at the default 60ms gap, or eleven at the 40ms floor. In
 *   development this component works that out and warns you in the console.
 * - Around items that already animate themselves for another reason. Two
 *   animations on one element fight and neither reads clearly.
 *
 * PROPS — Stagger
 * - children   the StaggerItems.
 * - gap        seconds between children. Defaults to `staggerGap` in
 *              lib/motion-tokens.ts, and must stay between MIN_STAGGER_GAP and
 *              MAX_STAGGER_GAP (40-80ms). Raise it to make a short list feel
 *              deliberate, lower it to keep a long one brisk.
 * - delay      seconds before the first child starts. Default 0.
 * - as         "div" | "ul" | "ol". Use ul/ol when it really is a list, so it
 *              is announced as one.
 * - className  passed through.
 *
 * PROPS — StaggerItem
 * - children, as ("div" | "li"), className. Same idea.
 *
 * ACCESSIBILITY
 * Under `prefers-reduced-motion` both render as plain elements. No transform,
 * no sequence, everything visible at once.
 *
 * @example
 * <Stagger as="ul" className="grid gap-step-3 md:grid-cols-3">
 *   {cards.map((card) => (
 *     <StaggerItem as="li" key={card.id}>
 *       <Hoverable>{card.title}</Hoverable>
 *     </StaggerItem>
 *   ))}
 * </Stagger>
 */

import { Children } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import {
  duration,
  ease,
  MAX_DURATION,
  MAX_STAGGER_GAP,
  MIN_STAGGER_GAP,
  staggerGap,
  travel,
  viewport,
} from "@/lib/motion-tokens";

type StaggerProps = {
  children: React.ReactNode;
  gap?: number;
  delay?: number;
  as?: "div" | "ul" | "ol";
  className?: string;
};

export function Stagger({
  children,
  gap = staggerGap,
  delay = 0,
  as = "div",
  className,
}: StaggerProps) {
  const reduced = useReducedMotionSafe();

  // A stagger's real length is gap x (children - 1) + one child's own
  // animation. It is easy to blow the budget without noticing, because each
  // individual child still looks fast — so say so, loudly, in development.
  if (process.env.NODE_ENV === "development") {
    const count = Children.count(children);
    const total = gap * Math.max(0, count - 1) + duration.base + delay;
    if (gap < MIN_STAGGER_GAP || gap > MAX_STAGGER_GAP) {
      console.warn(
        `[Stagger] gap of ${gap * 1000}ms is outside the ${MIN_STAGGER_GAP * 1000}` +
          `-${MAX_STAGGER_GAP * 1000}ms range. Below it the sequence stops reading ` +
          `as one; above it the last item feels like waiting.`,
      );
    }
    if (total > MAX_DURATION) {
      console.warn(
        `[Stagger] ${count} children at a ${gap * 1000}ms gap take ${Math.round(total * 1000)}ms ` +
          `to finish, over the ${MAX_DURATION * 1000}ms budget. Lower the gap ` +
          `(${MIN_STAGGER_GAP * 1000}ms is the floor) or split the list.`,
      );
    }
  }

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  // The parent animates nothing itself. Its only job is to hold the two state
  // names and the timing that sequences whichever children are inside it.
  const parent: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: gap, delayChildren: delay } },
  };

  const Motion = motion[as];

  return (
    <Motion
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
    >
      {children}
    </Motion>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  as?: "div" | "li" | "span";
  className?: string;
};

export function StaggerItem({
  children,
  as = "div",
  className,
}: StaggerItemProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  // The child names the same two states the parent does. It never sets
  // `initial` or `whileInView` — it inherits both from the parent.
  const child: Variants = {
    hidden: { opacity: 0, y: travel.rise },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.base, ease },
    },
  };

  const Motion = motion[as];

  return (
    <Motion className={className} variants={child}>
      {children}
    </Motion>
  );
}
