# Portfolio

A portfolio site for a designer, built to be directed rather than configured.
Next.js 16, Tailwind 4, content in Markdown, deployed on Vercel.

It ships with the seven-day crash course and the Day 0 setup guide that go with
it, at `/guide`.

## Start from this

This is a template repository. Click **Use this template** at the top of
[github.com/CaptialK/portfolio-starter](https://github.com/CaptialK/portfolio-starter),
name your copy `portfolio`, and you get a fresh repo of your own with none of
this one's history. Then clone that.

Don't fork it. A fork stays tied to this one, and you want somewhere of your own
to push.

## Run it

You need [Node.js](https://nodejs.org) (LTS) and [Git](https://git-scm.com).
If you have never installed either, read `/guide/setup` instead of this file —
it explains every step, including what to do when one of them fails.

Clone your copy from inside VS Code (⌘⇧P → **Git: Clone** → **Clone from
GitHub**), or drag the folder onto the VS Code icon if it's already on your
Mac. Open the Claude Code panel and say:

> Install this project's packages, then start the dev server and keep it
> running. Give me the localhost link.

Or type it yourself:

```bash
git clone https://github.com/YOUR-USERNAME/portfolio.git   # your copy, made with "Use this template"
cd portfolio
npm install
npm run dev
```

Open <http://localhost:3000>. Leave the dev server running; it rebuilds the site
every time you save a file.

The commands underneath, whichever way they get run:

| Say                          | Command         | What it does                                          |
| ---------------------------- | --------------- | ----------------------------------------------------- |
| "Start the dev server"       | `npm run dev`   | The local site, at localhost:3000. Reloads on save.   |
| "Run a production build"     | `npm run build` | The same build Vercel runs. Do it before you push.    |
| "Serve the production build" | `npm start`     | Serves the built site locally.                        |
| "Lint it"                    | `npm run lint`  | Checks for the mistakes that break a build.           |

## Where things are

```
projects/                your projects. one folder each
  _template/             duplicate this to start one (folders starting with _ are ignored)
  onboarding-redesign/   a worked example. delete it once you have your own
content/                 everything else you'll edit
  site.ts                your name, email, links, nav
  about.mdx              the whole about page
  crash-course.md        the course text, for the /guide pages
  guide/                 the setup walkthrough, as HTML
app/                     one folder per URL
  globals.css            the design tokens: colour, type scale, spacing scale
components/              the pieces the pages are built from
lib/projects.ts          reads projects/ — you shouldn't need to touch it
public/                  images and downloads, served as-is
CLAUDE.md                the design system in words. Claude Code reads it every session.
```

## Adding a project

Duplicate `projects/_template`, rename the copy, write. The folder name becomes
the address, and the card appears on `/work` without you registering anything.

Longer version, including the fields and where images go:
[`docs/adding-a-project.md`](docs/adding-a-project.md).

## The example project

`projects/onboarding-redesign/` is filled in so you can see the shape of a
finished one. Its summary starts with "EXAMPLE PROJECT" in capitals so it can't
be mistaken for yours. Delete the folder once you have your own.

## Docs

- [Adding a project](docs/adding-a-project.md)
- [The design system](docs/design-system.md) — how `globals.css` and `CLAUDE.md` fit together
- [Directing Claude Code](docs/directing-claude.md) — what a good prompt looks like here
- [Deploying](docs/deploying.md) — GitHub, Vercel, and a domain
- [Handoff](docs/HANDOFF.md) — how the starter itself is built, for whoever maintains it

## Scaffolding

Some of this site is here to teach you, not to be part of your portfolio. It is
all clearly separated, and none of it is load-bearing.

### Hiding the guide

Open `site.config.ts` and change one word:

```ts
showGuide: true   →   showGuide: false
```

Save, then tell Claude "save a checkpoint called hide guide and push it" (or
`git add .` / `git commit -m "hide guide"` / `git push`). The guide
disappears from your live site. It stays at `localhost:3000/guide` whenever you
run the dev server, cookbook included, for as long as you want it. The Guide
link vanishes from the nav at the same time, so nothing points at a page that
isn't there.

### Safe to delete, once you're done learning

- `app/guide/` — the whole guide section
- `content/crash-course.md` — the course text it reads
- `projects/onboarding-redesign/` — the example project
- `docs/HANDOFF.md` — notes on building the starter, not on using it

### Not scaffolding. Don't delete these

- `projects/` — your actual projects
- `app/work/` — the pages that show them
- `components/motion/` — the animations your own pages use
- `CLAUDE.md` — your design system, in words
- `site.config.ts` — site settings

## Before you show it to anyone

Everything marked `PLACEHOLDER` has to go: `content/site.ts`,
`content/about.mdx`, and `projects/onboarding-redesign/`. Then run the reject list
at the bottom of `CLAUDE.md` on every page.
