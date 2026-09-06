"use client";

/**
 * Hoverable — a card that lifts under the cursor and presses down on click.
 *
 * WHAT IT DOES
 * `whileHover` and `whileTap` are Motion's two "state while something is true"
 * props. No state to manage, no event handlers: the element rises a few pixels
 * with a shadow while hovered, and dips slightly while held.
 *
 * WHEN TO USE IT
 * Anything clickable that looks like a surface — a project card, a link tile,
 * a grid item. The lift is the affordance: it tells you the thing is a target
 * before you click it.
 *
 * WHEN NOT TO USE IT
 * - On something that isn't clickable. A card that lifts and then does nothing
 *   is a broken promise.
 * - On text links and buttons. They have their own hover conventions; a
 *   floating button reads as a mistake.
 * - Nested inside another Hoverable. Two lifts on one pointer is mush.
 * - On the same element as Reveal or StaggerItem. One element answers to the
 *   scroll or to the cursor, never both — wrap the card, don't double up on it.
 *
 * PROPS
 * - children   the card's contents.
 * - lift       pixels to rise. Defaults to `travel.lift`. One step on the
 *              spacing scale; 8 is the most that still looks deliberate.
 * - as         "div" | "li" | "article". Default "div".
 * - className  passed through — put the card's own border, background and
 *              padding here.
 *
 * ACCESSIBILITY
 * Hover and tap effects are decoration; the real affordance is the link or
 * button inside, which keeps its own focus ring. Under `prefers-reduced-motion`
 * the card renders plainly and does not move.
 *
 * Only `transform` and `box-shadow` change, so the card's layout box is fixed
 * and nothing around it reflows.
 *
 * @example
 * <Hoverable className="rounded-lg border border-line bg-panel p-step-4">
 *   <h3 className="text-sm text-ink">Next.js</h3>
 *   <p className="text-xs text-muted">The site framework.</p>
 * </Hoverable>
 */

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { duration, ease, press, travel } from "@/lib/motion-tokens";

type HoverableProps = {
  children: React.ReactNode;
  lift?: number;
  as?: "div" | "li" | "article";
  className?: string;
};

export function Hoverable({
  children,
  lift = travel.lift,
  as = "div",
  className,
}: HoverableProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Motion = motion[as];

  return (
    <Motion
      className={className}
      whileHover={{ y: -lift, boxShadow: "var(--shadow-lift)" }}
      whileTap={{ y: -lift / 2, scale: press.surface }}
      transition={{ duration: duration.fast, ease }}
    >
      {children}
    </Motion>
  );
}
