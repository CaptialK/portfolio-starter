import Link from "next/link";
import { site } from "@/content/site";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

/**
 * The homepage. Three things, in this order: who you are, what you've made,
 * how to reach you. Nothing else earns its place above the fold.
 */
export default function Home() {
  const projects = getProjects();

  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <section className="bg-grid -mx-step-4 px-step-4 py-step-6 md:-mx-step-5 md:px-step-5">
        <div data-reveal className="max-w-measure">
          <h1 className="mb-step-3 text-2xl text-ink">{site.name}</h1>
          <p className="mb-step-3 font-mono text-xs tracking-[0.12em] text-accent uppercase">
            {site.role}
          </p>
          <p className="mb-step-4 text-md text-ink/85">{site.tagline}</p>
          <p className="text-sm">
            <a href={`mailto:${site.email}`} className="text-accent">
              {site.email}
            </a>
          </p>
        </div>
      </section>

      <section className="py-step-5">
        <div className="mb-step-4 flex items-baseline justify-between gap-step-3">
          <h2 className="text-lg text-ink">Selected work</h2>
          <Link href="/work" className="font-mono text-xs text-muted no-underline hover:text-ink">
            All work →
          </Link>
        </div>

        {projects.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-step-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
        ) : (
          <p className="max-w-measure rounded-lg border border-line bg-panel p-step-4 text-sm text-muted">
            Nothing here yet. Duplicate{" "}
            <code className="font-mono text-accent">projects/_template</code>,
            rename the copy, and it appears here as soon as you save — see{" "}
            <Link href="/guide" className="text-accent">
              the guide
            </Link>
            .
          </p>
        )}
      </section>

      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-3 text-lg text-ink">How this site got built</h2>
        <p className="mb-step-4 max-w-measure text-sm text-ink/85">
          It isn&rsquo;t a template someone else designed. It&rsquo;s a Next.js
          codebase, directed screen by screen and pushed to a live URL in a week.
          The course and the setup guide that got it there are both on this site.
        </p>
        <Link
          href="/guide"
          className="inline-block rounded-lg bg-accent px-step-3 py-step-2 font-mono text-xs text-accent-ink no-underline"
        >
          Read the crash course →
        </Link>
      </section>
    </div>
  );
}
