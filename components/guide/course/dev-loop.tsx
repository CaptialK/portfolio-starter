"use client";

/**
 * The four steps of the build loop, lighting up one after another, over and
 * over, while the panel is on screen.
 *
 * This is the one animation on the site allowed to run past the 800ms budget in
 * lib/motion-tokens.ts, and it's deliberate: the point of the panel is that the
 * loop never stops, so a single pass would say the opposite. It only runs while
 * you're looking at it, and it stops the moment you scroll away.
 *
 * Under reduced motion nothing cycles. Every step is simply lit, which is what
 * the panel is trying to tell you anyway.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { duration, ease } from "@/lib/motion-tokens";
import type { Labelled } from "@/lib/crash-course";

/** How long each step stays lit. Slow enough to read the step you're on. */
const STEP_SECONDS = duration.slow;

export function DevLoop({ steps, after }: { steps: Labelled[]; after: string }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  // Not `once`: the loop should start again when the panel comes back.
  const inView = useInView(ref, { amount: 0.4 });
  const [lit, setLit] = useState(0);

  const running = inView && !reduced;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setLit((current) => (current + 1) % (steps.length + 1)),
      STEP_SECONDS * 1000,
    );
    return () => window.clearInterval(timer);
  }, [running, steps.length]);

  // The extra slot at the end of the cycle is the "back to step 1" beat.
  const restarting = running && lit === steps.length;

  return (
    <div ref={ref}>
      <ol className="m-0 grid list-none gap-step-3 p-0 md:grid-cols-4">
        {steps.map((step, i) => {
          const on = reduced || (running && lit === i);
          return (
            <li key={step.label} className="relative min-w-0">
              <motion.div
                animate={{
                  borderColor: on ? "var(--color-accent)" : "var(--color-line)",
                  opacity: on || reduced ? 1 : 0.55,
                }}
                transition={
                  reduced ? { duration: 0 } : { duration: duration.fast, ease }
                }
                className="h-full rounded-lg border bg-panel p-step-4"
              >
                <span
                  className={`mb-step-2 block font-mono text-xs ${on ? "text-accent" : "text-muted"}`}
                >
                  {i + 1}
                </span>
                <h3 className="mb-step-1 font-sans text-sm font-semibold tracking-normal text-ink">
                  {step.label}
                </h3>
                <p className="text-xs text-muted">{step.body}</p>
              </motion.div>

              {/* The arrow to the next step, on wide screens only. */}
              {i < steps.length - 1 && (
                <motion.span
                  aria-hidden
                  animate={{ opacity: on ? 1 : 0.3, x: on ? 2 : 0 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: duration.fast, ease }
                  }
                  className="absolute top-1/2 -right-step-3 hidden -translate-y-1/2 font-mono text-xs text-accent md:block"
                >
                  →
                </motion.span>
              )}
            </li>
          );
        })}
      </ol>

      <motion.p
        animate={{ opacity: restarting || reduced ? 1 : 0.5 }}
        transition={reduced ? { duration: 0 } : { duration: duration.fast, ease }}
        className="mt-step-4 font-mono text-xs text-accent"
      >
        {after}
      </motion.p>
    </div>
  );
}
