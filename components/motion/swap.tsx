"use client";

/**
 * Swap — crossfades between alternative versions of the same block.
 *
 * WHAT IT DOES
 * Renders whichever item `active` names. `AnimatePresence mode="wait"` makes
 * the outgoing item finish fading out before the incoming one starts, so the
 * two never overlap and you never read both at once.
 *
 * WHEN TO USE IT
 * A before/after, a bad/good, a two-way comparison where the whole point is
 * that the reader compares the same slot twice. The fade says "this is the
 * same thing, changed", where showing both side by side says "these are two
 * different things".
 *
 * WHEN NOT TO USE IT
 * - When the reader needs both at once to compare them. Put them side by side.
 * - For more than about three options. That's tabs — use LayoutTabs.
 * - For content that changes on its own. A block that swaps itself while
 *   someone is reading it is hostile.
 *
 * PROPS
 * - active     the key of the item to show.
 * - items      a record of key → content. Every value is measured for the
 *              sizer, so keep the set small.
 * - className  passed through.
 *
 * ACCESSIBILITY
 * Whatever toggles this belongs outside the component — a button, or a
 * LayoutTabs — so that the control has proper semantics. Under
 * `prefers-reduced-motion` the swap is instant.
 *
 * LAYOUT
 * All items are rendered once, invisibly and `aria-hidden`, stacked in the same
 * grid cell as the visible one. That makes the block as tall as its tallest
 * item from the start, so swapping never moves the page under the reader's
 * cursor — the usual failure mode of a crossfade.
 *
 * @example
 * const [good, setGood] = useState(false);
 *
 * <Swap
 *   active={good ? "good" : "bad"}
 *   items={{
 *     bad:  <blockquote>Make the homepage look nice and modern.</blockquote>,
 *     good: <blockquote>Build the homepage from the attached frame…</blockquote>,
 *   }}
 * />
 */

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { duration, ease } from "@/lib/motion-tokens";

type SwapProps = {
  active: string;
  items: Record<string, React.ReactNode>;
  className?: string;
};

export function Swap({ active, items, className }: SwapProps) {
  const reduced = useReducedMotionSafe();
  const keys = Object.keys(items);

  return (
    <div className={`grid ${className ?? ""}`}>
      {/* The sizer. Every item, invisible, in the same cell — so the box is
          already as tall as the tallest one before anything swaps into it. */}
      <div aria-hidden className="invisible col-start-1 row-start-1 grid">
        {keys.map((key) => (
          <div key={key} className="col-start-1 row-start-1">
            {items[key]}
          </div>
        ))}
      </div>

      <div className="col-start-1 row-start-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: duration.fast, ease }
            }
          >
            {items[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
