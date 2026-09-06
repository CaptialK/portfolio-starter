"use client";

/**
 * Where you are in the course, and how to move without the mouse.
 *
 * Three things in one component, because they're all answers to the same
 * question — which panel am I on?
 *
 * - A rail of dots down the right on a wide screen, one per panel. The filled
 *   one slides between them: every dot could draw the marker, but only the
 *   current one does, and they all share a `layoutId`, so Motion works out the
 *   distance and animates it. On a phone the rail becomes a small "3 / 18".
 * - Up/Down or j/k move a panel at a time.
 * - `?` shows the shortcuts, Escape closes them.
 *
 * It also switches on the gentle scroll-snapping while you're on this page.
 * Snapping has to be set on the thing that scrolls — the page itself — so it
 * can't be done from a wrapper, and it has to be taken off again on the way
 * out or every other page inherits it.
 *
 * WHY THE SECTIONS ARE PASSED IN
 * An earlier version found the panels by querying the page and watching them
 * with a ResizeObserver. That deadlocked the browser: measuring set state, the
 * new state re-rendered the sliding marker, the marker's layout animation
 * changed the layout, and the observer fired again — round and round, with the
 * main thread never getting a turn. The page already knows its own sections, so
 * it hands them over and nothing here has to measure anything.
 */

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { spring } from "@/lib/motion-tokens";

export type RailSection = { id: string; title: string };

export function CourseRail({ sections }: { sections: RailSection[] }) {
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Snapping lives on the page element, and only while this page is mounted.
  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    root.classList.add("course-snap");
    return () => root.classList.remove("course-snap");
  }, [reduced]);

  // Which panel is the reader looking at? The browser watches for us and tells
  // us when one crosses the upper third — no scroll handler, no measuring.
  useEffect(() => {
    const seen = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.intersectionRatio);
        }
        let best = -1;
        let bestRatio = 0;
        sections.forEach((section, i) => {
          const ratio = seen.get(section.id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = i;
          }
        });
        if (best >= 0) setActive(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  const goTo = useCallback(
    (index: number) => {
      const section = sections[Math.max(0, Math.min(sections.length - 1, index))];
      if (!section) return;
      document.getElementById(section.id)?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [sections, reduced],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Never steal a key someone is using to type.
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }

      const moves: Record<string, number> = {
        ArrowDown: 1,
        j: 1,
        ArrowUp: -1,
        k: -1,
      };

      if (event.key in moves && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        goTo(active + moves[event.key]);
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setShowShortcuts((open) => !open);
      }
      if (event.key === "Escape") setShowShortcuts(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, goTo]);

  return (
    <>
      {/* Wide screens: one dot per panel, down the right. */}
      <nav
        aria-label="Course sections"
        className="fixed top-1/2 right-step-4 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul className="m-0 flex list-none flex-col items-end gap-step-2 p-0">
          {sections.map((section, i) => (
            <li key={section.id} className="relative">
              <a
                href={`#${section.id}`}
                aria-current={i === active ? "true" : undefined}
                className="group flex items-center no-underline"
              >
                <span className="pointer-events-none absolute right-full mr-step-2 hidden whitespace-nowrap font-mono text-xs text-muted group-hover:block group-focus-visible:block">
                  {section.title}
                </span>
                <span
                  className={`block size-step-2 rounded-full transition-colors ${
                    i === active ? "bg-transparent" : "bg-line group-hover:bg-muted"
                  }`}
                />
                {i === active && (
                  <motion.span
                    layoutId="course-rail-dot"
                    transition={reduced ? { duration: 0 } : spring}
                    className="absolute right-0 block size-step-2 rounded-full bg-accent"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Phones: just the count. */}
      <p
        aria-hidden
        className="fixed right-step-3 bottom-step-3 z-40 rounded-full border border-line bg-panel px-step-3 py-step-1 font-mono text-xs text-muted lg:hidden"
      >
        {active + 1} / {sections.length}
      </p>

      <button
        type="button"
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-step-3 left-step-3 z-40 hidden cursor-pointer rounded border border-line bg-panel px-step-2 py-step-1 font-mono text-xs text-muted hover:text-ink lg:block"
      >
        ? shortcuts
      </button>

      {showShortcuts && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
          onClick={() => setShowShortcuts(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-step-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-measure rounded-lg border border-line bg-panel p-step-5"
          >
            <h2 className="mb-step-4 font-mono text-xs tracking-[0.12em] text-accent uppercase">
              Moving around
            </h2>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-step-4 gap-y-step-2 text-sm">
              {[
                ["↓ or j", "Next section"],
                ["↑ or k", "Previous section"],
                ["?", "Show or hide this"],
                ["Esc", "Close this"],
              ].map(([key, what]) => (
                <div key={key} className="contents">
                  <dt className="font-mono text-xs text-accent">{key}</dt>
                  <dd className="m-0 text-ink/85">{what}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => setShowShortcuts(false)}
              className="mt-step-4 cursor-pointer font-mono text-xs text-muted hover:text-ink"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
