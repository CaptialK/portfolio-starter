"use client";

/**
 * Reveal — fades and lifts its children into place when they scroll into view.
 *
 * WHAT IT DOES
 * Starts invisible and slightly below where it belongs, then settles into
 * position the first time it enters the viewport. Fires once and stays put.
 *
 * WHEN TO USE IT
 * The default for a block of content arriving as you scroll: a heading, a
 * paragraph, an image, a whole section. If you only remember one component in
 * this folder, remember this one.
 *
 * WHEN NOT TO USE IT
 * - For a list of sibling items arriving one after another — use Stagger, which
 *   sequences them. Wrapping six things in six Reveals makes them all fire at
 *   once, which looks like a glitch rather than a sequence.
 * - Above the fold. Content that's already on screen when the page loads
 *   shouldn't need to animate to become readable.
 * - On anything the user is waiting for. A reveal adds latency to reading.
 *
 * PROPS
 * - children   the content. Stays a Server Component — it's passed in, not
 *              rendered by this file.
 * - delay      seconds to wait before starting. Default 0.
 * - y          pixels to travel upward. Default 12. Use 0 for a pure fade.
 * - blur       start slightly out of focus. Default false. Costs more to
 *              render, so save it for one hero moment per page.
 * - as         the element to render. Default "div".
 * - className  passed through.
 *
 * ACCESSIBILITY
 * Under `prefers-reduced-motion` the content renders plainly, with no
 * transform, no fade and no delay. It is never hidden — a reduced-motion user
 * sees everything immediately.
 *
 * Nothing here changes layout: opacity and transform don't affect the box the
 * element occupies, so a Reveal can't cause layout shift.
 *
 * @example
 * <Reveal>
 *   <h2 className="text-lg text-ink">Why not just use Squarespace?</h2>
 * </Reveal>
 *
 * <Reveal delay={0.1} y={24} blur>
 *   <p className="text-md text-ink/85">Ship it in 7 days.</p>
 * </Reveal>
 */

import { motion, useReducedMotion } from "motion/react";
import { duration, ease, viewport } from "@/lib/motion-tokens";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  as?: "div" | "section" | "li" | "span";
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  y = 12,
  blur = false,
  as = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotion();

  // Reduced motion: render the element itself, with no motion attached at all.
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Motion = motion[as];

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewport}
      transition={{ duration: duration.base, ease, delay }}
    >
      {children}
    </Motion>
  );
}
