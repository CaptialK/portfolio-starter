import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";

/**
 * One case study.
 *
 * The URL comes from the file name in content/work/. Adding a file adds a page;
 * there is nothing to register here.
 */

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    openGraph: {
      type: "article",
      title: study.title,
      description: study.summary,
      images: study.cover ? [study.cover] : undefined,
    },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const { content } = await compileMDX({
    source: study.body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <article className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="border-b border-line py-step-5">
        <p className="mb-step-3 font-mono text-xs tracking-[0.12em] text-accent uppercase">
          {study.emphasis}
        </p>
        <h1 className="mb-step-3 max-w-measure text-xl text-ink">
          {study.title}
        </h1>
        <p className="mb-step-4 max-w-measure text-md text-ink/85">
          {study.summary}
        </p>

        <dl className="grid grid-cols-2 gap-step-3 font-mono text-xs sm:grid-cols-4">
          <div>
            <dt className="text-muted">Client</dt>
            <dd className="m-0 text-ink">{study.client}</dd>
          </div>
          <div>
            <dt className="text-muted">Role</dt>
            <dd className="m-0 text-ink">{study.role}</dd>
          </div>
          <div>
            <dt className="text-muted">Year</dt>
            <dd className="m-0 text-ink">{study.year}</dd>
          </div>
          <div>
            <dt className="text-muted">Read</dt>
            <dd className="m-0 text-ink">{study.readingMinutes} min</dd>
          </div>
        </dl>

        {study.tags && study.tags.length > 0 && (
          <ul className="mt-step-3 flex list-none flex-wrap gap-step-2 p-0">
            {study.tags.map((tag) => (
              <li
                key={tag}
                className="rounded border border-line px-step-2 py-step-1 font-mono text-xs text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      {study.cover && (
        <div className="relative my-step-5 aspect-[16/9] overflow-hidden rounded-lg border border-line bg-panel">
          <Image
            src={study.cover}
            alt={study.coverAlt ?? ""}
            fill
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="py-step-5">{content}</div>

      <footer className="border-t border-line py-step-5">
        <Link href="/work" className="font-mono text-xs text-accent no-underline">
          ← All work
        </Link>
      </footer>
    </article>
  );
}
