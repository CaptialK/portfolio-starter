"use client";

/**
 * Counter — counts a number up from zero when it scrolls into view.
 *
 * WHAT IT DOES
 * Holds the number in a MotionValue — a value Motion can animate without
 * re-rendering React on every frame — and animates it to the target once, the
 * first time it's on screen.
 *
 * WHEN TO USE IT
 * A single figure that is the point of the sentence: "**3** case studies",
 * "**46%** fewer tickets". The count draws the eye to the number, which is
 * where you wanted it.
 *
 * WHEN NOT TO USE IT
 * - More than two or three on a screen. A wall of counting numbers reads as a
 *   dashboard, not a portfolio.
 * - For anything precise the reader might be mid-way through reading — a
 *   price, a date, a version. They'll read a wrong number on the way past.
 * - For numbers inside running prose. It pulls focus out of the sentence.
 *
 * PROPS
 * - to          the number to land on. Required.
 * - prefix      text before the number, e.g. "$". Not animated.
 * - suffix      text after it, e.g. "%" or "px". Not animated.
 * - className   passed through.
 *
 * ACCESSIBILITY
 * The final value is always in the DOM as real text for screen readers; the
 * animating digits are `aria-hidden`. Under `prefers-reduced-motion` the number
 * simply renders at its final value.
 *
 * LAYOUT
 * The animating number is stacked on top of an invisible copy of the final
 * value, so the element is the width of "800" from the first frame and nothing
 * beside it moves as the digits change. `tabular-nums` keeps every digit the
 * same width, so it doesn't jitter as it counts either.
 *
 * @example
 * <p className="text-xl text-ink">
 *   <Counter to={3} /> case studies. Not 6.
 * </p>
 *
 * // A range is two counters:
 * <span><Counter to={500} />–<Counter to={800} /> words each</span>
 */

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { duration, ease, viewport } from "@/lib/motion-tokens";

type CounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function Counter({ to, prefix = "", suffix = "", className }: CounterProps) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: viewport.once, amount: viewport.amount });

  const count = useMotionValue(0);
  const text = useTransform(count, (value) => Math.round(value).toLocaleString());

  // `useInView` reports false on the server and on the first client render, so
  // it doubles as the "have we mounted yet" signal. No extra state needed.
  const running = inView && !reduced;

  useEffect(() => {
    if (!running) return;
    const controls = animate(count, to, { duration: duration.slow, ease });
    return () => controls.stop();
  }, [running, count, to]);

  const final = `${prefix}${to.toLocaleString()}${suffix}`;

  return (
    <span ref={ref} className={className}>
      {/* The real value, for screen readers and for anyone with reduced motion. */}
      <span className={running ? "sr-only" : "tabular-nums"}>
        {final}
      </span>

      {running && (
        // inline-grid stacks both copies in one cell, so the box is already the
        // width of the final number before the first digit appears.
        <span aria-hidden className="inline-grid tabular-nums">
          <span className="invisible col-start-1 row-start-1">{final}</span>
          {/* Right-aligned inside the reserved box, so the slack while the
              number is still short lands next to the preceding space rather
              than between the number and whatever punctuation follows it. */}
          <span className="col-start-1 row-start-1 text-right">
            {prefix}
            <motion.span>{text}</motion.span>
            {suffix}
          </span>
        </span>
      )}
    </span>
  );
}
