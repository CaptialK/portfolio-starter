/**
 * Timing and easing for every animation on this site.
 *
 * The same idea as the colour and spacing scales in `app/globals.css`: pick the
 * values once, name them, and use the names everywhere. If a component in
 * `components/motion/` contains a bare number like `0.35` or a raw cubic-bezier,
 * that's a bug — it means one thing on the site is timed differently from
 * everything else and nobody decided that on purpose.
 *
 * To make the whole site feel faster or slower, change `duration` here. To
 * change its character — snappier, floatier — change `ease` and `spring`.
 * Nothing else needs editing.
 */

/**
 * Three speeds, in seconds. Anything that needs a fourth is a sign the
 * animation is doing too much.
 *
 * - `fast`  — a response to something the user just did: a tap, a hover.
 * - `base`  — the default. Content arriving, a panel opening.
 * - `slow`  — deliberately noticeable: a number counting up, a line drawing in.
 */
export const duration = {
  fast: 0.18,
  base: 0.42,
  slow: 0.7,
} as const;

/**
 * One easing curve, for everything that isn't a spring.
 *
 * It starts fast and settles gently, which reads as "this arrived" rather than
 * "this is being animated at you". Deliberately the same curve as the
 * `[data-reveal]` CSS animation in `app/globals.css`, so the page-load stagger
 * and the scroll reveals share a personality.
 */
export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * One spring, for anything that should feel physical rather than timed:
 * the scroll bar, a checkmark landing, a tab underline sliding.
 *
 * Springs have no duration — they settle when they settle. That's the point.
 * `restDelta` stops the animation once it's within a pixel of home, so it
 * doesn't burn frames on movement nobody can see.
 */
export const spring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 26,
  restDelta: 0.001,
};

/**
 * Default seconds between one staggered child and the next.
 *
 * Below about 0.04 the stagger stops reading as a sequence; above about 0.12 it
 * starts to feel like waiting.
 */
export const staggerGap = 0.06;

/**
 * When a scroll-triggered animation counts as "in view".
 *
 * `once: true` everywhere — things animate in and then stay put. Elements that
 * re-animate every time you scroll past them are the single most common way an
 * animated site becomes annoying to actually use.
 *
 * `amount: 0.25` means a quarter of the element has to be visible, so tall
 * blocks don't fire while still mostly below the fold.
 */
export const viewport = { once: true, amount: 0.25 } as const;
