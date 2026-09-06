/**
 * Reads `content/crash-course.md` and hands its sections to the guide pages.
 *
 * That file is the only copy of the course text. The pages render what's in it
 * word for word — if a sentence needs changing, it changes there, not in a
 * component. That's why there is no second copy anywhere in the codebase.
 *
 * Sections are marked `## kind: id`, e.g. `## quickstart: steps`, with the
 * visible heading on the `###` line under it.
 */

import fs from "node:fs";
import path from "node:path";

export type CourseSection = {
  /** "quickstart", "setup", "section", "meta", "explore". */
  kind: string;
  /** The bit after the colon: "intro", "folder", "steps". */
  id: string;
  /** The `###` line: what the reader sees as the heading. */
  heading: string;
  /** Everything under it, as Markdown. */
  body: string;
};

const FILE = path.join(process.cwd(), "content", "crash-course.md");

/**
 * Splits the file into sections.
 *
 * This walks line by line rather than splitting on a pattern, because it has to
 * keep track of fenced code blocks. The `quickstart: template` section contains
 * a whole file inside a fence — `---` lines and `## Problem` headings included —
 * and a pattern-based split would tear it in half at the first one.
 */
function parse(): CourseSection[] {
  const lines = fs.readFileSync(FILE, "utf8").split("\n");
  const sections: CourseSection[] = [];
  let current: CourseSection | null = null;
  let body: string[] = [];
  let inFence = false;

  const finish = () => {
    if (current) {
      current.body = body.join("\n").trim();
      sections.push(current);
    }
    body = [];
  };

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      if (current) body.push(line);
      continue;
    }

    if (!inFence) {
      const section = /^##[ \t]+([^#].*)$/.exec(line);
      if (section) {
        finish();
        const [kind, id] = section[1].split(":").map((part) => part.trim());
        current = { kind, id: id || kind, heading: "", body: "" };
        continue;
      }

      // The first ### after a section marker is that section's visible heading.
      const heading = /^###[ \t]+(.+)$/.exec(line);
      if (heading && current && !current.heading && body.join("").trim() === "") {
        current.heading = heading[1].trim();
        continue;
      }

      // `---` is only ever used as a separator between parts of this file.
      if (line.trim() === "---") continue;
    }

    if (current) body.push(line);
  }

  finish();
  return sections;
}

let cache: CourseSection[] | null = null;

/**
 * Cached in production, where the file can't change. Re-read on every request
 * in development, because the dev server only re-runs this module when a
 * module changes — and the Markdown isn't one. Without this, an edit to
 * content/crash-course.md doesn't show until the dev server restarts.
 */
export function getCourseSections(): CourseSection[] {
  if (process.env.NODE_ENV !== "production") return parse();
  cache ??= parse();
  return cache;
}

/** One section, or a loud error naming what was asked for. */
export function getSection(kind: string, id: string): CourseSection {
  const found = getCourseSections().find((s) => s.kind === kind && s.id === id);
  if (!found) {
    throw new Error(
      `content/crash-course.md has no "## ${kind}: ${id}" section. ` +
        `A page is asking for it, so either the heading was renamed or the ` +
        `page needs updating.`,
    );
  }
  return found;
}

/** The contents of every ``` fenced block in a piece of Markdown. */
export function fencedBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  let collecting: string[] | null = null;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      if (collecting) {
        blocks.push(collecting.join("\n"));
        collecting = null;
      } else {
        collecting = [];
      }
      continue;
    }
    collecting?.push(line);
  }

  return blocks;
}

/** Markdown with every fenced block removed, for rendering the prose alone. */
export function withoutFences(markdown: string): string {
  let inFence = false;
  return markdown
    .split("\n")
    .filter((line) => {
      if (line.trimStart().startsWith("```")) {
        inFence = !inFence;
        return false;
      }
      return !inFence;
    })
    .join("\n")
    .trim();
}

export type QuickstartPrompt = {
  /** "A", "B", "C", "D". */
  letter: string;
  /** "write it with me". */
  title: string;
  /** "when you have files but no words yet". */
  when: string;
  /** The prompt itself, and the only thing the Copy button copies. */
  text: string;
};

/**
 * The four prompts out of `quickstart: prompts`.
 *
 * They're meant to be pasted exactly as written, so this pulls them out of the
 * source rather than anyone retyping them. The copyable text is the blockquote
 * only — no heading, no "Prompt A" — so it lands clean in the Claude panel.
 */
