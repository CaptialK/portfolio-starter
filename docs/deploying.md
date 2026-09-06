# Deploying

Push to GitHub, import on Vercel, point a domain at it. Do the first two on
Day 1, before the site is any good — everything after that is iteration on a
site that already exists.

## 1. Check it builds

Vercel runs `npm run build`. Run it yourself first; the same error is far easier
to read in your own terminal.

```bash
npm run build
```

If that passes, push. If it doesn't, fix it before you push — a red deploy is
noise you don't need.

## 2. GitHub

Make an empty repository on [github.com](https://github.com/new). No README, no
`.gitignore`, no licence — this project already has all three, and adding them
causes a conflict on the first push.

Then, in the project folder:

```bash
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

If it asks for a password, GitHub wants a personal access token, not your
account password. The setup guide at `/guide/setup` walks through that.

Afterwards, `git push` on its own is enough.

## 3. Vercel

[vercel.com](https://vercel.com) → **Add New** → **Project** → pick the repo →
**Deploy**. Every default is correct; Vercel detects Next.js on its own. There
are no environment variables to set — this site reads from files in the repo,
not from a database or an API.

About a minute later you have a live URL ending in `.vercel.app`. From now on
every `git push` to `main` deploys automatically, which is why the rule is:
only push what you'd show someone.

Pushes to any other branch get a preview URL instead of touching the live site.

## 4. A domain

Buy one at [Cloudflare](https://www.cloudflare.com/products/registrar/) or
[Namecheap](https://www.namecheap.com). `firstnamelastname.com` if it's free.

In Vercel: **Project** → **Settings** → **Domains** → add it. Vercel gives you
one or two DNS records to add at your registrar. Paste them in. It usually
resolves within minutes and can take a few hours; the certificate is automatic.

Then set the real address in `content/site.ts`:

```ts
url: "https://yourname.com",
```

That value is what social-sharing previews, `sitemap.xml`, and `robots.txt` all
point at. Leave it as `https://example.com` and every one of them is wrong.

## Before the first push you'd show anyone

Everything marked `PLACEHOLDER` has to be replaced:

- `content/site.ts` — name, role, tagline, email, location, url, socials
- `content/about.mdx` — the whole page
- `projects/onboarding-redesign/` — the example project, delete the folder

Then the reject list, at the bottom of `CLAUDE.md`, on every page.

## Turning off the guide

The course and the setup guide are scaffolding, not portfolio. When they've
done their job:

1. Delete `app/guide/`, `components/deck/`, `components/guide/`,
   `content/decks/`, `content/guide/`, and
   `public/downloads/portfolio-crash-course.pptx`.
2. Remove the `/guide` entry from `nav` in `content/site.ts`.
3. Remove the `/guide` routes from `app/sitemap.ts` and the "How this site got
   built" section from `app/page.tsx`.
4. `npm run build` to confirm nothing else referenced them.

Nothing else in the site depends on any of it.
