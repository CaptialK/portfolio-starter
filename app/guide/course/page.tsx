import type { Metadata } from "next";
import Link from "next/link";
import { deck } from "@/content/decks/portfolio-crash-course";
import { Slide } from "@/components/deck/deck-slide";

export const metadata: Metadata = {
  title: deck.title,
  description: `${deck.subtitle} ${deck.lede}`,
};

/**
 * The crash course deck, as a page.
 *
 * Content comes from content/decks/portfolio-crash-course.ts. This file is only
 * the frame: hero, contents, slides, download link.
 */
export default function CoursePage() {
  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="py-step-5">
        <p className="mb-step-3 font-mono text-xs tracking-[0.12em] text-accent uppercase">
          {deck.title}
        </p>
        <h1 className="mb-step-3 max-w-measure text-xl text-ink">
          {deck.subtitle}
        </h1>
        <p className="mb-step-4 max-w-measure text-md text-ink/85">
          {deck.lede}
        </p>
        <p className="flex flex-wrap gap-step-3 font-mono text-xs">
          <a href={deck.download} className="text-accent" download>
            Download the deck ↓
          </a>
          <Link href="/guide/setup" className="text-muted no-underline hover:text-ink">
            Setup guide →
          </Link>
        </p>
      </header>

      <nav aria-label="Contents" className="border-t border-line py-step-4">
        <h2 className="mb-step-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">
          Contents
        </h2>
        <ol className="m-0 grid list-none grid-cols-1 gap-x-step-4 gap-y-step-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {deck.slides.map((slide) => (
            <li key={slide.id}>
              <a
                href={`#${slide.id}`}
                className="flex items-baseline gap-step-2 py-step-1 text-xs text-muted no-underline hover:text-ink"
              >
                <span className="font-mono text-accent">
                  {String(slide.n).padStart(2, "0")}
                </span>
                {slide.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {deck.slides.map((slide) => (
        <Slide key={slide.id} slide={slide} />
      ))}

      <footer className="border-t border-line py-step-5">
        <p className="max-w-measure text-sm text-muted">
          Next:{" "}
          <Link href="/guide/setup" className="text-accent">
            the Day 0 setup guide
          </Link>{" "}
          — every download and every command, in order.
        </p>
      </footer>
    </div>
  );
}
