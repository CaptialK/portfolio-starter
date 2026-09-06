"use client";

/**
 * DragRail — a horizontal strip you can drag sideways when it's wider than the
 * screen.
 *
 * WHAT IT DOES
 * Measures its own content against its container. If the content overflows, the
 * inner track becomes draggable along x, bounded so you can't fling it away
 * from the content. If it fits, dragging is switched off and it behaves as an
 * ordinary row.
 *
 * WHEN TO USE IT
 * A sequence too wide for a phone that shouldn't be re-stacked vertically —
 * a timeline, a set of steps where the left-to-right order carries meaning.
 *
 * WHEN NOT TO USE IT
 * - For content that stacks fine. A column beats a drag every time.
 * - For anything essential. Off-screen content is content some people never
 *   find; keep the first item enough to stand on its own.
 * - For long lists. Dragging through twenty items is worse than scrolling.
 *
 * PROPS
 * - children   the items, laid out in a row by this component.
 * - gap        Tailwind gap class for the row. Default "gap-step-3".
 * - className  passed through to the outer container.
 *
 * ACCESSIBILITY
 * Drag alone is unreachable by keyboard, so the container is focusable and
 * responds to Left/Right arrows and Home/End, moving by one viewport-width at a
 * time. It's labelled as a scrollable region so it's announced as one. Under
 * `prefers-reduced-motion` dragging still works — it's the user's own gesture,
 * not an animation — but the momentum and the rubber-band at the ends are
 * turned off, and arrow-key moves jump instead of gliding.
 *
 * LAYOUT
 * Only `transform` moves, and the container's own size never changes.
 *
 * @example
 * <DragRail>
 *   {days.map((day) => (
 *     <article key={day.n} className="w-64 shrink-0 rounded-lg border border-line p-step-4">
 *       {day.title}
 *     </article>
 *   ))}
 * </DragRail>
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { duration, ease } from "@/lib/motion-tokens";

/** Fraction of the visible width one arrow-key press travels. */
const KEYBOARD_STEP = 0.8;

type DragRailProps = {
  children: React.ReactNode;
  gap?: string;
  className?: string;
};

export function DragRail({
  children,
  gap = "gap-step-3",
  className,
}: DragRailProps) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  /** How far left the track may travel. 0 means the content already fits. */
  const [range, setRange] = useState(0);

  useEffect(() => {
    const frameNode = frame.current;
    const trackNode = track.current;
    if (!frameNode || !trackNode) return;

    const measure = () => {
      const overflow = trackNode.scrollWidth - frameNode.clientWidth;
      const next = Math.max(0, overflow);
      setRange(next);
      // If the window grew and the track is now parked past its new limit,
      // pull it back so there's no empty gap at the end.
      if (x.get() < -next) x.set(-next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frameNode);
    observer.observe(trackNode);
    return () => observer.disconnect();
  }, [x]);

  const draggable = range > 0;

  const nudge = useCallback(
    (direction: -1 | 1, toEnd = false) => {
      const frameNode = frame.current;
      if (!frameNode) return;
      // Move by most of a screenful, not all of it: leaving a sliver of the
      // previous item visible is what tells you the row kept going.
      const step = frameNode.clientWidth * KEYBOARD_STEP;
      const target = toEnd
        ? direction < 0
          ? 0
          : -range
        : Math.min(0, Math.max(-range, x.get() - direction * step));
      animate(x, target, reduced ? { duration: 0 } : { duration: duration.base, ease });
    },
    [range, x, reduced],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!draggable) return;
    const keys: Record<string, () => void> = {
      ArrowRight: () => nudge(1),
      ArrowLeft: () => nudge(-1),
      Home: () => nudge(-1, true),
      End: () => nudge(1, true),
    };
    const handler = keys[event.key];
    if (!handler) return;
    event.preventDefault();
    handler();
  };

  return (
    <div
      ref={frame}
      role={draggable ? "region" : undefined}
      aria-label={draggable ? "Scrollable, use the left and right arrow keys" : undefined}
      tabIndex={draggable ? 0 : undefined}
      onKeyDown={onKeyDown}
      className={`overflow-hidden ${className ?? ""}`}
    >
      <motion.div
        ref={track}
        className={`flex ${gap} ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ x }}
        drag={draggable ? "x" : false}
        dragConstraints={{ left: -range, right: 0 }}
        dragElastic={reduced ? 0 : 0.06}
        dragMomentum={!reduced}
        transition={reduced ? { duration: 0 } : { duration: duration.base, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}
