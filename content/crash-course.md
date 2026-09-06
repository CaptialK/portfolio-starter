# Ship It in 7 Days — content source

> Drop this file into the repo at `content/crash-course.md`. It is the single source of truth for the `/guide` section. Every section below has a stable `id` so components can reference it. Do not paraphrase the copy when building; render it.

---

## meta

- title: Ship it in 7 days.
- subtitle: You design. The AI builds. You decide what's good enough.
- audience: Aaron, junior UI/UX designer, first portfolio, on a Mac
- days: 0 through 7

---

## section: deal
### The deal for this week

**You will**
- Direct an AI agent to build a real, custom site
- Own every design decision on it
- Ship a live URL by Day 7
- Learn just enough plumbing to never be stuck

**You will not**
- Learn React (you don't need to)
- Hand-write code
- Understand everything it generates
- Make it perfect

> Speed beats polish this week. A live, decent site you refine for months beats a perfect one that never ships.

---

## section: why-not-squarespace
### Why not just use Squarespace?

1. **The signal flipped.** When building custom costs a weekend, a template stops reading as "pragmatic" and starts reading as "didn't bother."
2. **Prototypes can't live there.** Working, clickable interactions are your biggest flex. A template site can't host them.
3. **You own the whole thing.** Files, history, domain. Nothing locked inside someone else's CMS. It grows with you for years.

---

## section: stack
### The stack: what each thing is, to you

| Tool | What it is, to you |
|---|---|
| Next.js | The site framework. Pages, routing, image handling. |
| Tailwind | Styling as class names. Claude speaks it fluently. |
| TanStack Query | Fetches and caches data for interactive prototypes. |
| Motion (Framer Motion) | Animation and micro-interactions. What makes it feel designed. |
| Vercel | Hosting. Every push goes live in about a minute. |
| GitHub | Your save history. Undo for everything. |
| Claude Code | The builder. You direct, it types. |

---

## section: install
### Day 0: install this before anything else

| Install | Notes |
|---|---|
| VS Code | Plus the Claude Code extension. No separate CLI needed. |
| Node.js (LTS) | nodejs.org, click the LTS button. Next.js and Claude Code both need it. |
| Git | Run `git --version`; macOS offers to install the developer tools. |
| GitHub account | Free. This is where the code lives. |
| Vercel account | Sign in with GitHub. Free tier is plenty. |
| Domain (Day 7) | Cloudflare or Namecheap. firstnamelastname.com if it's free. |

**Then check it worked** (each prints a version, not "command not found"):

```
node -v
npm -v
git --version
code --version
```

---

## section: dev-server-loop
### Why the local dev server is the whole game

1. **You prompt.** Screenshot, Figma frame, exact words.
2. **Claude edits files.** Writes the components and styles.
3. **Browser updates.** `npm run dev` refreshes localhost:3000 in under a second.
4. **You judge.** Look at it at 375px. Accept, or say what's wrong.

Then back to step 1. Dozens of times a day.

> The loop is look → reject → repeat. That needs a browser tab that updates instantly, on your machine. Cloud-only tools break the loop: you'd be waiting on deploys to see every change.

---

## section: content-first
### No case studies, no site

- **3** case studies. Not 6. Three great ones.
- **500–800** words each, written in a doc first. Not in the site.

Pick the three that show different things:
1. **Process** — the one where the research changed the design.
2. **Craft** — the one that looks the best. Pixel-level care.
3. **Outcome** — the one that shipped, or had a result you can name.

> Hiring managers spend about 90 seconds. They are reading for how you think, not how the site was built.

---

## section: case-study-anatomy
### Anatomy of a case study that gets a reply

1. **Problem** — Who it was for, what was broken. One paragraph.
2. **Constraints** — Time, team, tech, what you weren't allowed to change.
3. **What you did** — Process and artifacts: sketches, flows, tests, iterations.
4. **Decisions & why** — The 2–3 forks in the road and what you picked. *This is the part that gets you hired.*
5. **Outcome** — Shipped? Numbers? If none, what you learned.
6. **What you'd change** — One honest paragraph. Reads senior.

---

## section: figma-first
### Design it in Figma before Claude touches it

- Site map: Home, Work (3 case studies), About/Contact. That's it.
- Mobile frame first (375 wide), then desktop. Not the other way.
- Type scale: 5 sizes, max. Name them.
- Spacing scale: 4 / 8 / 16 / 24 / 48 / 96.
- Colors: one background, one text, one accent.
- Home + one case-study template. Don't design all three pages.

**Why this matters:** Claude builds what you show it. A Figma frame gets a faithful build. A vibe gets the same site everyone else with the same tool is shipping this month.

---

## section: scaffold
### Day 1: scaffold it, push it, deploy it. Same day.

```
npx create-next-app@latest portfolio
→ Yes, use recommended defaults (TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md)
cd portfolio
npm install @tanstack/react-query motion
npm run dev
# open http://localhost:3000
```

1. **Push to GitHub.** Source Control panel → Publish Branch (first time). After that, the five git commands.
2. **Import on Vercel.** vercel.com → Add New → Project → pick the repo → Deploy. Defaults are fine.
3. **You're live.** A real URL on Day 1. Everything after this is iteration on a site that already exists.

Also on Day 1: fill in CLAUDE.md. Do it before the first real build prompt.

---

## section: git
### Git: the only five commands you need

| Command | Meaning |
|---|---|
| `git status` | What changed since the last save? |
| `git add .` | Stage everything. |
| `git commit -m "what you did"` | Save a checkpoint with a note. |
| `git push` | Send it up. Vercel deploys automatically. |
| `git log --oneline` | See your history. |

**Rules**
- One branch. It's called main. No others this week.
- Commit every time something works. Small and often.
- Push = deploy. Only push what you'd show someone.
- Broke it? Tell Claude Code: "revert to the last commit."

> Git isn't a skill to learn. It's what makes breaking things free.

---

## section: loop
### The loop you'll run fifty times a day

1. **Describe** — One screen. Figma frame or screenshot attached. Exact sizes and rules.
2. **Build** — Claude Code edits. Watch the terminal; it tells you what it touched.
3. **Look** — Browser, at 375px and desktop. Actually click things.
4. **Judge** — Accept, or paste a screenshot and say precisely what's wrong.
5. **Commit** — Works? git add . / commit / push. Next screen.

> Never accept what you haven't looked at. The agent will produce something competent by default. Competent-by-default is what everyone else is shipping. Your taste is the only thing on this site that isn't a commodity.

---

## section: prompting
### Prompting: bad vs. good

**Bad**
> "Make the homepage look nice and modern."

**Good**
> "Build the homepage from the attached Figma frame. Hero: my name at 64px, one-line role in the muted color. Below it, 3 project cards: 1 column on mobile, 3 on desktop, 16px gap. Use the type and spacing scale in CLAUDE.md. No animations. Tell me what files you changed."

**Habits**
- One screen per prompt. Not "build the site."
- Say what NOT to do. It over-decorates by default.
- Attach the Figma frame or a screenshot every time.
- Ask "what did you change?" so you learn the shape of the project.

> Specifics in, faithful build out. Vibes in, generic out.

---

## section: claude-md
### CLAUDE.md: your design system, in words

A plain text file at the root of the repo. Claude Code reads it at the start of every session, so every prompt inherits your rules without you repeating them.

- Write it on Day 1, before the first real build.
- Update it when you make a new rule ("never center body text").
- Rules about what NOT to do are the most valuable lines in it.
- It's also a great artifact to talk about in interviews.

Example:
```
# Portfolio rules
- Fonts: Inter (body), Instrument Serif (headings)
- Type scale: 14 / 16 / 20 / 28 / 44 / 64
- Spacing: 4 / 8 / 16 / 24 / 48 / 96
- Colors: bg #0E0E0E, text #F2F2EE, accent #D4FF3A
- Mobile first. Body max-width 720px.
- Left-align all body text.
- No animations, gradients, or custom cursors unless I ask.
- Every image goes through next/image.
- Content lives in /content as .mdx files.
- After each change, tell me which files you edited.
```

---

## section: reject-list
### The reject list: run it before every push you'd show someone

- [ ] **375px wide, no horizontal scroll** — Chrome DevTools → device toolbar. Every page.
- [ ] **Lighthouse ≥ 90** — Performance and Accessibility. DevTools → Lighthouse tab.
- [ ] **Contrast passes 4.5:1** — Muted text on dark backgrounds is where this fails.
- [ ] **Images optimized** — Every one through next/image. Under 300KB each.
- [ ] **Keyboard works** — Tab through the whole site. Can you reach everything?
- [ ] **Does it look like yours?** — Or like the default? The type scale is the tell.

> Vibe-coded sites fail this list constantly. A designer being judged on a janky site is worse than no site.

---

## section: live-prototypes
### Live prototypes: the actual flex

Most portfolios show screenshots of a flow. Yours embeds the flow, working, inside the case study. The reader uses it.

Start with one. Tell Claude Code:
> "Build an interactive prototype of the onboarding flow from this Figma file, as a component embedded in the case-study page. Fake the data. Match the real product's dimensions on mobile."

If it needs real data from an API, that's what TanStack Query is for. Otherwise, fake it.

**Why it works**
- "Here, use it" beats twelve slides of process.
- It's the one thing a template site structurally can't do.
- It makes a junior read as senior.
- It's the portfolio of a design engineer, which is a much smaller pool than "junior product designer."

---

## section: seven-days
### Seven days, start to live

| Day | Title | What happens |
|---|---|---|
| 0 | Install | Everything on the install list. Accounts made. Versions print. |
| 1 | Scaffold + deploy | create-next-app, push, Vercel. Fill in CLAUDE.md. Site map in Figma. |
| 2 | Write | Three case studies, in a doc, using the anatomy template. |
| 3 | Design | Home + case-study template in Figma. Mobile first. Type and spacing scales set. |
| 4 | Build the shell | Home and the case-study template with Claude Code. Screen by screen. |
| 5 | Fill it | Three case studies as MDX. About page. Real images. |
| 6 | Quality pass | The reject list, every page. Fix until it passes. |
| 7 | Launch | Domain pointed. Send the link to five people. Ask what confused them. |

---

## section: done
### Done means. Then what.

**Done on Day 7 when**
- It's live on your own domain.
- Three case studies, each with a real decisions section.
- It passes the reject list on every page.
- You can explain every design decision on it out loud.
- You've sent it to five people.

**After launch**
- Add one live prototype per case study, one at a time.
- Iterate weekly from feedback. Small commits.
- Keep CLAUDE.md honest. It's your design system now.
- Apply with the URL in the first line of every message.
- Start describing yourself as someone who ships.

> Refine for months. Ship in a week.

---
---

# Setup guide content (for `/guide/setup`)

## setup: two-kinds
### Two kinds of "download"

**Apps from the web** — VS Code, Node.js, Git, Chrome. Download from a website, run an installer. Install once for the whole Mac. Live in /Applications. You'll almost never touch these again.

**Packages from npm** — Next.js, React, Tailwind, Motion, TanStack Query. Downloaded by typing a command in the terminal. Installed per project, into the project folder. Live in `node_modules`. Listed in `package.json` so they can be re-downloaded anytime.

> Think of it like Figma vs. a Figma file's fonts and plugins. Figma is installed once. The specific fonts a file uses belong to that file.

## setup: terminal
### The terminal

Open it inside VS Code with **Control + backtick** (⌃`). The backtick key is directly under esc. ⌃⇧` opens a second terminal. Menu fallback: Terminal → New Terminal.

Why VS Code's terminal: it opens already inside the folder you have open, so commands run in the right place.

| Type | What it does |
|---|---|
| `pwd` | Where am I? |
| `ls` | What's in this folder? |
| `cd portfolio` | Move into that folder. `cd ..` goes up. |
| `clear` | Wipe the screen. |
| ⌃C | Stop whatever is running (how you stop the dev server). |
| ↑ | Bring back the last command. |
| Tab | Autocomplete a file or folder name. |

Rules: never paste a command you don't understand; if something asks for your password (`sudo`), stop and ask.

## setup: npm
### npm

An app store for code, without the storefront. `package.json` is the shopping list. `node_modules/` is the delivered boxes: huge, ignored by Git, never edited, always regenerable.

| Command | Meaning |
|---|---|
| `npm install` | Download everything on the list. |
| `npm install motion` | Add one package to the list and download it. |
| `npx create-next-app@latest` | Run a tool once without keeping it. |
| `npm run dev` | Run the script named `dev` from package.json. |

## setup: run
### Run it

- `npm run dev` — the dev server. Starts localhost:3000 and rebuilds on every save. Leave it running. ⌃C stops it.
- `npm run build` — the production build. Refuses to finish if anything is broken. **Run before every push.** Green build → safe to push.
- `npm run start` — serves the build exactly as production would. Rare.

These are just the `scripts` block in package.json.

## setup: folder
### What's in the folder

```
portfolio/
├── app/                  ← your pages. every folder here is a URL
│   ├── layout.tsx        ← the frame around every page: fonts, nav, footer
│   ├── page.tsx          ← the homepage. what shows at /
│   └── globals.css       ← global styles + the Tailwind import
├── components/           ← reusable pieces. Figma components, but real
├── content/              ← your words. case studies as .mdx
├── public/               ← images served as-is. public/me.jpg → /me.jpg
├── node_modules/         ← downloaded packages. never edit, never commit
├── package.json          ← the shopping list + scripts
├── CLAUDE.md             ← what Claude Code reads first
└── AGENTS.md             ← rules for AI agents working in this repo
```

**File-based routing:** `app/about/page.tsx` → `/about`. `app/work/onboarding-redesign/page.tsx` → `/work/onboarding-redesign`. No config anywhere.

**How it ships:** your files → `git push` → Vercel runs `npm run build` → live on a CDN in about 60 seconds. Push is the deploy.

## setup: troubleshooting
### When something breaks

| You see | Do |
|---|---|
| `command not found: node` | Quit VS Code fully and reopen. Still failing → reinstall Node. |
| `Cannot find module …` | `npm install` |
| `Port 3000 is in use` | Another dev server is running. Next uses 3001; fine. Or ⌃C the other one. |
| `ENOENT … package.json` | Wrong folder. `pwd`, then `cd portfolio`. |
| Red error overlay | Copy the first line to Claude with "fix this," or rewind. |
| Browser shows old content | File not saved (⌘S), or dev server crashed. Check terminal. |
| Terminal looks frozen | Dev server is running. Open a second terminal. |
| Vercel build failed | Run `npm run build` locally. Same error, easier to read. |

> Stuck for more than ten minutes: screenshot the terminal, screenshot the browser, drop both into Claude with "what's wrong and what should I type?"

---
---

# Quick start content (for `/guide/start`) — shown after setup

## quickstart: intro
### Quick start: put your first project in

You don't write code to add a project. You add a folder. The site notices, and a page appears. Then you hand the folder to Claude and tell it what you want the page to be.

## quickstart: folder
### The projects folder

```
projects/
├── README.md                 ← this same explanation, in the folder itself
├── _template/                ← copy this. never edit it directly
│   ├── project.md            ← fill-in-the-blanks case study
│   ├── cover.jpg             ← replace with yours
│   └── images/
└── onboarding-redesign/      ← one folder per project. folder name = the URL
    ├── project.md
    ├── cover.jpg
    ├── images/
    │   ├── 01-research.png   ← number them in the order you'd tell the story
    │   ├── 02-wireframes.png
    │   └── 03-final.png
    └── prototype/            ← optional: Figma export, flow notes, anything for a live prototype
```

The folder name becomes the address: `projects/onboarding-redesign` shows at `/work/onboarding-redesign`. Lowercase, dashes instead of spaces.

## quickstart: steps
### Five steps

1. In VS Code's file tree, right-click `_template` → Duplicate. Rename the copy to your project, lowercase-with-dashes.
2. Drag your files in from Finder: a cover image, screenshots into `images/`, a Figma PDF export, whatever you have. Names don't matter yet; you'll tidy them later.
3. Open `project.md`. Fill in the top: title, your role, year, tools, one-line summary. Leave the long sections empty if you haven't written them. Save.
4. Look at `localhost:3000/work`. Your project card is there. Click it. That's your page, unstyled and honest.
5. Now hand it to Claude with one of the prompts below.

## quickstart: template
### What's in project.md

```
---
title: Onboarding redesign
role: Product designer
year: 2026
tools: Figma, Maze, Notion
summary: One sentence. What it was and what changed.
cover: cover.jpg
---

## Problem
Who it was for, what was broken. One paragraph.

## Constraints
Time, team, tech, what you weren't allowed to change.

## What I did
Process and artifacts. Reference images like this: ![Early wireframes](images/02-wireframes.png)

## Decisions and why
The 2–3 forks in the road and what you picked. This is the part that gets you hired.

## Outcome
Shipped? Numbers? If none, what you learned.

## What I'd change
One honest paragraph.
```

## quickstart: prompts
### Prompts you can paste into Claude Code right now

Each of these assumes Claude Code is open in the panel with your project folder open. Replace `onboarding-redesign` with your folder name.

**Prompt A — write it with me** (when you have files but no words yet)
> Look at everything in projects/onboarding-redesign/. Using the section headings already in project.md, interview me: ask me one question at a time until you can fill in Problem, Constraints, What I did, Decisions and why, Outcome, and What I'd change. Keep my voice; don't make it sound corporate. Then write the draft into project.md, place my images where they belong in the story with a one-line caption each, and tell me to look at the page.

**Prompt B — make it a designed page** (when the words are in)
> Read projects/onboarding-redesign/project.md and its images. Turn /work/onboarding-redesign into a designed case study: cover image hero, a small sticky nav for the six sections, images full-width with captions, one pull quote from Decisions and why. Use Reveal on headings and Stagger on image groups from components/motion. Mobile first. Follow CLAUDE.md. Do not change my words. Show me the diff before applying.

**Prompt C — add a live prototype** (the flex)
> Look in projects/onboarding-redesign/prototype/. Build a working, clickable prototype of the onboarding flow as a piece embedded near the top of the case study page, sized like a phone on mobile and centered on desktop. Fake the data. Add a small "Try it" label above it. Don't touch anything else on the page.

**Prompt D — fix what I'm looking at** (any time)
> Here is a screenshot. [drag it in] The thing that's wrong: [say it plainly]. Fix only that.

## quickstart: rules
### Three rules that keep this fun

- Add the folder first, prompt second. Claude does better when the files exist.
- One prompt, one page. Don't ask for three case studies in one go.
- Save, look, then decide. Never approve a change you haven't seen at phone width.

---

## explore
### Now go find out what's possible

The setup is done. The rules are written. From here, the only skill that matters is asking for what you want and knowing when to say no.

Things designers with an agent next to them are doing right now:

- Turning a Figma prototype into a working one people can actually use, in an afternoon.
- Building a component library from their own design system and watching it become real code.
- Making a case study that adapts: hover a decision, see the alternative you rejected.
- Prototyping motion by describing it ("the card should settle like it landed on a table") and tuning by eye.
- Shipping a side project to a real URL with a real domain before the idea gets stale.
- Asking "what else could we do with this?" and following the answer.

You don't need to know how any of it works underneath. You need to know what good looks like, say it clearly, and look carefully at what comes back. That's the job now. Have fun with it.
