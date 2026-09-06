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

export function getCourseSections(): CourseSection[] {
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
