"use client";

/**
 * `useReducedMotion()`, but safe to branch your markup on.
 *
 * THE PROBLEM THIS SOLVES
 * The server builds the HTML long before it reaches anyone's browser, so it
 * cannot know whether that person has Reduce Motion switched on. Motion's own
 * `useReducedMotion()` reports `false` on the server and the real answer on the
 * client — so a component that renders different elements in each case gives
 * React two different trees, React throws a hydration error, and it throws away
 * the server's HTML and rebuilds that whole branch in the browser.
 *
 * Which means the people who asked for *less* work got *more* of it, plus an
 * error in the console. Exactly backwards.
 *
 * WHAT THIS DOES INSTEAD
 * Reports `false` on the server and during the first client render — so both
 * agree and hydration is clean — then the real answer immediately afterwards.
 * Components using it render the animated markup for one frame and settle into
 * the plain version before anything has had time to move.
 *
 * `useSyncExternalStore` is doing the "have we hydrated yet" part: it's the one
 * hook that is allowed to give React a different answer on the server than in
 * the browser, and it does it without a state update in an effect.
 *
 * USE THIS, NOT `useReducedMotion`, in anything under components/motion/.
 */

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/** Nothing to subscribe to — hydration happens once and never un-happens. */
const subscribe = () => () => {};

export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();

  const hydrated = useSyncExternalStore(
    subscribe,
    () => true, // in the browser, after hydration
    () => false, // on the server, and during the first client render
  );

  return hydrated && Boolean(reduced);
}
