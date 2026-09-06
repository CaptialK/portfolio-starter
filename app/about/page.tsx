import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { site } from "@/content/site";
import { getAbout } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";

export async function generateMetadata(): Promise<Metadata> {
  const about = getAbout();
  return {
    title: about?.title ?? "About",
    description: about?.intro ?? site.tagline,
  };
}

/**
 * The about page. Everything on it comes from content/about.mdx.
 */
export default async function AboutPage() {
  const about = getAbout();

  if (!about) {
    return (
      <div className="mx-auto max-w-page px-step-4 py-step-5 md:px-step-5">
        <p className="max-w-measure rounded-lg border border-line bg-panel p-step-4 text-sm text-muted">
          Add <code className="font-mono text-accent">content/about.mdx</code> to
          fill this page.
        </p>
      </div>
    );
  }

  const { content } = await compileMDX({
    source: about.body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="border-b border-line py-step-5">
        <h1 className="mb-step-3 max-w-measure text-xl text-ink">
          {about.title}
        </h1>
        <p className="max-w-measure text-md text-ink/85">{about.intro}</p>
      </header>

      <div className="py-step-5">{content}</div>

      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-3 text-lg text-ink">Get in touch</h2>
        <p className="mb-step-3 text-sm">
          <a href={`mailto:${site.email}`} className="text-accent">
            {site.email}
          </a>
        </p>
        <ul className="flex list-none flex-wrap gap-step-3 p-0 font-mono text-xs">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                className="text-muted no-underline hover:text-ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
