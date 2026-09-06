"use client";

/**
 * Remembers a true/false in this browser, for one key.
 *
 * Used by the checklists at /guide and /guide/setup so ticking a box survives a
 * reload. It is per-browser, not per-person: it does not sync between devices
 * and it is not a place to keep anything that matters.
 *
 * WHY THIS ISN'T JUST useState + useEffect
 * The server has no localStorage, so the value can't be read while rendering —
 * the server's HTML and the browser's first render would disagree, and React
 * would throw a hydration error. The obvious fix, reading it in an effect and
 * calling setState, makes React render the page twice on every mount.
 *
 * `useSyncExternalStore` is React's answer to exactly this shape of problem:
 * you give it how to read the value, how to find out it changed, and what to
 * assume on the server. React handles the rest, including rendering the
 * server's answer first and swapping to the real one without a mismatch.
 *
 * Every hook instance shares one listener set, so ticking a box updates any
 * other component watching the same key in the same tab — and the `storage`
 * event covers the same page open in a second tab.
 */

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function announce() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * @param key  where to store it. Pass undefined to opt out entirely — the flag
 *             then reads false and setting it does nothing, which is what an
 *             unpersisted checkbox wants.
 * @returns    [value, set] — the same shape as useState.
 */
export function useStoredFlag(
  key: string | undefined,
): [boolean, (next: boolean) => void] {
  const read = useCallback(() => {
    if (!key) return false;
    try {
      return window.localStorage.getItem(key) === "1";
    } catch {
      // Private browsing, or site data is blocked. Nothing persists; that's all.
      return false;
    }
  }, [key]);

  // The third argument is what the server renders. Always false: nobody's
  // stored answer can be known before the page reaches their browser.
  const value = useSyncExternalStore(subscribe, read, () => false);

  const set = useCallback(
    (next: boolean) => {
      if (!key) return;
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        // As above.
      }
      announce();
    },
    [key],
  );

  return [value, set];
}
