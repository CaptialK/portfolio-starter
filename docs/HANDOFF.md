# Handoff

For whoever picks this up next — Vinson, Aaron, or an agent starting cold.
Aaron's own instructions are in [`README.md`](../README.md), the docs beside
this file, and the guide at `/guide`. This page is about the build itself: how
it fits together, what was decided and why, and what will bite you.

- **Live:** https://portfolio-starter-black.vercel.app
- **Repo:** https://github.com/CaptialK/portfolio-starter (public, template)
- Next 16.3.4 · React 19.2.8 · Motion 13.2.0 · Tailwind 4 · Node ≥20.9

## What it is

A portfolio starter for a designer who has never written code and isn't going
to. Aaron clicks **Use this template**, and from then on his workflow is *add a
folder, then talk to Claude about it*. No page is ever hand-built, and no
command has to be typed: every step in the guide leads with what to say to
Claude, with the terminal version folded underneath as the alternative.

Bolted onto it, and deletable, is the seven-day course that teaches him to do
that: `/guide`, `/guide/setup`, `/guide/start`, `/guide/motion`.

## How the parts fit

Four inputs, and everything else is layout.

| Input | Becomes |
| --- | --- |
| `projects/<slug>/project.md` + images | `/work` cards and `/work/<slug>` pages |
| `content/crash-course.md` | every word of `/guide`, `/guide/start` |
| `content/guide/setup-guide.html` | `/guide/setup` |
| `content/site.ts`, `content/about.mdx` | name, nav, footer, `/about` |

Readers: `lib/projects.ts`, `lib/crash-course.ts`, `lib/content.ts`. Pages call
those and lay the result out. **No page holds copy of its own** — if a sentence
is wrong, it's wrong in a content file.

`components/motion/` is twelve documented animation components with a live
cookbook at `/guide/motion`. Timing lives once in `lib/motion-tokens.ts`.

## Decisions that aren't obvious

**Prompt first, terminal second.** Decided 2026-09-05. The first draft taught
the terminal as the primary tool: five Git commands, a seven-command cheat
sheet, "you type every command yourself." Aaron is a designer directing an
agent, and Claude Code can run every one of those commands, so every step that
needs one now leads with the sentence to say and folds the command behind a
disclosure. The commands stay, in full, because they're the plumbing under the
sentence and the route to "design engineer." Both versions have to stay true
when one changes. `AskOrType` in `components/guide/course/` is the course-page
shape; `<details class="alt">` is the setup walkthrough's. The one terminal
skill the guide still teaches is reading it: the last two lines, and the
"allow this command?" box.

**`projects/` sits outside `public/`, so it needs a route.** Files are only
web-addressable from `public/`, but the images belong next to the words that
describe them. `app/project-media/[...path]` serves them, prerendered at build.
The rejected alternative — copying into `public/` on `npm run dev` — breaks the
demo: an image dragged in while the server runs wouldn't appear until restart.
`next.config.ts` has `outputFileTracingIncludes` so the folder ships with the
deployment; without it, project images 404 in production and work fine locally.

**`lib/image-size.ts` reads image headers by hand.** `next/image` needs real
dimensions or the page jumps as pictures load. That's ~60 lines of PNG/JPEG/GIF/
WebP header parsing instead of a dependency.

**`ProjectImage` renders spans, not `<figure>`.** Markdown puts images inside a
paragraph, `<figure>` is illegal there, the browser silently moves it, and
server and client then disagree about the page. It was a real hydration error.

**Use `useReducedMotionSafe()`, never Motion's `useReducedMotion` directly.**
The server can't know a visitor's motion preference, so branching markup on the
raw hook throws a hydration error and makes React rebuild the tree — for exactly
the people who asked for less work. The wrapper agrees with the server through
the first render.

**One switch, no environment variables.** `site.config.ts` holds `showGuide`.
`lib/guide.ts` turns it into `development || showGuide`, so the guide is always
at localhost and the flag only decides whether strangers see it. Deliberately
not an env var: a designer can find and read this file.

**`siteUrl()` falls back to the host's address.** Until `url` is set in
`content/site.ts`, sitemap/robots/social previews use whatever address the
deploy got. First push is correct with nothing configured.

**The setup walkthrough is hand-written HTML, not MDX.** It's a self-contained
document with its own layout — sticky contents, terminal windows, a progress
bar. Its CSS is scoped under `.guide` and takes its colours from the design
tokens, so changing the accent changes it too.

## Verified, and how

Everything below was measured, not assumed.

