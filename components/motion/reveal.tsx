"use client";

/**
 * Reveal — settles its children into place when they scroll into view.
 *
 * WHAT IT DOES
 * The first time the element enters the viewport it moves into position and
 * stays there. Fires once.
 *
 * TWO MODES, AND THIS IS THE IMPORTANT PART
 * - `enter` (default) — starts invisible and slightly low, then fades and
 *   rises. For anything below the fold.
 * - `settle` — starts fully visible and slightly low, then rises. Nothing
 *   fades. **Use this for anything that might be on screen when the page
 *   loads.** Content that fades up from nothing above the fold means the first
 *   thing a visitor sees is a blank space, which costs you the first second of
 *   their attention and shows up as a bad Largest Contentful Paint.
 *
 * WHEN TO USE IT
 * The default for a block of content arriving as you scroll: a heading, a
 * paragraph, an image, a whole section.
 *
 * WHEN NOT TO USE IT
 * - For a list of sibling items arriving one after another — use Stagger, which
 *   sequences them. Six things in six Reveals all fire at once, which reads as
 *   a glitch rather than a sequence.
 * - On the same element as Hoverable. One element should answer to the scroll
 *   or to the cursor, not both — put the Reveal on a wrapper and the Hoverable
 *   on the card inside it.
 * - On anything the user is waiting for. A reveal adds latency to reading.
 *
 * PROPS
 * - children   the content. Stays a Server Component — it's passed in, not
 *              rendered by this file.
 * - mode       "enter" (default) or "settle". See above.
 * - delay      seconds to wait before starting. Default 0.
 * - y          pixels to travel upward. Defaults to `travel.rise`.
 * - blur       start slightly out of focus. Default false. Ignored in
 *              `settle` mode, where nothing may start hidden. Costs more to
 *              render, so save it for one moment per page.
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
 * // Below the fold: fade and rise.
 * <Reveal>
 *   <h2 className="text-lg text-ink">Why not just use Squarespace?</h2>
 * </Reveal>
 *
 * // Above the fold: visible on the first frame, then settles.
 * <Reveal mode="settle">
 *   <h1 className="text-2xl text-ink">Ship it in 7 days.</h1>
 * </Reveal>
 */

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { duration, ease, travel, viewport } from "@/lib/motion-tokens";

type RevealProps = {
  children: React.ReactNode;
  mode?: "enter" | "settle";
  delay?: number;
  y?: number;
  blur?: boolean;
  as?: "div" | "section" | "li" | "span";
  className?: string;
};

export function Reveal({
  children,
  mode = "enter",
  delay = 0,
  y = travel.rise,
  blur = false,
  as = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotionSafe();

  // Reduced motion: render the element itself, with no motion attached at all.
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const settle = mode === "settle";
  const Motion = motion[as];

  return (
    <Motion
      className={className}
      initial={{
        // `settle` never starts hidden — that's the whole point of it.
        opacity: settle ? 1 : 0,
        y,
        filter: blur && !settle ? `blur(${travel.blur}px)` : "blur(0px)",
      }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewport}
      transition={{ duration: duration.base, ease, delay }}
    >
      {children}
    </Motion>
  );
}
