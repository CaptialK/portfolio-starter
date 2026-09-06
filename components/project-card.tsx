import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

/**
 * One project in a list. Used on the homepage and on /work.
 *
 * The whole card is a single link, so a screen reader announces the title once
 * and a keyboard user tabs past it once. Everything inside is decoration.
 *
 * Covers are cropped to the same wide shape whatever you drop in, so a row of
 * cards lines up even when the images don't match.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="group">
      <Link
        href={`/work/${project.slug}`}
        className="flex h-full flex-col rounded-lg border border-line bg-panel p-step-3 no-underline"
      >
        <div className="relative mb-step-3 aspect-[16/10] w-full overflow-hidden rounded bg-bg">
          {project.coverUrl ? (
            <Image
              src={project.coverUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 24rem, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-step-3 text-center font-mono text-xs text-muted">
              Drop a cover.jpg into projects/{project.slug}/
            </span>
          )}
        </div>

        <h3 className="mb-step-2 font-display text-lg text-ink transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mb-step-3 flex-1 text-sm text-muted">{project.summary}</p>
        <p className="flex flex-wrap gap-x-step-3 gap-y-step-1 font-mono text-xs text-muted">
          <span>{project.role}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
        </p>
      </Link>
    </li>
  );
}
