"use client";

/**
 * Terminal — a mock terminal window that types its commands out, then reveals
 * the output a line at a time.
 *
 * WHAT IT DOES
 * Plays through a list of lines when it scrolls into view. `cmd` lines are
 * typed character by character behind a `%` prompt; `out` and `comment` lines
 * appear whole, one after another. A replay button starts it again.
 *
 * WHEN TO USE IT
 * Showing commands somebody is meant to type. The typing makes the block read
 * as an instruction rather than a code sample, and the pace stops a reader
 * skimming past a command they were supposed to run.
 *
 * WHEN NOT TO USE IT
 * - For code they'll copy rather than type — a component, a config file. Use a
 *   plain `<pre>`; nobody wants to watch 30 lines of TypeScript appear.
 * - More than one per screen. Two things typing at once is a fight.
 * - For long output. Past about a dozen lines the reveal is just a delay.
 *
 * PROPS
 * - lines      array of { type: "cmd" | "out" | "comment", text }.
 *              cmd     — typed out, accent coloured, gets a `%` prompt.
 *              out     — what the machine printed back.
 *              comment — a note to the reader, muted and italic.
 * - title      the window's title bar text. Default "zsh".
 * - className  passed through.
 *
 * ACCESSIBILITY
 * The animation is `aria-hidden`; a complete, plain-text copy of every line
 * sits beside it for screen readers, so nobody has to wait for a typewriter to
 * finish to find out what to type. While it's playing the button says Skip and
 * jumps to the end, so nobody has to sit through it. Under
 * `prefers-reduced-motion` every line is shown at once and no button is
 * rendered — there's nothing to skip or replay.
 *
 * LAYOUT
 * Every line is stacked on an invisible copy of its own final text, so the
 * window is full height from the first frame. Nothing below it moves as lines
 * arrive.
 *
 * @example
 * <Terminal
 *   title="zsh"
 *   lines={[
 *     { type: "cmd", text: "node -v" },
 *     { type: "out", text: "v22.14.0" },
 *     { type: "comment", text: "# any version number is a pass" },
 *   ]}
 * />
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { duration, ease, viewport } from "@/lib/motion-tokens";

export type TerminalLine = {
  type: "cmd" | "out" | "comment";
  text: string;
};

/**
 * One character every `duration.fast / 6` seconds — about 33ms. Fast enough to
 * read as typing, slow enough to follow. Derived from the shared token so
 * changing the site's tempo changes this too.
 */
const CHAR_SECONDS = duration.fast / 6;

/** The beat between one finished line and the next starting. */
const LINE_SECONDS = duration.fast;

type Cursor = { index: number; chars: number };

const START: Cursor = { index: 0, chars: 0 };

type TerminalProps = {
  lines: TerminalLine[];
  title?: string;
  className?: string;
};

export function Terminal({ lines, title = "zsh", className }: TerminalProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: viewport.once, amount: viewport.amount });

  const [cursor, setCursor] = useState<Cursor>(START);

  // Playing is derived, not stored: it's true whenever we're on screen, allowed
  // to animate, and haven't run off the end of the lines yet.
  const finished = cursor.index >= lines.length;
  const playing = inView && !reduced && !finished;

  // One timer per step. The effect re-runs after each one, which advances the
  // cursor by a character or a line until it runs off the end.
  useEffect(() => {
    if (!playing) return;

    const line = lines[cursor.index];
    if (!line) return;

    const typing = line.type === "cmd" && cursor.chars < line.text.length;
    const wait = (typing ? CHAR_SECONDS : LINE_SECONDS) * 1000;

    const timer = window.setTimeout(() => {
      setCursor((current) =>
        typing
          ? { ...current, chars: current.chars + 1 }
          : { index: current.index + 1, chars: 0 },
      );
    }, wait);

    return () => window.clearTimeout(timer);
  }, [playing, cursor, lines]);

  const replay = useCallback(() => setCursor(START), []);
  const skip = useCallback(
    () => setCursor({ index: lines.length, chars: 0 }),
    [lines.length],
  );

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-lg border border-line bg-black ${className ?? ""}`}
    >
      <div className="flex items-center gap-step-2 border-b border-line px-step-3 py-step-2">
        <span aria-hidden className="flex gap-step-1">
          <span className="block size-step-2 rounded-full bg-line" />
          <span className="block size-step-2 rounded-full bg-line" />
          <span className="block size-step-2 rounded-full bg-line" />
        </span>
        <span className="flex-1 font-mono text-xs text-muted">{title}</span>
        {!reduced && (
          <button
            type="button"
            onClick={finished ? replay : skip}
            className="rounded border border-line px-step-2 font-mono text-xs text-muted hover:border-muted hover:text-ink"
          >
            {finished ? "Replay" : "Skip"}
          </button>
        )}
      </div>

      {/* The plain-text version. Everything a screen reader needs, immediately. */}
      <pre className="sr-only">
        {lines.map((line) => line.text).join("\n")}
      </pre>

      <div
        aria-hidden
        className="overflow-x-auto p-step-3 font-mono text-xs leading-relaxed"
      >
        {lines.map((line, i) => {
          const isCmd = line.type === "cmd";
          const done = reduced || i < cursor.index;
          const active = !reduced && i === cursor.index;

          // A command mid-type shows however much has been typed. Everything
          // else shows its full text and simply fades in when its turn comes.
          const content =
            isCmd && active && !done ? line.text.slice(0, cursor.chars) : line.text;

          return (
            <div key={`${i}-${line.text}`} className="grid">
              {/* Invisible sizer: holds the row open at its final height. */}
              <span className="invisible col-start-1 row-start-1 whitespace-pre">
                {isCmd ? `% ${line.text}` : line.text}
              </span>

              <motion.span
                className={`col-start-1 row-start-1 whitespace-pre ${
                  isCmd
                    ? "text-accent"
                    : line.type === "comment"
                      ? "text-muted italic"
                      : "text-ink"
                }`}
                initial={false}
                animate={{ opacity: done || active ? 1 : 0 }}
                transition={{ duration: duration.fast, ease }}
              >
                {isCmd && <span className="text-muted">% </span>}
                {content}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
