/**
 * One entry in the cookbook at /guide/motion: the live component, what it's
 * for, the code to use it, and where it appears on the site.
 *
 * A Server Component. It renders client components as `demo`, but it doesn't
 * become one itself — the copy and the code snippets ship as HTML.
 */

import Link from "next/link";

export type CookbookEntry = {
  /** Component name, as you'd import it. */
  name: string;
  /** The file it lives in, relative to components/motion/. */
  file: string;
  /** One line: what this is for. */
  purpose: string;
  /** The live thing. */
  demo: React.ReactNode;
  /** The @example block, read from the component's own source at build time. */
  code: string;
  /** Where it's used, or null if it's here for Aaron's pages rather than /guide. */
  usedOn: { href: string; label: string } | null;
};

export function Entry({ entry }: { entry: CookbookEntry }) {
  return (
    <section
      id={entry.name.toLowerCase()}
      className="scroll-mt-step-4 border-t border-line py-step-5"
    >
      <div className="mb-step-4">
        <h2 className="mb-step-2 font-mono text-md text-accent">{entry.name}</h2>
        <p className="max-w-measure text-sm text-ink/85">{entry.purpose}</p>
      </div>

      {/* min-w-0 on both columns: a grid item's default min-width is its
          content's, so an overflow-x-auto <pre> would push the column wider
          than the screen instead of scrolling inside it. */}
      <div className="grid gap-step-4 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="mb-step-2 font-mono text-xs tracking-[0.12em] text-muted uppercase">
            Live
          </h3>
          <div className="min-w-0 rounded-lg border border-line bg-panel p-step-4">
            {entry.demo}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="mb-step-2 font-mono text-xs tracking-[0.12em] text-muted uppercase">
            How to use it
          </h3>
          <pre className="overflow-x-auto rounded-lg border border-line bg-black p-step-4 font-mono text-xs leading-relaxed text-ink/85">
            {entry.code}
          </pre>
        </div>
      </div>

      <p className="mt-step-3 font-mono text-xs text-muted">
        {entry.usedOn ? (
          <>
            Used on{" "}
            <Link href={entry.usedOn.href} className="text-accent">
              {entry.usedOn.label}
            </Link>
          </>
        ) : (
          <>Not used on the course pages — it&rsquo;s here for your own pages.</>
        )}
        <span className="text-line"> · </span>
        <span>components/motion/{entry.file}</span>
      </p>
    </section>
  );
}
