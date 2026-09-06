"use client";

/**
 * Magnetic — a button or link that leans toward the cursor as it approaches.
 *
 * WHAT IT DOES
 * Watches the pointer. Inside `radius` pixels of the element's centre it moves
 * a fraction of the way toward the cursor; outside, it springs back. The
 * movement is small on purpose — the effect should register as "this is
 * responsive" and not as "this is running away from me".
 *
 * WHEN TO USE IT
 * The one call to action on a page. Its whole value is that it's rare.
 *
 * WHEN NOT TO USE IT
 * - On more than one element per screen. Two magnets is a fairground.
 * - On anything in a dense list or a nav bar. Moving hit targets are harder to
 *   click, and that cost only buys you something on a target you *want* people
 *   to notice.
 * - On anything small. Under about 44px the element can slide out from under
 *   the cursor mid-click.
 *
 * PROPS
 * - children   the button or link.
 * - radius     pixels within which it responds. Default 120.
 * - pull       how far it travels, as a fraction of the cursor's distance from
 *              centre. Default 0.25. Above ~0.4 it stops feeling like a hint.
 * - className  passed through.
 *
 * ACCESSIBILITY
 * Disabled entirely — no listener attached, nothing wrapped in motion — on
 * touch devices (`pointer: coarse`, where there is no hovering cursor to
 * follow) and under `prefers-reduced-motion`. The child renders and behaves
 * exactly as it would on its own, so keyboard focus and clicks are untouched.
 *
 * Only `transform` changes, so the element's layout box never moves and
 * nothing around it can shift.
 *
 * @example
 * <Magnetic>
 *   <Link href="/work" className="rounded-lg bg-accent px-step-3 py-step-2">
 *     See the work
 *   </Link>
 * </Magnetic>
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { spring } from "@/lib/motion-tokens";

type MagneticProps = {
  children: React.ReactNode;
  radius?: number;
  pull?: number;
  className?: string;
};

export function Magnetic({
  children,
  radius = 120,
  pull = 0.25,
  className,
}: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  // Resolved after mount only. Checking this during render would make the
  // server and the browser disagree about what to draw.
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;

    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;

      const box = node.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) < radius) {
        x.set(dx * pull);
        y.set(dy * pull);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, radius, pull, x, y]);

  if (!active) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x, y }}
    >
      {children}
    </motion.span>
  );
}
