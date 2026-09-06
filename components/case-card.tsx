import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/content";

/**
 * One case study in a list. Used on the homepage and on /work.
 *
 * The whole card is one link. Everything inside it is decoration, so a screen
 * reader announces the title once and a keyboard user tabs past it once.
 */
export function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <li className="group border-t border-line">
      <Link
        href={`/work/${study.slug}`}
        className="flex flex-col gap-step-3 py-step-4 no-underline md:flex-row md:items-baseline md:gap-step-5"
      >
        {study.cover && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-panel md:w-64 md:shrink-0">
            <Image
              src={study.cover}
              alt={study.coverAlt ?? ""}
              fill
              sizes="(min-width: 768px) 16rem, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="mb-step-2 font-display text-lg text-ink transition-colors group-hover:text-accent">
            {study.title}
          </h3>
          <p className="mb-step-3 max-w-measure text-sm text-muted">
            {study.summary}
          </p>
          <p className="flex flex-wrap gap-x-step-3 gap-y-step-1 font-mono text-xs text-muted">
            <span>{study.client}</span>
            <span aria-hidden>·</span>
            <span>{study.role}</span>
            <span aria-hidden>·</span>
            <span>{study.year}</span>
          </p>
        </div>

        <span
          aria-hidden
          className="font-mono text-xs text-muted transition-colors group-hover:text-accent"
        >
          Read →
        </span>
      </Link>
    </li>
  );
}
