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
content/                 everything you'll actually edit
  site.ts                your name, email, links, nav
  about.mdx              the whole about page
  work/                  one .mdx file per case study
    _TEMPLATE.mdx        copy this to start one (files starting with _ are ignored)
  decks/                 the crash course, as data
  guide/                 the setup guide, as HTML
app/                     one folder per URL
  globals.css            the design tokens: colour, type scale, spacing scale
components/              the pieces the pages are built from
lib/content.ts           reads content/work/ — you shouldn't need to touch it
public/                  images and downloads, served as-is
CLAUDE.md                the design system in words. Claude Code reads it every session.
```

## Adding a case study

Copy `content/work/_TEMPLATE.mdx`, rename it, write. The file name becomes the
URL, and the page appears on `/work` without you registering anything.

Longer version, including the frontmatter fields and where images go:
[`docs/adding-a-case-study.md`](docs/adding-a-case-study.md).

## The sample case studies

Three of them, one per emphasis, all marked `draft: true`. That means they show
while you run `npm run dev` and vanish from anything you build or deploy — you
can read them for shape without any risk of shipping someone else's fiction.
Delete all three once you have written your own.

## Docs

- [Adding a case study](docs/adding-a-case-study.md)
- [The design system](docs/design-system.md) — how `globals.css` and `CLAUDE.md` fit together
- [Directing Claude Code](docs/directing-claude.md) — what a good prompt looks like here
- [Deploying](docs/deploying.md) — GitHub, Vercel, and a domain

## Before you show it to anyone

Everything marked `PLACEHOLDER` has to go: `content/site.ts`,
`content/about.mdx`, and the three sample case studies. Then run the reject list
at the bottom of `CLAUDE.md` on every page.
