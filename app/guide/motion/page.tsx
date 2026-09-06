import type { Metadata } from "next";
import Link from "next/link";

import { readExample } from "@/lib/read-example";
import { Entry, type CookbookEntry } from "@/components/cookbook/entry";
import { SwapDemo } from "@/components/cookbook/swap-demo";

import { Accordion } from "@/components/motion/accordion";
import { Check } from "@/components/motion/check";
import { Counter } from "@/components/motion/counter";
import { DragRail } from "@/components/motion/drag-rail";
import { Hoverable } from "@/components/motion/hoverable";
import { LayoutTabs } from "@/components/motion/layout-tabs";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Terminal } from "@/components/motion/terminal";

export const metadata: Metadata = {
  title: "Motion cookbook",
  description:
    "Every animation component on this site, running, with the code to use it.",
};

/**
 * The cookbook.
 *
 * A Server Component. The library components carry their own "use client", so
 * they run in the browser while every word on this page ships as HTML — which
 * is the rule this page is meant to demonstrate.
 *
 * Code snippets are read out of the component files at build time by
 * `readExample`. Nothing here is hand-copied, so nothing here can drift.
 */

/** Plain-language definitions of the five ideas the components are built from. */
const IDEAS = [
  {
    term: "motion.div",
    body: "An ordinary <div> that can be animated. Anywhere you'd write div, span or li, you can write motion.div, motion.span, motion.li instead and it gains animation props. That's the whole difference.",
  },
  {
    term: "variants",
    body: "Named states — \"hidden\", \"shown\" — that a parent can hand down to its children. It's how one element can sequence a whole list without each child watching the page itself. Stagger is this idea and nothing else.",
  },
  {
    term: "whileInView",
    body: "\"Animate to this state when you scroll into view.\" With viewport={{ once: true }} it happens the first time and never again, which is what you almost always want — things that re-animate every pass are exhausting to scroll past.",
  },
  {
    term: "AnimatePresence",
    body: "React removes an element from the page the instant you stop rendering it, so it never gets to animate out. Wrapping it in AnimatePresence keeps it around until its exit animation finishes. Needed for anything that leaves: accordions, crossfades, modals.",
  },
  {
    term: "useScroll",
    body: "Gives you how far down the page you are as a number from 0 to 1. Feed that into anything — a bar's width, a dot's colour, an element's position — and it becomes scroll-driven rather than time-driven.",
  },
];

