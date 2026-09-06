import type { Metadata } from "next";
import Link from "next/link";
import { WordsDrawer } from "@/components/guide/words-drawer";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "The Day 0 setup walkthrough, the quick start, and the motion cookbook.",
};

/**
 * The front door of the guide.
 *
 * Written for somebody who has never opened a terminal and isn't planning to
 * learn to code. Every sentence here should survive the test: could you read it
 * out loud to a designer and have them nod, or would they stop and ask what a
 * word meant?
 *
 * All of this is scaffolding, not portfolio. When it has done its job, delete
 * `app/guide/`, `components/guide/`, `components/cookbook/`, `content/guide/`,
 * `content/glossary.ts` and the `/guide` entry in `content/site.ts`. Nothing
 * else points at them.
 */

const ROUTES = [
  {
    href: "/guide/setup",
    eyebrow: "Day 0",
    title: "The setup walkthrough",
    blurb:
      "Every download and every command, in order, for a designer who has never opened a terminal. Tick things off as you go; the page remembers where you got to.",
    meta: "12 sections · 60–90 minutes · macOS",
  },
  {
    href: "/guide/start",
    eyebrow: "Day 5",
    title: "Quick start",
    blurb:
      "How your projects get onto the site: add a folder, get a page. Plus four prompts to paste when you want Claude to write or design one.",
    meta: "7 sections · about 10 minutes",
  },
  {
    href: "/guide/motion",
    eyebrow: "Day 4 →",
    title: "The motion cookbook",
    blurb:
      "Every bit of movement on this site, running, with the words that ask for it. Point at one by name instead of describing a feeling.",
    meta: "12 pieces · look before you ask",
  },
];

/** The two jobs worth handing straight to Claude. Copy the box, paste, send. */
const PROMPTS = [
  {
    when: "When you want to understand one",
    why: "It writes an explanation into the files themselves, so it's there next time you look.",
    text: `Open components/motion/Reveal.tsx and components/motion/Stagger.tsx. Add inline comments explaining every line to someone who has never written React. Then, in plain language in the chat, explain: what a variant is, what whileInView does, and why Stagger needs both a parent and a child component. Do not change any behavior.`,
  },
  {
    when: "When you want it on your own pages",
    why: "It shows you each change before making it, so nothing lands that you haven't looked at.",
    text: `Read components/motion/ and /guide/motion. Now apply three things to the real portfolio pages, using only the existing library: Reveal on the homepage hero, Stagger + Hoverable on the project card grid, and Reveal on each case study's section headings. Nothing else. Match the timing tokens exactly. Show me the diff for each file before applying. After: run npm run build and tell me what to look at on my phone.`,
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="py-step-5">
        <div className="mb-step-3 flex items-center justify-between gap-step-3">
          <p className="font-mono text-xs tracking-[0.12em] text-accent uppercase">
            Start here
          </p>
          <WordsDrawer />
        </div>

        <h1 className="mb-step-3 max-w-measure text-xl text-ink">
          From nothing installed to a site that&rsquo;s actually online.
        </h1>
        <p className="max-w-measure text-md text-ink/85">
          What you have is a working site wearing placeholder words and a
          placeholder look. Every visual decision on it is still yours. These
          pages are how you make it yours, and they live inside the project
          folder (where all your files are) so they can never go out of date.
        </p>
      </header>

      <ul className="m-0 grid list-none grid-cols-1 gap-step-3 p-0 md:grid-cols-3">
        {ROUTES.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="group flex h-full flex-col rounded-lg border border-line bg-panel p-step-4 no-underline"
            >
              <p className="mb-step-2 font-mono text-xs tracking-[0.12em] text-accent uppercase">
                {route.eyebrow}
              </p>
              <h2 className="mb-step-2 font-display text-lg text-ink transition-colors group-hover:text-accent">
                {route.title}
              </h2>
              <p className="mb-step-3 flex-1 text-sm text-ink/85">
                {route.blurb}
              </p>
              <p className="font-mono text-xs text-muted">{route.meta}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-step-5 border-t border-line py-step-5">
        <h2 className="mb-step-3 text-lg text-ink">
          Getting it onto your own computer
        </h2>
        <p className="mb-step-3 max-w-measure text-sm text-ink/85">
          Four lines, typed into the terminal (a text box for commands). The
          setup walkthrough explains what each one is for, and what to do when
          one of them goes wrong.
        </p>
        <p className="mb-step-2 max-w-measure font-mono text-xs text-muted">
          Copies the files down, moves into the folder, fetches what the site
          needs, then opens it at localhost:3000.
        </p>
        <pre className="mb-step-4 max-w-measure overflow-x-auto rounded-lg border border-line bg-black p-step-4 font-mono text-xs text-accent">
          {[
            "git clone https://github.com/YOUR-USERNAME/portfolio.git",
            "cd portfolio",
            "npm install",
            "npm run dev",
          ].join("\n")}
        </pre>
        <a
          href="/downloads/portfolio-crash-course.pptx"
          className="font-mono text-xs text-accent"
          download
        >
          Download the deck (.pptx) ↓
        </a>
      </section>

      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-3 text-lg text-ink">Asking for the movement</h2>
        <p className="mb-step-4 max-w-measure text-sm text-ink/85">
          Twelve pieces of movement are already built and named — the same idea
          as a component in Figma, but for the way things arrive and respond.
          Naming one gets you the exact movement used everywhere else on the
          site. Describing a feeling gets you a new one that nobody chose.{" "}
          <Link href="/guide/motion" className="text-accent">
            Watch them running first
          </Link>
          , then use these.
        </p>

        <ul className="m-0 grid list-none gap-step-3 p-0 lg:grid-cols-2">
          {PROMPTS.map((prompt) => (
            <li
              key={prompt.when}
              className="flex min-w-0 flex-col rounded-lg border border-line bg-panel p-step-4"
            >
              <h3 className="mb-step-1 font-sans text-sm font-semibold tracking-normal text-ink">
                {prompt.when}
              </h3>
              <p className="mb-step-3 text-xs text-muted">{prompt.why}</p>
              <pre className="m-0 overflow-x-auto rounded border border-line bg-black p-step-3 font-mono text-xs whitespace-pre-wrap text-ink/85">
                {prompt.text}
              </pre>
            </li>
          ))}
        </ul>

        <p className="mt-step-4 max-w-measure text-xs text-muted">
          Both of these are yours to run, in the Claude panel inside VS Code.
          That is the whole point — you decide what happens and whether it was
          any good.
        </p>
      </section>
    </div>
  );
}
