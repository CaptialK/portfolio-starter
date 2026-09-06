import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies: how the work was decided, not just how it turned out.",
};

/**
 * The work index. One card per folder in `projects/`.
 *
 * There is no list to maintain here — add a folder and it appears.
 */
export default function WorkPage() {
  const projects = getProjects();

  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="py-step-5">
        <h1 className="mb-step-3 max-w-measure text-xl text-ink">Work</h1>
        <p className="max-w-measure text-md text-ink/85">
          Every one of these has a decisions section, because that is the part
          worth reading.
        </p>
      </header>

      {projects.length > 0 ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-step-3 p-0 pb-step-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ul>
      ) : (
        <p className="mb-step-6 max-w-measure rounded-lg border border-line bg-panel p-step-4 text-sm text-muted">
          Nothing here yet. Duplicate{" "}
          <code className="font-mono text-accent">projects/_template</code>,
          rename the copy, and it appears on this page as soon as you save.
        </p>
      )}
    </div>
  );
}