export function getQuickstartPrompts(): QuickstartPrompt[] {
  const { body } = getSection("quickstart", "prompts");
  const pattern =
    /^\*\*Prompt ([A-Z]) — ([^*]+)\*\*\s*\(([^)]*)\)\s*\n>\s?(.+)$/gm;

  const prompts: QuickstartPrompt[] = [];
  for (const match of body.matchAll(pattern)) {
    prompts.push({
      letter: match[1],
      title: match[2].trim(),
      when: match[3].trim(),
      text: match[4].trim(),
    });
  }

  if (prompts.length === 0) {
    throw new Error(
      `Couldn't find any prompts in the "quickstart: prompts" section of ` +
        `content/crash-course.md. They need to stay in the form ` +
        `"**Prompt A — title** (when)" followed by a "> " quote.`,
    );
  }

  return prompts;
}

/** The lede paragraph above the prompts. */
export function getPromptsIntro(): string {
  const { body } = getSection("quickstart", "prompts");
  return body.split("\n**Prompt")[0].trim();
}

/* ---------------------------------------------------------------------------
   Turning a section's Markdown into the shapes the course panels need.

   The course text stays plain Markdown so it's readable and editable on its
   own. These read the shapes back out of it — a table, a numbered list, a
   checklist — so a panel can lay them out properly instead of dumping a wall
   of prose. Nothing here rewrites the words.
   ------------------------------------------------------------------------- */

/** The `- key: value` lines in the `meta` section. */
export function getMeta(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of getSection("meta", "meta").body.split("\n")) {
    const match = /^-\s*([\w-]+)\s*:\s*(.+)$/.exec(line.trim());
    if (match) out[match[1]] = match[2].trim();
  }
  return out;
}

export type Row = { cells: string[] };

/** A Markdown pipe table. The `|---|---|` line is dropped. */
export function parseTable(markdown: string): { headers: string[]; rows: Row[] } {
  const lines = markdown
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));

  const cells = (line: string) =>
    line.split("|").slice(1, -1).map((c) => c.trim());

  if (lines.length === 0) return { headers: [], rows: [] };

  return {
    headers: cells(lines[0]),
    rows: lines
      .slice(1)
      .filter((l) => !/^\|[\s:|-]+\|$/.test(l))
      .map((l) => ({ cells: cells(l) })),
  };
}

export type Labelled = { label: string; body: string };

/** `1. **Label** — body` or `1. **Label.** body`. */
export function parseOrdered(markdown: string): Labelled[] {
  const out: Labelled[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^\s*\d+\.\s+\*\*(.+?)\*\*\s*(?:[—–-]\s*)?(.*)$/.exec(line);
    if (match) out.push({ label: match[1].replace(/\.$/, ""), body: match[2].trim() });
  }
  return out;
}

/** `- [ ] **Label** — body`. */
export function parseChecklist(markdown: string): Labelled[] {
  const out: Labelled[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^\s*-\s*\[[ x]\]\s*\*\*(.+?)\*\*\s*(?:[—–-]\s*)?(.*)$/.exec(line);
    if (match) out.push({ label: match[1], body: match[2].trim() });
  }
  return out;
}

/** Plain `- item` lines, ignoring checklists and everything else. */
export function parseBullets(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((l) => /^\s*-\s+(?!\[)(.+)$/.exec(l)?.[1]?.trim())
    .filter((l): l is string => Boolean(l));
}

/** `**Heading**` followed by its own bullets, repeated. */
export function parseGroups(markdown: string): { title: string; items: string[] }[] {
  const groups: { title: string; items: string[] }[] = [];
  for (const line of markdown.split("\n")) {
    const heading = /^\*\*(.+?)\*\*\s*$/.exec(line.trim());
    if (heading) {
      groups.push({ title: heading[1], items: [] });
      continue;
    }
    const bullet = /^\s*-\s+(.+)$/.exec(line);
    if (bullet && groups.length) groups[groups.length - 1].items.push(bullet[1].trim());
  }
  return groups.filter((g) => g.items.length > 0);
}

/** Every `> quoted` line, joined per block. */
export function parseQuotes(markdown: string): string[] {
  const quotes: string[] = [];
  let current: string[] = [];
  for (const line of markdown.split("\n")) {
    const quoted = /^\s*>\s?(.*)$/.exec(line);
    if (quoted) current.push(quoted[1]);
    else if (current.length) {
      quotes.push(current.join(" ").trim());
      current = [];
    }
  }
  if (current.length) quotes.push(current.join(" ").trim());
  return quotes.filter(Boolean);
}

/** Paragraphs that aren't a list, table, quote or fence. */
export function parseProse(markdown: string): string[] {
  return withoutFences(markdown)
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !l.startsWith("|") &&
        !l.startsWith(">") &&
        !l.startsWith("-") &&
        !/^\d+\./.test(l),
    );
}
