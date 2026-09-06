/**
 * Reads the case studies out of `content/work/` and hands them to the pages.
 *
 * You will almost never need to edit this file. It exists so that adding a
 * case study is a matter of adding one `.mdx` file: no code changes, no list
 * to update, no route to register.
 *
 * A file named `content/work/onboarding-redesign.mdx` becomes the page at
 * `/work/onboarding-redesign`. Files whose name starts with `_` are ignored,
 * which is how `_TEMPLATE.mdx` stays off the site.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** The block at the top of every case study, between the `---` lines. */
export type CaseStudyFrontmatter = {
  /** Shown as the page heading and in the work list. */
  title: string;
  /** Who it was for. A company, a client, a team, or "Personal project". */
  client: string;
  /** Your job on it. "Product design, prototyping" and so on. */
  role: string;
  /** When. Free text: "2025", "Spring 2024", "2023 — 2024". */
  year: string;
  /**
   * One sentence for the work list. What the project was and what changed.
   * This is the line that decides whether anyone opens the case study.
   */
  summary: string;
  /**
   * Which of the three jobs this case study does: process, craft, or outcome.
   * The deck's rule is one of each. The work page groups by this.
   */
  emphasis: "process" | "craft" | "outcome";
  /** Short labels shown under the title. Three or four, not ten. */
  tags?: string[];
  /** Path from `public/`, e.g. "/work/onboarding/cover.jpg". Optional. */
  cover?: string;
  /** Alt text for the cover. Required whenever `cover` is set. */
  coverAlt?: string;
  /** Set to true to keep a study off the site while you're still writing it. */
  draft?: boolean;
  /** Lower numbers come first in the work list. Defaults to 100. */
  order?: number;
};

export type CaseStudy = CaseStudyFrontmatter & {
  /** The file name without `.mdx`. Also the URL. */
  slug: string;
  /** The MDX body, unrendered. */
  body: string;
  /** Rough read time in minutes, from the word count. */
  readingMinutes: number;
};

const WORK_DIR = path.join(process.cwd(), "content", "work");

function readWorkFile(fileName: string): CaseStudy {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(WORK_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const front = data as Partial<CaseStudyFrontmatter>;

  // Fail loudly and specifically. A missing field should tell you which file
  // and which field, not produce a page with "undefined" on it.
  for (const field of [
    "title",
    "client",
    "role",
    "year",
    "summary",
    "emphasis",
  ] as const) {
    if (!front[field]) {
      throw new Error(
        `content/work/${fileName} is missing "${field}" in its frontmatter. ` +
          `Copy the block at the top of content/work/_TEMPLATE.mdx.`,
      );
    }
  }

  if (front.cover && !front.coverAlt) {
    throw new Error(
      `content/work/${fileName} sets "cover" but not "coverAlt". ` +
        `Every image needs alt text describing what it shows.`,
    );
  }

  const words = content.trim().split(/\s+/).length;

  return {
    ...(front as CaseStudyFrontmatter),
    slug,
    body: content,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

/**
 * Every case study, newest-first by `order` then title.
 * Drafts are included only when running `npm run dev`.
 */
export function getCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(WORK_DIR)) return [];

  const showDrafts = process.env.NODE_ENV === "development";

  return fs
    .readdirSync(WORK_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map(readWorkFile)
    .filter((study) => showDrafts || !study.draft)
    .sort(
      (a, b) =>
        (a.order ?? 100) - (b.order ?? 100) || a.title.localeCompare(b.title),
    );
}

/** One case study by slug, or undefined if there's no such file. */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((study) => study.slug === slug);
}

/** The slugs Next.js should build pages for. Used by generateStaticParams. */
export function getCaseStudySlugs(): string[] {
  return getCaseStudies().map((study) => study.slug);
}

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
