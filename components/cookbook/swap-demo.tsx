"use client";

/**
 * The one demo on /guide/motion that needs its own client component, because
 * Swap is driven from outside: something has to own the "which one is showing"
 * state and give the user a way to change it.
 *
 * Everything else on that page is a library component used directly from the
 * server page — the components carry their own "use client", so the page shell
 * and all the copy stay server-rendered. This file exists to keep that true.
 */

import { useState } from "react";
import { Swap } from "@/components/motion/swap";

export function SwapDemo() {
  const [good, setGood] = useState(false);

  return (
    <div className="flex flex-col gap-step-3">
      <div className="flex gap-step-2">
        {(["bad", "good"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setGood(key === "good")}
            aria-pressed={good === (key === "good")}
            className={`cursor-pointer rounded border px-step-3 py-step-1 font-mono text-xs ${
              good === (key === "good")
                ? "border-accent text-accent"
                : "border-line text-muted hover:text-ink"
            }`}
          >
            {key === "bad" ? "Bad" : "Good"}
          </button>
        ))}
      </div>

      <Swap
        active={good ? "good" : "bad"}
        items={{
          bad: (
            <p className="text-sm text-muted italic">
              &ldquo;Make the homepage look nice and modern.&rdquo;
            </p>
          ),
          good: (
            <p className="text-sm text-ink">
              &ldquo;Build the homepage from the attached Figma frame. Hero: my
              name at 64px, one-line role in the muted color. No animations.
              Tell me what files you changed.&rdquo;
            </p>
          ),
        }}
      />
    </div>
  );
}
