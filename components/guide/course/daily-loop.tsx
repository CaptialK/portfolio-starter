"use client";

/**
 * The five steps you run all day, in a row, with a line drawing itself between
 * them on a wide screen.
 *
 * The line is one SVG path. `pathLength` treats it as a line of length 1 however
 * long it really is, so animating that from 0 to 1 draws it end to end — the
 * same trick the tick in Check uses.
 *
 * The line is decoration and hidden from screen readers: the numbered list
 * underneath already says these things happen in order. On a phone it isn't
 * drawn at all, because the steps stack and a horizontal line would be a lie.
 */

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { duration, ease, viewport } from "@/lib/motion-tokens";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Labelled } from "@/lib/crash-course";

export function DailyLoop({ steps }: { steps: Labelled[] }) {
  const reduced = useReducedMotionSafe();

  return (
    <div className="relative">
      {!reduced && (
        <svg
          aria-hidden
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-step-4 hidden h-px w-full md:block"
        >
          <motion.line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="var(--color-line)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={viewport}
            transition={{ duration: duration.slow, ease }}
          />
        </svg>
      )}

      <Stagger as="ol" className="relative m-0 grid list-none gap-step-3 p-0 md:grid-cols-5">
        {steps.map((step, i) => (
          <StaggerItem as="li" key={step.label} className="min-w-0">
            <span className="mb-step-2 flex size-step-4 items-center justify-center rounded-full border border-accent bg-bg font-mono text-xs text-accent">
              {i + 1}
            </span>
            <h3 className="mb-step-1 font-sans text-sm font-semibold tracking-normal text-ink">
              {step.label}
            </h3>
            <p className="text-xs text-muted">{step.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