- **Live:** all eight routes 200; all four project images served with correct
  content types; sitemap carries the real domain.
- **Reduced motion:** `?reduce-motion=1` on any `/guide` URL forces it in dev
  (`app/guide/layout.tsx`). Ran with a control to prove the OS setting was off:
  0 transparent elements, 0 transforms, no ScrollProgress, terminals fully
  shown, no hydration error.
- **375px:** zero horizontal overflow on every page. Wide blocks scroll inside
  their own container.
- **Contrast:** zero WCAG AA failures across the guide pages.
- **Guide hidden:** with `showGuide: false`, all four guide routes 404, the
  portfolio still serves, and there are **zero** links to `/guide` anywhere.
- **The demo:** duplicated `_template`, renamed it, blanked two sections — card
  appeared at `/work`, page rendered, "Not written yet" showed twice, no restart.

## Deliberately not done

- **Lighthouse.** Never run. Aaron's to do later.
- **Placeholders stay.** `content/site.ts` says "Your Name" and
  `content/about.mdx` is prompts. That's the point of a starter — it shows him
  what he's replacing.
- **TanStack Query is named in the course but not installed.** The setup
  walkthrough has it as an optional "add a package yourself" exercise. Accurate
  as written.
- **The source artifact was never re-diffed.** `content/guide/setup-guide.html`
  was ported from a Claude artifact, then rewritten in plain language. The
  artifact was later updated; those changes were never folded in, because
  re-porting would overwrite the rewrite. The file in the repo is the version of
  record.

## Traps

- **Never run `next build` while `next dev` is running.** They fight over
  `.next` and you get phantom failures — stale module errors, pages that render
  nothing. Cost me a long detour.
- **A backgrounded browser tab throttles timers and frames to nothing.** Any
  measurement that `await`s a `setTimeout` or `requestAnimationFrame` will look
  like a frozen page. Check `document.visibilityState` before believing it.
- **`content/site.ts` is `as const`.** Comparing a field to its shipped value
  narrows the type to `never`. Widen to `string` first — see `lib/site-url.ts`.
- **Motion's `useTransform` can't interpolate `var(--colour)` strings.** It
  builds its interpolator straight from the values you give it. Animate opacity,
  or use `animate` (which does resolve variables).
- **Motion scroll ranges must stay within 0–1.** A negative offset is a hard
  browser error that stops the whole page rendering.
- **`lib/crash-course.ts` only caches the parsed Markdown in production.** In
  development it re-reads the file on every request, because the dev server
  never re-runs that module for a `.md` edit; with the cache on, changes to the
  course text didn't show until a restart. That cost a confused half hour on
  2026-09-05.
- **Editing `content/crash-course.md`:** sections are `## kind: id` with the
  visible heading on the `###` line under it. The parser is fence-aware because
  the template section contains a whole file — `---` and `##` included — inside
  a code fence. Keep the five A–E prompts in the form
  `**Prompt A — title** (when)` followed by a `>` quote, or `/guide/start`
  throws on build. The `install` and `scaffold` sections each need one `>`
  quote (the prompt) and one fence (the commands); `AskOrType` reads both.
- **The deck at `public/downloads/portfolio-crash-course.pptx` is no longer
  linked from anywhere.** It predates the prompt-first rewrite and still shows
  the five Git commands as the primary route. The link came off `/guide` on
  2026-09-06; the file is safe to delete.
- **VS Code's file tree has no "Duplicate".** The first draft of the quick
  start said "right-click `_template` → Duplicate", which is a Finder command.
  In VS Code it's Copy on `_template`, then Paste on `projects`, which makes
  `_template copy`. The walkthrough at `/guide/start` shows this; keep
  `projects/README.md` and `docs/adding-a-project.md` saying the same thing.
- **Animation budget is enforced.** 800ms max, stagger gaps 40–80ms. `Stagger`
  warns in the console if a list blows it. Two documented exceptions: the
  dev-server loop and `Terminal`.

## If you're deleting the guide

`README.md` has a Scaffolding section listing exactly what's safe to remove and
what isn't. Short version: flip `showGuide` to hide it; delete `app/guide/`,
`content/crash-course.md` and `projects/onboarding-redesign/` to remove it.
Never touch `projects/`, `app/work/`, `components/motion/`, `CLAUDE.md` or
`site.config.ts`. This file goes with the guide.

## History

Seventeen commits, each one buildable. `git log --oneline` reads as the build
order: the motion library, the cookbook, a timing pass, the plain-language
rewrite, then the six steps that made `projects/` the content system, then the
course page and the deploy prep.
