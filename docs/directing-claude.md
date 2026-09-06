# Directing Claude Code

The agent will produce something competent by default. Competent-by-default is
what everyone else is shipping. Your taste is the only thing on this site that
isn't a commodity, so the job is to spend it — on judging, not on typing.

## The loop

1. **Describe** one screen. Attach the Figma frame or a screenshot. Give exact
   sizes and rules.
2. **Build.** Watch the terminal; it says which files it touched.
3. **Look.** In the browser, at 375px and at desktop. Actually click things.
4. **Judge.** Accept, or paste a screenshot back and say precisely what's wrong.
5. **Commit.** `git add .`, `git commit -m "what you did"`, `git push`.

Never accept what you haven't looked at.

## What a prompt looks like here

Bad:

> Make the homepage look nice and modern.

Good:

> Build the homepage hero from the attached Figma frame. My name at
> `text-2xl`, role beneath it in `font-mono text-xs` uppercase with the accent
> colour, then the tagline at `text-md`. Stack everything left-aligned, max
> width `max-w-measure`. Use the spacing scale — nothing arbitrary. No
> animation beyond the existing `[data-reveal]`. Tell me which files you
> changed.

The difference is not politeness or length. It's that the second one can only
be built one way.

## Things worth saying in this repo

Because they are already true, and repeating them keeps them true:

- "Use the type and spacing scale from `CLAUDE.md`. No arbitrary values."
- "Content goes in `content/`, not hard-coded into the component."
- "Server Component unless it genuinely needs state."
- "Every image through `next/image`, with real alt text."
- "Tell me which files you changed."

## Say what not to do

The agent over-decorates by default. Gradients, extra colours, a hover
animation on everything. A single "no animations, no gradients, one accent
colour only" in the prompt saves a round trip almost every time.

The most valuable lines in `CLAUDE.md` are the ones that start with "no" and
"never." Add to them whenever you catch yourself rejecting the same thing twice
— that's a rule you have and haven't written down.

## One screen per prompt

"Build the site" gets you a site-shaped thing you didn't design. "Build the work
index" gets you a page you can judge. Small prompts also mean small diffs, and a
small diff is one you can actually read.

## When it goes wrong

- **Something broke and you don't know what.** "Revert to the last commit."
  This is why you commit every time something works.
- **The build fails on Vercel.** Run `npm run build` locally. Same error, easier
  to read.
- **It's confidently wrong.** Paste the actual error text or a screenshot. The
  agent is much better at debugging evidence than at debugging descriptions.
- **It keeps making the same mistake.** That's a missing line in `CLAUDE.md`,
  not a prompting problem. Write the rule down.

## Ask what changed

End prompts with "tell me which files you changed," and read the answer. After
a week of this you will know the shape of your own project, which is the
difference between owning a codebase and hosting one.
