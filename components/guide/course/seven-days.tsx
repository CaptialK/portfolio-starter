"use client";

/**
 * The seven-day calendar as one horizontal run, with the day you pick opening
 * up in place.
 *
 * Left-to-right matters here — it's a week — so the row stays a row on a phone
 * rather than stacking into eight cards you scroll past. DragRail handles that:
 * drag it sideways when it doesn't fit, arrow keys when you're on a keyboard,
 * and no dragging at all when it does fit.
 *
 * Opening a day is a `layout` animation: the card is told its size changed and
 * Motion works out the movement, so the cards either side slide rather than
 * jump to their new places.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { spring } from "@/lib/motion-tokens";
import { DragRail } from "@/components/motion/drag-rail";
import type { Row } from "@/lib/crash-course";

export function SevenDays({ rows }: { rows: Row[] }) {
  const reduced = useReducedMotionSafe();
  const [open, setOpen] = useState(0);

  return (
    <DragRail>
      {rows.map((row, i) => {
        const [day, title, what] = row.cells;
        const isOpen = open === i;

        return (
          <motion.button
            key={day}
            type="button"
            layout={reduced ? false : true}
            transition={reduced ? { duration: 0 } : spring}
            onClick={() => setOpen(i)}
            aria-expanded={isOpen}
            className={`shrink-0 cursor-pointer rounded-lg border p-step-4 text-left ${
              isOpen
                ? "w-72 border-accent bg-panel sm:w-80"
                : "w-40 border-line bg-panel hover:border-muted"
            }`}
          >
            <motion.span
              layout={reduced ? false : "position"}
              className={`mb-step-2 block font-mono text-xs ${isOpen ? "text-accent" : "text-muted"}`}
            >
              Day {day}
            </motion.span>
            <motion.span
              layout={reduced ? false : "position"}
              className="mb-step-2 block font-sans text-sm font-semibold text-ink"
            >
              {title}
            </motion.span>
            {isOpen && (
              <motion.span
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="block text-xs text-muted"
              >
                {what}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </DragRail>
  );
}
