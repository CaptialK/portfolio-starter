"use client";

/**
 * Copies a block of text, and says so.
 *
 * Used on the prompt cards at /guide/start. What it copies is exactly the text
 * it's given — no heading, no quote marks, nothing to tidy up — so it can be
 * pasted straight into the Claude panel and sent.
 *
 * No animation: this page is one you work from, not one to look at.
 */

import { useCallback, useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setState("copied");
        window.setTimeout(() => setState("idle"), 1600);
      },
      () => setState("failed"),
    );
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      className="cursor-pointer rounded border border-line px-step-2 py-step-1 font-mono text-xs text-muted hover:border-muted hover:text-ink"
    >
      {/* Announced when it changes, so it isn't only feedback for people who
          can see the button. */}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Select it instead" : label}
      </span>
    </button>
  );
}
