"use client";

/**
 * LayoutTabs — tabs whose underline slides from the old tab to the new one.
 *
 * WHAT IT DOES
 * Every tab could draw its own underline, but only the selected one does. Each
 * underline carries the same `layoutId`. When the selection moves, Motion sees
 * one element disappear and an identically-identified one appear, works out
 * the distance between them, and animates it. You never write the movement —
 * you say "these are the same thing" and Motion does the rest.
 *
 * WHEN TO USE IT
 * Two to five alternative views of the same kind of content. The slide tells
 * the eye where the selection went, which a hard cut doesn't.
 *
 * WHEN NOT TO USE IT
 * - For navigation between pages. Those are links, not tabs.
 * - For more tabs than fit on one line at 375px. Use an Accordion instead —
 *   scrolling tabs hide the ones you didn't pick.
 * - When the panels are very different heights. The page will jump on every
 *   switch; give the panel a `min-height` if so.
 *
 * PROPS
 * - tabs         array of { id, label, panel }. `panel` is the content shown
 *                when that tab is selected.
 * - defaultId    which tab starts selected. Defaults to the first.
 * - className    passed through.
 *
 * ACCESSIBILITY
 * Real tab semantics: `role="tablist"`, `role="tab"` with `aria-selected`, and
 * a `role="tabpanel"`. Left/Right arrows move between tabs and Home/End jump to
 * the ends, which is what a screen-reader user expects a tablist to do. Only
 * the selected tab is in the tab order. Under `prefers-reduced-motion` the
 * underline jumps instead of sliding; everything else is identical.
 *
 * @example
 * <LayoutTabs
 *   tabs={[
 *     { id: "bad", label: "Bad", panel: <p>Make it look nice and modern.</p> },
 *     { id: "good", label: "Good", panel: <p>Build the hero from this frame…</p> },
 *   ]}
 * />
 */

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { spring } from "@/lib/motion-tokens";

type Tab = {
  id: string;
  label: string;
  panel: React.ReactNode;
};

type LayoutTabsProps = {
  tabs: Tab[];
  defaultId?: string;
  className?: string;
};

export function LayoutTabs({ tabs, defaultId, className }: LayoutTabsProps) {
  const reduced = useReducedMotion();
  const groupId = useId();
  const [activeId, setActiveId] = useState(defaultId ?? tabs[0]?.id);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const active = tabs[activeIndex] ?? tabs[0];

  const move = (to: number) => {
    const next = tabs[(to + tabs.length) % tabs.length];
    if (!next) return;
    setActiveId(next.id);
    buttons.current[next.id]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => move(activeIndex + 1),
      ArrowLeft: () => move(activeIndex - 1),
      Home: () => move(0),
      End: () => move(tabs.length - 1),
    };
    const handler = keys[event.key];
    if (!handler) return;
    event.preventDefault();
    handler();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="flex gap-step-4 border-b border-line"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                buttons.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`${groupId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${groupId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={`relative -mb-px cursor-pointer pb-step-2 font-mono text-xs ${
                selected ? "text-accent" : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
              {selected && (
                // The same layoutId on every tab's underline is what makes it
                // travel between them instead of blinking out and back in.
                <motion.span
                  layoutId={`${groupId}-underline`}
                  className="absolute inset-x-0 -bottom-px block h-px bg-accent"
                  transition={reduced ? { duration: 0 } : spring}
                />
              )}
            </button>
          );
        })}
      </div>

      {active && (
        <div
          role="tabpanel"
          id={`${groupId}-panel-${active.id}`}
          aria-labelledby={`${groupId}-tab-${active.id}`}
          className="pt-step-4"
        >
          {active.panel}
        </div>
      )}
    </div>
  );
}
