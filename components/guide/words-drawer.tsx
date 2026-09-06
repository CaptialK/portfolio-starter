"use client";

/**
 * The "Words" button in the guide's header, and the panel it opens.
 *
 * Twelve terms, one sentence each, from content/glossary.ts. It's there so
 * nobody has to leave the page and go searching the moment a word stops them.
 *
 * Built on the browser's own <dialog> element rather than a hand-made panel,
 * which means Esc closes it, focus stays inside it while it's open, and it
 * comes back to the button when it closes — all without us writing any of that
 * and getting a piece of it subtly wrong.
 */

import { useCallback, useRef } from "react";
import { glossary } from "@/content/glossary";

export function WordsDrawer() {
  const dialog = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialog.current?.showModal(), []);
  const close = useCallback(() => dialog.current?.close(), []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="cursor-pointer rounded border border-line px-step-2 py-step-1 font-mono text-xs text-muted hover:border-muted hover:text-ink"
      >
        Words
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="words-title"
        className="words-drawer"
        // Clicking the dark area outside the panel closes it. The check is on
        // the dialog itself, because the backdrop counts as part of it.
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="flex items-baseline justify-between gap-step-3 border-b border-line px-step-4 py-step-3">
          <h2
            id="words-title"
            className="font-mono text-xs tracking-[0.12em] text-accent uppercase"
          >
            Words
          </h2>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer font-mono text-xs text-muted hover:text-ink"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-step-4 py-step-4">
          <p className="mb-step-4 max-w-measure text-xs text-muted">
            The ones that come up constantly. Anything you meet only once is
            explained where it appears.
          </p>

          <dl className="m-0">
            {glossary.map((word) => (
              <div key={word.term} className="mb-step-4 last:mb-0">
                <dt className="mb-step-1 font-mono text-xs text-accent">
                  {word.term}
                </dt>
                <dd className="m-0 max-w-measure text-sm text-ink/85">
                  {word.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </dialog>
    </>
  );
}
