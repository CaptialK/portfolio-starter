import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { guideIsVisible } from "@/lib/guide";

/** Beyond this many, the homepage sends people to /work for the rest. */
const ON_THE_HOMEPAGE = 6;

/**
 * The homepage: the work, immediately.
 *
 * No introduction. Anyone opening a portfolio already knows whose it is —
 * they came from a CV, a link, or a name they were given — so a paragraph
 * about yourself above the fold spends their attention before showing them
 * anything. Your name is in the header, your email is in the footer, and the
 * about page is one click away for the people who want it.
 *
 * What's left is the only thing that actually argues for you.
 */
export default function Home() {
  const projects = getProjects();
  const shown = projects.slice(0, ON_THE_HOMEPAGE);

  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <section className="bg-grid -mx-step-4 px-step-4 pt-step-6 pb-step-5 md:-mx-step-5 md:px-step-5">
        <div data-reveal>
          <h1 className="text-2xl text-ink">Work</h1>
        </div>
      </section>

      <section className="pb-step-5">
        {shown.length > 0 ? (
          <>
            <ul className="m-0 grid list-none grid-cols-1 gap-step-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>

            {projects.length > shown.length && (
              <p className="mt-step-4">
                <Link
                  href="/work"
                  className="font-mono text-xs text-muted no-underline hover:text-ink"
                >
                  All {projects.length} projects →
                </Link>
              </p>
            )}
          </>
        ) : (
          <p className="max-w-measure rounded-lg border border-line bg-panel p-step-4 text-sm text-muted">
            Nothing here yet. Duplicate{" "}
            <code className="font-mono text-accent">projects/_template</code>,
            rename the copy, and it appears here as soon as you save
            {guideIsVisible ? (
              <>
                {" "}
                — see{" "}
                <Link href="/guide" className="text-accent">
                  the guide
                </Link>
              </>
            ) : null}
            .
          </p>
        )}
      </section>

      {/* Scaffolding, like the guide itself: it goes when the guide goes, so
          the homepage can never point at a page that isn't there. */}
      {guideIsVisible && (
        <section className="border-t border-line py-step-5">
          <h2 className="mb-step-3 text-lg text-ink">How this site got built</h2>
          <p className="mb-step-4 max-w-measure text-sm text-ink/85">
            It isn&rsquo;t a template someone else designed. It&rsquo;s a real
            project, directed screen by screen and put online in a week. The
            course and the setup walkthrough that got it there are both on this
            site.
          </p>
          <Link
            href="/guide"
            className="inline-block rounded-lg bg-accent px-step-3 py-step-2 font-mono text-xs text-accent-ink no-underline"
          >
            Read the crash course →
          </Link>
        </section>
      )}
    </div>
  );
}
