# Portfolio rules

This file is read by Claude Code at the start of every session, so every prompt
inherits these rules without you repeating them. It is the English half of the
design system; `app/globals.css` is the CSS half. **Change one, change the other.**

Rules about what NOT to do are the most valuable lines in here. Add to them.

## Type

- Display / headings: Instrument Serif. Body and UI: Space Grotesk. Code: JetBrains Mono.
- Scale, and nothing between: 14 / 16 / 20 / 28 / 44 / 64.
  In classes: `text-xs` `text-sm` `text-md` `text-lg` `text-xl` `text-2xl`.
- One 64px statement per page. Never two.
- Body text is left-aligned. Never centered, never justified.
- Body text never exceeds `max-w-measure` (42rem, ~68 characters).

## Space

- Scale: 4 / 8 / 16 / 24 / 48 / 96, as `step-1` … `step-6`.
  Use `p-step-4`, `gap-step-3`, `mt-step-5`. Never arbitrary values like `p-[13px]`.
- Page gutter is `px-step-4` on mobile, `px-step-5` from `md` up.
- Page content is capped at `max-w-page` (72rem).

## Color

One background, one text color, one accent. That is the whole palette.

- `bg` `#0E0E0E` — page background
- `panel` `#151515` — cards, raised surfaces
- `ink` `#F2F2EE` — text
- `muted` `#8F8F88` — secondary text, meta, labels
- `line` `#262624` — borders and rules
- `accent` `#D4FF3A` — links, focus rings, one emphasis per screen
- `accent-ink` `#0E0E0E` — text on top of the accent

Never introduce a sixth color. If something needs to stand out, it gets the
accent or it gets whitespace.

## Elevation

One shadow: `shadow-lift`. Only for a surface that rises on hover. It's the
page's own black at low opacity, not a new color.

## Motion

- Library: `motion` (imported from `"motion/react"`). Never `framer-motion`.
- Timing AND distance live in `lib/motion-tokens.ts`: `duration.fast/base/slow`,
  one `ease`, one `spring`, plus `travel` and `press`. Never write a raw
  duration, cubic-bezier, pixel offset or scale in a component.
- **Budget: no animation runs longer than 800ms** (`MAX_DURATION`). Two
  deliberate exceptions, both on /guide: the dev-server loop, which repeats on
  purpose; and Terminal, whose typing is a sequence of short reveals with a
  Skip button.
- **Stagger gaps stay between 40ms and 80ms**, and `gap x (n - 1) + duration.base`
  must also fit the 800ms budget. Stagger checks both in development and warns.
- **Nothing above the fold may animate opacity from 0.** The first frame has to
  be readable. Use `<Reveal mode="settle">` up there — it starts visible and
  only settles into place. `mode="enter"` (the fade) is for below the fold.
- **One element answers to the scroll or to the cursor, never both.** Don't put
  Reveal/StaggerItem and Hoverable on the same element — wrap, don't stack.
- Use `useReducedMotionSafe()` from `lib/use-reduced-motion-safe.ts`, never
  Motion's `useReducedMotion` directly. The server can't know the visitor's
  preference, so branching markup on the raw hook causes a hydration error and
  makes React rebuild the tree — for the people who asked for less motion.
- Test it with `?reduce-motion=1` on any /guide URL (development only).
- Reusable animations live in `components/motion/`. Use one of those before
  writing a new animation; the live examples are at `/guide/motion`.
- Every animated component must check `useReducedMotion()` and render its
  content plainly when it's on. The global CSS rule in `globals.css` only stops
  CSS animations — Motion runs in JavaScript and ignores it.
- Animate `opacity` and `transform` only. Anything that animates width, height,
  or position moves the rest of the page while someone is reading it.
- Reserve the final layout before animating into it. No animation may cause
  layout shift.

## Rules for building

- Mobile first. Design and check at 375px before desktop.
- Every image goes through `next/image` with real `alt` text. No bare `<img>`.
- Content lives in `content/` as `.mdx` or `.ts`. Never hard-code copy into a component.
- Every interactive element must be reachable and operable by keyboard.
- No animations, gradients, custom cursors, or decorative motion unless asked for.
  The one exception already in the codebase is the `[data-reveal]` page-load
  stagger, and it must stay invisible under `prefers-reduced-motion`.
- Server Components by default. Add `"use client"` only when there is state,
  an event handler, or a browser API involved, and put it in the smallest
  component that needs it.
- After each change, say which files you edited.

## Before you say it's done

Run the reject list (`/guide/course`, Day 6):

1. 375px wide, no horizontal scroll, every page.
2. Lighthouse ≥ 90 on Performance and Accessibility.
3. Contrast ≥ 4.5:1. `muted` on `bg` is where this fails — check it.
4. Every image through `next/image`, under 300KB.
5. Tab through the whole page. Everything reachable, focus always visible.
6. Does it look like mine, or like the default?

@AGENTS.md
