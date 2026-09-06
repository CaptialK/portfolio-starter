/**
 * Reads `content/about.mdx` and hands it to the about page.
 *
 * Projects are not here: they live in `projects/<slug>/` and are read by
 * `lib/projects.ts`. One place for projects, one place for the about page.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/* ---------------------------------------------------------------------------
   The about page
   ------------------------------------------------------------------------- */

/** The about page's frontmatter. Just a heading and a one-liner. */
export type About = {
  /** The page heading. */
  title: string;
  /** The sentence under it. */
  intro: string;
  /** The MDX body, unrendered. */
  body: string;
};

/**
 * `content/about.mdx`, or undefined if you've deleted it.
 *
 * Same idea as the case studies: you write Markdown, the page renders it. The
 * frontmatter needs exactly two fields, `title` and `intro`.
 */
export function getAbout(): About | undefined {
  const file = path.join(process.cwd(), "content", "about.mdx");
  if (!fs.existsSync(file)) return undefined;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const front = data as Partial<About>;

  for (const field of ["title", "intro"] as const) {
    if (!front[field]) {
      throw new Error(
        `content/about.mdx is missing "${field}" in its frontmatter.`,
      );
    }
  }

  return { title: front.title!, intro: front.intro!, body: content };
}
