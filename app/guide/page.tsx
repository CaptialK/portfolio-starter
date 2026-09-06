import type { Metadata } from "next";
import Link from "next/link";
import { deck } from "@/content/decks/portfolio-crash-course";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "The seven-day crash course and the Day 0 setup guide that built this site.",
};

/**
 * The guide hub: two documents and a download.
 *
 * This whole section is scaffolding for the person building the site, not part
 * of the portfolio. Once it has done its job, delete `app/guide/`,
 * `components/deck/`, `components/guide/`, `content/decks/`, `content/guide/`,
 * and the `/guide` entry in `content/site.ts`. Nothing else references them.
 */

const ROUTES = [
  {
    href: "/guide/course",
    eyebrow: "Day 0 → Day 7",
    title: "The crash course",
    blurb:
      "The argument, the method, the reject list, and the seven-day calendar. Read it once end to end before you install anything.",
    meta: `${deck.slides.length} sections · about 15 minutes`,
  },
  {
    href: "/guide/setup",
    eyebrow: "Day 0",
    title: "The setup guide",
    blurb:
      "Every download and every command, in order, for a designer who has never opened a terminal. Ticks off as you go; progress saves in your browser.",
    meta: "12 sections · 60–90 minutes · macOS",
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="py-step-5">
        <p className="mb-step-3 font-mono text-xs tracking-[0.12em] text-accent uppercase">
          Build notes
        </p>
        <h1 className="mb-step-3 max-w-measure text-xl text-ink">
          How to build this site, from nothing installed to a live URL.
        </h1>
        <p className="max-w-measure text-md text-ink/85">
          This repo is a working Next.js site with placeholder words and a
          placeholder look. These two documents are how you turn it into yours.
          They ship with the code so they can&rsquo;t drift from it.
        </p>
      </header>

      <ul className="m-0 grid list-none grid-cols-1 gap-step-3 p-0 md:grid-cols-2">
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
        <h2 className="mb-step-3 text-lg text-ink">Run it locally</h2>
        <p className="mb-step-3 max-w-measure text-sm text-ink/85">
          Three commands. The setup guide explains what each one is for and what
          to do when one of them fails.
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
          href={deck.download}
          className="font-mono text-xs text-accent"
          download
        >
          Download the deck (.pptx) ↓
        </a>
      </section>
    </div>
  );
}
