import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { mdxComponents } from "@/components/mdx-components";
import { ProjectImage } from "@/components/project-image";

/**
 * One project page, built from that folder's project.md.
 *
 * The address comes from the folder name. Adding a folder adds a page; there is
 * nothing to register here.
 */

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      images: project.coverUrl ? [project.coverUrl] : undefined,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  // Images inside a project.md are written relative to that project's folder,
  // so they need a component that knows which folder it's reading.
  const components = {
    ...mdxComponents,
    img: (imageProps: { src?: string; alt?: string }) => (
      <ProjectImage slug={slug} {...imageProps} />
    ),
  };

  const sections = await Promise.all(
    project.sections.map(async (section) => ({
      heading: section.heading,
      empty: section.empty,
      content: section.empty
        ? null
        : (
            await compileMDX({
              source: section.body,
              components,
              options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
            })
          ).content,
    })),
  );

  const meta = [
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
    { label: "Tools", value: project.tools },
  ].filter((row) => row.value);

  return (
    <article className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="border-b border-line py-step-5">
        <h1 className="mb-step-3 max-w-measure text-xl text-ink">
          {project.title}
        </h1>
        <p className="mb-step-4 max-w-measure text-md text-ink/85">
          {project.summary}
        </p>

        <dl className="grid grid-cols-2 gap-step-3 font-mono text-xs sm:grid-cols-3">
          {meta.map((row) => (
            <div key={row.label}>
              <dt className="text-muted">{row.label}</dt>
              <dd className="m-0 text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {project.coverUrl && (
        <div className="relative my-step-5 aspect-[16/9] overflow-hidden rounded-lg border border-line bg-panel">
          <Image
            src={project.coverUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="py-step-5">
        {sections.map((section) => (
          <section key={section.heading} className="mb-step-5">
            <h2 className="mt-step-5 mb-step-3 max-w-measure text-lg text-ink">
              {section.heading}
            </h2>
            {section.content ?? (
              // The shape shows even when the words don't exist yet, so it's
              // obvious what's still to write.
              <p className="max-w-measure font-mono text-xs text-muted">
                Not written yet.
              </p>
            )}
          </section>
        ))}
      </div>

      <footer className="border-t border-line py-step-5">
        <Link href="/work" className="font-mono text-xs text-accent no-underline">
          ← All work
        </Link>
      </footer>
    </article>
  );
}
