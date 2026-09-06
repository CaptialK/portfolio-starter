"use client";

/**
 * Check — a checkbox whose tick draws itself on, and remembers being ticked.
 *
 * WHAT IT DOES
 * The tick is an SVG path. `pathLength` treats that path as a line of length 1
 * regardless of its real geometry, so animating it from 0 to 1 draws the stroke
 * from one end to the other. A spring makes the box itself land rather than
 * arrive.
 *
 * WHEN TO USE IT
 * A list somebody works through in the real world and comes back to: an install
 * checklist, a pre-flight list. Give it a `storageKey` and their progress
 * survives a reload.
 *
 * WHEN NOT TO USE IT
 * - As decoration on a list of features. A control that looks operable but
 *   isn't is worse than a bullet.
 * - Inside a form that gets submitted. This stores to the browser, not to a
 *   server; use a plain checkbox for real form data.
 * - For a single yes/no. That's a switch, and this reads as "one of several".
 *
 * PROPS
 * - label       the text beside the box. Required.
 * - hint        a second line, muted. Optional.
 * - storageKey  saves state under this key in localStorage. Optional.
 * - checked / onChange  control it from the outside instead. Optional.
 * - className   passed through.
 *
 * ACCESSIBILITY
 * A real `<input type="checkbox">` inside a `<label>`, visually hidden but
 * present — so it's in the tab order, it toggles with Space, and it's announced
 * as a checkbox with its state. The drawn tick is decorative and `aria-hidden`.
 * The focus ring is drawn on the visible box via `peer-focus-visible`. Under
 * `prefers-reduced-motion` the tick appears without drawing.
 *
 * HYDRATION
 * Persistence goes through `useStoredFlag` (lib/use-stored-flag.ts), which uses
 * `useSyncExternalStore`. The server has no localStorage, so the box renders
 * unticked in the HTML and React swaps in the stored answer on mount without a
 * hydration mismatch and without a second render pass.
 *
 * @example
 * <Check
 *   storageKey="reject-list:375"
 *   label="375px wide, no horizontal scroll"
 *   hint="Chrome DevTools → device toolbar. Every page."
 * />
 */

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease, spring } from "@/lib/motion-tokens";
import { useStoredFlag } from "@/lib/use-stored-flag";

type CheckProps = {
  label: React.ReactNode;
  hint?: React.ReactNode;
  storageKey?: string;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  className?: string;
};

export function Check({
  label,
  hint,
  storageKey,
  checked,
  onChange,
  className,
}: CheckProps) {
  const reduced = useReducedMotion();
  const id = useId();

  // Three ways to hold the state, chosen by which props were passed. All three
  // hooks always run — you can't call a hook conditionally — but only one
  // answer is used.
  const [session, setSession] = useState(false);
  const [persisted, setPersisted] = useStoredFlag(storageKey);

  const controlled = checked !== undefined;
  const isChecked = controlled ? checked : storageKey ? persisted : session;

  const toggle = (next: boolean) => {
    onChange?.(next);
    if (controlled) return;
    if (storageKey) setPersisted(next);
    else setSession(next);
  };

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-step-3 ${className ?? ""}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={(event) => toggle(event.target.checked)}
        className="peer sr-only"
      />

      <motion.span
        aria-hidden
        animate={{
          backgroundColor: isChecked ? "var(--color-accent)" : "transparent",
          borderColor: isChecked ? "var(--color-accent)" : "var(--color-line)",
        }}
        transition={reduced ? { duration: 0 } : { duration: duration.fast, ease }}
        whileTap={reduced ? undefined : { scale: 0.9 }}
        className="mt-px flex size-step-4 shrink-0 items-center justify-center rounded border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-step-3">
          <motion.path
            d="M5 12.5 10 17.5 19 7"
            stroke="var(--color-accent-ink)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: isChecked ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : spring}
          />
        </svg>
      </motion.span>

      <span className="min-w-0">
        <span
          className={`block text-sm ${isChecked ? "text-muted line-through" : "text-ink"}`}
        >
          {label}
        </span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}
