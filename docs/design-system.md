# The design system

It has two halves and they have to agree.

- **`app/globals.css`** — the values. Colours, type sizes, spacing steps.
- **`CLAUDE.md`** — the rules, in English. Claude Code reads this at the start
  of every session, so every prompt inherits it without you repeating yourself.

Change a value in one, change the matching line in the other. When they
disagree, you get a site built to two different systems and no way to tell
which is right.

## Where the values live

Everything is in the `@theme` block at the top of `app/globals.css`. Tailwind
turns each variable into a class you can use, so `--color-accent` becomes
`text-accent`, `bg-accent`, `border-accent`, and so on.

### Colour

Six values, and a rule: one background, one text colour, one accent.

| Token          | Value     | Used for                              |
| -------------- | --------- | ------------------------------------- |
| `bg`           | `#0E0E0E` | the page                              |
| `panel`        | `#151515` | cards, raised surfaces                |
| `ink`          | `#F2F2EE` | text                                  |
| `muted`        | `#8F8F88` | secondary text, meta, labels          |
| `line`         | `#262624` | borders and rules                     |
| `accent`       | `#D4FF3A` | links, focus rings, one thing a screen |
| `accent-ink`   | `#0E0E0E` | text sitting on the accent            |

`text-ink/85` gives you 85% opacity ink, which is what body copy uses. That is
the only variation on these colours in the whole site.

Don't add a sixth colour. If something needs to stand out, it gets the accent or
it gets whitespace. The moment there are two accents, neither is one.

### Type

Three faces, loaded in `app/layout.tsx`:

- **Instrument Serif** — headings and the pull quotes (`font-display`)
- **Space Grotesk** — body and UI (`font-sans`, the default)
- **JetBrains Mono** — labels, metadata, code (`font-mono`)

Six sizes, and nothing in between:

| Class      | Size | For                              |
| ---------- | ---- | -------------------------------- |
| `text-xs`  | 14px | captions, labels, metadata       |
| `text-sm`  | 16px | body                             |
| `text-md`  | 20px | lede, large body                 |
| `text-lg`  | 28px | section headings                 |
| `text-xl`  | 44px | page headings                    |
| `text-2xl` | 64px | the one big statement per page   |

One `text-2xl` per page. Two of them is two pages fighting.

Swapping a font is a two-line change: import a different one from
`next/font/google` in `app/layout.tsx` and keep the same `variable`. Nothing
else in the codebase names a font.

### Space

`4 / 8 / 16 / 24 / 48 / 96`, as `step-1` through `step-6`. They work anywhere
Tailwind takes a spacing value: `p-step-4`, `gap-step-3`, `mt-step-5`,
`space-y-step-2`.

If you find yourself writing `p-[13px]`, the answer is `step-3` or `step-4`. A
scale you break isn't a scale.

### Measure

- `max-w-measure` — 42rem, about 68 characters. Body text never gets wider.
- `max-w-page` — 72rem. The outer container.

## What's already handled

Some rules are enforced in `globals.css` so you can't lose them:

- **Focus rings.** `:focus-visible` gets a 2px accent outline everywhere. This
  is how the site passes the keyboard check on the reject list by default.
- **Reduced motion.** Every animation and transition collapses to nothing under
  `prefers-reduced-motion: reduce`. Anything you add has to survive that.
- **The skip link.** `.skip-link` is invisible until focused, then it appears
  top-left. It's the first thing in `<body>`.
- **Selection colour.** Accent background, dark text.

## The two decorative things

Both are deliberate, both are used once.

- **`.bg-grid`** — a faint rule grid behind the homepage hero. It draws on a
  `::before` layer, not the element, because `mask-image` fades an element's
  *content* as well as its background. Putting the mask directly on the element
  makes the hero text disappear.
- **`[data-reveal]`** — a staggered fade-up on page load. Put it on a wrapper
  and its direct children come in one after another. It respects reduced
  motion. Don't put it on more than one section per page.

## Changing it

Do this properly once, on Day 3, from your own Figma frames. Every value in
`globals.css` right now is a placeholder, and replacing them with your own scale
is the single highest-leverage change you can make to this site.

Then update `CLAUDE.md` to match, in the same sitting, before you forget.
