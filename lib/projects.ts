/**
 * Reads the `projects/` folder and hands it to the pages.
 *
 * This is the whole content system. There is no database and no CMS: one folder
 * per project, a `project.md` inside it, and the site notices. Adding a project
 * is duplicating a folder — no code changes, no list to update, no route to
 * register.
 *
 * `projects/onboarding-redesign/` becomes the page at `/work/onboarding-redesign`.
 * Folders whose name starts with `_` are skipped, which is how `_template/`
 * stays off the site.
 *
 * You will almost never need to edit this file.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** The block at the top of every project.md, between the `---` lines. */
export type ProjectFrontmatter = {
  /** Shown as the page heading and on the card. */
  title: string;
  /** Your job on it. "Product designer". */
  role: string;
  /** When. Free text: "2026", "Spring 2024". */
  year: string;
  /** What you used. "Figma, Maze, Notion". */
  tools: string;
  /** One sentence. What it was and what changed. */
  summary: string;
  /** File name of the card image, inside the same folder. Optional. */
  cover?: string;
};

/** One `## Heading` and everything under it. */
export type ProjectSection = {
  heading: string;
  /** The Markdown under that heading. Empty string if nothing was written. */
  body: string;
  /** True when there is nothing under the heading yet. */
  empty: boolean;
};

export type Project = ProjectFrontmatter & {
  /** The folder name. Also the address. */
  slug: string;
  /** Where the card image is served from, or undefined if there isn't one. */
  coverUrl?: string;
  /** The six sections, in order, whether or not they've been written. */
  sections: ProjectSection[];
};

export const PROJECTS_DIR = path.join(process.cwd(), "projects");

/**
 * The shape every project page shows, in this order, even when a section hasn't
 * been written yet. Seeing the empty headings is how you know what's missing.
 *
 * `aliases` catches the spellings people reasonably use for the same thing.
 */
const SHAPE: { heading: string; aliases: string[] }[] = [
  { heading: "Problem", aliases: ["the problem"] },
  { heading: "Constraints", aliases: [] },
  { heading: "What I did", aliases: ["what you did", "what i did"] },
  {
    heading: "Decisions and why",
    aliases: ["decisions & why", "decisions, and why", "decisions why"],
  },
  { heading: "Outcome", aliases: ["outcomes", "the outcome"] },
  { heading: "What I'd change", aliases: ["what you'd change", "what i'd change"] },
];

/** Splits the Markdown body into its `## Heading` chunks. */
function splitSections(markdown: string): Map<string, string> {
  const found = new Map<string, string>();
  // Everything before the first `## ` is ignored: the headings are the shape.
  const parts = markdown.split(/^##[ \t]+(.+)$/m);
  for (let i = 1; i < parts.length; i += 2) {
    found.set(parts[i].trim().toLowerCase(), (parts[i + 1] ?? "").trim());
  }
  return found;
}

function readProject(slug: string): Project {
  const file = path.join(PROJECTS_DIR, slug, "project.md");
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const front = data as Partial<ProjectFrontmatter> & { year?: string | number };

  // Fail loudly and specifically. A missing field should say which folder and
  // which line, not render a page with "undefined" on it.
  for (const field of ["title", "role", "year", "summary"] as const) {
    if (front[field] === undefined || front[field] === "") {
      throw new Error(
        `projects/${slug}/project.md is missing "${field}" at the top. ` +
          `Copy the block from projects/_template/project.md.`,
      );
    }
  }

  const found = splitSections(content);
  const used = new Set<string>();

  const sections: ProjectSection[] = SHAPE.map(({ heading, aliases }) => {
    const key = [heading.toLowerCase(), ...aliases].find((k) => found.has(k));
    if (key) used.add(key);
    const body = key ? found.get(key)! : "";
    return { heading, body, empty: body.length === 0 };
  });

  // Anything the writer added beyond the six is kept, after them.
  for (const [key, body] of found) {
    if (used.has(key)) continue;
    sections.push({
      heading: key.replace(/^./, (c) => c.toUpperCase()),
      body,
      empty: body.length === 0,
    });
  }

  const coverFile = front.cover?.trim();
  const coverExists =
    coverFile && fs.existsSync(path.join(PROJECTS_DIR, slug, coverFile));

  return {
    ...(front as ProjectFrontmatter),
    // YAML reads a bare 2026 as a number; the pages want text.
    year: String(front.year),
    slug,
    coverUrl: coverExists ? mediaUrl(slug, coverFile!) : undefined,
    sections,
  };
}

/**
 * Where a file inside a project folder is served from.
 *
 * `projects/` sits outside `public/`, so the files aren't web-addressable on
 * their own. `app/project-media/[...path]` serves them, and this builds the
 * address for it.
 */
export function mediaUrl(slug: string, relativePath: string): string {
  const clean = relativePath.replace(/^\.?\//, "").split("/").map(encodeURIComponent);
  return `/project-media/${encodeURIComponent(slug)}/${clean.join("/")}`;
}

/** Every project folder name, newest year first, then alphabetical. */
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(PROJECTS_DIR, slug, "project.md")));
}

/** Every project, newest year first, then by title. */
export function getProjects(): Project[] {
  return getProjectSlugs()
    .map(readProject)
    .sort((a, b) => {
      const yearOf = (value: string) => Number(value.match(/\d{4}/)?.[0] ?? 0);
      return yearOf(b.year) - yearOf(a.year) || a.title.localeCompare(b.title);
    });
}

/** One project by folder name, or undefined if there's no such folder. */
export function getProject(slug: string): Project | undefined {
  if (!getProjectSlugs().includes(slug)) return undefined;
  return readProject(slug);
}