export default function MotionCookbookPage() {
  const entries: CookbookEntry[] = [
    {
      name: "Reveal",
      file: "reveal.tsx",
      purpose:
        "Fades and lifts a block into place the first time it scrolls into view. The default for content arriving as you scroll.",
      code: readExample("reveal.tsx"),
      usedOn: { href: "/guide#meta", label: "the course title" },
      demo: (
        <div className="flex flex-col gap-step-3">
          <Reveal>
            <p className="text-sm text-ink">This one fades and lifts.</p>
          </Reveal>
          <Reveal delay={0.1} y={24} blur>
            <p className="text-sm text-ink">
              This one travels further and starts out of focus.
            </p>
          </Reveal>
        </div>
      ),
    },
    {
      name: "Stagger",
      file: "stagger.tsx",
      purpose:
        "Brings a list in one item at a time. The parent watches the scroll; the children just do as they're told.",
      code: readExample("stagger.tsx"),
      usedOn: { href: "/guide#deal", label: "this week's deal" },
      demo: (
        <Stagger as="ul" className="flex flex-col gap-step-2">
          {["Direct an AI agent", "Own every decision", "Ship by Day 7"].map(
            (item) => (
              <StaggerItem as="li" key={item} className="text-sm text-ink">
                {item}
              </StaggerItem>
            ),
          )}
        </Stagger>
      ),
    },
    {
      name: "ScrollProgress",
      file: "scroll-progress.tsx",
      purpose:
        "A thin accent bar across the top of the window that fills as you scroll. One per long page.",
      code: readExample("scroll-progress.tsx"),
      usedOn: { href: "/guide", label: "the course" },
      demo: (
        <p className="text-sm text-muted">
          It&rsquo;s running on this page — the accent line pinned to the very
          top of the window. Scroll and watch it.
        </p>
      ),
    },
    {
      name: "Counter",
      file: "counter.tsx",
      purpose:
        "Counts a number up from zero when it scrolls into view. For the one figure that is the point of the sentence.",
      code: readExample("counter.tsx"),
      usedOn: { href: "/guide#content-first", label: "the case-study rule" },
      demo: (
        <p className="text-lg text-ink">
          <Counter to={3} /> case studies,{" "}
          <span className="whitespace-nowrap">
            <Counter to={500} />–<Counter to={800} />
          </span>{" "}
          words each.
        </p>
      ),
    },
    {
      name: "Terminal",
      file: "terminal.tsx",
      purpose:
        "Types commands out character by character, then reveals the output. For commands somebody is meant to type themselves.",
      code: readExample("terminal.tsx"),
      usedOn: { href: "/guide#install", label: "Day 0: install" },
      demo: (
        <Terminal
          lines={[
            { type: "cmd", text: "node -v" },
            { type: "out", text: "v22.14.0" },
            { type: "cmd", text: "npm -v" },
            { type: "out", text: "11.6.2" },
            { type: "comment", text: "# any version number is a pass" },
          ]}
        />
      ),
    },
    {
      name: "Magnetic",
      file: "magnetic.tsx",
      purpose:
        "A button that leans toward the cursor as it gets close. Its whole value is being rare — one per page, on the thing you want clicked.",
      code: readExample("magnetic.tsx"),
      usedOn: { href: "/guide#meta", label: "the course's one call to action" },
      demo: (
        <div className="flex min-h-step-6 items-center justify-center">
          <Magnetic>
            <span className="inline-block rounded-lg bg-accent px-step-3 py-step-2 font-mono text-xs text-accent-ink">
              Move your cursor near me
            </span>
          </Magnetic>
        </div>
      ),
    },
    {
      name: "Hoverable",
      file: "hoverable.tsx",
      purpose:
        "A card that lifts under the cursor and presses down on click. The lift is the affordance — only use it on things that are actually clickable.",
      code: readExample("hoverable.tsx"),
      usedOn: {
        href: "/guide#why-not-squarespace",
        label: "the Squarespace argument",
      },
      demo: (
        <Hoverable className="rounded-lg border border-line bg-bg p-step-4">
          <h4 className="mb-step-1 font-sans text-sm font-semibold text-ink">
            Next.js
          </h4>
          <p className="text-xs text-muted">
            The site framework. Pages, routing, image handling.
          </p>
        </Hoverable>
      ),
    },
    {
      name: "LayoutTabs",
      file: "layout-tabs.tsx",
      purpose:
        "Tabs whose underline slides from the old tab to the new one. You never write the movement — you tell Motion the two underlines are the same thing.",
      code: readExample("layout-tabs.tsx"),
      usedOn: null,
      demo: (
        <LayoutTabs
          tabs={[
            {
              id: "mobile",
              label: "Mobile",
              panel: (
                <p className="text-sm text-ink/85">
                  375 wide first. Always.
                </p>
              ),
            },
            {
              id: "desktop",
              label: "Desktop",
              panel: (
                <p className="text-sm text-ink/85">
                  Second. It&rsquo;s the easier of the two.
                </p>
              ),
            },
          ]}
        />
      ),
    },
    {
      name: "Accordion",
      file: "accordion.tsx",
      purpose:
        "Rows that expand and collapse, with the height animating so the content below slides rather than jumps. For reference material most readers will skip.",
      code: readExample("accordion.tsx"),
      usedOn: { href: "/guide/setup#troubleshooting", label: "the troubleshooting list" },
      demo: (
        <Accordion
          items={[
            {
              id: "node",
              title: "command not found: node",
              body: <p>Quit VS Code fully and reopen. Still failing → reinstall Node.</p>,
            },
            {
              id: "module",
              title: "Cannot find module …",
              body: <p>Run npm install in the project folder.</p>,
            },
          ]}
        />
      ),
    },
    {
      name: "Swap",
      file: "swap.tsx",
      purpose:
        "Crossfades between two versions of the same block. The fade says \"this is the same thing, changed\" — which showing both side by side does not.",
      code: readExample("swap.tsx"),
      usedOn: { href: "/guide#prompting", label: "bad vs. good prompting" },
      demo: <SwapDemo />,
    },
    {
      name: "DragRail",
      file: "drag-rail.tsx",
      purpose:
        "A row you can drag sideways when it's wider than the screen. For sequences where left-to-right order carries meaning and stacking would lose it.",
      code: readExample("drag-rail.tsx"),
      usedOn: { href: "/guide#seven-days", label: "the seven-day timeline" },
      demo: (
        <DragRail>
          {["Install", "Scaffold", "Write", "Design", "Build"].map((day, i) => (
            <article
              key={day}
              className="w-40 shrink-0 rounded-lg border border-line bg-bg p-step-3"
            >
              <p className="font-mono text-xs text-accent">Day {i}</p>
              <p className="text-sm text-ink">{day}</p>
            </article>
          ))}
        </DragRail>
      ),
    },
    {
      name: "Check",
      file: "check.tsx",
      purpose:
        "A checkbox whose tick draws itself on, and remembers being ticked. For lists people work through in the real world and come back to.",
      code: readExample("check.tsx"),
      usedOn: { href: "/guide#reject-list", label: "the reject list" },
      demo: (
        <div className="flex flex-col gap-step-3">
          <Check
            storageKey="cookbook:demo-a"
            label="375px wide, no horizontal scroll"
            hint="This one remembers — reload the page."
          />
          <Check label="Tick me, but don't remember me" />
        </div>
      ),
    },
  ];

  return (
    <>
      <ScrollProgress />

      <div className="mx-auto max-w-page px-step-4 md:px-step-5">
        <header className="py-step-5">
          <p className="mb-step-3 font-mono text-xs tracking-[0.12em] text-accent uppercase">
            Motion cookbook
          </p>
          <h1 className="mb-step-3 max-w-measure text-xl text-ink">
            Every animation on this site, running, with the code to use it.
          </h1>
          <p className="mb-step-4 max-w-measure text-md text-ink/85">
            Point at one of these instead of describing an animation. &ldquo;Use
            Reveal on the case-study heading&rdquo; gets you the same motion as
            everywhere else on the site; &ldquo;make it fade in nicely&rdquo;
            gets you a new one nobody chose.
          </p>
          <p className="flex flex-wrap gap-step-3 font-mono text-xs">
            <Link href="/guide" className="text-accent">
              The course →
            </Link>
            <Link href="/guide/setup" className="text-muted no-underline hover:text-ink">
              Setup guide →
            </Link>
          </p>
        </header>

        <section className="border-t border-line py-step-5">
          <h2 className="mb-step-3 text-lg text-ink">
            Five ideas, and then you can read any of it
          </h2>
          <p className="mb-step-4 max-w-measure text-sm text-ink/85">
            You don&rsquo;t need to learn the animation library. You need these
            five words, so that when you read a component in this folder you know
            what it&rsquo;s doing and can say what you want changed.
          </p>
          <dl className="grid gap-step-3 md:grid-cols-2">
            {IDEAS.map((idea) => (
              <div
                key={idea.term}
                className="rounded-lg border border-line bg-panel p-step-4"
              >
                <dt className="mb-step-2 font-mono text-xs text-accent">
                  {idea.term}
                </dt>
                <dd className="m-0 text-xs text-muted">{idea.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-label="Components" className="border-t border-line py-step-4">
          <h2 className="mb-step-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">
            {entries.length} components
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-x-step-3 gap-y-step-1 p-0">
            {entries.map((entry) => (
              <li key={entry.name}>
                <a
                  href={`#${entry.name.toLowerCase()}`}
                  className="font-mono text-xs text-muted no-underline hover:text-ink"
                >
                  {entry.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {entries.map((entry) => (
          <Entry key={entry.name} entry={entry} />
        ))}

        <footer className="border-t border-line py-step-5">
          <p className="max-w-measure text-sm text-muted">
            Every snippet above is read out of the component&rsquo;s own file
            when the site builds, so it can&rsquo;t drift from the code. To change
            an example, edit the <code className="font-mono text-accent">@example</code>{" "}
            block at the top of the component.
          </p>
        </footer>
      </div>
    </>
  );
}
