# Portfolio

A portfolio site for a designer, built to be directed rather than configured.
Next.js 16, Tailwind 4, content in Markdown, deployed on Vercel.

It ships with the seven-day crash course and the Day 0 setup guide that go with
it, at `/guide`.

## Run it

You need [Node.js](https://nodejs.org) (LTS) and [Git](https://git-scm.com).
If you have never installed either, read `/guide/setup` instead of this file —
it explains every step, including what to do when one of them fails.

```bash
git clone https://github.com/YOUR-USERNAME/portfolio.git
cd portfolio
npm install
npm run dev
```

Open <http://localhost:3000>. Leave that terminal running; it rebuilds the site
every time you save a file.

| Command         | What it does                                          |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | The local site, at localhost:3000. Reloads on save.   |
| `npm run build` | The same build Vercel runs. Run it before you push.   |
| `npm start`     | Serves the built site locally.                        |
| `npm run lint`  | Checks for the mistakes that break a build.           |

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

## Before you show it to anyone

Everything marked `PLACEHOLDER` has to go: `content/site.ts`,
`content/about.mdx`, and `projects/onboarding-redesign/`. Then run the reject list
at the bottom of `CLAUDE.md` on every page.
