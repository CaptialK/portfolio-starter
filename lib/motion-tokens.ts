/**
 * Timing, easing and distance for every animation on this site.
 *
 * The same idea as the colour and spacing scales in `app/globals.css`: pick the
 * values once, name them, and use the names everywhere. If a component in
 * `components/motion/` contains a bare number — a duration, a cubic-bezier, a
 * pixel offset, a scale — that's a bug. It means one thing on the site is
 * timed or sized differently from everything else and nobody decided that.
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
 * Springs have no duration — they settle when they settle. This one is very
 * slightly underdamped and settles in roughly 300ms, comfortably inside
 * `MAX_DURATION`. `restDelta` stops it once it's within a pixel of home, so it
 * doesn't burn frames on movement nobody can see.
 */
export const spring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 26,
  restDelta: 0.001,
};

/**
 * How far things travel, in pixels. On the spacing scale from `globals.css`,
 * because a transform offset is a distance like any other.
 */
export const travel = {
  /**
   * How far a revealed or staggered element rises into place. One step on the
   * spacing scale. Reveal and StaggerItem both read this, so they can't drift
   * apart — and `reveal-up` in globals.css matches it too.
   */
  rise: 8,
  /** How far a card lifts under the cursor. */
  lift: 4,
  /** The blur an element starts at when Reveal's `blur` is switched on. */
  blur: 6,
} as const;

/**
 * How far something shrinks when pressed. Big surfaces move less than small
 * controls — a card that squashed as much as a checkbox would look broken.
 */
export const press = {
  /** A card, a panel, a large tap target. */
  surface: 0.995,
  /** A checkbox, a small button. */
  control: 0.9,
} as const;

/**
 * Default seconds between one staggered child and the next.
 *
 * Below `MIN_STAGGER_GAP` the stagger stops reading as a sequence; above
 * `MAX_STAGGER_GAP` it starts to feel like waiting.
 */
export const staggerGap = 0.06;
export const MIN_STAGGER_GAP = 0.04;
export const MAX_STAGGER_GAP = 0.08;

/**
 * The longest any single animation — or any complete stagger sequence — may
 * run, in seconds.
 *
 * Past this the animation stops being a transition and becomes something the
 * reader is waiting on. Stagger checks itself against this in development and
 * says so in the console if a list is long enough to blow the budget.
 *
 * Two deliberate exceptions, both on /guide:
 * - the dev-server loop, which repeats on purpose while it's on screen;
 * - Terminal, whose typing is a sequence of short reveals rather than one
 *   animation, and which has a Skip button for exactly this reason.
 */
export const MAX_DURATION = 0.8;

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
