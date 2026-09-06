"use client";

/**
 * The hero: eight dots, one per day, filling in as you read down the course.
 *
 * `useScroll` gives how far down the page you are as a number from 0 to 1, and
 * each dot lights when that number passes its share of the way. Nothing is on a
 * timer — the progress *is* the scroll position, so it runs backwards when you
 * scroll back up.
 *
 * Under reduced motion every dot is simply lit, because a row of dots that
 * can't animate should still read as "eight days".
 */

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { duration, ease } from "@/lib/motion-tokens";

const DAYS = [0, 1, 2, 3, 4, 5, 6, 7];

function Dot({
  day,
  progress,
}: {
  day: number;
  progress: MotionValue<number>;
}) {
  // Lit by the time the reader is this far down. The small window either side
  // is what makes it fade rather than flick.
  //
  // Opacity only, deliberately: useTransform builds its interpolator straight
  // from the values you give it, and a CSS variable is a string it can't read
  // as a colour. So the dot is always the accent and simply fades up, which
  // also keeps the colour in one place rather than repeating the hex here.
  //
  // The range is clamped to 0..1. Scroll progress never leaves those bounds,
  // and handing the browser a negative offset is a hard error — day 0 sits at
  // 0, so an unclamped window would start at -0.04 and throw on mount.
  const at = day / DAYS.length;
  const from = Math.max(0, at - 0.04);
  const to = Math.min(1, Math.max(from + 0.01, at + 0.02));
  const opacity = useTransform(progress, [from, to], [0.2, 1]);

  return (
    <li className="flex flex-col items-center gap-step-2">
      <motion.span
        className="block size-step-3 rounded-full bg-accent"
        style={{ opacity }}
      />
      <span className="font-mono text-xs text-muted">{day}</span>
    </li>
  );
}

export function DayDots() {
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();

  if (reduced) {
    return (
      <ul className="m-0 flex list-none gap-step-4 p-0">
        {DAYS.map((day) => (
          <li key={day} className="flex flex-col items-center gap-step-2">
            <span className="block size-step-3 rounded-full bg-accent" />
            <span className="font-mono text-xs text-muted">{day}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.ul
      className="m-0 flex list-none gap-step-4 p-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease }}
    >
      {DAYS.map((day) => (
        <Dot key={day} day={day} progress={scrollYProgress} />
      ))}
    </motion.ul>
  );
}
