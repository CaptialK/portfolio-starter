"use client";

/**
 * Accordion — a row that expands to show more, and collapses again.
 *
 * WHAT IT DOES
 * `AnimatePresence` is the piece that makes this possible: React normally
 * removes an element from the page the instant you stop rendering it, which
 * gives it no chance to animate out. AnimatePresence holds it in the DOM until
 * its exit animation has finished. Here the panel animates its height between
 * 0 and `auto`, so the rows below slide rather than jump.
 *
 * WHEN TO USE IT
 * Reference material where most readers want one item, not all of them: a
 * troubleshooting table, an FAQ, per-day detail on a timeline.
 *
 * WHEN NOT TO USE IT
 * - For content everyone needs. An accordion is a small tax on reading; only
 *   charge it for content most people will skip.
 * - For a single item. That's a disclosure, and `<details>` does it for free.
 * - Inside a scroll-snapped panel. Expanding changes the panel's height and
 *   fights the snap.
 *
 * PROPS
 * - items          array of { id, title, body }.
 * - defaultOpenId  which row starts open. Default: none.
 * - single         only one row open at a time. Default true.
 * - className      passed through.
 *
 * ACCESSIBILITY
 * The header is a real `<button>` with `aria-expanded` and `aria-controls`, so
 * it works with the keyboard and announces its state. The panel is hidden from
 * assistive technology while closed rather than merely clipped. Under
 * `prefers-reduced-motion` rows open and close instantly.
 *
 * LAYOUT
 * This component *does* change the height of the page — that's its whole job.
 * It's the one exception to the no-layout-shift rule, and it's fine because the
 * user asked for it by clicking. Don't put one above content someone is
 * currently reading.
 *
 * @example
 * <Accordion
 *   items={[
 *     { id: "node", title: "command not found: node",
 *       body: <p>Quit VS Code fully and reopen.</p> },
 *   ]}
 * />
 */

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { duration, ease } from "@/lib/motion-tokens";

type AccordionItem = {
  id: string;
  title: React.ReactNode;
  body: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  defaultOpenId?: string;
  single?: boolean;
  className?: string;
};

export function Accordion({
  items,
  defaultOpenId,
  single = true,
  className,
}: AccordionProps) {
  const reduced = useReducedMotion();
  const groupId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) =>
    setOpen((current) => {
      if (current.includes(id)) return current.filter((it) => it !== id);
      return single ? [id] : [...current, id];
    });

  return (
    <div className={className}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className="border-b border-line">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`${groupId}-${item.id}`}
              className="flex w-full cursor-pointer items-baseline justify-between gap-step-3 py-step-3 text-left"
            >
              <span className="text-sm text-ink">{item.title}</span>
              <motion.span
                aria-hidden
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: duration.fast, ease }}
                className="shrink-0 font-mono text-xs text-accent"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${groupId}-${item.id}`}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: duration.base, ease }
                  }
                  className="overflow-hidden"
                >
                  <div className="pb-step-3 text-xs text-muted">{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
