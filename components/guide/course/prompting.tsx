"use client";

/**
 * The bad prompt and the good one, in the same place, one at a time.
 *
 * Showing them side by side would let you read both at once, which is exactly
 * what stops you noticing how different they are. Swapping them in the same
 * slot makes the comparison unavoidable.
 *
 * Swap holds the box open at the height of the longer one, so the page doesn't
 * jump when you toggle.
 */

import { useState } from "react";
import { Swap } from "@/components/motion/swap";

export function Prompting({ bad, good }: { bad: string; good: string }) {
  const [showGood, setShowGood] = useState(false);

  const quote = (text: string, tone: "bad" | "good") => (
    <blockquote
      className={`m-0 border-l-2 pl-step-3 text-sm ${
        tone === "good"
          ? "border-accent text-ink"
          : "border-line text-muted italic"
      }`}
    >
      {text}
    </blockquote>
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Choose a prompt to read"
        className="mb-step-3 flex gap-step-2"
      >
        {(["bad", "good"] as const).map((which) => {
          const selected = showGood === (which === "good");
          return (
            <button
              key={which}
              type="button"
              aria-pressed={selected}
              onClick={() => setShowGood(which === "good")}
              className={`cursor-pointer rounded border px-step-3 py-step-1 font-mono text-xs ${
                selected
                  ? "border-accent text-accent"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {which === "bad" ? "Bad" : "Good"}
            </button>
          );
        })}
      </div>

      <Swap
        className="max-w-measure"
        active={showGood ? "good" : "bad"}
        items={{ bad: quote(bad, "bad"), good: quote(good, "good") }}
      />
    </div>
  );
}
