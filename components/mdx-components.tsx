import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/**
 * How every tag in a case study's .mdx gets styled.
 *
 * You write plain Markdown; this file decides what a heading, a list, or an
 * image looks like. Change it once here and every case study follows. Nothing
 * in content/work/*.mdx should carry its own styling.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      {...props}
      className="mt-step-5 mb-step-3 max-w-measure text-lg text-ink"
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mt-step-4 mb-step-2 max-w-measure font-sans text-sm font-semibold tracking-normal text-ink"
    />
  ),
  p: (props) => (
    <p {...props} className="mb-step-3 max-w-measure text-sm text-ink/85" />
  ),
  ul: (props) => (
    <ul
      {...props}
      className="mb-step-3 ml-step-4 max-w-measure list-disc text-sm text-ink/85 marker:text-muted"
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="mb-step-3 ml-step-4 max-w-measure list-decimal text-sm text-ink/85 marker:text-muted"
    />
  ),
  li: (props) => <li {...props} className="mb-step-1" />,
  strong: (props) => <strong {...props} className="font-semibold text-ink" />,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-step-4 max-w-measure border-l-2 border-accent pl-step-3 font-display text-md text-ink"
    />
  ),
  hr: () => <hr className="my-step-5 border-0 border-t border-line" />,
  code: (props) => (
    <code
      {...props}
      className="rounded bg-panel px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="my-step-4 overflow-x-auto rounded-lg border border-line bg-black p-step-4 font-mono text-xs"
    />
  ),
  table: (props) => (
    <div className="my-step-4 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-xs" />
    </div>
  ),
  th: (props) => (
    <th
      {...props}
      className="border-b border-line px-step-2 py-step-2 text-left font-mono text-xs tracking-[0.08em] text-muted uppercase"
    />
  ),
  td: (props) => (
    <td
      {...props}
      className="border-b border-line px-step-2 py-step-2 text-left align-top text-ink/85"
    />
  ),

  a: ({ href = "", ...props }) => {
    // Internal links go through <Link> so navigation stays instant.
    if (href.startsWith("/")) {
      return <Link href={href} {...props} className="text-accent" />;
    }
    return (
      <a
        href={href}
        {...props}
        className="text-accent"
        target="_blank"
        rel="noopener noreferrer"
      />
    );
  },

  /**
   * Markdown images become next/image. Give every one a width and height in the
   * alt-text position by writing them into content/work/ as normal Markdown:
   *
   *     ![What the screen shows](/work/onboarding/step-2.png)
   *
   * Images live in public/work/<slug>/.
   */
  img: ({ src = "", alt = "" }) => (
    <figure className="my-step-4">
      <div className="relative overflow-hidden rounded-lg border border-line bg-panel">
        <Image
          src={typeof src === "string" ? src : ""}
          alt={alt}
          width={1600}
          height={1000}
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="h-auto w-full"
        />
      </div>
      {alt && (
        <figcaption className="mt-step-2 text-xs text-muted">{alt}</figcaption>
      )}
    </figure>
  ),

  /**
   * `<Note>…</Note>` in an .mdx file. For an aside that isn't part of the
   * argument: a caveat, a credit, a link to the live thing.
   */
  Note: ({ children }: { children?: React.ReactNode }) => (
    <aside className="my-step-4 max-w-measure rounded-lg border border-line bg-panel p-step-4 text-xs text-muted">
      {children}
    </aside>
  ),
};
